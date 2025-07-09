// models/Response.js
import mongoose from "mongoose";

const moodSchema = new mongoose.Schema({
  keyword: { type: String, required: true, unique: true },
//   emotion: {
//     type: String,
//     enum: ["happy", "sad", "angry", "neutral"],
//     required: true,
//   },
  reply: { type: String, required: true },
});

export default mongoose.model("Mood", moodSchema);
