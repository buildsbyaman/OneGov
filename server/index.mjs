import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";

dotenv.config({ quiet: true });

import { connectToDatabase } from "./db.mjs";
import authRoutes from "./routes/auth.mjs";
import profileRoutes from "./routes/profile.mjs";
import schemesRoutes from "./routes/schemes.mjs";
import applicationsRoutes from "./routes/applications.mjs";
import eligibilityRoutes from "./routes/eligibility.mjs";
import aiAssistantRoutes from "./routes/ai-assistant.mjs";

const app = express();

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

connectToDatabase().catch(console.error);

app.get("/", (_req, res) => {
  res.json({ status: "ok", message: "OneGov API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/schemes", schemesRoutes);
app.use("/api/applications", applicationsRoutes);
app.use("/api/eligibility", eligibilityRoutes);
app.use("/api/ai-assistant", aiAssistantRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", message: "OneGov API is running" });
});

export default app;
