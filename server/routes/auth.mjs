import { Router } from "express";
import { getDatabase } from "../db.mjs";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";

const router = Router();
const JWT_SECRET =
  process.env.JWT_SECRET || "your-secret-key-change-in-production";

router.post("/signup", async (req, res) => {
  try {
    const {
      email,
      password,
      aadhaar_number,
      pan_number,
      driving_license,
      ...userData
    } = req.body;
    const db = getDatabase();
    const usersCollection = db.collection("users");

    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    if (
      !aadhaar_number ||
      !/^[2-9]{1}[0-9]{11}$/.test(aadhaar_number) ||
      /^([0-9])\1{11}$/.test(aadhaar_number)
    ) {
      return res.status(400).json({ error: "Invalid Aadhaar number" });
    }

    if (!pan_number || !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan_number)) {
      return res.status(400).json({ error: "Invalid PAN number" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await usersCollection.insertOne({
      email,
      password: hashedPassword,
      aadhaar_number,
      pan_number,
      driving_license,
      ...userData,
      created_at: new Date(),
      updated_at: new Date(),
    });

    const token = jwt.sign({ userId: result.insertedId, email }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(201).json({
      user: {
        id: result.insertedId,
        email,
        ...userData,
        aadhaar_number,
        pan_number,
        driving_license,
      },
      token,
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;
    const db = getDatabase();
    const usersCollection = db.collection("users");

    const user = await usersCollection.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user._id, email }, JWT_SECRET, {
      expiresIn: "7d",
    });

    const { password: _, ...userWithoutPassword } = user;

    res.json({
      user: { id: user._id, ...userWithoutPassword },
      token,
    });
  } catch (error) {
    console.error("Signin error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/verify", async (req, res) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const db = getDatabase();
    const usersCollection = db.collection("users");

    const user = await usersCollection.findOne({
      _id: new ObjectId(decoded.userId),
    });
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    const { password: _, ...userWithoutPassword } = user;
    res.json({ user: { id: user._id, ...userWithoutPassword } });
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
});

export default router;
