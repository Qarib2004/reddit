import express from "express";
import { acceptFriendRequest, getUserById, savePost, selectTopics, sendFriendRequest,getUserNotifications } from "../controllers/userController.js";
import authMiddleware from "../middlewares/authMiddleware.js";


const router = express.Router();

router.put("/select-topics", authMiddleware, selectTopics);
router.post("/save/:postId", authMiddleware, savePost);

router.post("/friend-request/:userId", authMiddleware, sendFriendRequest);
router.post("/friend-accept/:userId", authMiddleware, acceptFriendRequest);
router.get("/:id", getUserById); 
router.get("/notifications", authMiddleware, getUserNotifications);

export default router;
