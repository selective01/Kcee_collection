import express from "express";
import Cart from "../models/Cart.js";
import { protectUser } from "../middleware/authMiddleware.js";

const router = express.Router();

// GET /api/cart — get user's cart
router.get("/", protectUser, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    res.json(cart ? cart.items : []);
  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch cart" });
  }
});

// POST /api/cart — save/replace user's cart
router.post("/", protectUser, async (req, res) => {
  try {
    const { items } = req.body;
    const cart = await Cart.findOneAndUpdate(
      { user: req.user._id },
      { items },
      { upsert: true, new: true }
    );
    res.json(cart.items);
  } catch (err) {
    res.status(500).json({ msg: "Failed to save cart" });
  }
});

// DELETE /api/cart — clear user's cart
router.delete("/", protectUser, async (req, res) => {
  try {
    await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });
    res.json({ msg: "Cart cleared" });
  } catch (err) {
    res.status(500).json({ msg: "Failed to clear cart" });
  }
});

export default router;
