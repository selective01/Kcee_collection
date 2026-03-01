import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: String,
    description: String,
    price: Number,
    cost: { type: Number, default: 0 },
    category: { type: String },
    image: String,
    stock: Number,
    productId: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);