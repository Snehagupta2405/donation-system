import express from "express";
import Donation from "../models/Donation.js";
import { authenticateToken, requireRole } from "../middleware/auth.js";

const router = express.Router();

// Protect all volunteer routes
router.use(authenticateToken, requireRole(["volunteer", "admin"]));

// Stats for volunteer dashboard (based on donation status)
router.get("/stats", async (req, res) => {
  const name = req.user?.name;
  const email = req.user?.email;
  const matchAssigned = {
    $or: [
      { assignedVolunteer: name },
      { assignedVolunteer: email },
    ],
  };
  try {
    const [pending, accepted, delivered] = await Promise.all([
      Donation.countDocuments({ ...matchAssigned, status: "pending" }),
      Donation.countDocuments({ ...matchAssigned, status: "accepted" }),
      Donation.countDocuments({ ...matchAssigned, status: "delivered" }),
    ]);
    res.json({
      newRequests: pending,
      totalReceived: accepted + delivered,
      totalNotReceived: pending,
      totalDelivered: delivered,
    });
  } catch (e) {
    res.status(500).json({ message: "Failed to load volunteer stats" });
  }
});

// List donations by status for volunteers' workflow
router.get("/collections", async (req, res) => {
  const { status } = req.query; // pending|accepted|delivered|assigned|collected|delivered
  const name = req.user?.name;
  const email = req.user?.email;
  const filter = { $or: [{ assignedVolunteer: name }, { assignedVolunteer: email }] };
  if (status) filter.status = status;
  try {
    const items = await Donation.find(filter).sort({ date: -1 });
    res.json(items);
  } catch (e) {
    res.status(500).json({ message: "Failed to load collections" });
  }
});

export default router;



