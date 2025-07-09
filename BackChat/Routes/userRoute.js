import express from "express"
// import { getUsers, getUser, createUser, updateUser, deleteUser, updatePassword } from "../Controller/userControler.js"
// import { getProfile, login, signup } from "../Controller/authControler.js"
import protect from "../Middleware/TokenMiddleware.js"
import { searchAllUsers, searchMyContacts } from "../Controller/userControler.js";
// import isAdmin from "../Middleware/isAdminMiddleware.js"

const userRoutes = express.Router()
// // ****medillwaer
// userRoutes.get("/",isAdmin, getUsers)
// userRoutes.get("/:id", getUser)
// userRoutes.post("/", createUser)
// userRoutes.put("/:id", updateUser)
// userRoutes.delete("/:id", deleteUser)
// userRoutes.put("/Password/:id", updatePassword);



// // userRoutes.post("/user/signup", signup);
// // userRoutes.post("/user/login", login);
// // userRoutes.get("/user/profile",protect, getProfile);


userRoutes.get("/users/search/all",protect, searchAllUsers);
userRoutes.get("/users/search/contacts", protect, searchMyContacts);

export default userRoutes
