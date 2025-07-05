import axios from 'axios';

async function predictCategory(expense) {
const cleanExpense = expense.trim().replace(/[\n\r]+/g, ' ');
const prompt = `
You are an AI assistant for a Smart Expenses Manager app.
Classify the given expense into ONLY one of the following categories:
1. Food & Dining
2. Rent
3. Transport
4. Entertainment
5. Bills & Utilities
6. Miscellaneous
Return ONLY in this JSON format:
{ "category": "<chosen category>" }
Examples:
"Domino's Pizza" = { "category": "Food & Dining" }
"PG Room Rent" = { "category": "Rent" }
"Uber to Office" = { "category": "Transport" }
"Hotstar Subscription" = { "category": "Entertainment" }
"Electricity Bill" = { "category": "Bills & Utilities" }
"Book from Amazon" = { "category": "Miscellaneous" }
"Cricket Turf Booking" = { "category": "Entertainment" }
Now classify: "${cleanExpense}"`;


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
        const ans = JSON.parse(responseText);

        if (process.env.NODE_ENV !== 'production') {
            console.log(`Category for ${expense}:`, ans);
        }

        return ans;
    } catch (error) {
        console.error("Failed to predict category:", error.message);
        return { category: "Miscellaneous" };
    }
}

export default predictCategory;
