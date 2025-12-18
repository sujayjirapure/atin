import express from "express";
import { Resend } from "resend";

const router = express.Router();

router.post("/", async (req, res) => {
  const { name, mobile, address } = req.body;

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);

    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: process.env.OWNER_EMAIL,
      subject: "📩 New Website Inquiry",
      html: `
        <h3>New Inquiry</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Mobile:</strong> ${mobile}</p>
        <p><strong>Address:</strong> ${address}</p>
      `
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Email Error:", error);
    res.status(500).json({ success: false });
  }
});

export default router;
