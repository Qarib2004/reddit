import express from "express";
import {
  createCategories,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
  addTopicToCategory,
  removeTopicFromCategory,
} from "../controllers/categoryController.js";

const router = express.Router();

router.post("/", createCategories);

router.get("/", getCategories);

router.get("/:id", getCategoryById);

router.put("/:id", updateCategory);

router.delete("/:id", deleteCategory);

router.post("/:id/topics", addTopicToCategory);

router.delete("/:id/topics", removeTopicFromCategory);

export default router;
