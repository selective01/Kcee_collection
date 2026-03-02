import express from "express";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import { protectUser, protectAdmin } from "../middleware/authMiddleware.js";
import {
  sendOrderConfirmation,
  sendPaymentConfirmation,
  sendAdminNewOrderAlert,
  sendAdminPaymentAlert,
  sendStatusUpdate,
  sendLowStockAlert,
} from "../utils/emailService.js";

const router = express.Router();

const LOW_STOCK_THRESHOLD = 5;

/* =========================
   ADMIN: Get all orders
========================= */
router.get("/", protectAdmin, async (req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 });
  res.json(orders);
});

/* =========================
   USER: Get My Orders (/my)
========================= */
router.get("/my", protectUser, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch {
    res.status(500).json({ message: "Failed to fetch orders" });
  }
});

/* =========================
   USER: Get My Orders (/myorders)
========================= */
router.get("/myorders", protectUser, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch {
    res.status(500).json({ message: "Failed to fetch orders" });
  }
});

/* =========================
   ADMIN: Update Order Status
========================= */
router.put("/:id", protectAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = status;
    await order.save();

    // Send status update email to user
    if (order.customer?.email) {
      sendStatusUpdate(order).catch(console.error);
    }

    res.json(order);
  } catch {
    res.status(500).json({ message: "Failed to update order" });
  }
});

/* =========================
   USER: Create Order
========================= */
router.post("/", protectUser, async (req, res) => {
  try {
    const order = new Order({
      user: req.user._id,
      items: req.body.items,
      totalPrice: req.body.totalPrice,
      paymentStatus: req.body.paymentStatus || "Pending",
      status: "Pending",
      customer: req.body.customer,
      reference: req.body.reference,
    });

    const createdOrder = await order.save();

    // Send emails (non-blocking)
    if (createdOrder.customer?.email) {
      sendOrderConfirmation(createdOrder).catch(console.error);
    }
    sendAdminNewOrderAlert(createdOrder).catch(console.error);

    // Send payment confirmation if already paid
    if (req.body.paymentStatus?.toLowerCase() === "paid") {
      if (createdOrder.customer?.email) {
        sendPaymentConfirmation(createdOrder).catch(console.error);
      }
      sendAdminPaymentAlert(createdOrder).catch(console.error);
    }

    // Check stock levels and alert admin if low
    // Check stock levels and alert admin if low
    for (const item of req.body.items || []) {
      if (item.productId && item.productId.match(/^[0-9a-fA-F]{24}$/)) {
        const product = await Product.findById(item.productId);
        if (product && product.stock !== undefined && product.stock <= LOW_STOCK_THRESHOLD) {
          sendLowStockAlert(product).catch(console.error);
        }
      }
    }

    res.status(201).json(createdOrder);
  } catch (error) {
    console.error("Order error:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
