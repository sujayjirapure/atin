import express from "express";
import { Resend } from "resend";
import multer from "multer";

import Inquiry from "../models/inquiry.js";

const router = express.Router();

/* =======================
   MULTER CONFIG
   ======================= */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});






const upload = multer({ storage });

/* =======================
   GET ALL INQUIRIES
   ======================= */
router.get("/", async (req, res) => {
  try {
    const data = await Inquiry.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    console.error("GET ERROR:", err);
    res.status(500).json({ success: false });
  }
});

/* =======================
   CREATE INQUIRY (WITH IMAGE)
   ======================= */
router.post("/", upload.single("image"), async (req, res) => {
  try {
    console.log("🔥 API HIT 🔥");
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    const { type, name, mobile, email, address, issue } = req.body;

    if (!type || !name || !mobile || !email) {
      return res
        .status(400)
        .json({ success: false, message: "Missing fields" });
    }

    // ✅ SAVE TO DB
    const inquiry = await Inquiry.create({
      type,
      name,
      mobile,
      email,
      address: address || "",
      issue: issue || "",
      image: req.file ? `/uploads/${req.file.filename}` : "",
    });

    // ✅ SEND EMAIL (NON-BLOCKING)
    try {
      const resend = new Resend(process.env.RESEND_API_KEY);

      await resend.emails.send({
        from: "ATIN <onboarding@resend.dev>",
        to: process.env.OWNER_EMAIL,
        subject:
          type === "connection"
            ? "📩 New Connection Inquiry"
            : "🚨 New Complaint",
        html: `
          <h3>${type.toUpperCase()}</h3>
          <p><b>Name:</b> ${name}</p>
          <p><b>Mobile:</b> ${mobile}</p>
          <p><b>Email:</b> ${email}</p>
          <p><b>${type === "connection" ? "Address" : "Issue"}:</b>
          ${address || issue}</p>
          ${
            req.file
              ? `<p><b>Image:</b><br/>
                 <img src="${process.env.BASE_URL}${inquiry.image}" width="200"/>
                 </p>`
              : ""
          }
        `,
      });
    } catch (emailErr) {
      console.error("EMAIL FAILED (IGNORED):", emailErr.message);
    }

    res.status(201).json({ success: true, inquiry });
  } catch (err) {
    console.error("POST ERROR:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

/* =======================
   DELETE INQUIRY
   ======================= */
router.delete("/:id", async (req, res) => {
  try {
    await Inquiry.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    console.error("DELETE ERROR:", err);
    res.status(500).json({ success: false });
  }
});

export default router;
