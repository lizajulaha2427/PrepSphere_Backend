import mongoose from "mongoose";

const progressSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "AppUser", required: true },
  courseName: { type: String, required: true },
  lessonName: { type: String, required: true }, // name of the lesson
  progress: { type: Number, required: true },   // % completed
  date: { type: Date, default: Date.now },      // date of completion
}, { timestamps: true });

export default mongoose.model("Progress", progressSchema);
