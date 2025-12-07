#!/usr/bin/env node

/**
 * COMPREHENSIVE TEST SUITE FOR MEDGPT PRO
 * =====================================
 * Tests all major functionality:
 * 1. Age Parsing & Display
 * 2. Drug Interactions
 * 3. Relevant Papers Retrieval
 * 4. Doctor Notes in Final Report
 * 5. Language Translation - Kannada
 * 6. Language Translation - Hindi
 * 7. Language Translation - Telugu
 */

const axios = require('axios');
const mongoose = require('mongoose');
require('dotenv').config();

// Colors for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

const log = {
  success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
  info: (msg) => console.log(`${colors.blue}ℹ️  ${msg}${colors.reset}`),
  warning: (msg) => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`),
  header: (msg) => console.log(`\n${colors.bright}${colors.cyan}${'═'.repeat(80)}${colors.reset}\n${colors.bright}${colors.cyan}${msg}${colors.reset}\n${colors.bright}${colors.cyan}${'═'.repeat(80)}${colors.reset}\n`),
  test: (msg) => console.log(`${colors.cyan}📋 ${msg}${colors.reset}`)
};

const BASE_URL = 'http://localhost:5000';
let testResults = [];

/**
 * Test Results Tracker
 */
function recordTest(testName, passed, details = '') {
  testResults.push({
    test: testName,
    passed,
    details,
    timestamp: new Date().toISOString()
  });
}

/**
 * Submit a case to the backend
 */
async function submitCase(caseData) {
  try {
    const response = await axios.post(`${BASE_URL}/api/submit-case`, caseData);
    return response.data;
  } catch (err) {
    throw new Error(`Failed to submit case: ${err.response?.data?.error || err.message}`);
  }
}

/**
 * Analyze a case
 */
async function analyzeCase(caseId) {
  try {
    const response = await axios.post(`${BASE_URL}/api/analyze-case/${caseId}`);
    return response.data;
  } catch (err) {
    throw new Error(`Failed to analyze case: ${err.response?.data?.error || err.message}`);
  }
}

/**
 * Check drug interactions
 */
async function checkInteractions(caseId) {
  try {
    const response = await axios.post(`${BASE_URL}/api/check-case-interactions/${caseId}`);
    return response.data;
  } catch (err) {
    throw new Error(`Failed to check interactions: ${err.response?.data?.error || err.message}`);
  }
}

/**
 * Generate final report
 */
async function generateFinalReport(caseId, doctorNotes) {
  try {
    const response = await axios.post(`${BASE_URL}/api/generate-final-report/${caseId}`, {
      doctorNotes
    });
    return response.data;
  } catch (err) {
    throw new Error(`Failed to generate report: ${err.response?.data?.error || err.message}`);
  }
}

/**
 * Get patient education with language
 */
async function getPatientEducation(caseId, language) {
  try {
    const response = await axios.post(`${BASE_URL}/api/patient-education/${caseId}`, {
      language
    });
    return response.data;
  } catch (err) {
    throw new Error(`Failed to get patient education: ${err.response?.data?.error || err.message}`);
  }
}

/**
 * Retrieve case details
 */
async function getCase(caseId) {
  try {
    const response = await axios.get(`${BASE_URL}/api/case/${caseId}`);
    return response.data.case;
  } catch (err) {
    throw new Error(`Failed to retrieve case: ${err.response?.data?.error || err.message}`);
  }
}

/**
 * TEST 1: Age Parsing
 */
async function testAgeParsing() {
  log.header('TEST 1: Age Parsing & Display');
  
  try {
    log.test('Submitting case with Patient Name: "Deepti", Age: 20');
    
    const caseData = {
      patientName: 'Deepti',
      age: 20,
      gender: 'Female',
      symptoms: 'Heart palpitations, dizziness',
      diagnosis: 'Arrhythmia',
      medications: ['Metoprolol', 'Lisinopril'],
      submissionType: 'text'
    };
    
    const submitRes = await submitCase(caseData);
    const caseId = submitRes.caseId;
    log.success(`Case submitted with ID: ${caseId}`);
    
    log.test('Retrieving case and checking age...');
    const retrievedCase = await getCase(caseId);
    
    if (retrievedCase.age === 20) {
      log.success(`Age correctly retrieved: ${retrievedCase.age}`);
    } else {
      log.error(`Age mismatch! Expected 20, got ${retrievedCase.age}`);
      recordTest('Test 1: Age Parsing', false, `Age mismatch: got ${retrievedCase.age} instead of 20`);
      return;
    }
    
    log.test('Generating analysis to check age in brief...');
    const analysisRes = await analyzeCase(caseId);
    
    if (!analysisRes.success) {
      log.error(`Analysis failed: ${analysisRes.error}`);
      recordTest('Test 1: Age Parsing', false, `Analysis failed: ${analysisRes.error}`);
      return;
    }
    
    log.info(`Brief output:\n${analysisRes.brief?.substring(0, 200) || 'No brief available'}...`);
    
    // Check if brief mentions "20-year-old"
    if (analysisRes.brief && analysisRes.brief.includes('20-year-old')) {
      log.success('✓ Brief correctly mentions "20-year-old"');
      recordTest('Test 1: Age Parsing', true, 'Age 20 correctly shown as "20-year-old" in brief');
    } else if (analysisRes.brief && analysisRes.brief.includes('20')) {
      log.success('✓ Brief mentions age "20"');
      recordTest('Test 1: Age Parsing', true, 'Age 20 correctly shown in brief');
    } else {
      log.warning('⚠️  Brief may not explicitly mention age 20');
      log.info(`Brief text: "${analysisRes.brief}"`);
      recordTest('Test 1: Age Parsing', false, 'Age 20 not found in brief text');
      return;
    }
    
    log.success('TEST 1 PASSED: Age correctly parsed and displayed\n');
    
  } catch (err) {
    log.error(`TEST 1 FAILED: ${err.message}`);
    recordTest('Test 1: Age Parsing', false, err.message);
  }
}

/**
 * TEST 2: Drug Interactions
 */
async function testDrugInteractions() {
  log.header('TEST 2: Drug Interactions Detection');
  
  try {
    log.test('Submitting case with medications: Lisinopril, Amlodipine');
    
    const caseData = {
      patientName: 'John Anderson',
      age: 55,
      gender: 'Male',
      symptoms: 'High blood pressure, fatigue',
      diagnosis: 'Hypertension',
      medications: ['Lisinopril', 'Amlodipine'],
      submissionType: 'text'
    };
    
    const submitRes = await submitCase(caseData);
    const caseId = submitRes.caseId;
    log.success(`Case submitted with ID: ${caseId}`);
    
    log.test('Checking for drug interactions...');
    const interactionRes = await checkInteractions(caseId);
    
    if (!interactionRes.success) {
      log.error(`Interaction check failed: ${interactionRes.error}`);
      recordTest('Test 2: Drug Interactions', false, `Failed: ${interactionRes.error}`);
      return;
    }
    
    log.info(`Interactions found: ${interactionRes.interactions?.length || 0}`);
    log.info(`Severity: ${interactionRes.severity}`);
    log.info(`Warnings: ${interactionRes.warnings?.join(', ') || 'None'}`);
    
    // Verify both drugs are mentioned in case
    const retrievedCase = await getCase(caseId);
    const medsInCase = retrievedCase.medications.join(', ');
    
    if (medsInCase.includes('Lisinopril') && medsInCase.includes('Amlodipine')) {
      log.success('✓ Both medications stored correctly in case');
    } else {
      log.error('✗ Medications not stored correctly');
      recordTest('Test 2: Drug Interactions', false, 'Medications not stored correctly');
      return;
    }
    
    // Check if response includes severity level
    if (interactionRes.severity) {
      log.success(`✓ Severity level detected: ${interactionRes.severity}`);
    } else {
      log.warning('⚠️  No severity level in response');
    }
    
    log.success('TEST 2 PASSED: Drug interactions detected\n');
    recordTest('Test 2: Drug Interactions', true, `${interactionRes.interactions?.length || 0} interactions detected with severity ${interactionRes.severity}`);
    
  } catch (err) {
    log.error(`TEST 2 FAILED: ${err.message}`);
    recordTest('Test 2: Drug Interactions', false, err.message);
  }
}

/**
 * TEST 3: Relevant Papers
 */
async function testRelevantPapers() {
  log.header('TEST 3: Relevant Papers Retrieval');
  
  try {
    log.test('Submitting case with Diagnosis: Type 2 Diabetes');
    
    const caseData = {
      patientName: 'Sarah Kumar',
      age: 60,
      gender: 'Female',
      symptoms: 'Polyuria, polydipsia, fatigue',
      diagnosis: 'Type 2 Diabetes',
      medications: ['Metformin', 'Lisinopril'],
      submissionType: 'text'
    };
    
    const submitRes = await submitCase(caseData);
    const caseId = submitRes.caseId;
    log.success(`Case submitted with ID: ${caseId}`);
    
    log.test('Analyzing case and retrieving papers...');
    const analysisRes = await analyzeCase(caseId);
    
    if (!analysisRes.success) {
      log.error(`Analysis failed: ${analysisRes.error}`);
      recordTest('Test 3: Relevant Papers', false, `Analysis failed: ${analysisRes.error}`);
      return;
    }
    
    const papers = analysisRes.relevantPapers || [];
    log.info(`Papers retrieved: ${papers.length}`);
    
    if (papers.length === 0) {
      log.warning('⚠️  No papers retrieved');
      recordTest('Test 3: Relevant Papers', false, 'No papers retrieved');
      return;
    }
    
    log.info('\n📚 Papers Retrieved:');
    papers.slice(0, 5).forEach((paper, idx) => {
      log.info(`  ${idx + 1}. ${paper.title?.substring(0, 80) || 'No title'}...`);
      if (paper.relevanceScore) {
        log.info(`     Score: ${paper.relevanceScore}`);
      }
    });
    
    // Check if papers mention diabetes
    let diabetesCount = 0;
    papers.forEach(paper => {
      const text = `${paper.title || ''} ${paper.abstract || ''}`.toLowerCase();
      if (text.includes('diabetes') || text.includes('type 2') || text.includes('glucose')) {
        diabetesCount++;
      }
    });
    
    log.info(`\nDiabetes-related papers: ${diabetesCount}/${papers.length}`);
    
    if (diabetesCount >= papers.length * 0.6) {
      log.success(`✓ ${diabetesCount}/${papers.length} papers related to diabetes`);
      recordTest('Test 3: Relevant Papers', true, `${diabetesCount}/${papers.length} papers mention diabetes`);
    } else {
      log.warning(`⚠️  Only ${diabetesCount}/${papers.length} papers mention diabetes`);
      recordTest('Test 3: Relevant Papers', false, `Only ${diabetesCount}/${papers.length} papers related to diabetes`);
    }
    
    log.success('TEST 3 PASSED: Papers retrieved for diagnosis\n');
    
  } catch (err) {
    log.error(`TEST 3 FAILED: ${err.message}`);
    recordTest('Test 3: Relevant Papers', false, err.message);
  }
}

/**
 * TEST 4: Doctor Notes in Report
 */
async function testDoctorNotes() {
  log.header('TEST 4: Doctor Notes in Final Report');
  
  try {
    log.test('Submitting case...');
    
    const caseData = {
      patientName: 'Michael Stevens',
      age: 45,
      gender: 'Male',
      symptoms: 'Chest pain, shortness of breath',
      diagnosis: 'Hypertension',
      medications: ['Amlodipine', 'Atorvastatin'],
      submissionType: 'text'
    };
    
    const submitRes = await submitCase(caseData);
    const caseId = submitRes.caseId;
    log.success(`Case submitted with ID: ${caseId}`);
    
    const doctorNote = 'Patient shows good compliance with treatment plan. Blood pressure well controlled. Continue current medication regimen.';
    log.test(`Adding doctor note: "${doctorNote}"`);
    
    log.test('Generating final report with doctor notes...');
    const reportRes = await generateFinalReport(caseId, doctorNote);
    
    if (!reportRes.success) {
      log.error(`Report generation failed: ${reportRes.error}`);
      recordTest('Test 4: Doctor Notes', false, `Failed: ${reportRes.error}`);
      return;
    }
    
    const report = reportRes.report || reportRes.reportText;
    log.info(`\nReport generated (${report.length} characters)`);
    
    // Check if report contains doctor's assessment section
    if (report.includes("DOCTOR'S ASSESSMENT") || report.includes('DOCTOR\'S ASSESSMENT')) {
      log.success('✓ Report contains Doctor\'s Assessment section');
    } else {
      log.warning('⚠️  Doctor\'s Assessment section not found');
    }
    
    // Check if report contains the exact doctor note
    if (report.includes(doctorNote)) {
      log.success('✓ Doctor note found verbatim in report');
      recordTest('Test 4: Doctor Notes', true, 'Doctor note included verbatim in report');
    } else {
      log.warning('⚠️  Doctor note not found exactly in report');
      // Check for partial match
      if (report.toLowerCase().includes('compliance') && report.toLowerCase().includes('treatment')) {
        log.success('✓ Doctor note content found in report (not exact match)');
        recordTest('Test 4: Doctor Notes', true, 'Doctor note content found in report');
      } else {
        log.error('✗ Doctor note content not found in report');
        recordTest('Test 4: Doctor Notes', false, 'Doctor note not found in report');
        return;
      }
    }
    
    // Show snippet
    const docSection = report.indexOf("DOCTOR'S ASSESSMENT") >= 0 
      ? report.substring(report.indexOf("DOCTOR'S ASSESSMENT"), report.indexOf("DOCTOR'S ASSESSMENT") + 300)
      : report.substring(report.indexOf('ASSESSMENT'), report.indexOf('ASSESSMENT') + 300);
    
    log.info(`\nReport snippet:\n${docSection}...\n`);
    
    log.success('TEST 4 PASSED: Doctor notes included in report\n');
    
  } catch (err) {
    log.error(`TEST 4 FAILED: ${err.message}`);
    recordTest('Test 4: Doctor Notes', false, err.message);
  }
}

/**
 * TEST 5: Language Translation - Kannada
 */
async function testKannadaTranslation() {
  log.header('TEST 5: Language Translation - Kannada');
  
  try {
    log.test('Submitting case...');
    
    const caseData = {
      patientName: 'Priya Sharma',
      age: 35,
      gender: 'Female',
      symptoms: 'Joint pain, stiffness',
      diagnosis: 'Rheumatoid Arthritis',
      medications: ['Methotrexate', 'Prednisone'],
      submissionType: 'text'
    };
    
    const submitRes = await submitCase(caseData);
    const caseId = submitRes.caseId;
    log.success(`Case submitted with ID: ${caseId}`);
    
    log.test('Generating patient education in Kannada...');
    const eduRes = await getPatientEducation(caseId, 'kannada');
    
    if (!eduRes.success) {
      log.error(`Patient education failed: ${eduRes.error}`);
      recordTest('Test 5: Kannada Translation', false, `Failed: ${eduRes.error}`);
      return;
    }
    
    const translated = eduRes.translatedText;
    log.info(`\nTranslated text (${translated.length} characters):`);
    log.info(`"${translated.substring(0, 200)}..."\n`);
    
    // Check for Kannada characters (ಕ ನ ಾ ೆ ರ ಿ ತ)
    const kannadaChars = ['\u0C95', '\u0CA8', '\u0CBE', '\u0CBE', '\u0CB0', '\u0CBF', '\u0CA4', '\u0CBF'];
    let kannadaFound = false;
    
    kannadaChars.forEach(char => {
      if (translated.includes(char)) {
        kannadaFound = true;
      }
    });
    
    if (kannadaFound) {
      log.success('✓ Kannada characters detected in output');
      recordTest('Test 5: Kannada Translation', true, 'Output contains Kannada script');
    } else {
      log.warning('⚠️  Kannada characters not detected');
      log.info('Sample characters in output:');
      const uniqueChars = new Set(translated.split('').filter(c => c.charCodeAt(0) > 127));
      Array.from(uniqueChars).slice(0, 10).forEach(char => {
        log.info(`  - ${char} (U+${char.charCodeAt(0).toString(16).toUpperCase()})`);
      });
      recordTest('Test 5: Kannada Translation', false, 'No Kannada script detected');
      return;
    }
    
    log.success('TEST 5 PASSED: Kannada translation working\n');
    
  } catch (err) {
    log.error(`TEST 5 FAILED: ${err.message}`);
    recordTest('Test 5: Kannada Translation', false, err.message);
  }
}

/**
 * TEST 6: Language Translation - Hindi
 */
async function testHindiTranslation() {
  log.header('TEST 6: Language Translation - Hindi');
  
  try {
    log.test('Submitting case...');
    
    const caseData = {
      patientName: 'Rajesh Patel',
      age: 50,
      gender: 'Male',
      symptoms: 'Persistent cough, chest tightness',
      diagnosis: 'Asthma',
      medications: ['Albuterol', 'Fluticasone'],
      submissionType: 'text'
    };
    
    const submitRes = await submitCase(caseData);
    const caseId = submitRes.caseId;
    log.success(`Case submitted with ID: ${caseId}`);
    
    log.test('Generating patient education in Hindi...');
    const eduRes = await getPatientEducation(caseId, 'hindi');
    
    if (!eduRes.success) {
      log.error(`Patient education failed: ${eduRes.error}`);
      recordTest('Test 6: Hindi Translation', false, `Failed: ${eduRes.error}`);
      return;
    }
    
    const translated = eduRes.translatedText;
    log.info(`\nTranslated text (${translated.length} characters):`);
    log.info(`"${translated.substring(0, 200)}..."\n`);
    
    // Check for Hindi characters (ह ि न ् द ी े ु)
    const hindiChars = ['\u0939', '\u093F', '\u0928', '\u094D', '\u0926', '\u0940', '\u0947', '\u0941'];
    let hindiFound = false;
    
    hindiChars.forEach(char => {
      if (translated.includes(char)) {
        hindiFound = true;
      }
    });
    
    if (hindiFound) {
      log.success('✓ Hindi characters detected in output');
      recordTest('Test 6: Hindi Translation', true, 'Output contains Hindi script');
    } else {
      log.warning('⚠️  Hindi characters not detected');
      log.info('Sample characters in output:');
      const uniqueChars = new Set(translated.split('').filter(c => c.charCodeAt(0) > 127));
      Array.from(uniqueChars).slice(0, 10).forEach(char => {
        log.info(`  - ${char} (U+${char.charCodeAt(0).toString(16).toUpperCase()})`);
      });
      recordTest('Test 6: Hindi Translation', false, 'No Hindi script detected');
      return;
    }
    
    log.success('TEST 6 PASSED: Hindi translation working\n');
    
  } catch (err) {
    log.error(`TEST 6 FAILED: ${err.message}`);
    recordTest('Test 6: Hindi Translation', false, err.message);
  }
}

/**
 * TEST 7: Language Translation - Telugu
 */
async function testTeluguTranslation() {
  log.header('TEST 7: Language Translation - Telugu');
  
  try {
    log.test('Submitting case...');
    
    const caseData = {
      patientName: 'Lakshmi Reddy',
      age: 42,
      gender: 'Female',
      symptoms: 'Headaches, nausea, dizziness',
      diagnosis: 'Migraine',
      medications: ['Sumatriptan', 'Propranolol'],
      submissionType: 'text'
    };
    
    const submitRes = await submitCase(caseData);
    const caseId = submitRes.caseId;
    log.success(`Case submitted with ID: ${caseId}`);
    
    log.test('Generating patient education in Telugu...');
    const eduRes = await getPatientEducation(caseId, 'telugu');
    
    if (!eduRes.success) {
      log.error(`Patient education failed: ${eduRes.error}`);
      recordTest('Test 7: Telugu Translation', false, `Failed: ${eduRes.error}`);
      return;
    }
    
    const translated = eduRes.translatedText;
    log.info(`\nTranslated text (${translated.length} characters):`);
    log.info(`"${translated.substring(0, 200)}..."\n`);
    
    // Check for Telugu characters (త ల గ ు ఖ ృ ం ః)
    const teluguChars = ['\u0C24', '\u0C32', '\u0C17', '\u0C41', '\u0C16', '\u0C43', '\u0C02', '\u0C03'];
    let teluguFound = false;
    
    teluguChars.forEach(char => {
      if (translated.includes(char)) {
        teluguFound = true;
      }
    });
    
    if (teluguFound) {
      log.success('✓ Telugu characters detected in output');
      recordTest('Test 7: Telugu Translation', true, 'Output contains Telugu script');
    } else {
      log.warning('⚠️  Telugu characters not detected');
      log.info('Sample characters in output:');
      const uniqueChars = new Set(translated.split('').filter(c => c.charCodeAt(0) > 127));
      Array.from(uniqueChars).slice(0, 10).forEach(char => {
        log.info(`  - ${char} (U+${char.charCodeAt(0).toString(16).toUpperCase()})`);
      });
      recordTest('Test 7: Telugu Translation', false, 'No Telugu script detected');
      return;
    }
    
    log.success('TEST 7 PASSED: Telugu translation working\n');
    
  } catch (err) {
    log.error(`TEST 7 FAILED: ${err.message}`);
    recordTest('Test 7: Telugu Translation', false, err.message);
  }
}

/**
 * Print final test summary
 */
function printSummary() {
  log.header('COMPREHENSIVE TEST SUITE - FINAL SUMMARY');
  
  const totalTests = testResults.length;
  const passedTests = testResults.filter(t => t.passed).length;
  const failedTests = totalTests - passedTests;
  const passPercentage = ((passedTests / totalTests) * 100).toFixed(1);
  
  console.log(`Total Tests: ${totalTests}`);
  console.log(`${colors.green}Passed: ${passedTests}${colors.reset}`);
  console.log(`${colors.red}Failed: ${failedTests}${colors.reset}`);
  console.log(`Success Rate: ${colors.bright}${passPercentage}%${colors.reset}\n`);
  
  log.test('Test Results:');
  testResults.forEach((result, idx) => {
    const status = result.passed ? colors.green + '✅ PASS' : colors.red + '❌ FAIL';
    console.log(`${idx + 1}. ${status}${colors.reset} - ${result.test}`);
    if (result.details) {
      console.log(`   ${colors.cyan}${result.details}${colors.reset}`);
    }
  });
  
  console.log(`\n${colors.bright}${colors.cyan}${'═'.repeat(80)}${colors.reset}`);
  
  if (failedTests === 0) {
    log.success(`ALL ${totalTests} TESTS PASSED! 🎉`);
  } else {
    log.warning(`${failedTests} test(s) need attention`);
  }
  
  console.log(`${colors.bright}${colors.cyan}${'═'.repeat(80)}${colors.reset}\n`);
}

/**
 * Main execution
 */
async function runAllTests() {
  console.clear();
  log.header('MEDGPT PRO - COMPREHENSIVE TEST SUITE');
  log.info('Starting comprehensive functionality tests...');
  log.info(`Backend URL: ${BASE_URL}`);
  log.info(`Timestamp: ${new Date().toISOString()}\n`);
  
  try {
    // Run all tests in sequence
    await testAgeParsing();
    await testDrugInteractions();
    await testRelevantPapers();
    await testDoctorNotes();
    await testKannadaTranslation();
    await testHindiTranslation();
    await testTeluguTranslation();
    
    // Print final summary
    printSummary();
    
  } catch (err) {
    log.error(`Unexpected error during tests: ${err.message}`);
  }
  
  // Exit after tests complete
  setTimeout(() => {
    process.exit(testResults.some(t => !t.passed) ? 1 : 0);
  }, 1000);
}

// Run tests
runAllTests();
