/**
 * Direct test of translateText function
 */

const { translateText } = require('./utils/languageHelper');

async function quickTest() {
  console.log('🚀 Quick Multi-Language Translation Test\n');

  const testText = 'You have high blood pressure. Take your medicine daily and follow doctor instructions.';
  
  console.log(`📄 Testing Text:\n"${testText}"\n`);
  console.log('='.repeat(70));

  const languages = ['english', 'hindi', 'kannada', 'telugu'];

  for (const lang of languages) {
    try {
      console.log(`\n🔄 Translating to ${lang.toUpperCase()}...`);
      const result = await translateText(testText, lang);
      console.log(`✅ Result: ${result}`);
    } catch (err) {
      console.error(`❌ Error: ${err.message}`);
    }
  }

  console.log('\n' + '='.repeat(70));
  console.log('✅ Test complete!\n');
}

quickTest().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
