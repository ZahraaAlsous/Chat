import express from "express";
import protect from "../Middleware/TokenMiddleware.js";
import { addContact, getUserContacts } from "../Controller/contactController.js";


const contactRout = express.Router();

contactRout.put("/addContact/:userId", protect, addContact);

contactRout.get("/myCountacts",protect, getUserContacts);

export default contactRout;
