import React, { useEffect, useState } from "react";
import { authFetch } from "../utils/auth";

export default function Volunteers() {
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authFetch("/api/admin/volunteers")
      .then((res) => res.json())
      .then((data) => setVolunteers(data))
      .catch((err) => console.error("Error fetching volunteers:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading volunteers...</div>;

  return (
    <div className="volunteers-page">
      <h2 className="title">🙌 All Volunteers</h2>

      {volunteers.length === 0 ? (
        <p className="empty-msg">No volunteers found.</p>
      ) : (
        <table className="volunteers-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Volunteer Name</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {volunteers.map((v, i) => {
              const isObj = typeof v === 'object' && v !== null;
              const name = isObj ? (v.name || '-') : String(v ?? '-');
              const email = isObj ? (v.email || '-') : '-';
              const key = isObj && v._id ? v._id : i;
              return (
                <tr key={key}>
                  <td>{i + 1}</td>
                  <td>{name}</td>
                  <td>{email}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      {/* ✅ Inline CSS */}
      <style>{`
        .volunteers-page {
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

        .volunteers-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 12px;
        }

        .volunteers-table th,
        .volunteers-table td {
          padding: 12px 15px;
          border: 1px solid #ddd;
          text-align: left;
        }

        .volunteers-table th {
          background-color: #f4f6f7;
          font-weight: bold;
          color: #34495e;
        }

        .volunteers-table tr:hover {
          background-color: #f9f9f9;
        }
      `}</style>
    </div>
  );
}
