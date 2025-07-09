import express from "express";
import http from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import cors from "cors";
import Message from "./Models/messagesModel.js";
// import Chat from "./Models/chatModel.js";
// import User from "./Models/userModel.js";
import authRoutes from "./Routes/authRoutes.js";
import chatRoutes from "./Routes/chatRoutes.js";
import contactRout from "./Routes/contactRoutes.js";
import userRoutes from "./Routes/userRoute.js";
import moodroutes from "./Routes/moodRoutes.js";
import dairyRout from "./Routes/dairyRoutes.js";
import dotenv from "dotenv";
import protect from "./Middleware/TokenMiddleware.js";
dotenv.config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());

// اتصال MongoDB
mongoose
  .connect("mongodb://localhost:27017/LogIn", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ تم الاتصال بقاعدة البيانات"))
  .catch((err) => console.error("❌ خطأ في الاتصال:", err));

// app.get("/api/messages/:chatId", async (req, res) => {
//   try {
//     const messages = await Message.find({ chatId: req.params.chatId })
//       .populate("sender", "userName avatar")
//       .sort({ createdAt: 1 });

//     res.json(messages);
//   } catch (err) {
//     res.status(500).json({ error: "فشل في جلب الرسائل" });
//   }
// });

// Socket.IO Events

app.get("/api/messages/:chatId", protect, async (req, res) => {
  try {
    const currentUserId = req.user.id; // تأكد من أن عندك middleware يضع user في req

    await Message.updateMany(
      { chatId: req.params.chatId, sender: { $ne: currentUserId } },
      { $set: { isRead: true } }
    );

    const messages = await Message.find({ chatId: req.params.chatId })
      .populate("sender", "userName avatar")
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: "فشل في جلب الرسائل" });
  }
});
io.on("connection", (socket) => {
  console.log("🟢 مستخدم اتصل:", socket.id);

  socket.on("joinRoom", ({ chatId }) => {
    socket.join(chatId);
    console.log(`📥 المستخدم دخل الشات: ${chatId}`);
  });

  socket.on("sendMessage", async ({ senderId, chatId, text }) => {
    try {
      const newMessage = new Message({
        sender: senderId,
        chatId,
        text,
      });
      await newMessage.save();

      const populatedMessage = await newMessage.populate("sender", "userName");

      io.to(chatId).emit("receiveMessage", populatedMessage);
    } catch (err) {
      console.error("❌ خطأ في إرسال الرسالة:", err);
    }
  });

  socket.on("callUser", ({ toChatId, fromUserId, fromUserName }) => {
    console.log(
      `📞 Call from ${fromUserName} (${fromUserId}) to chat ${toChatId}`
    );

    // Notify others in the chat about the incoming call
    socket.to(toChatId).emit("incomingCall", {
      from: fromUserName,
      fromUserId,
      chatId: toChatId,
    });
  });

  // Answer call
  socket.on("answerCall", ({ chatId }) => {
    console.log(`✅ Call answered in chat ${chatId}`);

    // Notify all in the chat room that the call was answered
    io.to(chatId).emit("callAnswered", { chatId });
  });

  // Decline call
  socket.on("declineCall", ({ chatId }) => {
    console.log(`❌ Call declined in chat ${chatId}`);

    // Notify all in the chat room that the call was declined
    io.to(chatId).emit("callDeclined", { chatId });
  });

  // Hang up call
  socket.on("hangUp", ({ chatId }) => {
    console.log(`📴 Call hung up in chat ${chatId}`);

    // Notify all in the chat room that the call ended
    io.to(chatId).emit("callEnded", { chatId });
  });
  socket.on("webrtcOffer", ({ chatId, offer }) => {
    console.log(`WebRTC offer from ${socket.id} in room ${chatId}`);
    socket.to(chatId).emit("webrtcOffer", { offer, from: socket.id });
  });

  socket.on("webrtcAnswer", ({ chatId, answer }) => {
    console.log(`WebRTC answer from ${socket.id} in room ${chatId}`);
    socket.to(chatId).emit("webrtcAnswer", { answer, from: socket.id });
  });

  socket.on("webrtcIceCandidate", ({ chatId, candidate }) => {
    console.log(`ICE candidate from ${socket.id} in room ${chatId}`);
    socket
      .to(chatId)
      .emit("webrtcIceCandidate", { candidate, from: socket.id });
  });

  socket.on("disconnect", () => {
    console.log("🔴 مستخدم قطع الاتصال:", socket.id);
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/user", userRoutes);
app.use("/api/contact", contactRout);
app.use("/api/mood", moodroutes);
app.use("/api/dairy", dairyRout);

const PORT = 3000;
server.listen(PORT, () => {
  console.log(` السيرفر يعمل على http://localhost:${PORT}`);
});
