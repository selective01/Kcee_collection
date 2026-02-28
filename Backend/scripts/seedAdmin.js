import dotenv from "dotenv";
import dns from "node:dns/promises";
import bcrypt from "bcryptjs";
import Admin from "../models/Admin.js";
import connectDB from "../config/db.js";

dotenv.config();
dns.setServers(['8.8.8.8', '8.8.4.4']);

const createAdmin = async () => {
  try {
    await connectDB(); // ✅ WAIT for connection

    const email = "admin@kceecollection.com";
    const password = await bcrypt.hash("Kceeprecious01", 10);

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      console.log("Admin already exists");
      process.exit();
    }

    const admin = new Admin({ email, password });
    await admin.save();

    console.log("Admin created successfully");
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

createAdmin();