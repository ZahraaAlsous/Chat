import jwt from "jsonwebtoken";
import User from "../Models/UserModel.js";
import Chat from "../Models/chatModel.js";

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

export const getProfile = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    res.status(200).json(req.user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const signup = async (req, res) => {
  try {
    const { userName, phone, password, confirmPassword, avatar } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const newUser = new User({
      userName,
      phone,
      password,
      avatar:
        avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${userName}`,
    });

    await newUser.save();

    const token = generateToken(newUser._id);

    const bot = await User.findOne({ userName: "bot" });
    if (!bot) {
      return res.status(500).json({ message: "Bot user not found" });
    }
 
    const chat = await Chat.create({
      users: [newUser._id.toString(), bot._id.toString()].sort(),
    });

    res.status(201).json({ message: newUser, token, chat });
  } catch (error) {
    res.status(500).json({ message: `Signup error: ${error.message}` });
  }
};

export const login = async (req, res) => {
  try {
    const { userName, password } = req.body;

    const user = await User.findOne({ userName });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        message: "Invalid username or password",
        notefication: "userName or password fauls",
      });
    }



    const now = new Date();
    const hour = now.getHours();
    const time = now.toLocaleString();

    let greeting = "";
    if (hour >= 4 && hour < 8) {
      greeting = "you're like a little rooster waking up the world 🐓";
    } else if (hour >= 8 && hour < 12) {
      greeting =
        "you're an early bird, always up and ready before everyone else 🐦";
    } else if (hour >= 12 && hour < 17) {
      greeting = "you're like a camel at noon, enduring and steady🐫";
    } else if (hour >= 17 && hour < 24) {
      greeting = "you're  like a bat after sunset, lively and mysterious🦇";
    }  else {
      greeting = "you're  like an owl at night, wise and awake🦉";
    }


    const token = generateToken(user._id);
    res.status(200).json({
      message: "Login successful",
      token,
      user: user,
      notefication: greeting,
    });
  } catch (err) {
    res.status(500).json({ message: `Login error: ${err.message}` });
  }
};


export const updateAvatar = async (req, res) => {
  try {
    const { avatar } = req.body;
    if (!avatar) {
      return res.status(400).json({ message: "Please send the avatar image." });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "USER NOT FOUND" });
    }

    user.avatar = avatar;
    await user.save();

    res.json({ message: "Avatar updated successfully.", avatar: user.avatar });
  } catch (error) {
    res.status(500).json({ message: "Error updating the avatar." });
  }
};