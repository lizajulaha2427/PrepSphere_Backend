import dotenv from "dotenv";
import Brevo from "@getbrevo/brevo";

dotenv.config();

const apiInstance = new Brevo.TransactionalEmailsApi();

apiInstance.setApiKey(
  Brevo.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY
);

export const sendOTPEmail = async (email, otp) => {
  try {
    await apiInstance.sendTransacEmail({
      sender: {
        name: "PrepSphere",
        email: process.env.SMTP_FROM,
      },
      to: [
        {
          email,
        },
      ],
      subject: "Your OTP Code",
      htmlContent: `
        <div style="font-family: Arial, sans-serif;">
          <h2>PrepSphere Email Verification</h2>
          <p>Your OTP is:</p>
          <h1 style="letter-spacing:4px;">${otp}</h1>
          <p>This OTP is valid for <b>10 minutes</b>.</p>
        </div>
      `,
    });

    console.log("✅ Email sent successfully");
  } catch (err) {
    console.error("Brevo API Error:", err);
    throw err;
  }
};