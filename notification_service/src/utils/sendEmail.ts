import nodemailer from 'nodemailer';

async function sendEmail(email: string, type: string = 'immediate') {
  try {
    // Create transporter
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.APP_EMAIL,
        pass: process.env.APP_PASSWORD,
      },
    });

    // Email details
    let mailOptions;
    if (type === 'immediate') {
      mailOptions = {
        from: '"Your Name" <your-email-address>',
        to: email,
        subject: 'Hello from Nodemailer (TS) - immediate',
        text: 'This is a test email sent using Nodemailer and TypeScript - immediate.',
        html: '<b>This is a test email sent using Nodemailer and TypeScript - immediate.</b>',
      };
    } else {
      mailOptions = {
        from: '"Your Name" <your-email-address>',
        to: email,
        subject: 'Hello from Nodemailer (TS) - reminder',
        text: 'This is a test email sent using Nodemailer and TypeScript - reminder.',
        html: '<b>This is a test email sent using Nodemailer and TypeScript - reminder.</b>',
      };
    }

    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: %s', info.messageId);
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

export default sendEmail;
