import express from "express";
import { savePost, selectTopics } from "../controllers/userController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.put("/select-topics", authMiddleware, selectTopics);
router.post("/save/:postId", authMiddleware, savePost);

export default router;
