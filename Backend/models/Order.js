import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    customer: {
      fullName: String,
      email: String,
      phone: String,
      address: String,
      country: String,
      state: String,
      postalCode: String,
    },
    items: Array,
    totalPrice: { type: Number, required: true }, // ✅ was `amount: Number`
    reference: String,
    status: { type: String, default: "Pending" },
    paymentStatus: { type: String, default: "Pending" },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);