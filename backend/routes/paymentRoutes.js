import express from "express";
import { createPayment, executePayment, cancelPayment, sendVerificationCode, verifyPayment } from "../controllers/paymentController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/create", authMiddleware, createPayment);
router.post("/send-verification", authMiddleware,sendVerificationCode);
router.post('/verify', verifyPayment);
router.get("/success", executePayment);
router.get("/cancel", cancelPayment);

export default router;
