import User from "../Models/UserModel.js";
import protect from "./TokenMiddleware.js";

const isAdmin = [
  protect,
  async (req, res, next) => {
    try {
      const user = req.user;
      if (user.role !== "admin") {
        res.status(403).json("Noooooooooooooooo");
      }

      next();
    } catch (error) {
      res.status(401).json({ message: "Invalid or expired match" });
    }
  },
];

export default isAdmin;
