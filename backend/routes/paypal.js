import express from "express";
import { createPayment, executePayment } from "../controllers/paypalController.js";

const router = express.Router();

router.post("/create-payment", createPayment);
router.get("/execute-payment", executePayment);

export default router;
