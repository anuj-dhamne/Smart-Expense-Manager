// File: utils/predictSummary.js

import axios from "axios";

async function predictSummary(currentData, previousData) {
    const currentText = Object.entries(currentData)
        .map(([key, value]) => `- ${key}: ₹${value}`)
        .join("\n");

    const previousText = Object.entries(previousData)
        .map(([key, value]) => `- ${key}: ₹${value}`)
        .join("\n");
    // console.log("Current expenses : ",currentText);
   
    const prompt = `You are an AI financial assistant for a Smart Expenses Manager app.

Below is the user's expense data:

Current Month:
${currentText}

Previous Month:
${previousText}

Instructions:
1. If both months' data are available:
   - Compare each expense category.
   - Mention significant increases or decreases with actual amounts.
     (e.g., "You spent ₹3000 on Entertainment this month, which is ₹1500 more than last month.")
   - Praise improvements (e.g., reduced spending or smart habits).
   - Suggest friendly and actionable tips where overspending is observed.
   - Keep the tone friendly, supportive, yet professional.

2. If previous month’s data is missing or empty:
   - Summarize the current month’s spending across categories.
   - Highlight the highest spending areas.
   - Offer useful advice for saving or controlling unnecessary expenses.

Respond with a concise, user-friendly paragraph. Avoid unnecessary repetition or vague statements. Focus on clarity, usefulness, and a human-like tone.`;


    try {
        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
            {
                contents: [{ role: "user", parts: [{ text: prompt }] }]
            },
            {
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );

        let responseText = response.data.candidates[0].content.parts[0].text;
        responseText = responseText.replace(/```json|```/g, "").trim();

        return responseText;
    } catch (error) {
        console.error("Gemini summary generation failed:", error.message);
        return "We couldn't generate your monthly summary at the moment. Please try again later.";
    }
}

export default predictSummary;
