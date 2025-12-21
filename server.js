import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import progressRoutes from "./routes/progress.js"
import reviewsRouter from "./routes/reviews.js"
import interviewRoutes from "./routes/interview.js";
const app = express();

app.use(express.json());
app.use(cors());

import dotenv from "dotenv";
dotenv.config();

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.log(err));

app.use("/api/auth", authRoutes);
app.use('/api/reviews', reviewsRouter);
app.use("/api/progress", progressRoutes);
app.use("/api/interview", interviewRoutes);


app.listen(4000, () => console.log("🚀 Server running on http://localhost:4000"));
