import mongoose from "mongoose";

const dairySchema = new mongoose.Schema(
  {
    text: {
      type: String,
      trim: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Dairy", dairySchema);
