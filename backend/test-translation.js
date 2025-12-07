/**
 * Test script to verify LibreTranslate API integration
 * Tests all 4 languages: English, Kannada, Hindi, Telugu
 */

const { translateText } = require('./utils/languageHelper');

async function testTranslations() {
  console.log('🧪 Testing Multi-Language Translation Support\n');
  console.log('='.repeat(60));

  const testTexts = [
    'High blood pressure is a serious condition.',
    'Take your medicine daily and follow doctor instructions.',
    'You have diabetes and should monitor your blood sugar.',
    'Drink plenty of water and get regular exercise.'
  ];

  const languages = ['english', 'hindi', 'kannada', 'telugu'];

  for (const text of testTexts) {
    console.log(`\n📄 Test Text: "${text}"`);
    console.log('-'.repeat(60));

    for (const lang of languages) {
      try {
        const translatedText = await translateText(text, lang);
        console.log(`  ${lang.toUpperCase()}: ${translatedText}`);
      } catch (error) {
        console.error(`  ❌ ${lang.toUpperCase()}: Error - ${error.message}`);
      }
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('✅ Translation testing complete!\n');
}

// Run tests
testTranslations().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
