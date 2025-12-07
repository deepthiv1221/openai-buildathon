# PatientEducation Component Documentation

## Overview
`PatientEducation.jsx` is a patient-facing React component designed for easy access to medical information about their condition. It provides a simple, accessible interface for patients to understand their diagnosis, ask questions, and access information in their preferred language.

**Key Features:**
- 🌐 **Multi-Language Support**: English, Kannada, Hindi, Telugu
- 🎤 **Voice Input/Output**: Web Speech API for speaking questions and listening to answers
- ❓ **AI-Powered Q&A**: Ask questions and receive AI-generated answers
- ♿ **WCAG 2.1 Accessible**: Designed for accessibility with high contrast, large fonts, and keyboard navigation
- 📱 **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- 🎯 **Patient-Friendly**: Uses simple language, emojis for clarity, and intuitive UI

## Component Structure

### State Variables
```javascript
// Language & Case Management
const [selectedLanguage, setSelectedLanguage] = useState('english');
const [caseId, setCaseId] = useState('');
const [caseData, setCaseData] = useState(null);
const [educationData, setEducationData] = useState(null);
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);
const [success, setSuccess] = useState(null);

// Q&A Management
const [qaHistory, setQaHistory] = useState([]);
const [userQuestion, setUserQuestion] = useState('');
const [qaLoading, setQaLoading] = useState(false);
const [qaError, setQaError] = useState(null);

// Voice States
const [isListening, setIsListening] = useState(false);
const [isSpeaking, setIsSpeaking] = useState(false);
```

### Key Functions

#### 1. `loadCaseEducation()`
Loads patient case data and education content
- **Input**: Case ID from user input
- **API Calls**:
  - `GET /api/case/:caseId` - Retrieves case details
  - `POST /api/patient-education/:caseId` - Gets patient education content
- **Output**: Sets `caseData` and `educationData` state
- **Error Handling**: Displays error message if case not found

#### 2. `speakText(text)`
Uses Web Speech Synthesis API to read text aloud
- **Parameters**: 
  - `text` (string) - Text to speak
- **Features**:
  - Respects selected language
  - Cancels previous speech before starting new
  - Sets `isSpeaking` state for UI feedback
- **Browser Support**: Safari, Chrome, Edge, Firefox

#### 3. `startListening()`
Initiates voice input using Web Speech Recognition API
- **Activation**: Triggered by "Speak" button
- **Output**: Captured text is set to `userQuestion`
- **Language**: Automatically set to selected language
- **Feedback**: Shows "Listening..." indicator

#### 4. `handleAskQuestion()`
Submits user question to AI and gets answer
- **API Call**: `POST /api/doctor-question/:caseId`
- **Parameters**: Question text
- **Response**: AI-generated answer
- **Post-Processing**:
  - Adds to Q&A history
  - Auto-plays answer using text-to-speech
  - Clears input field
- **Error Handling**: Displays error message if request fails

#### 5. `handleChangeLanguage(lang)`
Switches interface language and reloads case data
- **Parameters**: Language code (english, kannada, hindi, telugu)
- **Side Effects**: Reloads case education in new language
- **UI Update**: Highlights selected language button

### UI Sections

#### 1. Header
- Welcoming title and subtitle
- Gradient background (purple to violet)
- Large, readable typography

#### 2. Language Selector
- 4 language buttons (English, Kannada, Hindi, Telugu)
- Active language highlighted
- Switches all UI and content language

#### 3. Case Loader
- Input field for Case ID
- "Load My Case" button
- Validation prevents empty submissions

#### 4. Case Information Display
- Patient Name
- Age
- Condition/Diagnosis
- Symptoms (if available)
- Current Medications (if available)
- Card layout with visual hierarchy

#### 5. Education Section
- **English**: Simple explanation of condition
- **Translated**: Content in selected language (if available)
- **Listen Button**: Text-to-speech for both versions
- Clear, readable typography

#### 6. Q&A Section
- Textarea for typing questions
- "Speak" button for voice input
- "Ask" button to submit
- Q&A History showing all past interactions
- Small "Listen" buttons next to each Q&A pair

#### 7. Help Section
- Shows before case is loaded
- 6-step guide for using the portal
- Easy to understand instructions

## API Integration

### Required Endpoints

1. **GET /api/case/:caseId**
   ```
   Response: {
     patientName: string,
     age: number,
     diagnosis: string,
     symptoms: string,
     medications: [string]
   }
   ```

2. **POST /api/patient-education/:caseId**
   ```
   Body: { language: string }
   Response: {
     simpleExplanation: string,
     translatedText: string (if language !== 'english')
   }
   ```

3. **POST /api/doctor-question/:caseId**
   ```
   Body: { question: string }
   Response: { answer: string }
   ```

## Styling

### CSS Features
- **Color Scheme**: Professional medical purple/violet gradients
- **Typography**: Large (18px+) for accessibility
- **Spacing**: Generous padding for readability
- **Cards**: White cards with subtle shadows
- **Buttons**: Clear, high-contrast, emoji-enhanced labels
- **Responsive**: Mobile-first approach with breakpoints at 768px and 480px

### WCAG 2.1 Compliance
- ✅ High contrast colors (AAA compliant)
- ✅ Large readable fonts (18px minimum for body text)
- ✅ Focus indicators on all interactive elements
- ✅ Semantic HTML structure
- ✅ Keyboard navigation support
- ✅ Screen reader friendly
- ✅ Color not the only visual indicator
- ✅ Motion reduced mode support

### Accessibility Features
```css
/* Focus indicators for keyboard navigation */
.btn-primary:focus,
.lang-btn:focus {
  outline: 2px solid #667eea;
  outline-offset: 2px;
}

/* High contrast mode support */
@media (prefers-contrast: more) {
  .pe-card {
    border: 2px solid #000;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

## Web Speech API Integration

### Speech Recognition (Voice Input)
```javascript
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
recognitionRef.current = new SpeechRecognition();
recognitionRef.current.lang = `${LANGUAGES[selectedLanguage]}-IN`;
recognitionRef.current.onresult = (e) => {
  const text = Array.from(e.results).map(r => r[0].transcript).join('');
  setUserQuestion(text);
};
```

### Speech Synthesis (Text-to-Speech)
```javascript
const utterance = new SpeechSynthesisUtterance(text);
utterance.lang = `${LANGUAGES[selectedLanguage]}-IN`;
utterance.rate = 0.9; // Slightly slower for clarity
synthRef.current.speak(utterance);
```

## Browser Compatibility

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| Web Speech Recognition | ✅ | ✅ | ❌ | ✅ |
| Web Speech Synthesis | ✅ | ✅ | ✅ | ✅ |
| Responsive CSS | ✅ | ✅ | ✅ | ✅ |

## Usage Example

```javascript
// In App.js or parent component
import PatientEducation from './components/PatientEducation';

function App() {
  return (
    <PatientEducation />
  );
}
```

## Testing Checklist

- [ ] Load case by entering valid Case ID
- [ ] Verify case data displays correctly
- [ ] Switch language and confirm content updates
- [ ] Click "Speak" button and test voice input
- [ ] Type a question and click "Ask"
- [ ] Verify AI answer displays
- [ ] Click "Listen" button and test text-to-speech
- [ ] Test all 4 languages
- [ ] Test on mobile device (responsive design)
- [ ] Navigate using keyboard only (accessibility)
- [ ] Test with screen reader (accessibility)
- [ ] Test error handling (invalid Case ID)

## Environment Variables

```
REACT_APP_API_BASE=http://localhost:5000
```

## Known Limitations

1. **Speech Recognition**: Not supported on Safari (iOS/macOS)
2. **Translation**: Currently mocked in backend; requires Google Translate API integration
3. **Languages**: Limited to 4 languages; can be expanded
4. **Voice**: English voice synthesis available; other language voices depend on OS

## Future Enhancements

- [ ] Google Translate API integration for real-time translation
- [ ] Multi-language voice synthesis
- [ ] Offline mode with cached content
- [ ] PDF export of case information
- [ ] Appointment booking integration
- [ ] Prescription management
- [ ] Medication reminders
- [ ] Doctor message thread
- [ ] Family member access

## Troubleshooting

### Voice Input Not Working
- **Check**: Browser support (Chrome, Edge, Firefox)
- **Fix**: Use different browser or use text input
- **Error**: "Speech recognition not supported in your browser"

### Text-to-Speech Not Working
- **Check**: Browser has text-to-speech enabled
- **Fix**: Check system sound settings and browser permissions
- **Error**: "Text-to-Speech not supported in your browser"

### Case Not Loading
- **Check**: Correct Case ID entered
- **Fix**: Verify Case ID exists in database
- **Error**: "Failed to load case"

### Language Not Switching
- **Check**: Language button is clicked
- **Fix**: Refresh browser or try different language
- **Error**: Display doesn't update

## Files

```
frontend/src/components/
├── PatientEducation.jsx     (Main component - 350+ lines)
├── PatientEducation.css     (Styling - 400+ lines)
└── DoctorDashboard.jsx      (Related doctor component)

frontend/src/
└── App.js                   (Updated with navigation)
```

## Summary

PatientEducation is a comprehensive, accessible patient portal that empowers patients to understand their medical conditions through simple language, multi-language support, and intuitive voice interfaces. It integrates seamlessly with the MedGPT backend to provide AI-assisted education and Q&A services.
