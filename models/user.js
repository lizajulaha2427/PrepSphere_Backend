import mongoose from "mongoose";

const appUserSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
  goal:     { type: String },
  years:    { type: [String], default: [] },

  isVerified: { type: Boolean, default: false },
  otp: String,
  otpExpiry: Date,
otpPurpose: {
  type: String,
  enum: ["register", "reset"],
  required: false,
}
}, { timestamps: true });



export default mongoose.model("AppUser", appUserSchema);
