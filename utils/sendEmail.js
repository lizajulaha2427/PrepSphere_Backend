import dotenv from "dotenv";

dotenv.config();

export const sendOTPEmail = async (email, otp) => {
  try {
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": process.env.BREVO_API_KEY,
      },
      body: JSON.stringify({
        sender: {
          name: "PrepSphere",
          email: process.env.SMTP_FROM,
        },
        to: [
          {
            email: email,
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
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Brevo API Error:", data);
      throw new Error(data.message || "Failed to send email");
    }

    console.log("✅ Email sent:", data.messageId);
  } catch (err) {
    console.error("Email Error:", err);
    throw err;
  }
};