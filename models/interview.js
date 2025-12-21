import mongoose from "mongoose";

const interviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "AppUser", required: true },
  jobRole: { type: String, required: true },
  score: { type: Number, required: true },
  strengths: [{ type: String }],
  weaknesses: [{ type: String }],
  improvementPlan: { type: String },
  date: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model("Interview", interviewSchema);
