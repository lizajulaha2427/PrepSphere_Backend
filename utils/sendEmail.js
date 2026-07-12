import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.error("SMTP Error:", error);
  } else {
    console.log("SMTP Server is ready");
  }
});

export const sendOTPEmail = async (email, otp) => {
  try {
    await transporter.sendMail({
      from: `"PrepSphere" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your OTP Code",
      html: `
        <div style="font-family: Arial, sans-serif;">
          <h2>PrepSphere Email Verification</h2>
          <p>Your OTP is:</p>
          <h1 style="letter-spacing:4px;">${otp}</h1>
          <p>This OTP is valid for <b>10 minutes</b>.</p>
        </div>
      `,
    });

    console.log("OTP sent successfully.");
  } catch (err) {
    console.error("Email Error:", err);
    throw err;
  }
};