import express from "express";
import protect from "../Middleware/TokenMiddleware.js";
import {
  deleteChat,
  deleteMessage,
  displayOrCreateChat,
  getChat,
  getUserChats,
  sendMessage,
} from "../Controller/chatControler.js";

const chatRoutes = express.Router();

chatRoutes.get("/getChat/:chatId", protect, getChat);
chatRoutes.post(
  "/displayOrCreateChat/:userContactId",
  protect,
  displayOrCreateChat
);
chatRoutes.post("/messages/:chatId", protect, sendMessage);
chatRoutes.get("/", protect, getUserChats);
chatRoutes.delete("/deletechat/:chatId", protect, deleteChat);
chatRoutes.delete("/deleteMessage/:id", protect, deleteMessage);

export default chatRoutes;
