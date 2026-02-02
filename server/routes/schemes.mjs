import { Router } from "express";
import { getDatabase } from "../db.mjs";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const db = getDatabase();
    const schemesCollection = db.collection("schemes");
    const schemes = await schemesCollection
      .find({ is_active: true })
      .sort({ created_at: -1 })
      .toArray();

    res.json(schemes);
  } catch (error) {
    console.error("Get schemes error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const db = getDatabase();
    const schemesCollection = db.collection("schemes");
    const scheme = await schemesCollection.findOne({ id: req.params.id });

    if (!scheme) {
      return res.status(404).json({ error: "Scheme not found" });
    }

    res.json(scheme);
  } catch (error) {
    console.error("Get scheme error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
