import { Router } from "express";
import { getDatabase } from "../db.mjs";
import jwt from "jsonwebtoken";

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
    const applicationsCollection = db.collection("applications");
    const applications = await applicationsCollection
      .find({ user_id: req.userId })
      .sort({ created_at: -1 })
      .toArray();

    res.json(applications);
  } catch (error) {
    console.error("Get applications error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/", authenticateToken, async (req, res) => {
  try {
    const db = getDatabase();
    const applicationsCollection = db.collection("applications");

    const application = {
      ...req.body,
      user_id: req.userId,
      application_number: `APP${Date.now()}`,
      status: "Draft",
      created_at: new Date(),
      updated_at: new Date(),
    };

    const result = await applicationsCollection.insertOne(application);
    res.status(201).json({ id: result.insertedId, ...application });
  } catch (error) {
    console.error("Create application error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
