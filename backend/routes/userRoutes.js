import express from "express";
import { selectTopics } from "../controllers/userController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.put("/select-topics", authMiddleware, selectTopics);

export default router;
