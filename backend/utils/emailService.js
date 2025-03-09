import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail', 
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendPaymentVerificationEmail = async (user, verificationCode) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: "Your PayPal Payment Verification Code",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="https://www.paypalobjects.com/webstatic/mktg/logo/pp_cc_mark_111x69.jpg" alt="PayPal" style="height: 40px; width: auto;">
        </div>
        
        <h2 style="color: #253b80; text-align: center;">Your Verification Code</h2>
        
        <p style="color: #333; font-size: 16px;">Hello ${user.username},</p>
        
        <p style="color: #333; font-size: 16px;">Please use the following code to verify your payment:</p>
        
        <div style="background-color: #f5f5f5; padding: 15px; text-align: center; font-size: 28px; font-weight: bold; margin: 20px 0; letter-spacing: 5px; color: #253b80;">
          ${verificationCode}
        </div>
        
        <p style="color: #333; font-size: 16px;">This code will expire in 10 minutes.</p>
        
        <p style="color: #333; font-size: 16px;">If you didn't request this code, please ignore this email or contact customer support if you have concerns about your account security.</p>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 12px; text-align: center;">
          <p>This is an automated email, please do not reply.</p>
          <p>&copy; ${new Date().getFullYear()} Your Application. All rights reserved.</p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Verification email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email");
  }
};
