import easyinvoice from 'easyinvoice';
import fs from 'fs';
import path from 'path';
import getBase64Image from './ImageToLink.js';


export const generateMonthlyPDF = async (user, expenses, monthName) => {
    if (!expenses || expenses.length === 0) {
        throw new Error("No expenses available to generate PDF.");
    }

    // 1. Category-wise summary
    const grouped = {};
    for (let e of expenses) {
        grouped[e.category] = (grouped[e.category] || 0) + e.amount;
    }

    const categorySummary = Object.entries(grouped).map(([category, total]) => ({
        quantity: 1,
        description: `Total spent on ${category}`,
        price: total
    }));

    // 2. Detailed expense listing (treated as multiple line items)
    const allExpenses = expenses.map((e) => ({
        quantity: 1,
        description: `${e.title} – ${e.category} – ${new Date(e.date).toLocaleDateString()}`,
        price: e.amount
    }));

    const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);

    // Combine both sections
    const allProducts = [
        { quantity: 0, description: "**Summary by Category**", price: 0 },
        ...categorySummary,
        { quantity: 0, description: "**Detailed Expense Log**", price: 0 },
        ...allExpenses
    ];
    const logoBase64 = getBase64Image("public/temp/BuckBit_logo.png");

    const data = {
        images: {
            logo: "https://public.easyinvoice.cloud/img/logo_en_original.png",
            
        },
        sender: {
            company: "Smart Expenses Manager",
            address: "Generated Automatically",
            city: "India",
            country: "AI"
        },
        client: {
            company: user.name || "User",
            address: user.email || "user@example.com",
            country: "IN"
        },
        information: {
            number: `Expense-${Date.now()}`,
            date: new Date().toLocaleDateString(),
        },
        products: allProducts,
        "bottom-notice": `Total spending for ${monthName}: ₹${totalSpent}`,
        settings: {
            currency: "INR"
        },
    };

    const result = await easyinvoice.createInvoice(data);

    const reportsDir = 'reports';
    if (!fs.existsSync(reportsDir)) fs.mkdirSync(reportsDir);

    const outputPath = path.join(reportsDir, `Monthly_Report_${user._id}_${Date.now()}.pdf`);
    fs.writeFileSync(outputPath, result.pdf, 'base64');
    

    return outputPath;
};
