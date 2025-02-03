import express from "express";
import {
  setUserInterests,
  getRecommendedCommunities,
} from "../controllers/interestsController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import { body } from "express-validator";

const router = express.Router();

router.post(
  "/set",
  authMiddleware,
  [body("interests").isArray().withMessage("Interests should be an array")],
  setUserInterests
);

router.get("/recommendations", authMiddleware, getRecommendedCommunities);

export default router;
