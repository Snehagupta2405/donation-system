import express from "express";
import Donation from "../models/Donation.js";
import User from "../models/User.js";
import { authenticateToken, requireRole } from "../middleware/auth.js";
import ContactMessage from "../models/ContactMessage.js";

const router = express.Router();

// Protect all admin routes
router.use(authenticateToken, requireRole(['admin']));

// 📌 Get all donations
router.get("/donations", async (req, res) => {
  try {
    const donations = await Donation.find();
    res.json(donations);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch donations" });
  }
});

// 📌 Get donation by id
router.get("/donations/:id", async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id);
    if (!donation) return res.status(404).json({ message: "Not found" });
    res.json(donation);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch donation" });
  }
});

// 📌 Update donation (general fields)
router.put("/donations/:id", async (req, res) => {
  try {
    const allowed = ["donor","category","amount","message","status","assignedVolunteer","date","collectionAddress","deliveryAddress"]; 
    const update = {};
    for (const k of allowed) if (k in req.body) update[k] = req.body[k];
    const donation = await Donation.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!donation) return res.status(404).json({ message: "Not found" });
    res.json(donation);
  } catch (err) {
    res.status(500).json({ message: "Failed to update donation" });
  }
});

// 📌 Delete donation
router.delete("/donations/:id", async (req, res) => {
  try {
    const deleted = await Donation.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Not found" });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete donation" });
  }
});

// 📌 Get all donors (unique donor names)
router.get("/donors", async (req, res) => {
  try {
    const donors = await Donation.distinct("donor");
    res.json(donors);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch donors" });
  }
});

// 📌 Get all volunteers (later when you create Volunteer model)
router.get("/volunteers", async (req, res) => {
  try {
    const volunteers = await User.find({ role: "volunteer" }).select("_id name email");
    res.json(volunteers);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch volunteers" });
  }
});

// 📩 List contact messages (latest first)
router.get("/contact-messages", async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    const [items, total] = await Promise.all([
      ContactMessage.find({}).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      ContactMessage.countDocuments({})
    ]);
    res.json({ items, total, page: Number(page), limit: Number(limit) });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch contact messages" });
  }
});


// Stats endpoint for admin dashboard
router.get("/stats", async (req, res) => {
  try {
    const [
      totalDonations,
      totalDonors,
      totalVolunteers,
      newDonationReq,
      totalAcceptedDonation,
      totalDonationDelivered,
    ] = await Promise.all([
      Donation.countDocuments({}),
      Donation.distinct("donor").then((arr) => arr.length),
      User.countDocuments({ role: "volunteer" }).catch(() => 0),
      Donation.countDocuments({ status: "pending" }),
      Donation.countDocuments({ status: "accepted" }),
      Donation.countDocuments({ status: "delivered" }),
    ]);

    res.json({
      totalDonations,
      totalDonors,
      totalVolunteers,
      newDonationReq,
      totalAcceptedDonation,
      totalDonationDelivered,
    });
  } catch (err) {
    console.error("/api/admin/stats error", err);
    res.status(500).json({ message: "Failed to load stats" });
  }
});

// Update donation status: accept, reject, deliver
router.patch("/donations/:id/status", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // pending|accepted|rejected|delivered
  if (!status) return res.status(400).json({ message: "status required" });
  try {
    const updated = await Donation.findByIdAndUpdate(id, { status }, { new: true });
    res.json(updated);
  } catch (e) {
    res.status(500).json({ message: "Failed to update status" });
  }
});

// Assign a volunteer for delivery/collection
router.patch("/donations/:id/assign", async (req, res) => {
  const { id } = req.params;
  const { volunteer, volunteerId, collectionAddress, deliveryAddress } = req.body;
  if (!volunteer && !volunteerId) return res.status(400).json({ message: "volunteer required" });
  try {
    let assignedValue = volunteer || "";
    if (volunteerId) {
      const v = await User.findById(volunteerId).select("name email role");
      if (!v || v.role !== 'volunteer') return res.status(400).json({ message: "Invalid volunteer" });
      // Use email as canonical assigned value (unique and matches volunteer feed by email)
      assignedValue = v.email || v.name;
    }

    const update = { assignedVolunteer: assignedValue };
    // store addresses if your schema allows; if not, harmlessly ignored by strict schema
    if (collectionAddress) update.collectionAddress = collectionAddress;
    if (deliveryAddress) update.deliveryAddress = deliveryAddress;
    // mark as assigned if not already
    update.status = 'assigned';

    const updated = await Donation.findByIdAndUpdate(id, update, { new: true });
    if (!updated) return res.status(404).json({ message: "Donation not found" });
    res.json(updated);
  } catch (e) {
    res.status(500).json({ message: "Failed to assign volunteer" });
  }
});

export default router;