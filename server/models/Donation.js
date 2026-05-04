import mongoose from "mongoose";

const donationSchema = new mongoose.Schema({
  donor: {
    type: String, // Donor name
    required: true,
    trim: true,
  },
  category: {
    type: String,
    required: true,
    enum: ["clothes", "food", "books", "money", "toys", "others", "delivery"], // Added 'delivery'
  },
  amount: {
    type: Number,
    min: 1,
    required: function () {
      return this.category === "money"; // Only required if donation type is money
    },
  },
  message: {
    type: String,
    trim: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  // in models/Donation.js fields:
  status: { type: String, enum: ["pending","accepted","rejected","assigned","collected","delivered","not_received"], default: "pending" },
  assignedVolunteer: { type: String, trim: true },
  // addresses for collection and delivery
  collectionAddress: { type: String, trim: true },
  deliveryAddress: { type: String, trim: true },
  // volunteer workflow metadata
  volunteerNotes: { type: String, trim: true },
  collectionDate: { type: Date },
  deliveryDate: { type: Date },

});

export default mongoose.model("Donation", donationSchema);
