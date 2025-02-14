import express from "express";
import { acceptFriendRequest, getUserById, savePost, selectTopics, sendFriendRequest,getUserNotifications, getUsers, rejectFriendRequest, getFriendRequests, getFriends, requestPasswordChange, changePassword } from "../controllers/userController.js";
import authMiddleware from "../middlewares/authMiddleware.js";


const router = express.Router();

router.put("/select-topics", authMiddleware, selectTopics);
router.post("/save/:postId", authMiddleware, savePost);
router.post("/send", authMiddleware, sendFriendRequest);
router.post("/:requestId/accept", authMiddleware, acceptFriendRequest);
router.post("/:requestId/reject", authMiddleware, rejectFriendRequest);
router.get("/friend-requests", authMiddleware, getFriendRequests)
router.get("/notifications", authMiddleware, getUserNotifications); 
router.get("/", authMiddleware, getUsers);   
router.get("/friends", authMiddleware, getFriends);   
router.post("/request-password-change", requestPasswordChange);
router.post("/change-password", changePassword);                  
router.get("/:id", getUserById); 



export default router;
