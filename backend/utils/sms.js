import twilio from "twilio";
import dotenv from "dotenv";

dotenv.config();

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export const sendSMSCode = async (phoneNumber, code) => {
  try {
    await client.messages.create({
      body: `Your password reset code: ${code}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phoneNumber,
    });
    console.log(`📩 SMS with code ${code} sent to ${phoneNumber}`);
  } catch (error) {
    console.error("❌ Error sending SMS:", error);
    throw new Error("Error sending SMS");
  }
};
