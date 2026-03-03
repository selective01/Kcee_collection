import express from "express";
import Product from "../models/Product.js";
import { protectAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

/* GET ALL PRODUCTS */
router.get("/", async (req, res) => {
  const products = await Product.find().sort({ createdAt: -1 });
  res.json(products);
});

/* GET PRODUCTS BY CATEGORY */
router.get("/category/:category", async (req, res) => {
  try {
    const products = await Product.find({ category: req.params.category }).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch products by category" });
  }
});

/* CREATE PRODUCT */
router.post("/", protectAdmin, async (req, res) => {
  const product = await Product.create(req.body);
  res.json(product);
});

/* UPDATE PRODUCT */
router.put("/:id", protectAdmin, async (req, res) => {
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(product);
});

/* DELETE PRODUCT */
router.delete("/:id", protectAdmin, async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

export default router;
