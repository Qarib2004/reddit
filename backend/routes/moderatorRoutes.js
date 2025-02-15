import express from "express";
import { getReportedPosts, takeActionOnPost, getReportedComments, takeActionOnComment, getModeratorStats, getModeratorHistory, undoModeratorAction, getModeratorChat, sendMessage, getUsersWithWarnings, issueWarning } from "../controllers/moderatorController.js";
import moderatorMiddleware from "../middlewares/moderatorMiddleware.js";
import protect from "../utils/protect.js";
const router = express.Router();

router.get("/reported-posts", moderatorMiddleware, getReportedPosts);

router.put("/reported-posts/:id", moderatorMiddleware, takeActionOnPost);

router.get("/reported", moderatorMiddleware, getReportedComments);

router.put("/reported/:id", moderatorMiddleware, takeActionOnComment);

router.get("/stats", moderatorMiddleware, getModeratorStats);

router.get("/history", moderatorMiddleware, getModeratorHistory);

router.put("/history/undo/:id", moderatorMiddleware, undoModeratorAction);

router.get("/chat", moderatorMiddleware, getModeratorChat);

router.post("/chat/send", moderatorMiddleware, sendMessage);

router.get("/warnings", moderatorMiddleware, getUsersWithWarnings);

router.put("/warnings/:userId", moderatorMiddleware, issueWarning);



export default router;
