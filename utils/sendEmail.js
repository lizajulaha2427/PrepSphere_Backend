import nodemailer from "nodemailer";

export const sendOTPEmail = async (email, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.sendgrid.net",
      port: 587,
      secure: false,
      auth: {
        user: "apikey",
        pass: process.env.SENDGRID_API_KEY,
      },
    });

    await transporter.sendMail({
      from: '"PrepSphere" <jiya210113@gmail.com>',
      to: email,
      subject: "Your OTP Code",
      html: `<h3>Your OTP is: <b>${otp}</b></h3><p>Valid for 10 minutes</p>`,
    });

    console.log("OTP email sent to:", email);
  } catch (err) {
    console.error("Failed to send OTP email:", err);
  }
};
