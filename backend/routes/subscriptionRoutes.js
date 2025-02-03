import express from "express";
import {
  subscribe,
  unsubscribe,
} from "../controllers/subscriptionController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import { body } from "express-validator";

const router = express.Router();

router.post(
  "/subscribe",
  authMiddleware,
  [body("communityId").notEmpty().withMessage("ID community required")],
  subscribe
);

router.post(
  "/unsubscribe",
  authMiddleware,
  [body("communityId").notEmpty().withMessage("ID community required")],
  unsubscribe
);

export default router;
