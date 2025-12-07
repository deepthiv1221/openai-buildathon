# ⚡ QUICK TESTING REFERENCE CARD

## 🚀 START HERE

```
✅ Backend:   http://localhost:5000
✅ Frontend:  http://localhost:3000
✅ Database:  MongoDB Connected
✅ AI Model:  Ollama Ready
```

---

## 🧪 7 TEST SCENARIOS AT A GLANCE

### TEST 1️⃣: Age Parsing (CRITICAL)
```
Age Input: 20
Expected: "20-year-old" in brief
❌ FAIL If: Shows 55 or any other number
⏱️  Time: 2 minutes
```

### TEST 2️⃣: Drug Interactions
```
Medications: Lisinopril + Amlodipine
Expected: Severity = "MODERATE"
❌ FAIL If: No interaction detected
⏱️  Time: 2 minutes
```

### TEST 3️⃣: Paper Filtering (CRITICAL)
```
Diagnosis: Type 2 Diabetes
Expected: 5 papers, ALL about diabetes
❌ FAIL If: Papers about other conditions
⏱️  Time: 3 minutes
```

### TEST 4️⃣: Doctor Notes
```
Add: "Patient shows good compliance..."
Expected: Same text in final report
❌ FAIL If: Text is summarized/changed
⏱️  Time: 2 minutes
```

### TEST 5️⃣: Kannada Translation
```
Expected: ರೋಗಿ ಶಿಕ್ಷಣ characters visible
❌ FAIL If: English text showing
⏱️  Time: 1 minute
```

### TEST 6️⃣: Hindi Translation
```
Expected: रोगी शिक्षा characters visible
❌ FAIL If: English text showing
⏱️  Time: 1 minute
```

### TEST 7️⃣: Telugu Translation
```
Expected: రోగి విద్య characters visible
❌ FAIL If: English text showing
⏱️  Time: 1 minute
```

---

## ✅ TEST CHECKLIST (15 minutes)

### Step 1: Access Application
- [ ] Open http://localhost:3000 in browser
- [ ] Page loads without errors
- [ ] All form fields visible

### Step 2: Age Parsing
- [ ] Submit case with age = 20
- [ ] Click "Analyze Case"
- [ ] Verify "20-year-old" in results (NOT 55)
- [ ] Result: ✅ PASS / ❌ FAIL

### Step 3: Drug Interactions
- [ ] Submit case: Lisinopril + Amlodipine
- [ ] Click "Check Interactions"
- [ ] Verify "MODERATE" severity detected
- [ ] Result: ✅ PASS / ❌ FAIL

### Step 4: Paper Filtering
- [ ] Submit case: Type 2 Diabetes diagnosis
- [ ] View papers
- [ ] Count papers (should be ~5)
- [ ] Verify ALL mention diabetes
- [ ] Result: ✅ PASS / ❌ FAIL

### Step 5: Doctor Notes
- [ ] Add doctor note to case
- [ ] Generate report
- [ ] Find doctor note in report
- [ ] Verify text is EXACT (not summarized)
- [ ] Result: ✅ PASS / ❌ FAIL

### Step 6: Languages
- [ ] Test Kannada translation
- [ ] Test Hindi translation
- [ ] Test Telugu translation
- [ ] Result: ✅ PASS / ❌ FAIL

### Step 7: Overall System
- [ ] No console errors
- [ ] No server crashes
- [ ] Fast response times
- [ ] Professional UI
- [ ] Result: ✅ PASS / ❌ FAIL

---

## 🎯 CRITICAL BUGS TO WATCH FOR

| Bug | How to Detect | Impact |
|-----|---------------|--------|
| Age Wrong | Age 20 shows as 55 | 🔴 CRITICAL |
| Papers Wrong | Unrelated papers shown | 🔴 CRITICAL |
| Notes Summarized | Doctor notes changed in report | 🟠 HIGH |
| Language Failed | English showing instead of translation | 🟠 HIGH |
| Interactions Failed | No severity detected for drug combos | 🟡 MEDIUM |

---

## 📊 FINAL CHECKLIST

```
CRITICAL TESTS:
☐ Age Parsing: 20 shows as "20-year-old"
☐ Paper Filter: All 5 papers match diagnosis

HIGH PRIORITY TESTS:
☐ Doctor Notes: Text preserved verbatim
☐ Languages: Kannada, Hindi, Telugu working
☐ Interactions: Severity detected correctly

SYSTEM TESTS:
☐ No console errors
☐ Fast loading
☐ Database connected
☐ All buttons working
```

---

## 🚨 IF TEST FAILS

### Age Still Shows Wrong?
```bash
# Restart backend
cd backend
node server.js
```
Then retest with fresh case.

### Papers Still Unrelated?
```bash
# Check backend logs for filtering
# Restart backend if needed
```
Papers should match diagnosis 100%.

### Languages Not Working?
```bash
# Refresh browser (Ctrl+F5)
# Check browser console for errors
# Restart frontend if needed
```

### Interactions Not Detected?
```bash
# Verify Ollama is running
# Check if Lisinopril + Amlodipine combination exists
# Restart backend
```

---

## ⏱️ TIME ESTIMATES

| Test | Duration |
|------|----------|
| Setup | 0 min (already done) |
| Age Parsing | 2 min |
| Interactions | 2 min |
| Paper Filter | 3 min |
| Doctor Notes | 2 min |
| Languages | 3 min |
| System Check | 2 min |
| **TOTAL** | **~15 min** |

---

## 📱 BROWSER TESTING STEPS

1. **Open Browser** → http://localhost:3000
2. **Fill Patient Info** → Name, Age (20!), Gender
3. **Add Clinical Info** → Symptoms, Diagnosis, Medications
4. **Submit Case** → Get Case ID
5. **Click Analyze** → Wait for AI analysis
6. **Check Results** → Age, Papers, Interactions
7. **Add Notes** → Doctor assessment
8. **Generate Report** → Verify all data present
9. **Test Language** → Select Kannada/Hindi/Telugu

---

## 🎬 SUPER QUICK TEST (5 minutes)

```
1. Open http://localhost:3000
2. Fill: Name=Test, Age=20, Diagnosis=Diabetes
3. Submit
4. Click Analyze
5. Check: Does brief say "20-year-old"?
   ✅ YES = Age parsing WORKS
   ❌ NO  = Age parsing BROKEN
6. Check: Are all papers about diabetes?
   ✅ YES = Paper filter WORKS
   ❌ NO  = Paper filter BROKEN
```

**Result: 2 critical features verified in 5 minutes!**

---

## 📞 QUICK HELP

**Can't access frontend?**
- Check: Is http://localhost:3000 running?
- Fix: `cd frontend && npm start`

**Can't access backend?**
- Check: Is http://localhost:5000 running?
- Fix: `cd backend && node server.js`

**Database not connecting?**
- Check: Is MongoDB URI correct in .env?
- Fix: Restart backend server

**Age still wrong?**
- Clear browser cache (Ctrl+Shift+Delete)
- Restart backend server
- Submit fresh case with age=20

---

## ✅ SUCCESS CRITERIA

**ALL TESTS PASS IF:**
- ✅ Age 20 displays as "20-year-old"
- ✅ All papers match the diagnosis
- ✅ Doctor notes appear verbatim in report
- ✅ Drug interactions detected with severity
- ✅ Kannada, Hindi, Telugu rendering correctly
- ✅ No console errors
- ✅ No server crashes
- ✅ Fast response times

**SYSTEM READY FOR PRODUCTION** = All above ✅

---

**Total Time: 15-30 minutes**
**Difficulty: Easy**
**Tools Needed: Just your browser!**

**Status: Ready to test! 🚀**
