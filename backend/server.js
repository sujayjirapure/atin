const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

/* ------------------ MongoDB ------------------ */
mongoose
  .connect(process.env.DBURL)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

/* ------------------ Routes ------------------ */
const inquiryRoutes = require("./api/inquiry");
app.use("/api", inquiryRoutes);

/* ------------------ Server ------------------ */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
