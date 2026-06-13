# Offline SMS Fallback System (Serverless)

This system provides a 100% offline eligibility check via SMS. It is designed to fit within the 160-character GSM limit and requires **no backend server**, running entirely within Twilio Studio.

---

## 1. SMS Conversation Script (GSM Optimized)

| Step | Bot Message (SMS) | Length | User Reply |
| :--- | :--- | :--- | :--- |
| **Intro** | WelfareBot: Find Govt schemes for you. Reply 'START' to begin. | 59 | START |
| **Q1** | What is your work? 1.Farmer 2.Labourer 3.Homemaker 4.Shopkeeper 5.Other. Reply a number. | 85 | 1 |
| **Q2** | Your gender? 1.Male 2.Female 3.Other | 36 | 1 |
| **Q3** | Do you own farming land? 1.Yes 2.No | 35 | 1 |
| **Q4** | Family income < 2.5 Lakh per year? 1.Yes 2.No | 45 | 1 |
| **Q5** | Do you have a daughter under 10? 1.Yes 2.No | 43 | 2 |
| **Q6** | Are you or your wife pregnant? 1.Yes 2.No | 41 | 2 |
| **Result** | Results: 1.PM-KISAN (6k/yr). Docs: Aadhar, Land papers, Bank book. 2.PMJAY (Health). Help: 14555. | 95 | - |

---

## 2. Twilio Studio Flow (JSON Configuration)

This JSON represents a simplified Twilio Studio Flow. It uses `send_and_wait_for_reply` widgets to collect data and `split_based_on` for the final recommendation logic.

```json
{
  "description": "Welfare Bot Offline SMS Flow",
  "states": [
    {
      "name": "Trigger",
      "type": "trigger",
      "transitions": [
        { "next": "ask_occupation", "event": "incomingMessage" }
      ]
    },
    {
      "name": "ask_occupation",
      "type": "send_and_wait_for_reply",
      "properties": {
        "body": "What is your work? 1.Farmer 2.Labourer 3.Homemaker 4.Shopkeeper 5.Other. Reply a number.",
        "from": "{{flow.channel.address}}"
      },
      "transitions": [
        { "next": "ask_gender", "event": "reply" },
        { "next": "ask_occupation", "event": "noReply" }
      ]
    },
    {
      "name": "ask_gender",
      "type": "send_and_wait_for_reply",
      "properties": {
        "body": "Your gender? 1.Male 2.Female 3.Other",
        "from": "{{flow.channel.address}}"
      },
      "transitions": [
        { "next": "ask_land", "event": "reply" }
      ]
    },
    {
      "name": "ask_land",
      "type": "send_and_wait_for_reply",
      "properties": {
        "body": "Do you own farming land? 1.Yes 2.No",
        "from": "{{flow.channel.address}}"
      },
      "transitions": [
        { "next": "ask_income", "event": "reply" }
      ]
    },
    {
      "name": "ask_income",
      "type": "send_and_wait_for_reply",
      "properties": {
        "body": "Family income < 2.5 Lakh per year? 1.Yes 2.No",
        "from": "{{flow.channel.address}}"
      },
      "transitions": [
        { "next": "check_eligibility", "event": "reply" }
      ]
    },
    {
      "name": "check_eligibility",
      "type": "split_based_on",
      "properties": {
        "input": "{{widgets.ask_occupation.inbound.Body}}",
        "cases": [
          { "value": "1", "operator": "equal_to", "next": "check_land" }
        ],
        "default_transition": "show_general_results"
      }
    },
    {
      "name": "check_land",
      "type": "split_based_on",
      "properties": {
        "input": "{{widgets.ask_land.inbound.Body}}",
        "cases": [
          { "value": "1", "operator": "equal_to", "next": "show_farmer_results" }
        ],
        "default_transition": "show_general_results"
      }
    },
    {
      "name": "show_farmer_results",
      "type": "send_message",
      "properties": {
        "body": "Results: 1.PM-KISAN (6k/yr). Docs: Aadhar, Land papers, Bank book. 2.PMJAY (Health). Help: 14555.",
        "from": "{{flow.channel.address}}"
      }
    },
    {
      "name": "show_general_results",
      "type": "send_message",
      "properties": {
        "body": "Results: 1.Ayushman Bharat (Health coverage). Docs: Ration card, Aadhar. 2.NREGA. Help: 14555.",
        "from": "{{flow.channel.address}}"
      }
    }
  ],
  "initial_state": "Trigger",
  "flags": { "allow_native_integration": true }
}
```

---

## 3. Implementation Logic
1.  **State Management**: Twilio Studio's `widgets.widget_name.inbound.Body` acts as the memory for user answers.
2.  **Branching**: The `check_eligibility` and `check_land` widgets implement the core RAG-like logic without needing a DB or API.
3.  **Optimization**: Questions are kept under 100 characters to allow for network headers and ensure reliable delivery on basic GSM handsets.
