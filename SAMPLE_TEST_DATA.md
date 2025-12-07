# 📋 Sample Test Data for MedGPT Pro

Complete guide with example data to test all 4 functionalities and new features!

---

## 🏥 **SECTION 1: Doctor Dashboard - Submit Patient Case**

### **Patient Case #1: Diabetes Management**

**Form Fields to Fill:**

```
Patient Name:        Rajesh Kumar
Age:                 58
Gender:              Male
Symptoms:            Excessive thirst, frequent urination, fatigue, blurred vision
Diagnosis:           Type 2 Diabetes Mellitus with Hypertension
Medications:         metformin, lisinopril, aspirin
Submission Type:     Text
```

**Expected Result:** 
- ✅ Unique Case ID generated (something like: `507f1f77bcf86cd799439011`)
- ✅ Case stored in database
- ✅ Ready for analysis

---

### **Patient Case #2: Respiratory Condition**

**Form Fields to Fill:**

```
Patient Name:        Priya Sharma
Age:                 42
Gender:              Female
Symptoms:            Persistent dry cough, shortness of breath, chest tightness, wheezing at night
Diagnosis:           Chronic Obstructive Pulmonary Disease (COPD) with Asthma
Medications:         albuterol, fluticasone, ipratropium, omeprazole
Submission Type:     Text
```

**Expected Result:**
- ✅ Different Case ID from Patient #1
- ✅ Case stored successfully

---

### **Patient Case #3: Cardiac Condition**

**Form Fields to Fill:**

```
Patient Name:        Arjun Patel
Age:                 65
Gender:              Male
Symptoms:            Chest pain, shortness of breath, irregular heartbeat, dizziness
Diagnosis:           Myocardial Infarction (Heart Attack) with Arrhythmia
Medications:         warfarin, bisoprolol, atorvastatin, nitroglycerin
Submission Type:     Text
```

**Expected Result:**
- ✅ Another unique Case ID
- ✅ Ready for drug interaction checking (warfarin + aspirin = SEVERE!)

---

## 🔬 **SECTION 2: Doctor Dashboard - AI Case Analysis**

### **Using Case from Patient #1 (Diabetes)**

**Steps:**
1. Go to **🏥 Doctor Dashboard** tab
2. Click **🔬 Analysis** tab
3. Paste the Case ID from Patient #1 (Diabetes case)
4. Click **Analyze** button

**Expected Output:**
```
AI Brief should include:
- Type 2 Diabetes characteristics
- Hypertension complications
- Risk factors for cardiovascular disease
- Recommended monitoring parameters
- Lifestyle modifications
```

---

## ⚠️ **SECTION 3: Doctor Dashboard - Drug Interactions Checker**

### **Test Scenario #1: SEVERE Interaction**

**Drugs to Check:**
```
Drug 1: aspirin
Drug 2: warfarin
Drug 3: ibuprofen
```

**Steps:**
1. Go to **👨‍⚕️ Doctor Dashboard**
2. Click **⚠️ Interactions** tab
3. Type "aspirin" → Click **➕ Add Drug**
4. Type "warfarin" → Click **➕ Add Drug**
5. Type "ibuprofen" → Click **➕ Add Drug**
6. Click **🔍 Check Interactions**

**Expected Results:**
```
Interaction 1: aspirin + warfarin
  Severity: SEVERE
  Notes: Increased bleeding risk. Monitor INR closely.

Interaction 2: aspirin + ibuprofen
  Severity: MODERATE
  Notes: Both are NSAIDs. Avoid combination, risk of GI bleeding.

Interaction 3: warfarin + ibuprofen
  Severity: SEVERE
  Notes: NSAIDs increase bleeding risk with warfarin.
```

---

### **Test Scenario #2: MODERATE Interaction**

**Drugs to Check:**
```
Drug 1: metformin
Drug 2: insulin
Drug 3: alcohol
```

**Steps:**
1. Click **⚠️ Interactions** tab
2. Clear previous drugs (click ✕ on each)
3. Add: metformin, insulin, alcohol
4. Click **🔍 Check Interactions**

**Expected Results:**
```
Interaction 1: metformin + insulin
  Severity: MODERATE
  Notes: Both lower blood sugar. Risk of hypoglycemia.

Interaction 2: insulin + alcohol
  Severity: MODERATE
  Notes: Alcohol can potentiate hypoglycemic effect.
```

---

### **Test Scenario #3: NO Interactions**

**Drugs to Check:**
```
Drug 1: paracetamol
Drug 2: amoxicillin
```

**Steps:**
1. Click **⚠️ Interactions** tab
2. Add: paracetamol, amoxicillin
3. Click **🔍 Check Interactions**

**Expected Results:**
```
✅ No significant drug interactions found!
```

---

## 🎤 **SECTION 4: Doctor Dashboard - Voice Q&A**

### **Test Voice Questions (for Case #1: Diabetes)**

**Steps:**
1. Go to **❓ Q&A** tab
2. Enter Case ID from Diabetes case
3. Click **Load** button
4. Click **🎤 microphone button** next to question field
5. Speak one of these questions:

**Voice Questions to Ask:**

```
Question 1: "What is the prognosis for this patient?"
Question 2: "What monitoring parameters should we track?"
Question 3: "Are there any contraindications for the current medications?"
Question 4: "What lifestyle changes should this patient make?"
Question 5: "What is the long-term treatment plan?"
```

**Expected Results:**
- ✅ Speech recognized and transcribed to text
- ✅ Text appears in question field
- ✅ You can click 💬 Ask to send it to AI
- ✅ AI responds with medical insights

---

## 👤 **SECTION 5: Patient Portal - Education & Translation**

### **Test Scenario #1: Hindi Translation**

**Steps:**
1. Go to **👤 Patient Portal**
2. Click **हिन्दी (Hindi)** button
3. Enter Case ID from any case you submitted
4. Click **📂 Load My Case**

**Expected Results:**
```
Patient Information should appear in Hindi:
- नाम (Name)
- आयु (Age)
- स्थिति (Condition)
- उपचार (Treatment)

Medical Explanation translated to Hindi:
- "High blood pressure" → "उच्च रक्त चाप"
- "Heart attack" → "दिल का दौरा"
- "Diabetes" → "मधुमेह"
```

---

### **Test Scenario #2: Kannada Translation**

**Steps:**
1. Go to **👤 Patient Portal**
2. Click **ಕನ್ನಡ (Kannada)** button
3. Enter Case ID
4. Click **📂 Load My Case**

**Expected Results:**
```
Everything should appear in Kannada script:
- ಹೆಸರು (Name)
- ವಯಸ್ಸು (Age)
- ರೋಗ (Condition)
- ಉಪಚಾರ (Treatment)

Medical terms in Kannada:
- "High blood pressure" → "ಹೆಚ್ಚಿನ ರಕ್ತ ಒತ್ತಡ"
- "Take medicine daily" → "ದಿನದಿ ಔಷಧ ತೆಗೆದುಕೊಳ್ಳಿ"
```

---

### **Test Scenario #3: Telugu Translation**

**Steps:**
1. Go to **👤 Patient Portal**
2. Click **తెలుగు (Telugu)** button
3. Enter Case ID
4. Click **📂 Load My Case**

**Expected Results:**
```
Everything in Telugu:
- పేరు (Name)
- వయస్సు (Age)
- రుగ్గు (Condition)
- చికిత్స (Treatment)

Medical terms in Telugu:
- "High blood pressure" → "అధిక రక్తపోటు"
- "Follow doctor instructions" → "డాక్టర్ సూచనలను అనుసరించండి"
```

---

### **Test Scenario #4: Patient Q&A in Multiple Languages**

**Steps:**
1. Go to **👤 Patient Portal**
2. Load a case in English
3. Ask a question (e.g., "What should I eat?")
4. Switch to **हिन्दी (Hindi)**
5. Ask the same case again
6. Notice the response is in Hindi!

**Expected:** Questions answered in patient's preferred language

---

## 🧪 **SECTION 6: Complete End-to-End Test Flow**

### **Complete Workflow (15 minutes):**

**Step 1: Submit Case (2 min)**
```
1. Go to 👨‍⚕️ Doctor Dashboard
2. Click 📋 Submit tab
3. Fill Patient Case #1 (Diabetes) data above
4. Click ✅ Submit
5. Copy the Case ID shown
```

**Step 2: Analyze Case (2 min)**
```
1. Click 🔬 Analysis tab
2. Paste Case ID
3. Click Analyze
4. Wait for AI analysis
```

**Step 3: Check Drug Interactions (2 min)**
```
1. Click ⚠️ Interactions tab
2. Add drugs: aspirin, warfarin
3. Click 🔍 Check Interactions
4. See SEVERE warning about bleeding
```

**Step 4: Ask Questions by Voice (2 min)**
```
1. Click ❓ Q&A tab
2. Paste Case ID and Load
3. Click 🎤 microphone button
4. Say: "What's the prognosis?"
5. Click 💬 Ask to get AI response
```

**Step 5: Patient Views in Hindi (2 min)**
```
1. Go to 👤 Patient Portal
2. Select हिन्दी (Hindi)
3. Paste same Case ID
4. Load case
5. See everything in Hindi!
```

**Step 6: Try Different Language (3 min)**
```
1. Change to ಕನ್ನಡ (Kannada)
2. Load same case
3. See Kannada translation
4. Ask a question in Kannada interface
```

---

## 📊 **SECTION 7: Quick Reference - Medical Terms Translation**

### **English → Hindi Translation Examples**

| English | Hindi |
|---------|-------|
| High blood pressure | उच्च रक्त चाप |
| Diabetes | मधुमेह |
| Heart attack | दिल का दौरा |
| Take medicine daily | रोज दवा लें |
| Follow doctor's instructions | डॉक्टर के निर्देशों का पालन करें |
| Drink plenty of water | खूब पानी पिएं |
| Rest | आराम |
| Exercise | व्यायाम |
| Healthy diet | स्वस्थ आहार |

### **English → Kannada Translation Examples**

| English | Kannada |
|---------|---------|
| High blood pressure | ಹೆಚ್ಚಿನ ರಕ್ತ ಒತ್ತಡ |
| Diabetes | ಮಧುಮೇಹ |
| Heart attack | ಹೃದಯ ಗಾಯ |
| Take medicine daily | ದಿನದಿ ಔಷಧ ತೆಗೆದುಕೊಳ್ಳಿ |
| Doctor | ವೈದ್ಯ |
| Hospital | ಆಸ್ಪತ್ರೆ |
| Rest | ವಿಶ್ರಾಂತಿ |
| Exercise | ವ್ಯಾಯಾಮ |
| Healthy diet | ಆರೋಗ್ಯಕರ ಆಹಾರ |

### **English → Telugu Translation Examples**

| English | Telugu |
|---------|--------|
| High blood pressure | అధిక రక్తపోటు |
| Diabetes | మధుమేహ |
| Heart attack | గుండె రుగ్గు |
| Take medicine daily | రోజూ ఔషధం తీసుకోండి |
| Doctor | డాక్టర్ |
| Hospital | ఆసుపత్రి |
| Rest | విశ్రాంతి |
| Exercise | వ్యాయామం |
| Healthy diet | ఆరోగ్యకరమైన ఆహారం |

---

## ✅ **Verification Checklist**

After testing, mark these as complete:

```
□ Case submission creates unique Case IDs
□ Medical simplification works (e.g., "hypertension" → "high blood pressure")
□ Translation works in Hindi (देवनागरी script visible)
□ Translation works in Kannada (ಕನ್ನಡ script visible)
□ Translation works in Telugu (తెలుగు script visible)
□ Drug interactions detected:
  ✓ Aspirin + Warfarin = SEVERE
  ✓ Metformin + Insulin = MODERATE
  ✓ Safe combinations = No warnings
□ Doctor voice input works
  ✓ Click 🎤 button starts listening
  ✓ Speech is transcribed to text
  ✓ Question can be submitted and answered
□ Patient portal shows case information
□ Patient education in multiple languages
□ Case analysis in patient's language
```

---

## 🎯 **Pro Tips for Testing**

1. **For Voice Testing:**
   - Speak clearly in English
   - Speak at normal pace
   - Use phrases like "What is...", "Can you...", "Should I..."

2. **For Language Testing:**
   - Each language switch will translate the SAME case data
   - Medical terms should be consistent
   - You can ask questions in each language

3. **For Drug Interactions:**
   - Start with aspirin + warfarin (SEVERE)
   - Then try metformin + insulin (MODERATE)
   - Then try safe combinations

4. **For Complete Demo:**
   - Use Patient Case #1 (Diabetes) as main demo case
   - Show all 4 functionalities with same case
   - Switch between languages to show translation
   - Use voice for Q&A at the end

---

## 🚀 **Ready to Test!**

You now have:
- ✅ 3 complete patient cases
- ✅ Multiple test scenarios for each feature
- ✅ Drug interaction test cases
- ✅ Language translation examples
- ✅ Voice Q&A test questions
- ✅ Complete end-to-end workflow

**Start with Patient Case #1 (Diabetes) and follow the complete workflow above!**
