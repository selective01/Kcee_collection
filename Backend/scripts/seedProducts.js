import dotenv from "dotenv";
import dns from "node:dns/promises";
import Product from "../models/Product.js";
import connectDB from "../config/db.js";

dotenv.config();
dns.setServers(['8.8.8.8', '8.8.4.4']);

const ph = (text) => `https://placehold.co/300x300?text=${encodeURIComponent(text)}`;

const products = [
  // ── BAGS ──
  { productId: "bag-001", name: "Premium Bag", price: 15000, category: "Bags", image: ph("Bag 1") },
  { productId: "bag-002", name: "Premium Bag", price: 15000, category: "Bags", image: ph("Bag 2") },
  { productId: "bag-003", name: "Premium Bag", price: 15000, category: "Bags", image: ph("Bag 3") },
  { productId: "bag-004", name: "Premium Bag", price: 15000, category: "Bags", image: ph("Bag 4") },
  { productId: "bag-005", name: "Premium Bag", price: 15000, category: "Bags", image: ph("Bag 5") },
  { productId: "bag-006", name: "Premium Bag", price: 15000, category: "Bags", image: ph("Bag 6") },
  { productId: "bag-007", name: "Premium Bag", price: 15000, category: "Bags", image: ph("Bag 7") },
  { productId: "bag-008", name: "Premium Bag", price: 15000, category: "Bags", image: ph("Bag 8") },
  { productId: "bag-011", name: "Premium Bag", price: 15555, category: "Bags", image: ph("Bag 9") },
  { productId: "bag-012", name: "Premium Bag", price: 16666, category: "Bags", image: ph("Bag 10") },

  // ── CAPS ──
  { productId: "cap-001", name: "Premium Cap", price: 8000, category: "Caps", image: ph("Cap 1") },
  { productId: "cap-002", name: "Premium Cap", price: 8000, category: "Caps", image: ph("Cap 2") },
  { productId: "cap-003", name: "Premium Cap", price: 8000, category: "Caps", image: ph("Cap 3") },
  { productId: "cap-004", name: "Premium Cap", price: 8000, category: "Caps", image: ph("Cap 4") },
  { productId: "cap-005", name: "Premium Cap", price: 8000, category: "Caps", image: ph("Cap 5") },
  { productId: "cap-006", name: "Premium Cap", price: 8000, category: "Caps", image: ph("Cap 6") },
  { productId: "cap-007", name: "Premium Cap", price: 8000, category: "Caps", image: ph("Cap 7") },
  { productId: "cap-008", name: "Premium Cap", price: 8000, category: "Caps", image: ph("Cap 8") },
  { productId: "cap-009", name: "Premium Cap", price: 8000, category: "Caps", image: ph("Cap 9") },
  { productId: "cap-010", name: "Premium Cap", price: 8000, category: "Caps", image: ph("Cap 10") },

  // ── CLUB JERSEY ──
  { productId: "clubjersey-001", name: "Club Jersey", price: 25000, category: "Club Jersey", image: ph("Club Jersey 1") },
  { productId: "clubjersey-002", name: "Club Jersey", price: 25000, category: "Club Jersey", image: ph("Club Jersey 2") },
  { productId: "clubjersey-003", name: "Club Jersey", price: 25000, category: "Club Jersey", image: ph("Club Jersey 3") },
  { productId: "clubjersey-004", name: "Club Jersey", price: 25000, category: "Club Jersey", image: ph("Club Jersey 4") },
  { productId: "clubjersey-005", name: "Club Jersey", price: 25000, category: "Club Jersey", image: ph("Club Jersey 5") },
  { productId: "clubjersey-006", name: "Club Jersey", price: 25000, category: "Club Jersey", image: ph("Club Jersey 6") },
  { productId: "clubjersey-007", name: "Club Jersey", price: 25000, category: "Club Jersey", image: ph("Club Jersey 7") },
  { productId: "clubjersey-008", name: "Club Jersey", price: 25000, category: "Club Jersey", image: ph("Club Jersey 8") },
  { productId: "clubjersey-019", name: "Club Jersey", price: 25000, category: "Club Jersey", image: ph("Club Jersey 9") },
  { productId: "clubjersey-111", name: "Club Jersey", price: 25555, category: "Club Jersey", image: ph("Club Jersey 10") },

  // ── DESIGNER SHIRTS ──
  { productId: "DesignerShirt-001", name: "Designer Shirt", price: 20000, category: "Designer Shirts", image: ph("Designer Shirt 1") },
  { productId: "DesignerShirt-002", name: "Designer Shirt", price: 20000, category: "Designer Shirts", image: ph("Designer Shirt 2") },
  { productId: "DesignerShirt-003", name: "Designer Shirt", price: 20000, category: "Designer Shirts", image: ph("Designer Shirt 3") },
  { productId: "DesignerShirt-004", name: "Designer Shirt", price: 20000, category: "Designer Shirts", image: ph("Designer Shirt 4") },
  { productId: "DesignerShirt-005", name: "Designer Shirt", price: 25555, category: "Designer Shirts", image: ph("Designer Shirt 5") },
  { productId: "DesignerShirt-006", name: "Designer Shirt", price: 25555, category: "Designer Shirts", image: ph("Designer Shirt 6") },
  { productId: "DesignerShirt-007", name: "Designer Shirt", price: 25555, category: "Designer Shirts", image: ph("Designer Shirt 7") },
  { productId: "DesignerShirt-008", name: "Designer Shirt", price: 25555, category: "Designer Shirts", image: ph("Designer Shirt 8") },
  { productId: "DesignerShirt-011", name: "Designer Shirt", price: 25555, category: "Designer Shirts", image: ph("Designer Shirt 9") },
  { productId: "DesignerShirt-012", name: "Designer Shirt", price: 27777, category: "Designer Shirts", image: ph("Designer Shirt 10") },

  // ── HOODIES ──
  { productId: "hoodie-001", name: "Urban Hoodie", price: 25000, category: "Hoodies", image: ph("Hoodie 1") },
  { productId: "hoodie-002", name: "Urban Hoodie", price: 25000, category: "Hoodies", image: ph("Hoodie 2") },
  { productId: "hoodie-003", name: "Urban Hoodie", price: 25000, category: "Hoodies", image: ph("Hoodie 3") },
  { productId: "hoodie-004", name: "Urban Hoodie", price: 25000, category: "Hoodies", image: ph("Hoodie 4") },
  { productId: "hoodie-005", name: "Urban Hoodie", price: 25000, category: "Hoodies", image: ph("Hoodie 5") },
  { productId: "hoodie-006", name: "Urban Hoodie", price: 25000, category: "Hoodies", image: ph("Hoodie 6") },
  { productId: "hoodie-007", name: "Urban Hoodie", price: 25000, category: "Hoodies", image: ph("Hoodie 7") },
  { productId: "hoodie-008", name: "Urban Hoodie", price: 25000, category: "Hoodies", image: ph("Hoodie 8") },
  { productId: "hoodie-009", name: "Urban Hoodie", price: 25000, category: "Hoodies", image: ph("Hoodie 9") },
  { productId: "hoodie-010", name: "Urban Hoodie", price: 25000, category: "Hoodies", image: ph("Hoodie 10") },

  // ── JEANS ──
  { productId: "jeans-001", name: "Premium Jeans", price: 20000, category: "Jeans", image: ph("Jeans 1") },
  { productId: "jeans-002", name: "Premium Jeans", price: 20000, category: "Jeans", image: ph("Jeans 2") },
  { productId: "jeans-003", name: "Premium Jeans", price: 21000, category: "Jeans", image: ph("Jeans 3") },
  { productId: "jeans-004", name: "Premium Jeans", price: 21555, category: "Jeans", image: ph("Jeans 4") },
  { productId: "jeans-005", name: "Premium Jeans", price: 22222, category: "Jeans", image: ph("Jeans 5") },
  { productId: "jeans-006", name: "Premium Jeans", price: 23333, category: "Jeans", image: ph("Jeans 6") },
  { productId: "jeans-007", name: "Premium Jeans", price: 24444, category: "Jeans", image: ph("Jeans 7") },
  { productId: "jeans-008", name: "Premium Jeans", price: 25555, category: "Jeans", image: ph("Jeans 8") },
  { productId: "jeans-011", name: "Premium Jeans", price: 26666, category: "Jeans", image: ph("Jeans 9") },
  { productId: "jeans-012", name: "Premium Jeans", price: 27777, category: "Jeans", image: ph("Jeans 10") },

  // ── JEAN SHORTS ──
  { productId: "jeanshorts-001", name: "Premium Jean Shorts", price: 15000, category: "Jean Shorts", image: ph("Jean Shorts 1") },
  { productId: "jeanshorts-002", name: "Premium Jean Shorts", price: 15000, category: "Jean Shorts", image: ph("Jean Shorts 2") },
  { productId: "jeanshorts-003", name: "Premium Jean Shorts", price: 15000, category: "Jean Shorts", image: ph("Jean Shorts 3") },
  { productId: "jeanshorts-004", name: "Premium Jean Shorts", price: 15555, category: "Jean Shorts", image: ph("Jean Shorts 4") },
  { productId: "jeanshorts-005", name: "Premium Jean Shorts", price: 15555, category: "Jean Shorts", image: ph("Jean Shorts 5") },
  { productId: "jeanshorts-006", name: "Premium Jean Shorts", price: 15555, category: "Jean Shorts", image: ph("Jean Shorts 6") },
  { productId: "jeanshorts-007", name: "Premium Jean Shorts", price: 17777, category: "Jean Shorts", image: ph("Jean Shorts 7") },
  { productId: "jeanshorts-008", name: "Premium Jean Shorts", price: 17777, category: "Jean Shorts", image: ph("Jean Shorts 8") },
  { productId: "jeanshorts-011", name: "Premium Jean Shorts", price: 17777, category: "Jean Shorts", image: ph("Jean Shorts 9") },
  { productId: "jeanshorts-012", name: "Premium Jean Shorts", price: 19999, category: "Jean Shorts", image: ph("Jean Shorts 10") },

  // ── JOGGERS ──
  { productId: "joggers-001", name: "Premium Joggers", price: 22000, category: "Joggers", image: ph("Joggers 1") },
  { productId: "joggers-002", name: "Premium Joggers", price: 22000, category: "Joggers", image: ph("Joggers 2") },
  { productId: "joggers-003", name: "Premium Joggers", price: 22000, category: "Joggers", image: ph("Joggers 3") },
  { productId: "joggers-004", name: "Premium Joggers", price: 22000, category: "Joggers", image: ph("Joggers 4") },
  { productId: "joggers-005", name: "Premium Joggers", price: 22000, category: "Joggers", image: ph("Joggers 5") },
  { productId: "joggers-006", name: "Premium Joggers", price: 22555, category: "Joggers", image: ph("Joggers 6") },
  { productId: "joggers-007", name: "Premium Joggers", price: 22555, category: "Joggers", image: ph("Joggers 7") },
  { productId: "joggers-008", name: "Premium Joggers", price: 23333, category: "Joggers", image: ph("Joggers 8") },
  { productId: "joggers-011", name: "Premium Joggers", price: 23333, category: "Joggers", image: ph("Joggers 9") },
  { productId: "joggers-012", name: "Premium Joggers", price: 24444, category: "Joggers", image: ph("Joggers 10") },

  // ── PERFUME ──
  { productId: "perfume-001", name: "Luxury Perfume", price: 15000, category: "Perfume", image: ph("Perfume 1") },
  { productId: "perfume-002", name: "Luxury Perfume", price: 15000, category: "Perfume", image: ph("Perfume 2") },
  { productId: "perfume-003", name: "Luxury Perfume", price: 15000, category: "Perfume", image: ph("Perfume 3") },
  { productId: "perfume-004", name: "Luxury Perfume", price: 15000, category: "Perfume", image: ph("Perfume 4") },
  { productId: "perfume-005", name: "Luxury Perfume", price: 15000, category: "Perfume", image: ph("Perfume 5") },
  { productId: "perfume-006", name: "Luxury Perfume", price: 15000, category: "Perfume", image: ph("Perfume 6") },
  { productId: "perfume-007", name: "Luxury Perfume", price: 15000, category: "Perfume", image: ph("Perfume 7") },
  { productId: "perfume-008", name: "Luxury Perfume", price: 15000, category: "Perfume", image: ph("Perfume 8") },
  { productId: "perfume-009", name: "Luxury Perfume", price: 15000, category: "Perfume", image: ph("Perfume 9") },
  { productId: "perfume-010", name: "Luxury Perfume", price: 15000, category: "Perfume", image: ph("Perfume 10") },

  // ── POLO ──
  { productId: "polo-001", name: "Premium Polo", price: 22000, category: "Polo", image: ph("Polo 1") },
  { productId: "polo-002", name: "Premium Polo", price: 22000, category: "Polo", image: ph("Polo 2") },
  { productId: "polo-003", name: "Premium Polo", price: 22000, category: "Polo", image: ph("Polo 3") },
  { productId: "polo-004", name: "Premium Polo", price: 22000, category: "Polo", image: ph("Polo 4") },
  { productId: "polo-005", name: "Premium Polo", price: 22000, category: "Polo", image: ph("Polo 5") },
  { productId: "polo-006", name: "Premium Polo", price: 22000, category: "Polo", image: ph("Polo 6") },
  { productId: "polo-007", name: "Premium Polo", price: 22000, category: "Polo", image: ph("Polo 7") },
  { productId: "polo-008", name: "Premium Polo", price: 22000, category: "Polo", image: ph("Polo 8") },
  { productId: "polo-009", name: "Premium Polo", price: 22000, category: "Polo", image: ph("Polo 9") },
  { productId: "polo-010", name: "Premium Polo", price: 22000, category: "Polo", image: ph("Polo 10") },

  // ── RETRO JERSEY ──
  { productId: "retrojersey-001", name: "Retro Jersey", price: 25000, category: "Retro Jersey", image: ph("Retro Jersey 1") },
  { productId: "retrojersey-002", name: "Retro Jersey", price: 25000, category: "Retro Jersey", image: ph("Retro Jersey 2") },
  { productId: "retrojersey-003", name: "Retro Jersey", price: 25000, category: "Retro Jersey", image: ph("Retro Jersey 3") },
  { productId: "retrojersey-004", name: "Retro Jersey", price: 25000, category: "Retro Jersey", image: ph("Retro Jersey 4") },
  { productId: "retrojersey-005", name: "Retro Jersey", price: 25555, category: "Retro Jersey", image: ph("Retro Jersey 5") },
  { productId: "retrojersey-006", name: "Retro Jersey", price: 25555, category: "Retro Jersey", image: ph("Retro Jersey 6") },
  { productId: "retrojersey-007", name: "Retro Jersey", price: 25555, category: "Retro Jersey", image: ph("Retro Jersey 7") },
  { productId: "retrojersey-008", name: "Retro Jersey", price: 25555, category: "Retro Jersey", image: ph("Retro Jersey 8") },
  { productId: "retrojersey-011", name: "Retro Jersey", price: 27777, category: "Retro Jersey", image: ph("Retro Jersey 9") },
  { productId: "retrojersey-012", name: "Retro Jersey", price: 27777, category: "Retro Jersey", image: ph("Retro Jersey 10") },

  // ── SHOES ──
  { productId: "shoes-001", name: "Premium Shoes", price: 12000, category: "Shoes", image: ph("Shoes 1") },
  { productId: "shoes-002", name: "Premium Shoes", price: 12000, category: "Shoes", image: ph("Shoes 2") },
  { productId: "shoes-003", name: "Premium Shoes", price: 12555, category: "Shoes", image: ph("Shoes 3") },
  { productId: "shoes-004", name: "Premium Shoes", price: 12555, category: "Shoes", image: ph("Shoes 4") },
  { productId: "shoes-005", name: "Premium Shoes", price: 13333, category: "Shoes", image: ph("Shoes 5") },
  { productId: "shoes-006", name: "Premium Shoes", price: 13333, category: "Shoes", image: ph("Shoes 6") },
  { productId: "shoes-007", name: "Premium Shoes", price: 14444, category: "Shoes", image: ph("Shoes 7") },
  { productId: "shoes-008", name: "Premium Shoes", price: 14444, category: "Shoes", image: ph("Shoes 8") },
  { productId: "shoes-009", name: "Premium Shoes", price: 15555, category: "Shoes", image: ph("Shoes 9") },
  { productId: "shoes-010", name: "Premium Shoes", price: 15555, category: "Shoes", image: ph("Shoes 10") },

  // ── SHORTS ──
  { productId: "shorts-001", name: "Street Shorts", price: 12000, category: "Shorts", image: ph("Shorts 1") },
  { productId: "shorts-002", name: "Street Shorts", price: 12000, category: "Shorts", image: ph("Shorts 2") },
  { productId: "shorts-003", name: "Street Shorts", price: 12000, category: "Shorts", image: ph("Shorts 3") },
  { productId: "shorts-004", name: "Street Shorts", price: 12000, category: "Shorts", image: ph("Shorts 4") },
  { productId: "shorts-005", name: "Street Shorts", price: 12555, category: "Shorts", image: ph("Shorts 5") },
  { productId: "shorts-006", name: "Street Shorts", price: 12555, category: "Shorts", image: ph("Shorts 6") },
  { productId: "shorts-007", name: "Street Shorts", price: 12555, category: "Shorts", image: ph("Shorts 7") },
  { productId: "shorts-008", name: "Street Shorts", price: 12555, category: "Shorts", image: ph("Shorts 8") },
  { productId: "shorts-011", name: "Street Shorts", price: 12555, category: "Shorts", image: ph("Shorts 9") },
  { productId: "shorts-012", name: "Street Shorts", price: 13333, category: "Shorts", image: ph("Shorts 10") },

  // ── SLEEVELESS ──
  { productId: "sleeveless-001", name: "Premium Sleeveless", price: 20000, category: "Sleeveless", image: ph("Sleeveless 1") },
  { productId: "sleeveless-002", name: "Premium Sleeveless", price: 20000, category: "Sleeveless", image: ph("Sleeveless 2") },
  { productId: "sleeveless-003", name: "Premium Sleeveless", price: 20000, category: "Sleeveless", image: ph("Sleeveless 3") },
  { productId: "sleeveless-004", name: "Premium Sleeveless", price: 20000, category: "Sleeveless", image: ph("Sleeveless 4") },
  { productId: "sleeveless-005", name: "Premium Sleeveless", price: 20000, category: "Sleeveless", image: ph("Sleeveless 5") },
  { productId: "sleeveless-006", name: "Premium Sleeveless", price: 20000, category: "Sleeveless", image: ph("Sleeveless 6") },
  { productId: "sleeveless-007", name: "Premium Sleeveless", price: 20000, category: "Sleeveless", image: ph("Sleeveless 7") },
  { productId: "sleeveless-008", name: "Premium Sleeveless", price: 20000, category: "Sleeveless", image: ph("Sleeveless 8") },
  { productId: "sleeveless-009", name: "Premium Sleeveless", price: 20000, category: "Sleeveless", image: ph("Sleeveless 9") },
  { productId: "sleeveless-010", name: "Premium Sleeveless", price: 20000, category: "Sleeveless", image: ph("Sleeveless 10") },

  // ── SLIPPERS ──
  { productId: "slippers-001", name: "Premium Slippers", price: 12000, category: "Slippers", image: ph("Slippers 1") },
  { productId: "slippers-002", name: "Premium Slippers", price: 12000, category: "Slippers", image: ph("Slippers 2") },
  { productId: "slippers-003", name: "Premium Slippers", price: 12555, category: "Slippers", image: ph("Slippers 3") },
  { productId: "slippers-004", name: "Premium Slippers", price: 12555, category: "Slippers", image: ph("Slippers 4") },
  { productId: "slippers-005", name: "Premium Slippers", price: 13333, category: "Slippers", image: ph("Slippers 5") },
  { productId: "slippers-006", name: "Premium Slippers", price: 13333, category: "Slippers", image: ph("Slippers 6") },
  { productId: "slippers-007", name: "Premium Slippers", price: 14444, category: "Slippers", image: ph("Slippers 7") },
  { productId: "slippers-008", name: "Premium Slippers", price: 14444, category: "Slippers", image: ph("Slippers 8") },
  { productId: "slippers-009", name: "Premium Slippers", price: 15555, category: "Slippers", image: ph("Slippers 9") },
  { productId: "slippers-010", name: "Premium Slippers", price: 15555, category: "Slippers", image: ph("Slippers 10") },

  // ── SNEAKERS ──
  { productId: "sneakers-001", name: "Premium Sneakers", price: 12000, category: "Sneakers", image: ph("Sneakers 1") },
  { productId: "sneakers-002", name: "Premium Sneakers", price: 12000, category: "Sneakers", image: ph("Sneakers 2") },
  { productId: "sneakers-003", name: "Premium Sneakers", price: 12555, category: "Sneakers", image: ph("Sneakers 3") },
  { productId: "sneakers-004", name: "Premium Sneakers", price: 12555, category: "Sneakers", image: ph("Sneakers 4") },
  { productId: "sneakers-005", name: "Premium Sneakers", price: 13333, category: "Sneakers", image: ph("Sneakers 5") },
  { productId: "sneakers-006", name: "Premium Sneakers", price: 13333, category: "Sneakers", image: ph("Sneakers 6") },
  { productId: "sneakers-007", name: "Premium Sneakers", price: 14444, category: "Sneakers", image: ph("Sneakers 7") },
  { productId: "sneakers-008", name: "Premium Sneakers", price: 14444, category: "Sneakers", image: ph("Sneakers 8") },
  { productId: "sneakers-009", name: "Premium Sneakers", price: 15555, category: "Sneakers", image: ph("Sneakers 9") },
  { productId: "sneakers-010", name: "Premium Sneakers", price: 15555, category: "Sneakers", image: ph("Sneakers 10") },

  // ── T-SHIRTS ──
  { productId: "ts-001", name: "Luxury Tshirt", price: 45000, category: "T-Shirts", image: ph("TShirt 1") },
  { productId: "ts-002", name: "Luxury Tshirt", price: 45000, category: "T-Shirts", image: ph("TShirt 2") },
  { productId: "ts-003", name: "Luxury Tshirt", price: 45000, category: "T-Shirts", image: ph("TShirt 3") },
  { productId: "ts-004", name: "Luxury Tshirt", price: 45000, category: "T-Shirts", image: ph("TShirt 4") },
  { productId: "ts-005", name: "Luxury Tshirt", price: 45000, category: "T-Shirts", image: ph("TShirt 5") },
  { productId: "ts-006", name: "Luxury Tshirt", price: 45000, category: "T-Shirts", image: ph("TShirt 6") },
  { productId: "ts-007", name: "Luxury Tshirt", price: 45000, category: "T-Shirts", image: ph("TShirt 7") },
  { productId: "ts-011", name: "Luxury Tshirt", price: 45555, category: "T-Shirts", image: ph("TShirt 8") },
  { productId: "ts-121", name: "Luxury Tshirt", price: 45555, category: "T-Shirts", image: ph("TShirt 9") },
  { productId: "ts-131", name: "Luxury Tshirt", price: 46666, category: "T-Shirts", image: ph("TShirt 10") },

  // ── WATCHES ──
  { productId: "watch-001", name: "Watch", price: 6000, category: "Watches", image: ph("Watch 1") },
  { productId: "watch-002", name: "Watch", price: 6000, category: "Watches", image: ph("Watch 2") },
  { productId: "watch-003", name: "Watch", price: 6000, category: "Watches", image: ph("Watch 3") },
  { productId: "watch-004", name: "Watch", price: 6000, category: "Watches", image: ph("Watch 4") },
  { productId: "watch-005", name: "Watch", price: 6000, category: "Watches", image: ph("Watch 5") },
  { productId: "watch-006", name: "Watch", price: 6000, category: "Watches", image: ph("Watch 6") },
  { productId: "watch-007", name: "Watch", price: 6000, category: "Watches", image: ph("Watch 7") },
  { productId: "watch-008", name: "Watch", price: 6000, category: "Watches", image: ph("Watch 8") },
  { productId: "watch-009", name: "Watch", price: 6000, category: "Watches", image: ph("Watch 9") },
  { productId: "watch-010", name: "Watch", price: 6000, category: "Watches", image: ph("Watch 10") },
];

const seedProducts = async () => {
  try {
    await connectDB();

    await Product.deleteMany({});
    console.log("Cleared existing products");

    await Product.insertMany(products);
    console.log(`✅ Seeded ${products.length} products across 18 categories successfully`);

    process.exit(0);
  } catch (err) {
    console.error("Seed failed:", err.message);
    process.exit(1);
  }
};

seedProducts();
