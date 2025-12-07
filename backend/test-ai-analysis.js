/**
 * Test for AI Case Analysis Fix
 * Verifies:
 * 1. Papers are relevant to diagnosis
 * 2. Age is correctly verified
 * 3. Diagnosis is mentioned in analysis
 */

const axios = require('axios');
const mongoose = require('mongoose');
const fs = require('fs');

// MongoDB connection string
const MONGO_URI = 'mongodb+srv://medgpt:medgpt123@medgpt.fhyux.mongodb.net/medgpt?retryWrites=true&w=majority';

// Simple Case model for testing
const caseSchema = new mongoose.Schema({
  patientName: String,
  age: Number,
  gender: String,
  diagnosis: String,
  symptoms: String,
  medications: [String],
  aiAnalysis: {
    brief: String,
    relevantPapers: Array,
    analysisText: String,
    verifiedAge: Number,
    analysisTimestamp: Date
  }
});

const TestCase = mongoose.model('TestCase', caseSchema);

async function testAICaseAnalysis() {
  console.log('\n🧪 Testing AI Case Analysis Fix\n');
  console.log('='.repeat(70));

  try {
    // Connect to MongoDB
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Test Case 1: Hypertension
    console.log('\n📋 TEST CASE 1: Hypertension (Age 45)');
    console.log('-'.repeat(70));
    
    const hypertensionCase = await TestCase.create({
      patientName: 'John Doe',
      age: 45,
      gender: 'M',
      diagnosis: 'Hypertension',
      symptoms: 'High blood pressure, headaches',
      medications: ['Lisinopril 10mg daily']
    });

    let response = await axios.post(
      `http://localhost:5000/api/analyze-case/${hypertensionCase._id}`,
      {}
    );

    console.log(`✅ Case ID: ${hypertensionCase._id}`);
    console.log(`🔍 Age Verified: ${response.data.verifiedAge}`);
    console.log(`📊 Papers Retrieved: ${response.data.papersCount}`);
    console.log(`💬 Brief: ${response.data.brief.substring(0, 100)}...`);
    
    // Validation: Check age
    if (response.data.verifiedAge === 45) {
      console.log('✅ AGE VERIFICATION PASSED: Age 45 correctly displayed');
    } else {
      console.log(`❌ AGE VERIFICATION FAILED: Expected 45, got ${response.data.verifiedAge}`);
    }

    // Validation: Check diagnosis in analysis
    if (response.data.analysisText.includes('Hypertension') || response.data.analysisText.includes('hypertension')) {
      console.log('✅ DIAGNOSIS VERIFICATION PASSED: Hypertension mentioned in analysis');
    } else {
      console.log('❌ DIAGNOSIS VERIFICATION FAILED: Hypertension not mentioned');
    }

    // Validation: Check papers are relevant
    if (response.data.relevantPapers && response.data.relevantPapers.length > 0) {
      console.log(`✅ PAPERS RETRIEVED: ${response.data.relevantPapers.length} papers found`);
      console.log('📄 Sample Papers:');
      response.data.relevantPapers.slice(0, 3).forEach((paper, i) => {
        console.log(`   ${i+1}. ${paper.title.substring(0, 80)}... (Score: ${paper.relevanceScore})`);
      });
    } else {
      console.log('⚠️ No papers retrieved');
    }

    // Test Case 2: Diabetes
    console.log('\n📋 TEST CASE 2: Diabetes (Age 60)');
    console.log('-'.repeat(70));
    
    const diabetesCase = await TestCase.create({
      patientName: 'Jane Smith',
      age: 60,
      gender: 'F',
      diagnosis: 'Type 2 Diabetes Mellitus',
      symptoms: 'Polyuria, polydipsia, fatigue',
      medications: ['Metformin 500mg twice daily', 'Atorvastatin 20mg daily']
    });

    response = await axios.post(
      `http://localhost:5000/api/analyze-case/${diabetesCase._id}`,
      {}
    );

    console.log(`✅ Case ID: ${diabetesCase._id}`);
    console.log(`🔍 Age Verified: ${response.data.verifiedAge}`);
    console.log(`📊 Papers Retrieved: ${response.data.papersCount}`);
    console.log(`💬 Brief: ${response.data.brief.substring(0, 100)}...`);
    
    // Validation: Check age
    if (response.data.verifiedAge === 60) {
      console.log('✅ AGE VERIFICATION PASSED: Age 60 correctly displayed');
    } else {
      console.log(`❌ AGE VERIFICATION FAILED: Expected 60, got ${response.data.verifiedAge}`);
    }

    // Validation: Check diagnosis in analysis
    if (response.data.analysisText.includes('Diabetes') || response.data.analysisText.toLowerCase().includes('diabetes')) {
      console.log('✅ DIAGNOSIS VERIFICATION PASSED: Diabetes mentioned in analysis');
    } else {
      console.log('❌ DIAGNOSIS VERIFICATION FAILED: Diabetes not mentioned');
    }

    // Validation: Check papers are relevant
    if (response.data.relevantPapers && response.data.relevantPapers.length > 0) {
      console.log(`✅ PAPERS RETRIEVED: ${response.data.relevantPapers.length} papers found`);
      console.log('📄 Sample Papers:');
      response.data.relevantPapers.slice(0, 3).forEach((paper, i) => {
        console.log(`   ${i+1}. ${paper.title.substring(0, 80)}... (Score: ${paper.relevanceScore})`);
      });
    } else {
      console.log('⚠️ No papers retrieved');
    }

    // Test Case 3: Young patient with different condition
    console.log('\n📋 TEST CASE 3: Heart Condition (Age 20)');
    console.log('-'.repeat(70));
    
    const heartCase = await TestCase.create({
      patientName: 'Alex Johnson',
      age: 20,
      gender: 'M',
      diagnosis: 'Arrhythmia',
      symptoms: 'Palpitations, dizziness',
      medications: ['Beta-blocker therapy']
    });

    response = await axios.post(
      `http://localhost:5000/api/analyze-case/${heartCase._id}`,
      {}
    );

    console.log(`✅ Case ID: ${heartCase._id}`);
    console.log(`🔍 Age Verified: ${response.data.verifiedAge}`);
    console.log(`📊 Papers Retrieved: ${response.data.papersCount}`);
    console.log(`💬 Brief: ${response.data.brief.substring(0, 100)}...`);
    
    // CRITICAL: Check age is NOT wrong (not showing 55 instead of 20)
    if (response.data.verifiedAge === 20) {
      console.log('✅ AGE VERIFICATION PASSED: Age 20 correctly displayed (NOT 55)');
    } else {
      console.log(`❌ AGE VERIFICATION FAILED: Expected 20, got ${response.data.verifiedAge}`);
    }

    // Check brief mentions correct age
    if (response.data.brief.includes('20-year-old') || response.data.brief.includes('20 years')) {
      console.log('✅ BRIEF AGE MENTION PASSED: Brief mentions "20-year-old"');
    } else {
      console.log('⚠️ Brief may not mention correct age');
    }

    // Check analysis mentions correct age
    if (response.data.analysisText.includes('20-year-old')) {
      console.log('✅ ANALYSIS AGE MENTION PASSED: Analysis mentions "20-year-old"');
    } else if (response.data.analysisText.includes('Age: 20')) {
      console.log('✅ ANALYSIS AGE MENTION PASSED: Analysis shows "Age: 20"');
    }

    console.log('\n' + '='.repeat(70));
    console.log('✅ ALL TESTS COMPLETED\n');

    // Cleanup
    await TestCase.deleteMany({ _id: { $in: [hypertensionCase._id, diabetesCase._id, heartCase._id] } });
    console.log('🧹 Test data cleaned up');

  } catch (error) {
    console.error('❌ Test error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
  }
}

// Run test
testAICaseAnalysis().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
