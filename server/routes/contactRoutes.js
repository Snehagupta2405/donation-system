import express from "express";
import ContactMessage from "../models/ContactMessage.js";

const router = express.Router();

// Create a contact message
router.post("/", async (req, res) => {
  try {
    const { name, email, subject, message } = req.body || {};
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }
    console.log("[contact] incoming", { name, email, subject, len: (message||'').length });
    const doc = await ContactMessage.create({ name, email, subject, message });
    console.log("[contact] saved", doc._id);
    res.status(201).json({ ok: true, id: doc._id });
  } catch (e) {
    console.error("[contact] error", e);
    res.status(500).json({ message: e.message || "Failed to save message" });
  }
});

export default router;
