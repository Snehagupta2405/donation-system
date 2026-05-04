import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/DonorLogin.css";
import { setAuth } from "../utils/auth";

const DonorLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [otpStep, setOtpStep] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) { alert(data.message || 'Login failed'); return; }
      if (data.otpRequired) {
        setOtpStep(true);
        alert(data.message || 'OTP sent to your email');
        return;
      }
      setAuth(data.token, data.user);
      navigate('/donor-dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp) { alert('Enter the OTP sent to your email'); return; }
    setLoading(true);
    try {
      const res = await fetch('/api/users/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp })
      });
      const data = await res.json();
      if (!res.ok) { alert(data.message || 'Invalid OTP'); return; }
      setAuth(data.token, data.user);
      navigate('/donor-dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAccount = () => {
    navigate("/register?role=donor");
  };

  return (
    <div className="login-container">
      <h2>Donor Login</h2>
      {!otpStep ? (
        <form onSubmit={handleSubmit} className="login-form">
          <label>Email</label>
          <input
            type="email"
            placeholder="Enter Donor Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="Enter Donor Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <div className="button-group">
            <button type="submit" className="login-btn" disabled={loading}>{loading ? 'Please wait...' : 'Login'}</button>
            <button
              type="button"
              className="create-account-btn"
              onClick={handleCreateAccount}
            >
              Create Account
            </button>
          </div>
        </form>
      ) : (
        <form onSubmit={handleVerifyOtp} className="login-form">
          <p>Enter the 6-digit OTP sent to <b>{email}</b>.</p>
          <label>OTP</label>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />
          <div className="button-group">
            <button type="submit" className="login-btn" disabled={loading}>{loading ? 'Verifying...' : 'Verify OTP'}</button>
            <button type="button" className="create-account-btn" onClick={() => setOtpStep(false)}>Back</button>
          </div>
        </form>
      )}
    </div>
  );
};

export default DonorLogin;

