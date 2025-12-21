import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const sendOTPEmail = async (email, otp) => {
  try {
    const msg = {
      to: email,
      from: {
        email: "jiya210113@gmail.com", // VERIFIED sender
        name: "PrepRoadmap",
      },
      subject: "Your OTP Code",
      html: `<h3>Your OTP is: <b>${otp}</b></h3>
             <p>Valid for 10 minutes</p>`,
    };

    await sgMail.send(msg);
    console.log("OTP email sent to:", email);
  } catch (err) {
    console.error("SendGrid API error:", err.response?.body || err);
  }
};
