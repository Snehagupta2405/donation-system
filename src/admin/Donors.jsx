import React, { useEffect, useState } from "react";
import { authFetch } from "../utils/auth";

export default function Donors() {
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authFetch("/api/admin/donors")
      .then((res) => res.json())
      .then((data) => setDonors(data))
      .catch((err) => console.error("Error fetching donors:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading donors...</div>;

  return (
    <div className="donors-page">
      <h2 className="title">🤝 All Donors</h2>

      {donors.length === 0 ? (
        <p className="empty-msg">No donors found.</p>
      ) : (
        <table className="donors-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Donor Name</th>
            </tr>
          </thead>
          <tbody>
            {donors.map((d, i) => (
              <tr key={i}>
                <td>{i + 1}</td>
                <td>{d}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* ✅ Inline CSS */}
      <style>{`
        .donors-page {
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

        .donors-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 12px;
        }

        .donors-table th,
        .donors-table td {
          padding: 12px 15px;
          border: 1px solid #ddd;
          text-align: left;
        }

        .donors-table th {
          background-color: #f4f6f7;
          font-weight: bold;
          color: #34495e;
        }

        .donors-table tr:hover {
          background-color: #f9f9f9;
        }
      `}</style>
    </div>
  );
}
