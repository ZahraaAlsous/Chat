import mongoose from "mongoose";

const callSchema = new mongoose.Schema(
  {
    from: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["calling", "accepted", "rejected", "missed", "ended"],
      default: "calling",
    },
    startedAt: Date,
    endedAt: Date,
  },
  { timestamps: true }
);

export default mongoose.model("Call", callSchema);
