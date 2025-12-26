import express from "express";
import { Resend } from "resend";
import Inquiry from "../models/Inquiry.js";

const router = express.Router();

/**
 * POST: New Connection / Complaint
 */
router.post("/", async (req, res) => {
  const { type, name, mobile, email, address, issue } = req.body;

  try {
    if (!type || !name || !mobile || !email) {
      return res
        .status(400)
        .json({ success: false, message: "Missing fields" });
    }

    // Save to MongoDB
    const inquiry = await Inquiry.create({
      type,
      name,
      mobile,
      email,
      address,
      issue,
    });

    // Send Email
    const resend = new Resend(process.env.RESEND_API_KEY);

    await resend.emails.send({
      from: "ATIN <onboarding@resend.dev>",
      to: process.env.OWNER_EMAIL,
      subject:
        type === "connection"
          ? "📩 New Connection Inquiry"
          : "🚨 New Customer Complaint",
      html: `
        <h3>${
          type === "connection"
            ? "New Connection Inquiry"
            : "New Complaint"
        }</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Mobile:</strong> ${mobile}</p>
        <p><strong>Email:</strong> ${email}</p>
        ${
          type === "connection"
            ? `<p><strong>Address:</strong> ${address}</p>`
            : `<p><strong>Issue:</strong> ${issue}</p>`
        }
      `,
    });

    res.status(201).json({
      success: true,
      message: "Submitted successfully",
      data: inquiry,
    });
  } catch (error) {
    console.error("Inquiry Error:", error);
    res.status(500).json({ success: false });
  }
});

/**
 * GET: Fetch all inquiries (for dashboard)
 */
router.get("/", async (req, res) => {
  try {
    const inquiries = await Inquiry.find().sort({ createdAt: -1 });
    res.status(200).json(inquiries);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch inquiries" });
  }
});

/* 🔥 THIS LINE FIXES YOUR RENDER ERROR */
export default router;
