import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
  },
  { timestamps: true }
);

// chatSchema.pre("save", function (next) {
//   if (this.users.length !== 2) {
//     return next(new Error("A chat must have exactly 2 users."));
//   }
//   this.users.sort();
//   next();
// });

// chatSchema.index({ users: 1 }, { unique: true });

export default mongoose.model("Chat", chatSchema);
