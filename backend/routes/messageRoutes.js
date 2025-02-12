import express from "express";
import { getMessages, sendMessage, getUnreadMessages, markMessagesAsRead } from "../controllers/messageController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/history/:userId/:recipientId", authMiddleware, getMessages);
router.post("/send", authMiddleware, sendMessage);
router.get("/unread", authMiddleware, getUnreadMessages);
router.post("/read/:senderId", authMiddleware, markMessagesAsRead);

export default router;
