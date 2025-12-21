import express from "express";
import Review from "../models/review.js";

const router = express.Router();

// GET /api/reviews - Fetch reviews with pagination, filters, sorting
router.get("/", async (req, res) => {
  try {
    const { page = 1, limit = 6, rating, course, sortBy = "createdAt", sortOrder = "desc" } = req.query;

    const filter = {};
    if (rating) filter.rating = rating;
    if (course) filter.course = course;

    const sort = {};
    sort[sortBy] = sortOrder === "desc" ? -1 : 1;

    const reviews = await Review.find(filter)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json(reviews);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// POST /api/reviews - Submit new review
router.post("/", async (req, res) => {
  try {
    const { name, email, rating, title, review, course } = req.body;

    if (!name || !email || !rating || !title || !review || !course) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ msg: "Rating must be between 1 and 5" });
    }

    const existingReview = await Review.findOne({ email });
    if (existingReview) {
      return res.status(400).json({ msg: "A review with this email already exists" });
    }

    const newReview = new Review({ name, email, rating, title, review, course });
    await newReview.save();

    res.status(201).json({ msg: "Review submitted successfully" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// PATCH /api/reviews/:id/helpful - Increment helpful count
router.patch("/:id/helpful", async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ msg: "Review not found" });
    }

    review.helpful += 1;
    await review.save();

    res.json({ helpful: review.helpful });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// GET /api/reviews/stats - Get statistics
router.get("/stats", async (req, res) => {
  try {
    const totalReviews = await Review.countDocuments();
    const result = await Review.aggregate([
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" }
        }
      }
    ]);

    const averageRating = result.length > 0 ? Math.round(result[0].averageRating * 10) / 10 : 0;

    res.json({ totalReviews, averageRating });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

export default router;