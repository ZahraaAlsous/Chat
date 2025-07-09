import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      trim: true,
      unique: true,
      required: [true, "name required"],
    },
    phone: {
      type: String,
      unique: true,
      required: [true, "phone required"],
    },
    password: {
      type: String,
      required: [true, "password required"],
      minlength: [8, "Too short password"],
    },
    contacts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        // required: true,
      },
    ],
    avatar: { type: String },
    
  },

  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model("User", userSchema);
