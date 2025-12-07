# MedGPT Pro - AI-Powered Medical Research & Clinical Assistant

complete Demo of the proejct - https://www.loom.com/share/9381e2bd2a5c4bd89eb5e0900d3b142d

## Problem Statement
- Over 50,000+ new medical papers published weekly globally
- Doctors can dedicate only 5 hours/week to reading research
- 17-year gap between research discovery and clinical adoption
- Medical errors cost $20B annually in the US alone
- 73% of doctors rely on outdated textbooks and Google searches
- No real-time, voice-enabled interface for accessing medical knowledge during patient care

## Solution
MedGPT Pro is an AI-powered medical assistant that bridges the gap between doctors and latest medical research through:

### Doctor Portal
- **Submit Patient Cases** - Text, voice, or file upload
- **AI Case Analysis** - Instant AI brief from Ollama + PubMed research papers
- **Doctor Q&A** - Ask follow-up questions with context-aware responses
- **Drug Interaction Checker** - Real-time medication interaction warnings
- **Final Report Generation** - Professional clinical reports with doctor notes

### Patient Portal
- **Multi-Language Support** - English, Kannada, Hindi, Telugu
- **Simple Explanations** - Complex medical terms in patient-friendly language
- **Voice Input/Output** - Ask questions and listen to responses in their language
- **Easy Understanding** - Patients understand their condition without medical jargon

## Features
✅ Real-time medical research synthesis (PubMed API)  
✅ AI-powered case analysis (Ollama + Gemma 2B)  
✅ Drug interaction detection  
✅ Multi-language voice support (4 languages)  
✅ Patient education in simple language  
✅ MongoDB for case management  
✅ Production-ready API endpoints  
✅ Responsive UI for doctors and patients  

## Tech Stack
- **Frontend**: React.js
- **Backend**: Node.js + Express.js
- **AI Model**: Ollama + Gemma 2B (local)
- **Medical Data**: PubMed API
- **Database**: MongoDB Atlas
- **Voice**: Web Speech API + Google Translate TTS
- **Language**: Google Translate for multi-language support

## How It Works

### Doctor Workflow
1. Doctor submits patient case (text/voice/file)
2. System generates caseId
3. AI analyzes case + searches relevant research
4. Doctor asks follow-up questions
5. System checks drug interactions
6. Doctor generates final report
7. Patient can access in their language

### Patient Workflow
1. Patient selects preferred language
2. Enters caseId from doctor
3. Views condition explanation in simple language
4. Can ask questions via voice/text
5. Receives answers in their language with voice

## Endpoints

### Doctor Endpoints
- `POST /api/submit-case` - Submit patient case
- `POST /api/analyze-case/:caseId` - AI analysis + research papers
- `POST /api/doctor-question/:caseId` - Ask questions
- `POST /api/check-case-interactions/:caseId` - Drug interactions
- `POST /api/generate-final-report/:caseId` - Generate report

### Patient Endpoints
- `POST /api/patient-education/:caseId` - Get education in selected language
- `POST /api/patient-question/:caseId` - Q&A in patient language

## Installation & Running

### Prerequisites
- Node.js v14+
- MongoDB Atlas account (free tier)
- Ollama with Gemma 2B installed
- `ollama serve` running in background

### Backend Setup
```bash
cd backend
npm install
npm start
```
Runs on `http://localhost:5000`

### Frontend Setup
```bash
cd frontend
npm install
npm start
```
Runs on `http://localhost:3000`

## Live Demo
- **Frontend**: (Deployed on Vercel)
- **Backend**: (Deployed on Render)

## Built In
- **Time**: <24 hours
- **Event**: OpenAI Buildathon
- **Team**: Solo developer using GitHub Copilot

## Key Innovation
This MVP proves that:
1. Medical research can be synthesized in real-time
2. AI can explain complex medical cases simply
3. Multi-language support improves accessibility
4. Local AI (Ollama) + free APIs = scalable solution

## Future Enhancements
- Integration with OpenAI GPT-4 Turbo
- Advanced voice recognition (Whisper)
- Patient profile history
- Hospital system integration
- FDA compliance planning
- Mobile app (iOS/Android)
  
##SCREENSHOTS
LOGIN PAGE - <img width="400" height="238" alt="image" src="https://github.com/user-attachments/assets/c1d16621-94e2-4f7a-9353-1037e23616c1" /> 
DOCTORS PORTAL - <img width="1914" height="821" alt="image" src="https://github.com/user-attachments/assets/bcf37c6f-25a8-4a7e-a07c-30bc27e43ca6" />
<img width="1830" height="654" alt="image" src="https://github.com/user-attachments/assets/87f4e3ef-24d3-4f8f-bbae-3f7819fe20bf" />
PATIENTS PORTAL - <img width="1865" height="826" alt="image" src="https://github.com/user-attachments/assets/3a8d7b2f-704a-4a8b-99f7-8395e199dd20" />
<img width="1848" height="811" alt="image" src="https://github.com/user-attachments/assets/c4196e9c-1dda-4fa4-9bd6-44dc9e0e4e5b" />

## License
MIT

## Contact
Built for OpenAI Buildathon 2024
