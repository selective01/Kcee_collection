import express from "express";
import { protectAdmin } from "../middleware/authMiddleware.js"; // Existing admin protect
import User from "../models/User.js";

const router = express.Router();

// GET ALL USERS
router.get("/users", protectAdmin, async (req, res) => {
  try {
    const users = await User.find(); // ✅ removed .select("-password") since we never want it in UI anyway
    res.json(users);
  } catch (err) {
    console.error("Fetch users error:", err);
    res.status(500).json({ msg: "Failed to fetch users" });
  }
});

// DELETE USER
router.delete("/users/:id", protectAdmin, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ msg: "User deleted" });
  } catch (err) {
    console.error("Delete user error:", err);
    res.status(500).json({ msg: "Failed to delete user" });
  }
});
export default router;