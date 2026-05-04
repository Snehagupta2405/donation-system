import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function DonorDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ total: 0, pending: 0, accepted: 0, delivered: 0 });
  const [loading, setLoading] = useState(true);

  const donor = localStorage.getItem("donorName") || "";

  useEffect(() => {
    if (!donor) {
      navigate("/donor-login");
      return;
    }
    fetch(`/api/donor/stats?donor=${encodeURIComponent(donor)}`)
      .then(r => r.json())
      .then(data => setStats(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [donor, navigate]);

  const cards = [
    { title: "My Total Donations", value: stats.total, to: "/donor/donations" },
    { title: "My Accepted Donations", value: stats.accepted, to: "/donor/donations?status=accepted" },
    { title: "My Rejected Donations", value: 0, to: "/donor/donations?status=rejected" },
    { title: "My Pending Donations", value: stats.pending, to: "/donor/donations?status=pending" },
    { title: "My Successfully Delivered Donations", value: stats.delivered, to: "/donor/donations?status=delivered" },
  ];

  return (
    <div className="donor-shell">
      <aside className="donor-sidebar">
        <div className="brand">DONATION MANAGEMENT SYSTEM</div>
        <div className="profile">
          <div className="avatar">D</div>
          <div>
            <div className="name">Donor</div>
            <div className="sub">{donor}</div>
          </div>
        </div>
        <nav className="nav">
          <button className="nav-link active" onClick={() => navigate("/donor-dashboard")}>Dashboard</button>
          <button className="nav-link" onClick={() => navigate("/donate")}>Donate Now</button>
          <button className="nav-link" onClick={() => navigate("/donor/donations")}>Donation History</button>
          <button className="nav-link" onClick={() => alert("Profile coming soon")}>Profile</button>
          <button className="nav-link" onClick={() => alert("Change password coming soon")}>Change Password</button>
          <button className="nav-link" onClick={() => { localStorage.removeItem("donorName"); navigate("/"); }}>Logout</button>
        </nav>
      </aside>

      <main className="donor-main">
        <div className="top">
          <button className="toggle" onClick={() => { /* could add collapse */ }}>☰ TOGGLE</button>
        </div>
        <div className="grid">
          {cards.map(c => (
            <button key={c.title} className="card" onClick={() => navigate(c.to)}>
              <div className="card-title">{c.title}</div>
              <div className="card-value">{loading ? "0" : c.value}</div>
              <div className="card-link">View Details &gt;&gt;</div>
            </button>
          ))}
        </div>
      </main>

      <style>{`
      .donor-shell{display:grid;grid-template-columns:260px 1fr;min-height:100vh;background:linear-gradient(120deg,#7c3aed,#2563eb);}
      .donor-sidebar{background:#eafff0;display:flex;flex-direction:column;padding:16px;gap:12px}
      .brand{font-weight:800;color:#b91c1c;font-size:12px;letter-spacing:.6px}
      .profile{display:flex;gap:12px;align-items:center;padding:8px 0}
      .avatar{width:44px;height:44px;border-radius:50%;background:#fde68a;display:grid;place-items:center;font-weight:800}
      .name{font-weight:700}
      .sub{color:#64748b;font-size:12px}
      .nav{display:grid;gap:8px;margin-top:8px}
      .nav-link{display:flex;gap:8px;align-items:center;background:#fff;border:none;border-radius:8px;padding:10px 12px;text-align:left;cursor:pointer}
      .nav-link.active,.nav-link:hover{background:#d1fae5}
      .donor-main{padding:18px;color:#fff}
      .top{margin-bottom:12px}
      .toggle{background:#fff;border:none;border-radius:999px;padding:8px 14px;font-weight:700}
      .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:16px}
      .card{background:#fff;color:#0f172a;border:none;border-radius:12px;padding:16px;text-align:left;cursor:pointer}
      .card-title{color:#0ea5e9;font-size:18px;font-weight:800}
      .card-value{margin-top:8px}
      .card-link{margin-top:12px;color:#ef4444}
      `}</style>
    </div>
  );
}



