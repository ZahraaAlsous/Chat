// export const addContact = async (req, res) => {
//   try {
//     const user = req.params.userId
//     const userLogin = req.user._id

//     // const 
//   } catch (error) {
//     res.status(500).json({ message: `Send message error: ${error.message}` });
//   }
// };


import UserModel from "../Models/UserModel.js";
import User from "../Models/UserModel.js";

export const addContact = async (req, res) => {
  try {
    const contactId = req.params.userId; 
    const userLoginId = req.user._id; 

    if (contactId === String(userLoginId)) {
      return res
        .status(400)
        .json({ message: "You can't add yourself as a contact." });
    }

    const user = await UserModel.findById(userLoginId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const alreadyAdded = user.contacts.includes(contactId);

    if (alreadyAdded) {
      return res.status(400).json({ message: "Contact already exists" });
    }

    user.contacts.push(contactId);
    await user.save();

    res.status(200).json({ message: "Contact added successfully", user });
  } catch (error) {
    res.status(500).json({ message: `Add contact error: ${error.message}` });
  }
};




export const getUserContacts = async (req, res) => {
//   const { id } = req.params;
const id = req.user._id

  try {
    const user = await User.findById(id)
      .populate("contacts", "_id userName phone avatar discription")
      .sort({ userName: 1 });


    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user.contacts);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

