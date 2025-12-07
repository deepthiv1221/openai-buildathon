# MedGPT Pro — Quick Start Guide

## Project Overview

MedGPT Pro is a full-stack medical assistant platform with separate workflows for **doctors** and **patients**.

### Doctor Workflow

1. ✅ **Submit Patient Case** — Upload patient info (name, age, gender, symptoms, diagnosis, medications)
2. ✅ **AI Case Analysis** — Get AI-powered clinical summary + relevant research papers from PubMed
3. ✅ **Interactive Q&A** — Ask the AI clarifying questions with full case context
4. ✅ **Drug Interaction Check** — Verify medication interactions before finalizing
5. ✅ **Generate Final Report** — Create professional medical report combining AI analysis + doctor notes

### Patient Workflow

1. ✅ **Patient Education** — Case explained in simple language (non-medical)
2. ✅ **Multi-language Support** — English, Kannada, Hindi, Telugu
3. ✅ **Voice Q&A** — Patient asks questions in their language (frontend feature)

---

## Architecture

```
┌─────────────────────────────────────────────────┐
│            Frontend (React)                      │
│  - MedGPT Component with UI/forms               │
│  - API calls to backend endpoints               │
└─────────────────────────────────────────────────┘
                        ↓ HTTP/CORS
┌─────────────────────────────────────────────────┐
│            Backend (Node.js + Express)           │
│  - 7 RESTful API endpoints                      │
│  - MongoDB for persistence                      │
│  - Multer for file uploads                      │
│  - Ollama integration for AI                    │
│  - PubMed API integration for research          │
└─────────────────────────────────────────────────┘
        ↓              ↓              ↓
   MongoDB        Ollama          PubMed API
   (local or     (localhost       (research)
    Atlas)       :11434)
```

---

## Backend Implementation Status

### ✅ Complete

- **database/models/Case.js** — MongoDB schema with all required fields
  - Patient info, symptoms, diagnosis, medications
  - AI analysis (brief, papers, analysis text)
  - Q&A history
  - Final report + doctor notes
  - Patient education (simple language + translations)
  - Drug interactions

- **backend/server.js** — All 7 endpoints implemented
  1. `POST /api/submit-case` — Create new case
  2. `POST /api/analyze-case/:caseId` — AI analysis + PubMed search
  3. `POST /api/doctor-question/:caseId` — Q&A with context
  4. `POST /api/check-case-interactions/:caseId` — Drug interaction check
  5. `POST /api/generate-final-report/:caseId` — Professional report
  6. `POST /api/patient-education/:caseId` — Simplify + translate
  7. `GET /api/case/:caseId` — Retrieve full case

- **backend/package.json** — Dependencies (express, cors, mongoose, multer, axios)

- **backend/.env.example** — Configuration template

- **backend/README-NEW.md** — Comprehensive API documentation

- **Error handling** — All endpoints have try/catch + validation

- **CORS middleware** — Frontend communication enabled

- **File upload** — Multer configured (10MB limit, PDF/text/image support)

---

## How to Run

### Backend

```bash
# 1. Install dependencies
cd backend
npm install

# 2. Create .env file (copy from .env.example)
cp .env.example .env

# 3. Update .env with your MongoDB and Ollama URLs
#    For local testing:
#    MONGODB_URI=mongodb://localhost:27017/medgpt-pro
#    OLLAMA_URL=http://localhost:11434/api/generate

# 4. Start the server
npm start              # Production
# OR
npm run dev          # Development (with auto-reload)
```

Server will be available at: **http://localhost:5000**

### Frontend

```bash
# 1. Install dependencies
cd frontend
npm install

# 2. Start React dev server
npm start
```

Frontend will be available at: **http://localhost:3000**

---

## Prerequisites

Before running, ensure you have:

### 1. **MongoDB**

**Option A: Local MongoDB**
```bash
# macOS
brew install mongodb-community
brew services start mongodb-community

# Windows: Download from mongodb.com/try/download/community
# Or use MongoDB Shell: mongod
```

**Option B: MongoDB Atlas (Cloud)**
1. Create free account at [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
2. Create cluster + database user
3. Get connection string
4. Update `.env`: `MONGODB_URI=mongodb+srv://...`

### 2. **Ollama**

```bash
# Install from ollama.ai
# Download the installer for your OS

# After installation, pull a model
ollama pull gemma:2b

# Start Ollama (keep running in background)
ollama serve
# Server will be at http://localhost:11434
```

Verify Ollama is working:
```bash
curl http://localhost:11434/api/tags
```

### 3. **Node.js**

```bash
# Download from nodejs.org (v18 or newer)
node --version  # Should be >= v18
```

---

## Testing the API

### Health Check

```powershell
Invoke-RestMethod -Method Get -Uri http://localhost:5000/api/health
```

### Submit a Case

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

$response = Invoke-RestMethod -Method Post -Uri http://localhost:5000/api/submit-case `
  -ContentType 'application/json' -Body $body

$caseId = $response.caseId
Write-Output "Created case: $caseId"
```

### Analyze the Case

```powershell
Invoke-RestMethod -Method Post -Uri "http://localhost:5000/api/analyze-case/$caseId" `
  -ContentType 'application/json' | ConvertTo-Json -Depth 10
```

### Ask a Question

```powershell
$body = @{ question = "What are the side effects of this medication combination?" } | ConvertTo-Json

Invoke-RestMethod -Method Post -Uri "http://localhost:5000/api/doctor-question/$caseId" `
  -ContentType 'application/json' -Body $body
```

### Check Drug Interactions

```powershell
Invoke-RestMethod -Method Post -Uri "http://localhost:5000/api/check-case-interactions/$caseId"
```

### Generate Report

```powershell
$body = @{ reportNotes = "Patient responding well. Continue current treatment." } | ConvertTo-Json

Invoke-RestMethod -Method Post -Uri "http://localhost:5000/api/generate-final-report/$caseId" `
  -ContentType 'application/json' -Body $body
```

### Get Patient Education

```powershell
$body = @{ language = "hindi" } | ConvertTo-Json

Invoke-RestMethod -Method Post -Uri "http://localhost:5000/api/patient-education/$caseId" `
  -ContentType 'application/json' -Body $body
```

### Retrieve Full Case

```powershell
Invoke-RestMethod -Method Get -Uri "http://localhost:5000/api/case/$caseId" `
  -ContentType 'application/json' | ConvertTo-Json -Depth 20
```

---

## Project Structure

```
medgpt-pro/
├── backend/
│   ├── models/
│   │   └── Case.js              # MongoDB schema
│   ├── server.js                # Main server + all 7 endpoints
│   ├── package.json             # Dependencies
│   ├── .env.example             # Configuration template
│   ├── README-NEW.md            # API documentation
│   ├── uploads/                 # File upload directory
│   └── node_modules/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── MedGPT.jsx       # Main component
│   │   │   └── MedGPT.css       # Styling
│   │   ├── App.js               # Root component
│   │   ├── index.js             # Entry point
│   │   └── ...
│   ├── package.json
│   ├── public/
│   └── node_modules/
│
└── package.json                 # Root (optional, for monorepo)
```

---

## Key Features Implemented

### 1. Case Management
- ✅ Create case with patient info
- ✅ Store medications list
- ✅ Support text/voice/file submission
- ✅ File upload with multer

### 2. AI Analysis
- ✅ Ollama integration for clinical reasoning
- ✅ PubMed API integration for research papers
- ✅ Context-aware Q&A
- ✅ Confidence scoring

### 3. Drug Interactions
- ✅ Multi-drug interaction checking
- ✅ Severity classification (minor/moderate/severe)
- ✅ JSON response parsing

### 4. Report Generation
- ✅ Professional report combining AI + doctor notes
- ✅ Persistent storage in MongoDB

### 5. Patient Education
- ✅ Medical text simplification (using Ollama)
- ✅ Multi-language support (mock translations for now)
- ✅ Simple language output

### 6. Error Handling
- ✅ Input validation
- ✅ Try/catch on all endpoints
- ✅ Meaningful error messages
- ✅ HTTP status codes

---

## Configuration

### Environment Variables (`.env`)

```
# MongoDB
MONGODB_URI=mongodb://localhost:27017/medgpt-pro

# Ollama
OLLAMA_URL=http://localhost:11434/api/generate
OLLAMA_MODEL=gemma:2b

# Server
PORT=5000

# File Upload
UPLOAD_DIR=uploads
MAX_FILE_SIZE=10485760

# Future: Google Translate API
# GOOGLE_TRANSLATE_API_KEY=your-key-here
```

---

## Future Enhancements

- [ ] Real translations using Google Translate API
- [ ] Web Speech API for voice input (frontend)
- [ ] User authentication (JWT)
- [ ] Case history & search
- [ ] Admin dashboard
- [ ] Rate limiting
- [ ] Caching (Redis)
- [ ] Email notifications
- [ ] Multi-user support
- [ ] Export to PDF

---

## Troubleshooting

### MongoDB Connection Fails

**Problem:** `MongoDB connection failed: connect ECONNREFUSED`

**Solution:**
- Ensure MongoDB is running: `mongod` (local) or check Atlas connection
- Verify `MONGODB_URI` in `.env`
- For Atlas, whitelist your IP in cluster settings

### Ollama Not Responding

**Problem:** `Ollama call error: connect ECONNREFUSED`

**Solution:**
- Ensure `ollama serve` is running
- Check `OLLAMA_URL` in `.env`
- Verify model is installed: `ollama list`
- Pull model if needed: `ollama pull gemma:2b`

### File Upload Fails

**Problem:** 413 Payload Too Large or file type error

**Solution:**
- Check file size < 10MB
- Verify file type (.pdf, .txt, .jpg, .png, .doc, .docx)
- Ensure `uploads/` directory exists

---

## Support & Documentation

- **Backend API Docs:** See `backend/README-NEW.md`
- **Schema Definition:** See `backend/models/Case.js`
- **Sample Requests:** See Testing section above

---

## License

MIT

---

## Summary

You now have:

✅ **Fully functional backend** with all 7 endpoints  
✅ **MongoDB integration** for persistent storage  
✅ **AI-powered analysis** via Ollama  
✅ **Research integration** via PubMed API  
✅ **File upload support** with multer  
✅ **Multi-language support** framework ready  
✅ **Comprehensive error handling**  
✅ **CORS enabled** for frontend communication  

**Next step:** Connect the React frontend to these endpoints and build out the UI flows for doctors and patients!
