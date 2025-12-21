import express from "express";
import Interview from "../models/interview.js";
import User from "../models/user.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

// Save new interview result
router.post("/", authenticate, async (req, res) => {
  try {
    const { jobRole, score, strengths, weaknesses, improvementPlan } = req.body;

    const user = await User.findOne({ email: req.user.email });
    if (!user) return res.status(404).json({ msg: "User not found" });

    const newInterview = await Interview.create({
      user: user._id,
      jobRole,
      score,
      strengths,
      weaknesses,
      improvementPlan
    });

    res.json({ msg: "Interview saved", interview: newInterview });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: err.message });
  }
});

// Get all interviews for user + calculate average
router.get("/average", authenticate, async (req, res) => {
  try {
    const user = await User.findOne({ email: req.user.email });
    if (!user) return res.status(404).json({ msg: "User not found" });

    const interviews = await Interview.find({ user: user._id });

    const avgScore =
      interviews.length > 0
        ? interviews.reduce((sum, i) => sum + i.score, 0) / interviews.length
        : 0;

    res.json({ interviews, averageScore: avgScore.toFixed(2) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: err.message });
  }
});

export default router;
