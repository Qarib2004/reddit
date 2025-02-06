import Category from "../models/Category.js";

export const createCategories = async (req, res) => {
  const { categories } = req.body; 

  try {
    for (const category of categories) {
      await Category.create({
        title: category.title,
        icon: category.icon,
        topics: category.topics.map((topic) => ({ name: topic })),
      });
    }
    res.status(201).json({ message: "Categories added successfully!" });
  } catch (error) {
    console.error("Error adding categories:", error);
    res.status(500).json({ message: "Failed to add categories", error });
  }
};


export const getCategories = async (req, res) => {
    try {
      const categories = await Category.find().populate("topics");
      res.status(200).json(categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ message: "Failed to fetch categories", error });
    }
  };
  


export const getCategoryById = async (req, res) => {
  const { id } = req.params;

  try {
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(200).json(category);
  } catch (error) {
    console.error("Error fetching category by ID:", error);
    res.status(500).json({ message: "Failed to fetch category", error });
  }
};


export const updateCategory = async (req, res) => {
  const { id } = req.params;
  const { title, icon, topics } = req.body;

  try {
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    category.title = title || category.title;
    category.icon = icon || category.icon;
    category.topics = topics
      ? topics.map((topic) => ({ name: topic }))
      : category.topics;

    await category.save();
    res.status(200).json({ message: "Category updated successfully", category });
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(500).json({ message: "Failed to update category", error });
  }
};


export const deleteCategory = async (req, res) => {
  const { id } = req.params;

  try {
    const category = await Category.findByIdAndDelete(id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({ message: "Failed to delete category", error });
  }
};


export const addTopicToCategory = async (req, res) => {
  const { id } = req.params;
  const { topic } = req.body;

  try {
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    category.topics.push({ name: topic });
    await category.save();
    res.status(200).json({ message: "Topic added successfully", category });
  } catch (error) {
    console.error("Error adding topic:", error);
    res.status(500).json({ message: "Failed to add topic", error });
  }
};


export const removeTopicFromCategory = async (req, res) => {
  const { id } = req.params;
  const { topic } = req.body;

  try {
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    category.topics = category.topics.filter((t) => t.name !== topic);
    await category.save();
    res.status(200).json({ message: "Topic removed successfully", category });
  } catch (error) {
    console.error("Error removing topic:", error);
    res.status(500).json({ message: "Failed to remove topic", error });
  }
};
