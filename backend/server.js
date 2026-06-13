const express = require('express');
const cors = require('cors');
const twilio = require('twilio');
const dotenv = require('dotenv');
const { 
    getSession, 
    updateProfile, 
    transitions, 
    questions, 
    START, 
    ASK_OCCUPATION, 
    SHOW_RESULTS, 
    FREE_CHAT 
} = require('./flow');
const { getEligibleSchemes, buildRAGContext } = require('./rag');
const { chat } = require('./gemini');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

/**
 * Basic language detection heuristic.
 */
function detectLanguage(text) {
    const t = text.toLowerCase();
    if (t.includes('வணக்கம்') || t.includes('tamil')) return 'ta';
    if (t.includes('नमस्ते') || t.includes('namaste') || t.includes('kisan') || t.includes('hindi')) return 'hi';
    if (t.includes('নমস্কার') || t.includes('bengali')) return 'bn';
    if (t.includes('नमस्कार') || t.includes('marathi')) return 'mr';
    return 'en'; // Default to English
}

/**
 * Core Chatbot Logic
 */
async function processMessage(userId, message) {
    const session = getSession(userId);
    console.log(`[${userId}] State: ${session.state} | Input: ${message}`);

    // 1. Handle START state / Initial language detection
    if (session.state === START) {
        session.detectedLanguage = detectLanguage(message);
        session.state = transitions[START];
        return questions[session.state][session.detectedLanguage];
    }

    // 2. Handle Questioning states (ASK_*)
    if (session.state.startsWith('ASK_')) {
        updateProfile(session, session.state, message);
        session.state = transitions[session.state];

        // If next state is another question, return it
        if (session.state.startsWith('ASK_')) {
            return questions[session.state][session.detectedLanguage];
        }

        // If moved to SHOW_RESULTS, perform RAG and transition to FREE_CHAT
        if (session.state === SHOW_RESULTS) {
            const eligible = getEligibleSchemes(session.profile);
            session.schemeContext = buildRAGContext(eligible, session.detectedLanguage);
            session.state = transitions[SHOW_RESULTS]; // Transition to FREE_CHAT

            const greeting = {
                en: "Based on your profile, here are the schemes you may be eligible for:",
                hi: "आपकी जानकारी के अनुसार, आप इन योजनाओं के लिए पात्र हो सकते हैं:",
                ta: "உங்கள் சுயவிவரத்தின் அடிப்படையில், நீங்கள் தகுதிபெறக்கூடிய திட்டங்கள் இங்கே:",
                bn: "আপনার প্রোফাইলের ভিত্তিতে, আপনি এই প্রকল্পগুলির জন্য যোগ্য হতে পারেন:",
                mr: "तुमच्या प्रोफाइलवर आधारित, तुम्ही या योजनांसाठी पात्र असू शकता:"
            };

            const footer = {
                en: "\n\nYou can now ask me any questions about these schemes.",
                hi: "\n\nअब आप मुझसे इन योजनाओं के बारे में कोई भी सवाल पूछ सकते हैं।",
                ta: "\n\nஇப்போது நீங்கள் இந்தத் திட்டங்களைப் பற்றி என்னிடம் ஏதேனும் கேள்விகளைக் கேட்கலாம்.",
                bn: "\n\nআপনি এখন এই প্রকল্পগুলি সম্পর্কে আমাকে যে কোনও প্রশ্ন জিজ্ঞাসা করতে পারেন।",
                mr: "\n\nआता तुम्ही मला या योजनांबद्दल कोणतेही प्रश्न विचारू शकता."
            };

            return `${greeting[session.detectedLanguage]}\n${session.schemeContext}${footer[session.detectedLanguage]}`;
        }
    }

    // 3. Handle FREE_CHAT state with Gemini
    if (session.state === FREE_CHAT) {
        const reply = await chat(message, session.schemeContext, session.history, session.detectedLanguage);
        
        // Track history (simplified)
        session.history.push({ role: 'user', parts: [{ text: message }] });
        session.history.push({ role: 'model', parts: [{ text: reply }] });
        
        // Keep history manageable
        if (session.history.length > 12) session.history.shift();

        return reply;
    }

    return "I'm sorry, something went wrong. Type 'reset' to start over.";
}

// --- Routes ---

/**
 * Twilio WhatsApp Webhook
 */
app.post('/webhook/whatsapp', async (req, res) => {
    const { Body, From } = req.body;
    const twiml = new twilio.twiml.MessagingResponse();

    try {
        const reply = await processMessage(From, Body);
        twiml.message(reply);
        res.type('text/xml').send(twiml.toString());
    } catch (error) {
        console.error("Twilio Webhook Error:", error);
        twiml.message("Sorry, we are experiencing technical difficulties. Please try again later.");
        res.type('text/xml').send(twiml.toString());
    }
});

/**
 * Web Chat API (for test UI)
 */
app.post('/chat', async (req, res) => {
    const { userId, message } = req.body;
    if (!userId || !message) {
        return res.status(400).json({ error: "Missing userId or message" });
    }

    try {
        const reply = await processMessage(userId, message);
        res.json({ reply });
    } catch (error) {
        console.error("Web Chat Error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

/**
 * Reset Session
 */
app.post('/reset', (req, res) => {
    const { userId } = req.body;
    const { getSession } = require('./flow');
    // For simplicity, we just delete the session from the internal Map if we had access to it, 
    // but getSession creates a new one if missing. Let's just reset the state.
    const session = getSession(userId);
    session.state = START;
    session.profile = { occupation: null, gender: null, hasLand: null, incomeLakh: null, hasGirlChild: null, isPregnant: null, hasBPLCard: true };
    session.history = [];
    session.schemeContext = "";
    res.json({ message: "Session reset successful" });
});

/**
 * Health Check
 */
app.get('/', (req, res) => {
    res.send("Welfare Bot Server is Online.");
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
