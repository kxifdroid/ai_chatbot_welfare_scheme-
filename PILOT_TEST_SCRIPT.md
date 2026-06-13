# Pilot Test Script: Multilingual Welfare Chatbot

## 1. Consent Introduction (Hindi - To be read aloud)
"नमस्ते। मेरा नाम [Tester Name] है। हम एक नए कंप्यूटर प्रोग्राम की जांच कर रहे हैं जो सरकारी योजनाओं (Government Schemes) के बारे में जानकारी देता है। 

क्या आप इस प्रोग्राम को चलाकर देख सकते हैं? आपको बस व्हाट्सएप (WhatsApp) की तरह मैसेज टाइप करना है। हम यह देखना चाहते हैं कि क्या यह प्रोग्राम आम लोगों के लिए आसान है या नहीं। 

आप जो भी कहेंगे या टाइप करेंगे, वह गुप्त रहेगा। अगर आप बीच में रुकना चाहें, तो कभी भी रुक सकते हैं। क्या आप शुरू करने के लिए तैयार हैं?"

---

## 2. User Tasks (Tester Guidance)
The tester should explain these tasks one by one and observe the user. Do not help unless they are completely stuck for more than 2 minutes.

| Task # | Task Goal | Instructions to User (Hindi) |
| :--- | :--- | :--- |
| **1** | Find a Qualifying Scheme | "इस प्रोग्राम को अपनी जानकारी दें और देखें कि आप किन सरकारी योजनाओं के लिए पात्र (Eligible) हैं।" |
| **2** | Get Document List | "जो योजना आपको मिली है, उसके लिए कौन से कागज (Documents) चाहिए, यह पूछें।" |
| **3** | Mixed Language Use | "अगला सवाल हिंदी और अंग्रेजी मिलाकर पूछें, जैसे: 'Kisan Yojana के लिए apply कैसे करें?'" |
| **4** | Non-Qualifying Scheme | "किसी ऐसी योजना के बारे में पूछें जिसके लिए आप पात्र नहीं हैं (जैसे अगर आप पुरुष हैं तो लाड़ली बहना के बारे में पूछें)।" |
| **5** | Unanswerable Question | "कोई ऐसा सवाल पूछें जिसका जवाब सरकारी योजना से न हो, जैसे 'आज का मौसम कैसा है?' देखें प्रोग्राम क्या कहता है।" |

---

## 3. Observation Sheet (Tester to Fill)
| User ID | Age | Occupation | Language Used | T1 Done? | T2 Done? | T3 Done? | T4 Done? | T5 Done? | Total Turns | Confusion Points / Notes |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| U01 | | | | Y/N | Y/N | Y/N | Y/N | Y/N | | |
| U02 | | | | Y/N | Y/N | Y/N | Y/N | Y/N | | |

---

## 4. Post-Chat Comprehension Quiz (Hindi)
Ask the user these 5 questions about the scheme they found in Task 1.

1. **योजना का नाम**: आपको कौन सी योजना के बारे में पता चला?
2. **फायदा**: इस योजना में सरकार आपको क्या दे रही है (पैसे, अनाज, या कुछ और)?
3. **पात्रता**: इस योजना को पाने के लिए आपके पास क्या होना जरूरी है?
4. **कागज**: क्या आपको याद है कि इस योजना के लिए कौन सा एक मुख्य दस्तावेज (Document) चाहिए?
5. **मदद**: अगर आपको और जानकारी चाहिए, तो आप किस नंबर पर फोन करेंगे?

---

## 5. Scoring Rubric (70% Comprehension Target)
Each question in the quiz is worth **1 point**. Total points possible: **5**.

| Score | Percentage | Interpretation |
| :--- | :--- | :--- |
| **5/5** | 100% | **Excellent**: Complete understanding of the scheme and support channel. |
| **4/5** | 80% | **Good**: Understands core benefits and requirements. |
| **3.5/5** | 70% | **Target Met**: Sufficient understanding for independent action. |
| **2/5 or lower** | <50% | **Failure**: Bot failed to communicate key details clearly. Requires redesign. |

### **Target Metric**
At least **80% of participants** (8 out of 10) must score **3.5/5 or higher** to pass the pilot phase.
