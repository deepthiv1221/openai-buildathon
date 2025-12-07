const mongoose = require('mongoose');

const qaEntrySchema = new mongoose.Schema({
  question: String,
  answer: String,
  confidence: Number,
  timestamp: { type: Date, default: Date.now }
});

const caseSchema = new mongoose.Schema({
  patientName: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, enum: ['M', 'F', 'Other'], required: true },
  symptoms: { type: String, required: true },
  diagnosis: { type: String, required: true },
  medications: { type: [String], default: [] },
  submissionType: { type: String, enum: ['text', 'voice', 'file'], required: true },
  fileUrl: { type: String, default: null },
  createdAt: { type: Date, default: Date.now },
  
  // AI Analysis
  aiAnalysis: {
    brief: { type: String, default: null },
    relevantPapers: [
      {
        pmid: String,
        title: String,
        abstract: String
      }
    ],
    analysisText: { type: String, default: null },
    analysisTimestamp: { type: Date, default: null }
  },
  
  // Doctor Notes
  doctorNotes: { type: String, default: null },
  reportGeneratedAt: { type: Date, default: null },
  
  // Q&A History
  qaHistory: [qaEntrySchema],
  
  // Final Report
  finalReport: {
    reportText: { type: String, default: null },
    doctorNotes: { type: String, default: null },
    generatedAt: { type: Date, default: null }
  },
  
  // Patient Education
  patientEducation: {
    simpleExplanation: { type: String, default: null },
    language: { type: String, enum: ['english', 'kannada', 'hindi', 'telugu'], default: 'english' },
    translatedText: { type: String, default: null },
    generatedAt: { type: Date, default: null }
  },
  
  // Drug Interactions
  interactions: {
    data: [
      {
        drugs: [String],
        severity: { type: String, enum: ['minor', 'moderate', 'severe'], default: 'minor' },
        notes: String
      }
    ],
    checkedAt: { type: Date, default: null }
  }
}, { timestamps: true });

module.exports = mongoose.model('Case', caseSchema);
