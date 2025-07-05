import cron from 'node-cron';
import { User } from '../models/user.model.js';
import { Expense } from '../models/expense.model.js'; // Update path as per your project
import { generateMonthlyPDF } from './generateMonthlyPDF.js'; // Path to your PDF function
import sendMonthlyReportEmail from './sendEmail.js'; // We’ll implement this next
import { startOfMonth, endOfMonth, subMonths } from 'date-fns';

cron.schedule('0 9 1 * *', async () => {
    console.log('📅 Running Monthly Report Job -', new Date().toISOString());

    try {
        const users = await User.find({isMailAllow : true}); // You can add filters here

        for (const user of users) {
            const prevMonthStart = startOfMonth(subMonths(new Date(), 1));
            const prevMonthEnd = endOfMonth(subMonths(new Date(), 1));

            const expenses = await Expense.find({
                owner: user._id,
                date: { $gte: prevMonthStart, $lte: prevMonthEnd }
            });

            if (!expenses.length) {
                console.log(`⚠️ No expenses found for ${user.email} in last month.`);
                continue;
            }

            const monthName = prevMonthStart.toLocaleString('default', { month: 'long', year: 'numeric' });

            const pdfPath = await generateMonthlyPDF(user, expenses, monthName);

            // Step 3: Email the PDF
            await sendMonthlyReportEmail(user.email, monthName, pdfPath);
            console.log(`✅ Sent report to ${user.email}`);
        }
    } catch (err) {
        console.error("❌ Error in monthly report scheduler:", err.message);
    }
});
