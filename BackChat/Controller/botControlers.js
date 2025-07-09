import Message from "../Models/messagesModel.js";
import Mood from "../Models/moodModel.js";
import User from "../Models/UserModel.js";
import Chat from "../Models/chatModel.js";
import asyncHandler from "express-async-handler";



export const addMood = async (req, res) => {
  try {
    const { keyword, reply } = req.body;

    if (!keyword || !reply) {
      return res.status(400).json({ message: "please enter word" });
    }

    const mood = new Mood({ keyword, reply });
    await mood.save();

    res.status(201).json({ mood });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: "the keyword is exist" });
    }
    res.status(500).json({ message: "error in server", error: err.message });
  }
};

function extractWords(text) {
  return text
    // .toLowerCase()
    .split(/[\s,.!؟،]+/)
    .filter(Boolean);
}

async function generateBotReply(userMessage, chatId, userId) {
  const words = extractWords(userMessage);

  const matchedResponse = await Mood.findOne({
    keyword: { $in: words },
  });

  const replyText = matchedResponse
    ? matchedResponse.reply
    : "I'm here if you want to talk😊";

    // const botUser = User.findOne({userName : "bot"})
    const botUser = await User.findOne({ userName: "bot" });

    
  const botMessage = new Message({
    text: replyText,
    chatId,
    sender: botUser._id,
    type: "text",
  });

  await botMessage.save();

  return botMessage;
}

// export const bot = async (req, res) => {
//   const { text } = req.body;
//   // const { chatId } = req.params;
//   const userId = req.user._id;

//   const bot = await User.findOne({ userName: "bot" });
//   let chat = await Chat.findOne({
//           users: { $all: [userId, bot._id] },
//         });
//         const chatId = chat._id
//   const userMessage = await Message.create({
//     text,
//     chatId,
//     sender: userId,
//   })

//   const botReply = await generateBotReply(text, chatId, userId);

//   res.json({ userMessage, botReply });
// };

// export const bot = async (req, res) => {
//   try {
//     const { text } = req.body;
//     const userId = req.user._id;

//     // إيجاد المستخدم الذي اسمه "bot"
//     const bot = await User.findOne({ userName: "bot" });
//     if (!bot) {
//       return res.status(404).json({ message: "Bot user not found" });
//     }

//     // البحث عن الشات الذي يحتوي على المستخدم الحالي والبوت
//     let chat = await Chat.findOne({
//       users: { $all: [userId, bot._id] },
//     });

//     // إذا لم يكن هناك شات، ننشئ واحدًا
//     if (!chat) {
//       chat = await Chat.create({ users: [userId, bot._id] });
//     }

//     console.log(chat);
    

//     // إنشاء رسالة المستخدم
//     const userMessage = await Message.create({
//       text,
//       chatId: chat._id,
//       sender: userId,
//     });

//     // توليد رد البوت
//     const botReply = await generateBotReply(text, chat._id, userId);

//     res.json({ userMessage, botReply });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error" });
//   }
// };



export const bot = async (req, res) => {
  const { text } = req.body;
  const userId = req.user._id;

  const bot = await User.findOne({ userName: "bot" });

  let chat = await Chat.findOne({
    users: { $all: [userId, bot._id] },
  });

  const chatId = chat._id;

  // إنشاء رسالة المستخدم
  let userMessage = await Message.create({
    text,
    chatId,
    sender: userId,
  });

  // إعادة تحميل الرسالة لتضمين معلومات المرسل
  userMessage = await userMessage.populate("sender", "userName avatar");

  // توليد رد البوت
  let botReply = await generateBotReply(text, chatId, userId);

  // تأكد أن botReply أيضاً يحتوي على معلومات المرسل
  botReply = await Message.findById(botReply._id).populate(
    "sender",
    "userName avatar"
  );

  res.json({ userMessage, botReply });
};



// POST /api/mood/bot
// export const bot = asyncHandler(async (req, res) => {
//   try {
//     const { content } = req.body;
//     const userId = req.user._id;

//     const user = await User.findById(userId);
//     const botUser = await User.findOne({ userName: "bot" });

//     if (!botUser)
//       return res.status(404).json({ message: "Bot user not found" });

//     const chat =
//       (await Chat.findOne({
//         isSystemChat: true,
//         users: { $all: [userId, botUser._id] },
//       })) ||
//       (await Chat.create({
//         chatName: "Bot Chat",
//         isSystemChat: true,
//         users: [userId, botUser._id],
//       }));

//     const userMsg = await Message.create({
//       chatId: chat._id,
//       sender: userId,
//       text: content,
//     });

//     const matchedMood = await Mood.findOne({
//       keywords: { $in: [content.toLowerCase()] },
//     });

//     const replyText = matchedMood?.reply || "🤖 Sorry, I don't understand.";
//     const botMsg = await Message.create({
//       chatId: chat._id,
//       sender: botUser._id,
//       text: replyText,
//       // moodId: matchedMood?._id,
//     });

//     const populatedMessages = await Message.find({
//       _id: { $in: [userMsg._id, botMsg._id] },
//     }).populate("sender", "userName");
    
//     res.json(
//       populatedMessages.map((msg) => ({
//         _id: msg._id,
//         content: msg.content,
//         user: { name: msg.userId.name },
//       }))
//     );
//   } catch (err) {
//     console.error("🔥 Bot Error:", err); // هذا هو السطر المهم
//     res
//       .status(500)
//       .json({ message: "Internal Server Error", error: err.message });
//   }
// });



export const chatBot = async (req, res) => {
  try {
    // 1. المستخدم الحالي من التوكن (مثلاً):
    const currentUserId = req.user._id;

    // 2. جلب حساب البوت:
    const botUser = await User.findOne({ userName: "bot" });
    if (!botUser) {
      return res.status(404).json({ message: "Bot user not found" });
    }

    // 3. البحث عن الدردشة:
    const chat = await Chat.findOne({
      users: { $all: [currentUserId, botUser._id] },
    });

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }
const messages = await Message.find({ chatId : chat._id })
      .populate("sender", "userName avatar")
      .sort({ createdAt: 1 });


    // 4. إعادة الـ Chat ID
    return res.status(200).json({ chat , messages});
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};


// GET /api/mood/chatBot
// export const chatBot = asyncHandler(async (req, res) => {
//   const userId = req.user._id;
//   const botUser = await User.findOne({ userName: "bot" });

//   if (!botUser) return res.status(404).json({ message: "Bot user not found" });

//   const chat = await Chat.findOne({
//     isSystemChat: true,
//     users: { $all: [userId, botUser._id] },
//   });

//   if (!chat) return res.json([]); // لا يوجد دردشة بعد

//   const messages = await Message.find({ chatId: chat._id })
//     .populate("userId", "name")
//     .sort({ createdAt: 1 });

//   const formatted = messages.map(msg => ({
//     _id: msg._id,
//     content: msg.content,
//     user: { name: msg.userId.name }
//   }));

//   res.json(formatted);
// });
