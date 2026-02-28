import express from "express";
import Category from "../models/Category.js";
import { protectAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// GET all categories (public)
router.get("/", async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch categories" });
  }
});

// CREATE category (admin only)
router.post("/", protectAdmin, async (req, res) => {
  try {
    const { title, href, image } = req.body;
    if (!title || !href || !image)
      return res.status(400).json({ msg: "All fields are required" });

    const exists = await Category.findOne({ href });
    if (exists) return res.status(400).json({ msg: "Category with this URL already exists" });

    const category = new Category({ title, href, image });
    await category.save();
    res.status(201).json(category);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// DELETE category (admin only)
router.delete("/:id", protectAdmin, async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ msg: "Category deleted" });
  } catch (err) {
    res.status(500).json({ msg: "Failed to delete category" });
  }
});

export default router;
