import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendOTPEmail } from "../utils/mailer.js";

// Register user (kept simple, optional role support via body)
export const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword, role: role || "donor" });
    
    // Generate JWT token for automatic login
    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET || "dev-secret", { expiresIn: "7d" });
    
    res.status(201).json({ 
      user: { _id: user._id, name: user.name, email: user.email, role: user.role },
      token
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get current user's profile
export const getMe = async (req, res) => {
  try {
    const userId = req.user?._id;
    const user = await User.findById(userId).select("-password -otpCode -otpExpires");
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.json(user);
  } catch (e) {
    res.status(500).json({ message: e.message || "Failed to load profile" });
  }
};

// Update current user's profile
export const updateMe = async (req, res) => {
  try {
    const userId = req.user?._id;
    const allowed = [
      'name','phone','address','city','state','country','zip','avatarUrl','bio'
    ];
    const updates = {};
    for (const k of allowed) if (k in req.body) updates[k] = req.body[k];
    const user = await User.findByIdAndUpdate(userId, updates, { new: true, runValidators: true })
      .select("-password -otpCode -otpExpires");
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.json({ ok: true, user });
  } catch (e) {
    res.status(500).json({ message: e.message || "Failed to update profile" });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ message: "Invalid credentials" });
    // For donor and volunteer, require OTP step
    if (["donor", "volunteer"].includes((user.role || '').toString().toLowerCase())) {
      // Generate 6-digit numeric OTP
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      user.otpCode = code;
      user.otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
      await user.save();
      try {
        await sendOTPEmail(user.email, code);
      } catch (e) {
        // Even if email fails, in dev we might have logged it
        console.error("Failed to send OTP email:", e?.message || e);
      }
      return res.json({ otpRequired: true, message: "OTP sent to your email" });
    }

    // For admin or other roles, issue token directly
    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET || "dev-secret", { expiresIn: "7d" });
    return res.json({
      user: { _id: user._id, name: user.name, email: user.email, role: user.role },
      token
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body || {};
  if (!email || !otp) return res.status(400).json({ message: "Email and OTP are required" });
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid email or OTP" });
    const now = new Date();
    if (!user.otpCode || !user.otpExpires || now > user.otpExpires) {
      return res.status(400).json({ message: "OTP is invalid or expired" });
    }
    if (String(otp).trim() !== String(user.otpCode)) {
      return res.status(400).json({ message: "Incorrect OTP" });
    }
    // Clear OTP fields
    user.otpCode = undefined;
    user.otpExpires = undefined;
    await user.save();

    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET || "dev-secret", { expiresIn: "7d" });
    return res.json({
      user: { _id: user._id, name: user.name, email: user.email, role: user.role },
      token
    });
  } catch (e) {
    return res.status(500).json({ message: e.message || "Failed to verify OTP" });
  }
};

// Change password (requires auth)
export const changePassword = async (req, res) => {
  try {
    const userId = req.user?._id;
    const { currentPassword, newPassword } = req.body || {};
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Current and new password are required" });
    }
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    const ok = await bcrypt.compare(currentPassword, user.password);
    if (!ok) return res.status(400).json({ message: "Current password is incorrect" });
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    return res.json({ ok: true, message: "Password updated successfully" });
  } catch (e) {
    res.status(500).json({ message: e.message || "Failed to change password" });
  }
};

