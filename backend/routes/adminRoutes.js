import express from "express";
import { getAllUsers, banUser, updateUserRole, getAllCommunities, deleteCommunity, getAllPosts, deletePost, getAdminStats } from "../controllers/adminController.js";
import adminMiddleware from "../middlewares/adminMiddleware.js";

const router = express.Router();

router.get("/users", adminMiddleware, getAllUsers);
router.put("/users/:id/ban", adminMiddleware, banUser);
router.put("/users/:id/role", adminMiddleware, updateUserRole);

router.get("/communities", adminMiddleware, getAllCommunities);
router.delete("/communities/:id", adminMiddleware, deleteCommunity);

router.get("/stats", adminMiddleware, getAdminStats);


router.get("/posts", adminMiddleware, getAllPosts);
router.delete("/posts/:id", adminMiddleware, deletePost);

export default router;