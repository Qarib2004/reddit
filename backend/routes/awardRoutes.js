import express from "express";
import { getAwards, sendAward, createAward } from "../controllers/awardController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import adminMiddleware from "../middlewares/adminMiddleware.js";

const router = express.Router();

router.get("/", getAwards);

router.post("/send", authMiddleware, sendAward);

router.post("/", authMiddleware, createAward);

export default router;
