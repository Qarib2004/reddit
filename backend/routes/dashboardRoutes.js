import express from "express";
import { getUserDashboard } from "../controllers/dashboardController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, getUserDashboard);

export default router;
