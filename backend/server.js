import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

import inquiryRoute from "./api/inquiry.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// 🔗 MongoDB Connection
mongoose
  .connect(process.env.DBURL)
  .then(() => console.log("MongoDB connected ✅"))
  .catch((err) => console.error("MongoDB error ❌", err));

app.use("/api/inquiry", inquiryRoute);

app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
