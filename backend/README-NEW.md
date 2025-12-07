# MedGPT Pro — Backend (Advanced Features)

A Node.js + Express server for managing patient medical cases with AI-powered analysis, drug interaction checking, and multi-language patient education.

## Features

✅ **Doctor Workflow:**
- Patient case submission (text/voice/file upload)
- AI-powered case analysis with PubMed research integration
- Interactive Q&A with AI context
- Drug interaction checking
- Professional final report generation

✅ **Patient Workflow:**
- Patient education in simple language
- Multi-language support (English, Kannada, Hindi, Telugu)
- Voice Q&A (frontend support)

## Technology Stack

- **Backend:** Node.js + Express.js
- **Database:** MongoDB (Atlas or local)
- **AI:** Ollama + Gemma 2B
- **File Upload:** Multer (10MB limit)
- **API:** RESTful endpoints with CORS support

## Setup

### 1. Prerequisites

- Node.js >= 18
- MongoDB (local or MongoDB Atlas)
- Ollama running locally with a model (e.g., `ollama pull gemma:2b`)

### 2. Install Dependencies

```bash
cd backend
npm install
```

### 3. Configure Environment

Copy `.env.example` to `.env` and update values:

```bash
cp .env.example .env
```

**`.env` example:**

```
# MongoDB connection (Atlas or local)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/medgpt-pro?retryWrites=true&w=majority

# Or for local MongoDB:
# MONGODB_URI=mongodb://localhost:27017/medgpt-pro

# Ollama endpoint
OLLAMA_URL=http://localhost:11434/api/generate
OLLAMA_MODEL=gemma:2b

# Server port
PORT=5000

# File upload settings
UPLOAD_DIR=uploads
MAX_FILE_SIZE=10485760
```

### 4. Start the Server

**Development (with auto-reload):**

```bash
npm run dev
```

**Production:**

```bash
npm start
```

Server listens on http://localhost:5000

## API Endpoints

### Health Check

**GET `/api/health`**

```bash
curl http://localhost:5000/api/health
```

Response:
```json
{ "success": true, "status": "ok" }
```

---

### 1. Submit Patient Case

**POST `/api/submit-case`**

Submit a new patient case with symptoms, diagnosis, and medications.

**Request (form-data with optional file):**

```powershell
$body = @{
  patientName = "John Doe"
  age = 45
  gender = "M"
  symptoms = "Persistent headaches and fatigue"
  diagnosis = "Hypertension"
  medications = "amlodipine, lisinopril"
  submissionType = "text"
} | ConvertTo-Json

Invoke-RestMethod -Method Post -Uri http://localhost:5000/api/submit-case `
  -ContentType 'application/json' -Body $body
```

**Response:**

```json
{
  "success": true,
  "caseId": "507f1f77bcf86cd799439011",
  "message": "Case submitted successfully"
}
```

---

### 2. Analyze Case

**POST `/api/analyze-case/:caseId`**

Generate AI brief, search PubMed research, and produce detailed analysis.

```powershell
Invoke-RestMethod -Method Post -Uri http://localhost:5000/api/analyze-case/507f1f77bcf86cd799439011
```

**Response:**

```json
{
  "success": true,
  "brief": "45-year-old male with hypertension...",
  "relevantPapers": [
    {
      "pmid": "12345678",
      "title": "Blood Pressure Management in Adults",
      "abstract": "..."
    }
  ],
  "aiAnalysis": "Detailed clinical analysis..."
}
```

---

### 3. Ask Doctor Questions

**POST `/api/doctor-question/:caseId`**

Ask the AI clarifying questions about the case with full context.

```powershell
$body = @{ question = "What is the risk of side effects with this medication combination?" } | ConvertTo-Json

Invoke-RestMethod -Method Post -Uri http://localhost:5000/api/doctor-question/507f1f77bcf86cd799439011 `
  -ContentType 'application/json' -Body $body
```

**Response:**

```json
{
  "success": true,
  "answer": "The combination of amlodipine and lisinopril...",
  "confidence": 0.85
}
```

---

### 4. Check Drug Interactions

**POST `/api/check-case-interactions/:caseId`**

Analyze drug interactions for all medications in the case.

```powershell
Invoke-RestMethod -Method Post -Uri http://localhost:5000/api/check-case-interactions/507f1f77bcf86cd799439011
```

**Response:**

```json
{
  "success": true,
  "interactions": [
    {
      "drugs": ["amlodipine", "lisinopril"],
      "severity": "minor",
      "notes": "Synergistic blood pressure lowering effect"
    }
  ],
  "severity": "none",
  "warnings": []
}
```

---

### 5. Generate Final Report

**POST `/api/generate-final-report/:caseId`**

Create a professional medical report combining AI analysis and doctor notes.

```powershell
$body = @{ 
  reportNotes = "Patient responding well to current treatment plan. Continue monitoring BP."
} | ConvertTo-Json

Invoke-RestMethod -Method Post -Uri http://localhost:5000/api/generate-final-report/507f1f77bcf86cd799439011 `
  -ContentType 'application/json' -Body $body
```

**Response:**

```json
{
  "success": true,
  "finalReport": "Professional medical report text..."
}
```

---

### 6. Generate Patient Education

**POST `/api/patient-education/:caseId`**

Convert medical report to simple language and translate to patient's language.

```powershell
$body = @{ language = "kannada" } | ConvertTo-Json

Invoke-RestMethod -Method Post -Uri http://localhost:5000/api/patient-education/507f1f77bcf86cd799439011 `
  -ContentType 'application/json' -Body $body
```

Supported languages: `english`, `kannada`, `hindi`, `telugu`

**Response:**

```json
{
  "success": true,
  "simpleExplanation": "Your test showed high blood pressure...",
  "translatedText": "[Kannada] ನಿಮ್ಮ ಪರೀಕ್ಷೆ ಉಚ್ಚ ರಕ್ತದೊತ್ತಣೆ ತೋರಿಸಿತು...",
  "language": "kannada"
}
```

---

### 7. Retrieve Full Case

**GET `/api/case/:caseId`**

Get complete case details with all AI analysis, Q&A history, and reports.

```powershell
Invoke-RestMethod -Method Get -Uri http://localhost:5000/api/case/507f1f77bcf86cd799439011
```

**Response:**

```json
{
  "success": true,
  "case": {
    "_id": "507f1f77bcf86cd799439011",
    "patientName": "John Doe",
    "age": 45,
    "gender": "M",
    "symptoms": "...",
    "diagnosis": "...",
    "medications": ["amlodipine", "lisinopril"],
    "submissionType": "text",
    "aiAnalysis": { "brief": "...", "relevantPapers": [], "analysisText": "..." },
    "qaHistory": [{ "question": "...", "answer": "...", "confidence": 0.85 }],
    "finalReport": { "reportText": "...", "doctorNotes": "..." },
    "patientEducation": { "simpleExplanation": "...", "language": "english", "translatedText": "..." },
    "interactions": { "data": [...], "checkedAt": "2025-12-06T..." }
  }
}
```

---

## Error Handling

All endpoints include comprehensive error handling:

**Invalid Request:**
```json
{ "success": false, "error": "Missing required fields: ..." }
```

**Not Found:**
```json
{ "success": false, "error": "Case not found" }
```

**Server Error:**
```json
{ "success": false, "error": "Error connecting to Ollama" }
```

---

## MongoDB Setup

### Option 1: Local MongoDB

```bash
# Install MongoDB Community Edition
# macOS: brew install mongodb-community
# Windows: Download from mongodb.com

# Start MongoDB
mongod

# Update .env
MONGODB_URI=mongodb://localhost:27017/medgpt-pro
```

### Option 2: MongoDB Atlas (Cloud)

1. Create account at [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
2. Create a cluster and database user
3. Copy connection string
4. Update `.env`:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/medgpt-pro?retryWrites=true&w=majority
```

---

## Ollama Setup

Install and run Ollama locally:

```bash
# Install Ollama from ollama.ai
ollama pull gemma:2b

# Start Ollama (runs on http://localhost:11434 by default)
ollama serve
```

To use a different model, update `.env`:

```
OLLAMA_MODEL=llama2
# or
OLLAMA_MODEL=mistral
```

---

## File Upload

Upload files with `/api/submit-case` endpoint:

```bash
curl -X POST http://localhost:5000/api/submit-case \
  -F "patientName=John Doe" \
  -F "age=45" \
  -F "gender=M" \
  -F "symptoms=..." \
  -F "diagnosis=..." \
  -F "medications=..." \
  -F "submissionType=file" \
  -F "file=@patient_notes.pdf"
```

**Supported file types:** `.pdf`, `.txt`, `.jpg`, `.jpeg`, `.png`, `.doc`, `.docx`  
**Max file size:** 10MB (configurable in `.env`)

---

## Development

### Run with auto-reload

```bash
npm run dev
```

### Check logs

```bash
tail -f out.log      # stdout
tail -f err.log      # stderr
```

### Linting

(Optional - add ESLint if needed)

```bash
npm install --save-dev eslint
npx eslint server.js
```

---

## Deployment

### To Heroku

```bash
heroku create medgpt-pro-backend
heroku config:set MONGODB_URI="your-atlas-uri"
git push heroku main
```

### To AWS / DigitalOcean

1. Build Node app: `npm install`
2. Set environment variables
3. Run: `npm start`
4. Configure process manager (PM2 recommended):

```bash
npm install -g pm2
pm2 start server.js --name "medgpt-pro"
pm2 save
pm2 startup
```

---

## Troubleshooting

**MongoDB Connection Timeout:**
- Ensure MongoDB is running (`mongod` or Ollama service)
- Check `MONGODB_URI` in `.env`
- For MongoDB Atlas, whitelist your IP

**Ollama Connection Error:**
- Ensure `ollama serve` is running
- Verify `OLLAMA_URL` in `.env`
- Check model is installed: `ollama list`

**File Upload Issues:**
- Ensure `uploads/` directory exists
- Check file size < 10MB
- Verify file type is allowed

**Slow Response:**
- Increase Ollama timeout (default 60s)
- Check system resources
- For PubMed searches, reduce `retmax` parameter

---

## Next Steps

- [ ] Integrate Google Translate API for real translations
- [ ] Add Web Speech API for voice input (frontend)
- [ ] Implement user authentication
- [ ] Add case history and search
- [ ] Create admin dashboard
- [ ] Add rate limiting and caching

---

## License

MIT
