import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export default function DonorDonations() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const donor = localStorage.getItem("donorName") || "";
  const { search } = useLocation();

  useEffect(() => {
    const status = new URLSearchParams(search).get("status") || "";
    const qs = new URLSearchParams({ donor, ...(status && { status }) }).toString();
    fetch(`/api/donor/donations?${qs}`)
      .then(r => r.json())
      .then(setItems)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [search, donor]);

  return (
    <div style={{ padding: 16 }}>
      <h2>My Donations</h2>
      {loading ? (
        <div>Loading...</div>
      ) : items.length === 0 ? (
        <div>No donations found.</div>
      ) : (
        <table className="table" style={{ width: "100%", background: "#fff" }}>
          <thead>
            <tr>
              <th>Date</th>
              <th>Category</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Collection Address</th>
              <th>Delivery Address</th>
              <th>Message</th>
            </tr>
          </thead>
          <tbody>
            {items.map((d) => (
              <tr key={d._id}>
                <td>{new Date(d.date).toLocaleString()}</td>
                <td>{d.category}</td>
                <td>{d.amount ?? "-"}</td>
                <td>{d.status}</td>
                <td>{d.collectionAddress || "-"}</td>
                <td>{d.deliveryAddress || "-"}</td>
                <td>{d.message || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}



