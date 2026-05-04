import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";

// Import all images properly
import DonorImage from "../assets/donor-icon.jpg";
import VolunteerImage from "../assets/volunteer-icon.jpg";
import AdminImage from "../assets/admin-icon.jpg";

function Login() {
  const navigate = useNavigate();

  return (
    <div className="login-page">
      <h1 className="login-title">Login As a ...</h1>
      <div className="card-container">
        {/* Donor Card */}
        <div className="login-card">
          <img src={DonorImage} alt="Donor" className="card-img" />
          <h2>Donor</h2>
          <p>Happiness doesn't result from what we get, but from what we give.</p>
          <button className="login-btn" onClick={() => navigate("/donor-login")}>
            Login as Donor »
          </button>
        </div>

        {/* Volunteer Card */}
        <div className="login-card">
          <img src={VolunteerImage} alt="Volunteer" className="card-img" />
          <h2>Volunteer</h2>
          <p>Volunteers do not necessarily have the time; they just have the heart.</p>
          <button className="login-btn" onClick={() => navigate("/volunteer-login")}>
            Login as Volunteer »
          </button>
        </div>

        {/* Admin Card */}
        <div className="login-card">
          <img src={AdminImage} alt="Admin" className="card-img" />
          <h2>Admin</h2>
          <p>
            A leader with strong management abilities helps the firm achieve its
            purpose and business goals.
          </p>
          <button className="login-btn" onClick={() => navigate("/admin-login")}>
            Login as Admin »
          </button>
        </div>
      </div>

      {/* Back Button */}
      <button className="back-btn" onClick={() => navigate("/")}>
        ← Back to Home
      </button>
    </div>
  );
}

export default Login;
