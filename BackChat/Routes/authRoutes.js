import express from "express";
// import {
//   getUsers,
//   getUser,
//   createUser,
//   updateUser,
//   deleteUser,
//   updatePassword,
// } from "../Controller/userControler.js";
import { getProfile, login, signup, updateAvatar } from "../Controller/authControler.js";
import protect from "../Middleware/TokenMiddleware.js";
import { isFind } from "../Middleware/CheckEmail.js";

const authRoutes = express.Router()

authRoutes.post("/signup",isFind, signup);
authRoutes.post("/login", login);
authRoutes.get("/profile", protect, getProfile);
authRoutes.put("/profile/avatar", protect, updateAvatar);

export default authRoutes