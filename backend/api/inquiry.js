import express from "express";
import mongoose from "mongoose";
import { Resend } from "resend";

const router = express.Router();

/* MONGOOSE MODEL */
const inquirySchema = new mongoose.Schema(
  {
    type: String,
    name: String,
    mobile: String,
    email: String,
    address: String,
    issue: String,
  },
  { timestamps: true }
);

const Inquiry =
  mongoose.models.Inquiry || mongoose.model("Inquiry", inquirySchema);

/* CONNECT DB (ONCE) */
if (!mongoose.connection.readyState) {
  mongoose.connect(process.env.DBURL);
}

/* =======================
   GET ALL INQUIRIES
   ======================= */
router.get("/", async (req, res) => {
  try {
    const data = await Inquiry.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

/* =======================
   CREATE INQUIRY
   ======================= */
router.post("/", async (req, res) => {
  try {
    const { type, name, mobile, email, address, issue } = req.body;

    if (!type || !name || !mobile || !email) {
      return res.status(400).json({ success: false });
    }

    const inquiry = await Inquiry.create({
      type,
      name,
      mobile,
      email,
      address: address || "",
      issue: issue || "",
    });

    /* SEND EMAIL */
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
      `,
    });

    res.status(201).json({ success: true, inquiry });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

/* =======================
   DELETE INQUIRY
   ======================= */
router.delete("/:id", async (req, res) => {
  try {
    await Inquiry.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch {
    res.status(500).json({ success: false });
  }
});

export default router;
