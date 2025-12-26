import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import inquiryRoute from "./api/inquiry.js";

dotenv.config();

const app = express();

/* MIDDLEWARE */
app.use(cors());
app.use(express.json());

/* ROUTES */
app.use("/api/inquiry", inquiryRoute);

/* HEALTH CHECK */
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

/* START SERVER */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
