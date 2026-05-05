import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import donationRoutes from "./routes/donationRoutes.js";

import adminRoutes from "./routes/adminRoutes.js";
import donorRoutes from "./routes/donorRoutes.js";
import volunteerRoutes from "./routes/volunteerRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";


// Load env variables
dotenv.config();

// Connect to DB
connectDB();

const app = express();

// Middlewares
app.use(cors({
  origin: ["https://donation-system-z5hq.vercel.app", "http://localhost:3000"],
  credentials: true
}));
app.use(express.json());

app.use("/api/admin", adminRoutes);
app.use("/api/donor", donorRoutes);
app.use("/api/volunteer", volunteerRoutes);
app.use("/api/contact", contactRoutes);



// Routes
app.use("/api/users", userRoutes);
app.use("/api/donations", donationRoutes);

// Root route
app.get("/", (req, res) => {
    res.send("Donation Management System API is running 🚀");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});
