import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { authFetch } from "../utils/auth";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authFetch("/api/admin/stats")
      .then((r) => r.json())
      .then((data) => setStats(data))
      .catch((e) => console.error("Stats error:", e))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading…</div>;
  if (!stats) return <div>Could not load stats.</div>;

  const cards = [
    { title: "Total Donations", value: stats.totalDonations, link: "/admin/donations" },
    { title: "Total Donors", value: stats.totalDonors, link: "/admin/donors" },
    { title: "Total Volunteers", value: stats.totalVolunteers, link: "/admin/volunteers" },
    { title: "New Donation Requests", value: stats.newDonationReq, link: "/admin/manage-donations?status=pending" },
    { title: "Accepted Donations", value: stats.totalAcceptedDonation, link: "/admin/manage-donations?status=accepted" },
    { title: "Delivered Donations", value: stats.totalDonationDelivered, link: "/admin/manage-donations?status=delivered" },
  ];

  return (
    <div style={{ padding: 18 }}>
      <h2 style={{ margin: 0, marginBottom: 12 }}>Admin Dashboard</h2>
      <div className="card-grid">
        {cards.map((c) => (
          <div className="card" key={c.title}>
            <div className="card-title">{c.title}</div>
            <div className="card-value">{c.value}</div>
            <Link className="card-link" to={c.link}>View Details &gt;&gt;</Link>
          </div>
        ))}
      </div>
    </div>
  );
}