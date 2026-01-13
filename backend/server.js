import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import path from "path";

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
   MIDDLEWARE
   ======================= */
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://YOUR-FRONTEND.vercel.app",
    ],
    methods: ["GET", "POST", "DELETE"],
  })
);

app.use("/uploads", express.static("uploads"));

app.use(express.json());

/* =======================
   STATIC FILES (IMAGES)
   ======================= */
app.use("/uploads", express.static("uploads"));

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
