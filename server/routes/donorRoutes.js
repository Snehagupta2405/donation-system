import express from "express";
import Donation from "../models/Donation.js";
import { authenticateToken, requireRole } from "../middleware/auth.js";

const router = express.Router();

// Protect all donor routes
router.use(authenticateToken, requireRole(["donor", "admin"]));

// GET /api/donor/stats?donor=Name
router.get("/stats", async (req, res) => {
  const donor = req.user?.name || req.user?.email;
  try {
    const [
      total,
      pending,
      accepted,
      delivered,
    ] = await Promise.all([
      Donation.countDocuments({ donor }),
      Donation.countDocuments({ donor, status: "pending" }),
      Donation.countDocuments({ donor, status: "accepted" }),
      Donation.countDocuments({ donor, status: "delivered" }),
    ]);
    res.json({ total, pending, accepted, delivered });
  } catch (e) {
    res.status(500).json({ message: "Failed to load donor stats" });
  }
});

// GET /api/donor/donations?donor=Name&status=pending|accepted|delivered
router.get("/donations", async (req, res) => {
  const donor = req.user?.name || req.user?.email;
  const { status } = req.query;
  const filter = { donor };
  if (status) filter.status = status;
  try {
    const items = await Donation.find(filter).sort({ date: -1 });
    res.json(items);
  } catch (e) {
    res.status(500).json({ message: "Failed to load donations" });
  }
});

export default router;



