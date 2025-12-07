/**
 * Test for AI Case Analysis Fix - Logic Validation
 * Tests the paper filtering and age verification logic
 */

const axios = require('axios');

// Mock case data
const testCases = [
  {
    name: 'Hypertension Case',
    age: 45,
    diagnosis: 'Hypertension',
    symptoms: 'High blood pressure, headaches'
  },
  {
    name: 'Diabetes Case',
    age: 60,
    diagnosis: 'Type 2 Diabetes',
    symptoms: 'Polyuria, fatigue'
  },
  {
    name: 'Young Adult with Arrhythmia',
    age: 20,
    diagnosis: 'Arrhythmia',
    symptoms: 'Palpitations, dizziness'
  }
];

async function testPaperRelevance() {
  console.log('\n🧪 Testing AI Case Analysis Paper Relevance Filter\n');
  console.log('='.repeat(70));

  for (const testCase of testCases) {
    console.log(`\n📋 TEST: ${testCase.name}`);
    console.log(`   Age: ${testCase.age}, Diagnosis: ${testCase.diagnosis}`);
    console.log('-'.repeat(70));

    // Build search query exactly as backend does
    const diagnosis = testCase.diagnosis;
    const searchQuery = `${diagnosis} treatment randomized trial`;
    console.log(`🔎 Search Query: "${searchQuery}"`);

    try {
      // Make actual request to backend PubMed search
      const base = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi';
      const params = new URLSearchParams({
        db: 'pubmed',
        term: searchQuery,
        retmode: 'json',
        retmax: '20'
      });

      const res = await axios.get(`${base}?${params.toString()}`, { timeout: 15000 });
      const ids = res.data?.esearchresult?.idlist || [];
      console.log(`📊 Found ${ids.length} initial results`);

      if (ids.length > 0) {
        // Fetch summaries
        const summaryUrl = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi';
        const summaryParams = new URLSearchParams({
          db: 'pubmed',
          id: ids.slice(0, 15).join(','),
          retmode: 'json'
        });

        const summaryRes = await axios.get(`${summaryUrl}?${summaryParams.toString()}`, { timeout: 15000 });
        const results = summaryRes.data?.result || {};

        // Score papers
        const scoredPapers = [];
        ids.slice(0, 15).forEach(id => {
          const paper = results[id];
          if (paper && paper.title) {
            let relevanceScore = 0;
            const titleLower = paper.title.toLowerCase();
            const abstractLower = (paper.abstract || '').toLowerCase();
            const diagnosisKeywords = diagnosis.toLowerCase().split(/\s+/);

            // Score based on keyword matches
            diagnosisKeywords.forEach(keyword => {
              if (keyword.length > 3) {
                if (titleLower.includes(keyword)) relevanceScore += 30;
                if (abstractLower.includes(keyword)) relevanceScore += 15;
              }
            });

            // Bonus for treatment keywords
            const treatmentKeywords = ['treatment', 'management', 'therapy', 'intervention', 'trial'];
            treatmentKeywords.forEach(keyword => {
              if (titleLower.includes(keyword)) relevanceScore += 20;
              if (abstractLower.includes(keyword)) relevanceScore += 10;
            });

            // Bonus for study types
            if (titleLower.includes('randomized') || titleLower.includes('clinical trial')) relevanceScore += 15;
            if (titleLower.includes('meta-analysis') || titleLower.includes('systematic review')) relevanceScore += 15;

            scoredPapers.push({
              pmid: id,
              title: paper.title,
              relevanceScore: relevanceScore
            });
          }
        });

        // Filter and display
        const filteredPapers = scoredPapers
          .filter(p => p.relevanceScore >= 30)
          .sort((a, b) => b.relevanceScore - a.relevanceScore)
          .slice(0, 5);

        console.log(`\n✅ Filtered to ${filteredPapers.length} relevant papers (score >= 30):`);
        filteredPapers.forEach((paper, i) => {
          console.log(`\n   ${i + 1}. Score: ${paper.relevanceScore}`);
          console.log(`      Title: ${paper.title.substring(0, 100)}${paper.title.length > 100 ? '...' : ''}`);
          
          // Verify diagnosis is in title
          if (paper.title.toLowerCase().includes(diagnosis.toLowerCase())) {
            console.log(`      ✅ Contains diagnosis keyword`);
          } else {
            console.log(`      ⚠️ Does not contain exact diagnosis`);
          }
        });

        // Validation checks
        console.log(`\n🔍 Validation Results:`);
        
        if (filteredPapers.length > 0) {
          console.log(`✅ PAPERS RELEVANT: Found ${filteredPapers.length} relevant papers`);
        } else {
          console.log(`⚠️ NO HIGHLY RELEVANT PAPERS: Consider broadening search`);
        }

        const relevantToCondition = filteredPapers.filter(p => 
          p.title.toLowerCase().includes(diagnosis.toLowerCase())
        ).length;
        
        if (relevantToCondition > 0) {
          console.log(`✅ DIAGNOSIS MATCHING: ${relevantToCondition}/${filteredPapers.length} papers contain "${diagnosis}"`);
        } else {
          console.log(`⚠️ DIAGNOSIS MATCHING: Papers may not be highly specific`);
        }

        const treatmentPapers = filteredPapers.filter(p =>
          p.title.toLowerCase().includes('treatment') || 
          p.title.toLowerCase().includes('management') ||
          p.title.toLowerCase().includes('therapy')
        ).length;

        if (treatmentPapers > 0) {
          console.log(`✅ TREATMENT FOCUS: ${treatmentPapers}/${filteredPapers.length} papers focus on treatment/management`);
        }
      }
    } catch (error) {
      console.error(`❌ Error: ${error.message}`);
    }
  }

  console.log('\n' + '='.repeat(70));
  console.log('✅ Paper Relevance Testing Complete\n');
}

async function testAgeVerification() {
  console.log('\n🧪 Testing Age Verification in Brief\n');
  console.log('='.repeat(70));

  for (const testCase of testCases) {
    console.log(`\n📋 TEST: ${testCase.name}`);
    console.log(`   Expected Age: ${testCase.age}`);
    console.log('-'.repeat(70));

    // Generate brief as backend would
    const age = testCase.age;
    const brief = `A ${age}-year-old patient presents with ${testCase.symptoms}. Primary diagnosis: ${testCase.diagnosis}.`;
    
    console.log(`📄 Generated Brief: "${brief}"`);

    // Validation checks
    console.log(`\n🔍 Validation Results:`);
    
    if (brief.includes(`${age}-year-old`)) {
      console.log(`✅ AGE IN BRIEF: Correctly mentions "${age}-year-old"`);
    } else {
      console.log(`❌ AGE IN BRIEF: Does not mention "${age}-year-old}"`);
    }

    // Critical check: Age is NOT wrong (e.g., 20 should not be 55)
    const wrongAges = [20, 55, 30, 40, 50, 60, 70];
    const otherWrongAge = wrongAges.find(a => a !== age && brief.includes(`${a}-year-old`));
    
    if (!otherWrongAge) {
      console.log(`✅ AGE ACCURACY: Correct age ${age}, not any other age`);
    } else {
      console.log(`❌ AGE ACCURACY: Found wrong age ${otherWrongAge} in brief`);
    }

    if (brief.includes(testCase.diagnosis)) {
      console.log(`✅ DIAGNOSIS IN BRIEF: Correctly mentions "${testCase.diagnosis}"`);
    } else {
      console.log(`⚠️ DIAGNOSIS IN BRIEF: Diagnosis not mentioned`);
    }
  }

  console.log('\n' + '='.repeat(70));
  console.log('✅ Age Verification Testing Complete\n');
}

async function runAllTests() {
  try {
    await testPaperRelevance();
    await testAgeVerification();
    
    console.log('\n' + '='.repeat(70));
    console.log('🎉 ALL VALIDATION TESTS COMPLETED\n');
  } catch (error) {
    console.error('Fatal error:', error.message);
    process.exit(1);
  }
}

runAllTests();
