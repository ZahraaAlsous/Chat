import Chat from "../Models/chatModel.js";
import Message from "../Models/messagesModel.js";
import User from "../Models/UserModel.js";
import asyncHandler from "express-async-handler";

export const getChat = async (req, res) => {
  try {
    const chatId = req.params.chatId;
    const currentUserId = req.user._id;

    const chat = await Chat.findById(chatId).populate(
      "users",
      "userName avatar"
    );
    await Message.updateMany(
      { chatId: chatId, sender: { $ne: currentUserId } },
      { $set: { isRead: true } }
    );

    if (!chat) return res.status(404).json({ message: "Chat not found" });

    if (
      !chat.users.some((u) => u._id.toString() === currentUserId.toString())
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to access this chat" });
    }

    const otherUser = chat.users.find(
      (u) => u._id.toString() !== currentUserId.toString()
    );

    const messages = await Message.find({ chatId })
      .populate("sender", "userName avatar")
      .sort({ createdAt: 1 });

    res.status(200).json({
      chatId,
      user: {
        _id: otherUser._id,
        userName: otherUser.userName,
        avatar: otherUser.avatar,
      },
      messages,
    });
  } catch (error) {
    res.status(500).json({ message: `Error: ${error.message}` });
  }
};

// export const displayOrCreateChat = async (req, res) => {
//   try {
//     const userContactId = req.params.userContactId;
//     const currentUserId = req.user._id;

//     let chat = await Chat.findOne({
//       users: { $all: [userContactId, currentUserId] },
//     }).populate("users", "userName avatar");


//     let messages = []
//     if (chat) {
//       await Message.updateMany(
//         { chatId: chat._id, sender: { $ne: currentUserId } },
//         { $set: { isRead: true } }
//       );

//       messages = await Message.find(chat._id)
//           .populate("sender", "userName avatar")
//           .sort({ createdAt: 1 });
//     }

//     // const messages = []
//     // if (chat){
//     //    messages = await Message.find( chat._id )
//     //     .populate("sender", "userName avatar")
//     //     .sort({ createdAt: 1 });

//     // }

//     if (!chat) {
//       chat = await Chat.create({
//         users: [userContactId, currentUserId],
//       });

//       addtoContact = await User.findByIdAndUpdate(currentUserId);

//       chat = await Chat.findById(chat._id).populate("users", "userName avatar");
//     }

//     res.status(200).json({ chat});
//   } catch (error) {
//     res.status(500).json({ message: `Chat creation error: ${error.message}` });
//   }
// };


export const displayOrCreateChat = async (req, res) => {
  try {
    const userContactId = req.params.userContactId;
    const currentUserId = req.user._id;

    let chat = await Chat.findOne({
      users: { $all: [userContactId, currentUserId] },
    }).populate("users", "userName avatar");

    let messages = [];
    if (chat) {
      await Message.updateMany(
        { chatId: chat._id, sender: { $ne: currentUserId } },
        { $set: { isRead: true } }
      );

      messages = await Message.find({ chatId: chat._id })
        .populate("sender", "userName avatar")
        .sort({ createdAt: 1 });
    }

    if (!chat) {
      chat = await Chat.create({
        users: [userContactId, currentUserId],
      });

      // بعد إنشاء الشات، أضف userContactId إلى جهات الاتصال إذا مش موجود
      const currentUser = await User.findById(currentUserId);
      if (!currentUser.contacts.includes(userContactId)) {
        currentUser.contacts.push(userContactId);
        await currentUser.save();
      }

      chat = await Chat.findById(chat._id).populate("users", "userName avatar");
    }

    res.status(200).json({ chat, messages });
  } catch (error) {
    res.status(500).json({ message: `Chat creation error: ${error.message}` });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, type } = req.body;
    const chatId = req.params.chatId;
    const sender = req.user._id;

    if (!text || !chatId) {
      return res.status(400).json({ message: "text and chatId are required" });
    }

    let message = await Message.create({
      text,
      chatId,
      sender,
      type: type || "text",
    });

    message = await message.populate("sender", "userName avatar");

    res.status(201).json({ message });
  } catch (error) {
    res.status(500).json({ message: `Send message error: ${error.message}` });
  }
};

// export const getUserChats = asyncHandler(async (req, res) => {
//   try {
//     const userId = req.user._id;
//     console.log(userId);

//     const chats = await Chat.find({ users: userId ,userName: { $ne: "bot" }}).populate(
//       "users",
//       "userName"
//     );
//     // .sort({ updatedAt: -1 });

//     const chatsWithLastMessage = await Promise.all(
//       chats.map(async (chat) => {
//         const lastMessage = await Message.findOne({ chat: chat._id })
//           .sort({ createdAt: -1 })
//           .lean();

//         const haveMessageNotRead = (await Message.findOne({
//           chatId: chat._id,
//           isRead: false,
//           sender: { $ne: userId },
//         }))
//           ? true
//           : false;

//         return {
//           ...chat.toObject(),
//           lastMessage,
//           haveMessageNotRead,
//         };
//       })
//     );

//     res.status(200).json(chatsWithLastMessage);
//   } catch (err) {
//     console.error("Error in getUserChats:", err);
//     res.status(500).json({ message: "erorrrrrrr" });
//   }
// });


export const getUserChats = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;

    const chats = await Chat.find({ users: userId }).populate(
      "users",
      "userName avatar"
    );

    const filteredChats = chats.filter(
      (chat) =>
        chat.users.some((u) => u._id.toString() === userId.toString()) &&
        !chat.users.some((u) => u.userName === "bot")
    );

    const chatsWithLastMessage = await Promise.all(
      filteredChats.map(async (chat) => {
        const lastMessage = await Message.findOne({ chat: chat._id })
          .sort({ createdAt: -1 })
          .lean();

        const haveMessageNotRead = (await Message.findOne({
          chatId: chat._id,
          isRead: false,
          sender: { $ne: userId },
        }))
          ? true
          : false;
          const unreadMessagesCount = await Message.countDocuments({
            chatId: chat._id,
            isRead: false,
            sender: { $ne: userId },
          });
          
        return {
          ...chat.toObject(),
          lastMessage,
          haveMessageNotRead,
          unreadMessagesCount,
        };
      })
    );

    res.status(200).json(chatsWithLastMessage);
  } catch (err) {
    console.error("Error in getUserChats:", err);
    res.status(500).json({ message: "erorrrrrrr" });
  }
});






export const deleteChat = async (req, res) => {
  try {
    const { chatId } = req.params;

    // حذف كل الرسائل المرتبطة بالمحادثة
    await Message.deleteMany({ chatId });

    // حذف المحادثة نفسها
    await Chat.findByIdAndDelete(chatId);

    res.status(200).json({ message: "تم حذف المحادثة بنجاح" });
  } catch (error) {
    console.error("فشل في حذف المحادثة:", error);
    res.status(500).json({ message: "حدث خطأ أثناء الحذف" });
  }
};

// controllers/messageController.js

// import Message from "../Models/messagesModel.js";

// حذف رسالة حسب ID
export const deleteMessage = async (req, res) => {
  try {
    const messageId = req.params.id;

    const deletedMessage = await Message.findByIdAndDelete(messageId);

    if (!deletedMessage) {
      return res.status(404).json({ message: "الرسالة غير موجودة" });
    }

    res.status(200).json({ message: "تم حذف الرسالة بنجاح" });
  } catch (error) {
    res.status(500).json({ message: "حدث خطأ أثناء حذف الرسالة", error });
  }
};
