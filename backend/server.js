import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

import inquiryRoute from "./api/inquiry.js";

/* =======================
   LOAD ENV
   ======================= */
dotenv.config();

const app = express();

/* =======================
   DATABASE CONNECTION
   ======================= */
mongoose
  .connect(process.env.DBURL)
  .then(() => console.log("MongoDB connected ✅"))
  .catch((err) => {
    console.error("MongoDB connection error ❌", err);
    process.exit(1);
  });

/* =======================
   CORS
   ======================= */
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:5173",
      "https://www.akolatelecomandipnetworks.com",
      "https://akolatelecomandipnetworks.com",
    ],
    methods: ["GET", "POST", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
  })
);

// ✅ Allow preflight (important for multipart/form-data)
app.options("*", cors());

/* =======================
   MIDDLEWARE
   ======================= */
app.use(express.json());

/* =======================
   ROUTES
   ======================= */
app.use("/api/inquiry", inquiryRoute);

/* =======================
   HEALTH CHECK
   ======================= */
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

/* =======================
   START SERVER
   ======================= */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
