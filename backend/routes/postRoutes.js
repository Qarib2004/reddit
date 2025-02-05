
import express from "express";
import {
  createPost,
  getPosts,
  getPost,
  deletePost,
} from "../controllers/postController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import { body } from "express-validator";
import upload from "../middlewares/uploadMiddleware.js";

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  [
    body("title").notEmpty().withMessage("Заголовок обязателен"),
    body("postType").isIn(["text", "image", "link"]).withMessage("Недопустимый тип поста"),
    body("content")
      .if(body("postType").equals("text"))
      .notEmpty()
      .withMessage("Содержимое обязательно"),
    body("community").notEmpty().withMessage("Сообщество обязательно"),
  ],
  upload.single("file")
  ,
  createPost
);

router.get("/", getPosts);

router.get("/:id", getPost);

router.delete("/:id", authMiddleware, deletePost);

export default router;
