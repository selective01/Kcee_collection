import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    href: { type: String, required: true, unique: true },
    image: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Category", categorySchema);
