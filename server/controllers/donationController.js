import Donation from "../models/Donation.js";

// Create donation
export const createDonation = async (req, res) => {
    const { donor, category, amount, message } = req.body;
    try {
        const donation = await Donation.create({ donor, category, amount, message });
        res.status(201).json(donation);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all donations
export const getAllDonations = async (req, res) => {
    try {
        const donations = await Donation.find({});
        res.json(donations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};