// routes/moodRoutes.js
import express from "express";
import { addMood, bot, chatBot } from "../Controller/botControlers.js";
import protect from "../Middleware/TokenMiddleware.js";

const moodroutes = express.Router();

moodroutes.post("/addMood", addMood);
// moodroutes.post("/bot/:chatId", protect, bot);
moodroutes.post("/bot", protect, bot);
moodroutes.get("/chatBot", protect, chatBot);
export default moodroutes;
