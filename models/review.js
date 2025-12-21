import mongoose from "mongoose";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Create a separate connection for reviews
let reviewsConnection;

try {
  if (process.env.REVIEWS_MONGO_URI) {
    reviewsConnection = mongoose.createConnection(process.env.REVIEWS_MONGO_URI);
    reviewsConnection.on('connected', () => console.log('✅ Reviews DB Connected'));
    reviewsConnection.on('error', (err) => console.log('❌ Reviews DB Error:', err));
  } else {
    console.log('⚠️  REVIEWS_MONGO_URI not found, using main connection for reviews');
    reviewsConnection = mongoose.connection;
  }
} catch (error) {
  console.log('❌ Error creating reviews connection:', error);
  reviewsConnection = mongoose.connection;
}

const reviewSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  title: { type: String, required: true },
  review: { type: String, required: true },
  course: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  helpful: { type: Number, default: 0 },
});

// Use the reviews connection
const Review = reviewsConnection.model("Review", reviewSchema);

export default Review;