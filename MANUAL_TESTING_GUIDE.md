# � COMPLETE MANUAL TESTING GUIDE FOR MEDGPT PRO

## ✅ SERVERS STATUS

Both servers are now running:
- ✅ **Backend:** http://localhost:5000
- ✅ **Frontend:** http://localhost:3000
- ✅ **MongoDB:** Connected
- ✅ **Ollama AI:** Ready

---

## 🎯 MANUAL TESTING SCENARIOS

### **SCENARIO 1: Submit a Patient Case**

#### Step 1: Open the Application
1. Open your browser
2. Go to **http://localhost:3000**
3. You should see the MedGPT Pro interface

#### Step 2: Fill in Case Information
```
Patient Name:     John Anderson
Age:              45
Gender:           Male
Symptoms:         High blood pressure, fatigue, headaches
Diagnosis:        Hypertension
Medications:      Lisinopril, Amlodipine
Submission Type:  Text
```

#### Step 3: Submit Case
- Click "Submit Case" button
- You should see success message with Case ID
- **Expected:** Case ID appears (e.g., `650a2f9c8d4e2b1a3f5g6h7i`)

#### What to Verify
✅ Case submitted successfully  
✅ Case ID received  
✅ No error messages  
✅ Confirmation appears on screen

---

### **SCENARIO 2: Test Age Parsing (CRITICAL)**

#### Step 1: Submit Case with Age 20
```
Patient Name:     Deepti Sharma
Age:              20 (IMPORTANT: Use 20 to test age bug fix)
Gender:           Female
Symptoms:         Heart palpitations, dizziness
Diagnosis:        Arrhythmia
Medications:      Metoprolol
```

#### Step 2: Analyze Case
1. After case submission, click "Analyze Case"
2. Wait for analysis to complete
3. Look at the AI Brief section

#### What to Verify
✅ Age shows as "20" (not any other number like 55)  
✅ Brief mentions "20-year-old patient"  
✅ Age appears in clinical analysis  
✅ No age discrepancies

#### Example Expected Output
```
"A 20-year-old female patient presents with palpitations and 
dizziness. The diagnosis of Arrhythmia has been confirmed. At 
this age, arrhythmia requires careful management..."
```

**🎯 CRITICAL TEST:** If you see age as 55 or any other number instead of 20, the bug is NOT fixed!

---

### **SCENARIO 3: Test Drug Interactions**

#### Step 1: Submit Case with Multiple Medications
```
Patient Name:     Robert Singh
Age:              55
Gender:           Male
Symptoms:         Hypertension, fatigue
Diagnosis:        Hypertension
Medications:      Lisinopril, Amlodipine (These interact!)
```

#### Step 2: Check Interactions
1. After submission, look for "Check Interactions" button
2. Click it
3. Wait for interaction analysis

#### What to Verify
✅ Both medications appear in list  
✅ Interaction detected between Lisinopril + Amlodipine  
✅ Severity level shown (should be "moderate")  
✅ Warning about hypotension appears  
✅ Clinical guidance provided

#### Example Expected Output
```
Interaction Found: Lisinopril + Amlodipine
Severity: MODERATE
Warning: Combined ACE inhibitor and calcium channel blocker 
may cause excessive blood pressure lowering (hypotension)
Risk Level: Requires monitoring
```

---

### **SCENARIO 4: Test Relevant Papers (CRITICAL)**

#### Step 1: Submit Case with Diabetes
```
Patient Name:     Sarah Kumar
Age:              60
Gender:           Female
Symptoms:         Polyuria, polydipsia, fatigue
Diagnosis:        Type 2 Diabetes
Medications:      Metformin, Lisinopril
```

#### Step 2: View Papers
1. After submission, click "Analyze Case"
2. Scroll to "Relevant Papers" section
3. Review the papers returned

#### What to Verify
✅ 5 papers retrieved  
✅ ALL papers mention "Type 2 Diabetes"  
✅ Papers include treatment options  
✅ Papers include management strategies  
✅ **NO papers about kidney disease or other unrelated conditions**  
✅ Papers sorted by relevance score

#### Example Expected Papers
```
1. "Insulin injection therapy switching in Type 2 Diabetes"
2. "Metformin and cardiovascular benefits in Type 2 Diabetes"
3. "Yoga and exercise for Type 2 Diabetes management"
4. "Dietary intervention in Type 2 Diabetes"
5. "Long-term complications prevention in Type 2 Diabetes"
```

**🎯 CRITICAL TEST:** If you see papers about kidney disease or other unrelated topics, the paper filtering is NOT working!

---

### **SCENARIO 5: Test Doctor Notes**

#### Step 1: Submit Case
```
Patient Name:     Michael Stevens
Age:              50
Gender:           Male
Symptoms:         Chest pain, shortness of breath
Diagnosis:        Hypertension
Medications:      Amlodipine, Atorvastatin
```

#### Step 2: Add Doctor Notes
1. After case submission, click "Add Doctor Notes"
2. Enter this exact text:
```
Patient shows good compliance with treatment plan. Blood pressure 
well controlled on current medications. Continue current regimen. 
Follow-up in 4 weeks. Monitor for any adverse effects.
```

#### Step 3: Generate Final Report
1. Click "Generate Final Report"
2. Scroll to "Doctor's Assessment" section
3. Verify doctor notes appear

#### What to Verify
✅ Doctor note section visible  
✅ Exact text appears (verbatim)  
✅ Not summarized or paraphrased  
✅ Proper formatting maintained  
✅ Can download/print report

#### Example Expected Output
```
═══════════════════════════════════════════════════════════
DOCTOR'S ASSESSMENT & NOTES
═══════════════════════════════════════════════════════════
Patient shows good compliance with treatment plan. Blood pressure 
well controlled on current medications. Continue current regimen. 
Follow-up in 4 weeks. Monitor for any adverse effects.
```

---

### **SCENARIO 6: Test Kannada Translation**

#### Step 1: Submit Case
```
Patient Name:     Priya Reddy
Age:              35
Gender:           Female
Symptoms:         Joint pain, stiffness
Diagnosis:        Rheumatoid Arthritis
Medications:      Methotrexate
```

#### Step 2: Request Kannada Translation
1. After submission, click "Patient Education"
2. Select "Kannada" from language dropdown
3. Generate patient education

#### Step 3: Verify Output
1. Look for Kannada characters
2. Should see text like: `ರೋಗಿ ಶಿಕ್ಷಣ` or `ಸೂಚನೆ`
3. Not English text

#### What to Verify
✅ Language changed to Kannada  
✅ Kannada characters visible (ರ, ೋ, ಗ, ಿ, ಶ, ಿ, ಕ, ಾ)  
✅ Not showing English text  
✅ Text is readable in Kannada script  
✅ Medical terms properly translated

#### Example Expected Kannada Text
```
ರೋಗಿ ಶಿಕ್ಷಣ: ಮೆಥೋಟ್ರೆಕ್ಸೇಟ್ ಆಸ್ಪರ್ಜನ ಚಿಕಿತ್ಸೆ ರುಮಾಟಿಸ್ 
ಗ್ರಂಥಿಸಂವತ್ಸರ ರೋಗದ ವಿರುದ್ಧ ಪರಿಣಾಮಕಾರಿ ಚಿಕಿತ್ಸೆ...
```

---

### **SCENARIO 7: Test Hindi Translation**

#### Step 1: Submit Case
```
Patient Name:     Rajesh Patel
Age:              50
Gender:           Male
Symptoms:         Persistent cough, chest tightness
Diagnosis:        Asthma
Medications:      Albuterol, Fluticasone
```

#### Step 2: Request Hindi Translation
1. After submission, click "Patient Education"
2. Select "Hindi" from language dropdown
3. Generate patient education

#### Step 3: Verify Output
1. Look for Hindi characters
2. Should see text like: `रोगी शिक्षा` or `सूचना`
3. Not English text

#### What to Verify
✅ Language changed to Hindi  
✅ Hindi characters visible (र, ो, ग, ी, श, ि, क, ा)  
✅ Not showing English text  
✅ Text is readable in Hindi script  
✅ Medical terms properly translated

#### Example Expected Hindi Text
```
रोगी शिक्षा: अल्बुटेरॉल और फ्लूटिकेसोन दमा प्रबंधन के लिए 
महत्वपूर्ण दवाएं हैं। नियमित रूप से दवा लें और डॉक्टर के 
निर्देशों का पालन करें...
```

---

### **SCENARIO 8: Test Telugu Translation**

#### Step 1: Submit Case
```
Patient Name:     Lakshmi Reddy
Age:              42
Gender:           Female
Symptoms:         Headaches, nausea, dizziness
Diagnosis:        Migraine
Medications:      Sumatriptan, Propranolol
```

#### Step 2: Request Telugu Translation
1. After submission, click "Patient Education"
2. Select "Telugu" from language dropdown
3. Generate patient education

#### Step 3: Verify Output
1. Look for Telugu characters
2. Should see text like: `రోగి విద్య` or `సూచన`
3. Not English text

#### What to Verify
✅ Language changed to Telugu  
✅ Telugu characters visible (త, ల, గ, ు, ర, ీ, ప, ు)  
✅ Not showing English text  
✅ Text is readable in Telugu script  
✅ Medical terms properly translated

#### Example Expected Telugu Text
```
రోగి విద్య: సుమాట్రిప్టాన్ మరియు ప్రోప్రానోలాల్ మైగ్రేన్ 
చికిత్సకు ఉపయోగించే ఔషధాలు. ఈ మందులను నియమితంగా 
తీసుకోండి మరియు డాక్టర్ సూచనలను అనుసరించండి...
```

---

## 🔧 TESTING CHECKLIST

### Basic Functionality
- [ ] Can access frontend at http://localhost:3000
- [ ] Can access backend at http://localhost:5000
- [ ] MongoDB shows as connected
- [ ] No console errors in browser
- [ ] No console errors in terminal

### Case Submission
- [ ] Can fill case form
- [ ] Can submit case
- [ ] Receive case ID
- [ ] Case saved to database

### Age Parsing (CRITICAL)
- [ ] Age 20 displays as "20-year-old" (not any other number)
- [ ] Age appears in brief
- [ ] Age appears in analysis
- [ ] Multiple age tests work correctly

### Drug Interactions
- [ ] Multiple medications detected
- [ ] Interactions found when they exist
- [ ] Severity level displayed
- [ ] Clinical warnings shown
- [ ] No false positives

### Paper Retrieval (CRITICAL)
- [ ] Papers retrieved for diagnosis
- [ ] All papers relevant to diagnosis
- [ ] No unrelated papers
- [ ] Papers sorted by relevance
- [ ] Relevance scores visible

### Doctor Notes
- [ ] Notes can be entered
- [ ] Notes saved correctly
- [ ] Notes appear in report verbatim
- [ ] Doctor's Assessment section present
- [ ] Report can be generated

### Language Support
- [ ] Kannada text renders correctly
- [ ] Hindi text renders correctly
- [ ] Telugu text renders correctly
- [ ] Medical terms properly translated
- [ ] No encoding issues
- [ ] Script changes when language selected

### Overall System
- [ ] No server crashes
- [ ] No database errors
- [ ] Responsive UI
- [ ] Fast loading
- [ ] Professional appearance

---

## 🐛 COMMON ISSUES & SOLUTIONS

### Issue: Can't access http://localhost:3000
**Solution:**
```bash
# Check if frontend is running
netstat -ano | findstr ":3000"

# If not running, start it
cd "c:\Users\user\OneDrive\Documents\Desktop\medgpt-pro\frontend"
npm start
```

### Issue: Can't access http://localhost:5000
**Solution:**
```bash
# Check if backend is running
netstat -ano | findstr ":5000"

# If not running, start it
cd "c:\Users\user\OneDrive\Documents\Desktop\medgpt-pro\backend"
node server.js
```

### Issue: Age showing wrong value (e.g., 55 instead of 20)
**This is a critical bug!**
- Age bug fix was implemented
- Verify fix by submitting age 20 case
- Should display as "20-year-old"

### Issue: Papers not matching diagnosis
**This is a critical bug!**
- Paper filtering with relevance scoring was implemented
- All papers should match the diagnosis
- If you see unrelated papers, filtering isn't working

### Issue: MongoDB not connecting
**Solution:**
```bash
# Make sure MongoDB is running
# Check MONGODB_URI in .env file
# Restart backend server
cd "c:\Users\user\OneDrive\Documents\Desktop\medgpt-pro\backend"
node server.js
```

### Issue: Kannada/Hindi/Telugu not displaying
**Solution:**
- Ensure browser supports UTF-8 encoding
- Check if language translation works
- Verify Ollama or fallback translation is active
- Try refreshing page

---

## 📝 TEST RESULTS LOG

Use this template to record your testing:

```
Test Date: ___________
Test Tester: ___________

TEST 1: Age Parsing
- Input Age: 20
- Displayed As: ______________
- Result: ✅ PASS / ❌ FAIL
- Notes: _________________________

TEST 2: Drug Interactions
- Medications: Lisinopril, Amlodipine
- Interaction Detected: ✅ YES / ❌ NO
- Severity: ______________
- Result: ✅ PASS / ❌ FAIL
- Notes: _________________________

TEST 3: Paper Retrieval
- Diagnosis: Type 2 Diabetes
- Papers Found: _____ (should be 5)
- All Relevant: ✅ YES / ❌ NO
- Result: ✅ PASS / ❌ FAIL
- Notes: _________________________

TEST 4: Doctor Notes
- Notes Entered: ______________
- Notes in Report: ✅ YES / ❌ NO
- Verbatim: ✅ YES / ❌ NO
- Result: ✅ PASS / ❌ FAIL
- Notes: _________________________

TEST 5: Kannada Translation
- Kannada Text Visible: ✅ YES / ❌ NO
- Characters: ______________
- Result: ✅ PASS / ❌ FAIL
- Notes: _________________________

TEST 6: Hindi Translation
- Hindi Text Visible: ✅ YES / ❌ NO
- Characters: ______________
- Result: ✅ PASS / ❌ FAIL
- Notes: _________________________

TEST 7: Telugu Translation
- Telugu Text Visible: ✅ YES / ❌ NO
- Characters: ______________
- Result: ✅ PASS / ❌ FAIL
- Notes: _________________________

OVERALL RESULT: ✅ ALL PASS / ⚠️ SOME ISSUES
```

---

## 🎬 QUICK START MANUAL TESTING

### 5-Minute Quick Test
1. Open http://localhost:3000
2. Submit case with Age 20
3. Click "Analyze Case"
4. Verify age shows as "20-year-old"
5. Check if papers are about diabetes (if diagnosis is diabetes)

### 15-Minute Full Test
1. Test age parsing (age 20)
2. Test drug interactions (Lisinopril + Amlodipine)
3. Test paper filtering (Type 2 Diabetes)
4. Test doctor notes (add and verify)
5. Test one language (Kannada or Hindi or Telugu)

### Complete Test (30 minutes)
1. Test all 7 scenarios listed above
2. Fill out test results log
3. Document any issues
4. Take screenshots of results
5. Verify all functionality working

---

## ✅ FINAL VERIFICATION

**Before considering system "Ready for Production":**

- [ ] Age parsing works correctly (critical)
- [ ] Paper filtering works correctly (critical)
- [ ] Drug interactions detected
- [ ] Doctor notes preserved
- [ ] All 3 languages working
- [ ] No major bugs found
- [ ] Performance acceptable
- [ ] Database connectivity stable
- [ ] UI responsive and professional
- [ ] All features functional

---

## 📞 SUPPORT

If you encounter any issues:
1. Check the common issues section above
2. Review the test results log
3. Take screenshots of the issue
4. Note the exact steps to reproduce

**System Documentation:**
- Backend API: `backend/server.js`
- Frontend Code: `frontend/src/`
- Database: MongoDB Atlas
- AI Model: Ollama

---

**Happy Testing! 🎉**

If all tests pass, the system is ready for production deployment!
