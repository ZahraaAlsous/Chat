import express from "express";
import protect from "../Middleware/TokenMiddleware.js";
import { addDairy, allDairy, deleteDairy } from "../Controller/dairyController.js";

const dairyRout = express.Router();

dairyRout.post("/addDairy", protect, addDairy);
dairyRout.get("/Dairys", protect, allDairy);
dairyRout.delete("/deleteDairy/:dairyId", protect, deleteDairy);

export default dairyRout;

