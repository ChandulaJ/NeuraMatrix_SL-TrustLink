import nodemailer from 'nodemailer';

async function sendEmail(email: string) {
  try {
    // Create transporter
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com', // Gmail SMTP
      port: 465,
      secure: true,
      auth: {
        user: process.env.APP_EMAIL, // your email
        pass: process.env.APP_PASSWORD, // app password, not your login password
      },
    });

    // Email details
    const mailOptions = {
      from: '"Your Name" <your-email-address>',
      to: email,
      subject: 'Hello from Nodemailer (TS)',
      text: 'This is a test email sent using Nodemailer and TypeScript.',
      html: '<b>This is a test email sent using Nodemailer and TypeScript.</b>',
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: %s', info.messageId);
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

export default sendEmail;
