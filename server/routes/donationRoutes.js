import express from "express";
import Donation from "../models/Donation.js";
import { authenticateToken, requireRole } from "../middleware/auth.js";

const router = express.Router();

// Create a donation (donor or volunteer or admin)
router.post("/", authenticateToken, requireRole(["donor","volunteer","admin"]), async (req, res) => {
  try {
    const { category, amount, message, collectionAddress, deliveryAddress } = req.body;
    const donor = req.user.name; // using name to match existing schema
    const doc = await Donation.create({ donor, category, amount, message, collectionAddress, deliveryAddress, status: "pending", date: new Date() });
    res.status(201).json(doc);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// Donor: own list
router.get("/donor", authenticateToken, requireRole(["donor","admin"]), async (req, res) => {
  try {
    const items = await Donation.find({ donor: req.user.name }).sort({ date: -1 });
    res.json(items);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// Volunteer: assigned to me (matches by assignedVolunteer string)
router.get("/volunteer", authenticateToken, requireRole(["volunteer","admin"]), async (req, res) => {
  try {
    const name = req.user.name;
    const email = req.user.email;
    const items = await Donation.find({
      $or: [
        { assignedVolunteer: name },
        { assignedVolunteer: email }
      ]
    }).sort({ date: -1 });
    res.json(items);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// Volunteer updates status on assigned donation
router.put("/volunteer/:id/status", authenticateToken, requireRole(["volunteer","admin"]), async (req, res) => {
  try {
    const { id } = req.params;
    const { status, note } = req.body; // status: collected | delivered | not_received
    if (!status) return res.status(400).json({ message: 'status required' });
    const allowed = new Set(['collected','delivered','not_received']);
    if (!allowed.has(status)) return res.status(400).json({ message: 'invalid status' });

    const update = { status };
    if (note) update.volunteerNotes = note;
    if (status === 'collected') update.collectionDate = new Date();
    if (status === 'delivered') update.deliveryDate = new Date();

    const updated = await Donation.findByIdAndUpdate(id, update, { new: true });
    if (!updated) return res.status(404).json({ message: 'Donation not found' });
    res.json(updated);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

export default router;
