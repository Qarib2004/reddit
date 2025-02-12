import express from "express";
import { acceptFriendRequest, getUserById, savePost, selectTopics, sendFriendRequest,getUserNotifications, getUsers } from "../controllers/userController.js";
import authMiddleware from "../middlewares/authMiddleware.js";


const router = express.Router();

router.put("/select-topics", authMiddleware, selectTopics);
router.post("/save/:postId", authMiddleware, savePost);
router.post("/friend-request/:userId", authMiddleware, sendFriendRequest);
router.post("/friend-accept/:userId", authMiddleware, acceptFriendRequest);
router.get("/notifications", authMiddleware, getUserNotifications); 
router.get("/", authMiddleware, getUsers);                        
router.get("/:id", getUserById); 



export default router;
