# MedGPT Pro — Backend

This folder contains the Express backend for MedGPT Pro. It exposes 3 main endpoints used by the frontend.

Quick start

1. Install dependencies

```powershell
cd backend
npm install
```

2. Run development server (requires nodemon installed from devDependencies)

```powershell
npm run dev
```

3. The server listens on port 5000 by default. Endpoints:

- POST /api/medical-query
  - body: { "query": "..." }
  - forwards prompt to local Ollama at http://localhost:11434/api/generate and returns { success, answer, confidence }

- POST /api/search-research
  - body: { "condition": "..." }
  - queries PubMed ESearch and returns { success, count, ids }

- POST /api/check-interactions
  - body: { "drugs": ["aspirin","warfarin"] }
  - asks Ollama to check interactions and returns { success, raw, parsed }

Environment

- OLLAMA_URL - full URL of the Ollama generate endpoint (default: http://localhost:11434/api/generate)
- OLLAMA_MODEL - model name to send to Ollama (optional)

Notes

- This is a simple prototype. The Ollama API responses may vary depending on model and Ollama version; the server tries to extract text heuristically. For production, adapt payload/response parsing to your Ollama/API contract.
