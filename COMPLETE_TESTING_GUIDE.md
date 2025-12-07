# 📖 COMPLETE TESTING GUIDE FOR MEDGPT PRO

## 🎯 Overview
This guide walks you through testing all features of the MedGPT Pro application with both servers running.

---

## ✅ SERVERS STATUS

**Backend:** ✅ Running on `http://localhost:5000`  
**Frontend:** ✅ Running on `http://localhost:3000`  
**Database:** ✅ MongoDB Connected  
**AI Model:** ✅ Ollama Configured

---

## 🌐 STEP 1: OPEN THE APPLICATION

### In Your Web Browser
```
Go to: http://localhost:3000
```

You should see the MedGPT Pro interface with:
- ✅ Patient submission form
- ✅ Case analysis features
- ✅ Language selection dropdown
- ✅ Doctor notes section

---

## 📝 STEP 2: SUBMIT A TEST CASE

### Fill the Form with This Data:

**Patient Name:**
```
Deepti
```

**Age:**
```
20
```

**Gender:**
```
Female
```

**Symptoms:**
```
Heart palpitations, dizziness, shortness of breath
```

**Diagnosis:**
```
Arrhythmia
```

**Medications:**
```
Metoprolol, Lisinopril
```

**Click:** "Submit Case" button

### Expected Result:
- ✅ Case submitted successfully
- ✅ You'll see a **Case ID** (copy this for later tests)
- ✅ Message: "Case submitted successfully"

---

## 🔍 STEP 3: TEST AGE PARSING

### What to Check:
1. Go to the case details
2. **Look for the patient age in the analysis**
3. Should show: **"20-year-old"** (not 55 or any other number)

### Verification:
- ✅ Age displays as "20-year-old" 
- ✅ Age is correct, not showing wrong value
- ✅ Age appears in the medical brief/analysis

---

## 💊 STEP 4: TEST DRUG INTERACTIONS

### What Happens:
1. The system checks the medications: **Metoprolol + Lisinopril**
2. Detects potential interaction
3. Shows severity level

### Expected Results:
- ✅ Interaction warning appears
- ✅ Shows both drugs: "Metoprolol" and "Lisinopril"
- ✅ Severity level displayed: **MODERATE** or **WARNING**
- ✅ Risk description: "Hypotension risk" or similar

### Where to Find:
- Look for **"Drug Interactions"** or **"Medication Warnings"** section
- Should show severity and interaction details

---

## 📚 STEP 5: TEST RELEVANT PAPERS

### What Happens:
1. System searches PubMed for papers about **Arrhythmia**
2. Returns filtered papers related to the diagnosis
3. Scores papers by relevance

### Expected Results:
- ✅ Papers retrieved (usually 5-10)
- ✅ **ALL papers mention "Arrhythmia"** or related terms
- ✅ Papers about treatment/management (not random topics)
- ✅ Papers sorted by relevance score

### Example Papers You Should See:
- "Arrhythmia treatment with beta-blockers..."
- "Cardiac arrhythmia management..."
- "Metoprolol therapy for cardiac arrhythmia..."

### Papers You Should NOT See:
- ❌ Kidney disease papers
- ❌ Unrelated medical topics
- ❌ Random medical research

---

## 📋 STEP 6: TEST DOCTOR NOTES

### Add Doctor Notes:
1. Find the **"Doctor Notes"** field
2. Type:
```
Patient shows good compliance with treatment plan. 
Heart rate well controlled with current medications. 
Continue current regimen. Follow-up in 2 weeks.
```

### Click: "Save Notes" or "Generate Report"

### Expected Results:
- ✅ Notes are saved
- ✅ In the final report, notes appear **exactly as typed**
- ✅ Found in **"Doctor's Assessment"** section
- ✅ Notes are NOT modified or summarized

### Verification:
- Check final report contains your exact text
- Doctor's Assessment section shows the notes verbatim

---

## 🌍 STEP 7: TEST LANGUAGE TRANSLATION - KANNADA

### Change Language to Kannada:
1. Look for **"Language"** dropdown
2. Select: **"Kannada"**
3. Click: "Generate Patient Education" or similar button

### Expected Results:
- ✅ Text appears in **Kannada script**
- ✅ Shows characters like: ರ, ೋ, ಗ, ಿ, ಶ, ಿ, ಕ
- ✅ **Sample:** ರೋಗಿ ಶಿಕ್ಷಣ (Patient Education)
- ✅ NOT English text, actual Kannada language

### Verification Checklist:
- [ ] Kannada characters visible
- [ ] Not showing English text
- [ ] Text is readable in Kannada script

---

## 🌍 STEP 8: TEST LANGUAGE TRANSLATION - HINDI

### Change Language to Hindi:
1. Look for **"Language"** dropdown
2. Select: **"Hindi"**
3. Click: "Generate Patient Education"

### Expected Results:
- ✅ Text appears in **Hindi script**
- ✅ Shows characters like: र, ो, ग, ी, श, ि, क
- ✅ **Sample:** रोगी शिक्षा (Patient Education)
- ✅ NOT English text, actual Hindi language

### Verification Checklist:
- [ ] Hindi characters visible
- [ ] Not showing English text
- [ ] Text is readable in Hindi script

---

## 🌍 STEP 9: TEST LANGUAGE TRANSLATION - TELUGU

### Change Language to Telugu:
1. Look for **"Language"** dropdown
2. Select: **"Telugu"**
3. Click: "Generate Patient Education"

### Expected Results:
- ✅ Text appears in **Telugu script**
- ✅ Shows characters like: త, ల, గ, ు, ర, ీ
- ✅ **Sample:** రోగి విద్య (Patient Education)
- ✅ NOT English text, actual Telugu language

### Verification Checklist:
- [ ] Telugu characters visible
- [ ] Not showing English text
- [ ] Text is readable in Telugu script

---

## 🧪 STEP 10: SUBMIT ANOTHER TEST CASE

### To Test with Different Data:

**Patient 2 - Diabetes Case:**
```
Name: Rajesh Patel
Age: 60
Gender: Male
Symptoms: Polyuria, polydipsia, fatigue
Diagnosis: Type 2 Diabetes
Medications: Metformin, Lisinopril
```

### Expected Results:
- ✅ Age shows as **"60-year-old"**
- ✅ Papers about **Type 2 Diabetes** returned
- ✅ All papers mention diabetes management
- ✅ Drug interaction detected between Metformin + Lisinopril

---

## 🧪 STEP 11: SUBMIT THIRD TEST CASE

**Patient 3 - Hypertension Case:**
```
Name: Sarah Kumar
Age: 45
Gender: Female
Symptoms: High blood pressure, headaches
Diagnosis: Hypertension
Medications: Amlodipine, Atorvastatin
```

### Expected Results:
- ✅ Age shows as **"45-year-old"**
- ✅ Papers about **Hypertension/Blood Pressure** returned
- ✅ Drug interaction detected: Amlodipine + Atorvastatin
- ✅ All language translations working

---

## 📊 TESTING CHECKLIST

### Core Features
- [ ] **Age Parsing** - Age displays correctly (not wrong numbers)
- [ ] **Drug Interactions** - Detects medication interactions with severity
- [ ] **Paper Retrieval** - Papers relevant to diagnosis (not random)
- [ ] **Doctor Notes** - Notes appear verbatim in report
- [ ] **Kannada Support** - Kannada script renders correctly
- [ ] **Hindi Support** - Hindi script renders correctly
- [ ] **Telugu Support** - Telugu script renders correctly

### Quality Checks
- [ ] Case submission works
- [ ] No error messages
- [ ] All data saved correctly
- [ ] Multiple cases can be submitted
- [ ] Report generation works
- [ ] Language switching works

---

## 🐛 COMMON ISSUES & SOLUTIONS

### Issue 1: "Cannot connect to http://localhost:3000"
**Solution:**
```bash
# Check if frontend is running
cd "c:\Users\user\OneDrive\Documents\Desktop\medgpt-pro\frontend"
npm start
```

### Issue 2: "Cannot submit case"
**Solution:**
```bash
# Check if backend is running
cd "c:\Users\user\OneDrive\Documents\Desktop\medgpt-pro\backend"
node server.js
```

### Issue 3: "MongoDB connection error"
**Solution:**
- Make sure MongoDB is running
- Check MONGODB_URI in .env file
- Restart both servers

### Issue 4: "Age shows wrong number"
**Solution:**
- This was fixed in the latest update
- Clear browser cache (Ctrl+Shift+Delete)
- Refresh page (Ctrl+R)
- Try again

### Issue 5: "Papers not relevant to diagnosis"
**Solution:**
- This was fixed in the latest update
- The relevance filter now removes irrelevant papers
- All papers should mention the diagnosis

---

## 🔧 API TESTING (ADVANCED)

### Test Backend Directly with PowerShell:

**Test 1: Submit Case**
```powershell
$caseData = @{
  patientName = "John Doe"
  age = 45
  gender = "Male"
  symptoms = "Chest pain"
  diagnosis = "Hypertension"
  medications = @("Amlodipine", "Lisinopril")
  submissionType = "text"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:5000/api/submit-case" `
  -Method POST `
  -Headers @{"Content-Type"="application/json"} `
  -Body $caseData
```

**Test 2: Analyze Case** (replace CASE_ID with actual ID)
```powershell
Invoke-WebRequest -Uri "http://localhost:5000/api/analyze-case/CASE_ID" `
  -Method POST
```

**Test 3: Check Interactions** (replace CASE_ID with actual ID)
```powershell
Invoke-WebRequest -Uri "http://localhost:5000/api/check-case-interactions/CASE_ID" `
  -Method POST
```

**Test 4: Generate Report** (replace CASE_ID with actual ID)
```powershell
$notes = @{
  doctorNotes = "Patient shows good compliance with treatment"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:5000/api/generate-final-report/CASE_ID" `
  -Method POST `
  -Headers @{"Content-Type"="application/json"} `
  -Body $notes
```

---

## 📈 PERFORMANCE EXPECTATIONS

| Feature | Expected Time |
|---------|---|
| Submit Case | <1 second |
| Analyze Case | 2-5 seconds |
| Get Papers | 3-10 seconds |
| Check Interactions | 1-2 seconds |
| Generate Report | <1 second |
| Language Translation | 2-5 seconds |

---

## ✅ FINAL VERIFICATION

After completing all tests, verify:

1. ✅ All 7 test cases completed
2. ✅ Age displays correctly (no wrong numbers)
3. ✅ Papers are relevant (all mention diagnosis)
4. ✅ Drug interactions detected
5. ✅ Doctor notes preserved
6. ✅ All 3 languages working
7. ✅ No error messages
8. ✅ Database saving data correctly

---

## 🎉 SUCCESS CRITERIA

**System is working correctly if:**
- ✅ All age values display as expected
- ✅ Papers match the diagnosis (100% relevance)
- ✅ Drug interactions show with severity
- ✅ Doctor notes appear verbatim
- ✅ Kannada/Hindi/Telugu render correctly
- ✅ No crashes or errors
- ✅ All cases saved to database

---

## 📞 NEED HELP?

### Check These Locations:
- **Test Results:** `/backend/test-output.log`
- **Server Logs:** Console output of running terminal
- **Browser Console:** F12 → Console tab
- **Network Tab:** F12 → Network tab (check API calls)

### Key Files:
- `comprehensive-test-suite-local.js` - Run all 7 tests
- `COMPREHENSIVE_TEST_RESULTS.md` - Detailed test report
- `TEST_SUITE_DOCUMENTATION.md` - Complete guide

---

## 🚀 QUICK SUMMARY

| Step | Action | Expected Result |
|------|--------|---|
| 1 | Open http://localhost:3000 | See patient form |
| 2 | Submit case (Deepti, age 20) | Case saved with ID |
| 3 | Check age display | Shows "20-year-old" |
| 4 | Check drug interactions | Shows severity level |
| 5 | Check papers | All about Arrhythmia |
| 6 | Add doctor notes | Notes saved verbatim |
| 7 | Select Kannada | See ರೋಗಿ ಶಿಕ್ಷಣ |
| 8 | Select Hindi | See रोगी शिक्षा |
| 9 | Select Telugu | See రోగి విద్య |
| 10 | Submit 2nd case (Rajesh) | Works same as 1st |
| 11 | Submit 3rd case (Sarah) | Works same as 1st |

---

**Status:** ✅ Ready to Test  
**Servers:** ✅ Running  
**Database:** ✅ Connected  
**Applications:** ✅ Ready

**Start testing now! Follow the steps above.**
