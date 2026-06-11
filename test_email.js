require('dotenv').config({ path: './backend/.env' });
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

transporter.sendMail({
  from: process.env.SMTP_EMAIL,
  to: process.env.SMTP_EMAIL,
  subject: 'Test',
  text: 'Test email'
}).then(() => console.log('Success')).catch(err => console.error(err));
