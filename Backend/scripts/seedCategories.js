import dotenv from "dotenv";
import dns from "node:dns/promises";
import Category from "../models/Category.js";
import connectDB from "../config/db.js";

dotenv.config();
dns.setServers(['8.8.8.8', '8.8.4.4']);

const categories = [
  { title: "Bags", href: "/bags", image: "https://placehold.co/300x300?text=Bags" },
  { title: "Caps", href: "/caps", image: "https://placehold.co/300x300?text=Caps" },
  { title: "Club Jersey", href: "/club-jersey", image: "https://placehold.co/300x300?text=Club+Jersey" },
  { title: "Designer Shirts", href: "/designer-shirts", image: "https://placehold.co/300x300?text=Designer+Shirts" },
  { title: "Hoodies", href: "/hoodies", image: "https://placehold.co/300x300?text=Hoodies" },
  { title: "Jeans", href: "/jeans", image: "https://placehold.co/300x300?text=Jeans" },
  { title: "Jean Shorts", href: "/jean-shorts", image: "https://placehold.co/300x300?text=Jean+Shorts" },
  { title: "Joggers", href: "/joggers", image: "https://placehold.co/300x300?text=Joggers" },
  { title: "Perfume", href: "/perfume", image: "https://placehold.co/300x300?text=Perfume" },
  { title: "Polo", href: "/polo", image: "https://placehold.co/300x300?text=Polo" },
  { title: "Shoes", href: "/shoes", image: "https://placehold.co/300x300?text=Shoes" },
  { title: "Shorts", href: "/shorts", image: "https://placehold.co/300x300?text=Shorts" },
  { title: "Sneakers", href: "/sneakers", image: "https://placehold.co/300x300?text=Sneakers" },
  { title: "Sleeveless", href: "/sleeveless", image: "https://placehold.co/300x300?text=Sleeveless" },
  { title: "Slippers", href: "/slippers", image: "https://placehold.co/300x300?text=Slippers" },
  { title: "Retro Jersey", href: "/retro-jersey", image: "https://placehold.co/300x300?text=Retro+Jersey" },
  { title: "T-Shirts", href: "/t-shirts", image: "https://placehold.co/300x300?text=T-Shirts" },
  { title: "Watches", href: "/watches", image: "https://placehold.co/300x300?text=Watches" },
];

const seedCategories = async () => {
  try {
    await connectDB();

    await Category.deleteMany({});
    console.log("Cleared existing categories");

    await Category.insertMany(categories);
    console.log(`✅ Seeded ${categories.length} categories successfully`);

    process.exit(0);
  } catch (err) {
    console.error("Seed failed:", err.message);
    process.exit(1);
  }
};

seedCategories();