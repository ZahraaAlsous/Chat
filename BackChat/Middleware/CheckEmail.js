import User from "../Models/UserModel.js";

export const isFind = async (req, res, next) => {
  const userName = req.body.userName;

  const user = await User.findOne({ userName });
  
  if (!user) {
    next();
    
  } else {
    res.status(400).json("this userName not valid");
  }
};
