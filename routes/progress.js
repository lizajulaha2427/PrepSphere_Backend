import express from "express";
import Progress from "../models/progress.js";
import User from "../models/user.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

// Add or update lesson progress
router.post("/", authenticate, async (req, res) => {
  try {
    const { courseName, lessonName, progress } = req.body;
    const user = await User.findOne({ email: req.user.email });
    if (!user) return res.status(404).json({ msg: "User not found" });

    // Save progress for this lesson
    const newProgress = await Progress.create({
      user: user._id,
      courseName,
      lessonName,
      progress,
      date: new Date(),
    });

    res.json({ msg: "Progress saved", progress: newProgress });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: err.message });
  }
});

// Get all progress for this user
router.get("/", authenticate, async (req, res) => {
  try {
    const user = await User.findOne({ email: req.user.email });
    if (!user) return res.status(404).json({ msg: "User not found" });

    const progressEntries = await Progress.find({ user: user._id }).sort({ date: 1 });

    res.json(progressEntries);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: err.message });
  }
});

export default router;
