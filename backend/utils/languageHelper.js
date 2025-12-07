/**
 * Language Helper Utility Module
 * Handles medical text simplification, translation, and summarization
 * Features: Pattern matching, Google Translate API integration, caching
 */

const axios = require('axios');
const fetch = require('node-fetch');

// Translation cache to avoid repeated API calls
const translationCache = new Map();

// Medical terminology to simple language mapping
const medicalSimplificationMap = {
  // Cardiovascular
  'hypertension': 'high blood pressure',
  'hypotension': 'low blood pressure',
  'myocardial infarction': 'heart attack',
  'angina pectoris': 'chest pain due to heart',
  'arrhythmia': 'irregular heartbeat',
  'tachycardia': 'fast heartbeat',
  'bradycardia': 'slow heartbeat',
  'thrombosis': 'blood clot',
  'cardiovascular': 'heart and blood vessels',
  'coronary artery': 'blood vessel in the heart',

  // Respiratory
  'dyspnea': 'shortness of breath',
  'pneumonia': 'lung infection',
  'bronchitis': 'windpipe inflammation',
  'asthma': 'difficulty breathing, narrowed airways',
  'chronic obstructive pulmonary disease': 'serious lung disease',
  'copd': 'serious lung disease',
  'respiratory': 'related to breathing',

  // Endocrine
  'diabetes mellitus': 'high blood sugar disease',
  'hyperglycemia': 'high blood sugar',
  'hypoglycemia': 'low blood sugar',
  'thyroid': 'gland in the neck that controls metabolism',
  'hypothyroidism': 'low thyroid hormone',
  'hyperthyroidism': 'high thyroid hormone',
  'metabolic': 'related to body processing food',

  // Neurological
  'stroke': 'blood clot or bleeding in the brain',
  'cerebrovascular accident': 'blood clot or bleeding in the brain',
  'seizure': 'sudden abnormal brain activity',
  'epilepsy': 'condition causing seizures',
  'migraine': 'severe headache',
  'neuralgia': 'nerve pain',
  'parkinson': 'disease causing shaking and stiffness',
  'alzheimer': 'memory and thinking disease',
  'neurological': 'related to the brain and nerves',

  // Gastrointestinal
  'gastroenteritis': 'stomach and intestine infection',
  'peptic ulcer': 'sore in stomach or intestines',
  'constipation': 'difficulty passing stool',
  'diarrhea': 'loose, watery stool',
  'inflammatory bowel disease': 'chronic intestine inflammation',
  'hepatitis': 'liver inflammation',
  'cirrhosis': 'scarring of the liver',
  'gastrointestinal': 'related to stomach and intestines',

  // Immune/Infectious
  'pneumocystis pneumonia': 'serious lung infection',
  'tuberculosis': 'serious lung infection',
  'influenza': 'flu',
  'coronavirus': 'covid-19 virus',
  'hiv': 'virus that attacks immune system',
  'aids': 'advanced immune system disease',
  'sepsis': 'life-threatening infection response',
  'immunocompromised': 'weak immune system',

  // Musculoskeletal
  'arthritis': 'joint inflammation and pain',
  'osteoarthritis': 'wear and tear of joints',
  'rheumatoid arthritis': 'immune system attacking joints',
  'osteoporosis': 'weak bones',
  'fracture': 'broken bone',
  'sprain': 'stretched or torn ligament',
  'myalgia': 'muscle pain',
  'musculoskeletal': 'related to muscles and bones',

  // Oncology
  'carcinoma': 'cancer',
  'malignant': 'cancer that spreads',
  'benign': 'not cancer',
  'metastasis': 'cancer spread to other parts',
  'chemotherapy': 'cancer treatment with chemicals',
  'radiation therapy': 'cancer treatment with radiation',
  'tumor': 'abnormal growth',

  // Dermatological
  'dermatitis': 'skin inflammation',
  'eczema': 'itchy skin condition',
  'psoriasis': 'scaly skin disease',
  'melanoma': 'serious skin cancer',

  // Other common terms
  'inflammation': 'swelling and redness',
  'infection': 'harmful germs causing disease',
  'acute': 'sudden and severe',
  'chronic': 'long-lasting',
  'syndrome': 'group of symptoms',
  'disorder': 'disease or condition',
  'pathology': 'study of disease',
  'diagnosis': 'identification of disease',
  'prognosis': 'expected outcome',
  'etiology': 'cause of disease',
  'symptomatology': 'description of symptoms',
  'manifestation': 'sign or symptom',
  'exacerbation': 'worsening of condition',
  'remission': 'improvement or disappearance',
  'contraindicated': 'not recommended',
  'pharmacotherapy': 'treatment with medicines',
  'adjuvant': 'additional treatment',
  'palliative': 'comfort care',
  'inpatient': 'staying in hospital',
  'outpatient': 'visiting hospital for treatment',
  'differential diagnosis': 'list of possible diseases',
  'clinical presentation': 'how the disease appears',
  'vital signs': 'heart rate, blood pressure, temperature',
  'persistent': 'keeps happening',
  'intermittent': 'comes and goes',
  'elevated': 'higher than normal',
  'depressed': 'lower than normal',
  'compromised': 'weakened or damaged',
  'impaired': 'not working properly',
  'deterioration': 'getting worse',
  'improvement': 'getting better',
  'regression': 'going backward',
  'idiopathic': 'cause unknown'
};

// Regex patterns for more complex medical phrases
const medicalPhrasePatterns = [
  {
    pattern: /(\w+itis)/gi,
    replacement: 'inflammation of the $1',
    simplify: (match) => `inflammation of the ${match.replace('itis', '')}`
  },
  {
    pattern: /(\w+osis)/gi,
    replacement: 'condition of $1',
    simplify: (match) => `condition of ${match.replace('osis', '')}`
  },
  {
    pattern: /(\w+pathy)/gi,
    replacement: 'disease of the $1',
    simplify: (match) => `disease of the ${match.replace('pathy', '')}`
  },
  {
    pattern: /(\w+algia)/gi,
    replacement: 'pain in the $1',
    simplify: (match) => `pain in the ${match.replace('algia', '')}`
  }
];

/**
 * Simplifies complex medical text to patient-friendly language
 * Uses pattern matching and word replacement dictionary
 * 
 * @param {string} medicalText - Complex medical explanation
 * @returns {string} Simplified patient-friendly text
 * 
 * @example
 * simplifyMedicalText("Hypertension is persistent elevated systolic and diastolic BP")
 * // Returns: "High blood pressure that doesn't go down - affects your heart"
 */
function simplifyMedicalText(medicalText) {
  if (!medicalText || typeof medicalText !== 'string') {
    return '';
  }

  let simplifiedText = medicalText;

  // Convert to lowercase for matching (preserve original case structure)
  const lowerText = simplifiedText.toLowerCase();
  let result = simplifiedText;

  // Apply medical terminology simplification map
  Object.entries(medicalSimplificationMap).forEach(([medical, simple]) => {
    const regex = new RegExp(`\\b${medical}\\b`, 'gi');
    result = result.replace(regex, simple);
  });

  // Apply pattern-based simplifications
  medicalPhrasePatterns.forEach(({ pattern, simplify }) => {
    result = result.replace(pattern, (match) => {
      try {
        return simplify(match);
      } catch (err) {
        console.log(`Pattern simplification error for ${match}:`, err.message);
        return match;
      }
    });
  });

  // Clean up common medical phrase patterns
  result = result
    // Remove excessive medical jargon
    .replace(/\b(the patient presents with|clinical features include|characterized by|evidenced by)\b/gi, 'showing')
    // Simplify "persistent/ongoing"
    .replace(/\b(persistent|ongoing|chronic|long-term)\b/gi, 'long-lasting')
    // Simplify "sudden/acute"
    .replace(/\b(sudden|acute|abrupt)\b/gi, 'sudden')
    // Fix common phrasing
    .replace(/\b(due to|caused by|resulting from)\b/gi, 'due to')
    // Remove redundant "and" connectors
    .replace(/\s+and\s+and\s+/gi, ' and ')
    // Clean up extra spaces
    .replace(/\s+/g, ' ')
    .trim();

  return result;
}

/**
 * Translates text to target language using Google Translate API
 * Caches results to minimize API calls and improve performance
 * 
 * @param {string} text - Text to translate
 * @param {string} targetLanguage - Target language ('kannada'|'hindi'|'telugu'|'english')
 * @returns {Promise<string>} Translated text
 * 
 * @example
 * await translateText("Good morning", "kannada")
 * // Returns: "ಶುಭೋದಯ"
 */
// Medical terminology translations dictionary
const medicalTranslations = {
  hindi: {
    'high blood pressure': 'उच्च रक्त चाप',
    'low blood pressure': 'निम्न रक्त चाप',
    'heart attack': 'दिल का दौरा',
    'chest pain': 'छाती में दर्द',
    'irregular heartbeat': 'अनियमित दिल की धड़कन',
    'fast heartbeat': 'तेज दिल की धड़कन',
    'slow heartbeat': 'धीमी दिल की धड़कन',
    'blood clot': 'खून का थक्का',
    'shortness of breath': 'सांस लेने में कठिनाई',
    'lung infection': 'फेफड़ों का संक्रमण',
    'difficulty breathing': 'सांस लेने में कठिनाई',
    'serious lung disease': 'गंभीर फेफड़ों की बीमारी',
    'high blood sugar': 'उच्च रक्त शर्करा',
    'low blood sugar': 'निम्न रक्त शर्करा',
    'diabetes': 'मधुमेह',
    'stroke': 'मस्तिष्क में रक्त के थक्के',
    'seizure': 'दौरे पड़ना',
    'severe headache': 'गंभीर सिरदर्द',
    'memory disease': 'स्मृति रोग',
    'stomach infection': 'पेट का संक्रमण',
    'liver disease': 'जिगर की बीमारी',
    'joint pain': 'जोड़ों में दर्द',
    'weak bones': 'कमजोर हड्डियां',
    'broken bone': 'टूटी हुई हड्डी',
    'muscle pain': 'मांसपेशियों में दर्द',
    'cancer': 'कैंसर',
    'skin disease': 'त्वचा रोग',
    'infection': 'संक्रमण',
    'inflammation': 'सूजन',
    'medicine': 'दवा',
    'treatment': 'इलाज',
    'doctor': 'डॉक्टर',
    'hospital': 'अस्पताल',
    'take medicine daily': 'रोज दवा लें',
    'follow doctor instructions': 'डॉक्टर के निर्देशों का पालन करें',
    'drink plenty of water': 'खूब पानी पिएं',
    'rest': 'आराम',
    'exercise': 'व्यायाम',
    'healthy diet': 'स्वस्थ आहार'
  },
  kannada: {
    'high blood pressure': 'ಹೆಚ್ಚಿನ ರಕ್ತ ಒತ್ತಡ',
    'low blood pressure': 'ಕಡಿಮೆ ರಕ್ತ ಒತ್ತಡ',
    'heart attack': 'ಹೃದಯ ಗಾಯ',
    'chest pain': 'ಛಾತಿ ನೋವು',
    'irregular heartbeat': 'ಅನಿಯಮಿತ ಹೃದಯ ಬಡಿತ',
    'fast heartbeat': 'ತ್ವರಿತ ಹೃದಯ ಬಡಿತ',
    'slow heartbeat': 'ನಿಧಾನ ಹೃದಯ ಬಡಿತ',
    'blood clot': 'ರಕ್ತ ಪೇವೆ',
    'shortness of breath': 'ಶ್ವಾಸ ಕೊರತೆ',
    'lung infection': 'ಫೇಫೆ ಸೋಂಕು',
    'difficulty breathing': 'ಶ್ವಾಸ ತೆಗೆದುಕೊಳ್ಳುವುದು ಕಷ್ಟ',
    'serious lung disease': 'ಗಂಭೀರ ಫೇಫೆ ರೋಗ',
    'high blood sugar': 'ಹೆಚ್ಚಿನ ರಕ್ತ ಶರ್ಕರೆ',
    'low blood sugar': 'ಕಡಿಮೆ ರಕ್ತ ಶರ್ಕರೆ',
    'diabetes': 'ಮಧುಮೇಹ',
    'stroke': 'ಮೆದುಳಿನ ಪ್ರಹಾರ',
    'seizure': 'ನೀರಸತೆ',
    'severe headache': 'ತೀವ್ರ ತಲೆನೋವು',
    'memory disease': 'ಸ್ಮೃತಿ ರೋಗ',
    'stomach infection': 'ಹೊಟ್ಟೆ ಸೋಂಕು',
    'liver disease': 'ಯಕೃತ್ತಿನ ರೋಗ',
    'joint pain': 'ಮೂಳೆ ನೋವು',
    'weak bones': 'ದುರ್ಬಲ ಮೂಳೆಗಳು',
    'broken bone': 'ಮುರಿದ ಮೂಳೆ',
    'muscle pain': 'ಸ್ನಾಯು ನೋವು',
    'cancer': 'ಕ್ಯಾನ್ಸರ್',
    'skin disease': 'ಚರ್ಮ ರೋಗ',
    'infection': 'ಸೋಂಕು',
    'inflammation': 'ವಾಲೆತನ',
    'medicine': 'ಔಷಧ',
    'treatment': 'ಚಿಕಿತ್ಸೆ',
    'doctor': 'ವೈದ್ಯ',
    'hospital': 'ಆಸ್ಪತ್ರೆ',
    'take medicine daily': 'ದಿನದಿ ಔಷಧ ತೆಗೆದುಕೊಳ್ಳಿ',
    'follow doctor instructions': 'ವೈದ್ಯರ ಸೂಚನೆಗಳನ್ನು ಅನುಸರಿಸಿ',
    'drink plenty of water': 'ಸಾಕಷ್ಟು ನೀರು ಕುಡಿಯಿರಿ',
    'rest': 'ವಿಶ್ರಾಂತಿ',
    'exercise': 'ವ್ಯಾಯಾಮ',
    'healthy diet': 'ಆರೋಗ್ಯಕರ ಆಹಾರ'
  },
  telugu: {
    'high blood pressure': 'అధిక రక్తపోటు',
    'low blood pressure': 'తక్కువ రక్తపోటు',
    'heart attack': 'గుండె రుగ్గు',
    'chest pain': 'ఛాతీ నొప్పి',
    'irregular heartbeat': 'అక్రమ గుండె స్పందన',
    'fast heartbeat': 'వేగవంతమైన గుండె స్పందన',
    'slow heartbeat': 'నెమ్మదిగా గుండె స్పందన',
    'blood clot': 'రక్త గడ్డ',
    'shortness of breath': 'శ్వాస ఘోషణ',
    'lung infection': 'ఊపిరితిత్తుల సంక్రమణ',
    'difficulty breathing': 'శ్వాస తీసుకోవడానికి ఇబ్బంది',
    'serious lung disease': 'గంభీరమైన ఊపిరితిత్తుల వ్యాధి',
    'high blood sugar': 'అధిక రక్త చక్కెర',
    'low blood sugar': 'తక్కువ రక్త చక్కెర',
    'diabetes': 'మధుమేహ',
    'stroke': 'మెదడు ఆఘాత',
    'seizure': 'మర్ఫ్',
    'severe headache': 'తీవ్రమైన తల నొప్పి',
    'memory disease': 'జ్ఞాపక వ్యాధి',
    'stomach infection': 'కడుపు సంక్రమణ',
    'liver disease': 'కాలేయ వ్యాధి',
    'joint pain': 'సంధి నొప్పి',
    'weak bones': 'బలహీనమైన ఎముకలు',
    'broken bone': 'విరిగిన ఎముక',
    'muscle pain': 'కండరాల నొప్పి',
    'cancer': 'క్యాన్సర్',
    'skin disease': 'చర్మ వ్యాధి',
    'infection': 'సంక్రమణ',
    'inflammation': 'వాపు',
    'medicine': 'ఔషధం',
    'treatment': 'చికిత్స',
    'doctor': 'డాక్టర్',
    'hospital': 'ఆసుపత్రి',
    'take medicine daily': 'రోజూ ఔషధం తీసుకోండి',
    'follow doctor instructions': 'డాక్టర్ సూచనలను అనుసరించండి',
    'drink plenty of water': 'ఎక్కువ నీరు తాగండి',
    'rest': 'విశ్రాంతి',
    'exercise': 'వ్యాయామం',
    'healthy diet': 'ఆరోగ్యకరమైన ఆహారం'
  }
};

async function translateText(text, targetLanguage = 'english') {
  // Return original text if target is English
  if (!text || targetLanguage === 'english') {
    return text || '';
  }

  if (!text || typeof text !== 'string') {
    return '';
  }

  // Check cache first
  const cacheKey = `${text}::${targetLanguage}`;
  if (translationCache.has(cacheKey)) {
    console.log(`✓ Translation cache hit for ${targetLanguage}`);
    return translationCache.get(cacheKey);
  }

  try {
    // Language code mapping for LibreTranslate
    const languageCodeMap = {
      'kannada': 'kn',
      'hindi': 'hi',
      'telugu': 'te',
      'english': 'en'
    };
    
    const targetLangCode = languageCodeMap[targetLanguage.toLowerCase()] || 'en';
    
    // Try LibreTranslate API first (free, no API key required)
    console.log(`🔄 Translating to ${targetLanguage} (${targetLangCode}) using LibreTranslate...`);
    
    try {
      const response = await fetch('https://libretranslate.com/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          q: text,
          source: 'en',
          target: targetLangCode
        }),
        timeout: 5000
      });

      if (response.ok) {
        const data = await response.json();
        if (data && data.translatedText) {
          const translatedText = data.translatedText;
          translationCache.set(cacheKey, translatedText);
          console.log(`✓ LibreTranslate API successful for ${targetLanguage}`);
          return translatedText;
        }
      } else {
        console.warn(`⚠️ LibreTranslate API returned status ${response.status}`);
      }
    } catch (apiError) {
      console.warn(`⚠️ LibreTranslate API error: ${apiError.message}`);
    }

    // Fallback 1: Try dictionary-based translation
    console.log(`🔄 Falling back to dictionary-based translation for ${targetLanguage}...`);
    const translations = medicalTranslations[targetLanguage.toLowerCase()];
    if (translations) {
      let translatedText = text;
      let wordCount = 0;
      
      // Replace medical terms with translations (case-insensitive)
      Object.entries(translations).forEach(([english, translated]) => {
        const regex = new RegExp(`\\b${english}\\b`, 'gi');
        const matches = translatedText.match(regex);
        if (matches) {
          wordCount += matches.length;
          translatedText = translatedText.replace(regex, translated);
        }
      });

      // If some words were translated, cache and return
      if (translatedText !== text && wordCount > 0) {
        translationCache.set(cacheKey, translatedText);
        console.log(`✓ Dictionary-based translation successful for ${targetLanguage} (${wordCount} terms translated)`);
        return translatedText;
      }
    }

    // Fallback 2: Try Google Translate API if key is available
    const googleApiKey = process.env.GOOGLE_TRANSLATE_API_KEY;
    if (googleApiKey) {
      console.log(`🔄 Falling back to Google Translate API for ${targetLanguage}...`);
      try {
        const response = await axios.post(
          `https://translation.googleapis.com/language/translate/v2?key=${googleApiKey}`,
          {
            q: text,
            target: targetLangCode,
            source: 'en'
          },
          {
            timeout: 5000
          }
        );

        if (response.data && response.data.data && response.data.data.translations) {
          const translatedText = response.data.data.translations[0].translatedText;
          translationCache.set(cacheKey, translatedText);
          console.log(`✓ Google Translate API successful for ${targetLanguage}`);
          return translatedText;
        }
      } catch (googleError) {
        console.warn(`⚠️ Google Translate API error: ${googleError.message}`);
      }
    } else {
      console.log(`📝 No Google Translate API key configured (optional)`);
    }

    // Final fallback: Return original text with note
    console.warn(`⚠️ All translation methods failed. Returning original text for ${targetLanguage}`);
    translationCache.set(cacheKey, text);
    return text;
  } catch (error) {
    console.error(`✗ Translation error for ${targetLanguage}:`, error.message);

    // Return original text on API error
    translationCache.set(cacheKey, text);
    return text;
  }
}

/**
 * Generates a brief summary of the case data
 * Creates separate summaries for doctor and patient versions
 * 
 * @param {object} caseData - Full case data object
 * @param {string} version - 'doctor' for medical version, 'patient' for simplified version
 * @returns {object} Object with doctorSummary and patientSummary
 * 
 * @example
 * const summary = summarizeCase(caseData, 'patient')
 * // Returns: { doctorSummary: "...", patientSummary: "..." }
 */
function summarizeCase(caseData, version = 'both') {
  if (!caseData) {
    return {
      doctorSummary: 'No case data available.',
      patientSummary: 'No case information available.'
    };
  }

  // Extract key information
  const patientName = caseData.patientName || 'Patient';
  const age = caseData.age || 'Unknown age';
  const diagnosis = caseData.diagnosis || 'Not specified';
  const symptoms = caseData.symptoms || 'No symptoms reported';
  const medications = Array.isArray(caseData.medications) 
    ? caseData.medications.join(', ')
    : caseData.medications || 'No medications';
  const medicalHistory = caseData.medicalHistory || 'No previous medical history';

  // Doctor version - more technical and comprehensive
  const doctorSummary = `
${patientName}, ${age} years old, presents with ${diagnosis}. 
Chief complaints include ${symptoms}. 
Current medications: ${medications}. 
Medical history: ${medicalHistory}.
  `.trim().replace(/\s+/g, ' ');

  // Patient version - simplified and encouraging
  const patientSummary = `
${patientName}, you are being treated for ${simplifyMedicalText(diagnosis)}.
Your symptoms include ${simplifyMedicalText(symptoms)}.
You are currently taking ${medications}.
  `.trim().replace(/\s+/g, ' ');

  // Return based on version requested
  if (version === 'doctor') {
    return { doctorSummary, patientSummary: null };
  } else if (version === 'patient') {
    return { doctorSummary: null, patientSummary };
  } else {
    return { doctorSummary, patientSummary };
  }
}

/**
 * Clears the translation cache
 * Useful for freeing memory or forcing fresh translations
 * 
 * @returns {number} Number of entries cleared
 */
function clearTranslationCache() {
  const size = translationCache.size;
  translationCache.clear();
  console.log(`✓ Translation cache cleared (${size} entries removed)`);
  return size;
}

/**
 * Gets cache statistics
 * Useful for monitoring API usage
 * 
 * @returns {object} Cache statistics
 */
function getCacheStats() {
  return {
    cacheSize: translationCache.size,
    entries: Array.from(translationCache.keys())
  };
}

/**
 * Validates if text is medical terminology
 * 
 * @param {string} text - Text to validate
 * @returns {boolean} True if text contains medical terms
 */
function isMedicalText(text) {
  if (!text || typeof text !== 'string') {
    return false;
  }

  const medicalTerms = Object.keys(medicalSimplificationMap);
  const lowerText = text.toLowerCase();

  return medicalTerms.some(term => 
    new RegExp(`\\b${term}\\b`).test(lowerText)
  );
}

/**
 * Batch translation for multiple texts
 * More efficient than calling translateText multiple times
 * 
 * @param {string[]} texts - Array of texts to translate
 * @param {string} targetLanguage - Target language
 * @returns {Promise<string[]>} Array of translated texts
 */
async function batchTranslate(texts, targetLanguage = 'english') {
  if (!Array.isArray(texts)) {
    return [];
  }

  try {
    // Filter out already cached translations
    const uncachedTexts = texts.filter(text => {
      const cacheKey = `${text}::${targetLanguage}`;
      return !translationCache.has(cacheKey);
    });

    // Translate uncached texts
    if (uncachedTexts.length > 0) {
      const translations = await Promise.all(
        uncachedTexts.map(text => translateText(text, targetLanguage))
      );

      // Combine cached and newly translated
      return texts.map(text => {
        const cacheKey = `${text}::${targetLanguage}`;
        return translationCache.get(cacheKey) || text;
      });
    }

    // All from cache
    return texts.map(text => {
      const cacheKey = `${text}::${targetLanguage}`;
      return translationCache.get(cacheKey) || text;
    });
  } catch (error) {
    console.error('Batch translation error:', error.message);
    return texts; // Return original texts on error
  }
}

/**
 * Enhanced medical text simplifier with contextual awareness
 * Considers the context to provide better simplifications
 * 
 * @param {string} medicalText - Complex medical text
 * @param {string} context - Optional context (e.g., 'treatment', 'diagnosis')
 * @returns {string} Contextually simplified text
 */
function simplifyMedicalTextWithContext(medicalText, context = '') {
  let simplified = simplifyMedicalText(medicalText);

  // Add context-specific simplifications
  if (context.toLowerCase().includes('treatment')) {
    simplified = simplified
      .replace(/\b(medication|drug|pharmaceutical)\b/gi, 'medicine')
      .replace(/\b(dosage|dose)\b/gi, 'amount');
  }

  if (context.toLowerCase().includes('diagnosis')) {
    simplified = simplified
      .replace(/\b(suspected|presumed|likely)\b/gi, 'possibly')
      .replace(/\b(confirmed|definitive)\b/gi, 'definitely');
  }

  if (context.toLowerCase().includes('prognosis')) {
    simplified = simplified
      .replace(/\b(favorable|positive)\b/gi, 'good')
      .replace(/\b(unfavorable|negative|poor)\b/gi, 'difficult');
  }

  return simplified;
}

// Export all functions as a module
module.exports = {
  simplifyMedicalText,
  simplifyMedicalTextWithContext,
  translateText,
  batchTranslate,
  summarizeCase,
  clearTranslationCache,
  getCacheStats,
  isMedicalText
};
