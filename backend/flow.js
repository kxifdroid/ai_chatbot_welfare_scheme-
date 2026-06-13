const { parseOccupation } = require('./parser');

// State Constants
const START = 'START';
const ASK_OCCUPATION = 'ASK_OCCUPATION';
const ASK_GENDER = 'ASK_GENDER';
const ASK_LAND = 'ASK_LAND';
const ASK_INCOME = 'ASK_INCOME';
const ASK_FAMILY_GIRL_CHILD = 'ASK_FAMILY_GIRL_CHILD';
const ASK_PREGNANT = 'ASK_PREGNANT';
const SHOW_RESULTS = 'SHOW_RESULTS';
const FREE_CHAT = 'FREE_CHAT';

// Session Storage (In-memory)
const sessions = new Map();

/**
 * Multilingual questions for low-literacy users.
 * Kept under 25 words with emoji numbered choices.
 */
const questions = {
    [ASK_OCCUPATION]: {
        en: "What is your work?\n1️⃣ Farmer\n2️⃣ Labourer\n3️⃣ Homemaker\n4️⃣ Gig worker\n5️⃣ Shopkeeper\n6️⃣ Student\n7️⃣ Other",
        hi: "आप क्या काम करते हैं?\n1️⃣ किसान\n2️⃣ मज़दूर\n3️⃣ गृहिणी\n4️⃣ गिग वर्कर\n5️⃣ दुकानदार\n6️⃣ छात्र\n7️⃣ अन्य",
        bn: "আপনি কি কাজ করেন?\n1️⃣ কৃষক\n2️⃣ শ্রমিক\n3️⃣ গৃহিণী\n4️⃣ গিগ কর্মী\n5️⃣ দোকানদার\n6️⃣ ছাত্র\n7️⃣ অন্যান্য",
        ta: "உங்கள் வேலை என்ன?\n1️⃣ விவசாயி\n2️⃣ தொழிலாளி\n3️⃣ இல்லத்தரசி\n4️⃣ கிக் தொழிலாளி\n5️⃣ கடைக்காரர்\n6️⃣ மாணவர்\n7️⃣ மற்றவை",
        mr: "तुम्ही काय काम करता?\n1️⃣ शेतकरी\n2️⃣ मजूर\n3️⃣ गृहिणी\n4️⃣ गिग वर्कर\n5️⃣ दुकानदार\n6️⃣ विद्यार्थी\n7️⃣ इतर"
    },
    [ASK_GENDER]: {
        en: "What is your gender?\n1️⃣ Male\n2️⃣ Female\n3️⃣ Other",
        hi: "आपका लिंग क्या है?\n1️⃣ पुरुष\n2️⃣ महिला\n3️⃣ अन्य",
        bn: "আপনার লিঙ্গ কি?\n1️⃣ পুরুষ\n2️⃣ মহিলা\n3️⃣ অন্যান্য",
        ta: "உங்கள் பாலினம் என்ன?\n1️⃣ ஆண்\n2️⃣ பெண்\n3️⃣ மற்றவை",
        mr: "तुमचे लिंग काय आहे?\n1️⃣ पुरुष\n2️⃣ महिला\n3️⃣ इतर"
    },
    [ASK_LAND]: {
        en: "Do you own farming land?\n1️⃣ Yes\n2️⃣ No",
        hi: "क्या आपके पास खेती की जमीन है?\n1️⃣ हाँ\n2️⃣ नहीं",
        bn: "আপনার কি চাষের জমি আছে?\n1️⃣ হ্যাঁ\n2️⃣ না",
        ta: "உங்களுக்கு விவசாய நிலம் உள்ளதா?\n1️⃣ ஆம்\n2️⃣ இல்லை",
        mr: "तुमची स्वतःची शेतजमीन आहे का?\n1️⃣ हो\n2️⃣ नाही"
    },
    [ASK_INCOME]: {
        en: "Is your family income less than 2.5 lakh per year?\n1️⃣ Yes\n2️⃣ No",
        hi: "क्या आपकी पारिवारिक आय साल में 2.5 लाख से कम है?\n1️⃣ हाँ\n2️⃣ नहीं",
        bn: "আপনার পরিবারের আয় কি বছরে ২.৫ লক্ষের কম?\n1️⃣ হ্যাঁ\n2️⃣ না",
        ta: "உங்கள் குடும்ப வருமானம் ஆண்டுக்கு 2.5 லட்சத்திற்கும் குறைவாக உள்ளதா?\n1️⃣ ஆம்\n2️⃣ இல்லை",
        mr: "तुमचे कौटुंबिक उत्पन्न वर्षाला २.५ लाखांपेक्षा कमी आहे का?\n1️⃣ हो\n2️⃣ नाही"
    },
    [ASK_FAMILY_GIRL_CHILD]: {
        en: "Do you have a daughter under 10 years?\n1️⃣ Yes\n2️⃣ No",
        hi: "क्या आपकी 10 साल से कम उम्र की बेटी है?\n1️⃣ हाँ\n2️⃣ नहीं",
        bn: "আপনার কি ১০ বছরের কম বয়সী মেয়ে আছে?\n1️⃣ হ্যাঁ\n2️⃣ না",
        ta: "உங்களுக்கு 10 வயதுக்குட்பட்ட மகள் இருக்கிறாரா?\n1️⃣ ஆம்\n2️⃣ இல்லை",
        mr: "तुम्हाला १० वर्षांखालील मुलगी आहे का?\n1️⃣ हो\n2️⃣ नाही"
    },
    [ASK_PREGNANT]: {
        en: "Are you or your wife currently pregnant?\n1️⃣ Yes\n2️⃣ No",
        hi: "क्या आप या आपकी पत्नी अभी गर्भवती हैं?\n1️⃣ हाँ\n2️⃣ नहीं",
        bn: "আপনি বা আপনার স্ত্রী কি বর্তমানে গর্ভবতী?\n1️⃣ হ্যাঁ\n2️⃣ না",
        ta: "நீங்களோ அல்லது உங்கள் மனைவியோ தற்போது கர்ப்பமாக இருக்கிறீர்களா?\n1️⃣ ஆம்\n2️⃣ இல்லை",
        mr: "तुम्ही किंवा तुमची पत्नी सध्या गरोदर आहात का?\n1️⃣ हो\n2️⃣ नाही"
    }
};

/**
 * Maps current state to the next state in the flow.
 */
const transitions = {
    [START]: ASK_OCCUPATION,
    [ASK_OCCUPATION]: ASK_GENDER,
    [ASK_GENDER]: ASK_LAND,
    [ASK_LAND]: ASK_INCOME,
    [ASK_INCOME]: ASK_FAMILY_GIRL_CHILD,
    [ASK_FAMILY_GIRL_CHILD]: ASK_PREGNANT,
    [ASK_PREGNANT]: SHOW_RESULTS,
    [SHOW_RESULTS]: FREE_CHAT,
    [FREE_CHAT]: FREE_CHAT
};

/**
 * Gets or initializes a user session.
 */
function getSession(userId) {
    if (!sessions.has(userId)) {
        sessions.set(userId, {
            state: START,
            profile: {
                occupation: null,
                gender: null,
                hasLand: null,
                incomeLakh: null,
                hasGirlChild: null,
                isPregnant: null,
                hasBPLCard: true // Defaulted for rural context demo
            },
            history: [],
            schemeContext: "",
            detectedLanguage: "en"
        });
    }
    return sessions.get(userId);
}

/**
 * Parses user input and updates the profile object based on state.
 */
function updateProfile(session, state, userInput) {
    const input = userInput.trim();
    const isYes = input === '1' || input.toLowerCase().includes('yes') || input.includes('हाँ') || input.includes('হ্যাঁ') || input.includes('ஆம்') || input.includes('हो');
    const isNo = input === '2' || input.toLowerCase().includes('no') || input.includes('नहीं') || input.includes('না') || input.includes('இல்லை') || input.includes('नाही');

    switch (state) {
        case ASK_OCCUPATION:
            session.profile.occupation = parseOccupation(input);
            break;
        case ASK_GENDER:
            if (input === '1') session.profile.gender = 'male';
            else if (input === '2') session.profile.gender = 'female';
            else session.profile.gender = 'any';
            break;
        case ASK_LAND:
            session.profile.hasLand = isYes;
            break;
        case ASK_INCOME:
            session.profile.incomeLakh = isYes ? 1.5 : 5.0; // Simple threshold logic
            break;
        case ASK_FAMILY_GIRL_CHILD:
            session.profile.hasGirlChild = isYes;
            break;
        case ASK_PREGNANT:
            session.profile.isPregnant = isYes;
            break;
    }
}

module.exports = {
    START, ASK_OCCUPATION, ASK_GENDER, ASK_LAND, ASK_INCOME, 
    ASK_FAMILY_GIRL_CHILD, ASK_PREGNANT, SHOW_RESULTS, FREE_CHAT,
    questions,
    transitions,
    getSession,
    updateProfile
};
