import express from "express";
import { registerUser, loginUser, changePassword, verifyOtp, getMe, updateMe } from "../controllers/userController.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/verify-otp", verifyOtp);
router.post("/change-password", authenticateToken, changePassword);
router.get("/me", authenticateToken, getMe);
router.put("/me", authenticateToken, updateMe);

export default router;
