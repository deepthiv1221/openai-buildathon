# 🎯 MANUAL TESTING - START HERE

## ✅ YOUR SERVERS ARE RUNNING RIGHT NOW

Both servers are live and ready for testing:
- **Frontend:** http://localhost:3000 (Open this in your browser!)
- **Backend:** http://localhost:5000 (API running)
- **Database:** MongoDB Connected ✅
- **AI Model:** Ollama Ready ✅

---

## 📚 DOCUMENTATION PROVIDED

Three comprehensive guides have been created for you:

### 1. **QUICK_TESTING_REFERENCE.md** (⚡ START HERE!)
   - 5-minute quick test overview
   - 7 test scenarios summarized
   - Critical bugs to watch for
   - If you have 5-10 minutes, read THIS

### 2. **MANUAL_TESTING_GUIDE.md** (📚 COMPREHENSIVE)
   - Complete detailed instructions for all 7 tests
   - Step-by-step testing procedures
   - Expected outputs for each test
   - Troubleshooting section
   - Test results log template
   - If you have 30 minutes and want details, read THIS

### 3. **TEST_EXECUTION_TRACKER.md** (📋 TRACK YOUR RESULTS)
   - Fill this out as you test each scenario
   - Document results for each test
   - Final summary and sign-off
   - Audit trail for quality assurance
   - Print this and fill it out as you go

---

## 🚀 QUICK START (5 MINUTES)

1. **Open Browser:** Go to **http://localhost:3000**
2. **Submit Test Case:**
   - Name: Test Patient
   - Age: **20** (This is the critical test!)
   - Diagnosis: Type 2 Diabetes
   - Medications: Metformin, Lisinopril

3. **Click "Analyze Case"** and wait for results

4. **Check Two Critical Things:**

   **✅ TEST 1 - Age Parsing (CRITICAL):**
   - Look for "20-year-old" in the AI Brief
   - If you see "20-year-old" = ✅ PASS
   - If you see any other number (like 55) = ❌ FAIL

   **✅ TEST 2 - Paper Filtering (CRITICAL):**
   - Scroll down to "Relevant Papers"
   - All 5 papers should mention "Type 2 Diabetes"
   - No papers about kidney disease or unrelated topics
   - If all match = ✅ PASS
   - If some unrelated = ❌ FAIL

**Result:** 2 critical tests in 5 minutes! 🎯

---

## 🎯 FULL TESTING (30 MINUTES)

Follow the **MANUAL_TESTING_GUIDE.md** to test:

1. ✅ Age Parsing (Submit age 20, verify "20-year-old")
2. ✅ Drug Interactions (Lisinopril + Amlodipine = MODERATE severity)
3. ✅ Paper Filtering (All 5 papers match diagnosis)
4. ✅ Doctor Notes (Notes appear verbatim in report)
5. ✅ Kannada Translation (ರೋಗಿ ಶಿಕ್ಷಣ characters visible)
6. ✅ Hindi Translation (रोगी शिक्षा characters visible)
7. ✅ Telugu Translation (రోగి విద్య characters visible)

Use **TEST_EXECUTION_TRACKER.md** to document results!

---

## 🧪 TEST DATA EXAMPLES

### Test Case 1: Age Parsing
```
Name:        Deepti Sharma
Age:         20 ← IMPORTANT: Use 20!
Gender:      Female
Symptoms:    Heart palpitations, dizziness
Diagnosis:   Arrhythmia
Medications: Metoprolol
```
**Verify:** "20-year-old" appears in brief

### Test Case 2: Drug Interactions
```
Name:        Robert Singh
Age:         55
Gender:      Male
Symptoms:    Hypertension, fatigue
Diagnosis:   Hypertension
Medications: Lisinopril, Amlodipine ← These interact!
```
**Verify:** Interaction detected with MODERATE severity

### Test Case 3: Paper Filtering
```
Name:        Sarah Kumar
Age:         60
Gender:      Female
Symptoms:    Excessive thirst, frequent urination
Diagnosis:   Type 2 Diabetes ← This is the key
Medications: Metformin, Lisinopril
```
**Verify:** All 5 papers about diabetes

### Test Case 4: Doctor Notes
```
Name:        Michael Stevens
Age:         50
Gender:      Male
Diagnosis:   Hypertension
Medications: Amlodipine, Atorvastatin
Note:        "Patient shows good compliance..."
```
**Verify:** Note appears exactly as entered

### Test Case 5-7: Languages
```
Test Kannada: Name: Priya Reddy, Diagnosis: Rheumatoid Arthritis
Test Hindi:   Name: Rajesh Patel, Diagnosis: Asthma
Test Telugu:  Name: Lakshmi Reddy, Diagnosis: Migraine
```
**Verify:** Characters in correct language, not English

---

## 🎬 HOW TO TEST - STEP BY STEP

### Step 1: Open Application
```
1. Open your web browser
2. Go to: http://localhost:3000
3. You should see the MedGPT Pro form
```

### Step 2: Fill Case Form
```
1. Patient Name: [Enter name]
2. Age: [Enter age - use 20 for critical test]
3. Gender: [Select Male/Female]
4. Symptoms: [Enter symptoms]
5. Diagnosis: [Enter diagnosis]
6. Medications: [Enter medications, comma-separated]
```

### Step 3: Submit Case
```
1. Click "Submit Case" button
2. Wait for confirmation
3. You'll get a Case ID (note it down)
```

### Step 4: Analyze Case
```
1. Click "Analyze Case" button
2. Wait for AI analysis (takes 5-10 seconds)
3. Check the results displayed
```

### Step 5: Check Results
```
1. Look at AI Brief section → Check age
2. Look at Relevant Papers → Check if all match diagnosis
3. Look at Drug Interactions → Check severity
4. Look at Dr. Notes section → Can add notes here
```

### Step 6: Test Languages (Optional)
```
1. Click "Patient Education"
2. Select language: Kannada, Hindi, or Telugu
3. Click "Generate"
4. Verify correct language characters appear
```

### Step 7: Generate Report (Optional)
```
1. Click "Generate Final Report"
2. Scroll through report
3. Verify all data is correct
4. Can download/print if needed
```

---

## 🔍 CRITICAL BUGS TO WATCH FOR

### 🔴 BUG 1: Age Wrong (CRITICAL)
- **What to look for:** Age shows as different number (e.g., 55 instead of 20)
- **How to test:** Submit case with age 20
- **Expected:** "20-year-old" in brief
- **If wrong:** System has NOT been fixed

### 🔴 BUG 2: Papers Unrelated (CRITICAL)
- **What to look for:** Papers don't match diagnosis
- **How to test:** Submit Type 2 Diabetes diagnosis
- **Expected:** All 5 papers mention diabetes
- **If wrong:** Paper filtering is NOT working

### 🟠 BUG 3: Doctor Notes Changed
- **What to look for:** Notes are summarized or altered
- **How to test:** Add specific note, check in report
- **Expected:** Exact text appears verbatim
- **If wrong:** Notes are being modified

### 🟠 BUG 4: Languages Not Working
- **What to look for:** English showing instead of translation
- **How to test:** Select Kannada/Hindi/Telugu
- **Expected:** Characters in that language
- **If wrong:** Translation is failing

### 🟡 BUG 5: Interactions Not Detected
- **What to look for:** No interaction shown for drug combo
- **How to test:** Use Lisinopril + Amlodipine
- **Expected:** MODERATE severity shown
- **If wrong:** Interaction detection not working

---

## ✅ SUCCESS CRITERIA

### Minimum Requirement (System is Acceptable)
- ✅ Age parsing works correctly
- ✅ Paper filtering returns relevant papers only
- ✅ System doesn't crash
- ✅ Basic features functional

### Ideal Requirement (System is Excellent)
- ✅ Age parsing 100% correct
- ✅ Paper filtering 100% relevant
- ✅ Doctor notes preserved verbatim
- ✅ All language translations working
- ✅ Drug interactions detected
- ✅ Fast response times
- ✅ Professional UI
- ✅ No console errors

---

## 📊 TESTING SUMMARY

| Duration | Tests | Scope |
|----------|-------|-------|
| 5 min | 2 tests | Critical only (age + papers) |
| 15 min | 7 tests | Quick validation |
| 30 min | 7 tests + system | Complete testing |
| 60 min | 7 tests + deep | Full quality assurance |

---

## 🆘 TROUBLESHOOTING

### Can't access http://localhost:3000?
```
✅ Check: netstat -ano | findstr ":3000"
✅ Should see Node process listening on :3000
❌ If not: Start frontend with: cd frontend && npm start
```

### Can't access http://localhost:5000?
```
✅ Check: netstat -ano | findstr ":5000"
✅ Should see Node process listening on :5000
❌ If not: Start backend with: cd backend && node server.js
```

### Page won't load?
```
✅ Try: Hard refresh (Ctrl+Shift+Delete or Cmd+Shift+Delete)
✅ Try: Clearing browser cache
❌ If still fails: Restart backend
```

### Age still wrong?
```
✅ This means the age bug fix didn't work
✅ Check: backend/server.js for age handling
✅ Restart backend and try again
```

### Papers still unrelated?
```
✅ This means paper filtering isn't working
✅ Check: backend/server.js for paper relevance scoring
✅ Restart backend and try again
```

---

## 📞 SUPPORT

All issues/questions? Check these documents in order:

1. **Quick issue?** → Read QUICK_TESTING_REFERENCE.md
2. **Detailed help?** → Read MANUAL_TESTING_GUIDE.md
3. **Document results?** → Fill TEST_EXECUTION_TRACKER.md

---

## 🎯 YOUR ACTION PLAN

### Right Now
1. ✅ Read this document (you're doing it!)
2. ✅ Open http://localhost:3000 in browser
3. ✅ Scroll down to "Quick Start" section

### Next (5 minutes)
1. Submit test case with age 20
2. Click "Analyze"
3. Check if "20-year-old" appears
4. Check if all papers match diagnosis
5. You're done! 🎉

### Optional (30 minutes)
1. Follow MANUAL_TESTING_GUIDE.md
2. Test all 7 scenarios
3. Fill out TEST_EXECUTION_TRACKER.md
4. Document any issues found

---

## 🏁 FINAL CHECKLIST

- [ ] Read this document
- [ ] Verified both servers are running
- [ ] Opened http://localhost:3000
- [ ] Can see MedGPT Pro form
- [ ] Submitted test case
- [ ] Ran analysis
- [ ] Checked critical tests (age + papers)
- [ ] Documented results
- [ ] All systems working? ✅ Report as ready!

---

**You're all set! Start testing now! 🚀**

Questions? Read the comprehensive guides above.

**Status:** ✅ **READY FOR MANUAL TESTING**
