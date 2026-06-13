# Welfare Bot: 20 Realistic Test Scenarios

This test suite covers diverse linguistic styles, scripts, and edge cases common in rural Indian contexts.

1. **Pure Hindi (Devanagari)**
   - **USER**: मुझे खेती के लिए पैसे चाहिए, कोई योजना है?
   - **BOT**: नमस्ते! खेती के लिए 'PM-KISAN' योजना है जिसमें साल के ₹6000 मिलते हैं। क्या आपके पास अपनी जमीन है?

2. **Pure English**
   - **USER**: I want to apply for a scholarship for my daughter.
   - **BOT**: I can help with that. For girl students, the 'Sukanya Samriddhi Yojana' and 'National Scholarship Portal' are available. Is your daughter under 10 years old?

3. **Romanized Hindi (Hinglish)**
   - **USER**: Mera rashon card nahi ban raha, help karo.
   - **BOT**: Main samajh sakta hoon. 'NFSA Ration Card' ke liye aapke paas Aadhar card aur income certificate hona chahiye. Kya aapke paas ye documents hain?

4. **Tamil-English Mixed**
   - **USER**: Enakku gas connection apply panna help venum, Ujjwala scheme.
   - **BOT**: நிச்சயமாக (Certainly). 'PM Ujjwala Yojana' மூலம் நீங்கள் இலவச கேஸ் இணைப்பு பெறலாம். உங்கள் குடும்பத்தில் BPL கார்டு இருக்கிறதா?

5. **Bengali with English words**
   - **USER**: Amar heart surgery-r jonyo kono medical scheme ache?
   - **BOT**: হ্যাঁ (Yes), 'Ayushman Bharat PM-JAY' প্রকল্পের অধীনে আপনি ₹5 লক্ষ পর্যন্ত বিনামূল্যে চিকিৎসা পেতে পারেন। আপনার কাছে কি ডিজিটাল রেশন কার্ড আছে?

6. **Hindi Spelling Mistake**
   - **USER**: किसान योजना का पइसा कब आयेगा? (Mistake: पइसा instead of पैसा)
   - **BOT**: PM-KISAN योजना की किस्तें हर चार महीने में आती हैं। क्या आपने अपना स्टेटस चेक किया है? मैं इसमें आपकी मदद कर सकता हूँ।

7. **Colloquial Scheme Name (Hindi)**
   - **USER**: वो मोदी वाली किसान योजना के बारे में बताओ।
   - **BOT**: आप शायद 'PM-KISAN' योजना की बात कर रहे हैं। इसमें किसानों को साल में ₹6000 की मदद दी जाती है। क्या आप इस योजना के बारे में विस्तार से जानना चाहेंगे?

8. **Frustrated User (Hinglish)**
   - **USER**: Mujhe kuch nahi pata, ye sab kaise hota hai.
   - **BOT**: परेशान न हों, मैं आपकी पूरी मदद करूँगा। हम छोटे-छोटे सवालों से शुरू करेंगे। सबसे पहले बताएं, आप क्या काम करते हैं?

9. **Single Number Response (Menu flow)**
   - **USER**: 1
   - **BOT**: धन्यवाद। आपने 'Farmer' चुना है। क्या आपके पास अपनी खेती की जमीन है? 1. हाँ 2. नहीं

10. **Off-topic Question**
    - **USER**: आज मौसम कैसा है?
    - **BOT**: क्षमा करें, मैं केवल सरकारी योजनाओं की जानकारी दे सकता हूँ। क्या आप किसी खास योजना जैसे PM-KISAN या राशन कार्ड के बारे में जानना चाहते हैं?

11. **Inquiry about Documents (Marathi)**
    - **USER**: PMJAY साठी कोणती कागदपत्रे लागतील?
    - **BOT**: 'Ayushman Bharat PM-JAY' साठी तुम्हाला आधार कार्ड आणि रेशन कार्ड लागेल. तुमच्याकडे ही दोन्ही कागदपत्रे आहेत का?

12. **Eligibility Doubt (English)**
    - **USER**: My income is 3 lakh, can I get a scholarship?
    - **BOT**: As per official data for the National Scholarship Portal, the family income limit is usually ₹2.5 lakh. You might not be eligible, but please call 14555 for specific state schemes.

13. **Mixed Romanized Bengali**
    - **USER**: 100 diner kaaj pabo ki kore?
    - **BOT**: 'MGNREGS' প্রকল্পের অধীনে আপনি ১০০ দিনের কাজ পেতে পারেন। এর জন্য আপনার একটি 'Job Card' থাকা দরকার। আপনার কি জব কার্ড আছে?

14. **Help Request (Tamil)**
    - **USER**: உதவி எண் சொல்லுங்க (Tell me the helpline number)
    - **BOT**: நிச்சயமாக, அரசு உதவி எண் 14555 ஆகும். உங்களுக்கு வேறு ஏதேனும் திட்டங்களைப் பற்றி தெரிய வேண்டுமா?

15. **Query about Pregnancy Benefits (Hindi)**
    - **USER**: मेरी पत्नी प्रेग्नेंट है, क्या कोई मदद मिलेगी?
    - **BOT**: हाँ, 'PM Matru Vandana Yojana' के तहत गर्भवती महिलाओं को ₹5000 की आर्थिक मदद मिलती है। क्या यह आपके परिवार का पहला बच्चा है?

16. **Colloquial Name (Marathi)**
    - **USER**: मुलीच्या लग्नासाठी पैसे देणारी योजना कोणती?
    - **BOT**: मुलींच्या उज्ज्वल भविष्यासाठी 'Sukanya Samriddhi Yojana' आहे, जी शिक्षण आणि लग्नासाठी निधी जमा करण्यास मदत करते. तुमची मुलगी १० वर्षांपेक्षा कमी वयाची आहे का?

17. **Refusal to Hallucinate (English)**
    - **USER**: Can I get a free tractor from the government?
    - **BOT**: I do not have official information about a 'Free Tractor' scheme in my records. For verified details on agricultural tools, please call 14555.

18. **Language Switch Mid-Conversation**
    - **USER**: (Earlier speaking Hindi) Now tell me in English about health.
    - **BOT**: Sure, I will speak in English. For health, 'Ayushman Bharat PM-JAY' provides coverage up to ₹5 lakh per year. Do you have a ration card?

19. **Vague Inquiry (Romanized Hindi)**
    - **USER**: Modi ji ki scheme
    - **BOT**: Modi ji ne kai schemes shuru ki hain jaise PM-KISAN, PM-JAY aur Ujjwala. Aapko kis cheez mein madad chahiye? (Kheti, Ilaaj ya Gas?)

20. **Polite Closing**
    - **USER**: Thanks for help.
    - **BOT**: You're welcome! It was my pleasure to help you. If you have more questions later, feel free to ask. Have a good day!
