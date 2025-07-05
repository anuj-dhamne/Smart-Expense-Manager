import { Expense } from '../models/expense.model.js';
import { User } from '../models/user.model.js';
import { generateMonthlyPDF } from '../utils/generateMonthlyPDF.js';
import sendMonthlyReportEmail from '../utils/sendEmail.js';
import { startOfMonth, endOfMonth, subMonths } from 'date-fns';

export const testMonthlyReport = async (req, res) => {
    try {
        const user = await User.findOne(); // get any user (or use req.user if logged in)
        if (!user) return res.status(404).json({ message: "No user found." });

        const prevMonthStart = startOfMonth(subMonths(new Date(), 1));
        const prevMonthEnd = endOfMonth(subMonths(new Date(), 1));

        const expenses = await Expense.find({
            owner: user._id,
            date: { $gte: prevMonthStart, $lte: prevMonthEnd }
        });

        if (!expenses.length) {
            return res.status(404).json({ message: "No expenses found for previous month." });
        }

        const monthName = prevMonthStart.toLocaleString('default', { month: 'long', year: 'numeric' });

        const pdfPath = await generateMonthlyPDF(user, expenses, monthName);
        await sendMonthlyReportEmail(user.email, monthName, pdfPath);

        res.status(200).json({ message: "✅ Test PDF report generated and sent to email." });

    } catch (err) {
        console.error("❌ Error sending test report:", err.message);
        res.status(500).json({ error: err.message });
    }
};
