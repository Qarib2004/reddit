import twilio from "twilio";
import dotenv from "dotenv";

dotenv.config();

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export const sendSMSCode = async (phoneNumber, resetCode) => {
  try {
    

    const message = await client.messages.create({
      body: `Your password reset code is: ${resetCode}`,
      from: process.env.TWILIO_PHONE_NUMBER, 
      to: phoneNumber,
    });

    console.log("SMS sent! Message SID:", message.sid);
  } catch (error) {
    console.error(" Error Twilio:", error);
    throw error;
  }
};