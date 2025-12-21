import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import crypto from "crypto";
import { sendOTPEmail } from "../utils/sendEmail.js";

import dotenv from "dotenv";
dotenv.config();
const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const { fullName, email, password, goal, years } = req.body;

    const userExist = await User.findOne({ email });
    if (userExist)
      return res.status(400).json({ msg: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = crypto.randomInt(100000, 999999).toString();

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
      goal,
      years,
      otp,
      otpPurpose: "register",
      otpExpiry: Date.now() + 10 * 60 * 1000,
    });

    await newUser.save();
    await sendOTPEmail(email, otp);
    res.json({
      msg: "Registration successful. OTP sent to email.",
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});



// LOGIN
// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "User not found" });

    if (!user.isVerified)
      return res.status(401).json({ msg: "Please verify your email first" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ msg: "Invalid password" });

    const token = jwt.sign(
      { email: user.email, _id: user._id },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      msg: "Login successful",
      token,
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        goal: user.goal,
        years: user.years,
        isVerified: user.isVerified
      },
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});



router.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp, purpose } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ msg: "User not found" });

    if (user.otp !== otp || user.otpPurpose !== purpose)
      return res.status(400).json({ msg: "Invalid OTP" });

    if (user.otpExpiry < Date.now())
      return res.status(400).json({ msg: "OTP expired" });

    // ✅ Mark user as verified if it's registration OTP
    if (purpose === "register") {
      user.isVerified = true;
    }

    // Clear OTP fields
    user.otp = null;
    user.otpExpiry = null;
    user.otpPurpose = undefined;

    await user.save();

    // 🔹 Generate JWT token
    const token = jwt.sign(
      { email: user.email, _id: user._id },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    // 🔹 Send user info + token to frontend
    res.json({
      msg: "OTP verified successfully",
      token,
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        goal: user.goal,
        years: user.years,
        isVerified: user.isVerified
      }
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});


router.post("/reset-password", async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    const hashed = await bcrypt.hash(newPassword, 10);

    await User.findOneAndUpdate(
      { email, isVerified: true },
      { password: hashed }
    );

    res.json({ msg: "Password reset successful" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});


// ❌ REMOVE THIS — not needed anymore
// router.get("/videos/:userId", ... )
router.post("/change-password", async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword)
      return res.status(400).json({ msg: "Missing fields" });

    const hashed = await bcrypt.hash(newPassword, 10);

    await User.findOneAndUpdate(
      { email },
      { password: hashed }
    );

    res.json({ msg: "Password changed successfully!" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: "User not found" });

    const otp = crypto.randomInt(100000, 999999).toString();

    user.otp = otp;
    user.otpPurpose = "reset";
    user.otpExpiry = Date.now() + 10 * 60 * 1000;
    await user.save();

    await sendOTPEmail(email, otp);

    res.json({ msg: "OTP sent to email" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

export default router;