import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin", "donor", "volunteer"], default: "donor" },
    // Profile fields
    phone: { type: String },
    address: { type: String },
    city: { type: String },
    state: { type: String },
    country: { type: String },
    zip: { type: String },
    avatarUrl: { type: String },
    bio: { type: String },
    // OTP fields for 2-step login
    otpCode: { type: String },
    otpExpires: { type: Date }
}, {
    timestamps: true
});

export default mongoose.model("User", userSchema);
