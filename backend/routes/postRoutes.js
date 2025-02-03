// backend/routes/postRoutes.js

import express from "express";
import {
  createPost,
  getPosts,
  getPost,
  deletePost,
} from "../controllers/postController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import { body } from "express-validator";

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  [
    body("title").notEmpty().withMessage("Заголовок обязателен"),
    body("content").notEmpty().withMessage("Содержимое обязательно"),
    body("community").notEmpty().withMessage("Сообщество обязательно"),
  ],
  createPost
);

router.get("/", getPosts);

router.get("/:id", getPost);

router.delete("/:id", authMiddleware, deletePost);

export default router;
