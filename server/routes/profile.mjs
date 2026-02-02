import { Router } from "express";
import { getDatabase } from "../db.mjs";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";

const router = Router();
const JWT_SECRET =
  process.env.JWT_SECRET || "your-secret-key-change-in-production";

const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
};

router.get("/", authenticateToken, async (req, res) => {
  try {
    const db = getDatabase();
    const usersCollection = db.collection("users");
    const user = await usersCollection.findOne({
      _id: new ObjectId(req.userId),
    });

    if (!user) {
      return res.status(404).json({ error: "Profile not found" });
    }

    const { password, ...profile } = user;
    res.json(profile);
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/", authenticateToken, async (req, res) => {
  try {
    const db = getDatabase();
    const usersCollection = db.collection("users");
    const updates = { ...req.body, updated_at: new Date() };
    delete updates.password;

    const result = await usersCollection.updateOne(
      { _id: new ObjectId(req.userId) },
      { $set: updates },
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "Profile not found" });
    }

    const updatedUser = await usersCollection.findOne({
      _id: new ObjectId(req.userId),
    });
    if (!updatedUser) {
      return res.status(404).json({ error: "Profile not found" });
    }
    const { password, ...profile } = updatedUser;
    res.json(profile);
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
