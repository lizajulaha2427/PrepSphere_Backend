import nodemailer from "nodemailer";

export const sendOTPEmail = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.sendgrid.net",
    port: 587,
    auth: {
      user: "apikey", // literally the string "apikey"
      pass: process.env.SENDGRID_API_KEY, // your SendGrid API key
    },
  });

  await transporter.sendMail({
    from: '"PrepRoadmap" <no-reply@prepsphere.com>',
    to: email,
    subject: "Your OTP Code",
    html: `<h3>Your OTP is: <b>${otp}</b></h3><p>Valid for 10 minutes</p>`,
  });
};
