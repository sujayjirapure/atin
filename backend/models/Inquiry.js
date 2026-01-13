import mongoose from "mongoose";

const inquirySchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["connection", "complaint"],
      required: true,
    },
    name: { type: String, required: true },
    mobile: { type: String, required: true },
    email: { type: String, required: true },

    // Only one of these will be present
    address: { type: String },
    issue: { type: String },
    image: {
      type: String, // stores image path or URL
      default: "",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Inquiry", inquirySchema);
