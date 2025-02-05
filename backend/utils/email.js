import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendVerificationEmail = async (user, emailToken) => {
  const verificationLink = `${process.env.CLIENT_URL}/verify-email?token=${emailToken}`;

  console.log("📧 Ссылка для подтверждения:", verificationLink);

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: "Registration Confirmation",
    html: `<p>Hello, ${user.username}!</p>
<p>Please confirm your registration by clicking the link below:</p>
<a href="${verificationLink}">Verify email</a>`,
  };

  await transporter.sendMail(mailOptions);
};

export const sendPasswordResetEmail = async (user, resetToken) => {
  const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: "Password Reset",
    html: `<p>You have requested a password reset.</p>
<p>Follow the link below to install new password:</p>
<a href="${resetLink}">Reset password</a>`,
  };

  await transporter.sendMail(mailOptions);
};
