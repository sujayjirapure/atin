const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");

/* ------------------ Schemas ------------------ */
const InquirySchema = new mongoose.Schema({
  name: String,
  mobile: String,
  address: String,
  createdAt: { type: Date, default: Date.now }
});

const ComplaintSchema = new mongoose.Schema({
  customerId: String,
  issue: String,
  createdAt: { type: Date, default: Date.now }
});

const Inquiry = mongoose.model("Inquiry", InquirySchema);
const Complaint = mongoose.model("Complaint", ComplaintSchema);

/* ------------------ Email Setup ------------------ */
const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/* ------------------ Routes ------------------ */

// New connection inquiry
router.post("/inquiry", async (req, res) => {
  try {
    const { name, mobile, address } = req.body;

    await Inquiry.create({ name, mobile, address });

    await transporter.sendMail({
      from: `"Akola Telecom" <${process.env.EMAIL_USER}>`,
      to: process.env.OWNER_EMAIL,
      subject: "New Internet Connection Inquiry",
      text: `Name: ${name}\nMobile: ${mobile}\nAddress: ${address}`
    });

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error });
  }
});

// Existing customer complaint
router.post("/complaint", async (req, res) => {
  try {
    const { customerId, issue } = req.body;

    await Complaint.create({ customerId, issue });

    await transporter.sendMail({
      from: `"Akola Telecom" <${process.env.EMAIL_USER}>`,
      to: process.env.OWNER_EMAIL,
      subject: "Customer Complaint",
      text: `Customer ID: ${customerId}\nIssue: ${issue}`
    });

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error });
  }
});

module.exports = router;
