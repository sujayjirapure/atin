import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";

import inquiryRoute from "./api/inquiry.js";

dotenv.config();

const app = express();
const server = http.createServer(app);

/* SOCKET.IO SETUP */
const io = new Server(server, {
  cors: {
    origin: "*", // later restrict to dashboard domain
    methods: ["GET", "POST", "DELETE"],
  },
});

/* MAKE IO AVAILABLE IN ROUTES */
app.set("io", io);

/* MIDDLEWARE */
app.use(cors());
app.use(express.json());

/* DB */
mongoose
  .connect(process.env.DBURL)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

/* ROUTES */
app.use("/api/inquiry", inquiryRoute);

/* SOCKET EVENTS */
io.on("connection", (socket) => {
  console.log("Admin connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("Admin disconnected:", socket.id);
  });
});

/* HEALTH CHECK */
app.get("/", (req, res) => {
  res.send("Backend running 🚀");
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);
