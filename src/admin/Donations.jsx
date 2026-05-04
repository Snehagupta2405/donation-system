import React, { useEffect, useState } from "react";
import { authFetch } from "../utils/auth";

export default function Donations() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authFetch("/api/admin/donations")
      .then((res) => res.json())
      .then((data) => setDonations(data))
      .catch((err) => console.error("Error fetching donations:", err))
      .finally(() => setLoading(false));
  }, []);

  const refresh = () => {
    setLoading(true);
    authFetch("/api/admin/donations").then(r=>r.json()).then(setDonations).finally(()=>setLoading(false));
  };

  const updateStatus = async (id, status) => {
    await authFetch(`/api/admin/donations/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status })
    });
    refresh();
  };

  const gotoAssign = (id) => {
    window.location.href = `/admin/assign/${id}`;
  };

  if (loading) return <div>Loading donations...</div>;

  return (
    <div className="donations-page">
      <h2 className="title">📦 All Donations</h2>

      {donations.length === 0 ? (
        <p className="empty-msg">No donations found.</p>
      ) : (
        <table className="donations-table">
          <thead>
            <tr>
              <th>Donor</th>
              <th>Category</th>
              <th>Amount</th>
              <th>Collection Address</th>
              <th>Delivery Address</th>
              <th>Status</th>
              <th>Assigned Volunteer</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {donations.map((d, i) => (
              <tr key={i}>
                <td>{d.donor}</td>
                <td>{d.category}</td>
                <td>{d.amount || '-'}</td>
                <td>{d.collectionAddress || '-'}</td>
                <td>{d.deliveryAddress || '-'}</td>
                <td>
                  <span className={`status ${d.status || "pending"}`}>
                    {d.status || "pending"}
                  </span>
                </td>
                <td>{d.assignedVolunteer || '-'}</td>
                <td>
                  <div className="actions">
                    <button onClick={() => updateStatus(d._id, 'accepted')}>Accept</button>
                    <button onClick={() => updateStatus(d._id, 'rejected')}>Reject</button>
                    <button onClick={() => updateStatus(d._id, 'delivered')}>Mark Delivered</button>
                    <button onClick={() => gotoAssign(d._id)}>Assign</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* ✅ Inline CSS */}
      <style>{`
        .donations-page {
          padding: 20px;
          font-family: Arial, sans-serif;
        }

        .title {
          font-size: 24px;
          margin-bottom: 16px;
          color: #2c3e50;
        }

        .empty-msg {
          font-size: 16px;
          color: #7f8c8d;
        }

        .donations-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 12px;
        }

        .donations-table th,
        .donations-table td {
          padding: 12px 15px;
          border: 1px solid #ddd;
          text-align: left;
        }

        .donations-table th {
          background-color: #f4f6f7;
          font-weight: bold;
          color: #34495e;
        }

        .donations-table tr:hover {
          background-color: #f9f9f9;
        }

        .status {
          padding: 4px 10px;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 500;
          text-transform: capitalize;
        }

        .status.pending {
          background: #fff3cd;
          color: #856404;
        }

        .status.accepted {
          background: #d4edda;
          color: #155724;
        }

        .status.delivered {
          background: #cce5ff;
          color: #004085;
        }
        .actions{ display:flex; gap:6px; flex-wrap:wrap }
        .actions button{ padding:6px 8px; border-radius:6px; border:1px solid #e5e7eb; background:#fff; cursor:pointer }
        .actions button:hover{ background:#f3f4f6 }
      `}</style>
    </div>
  );
}
