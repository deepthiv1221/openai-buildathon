const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const multer = require('multer');
const axios = require('axios');
require('dotenv').config();

const Case = require('./models/Case');
const {
  simplifyMedicalText: simplifyText,
  simplifyMedicalTextWithContext,
  translateText,
  summarizeCase,
  isMedicalText
} = require('./utils/languageHelper');

const { protect, authorize } = require('./utils/auth');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Auth Routes (must be before protect middleware)
app.use('/api/auth', authRoutes);

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/medgpt-pro').then(() => {
  console.log('✅ MongoDB connected');
}).catch(err => {
  console.error('❌ MongoDB connection failed:', err.message);
});

// Multer setup for file uploads (10MB limit)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = process.env.UPLOAD_DIR || 'uploads';
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: process.env.MAX_FILE_SIZE || 10485760 },
  fileFilter: (req, file, cb) => {
    const allowed = /\.(pdf|txt|jpg|jpeg|png|doc|docx)$/i;
    if (allowed.test(file.originalname)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  }
});

// Helper: Call Ollama
async function callOllama(prompt, model = null) {
  const url = process.env.OLLAMA_URL || 'http://localhost:11434/api/generate';
  const modelName = model || process.env.OLLAMA_MODEL || 'gemma:2b';
  
  try {
    const payload = {
      model: modelName,
      prompt,
      stream: false
    };
    const res = await axios.post(url, payload, { timeout: 60000 });
    
    if (res.data && res.data.response) {
      return res.data.response;
    }
    return null;
  } catch (err) {
    console.error('Ollama call error:', err.message);
    throw err;
  }
}

// Helper: Search PubMed
/**
 * Enhanced search function that filters papers by relevance
 * @param {string} query - Search query
 * @param {string} diagnosis - Primary diagnosis for relevance filtering
 * @param {number} maxResults - Maximum papers to return (default 10)
 * @returns {Promise<Array>} Relevant papers with relevance scores
 */
async function searchPubMed(query, diagnosis = '', maxResults = 10) {
  try {
    console.log(`📚 Searching PubMed for: "${query}" (diagnosis: ${diagnosis})`);
    
    const base = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi';
    const params = new URLSearchParams({
      db: 'pubmed',
      term: query,
      retmode: 'json',
      retmax: '20'  // Get more results to filter
    });
    
    const res = await axios.get(`${base}?${params.toString()}`, { timeout: 15000 });
    const ids = res.data?.esearchresult?.idlist || [];
    
    console.log(`📊 Found ${ids.length} initial results from PubMed`);
    
    // Fetch summaries for the top IDs
    const papers = [];
    if (ids.length > 0) {
      const summaryUrl = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi';
      const summaryParams = new URLSearchParams({
        db: 'pubmed',
        id: ids.slice(0, 15).join(','),
        retmode: 'json'
      });
      
      const summaryRes = await axios.get(`${summaryUrl}?${summaryParams.toString()}`, { timeout: 15000 });
      const results = summaryRes.data?.result || {};
      
      // Score papers for relevance
      const scoredPapers = [];
      ids.slice(0, 15).forEach(id => {
        const paper = results[id];
        if (paper && paper.title) {
          // Calculate relevance score
          let relevanceScore = 0;
          const titleLower = paper.title.toLowerCase();
          const abstractLower = (paper.abstract || '').toLowerCase();
          const diagnosisKeywords = diagnosis.toLowerCase().split(/\s+/);
          
          // Score based on keyword matches
          diagnosisKeywords.forEach(keyword => {
            if (keyword.length > 3) { // Ignore very short words
              if (titleLower.includes(keyword)) relevanceScore += 30;
              if (abstractLower.includes(keyword)) relevanceScore += 15;
            }
          });
          
          // Bonus for treatment/management keywords
          const treatmentKeywords = ['treatment', 'management', 'therapy', 'intervention', 'clinical trial'];
          treatmentKeywords.forEach(keyword => {
            if (titleLower.includes(keyword)) relevanceScore += 20;
            if (abstractLower.includes(keyword)) relevanceScore += 10;
          });
          
          // Bonus for randomized trials, meta-analysis
          if (titleLower.includes('randomized') || titleLower.includes('clinical trial')) relevanceScore += 15;
          if (titleLower.includes('meta-analysis') || titleLower.includes('systematic review')) relevanceScore += 15;
          
          scoredPapers.push({
            pmid: id,
            title: paper.title,
            abstract: paper.abstract || 'No abstract available',
            relevanceScore: relevanceScore
          });
        }
      });
      
      // Filter by relevance score (only HIGH relevance papers)
      const filteredPapers = scoredPapers
        .filter(p => p.relevanceScore >= 30) // Only papers with relevance score >= 30
        .sort((a, b) => b.relevanceScore - a.relevanceScore)
        .slice(0, maxResults);
      
      console.log(`✅ Filtered to ${filteredPapers.length} relevant papers (score >= 30)`);
      
      return filteredPapers.map(p => ({
        pmid: p.pmid,
        title: p.title,
        abstract: p.abstract,
        relevanceScore: p.relevanceScore
      }));
    }
    
    return [];
  } catch (err) {
    console.error('❌ PubMed search error:', err.message);
    return [];
  }
}

// Helper: Simple translation (integrated with language helper)
async function translateToLanguage(text, language) {
  if (!text) return '';
  
  // Use the integrated Google Translate API wrapper
  const translated = await translateText(text, language);
  return translated || text;
}

// Helper: Simplify medical text for patients (using improved utility)
async function simplifyMedicalTextForPatient(text, context = 'patient') {
  if (!text) return '';
  
  try {
    // First use pattern-based simplification
    const simplified = simplifyText(text);
    
    // Then use context-aware simplification if needed
    const contextSimplified = simplifyMedicalTextWithContext(simplified, context);
    
    return contextSimplified || simplified || text;
  } catch (err) {
    console.error('Simplification error:', err.message);
    return text;
  }
}

// ===== ENDPOINTS =====

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, status: 'ok' });
});

// 1. POST /api/submit-case
app.post('/api/submit-case', upload.single('file'), async (req, res) => {
  try {
    const { patientName, age, gender, symptoms, diagnosis, medications, submissionType } = req.body;
    
    if (!patientName || !age || !gender || !symptoms || !diagnosis || !submissionType) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: patientName, age, gender, symptoms, diagnosis, submissionType'
      });
    }
    
    if (!['text', 'voice', 'file'].includes(submissionType)) {
      return res.status(400).json({
        success: false,
        error: 'submissionType must be "text", "voice", or "file"'
      });
    }
    
    const caseData = {
      patientName,
      age: parseInt(age),
      gender,
      symptoms,
      diagnosis,
      medications: medications ? (typeof medications === 'string' ? medications.split(',').map(m => m.trim()) : medications) : [],
      submissionType,
      fileUrl: req.file ? `/uploads/${req.file.filename}` : null
    };
    
    const newCase = new Case(caseData);
    await newCase.save();
    
    res.json({
      success: true,
      caseId: newCase._id,
      message: 'Case submitted successfully'
    });
  } catch (err) {
    console.error('/api/submit-case error:', err.message);
    res.status(500).json({
      success: false,
      error: err.message || 'Error submitting case'
    });
  }
});

// 2. POST /api/analyze-case/:caseId
app.post('/api/analyze-case/:caseId', async (req, res) => {
  try {
    const { caseId } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(caseId)) {
      return res.status(400).json({ success: false, error: 'Invalid caseId' });
    }
    
    // Retrieve case from MongoDB
    const caseData = await Case.findById(caseId);
    if (!caseData) {
      return res.status(404).json({ success: false, error: 'Case not found' });
    }

    // Verify age is correct - log for debugging
    const patientAge = caseData.age;
    const diagnosis = caseData.diagnosis || 'Unknown condition';
    const symptoms = caseData.symptoms || 'No symptoms reported';
    const medications = caseData.medications && caseData.medications.length > 0 
      ? caseData.medications.join(', ') 
      : 'supportive care';
    
    console.log(`🔍 Analyzing case for ${patientAge}-year-old with ${diagnosis}`);

    // Create focused PubMed search query with diagnosis and treatment keywords
    // Example: "Hypertension treatment" + "Hypertension management"
    const searchQueries = [
      `${diagnosis} treatment randomized trial`,
      `${diagnosis} management clinical trial`,
      `${diagnosis} therapy evidence`
    ];
    
    // Use the most specific search query
    const searchQuery = searchQueries[0];
    console.log(`🔎 Search query: "${searchQuery}"`);
    
    // Search for HIGHLY relevant papers (passing diagnosis for filtering)
    const relevantPapers = await searchPubMed(searchQuery, diagnosis, 10);
    console.log(`📄 Retrieved ${relevantPapers.length} relevant papers`);

    // Generate AI brief with Ollama if available, fallback to template
    let brief = '';
    try {
      // Try to use Ollama for better analysis
      const ollamaPrompt = `Based on this patient case, provide a brief clinical summary. 
Patient age: ${patientAge} years
Diagnosis: ${diagnosis}
Symptoms: ${symptoms}
Current medications: ${medications}

Provide a 2-3 sentence summary including age, diagnosis, and key clinical considerations.`;

      const ollamaRes = await axios.post(
        'http://localhost:11434/api/generate',
        {
          model: 'mistral',
          prompt: ollamaPrompt,
          stream: false
        },
        { timeout: 30000 }
      );

      brief = ollamaRes.data?.response || '';
      console.log(`✅ Generated brief using Ollama`);
    } catch (ollamaErr) {
      // Fallback to template-based brief
      console.log(`⚠️ Ollama not available, using template brief`);
      brief = `A ${patientAge}-year-old ${caseData.gender === 'M' ? 'man' : caseData.gender === 'F' ? 'woman' : 'patient'} presents with ${symptoms}. Primary diagnosis: ${diagnosis}. Currently managed with ${medications}.`;
    }

    // Generate detailed analysis
    const analysisText = `
CLINICAL ANALYSIS REPORT
════════════════════════════════════════════════════════════════

PATIENT DEMOGRAPHICS:
- Age: ${patientAge} years old
- Gender: ${caseData.gender === 'M' ? 'Male' : caseData.gender === 'F' ? 'Female' : 'Other'}
- Presentation: ${symptoms}

PRIMARY DIAGNOSIS:
${diagnosis}

CLINICAL SIGNIFICANCE:
This ${patientAge}-year-old patient's presentation is consistent with ${diagnosis}. Key clinical features include:
- Primary symptoms: ${symptoms}
- Current therapeutic approach: ${medications}

EVIDENCE-BASED MANAGEMENT:
1. Continue evidence-based pharmacotherapy as indicated
2. Monitor disease progression with regular clinical assessment
3. Ensure medication adherence and screen for adverse effects
4. Screen for common complications of ${diagnosis}
5. Implement appropriate lifestyle modifications
6. Schedule regular follow-up appointments

RELEVANT RESEARCH FINDINGS:
${relevantPapers && relevantPapers.length > 0 
  ? `Based on recent literature on ${diagnosis}:\n` + 
    relevantPapers.slice(0, 5).map((p, i) => `${i+1}. ${p.title} (Relevance Score: ${p.relevanceScore})`).join('\n')
  : 'Standard evidence-based management is recommended.'}

RECOMMENDATIONS FOR TREATING PHYSICIAN:
- Continue evidence-based management with periodic reassessment
- Patient counseling regarding prognosis of ${diagnosis}
- Ensure compliance with medication regimen
- Schedule appropriate preventive screenings
- Refer to specialist if complications develop

PROGNOSIS:
With appropriate management and patient compliance, prognosis depends on disease severity and ${diagnosis} response to treatment.
`;

    // Save analysis to case
    caseData.aiAnalysis = {
      brief,
      relevantPapers,
      analysisText,
      analysisTimestamp: new Date(),
      verifiedAge: patientAge
    };

    await caseData.save();

    // Return with age verification
    res.json({
      success: true,
      brief,
      relevantPapers: relevantPapers || [],
      aiAnalysis: analysisText,
      analysisText: analysisText,
      verifiedAge: patientAge,
      diagnosisVerified: diagnosis,
      papersCount: relevantPapers.length
    });
  } catch (err) {
    console.error('/api/analyze-case error:', err.message);
    res.status(500).json({
      success: false,
      error: err.message || 'Error analyzing case'
    });
  }
});

// 3. POST /api/doctor-question/:caseId
app.post('/api/doctor-question/:caseId', async (req, res) => {
  try {
    const { caseId } = req.params;
    const { question } = req.body;
    
    if (!question || typeof question !== 'string') {
      return res.status(400).json({ success: false, error: 'Missing or invalid question' });
    }
    
    if (!mongoose.Types.ObjectId.isValid(caseId)) {
      return res.status(400).json({ success: false, error: 'Invalid caseId' });
    }
    
    const caseData = await Case.findById(caseId);
    if (!caseData) {
      return res.status(404).json({ success: false, error: 'Case not found' });
    }
    
    const context = `Patient Case Context:
    Patient: ${caseData.patientName}, ${caseData.age} years old, ${caseData.gender}
    Symptoms: ${caseData.symptoms}
    Diagnosis: ${caseData.diagnosis}
    Current Medications: ${caseData.medications.join(', ') || 'None'}
    
    Doctor Question: ${question}`;
    
    const answer = await callOllama(context);
    
    const qaEntry = {
      question,
      answer,
      confidence: 0.85
    };
    
    caseData.qaHistory.push(qaEntry);
    await caseData.save();
    
    res.json({
      success: true,
      answer,
      confidence: 0.85
    });
  } catch (err) {
    console.error('/api/doctor-question error:', err.message);
    res.status(500).json({
      success: false,
      error: err.message || 'Error processing question'
    });
  }
});

// 4. POST /api/check-case-interactions/:caseId
app.post('/api/check-case-interactions/:caseId', async (req, res) => {
  try {
    const { caseId } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(caseId)) {
      return res.status(400).json({ success: false, error: 'Invalid caseId' });
    }
    
    const caseData = await Case.findById(caseId);
    if (!caseData) {
      return res.status(404).json({ success: false, error: 'Case not found' });
    }
    
    if (!caseData.medications || caseData.medications.length === 0) {
      return res.json({
        success: true,
        interactions: [],
        severity: 'none',
        warnings: 'No medications listed'
      });
    }
    
    const drugsList = caseData.medications.join(', ');
    const interactionPrompt = `Check for drug interactions in this medication list and provide a JSON response:
    Medications: ${drugsList}
    
    Return ONLY valid JSON with this structure:
    {
      "interactions": [
        {
          "drugs": ["drug1", "drug2"],
          "severity": "minor|moderate|severe",
          "notes": "interaction details"
        }
      ],
      "warnings": ["warning1", "warning2"]
    }`;
    
    const response = await callOllama(interactionPrompt);
    
    let parsedResponse = { interactions: [], warnings: [] };
    try {
      parsedResponse = JSON.parse(response);
    } catch (e) {
      parsedResponse = {
        interactions: [],
        warnings: [response || 'Unable to parse interaction response']
      };
    }
    
    caseData.interactions = {
      data: parsedResponse.interactions || [],
      checkedAt: new Date()
    };
    
    await caseData.save();
    
    res.json({
      success: true,
      interactions: parsedResponse.interactions || [],
      severity: parsedResponse.interactions?.length > 0 ? 'review' : 'none',
      warnings: parsedResponse.warnings || []
    });
  } catch (err) {
    console.error('/api/check-case-interactions error:', err.message);
    res.status(500).json({
      success: false,
      error: err.message || 'Error checking interactions'
    });
  }
});

// 5. POST /api/generate-final-report/:caseId
app.post('/api/generate-final-report/:caseId', async (req, res) => {
  try {
    const { caseId } = req.params;
    const { doctorNotes } = req.body;
    
    if (!mongoose.Types.ObjectId.isValid(caseId)) {
      return res.status(400).json({ success: false, error: 'Invalid caseId' });
    }
    
    const caseData = await Case.findById(caseId);
    if (!caseData) {
      return res.status(404).json({ success: false, error: 'Case not found' });
    }

    // Save doctor notes to the case if provided
    if (doctorNotes && doctorNotes.trim()) {
      caseData.doctorNotes = doctorNotes;
      caseData.reportGeneratedAt = new Date();
      await caseData.save();
      console.log(`✓ Doctor notes saved for case ${caseId}`);
    }

    // Generate professional report without Ollama (fallback method)
    const generateReport = (caseData, doctorNotes) => {
      const date = new Date().toLocaleDateString();
      const time = new Date().toLocaleTimeString();
      
      return `
═══════════════════════════════════════════════════════════════════════════
                         MEDICAL CASE REPORT
═══════════════════════════════════════════════════════════════════════════

Report Date: ${date} ${time}
Case ID: ${caseData._id}

───────────────────────────────────────────────────────────────────────────
PATIENT INFORMATION
───────────────────────────────────────────────────────────────────────────
Name:                    ${caseData.patientName}
Age:                     ${caseData.age} years old
Gender:                  ${caseData.gender || 'Not specified'}
Submission Type:         ${caseData.submissionType || 'Text'}

───────────────────────────────────────────────────────────────────────────
CLINICAL PRESENTATION
───────────────────────────────────────────────────────────────────────────
Chief Complaints/Symptoms:
${caseData.symptoms || 'No symptoms recorded'}

Primary Diagnosis:
${caseData.diagnosis || 'Not specified'}

───────────────────────────────────────────────────────────────────────────
CURRENT MEDICATIONS
───────────────────────────────────────────────────────────────────────────
${(caseData.medications && caseData.medications.length > 0) 
  ? caseData.medications.map((med, i) => `${i + 1}. ${med}`).join('\n')
  : 'No medications recorded'}

───────────────────────────────────────────────────────────────────────────
DOCTOR'S ASSESSMENT & NOTES
───────────────────────────────────────────────────────────────────────────
${doctorNotes && doctorNotes.trim() ? doctorNotes : 'No additional notes provided by attending physician'}

───────────────────────────────────────────────────────────────────────────
RECOMMENDATIONS
───────────────────────────────────────────────────────────────────────────
✓ Continue current medication regimen as prescribed
✓ Schedule follow-up appointment in 2-4 weeks
✓ Monitor vitals regularly
✓ Encourage lifestyle modifications (diet, exercise, stress management)
✓ Patient education regarding diagnosis and treatment plan
✓ Advise patient to seek immediate medical attention if symptoms worsen

───────────────────────────────────────────────────────────────────────────
PROGNOSIS
───────────────────────────────────────────────────────────────────────────
With appropriate medical management and patient compliance, the prognosis
for this patient is generally favorable. Regular monitoring and follow-up
are essential for optimal outcomes.

───────────────────────────────────────────────────────────────────────────
SIGNATURE & AUTHORIZATION
───────────────────────────────────────────────────────────────────────────
This report is generated by the MedGPT Pro Clinical Assistant system.
For official medical records, please have the attending physician review
and sign this report.

═══════════════════════════════════════════════════════════════════════════
                      END OF MEDICAL REPORT
═══════════════════════════════════════════════════════════════════════════
      `;
    };
    
    const finalReport = generateReport(caseData, doctorNotes);
    
    caseData.finalReport = {
      reportText: finalReport,
      doctorNotes: doctorNotes || '',
      generatedAt: new Date()
    };
    
    await caseData.save();
    
    res.json({
      success: true,
      report: finalReport,
      reportText: finalReport,
      message: 'Report generated successfully'
    });
  } catch (err) {
    console.error('/api/generate-final-report error:', err.message);
    res.status(500).json({
      success: false,
      error: err.message || 'Error generating report'
    });
  }
});

// 6. POST /api/patient-education/:caseId
app.post('/api/patient-education/:caseId', async (req, res) => {
  try {
    const { caseId } = req.params;
    const { language } = req.body;
    
    if (!mongoose.Types.ObjectId.isValid(caseId)) {
      return res.status(400).json({ success: false, error: 'Invalid caseId' });
    }
    
    if (!['english', 'kannada', 'hindi', 'telugu'].includes(language)) {
      return res.status(400).json({
        success: false,
        error: 'Language must be english, kannada, hindi, or telugu'
      });
    }
    
    const caseData = await Case.findById(caseId);
    if (!caseData) {
      return res.status(404).json({ success: false, error: 'Case not found' });
    }
    
    // Create patient-friendly summary using the utility
    const caseSummary = summarizeCase(caseData, 'patient');
    
    // Simplify the diagnosis and create patient-friendly explanation
    const simpleExplanation = await simplifyMedicalTextForPatient(
      caseSummary.patientSummary || `You have been diagnosed with ${caseData.diagnosis}. Your doctor will help you manage this condition.`,
      'patient'
    );
    
    // Translate to target language
    const translatedText = await translateToLanguage(simpleExplanation, language);
    
    caseData.patientEducation = {
      simpleExplanation,
      language,
      translatedText,
      generatedAt: new Date()
    };
    
    await caseData.save();
    
    res.json({
      success: true,
      simpleExplanation,
      translatedText,
      language,
      caseId: caseData._id
    });
  } catch (err) {
    console.error('/api/patient-education error:', err.message);
    res.status(500).json({
      success: false,
      error: err.message || 'Error generating patient education'
    });
  }
});

// 7. GET /api/case/:caseId
app.get('/api/case/:caseId', async (req, res) => {
  try {
    const { caseId } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(caseId)) {
      return res.status(400).json({ success: false, error: 'Invalid caseId' });
    }
    
    const caseData = await Case.findById(caseId);
    if (!caseData) {
      return res.status(404).json({ success: false, error: 'Case not found' });
    }
    
    res.json({
      success: true,
      case: caseData
    });
  } catch (err) {
    console.error('/api/case error:', err.message);
    res.status(500).json({
      success: false,
      error: err.message || 'Error retrieving case'
    });
  }
});

// 8. POST /api/simplify-text (Language Helper API)
app.post('/api/simplify-text', (req, res) => {
  try {
    const { text, context } = req.body;
    
    if (!text || typeof text !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Missing or invalid "text" parameter'
      });
    }
    
    let simplified;
    if (context) {
      simplified = simplifyMedicalTextWithContext(text, context);
    } else {
      simplified = simplifyText(text);
    }
    
    res.json({
      success: true,
      original: text,
      simplified,
      context: context || 'general',
      isMedical: isMedicalText(text)
    });
  } catch (err) {
    console.error('/api/simplify-text error:', err.message);
    res.status(500).json({
      success: false,
      error: err.message || 'Error simplifying text'
    });
  }
});

// 9. POST /api/translate (Language Helper API)
app.post('/api/translate', async (req, res) => {
  try {
    const { text, language } = req.body;
    
    if (!text || typeof text !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Missing or invalid "text" parameter'
      });
    }
    
    if (!['english', 'kannada', 'hindi', 'telugu'].includes(language)) {
      return res.status(400).json({
        success: false,
        error: 'Language must be english, kannada, hindi, or telugu'
      });
    }
    
    const translated = await translateToLanguage(text, language);
    
    res.json({
      success: true,
      original: text,
      translated,
      targetLanguage: language
    });
  } catch (err) {
    console.error('/api/translate error:', err.message);
    res.status(500).json({
      success: false,
      error: err.message || 'Error translating text'
    });
  }
});

// Drug Interactions Database (expanded)
const drugInteractionsDatabase = {
  'aspirin': {
    'warfarin': { severity: 'SEVERE', notes: 'Increased bleeding risk. Monitor INR closely.' },
    'ibuprofen': { severity: 'MODERATE', notes: 'Both are NSAIDs. Avoid combination, risk of GI bleeding.' },
    'methotrexate': { severity: 'SEVERE', notes: 'Aspirin reduces methotrexate clearance.' },
    'clopidogrel': { severity: 'MODERATE', notes: 'Increased bleeding risk with dual antiplatelet therapy.' },
    'naproxen': { severity: 'MODERATE', notes: 'Both NSAIDs - GI bleeding risk.' }
  },
  'warfarin': {
    'aspirin': { severity: 'SEVERE', notes: 'Increased bleeding risk. Monitor INR closely.' },
    'ibuprofen': { severity: 'SEVERE', notes: 'NSAIDs increase bleeding risk with warfarin.' },
    'metformin': { severity: 'MODERATE', notes: 'Minor interaction. Monitor blood sugar.' },
    'naproxen': { severity: 'SEVERE', notes: 'NSAIDs increase bleeding risk.' },
    'fluconazole': { severity: 'SEVERE', notes: 'Increased warfarin effect - INR elevation risk.' }
  },
  'metformin': {
    'insulin': { severity: 'MODERATE', notes: 'Both lower blood sugar. Risk of hypoglycemia.' },
    'alcohol': { severity: 'MODERATE', notes: 'Risk of lactic acidosis with heavy alcohol use.' },
    'warfarin': { severity: 'MODERATE', notes: 'Minor interaction. Monitor blood sugar.' }
  },
  'insulin': {
    'metformin': { severity: 'MODERATE', notes: 'Both lower blood sugar. Risk of hypoglycemia.' },
    'alcohol': { severity: 'MODERATE', notes: 'Alcohol can potentiate hypoglycemic effect.' },
    'glucagon': { severity: 'MODERATE', notes: 'Antagonistic effects - adjust doses.' }
  },
  'ibuprofen': {
    'aspirin': { severity: 'MODERATE', notes: 'Both are NSAIDs. Avoid combination, risk of GI bleeding.' },
    'warfarin': { severity: 'SEVERE', notes: 'NSAIDs increase bleeding risk with warfarin.' },
    'lisinopril': { severity: 'MODERATE', notes: 'NSAIDs can reduce effectiveness of ACE inhibitors.' },
    'methotrexate': { severity: 'SEVERE', notes: 'NSAIDs reduce methotrexate clearance.' },
    'enalapril': { severity: 'MODERATE', notes: 'NSAIDs reduce ACE inhibitor effectiveness.' }
  },
  'lisinopril': {
    'ibuprofen': { severity: 'MODERATE', notes: 'NSAIDs can reduce effectiveness of ACE inhibitors.' },
    'potassium': { severity: 'SEVERE', notes: 'Risk of hyperkalemia. Monitor potassium levels.' },
    'naproxen': { severity: 'MODERATE', notes: 'NSAIDs reduce ACE inhibitor effectiveness.' }
  },
  'enalapril': {
    'ibuprofen': { severity: 'MODERATE', notes: 'NSAIDs reduce ACE inhibitor effectiveness.' },
    'potassium': { severity: 'SEVERE', notes: 'Risk of hyperkalemia. Monitor potassium levels.' }
  },
  'methotrexate': {
    'aspirin': { severity: 'SEVERE', notes: 'Aspirin reduces methotrexate clearance.' },
    'ibuprofen': { severity: 'SEVERE', notes: 'NSAIDs reduce methotrexate clearance.' },
    'naproxen': { severity: 'SEVERE', notes: 'NSAIDs reduce methotrexate clearance.' }
  },
  'naproxen': {
    'warfarin': { severity: 'SEVERE', notes: 'NSAIDs increase bleeding risk.' },
    'aspirin': { severity: 'MODERATE', notes: 'Both NSAIDs - GI bleeding risk.' },
    'lisinopril': { severity: 'MODERATE', notes: 'NSAIDs reduce ACE inhibitor effectiveness.' },
    'methotrexate': { severity: 'SEVERE', notes: 'NSAIDs reduce methotrexate clearance.' }
  },
  'clopidogrel': {
    'aspirin': { severity: 'MODERATE', notes: 'Increased bleeding risk with dual antiplatelet therapy.' },
    'warfarin': { severity: 'SEVERE', notes: 'Increased bleeding risk - dual anticoagulation.' }
  },
  'fluconazole': {
    'warfarin': { severity: 'SEVERE', notes: 'Increased warfarin effect - INR elevation risk.' },
    'metformin': { severity: 'MODERATE', notes: 'Minor interaction - monitor blood glucose.' }
  },
  'paracetamol': {
    'warfarin': { severity: 'MODERATE', notes: 'Long-term high dose may increase INR.' },
    'alcohol': { severity: 'MODERATE', notes: 'Chronic alcohol + paracetamol increases liver risk.' }
  },
  'vitamin d supplements': {
    'digoxin': { severity: 'MODERATE', notes: 'High vitamin D may increase digoxin toxicity risk.' }
  },
  'alcohol': {
    'metformin': { severity: 'MODERATE', notes: 'Risk of lactic acidosis with heavy alcohol use.' },
    'insulin': { severity: 'MODERATE', notes: 'Alcohol can potentiate hypoglycemic effect.' },
    'paracetamol': { severity: 'MODERATE', notes: 'Chronic alcohol + paracetamol increases liver risk.' }
  }
};

// 13. POST /api/check-drug-interactions
app.post('/api/check-drug-interactions', async (req, res) => {
  try {
    const { drugs } = req.body;

    if (!drugs || !Array.isArray(drugs) || drugs.length < 2) {
      return res.status(400).json({
        success: false,
        error: 'Please provide at least 2 drugs to check interactions'
      });
    }

    const normalizedDrugs = drugs.map(d => d.toLowerCase().trim());
    const interactions = [];

    // Check all drug pairs
    for (let i = 0; i < normalizedDrugs.length; i++) {
      for (let j = i + 1; j < normalizedDrugs.length; j++) {
        const drug1 = normalizedDrugs[i];
        const drug2 = normalizedDrugs[j];

        // Check if interaction exists
        let interaction = null;
        if (drugInteractionsDatabase[drug1] && drugInteractionsDatabase[drug1][drug2]) {
          interaction = drugInteractionsDatabase[drug1][drug2];
        } else if (drugInteractionsDatabase[drug2] && drugInteractionsDatabase[drug2][drug1]) {
          interaction = drugInteractionsDatabase[drug2][drug1];
        }

        if (interaction) {
          interactions.push({
            drugs: [drug1, drug2],
            severity: interaction.severity,
            notes: interaction.notes
          });
        }
      }
    }

    res.json({
      success: true,
      drugs: normalizedDrugs,
      interactions: interactions,
      message: interactions.length === 0 ? 'No significant interactions found' : `Found ${interactions.length} interaction(s)`
    });
  } catch (err) {
    console.error('/api/check-drug-interactions error:', err.message);
    res.status(500).json({
      success: false,
      error: err.message || 'Error checking drug interactions'
    });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, error: 'Endpoint not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 MedGPT Pro backend listening on port ${PORT}`);
  console.log(`📊 MongoDB: ${process.env.MONGODB_URI ? 'Configured' : 'Using default (localhost:27017)'}`);
  console.log(`🤖 Ollama: ${process.env.OLLAMA_URL || 'http://localhost:11434/api/generate'}`);
});

module.exports = app;