import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import inquiryRoute from "./api/inquiry.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/inquiry", inquiryRoute);

app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
console.log("RESEND KEY:", process.env.RESEND_API_KEY);
