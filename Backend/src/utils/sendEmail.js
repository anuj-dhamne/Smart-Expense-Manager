import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';

const transporter = nodemailer.createTransport({
    service: 'gmail', 
    auth: {
        user: process.env.EMAIL_USER,        
        pass: process.env.EMAIL_PASS   
    }
});

const sendMonthlyReportEmail = async (toEmail, monthName, pdfPath) => {
    const mailOptions = {
        from: `"BuckBit" <${process.env.EMAIL_USER}>`,
        to: toEmail,
        subject: `📄 Your Expense Report – ${monthName}`,
        text: `Hi there,\n\nAttached is your expense report for ${monthName}.\n\nStay smart with your spending! 💰\n\n- Smart Expenses Manager Team`,
        attachments: [
            {
                filename: `Expense_Report_${monthName}.pdf`,
                path: path.resolve(pdfPath),
                contentType: 'application/pdf'
            }
        ]
    };

    await transporter.sendMail(mailOptions);
};

export default sendMonthlyReportEmail;
