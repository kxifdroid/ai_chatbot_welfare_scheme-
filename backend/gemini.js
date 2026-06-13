const { GoogleGenerativeAI } = require('@google/generative-ai');
const dotenv = require('dotenv');

dotenv.config();

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

/**
 * Interacts with Gemini to generate a response for the welfare chatbot.
 * 
 * @param {string} userMessage - Current message from the user.
 * @param {string} schemeContext - Contextual information retrieved from RAG.
 * @param {Array} conversationHistory - Array of previous messages [{role: 'user'|'model', parts: [{text: ''}]}].
 * @param {string} detectedLanguage - The language to reply in.
 * @returns {Promise<string>} - The model's response.
 */
async function chat(userMessage, schemeContext, conversationHistory, detectedLanguage) {
    try {
        const systemPrompt = `
You are a helpful and empathetic welfare scheme assistant for citizens in rural India.
Your goal is to explain government schemes simply and accurately.

CRITICAL CONSTRAINTS:
1. Use ONLY the provided Scheme Context to answer questions. Never invent eligibility criteria or benefits.
2. Reply in ${detectedLanguage}. If the user mixes Hindi and English (Hinglish), you should also use natural code-mixing.
3. Keep every reply under 4 sentences. Be extremely concise.
4. If you cannot find the answer in the context, say exactly: "मुझे पक्की जानकारी नहीं है, कृपया 14555 पर कॉल करें" (or equivalent in the detected language).
5. Never ask more than one question per turn.
6. Treat romanized Indian language text as that language.

Scheme Context:
${schemeContext}
        `;

        // Limit history to last 6 messages to stay efficient
        const recentHistory = conversationHistory.slice(-6);

        // Start chat with history
        const chatSession = model.startChat({
            history: recentHistory,
            generationConfig: {
                maxOutputTokens: 250,
            },
        });

        // Send message with the system instructions prepended if history is empty, 
        // or embedded in the user prompt for ongoing sessions to ensure adherence.
        const prompt = conversationHistory.length === 0 
            ? `${systemPrompt}\n\nUser Message: ${userMessage}`
            : `Reminder: Use only provided context and reply in ${detectedLanguage}.\n\nUser Message: ${userMessage}`;

        const result = await chatSession.sendMessage(prompt);
        const response = await result.response;
        return response.text().trim();

    } catch (error) {
        console.error("Gemini API Error:", error);
        
        // Safe fallback in Hindi as it's the most common target language
        return "क्षमा करें, तकनीकी समस्या के कारण मैं अभी उत्तर नहीं दे पा रहा हूँ। कृपया थोड़ी देर बाद प्रयास करें या 14555 हेल्पलाइन पर कॉल करें।";
    }
}

module.exports = { chat };
