/**
 * Test the /api/patient-education/:caseId endpoint
 * Verifies that multi-language translation is working
 */

const axios = require('axios');

async function testPatientEducationEndpoint() {
  console.log('🧪 Testing Patient Education Endpoint\n');
  console.log('='.repeat(60));

  // Get all cases from the database first
  try {
    const casesResponse = await axios.get('http://localhost:5000/api/cases');
    const cases = casesResponse.data;
    
    if (cases.length === 0) {
      console.log('⚠️  No cases found in database. Creating test case...\n');
      return;
    }

    const caseId = cases[0]._id;
    console.log(`Testing with Case ID: ${caseId}\n`);

    const languages = ['english', 'hindi', 'kannada', 'telugu'];

    for (const language of languages) {
      try {
        console.log(`\n📝 Testing ${language.toUpperCase()}...`);
        console.log('-'.repeat(60));
        
        const response = await axios.post(
          `http://localhost:5000/api/patient-education/${caseId}`,
          { language: language },
          { timeout: 10000 }
        );

        const { simpleExplanation, translatedText } = response.data;
        
        console.log(`Simple Explanation: ${simpleExplanation.substring(0, 100)}...`);
        console.log(`Translated Text: ${translatedText.substring(0, 100)}...`);
        
        // Check if translation is different from original (except for English)
        if (language !== 'english') {
          if (simpleExplanation !== translatedText) {
            console.log(`✅ Translation applied successfully`);
          } else {
            console.log(`⚠️  Translation may not have been applied`);
          }
        }
      } catch (error) {
        console.error(`❌ Error testing ${language}:`, error.message);
      }
    }

    console.log('\n' + '='.repeat(60));
    console.log('✅ Endpoint testing complete!\n');
  } catch (error) {
    console.error('❌ Error fetching cases:', error.message);
  }
}

// Run test
testPatientEducationEndpoint().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
