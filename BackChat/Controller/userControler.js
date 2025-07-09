import Chat from "../Models/chatModel.js";
import Message from "../Models/messagesModel.js";
import User from "../Models/UserModel.js";
// import bcrypt from "bcryptjs";

// export const getUsers = async (req, res) => {
//   try {
//     const users = await User.find();
//     res.status(200).send(users);
//   } catch (error) {
//     res.status(500).send(`Data error... ${error}`);
//   }
// };
// export const getUser = async (req, res) => {
//   try {
//     const id = req.params.id;
//     const user = await User.findById(id);

//     if (!book) {
//       res.status(400).json("Not Found");
//     } else {
//       res.status(200).json(book);
//     }
//   } catch (error) {
//     res.status(500).send(`Data error ${error}`);
//   }
// };
// export const createUser = async (req, res) => {
//   try {
//     const { name, email, password, confirmPassword, phone, role, active } =
//       req.body;
//     if (password !== confirmPassword) {
//       return res.status(400).json({ message: "Passwords do not match" });
//     }
//     const newUser = new User(req.body);
//     //   const { title } = newBook;
//     //   const bookexist = await Books.findOne({ title });

//     //   if (bookexist) {
//     //     res.status(400).json("the book already exist");
//     //   } else {
//     // if (newUser.password !== newUser.confirmPassword) {
//     //   return res.status(400).json({ message: "Passwords do not match" });
//     // }
//     const save = await newUser.save();
//     res.status(201).send("saved");
//     //   }
//   } catch (error) {
//     res.status(500).send(`Data error ${error}`);
//   }
// };

// // فيني شفر هون ولكن لازم شيل التشفير من ال ال model لأن وقتها لح يتشفر مرتين
// // الأصح التشفير بال model
// // export const createUser = async (req, res) => {
// //   try {
// //     const { name, email, password, phone, role, active } = req.body;

// //     if (!password) {
// //       return res.status(400).json({ message: "Password is required" });
// //     }

// //     const hashedPassword = await bcrypt.hash(password, 12);

// //     const newUser = new User({
// //       name,
// //       email,
// //       phone,
// //       role,
// //       active,
// //       password: hashedPassword,
// //     });

// //     await newUser.save();

// //     res.status(201).json({ message: "User created successfully" });
// //   } catch (error) {
// //     res.status(500).json({ message: `Data error: ${error.message}` });
// //   }
// // };

// export const updateUser = async (req, res) => {
//   try {
//     const id = req.params.id;
//     const userEdit = await User.findByIdAndUpdate(
//       id,
//       {
//         role: req.body.role,
//         active: req.body.active,
//       },
//       {
//         new: true,
//         runValidators: true,
//       }
//     );
//     //   if (bookDelete) {
//     res.status(201).json("EDit done");
//   } catch (error) {
//     res.status(500).send(`the error is ${error}`);
//   }
// };

// export const deleteUser = async (req, res) => {
//   try {
//     const id = req.params.id;
//     const userDelete = await User.findByIdAndDelete(id);
//     //   if (bookDelete) {
//     res.status(201).json("delete done");
//     // }else{
//     //     res.status(201).json("not delete");
//     // }
//   } catch (error) {
//     res.status(500).send(`the error is ${error}`);
//   }
// };

// export const updatePassword = async (req, res) => {
//   try {
//     const id = req.params.id;
//     const userEdit = await User.findByIdAndUpdate(
//       id,
//       {
//         password: await bcrypt.hash(req.body.password, 12),

//         // السطر يلي تحت غلط لأن بخزنها بدون تشفير
//         // password: req.body.password,
//       },
//       {
//         new: true,
//         runValidators: true,
//       }
//     );
//     //   if (bookDelete) {
//     res.status(201).json("EDit done");
//   } catch (error) {
//     res.status(500).send(`the error is ${error}`);
//   }
// };

// export const getChat = async (req, res) => {
//   try{
//     chatId = req.params.chatId;
//     chat = Chat.find().populate("userId", "userName avatar");
//   }catch(error){
//     res.status(500).send(`the error is ${error.message}`);
//   }
// };

export const getChat = async (req, res) => {
  try {
    const chatId = req.params.chatId;
    const currentUserId = req.user._id;

    const chat = await chatModel
      .findById(chatId)
      .populate("users", "userName avatar");

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

export const searchAllUsers = async (req, res) => {
  try {
    const currentUserId = req.user._id;
    console.log(currentUserId);

    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ message: "pleas add word for search" });
    }

    const regex = new RegExp(query, "i");

    const criteria = {
      $or: [{ userName: { $regex: regex } }, { phone: { $regex: regex } }],
      _id: { $ne: currentUserId },
    };

    const users = await User.find(criteria).select("userName phone avatar");

    res.status(200).json(users);
  } catch (err) {
    console.error("error in search", err);
    res.status(500).json({ message: "error in search" });
  }
};

export const searchMyContacts = async (req, res) => {
  try {
    const currentUserId = req.user._id;

    const { query } = req.query;

    if (!currentUserId || !query) {
      return res.status(400).json({ message: "userId and query need." });
    }

    const user = await User.findById(currentUserId).populate({
      path: "contacts",
      match: {
        $or: [
          { userName: { $regex: new RegExp(query, "i") } },
          { phone: { $regex: new RegExp(query, "i") } },
        ],
      },
      select: "userName phone avatar",
    });

    res.status(200).json(user.contacts);
  } catch (err) {
    console.error("error in search in contact: ", err);
    res.status(500).json({ message: "error in search in contact: " });
  }
};
