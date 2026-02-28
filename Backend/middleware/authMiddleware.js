import jwt from "jsonwebtoken";
import User from "../models/User.js";

/* =========================
   PROTECT USER
========================= */
export const protectUser = async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.userId).select("-password");
      if (!req.user)
        return res.status(401).json({ message: "User not found" });

      next();
    } catch (error) {
      return res.status(401).json({ message: "Invalid token" });
    }
  }

  if (!token)
    return res.status(401).json({ message: "No token provided" });
};

/* =========================
   PROTECT ADMIN
========================= */
export const protectAdmin = async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // ✅ Look up from User model using userId (same as protectUser)
      const user = await User.findById(decoded.userId).select("-password");

      if (!user)
        return res.status(401).json({ message: "User not found" });

      // ✅ Check role field on User model
      if (user.role !== "admin")
        return res.status(403).json({ message: "Access denied. Admins only." });

      req.user = user; // ✅ consistent — always req.user, never req.admin
      next();
    } catch (error) {
      return res.status(401).json({ message: "Invalid token" });
    }
  }

  if (!token)
    return res.status(401).json({ message: "No token provided" });
};