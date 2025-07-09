import mongoose from "mongoose";

const messagesSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      trim: true,
    },
    chatId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["text", "image", "file"],
      default: "text",
    },
    isRead: {
      type : Boolean,
      default : false
    }
  },
  { timestamps: true }
);

export default mongoose.model("Message", messagesSchema);
