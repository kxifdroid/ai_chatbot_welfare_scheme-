/**
 * Maps varied user input to canonical occupation values.
 * Handles English, Hindi (Devanagari & Romanized), numbers, and phrases.
 * 
 * @param {string} userInput - The raw text from the user.
 * @returns {string} - Canonical value: farmer, labourer, homemaker, gig-worker, shopkeeper, student, or other.
 */
function parseOccupation(userInput) {
    if (!userInput) return 'other';

    const text = userInput.toString().toLowerCase().trim();

    // 1. Handle Numbered Choices (Mapping 1-7)
    const numberMap = {
        '1': 'farmer',
        '2': 'labourer',
        '3': 'homemaker',
        '4': 'gig-worker',
        '5': 'shopkeeper',
        '6': 'student',
        '7': 'other'
    };
    if (numberMap[text]) return numberMap[text];

    // 2. Keyword Patterns Lookup
    const patterns = {
        farmer: [
            /farmer/i, /farming/i, /kisan/i, /khet/i, /kheti/i, /krishak/i,
            /किसान/u, /खेती/u, /कृषक/u, /खेतिहर/u
        ],
        labourer: [
            /labourer/i, /worker/i, /mazdoor/i, /majdoor/i, /labor/i, /daily wage/i,
            /मज़दूर/u, /मजदूर/u, /मजदूरी/u, /श्रमिक/u
        ],
        homemaker: [
            /homemaker/i, /housewife/i, /home maker/i, /grihini/i, /house wife/i,
            /गृहिणी/u, /हाउसवाइफ/u, /घर का काम/u
        ],
        'gig-worker': [
            /gig/i, /delivery/i, /swiggy/i, /zomato/i, /driver/i, /taxi/i, /auto/i, /freelance/i,
            /डिलीवरी/u, /ड्राइवर/u, /टैक्सी/u
        ],
        shopkeeper: [
            /shopkeeper/i, /shop/i, /dukandaar/i, /dukan/i, /vyapari/i, /retailer/i,
            /दुकानदार/u, /दुकान/u, /व्यापारी/u
        ],
        student: [
            /student/i, /padhai/i, /chhatra/i, /vidyarthi/i, /college/i, /school/i,
            /छात्र/u, /विद्यार्थी/u, /पढ़ाई/u
        ]
    };

    // 3. Search for matches in the input string
    for (const [canonical, regexList] of Object.entries(patterns)) {
        for (const regex of regexList) {
            if (regex.test(text)) {
                return canonical;
            }
        }
    }

    return 'other';
}

module.exports = { parseOccupation };
