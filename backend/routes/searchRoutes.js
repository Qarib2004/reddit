import express from "express";
import { searchPosts, searchCommunities, searchComments, searchUsers } from "../controllers/searchController.js";

const router = express.Router();

router.get("/posts", searchPosts);
router.get("/communities", searchCommunities);
router.get("/comments", searchComments);
router.get("/users", searchUsers);

export default router;
