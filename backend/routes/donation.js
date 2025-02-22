import express from "express";
import { sendDonation } from "../controllers/donationController.js";

const router = express.Router();

router.post("/send", sendDonation);

export default router;
