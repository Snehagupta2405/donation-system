import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import for navigation
import "../styles/VolunteerLogin.css"; // Using the same CSS as DonorLogin
import { setAuth } from "../utils/auth";

function VolunteerLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [otpStep, setOtpStep] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Initialize navigation

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
      navigate('/volunteer-dashboard');
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
      navigate('/volunteer-dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAccount = () => {
    // Send the user to the shared register page; optionally pass role hint
    navigate('/register?role=volunteer');
  };

  return (
    <div className="login-container">
      <h2>Volunteer Login</h2>
      {!otpStep ? (
        <form onSubmit={handleSubmit} className="login-form">
          <label>Email:</label>
          <input
            type="email"
            placeholder="Enter Volunteer Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label>Password:</label>
          <input
            type="password"
            placeholder="Enter Volunteer Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <div className="button-group">
            <button type="submit" className="login-btn" disabled={loading}>{loading ? 'Please wait...' : 'Login'}</button>
            <button type="button" className="create-account-btn" onClick={handleCreateAccount}>Create Account</button>
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
}

export default VolunteerLogin;

