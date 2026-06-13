/**
 * Formats a document checklist into multiple SMS-compliant chunks (max 160 chars).
 * 
 * @param {string} schemeName - Name of the welfare scheme.
 * @param {Array} documents - List of document strings.
 * @param {string} languageCode - Language code for context.
 * @returns {Array} - Array of strings, each representing one SMS.
 */
function formatChecklistForSMS(schemeName, documents, languageCode) {
    const SMS_LIMIT = 160;
    const messages = [];
    
    const headers = {
        hi: `दस्तावेज: ${schemeName}`,
        en: `Docs for ${schemeName}`,
        bn: `দলিল: ${schemeName}`,
        ta: `ஆவணங்கள்: ${schemeName}`,
        mr: `कागदपत्रे: ${schemeName}`
    };
    
    const footer = "Helpline: 14555";
    let currentMsg = (headers[languageCode] || headers['en']) + "\n";

    documents.forEach((doc, index) => {
        const line = `${index + 1}. ${doc}\n`;
        
        // If adding this line + footer exceeds limit, push current and start new
        if ((currentMsg + line + footer).length > SMS_LIMIT) {
            messages.push(currentMsg.trim());
            currentMsg = line;
        } else {
            currentMsg += line;
        }
    });

    messages.push((currentMsg + footer).trim());
    return messages;
}

/**
 * Formats a document checklist for WhatsApp with emojis and bold text.
 * 
 * @param {string} schemeName - Name of the welfare scheme.
 * @param {Array} documents - List of document strings.
 * @param {string} languageCode - Language code for context.
 * @returns {string} - A single formatted string.
 */
function formatChecklistForWhatsApp(schemeName, documents, languageCode) {
    const headers = {
        hi: `📋 *${schemeName} के लिए जरूरी दस्तावेज:*`,
        en: `📋 *Required Documents for ${schemeName}:*`,
        bn: `📋 *${schemeName}-এর জন্য প্রয়োজনীয় নথি:*`,
        ta: `📋 *${schemeName} க்கான தேவையான ஆவணங்கள்:*`,
        mr: `📋 *${schemeName} साठी आवश्यक कागदपत्रे:*`
    };

    const footer = {
        hi: "\n📞 अधिक जानकारी: *14555*",
        en: "\n📞 Helpline: *14555*",
        bn: "\n📞 হেল্পলাইন: *14555*",
        ta: "\n📞 உதவி எண்: *14555*",
        mr: "\n📞 हेल्पलाईन: *14555*"
    };

    let body = (headers[languageCode] || headers['en']) + "\n\n";
    documents.forEach((doc, index) => {
        body += `✅ ${doc}\n`;
    });

    body += (footer[languageCode] || footer['en']);
    return body;
}

module.exports = { formatChecklistForSMS, formatChecklistForWhatsApp };

/*
// Example Usage and Output
const { formatChecklistForSMS, formatChecklistForWhatsApp } = require('./formatter');

const scheme = "PM-KISAN";
const docsHi = ["आधार कार्ड", "भूमि स्वामित्व के दस्तावेज", "बैंक खाते का विवरण", "पासपोर्ट साइज फोटो", "आय प्रमाण पत्र"];

console.log("--- SMS Output (Hindi) ---");
console.log(formatChecklistForSMS(scheme, docsHi, 'hi'));

console.log("\n--- WhatsApp Output (Hindi) ---");
console.log(formatChecklistForWhatsApp(scheme, docsHi, 'hi'));
*/
