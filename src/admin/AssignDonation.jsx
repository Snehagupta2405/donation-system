import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { authFetch } from "../utils/auth";

export default function AssignDonation() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ volunteerId: "", collectionAddress: "", deliveryAddress: "" });
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const r = await authFetch("/api/admin/volunteers");
        const data = await r.json();
        setVolunteers(Array.isArray(data) ? data : []);
      } catch (e) {
        setError("Failed to load volunteers");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await authFetch(`/api/admin/donations/${id}/assign`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Assign failed");
      // go back to donations list
      navigate("/admin/donations");
    } catch (e) {
      setError(e.message);
    }
  };

  if (loading) return <div style={{ padding: 18 }}>Loading…</div>;

  return (
    <div style={{ padding: 18 }}>
      <h2 style={{ margin: 0, marginBottom: 12 }}>Assign Donation</h2>
      <form onSubmit={submit} style={{ maxWidth: 520, background: "#fff", padding: 16, borderRadius: 8 }}>
        {error && <div style={{ color: "#b91c1c", marginBottom: 10 }}>{error}</div>}
        <label style={{ display: 'block', marginBottom: 6, fontWeight: 700 }}>Volunteer</label>
        <select
          value={form.volunteerId}
          onChange={(e) => setForm({ ...form, volunteerId: e.target.value })}
          required
          style={{ width: '100%', padding: 10, border: '1px solid #e5e7eb', borderRadius: 8, marginBottom: 12 }}
        >
          <option value="">Select a volunteer</option>
          {volunteers.map((v) => (
            <option key={v._id} value={v._id}>{v.name} ({v.email})</option>
          ))}
        </select>

        <label style={{ display: 'block', marginBottom: 6, fontWeight: 700 }}>Collection Address</label>
        <input
          type="text"
          value={form.collectionAddress}
          onChange={(e) => setForm({ ...form, collectionAddress: e.target.value })}
          placeholder="Where the volunteer should collect the donation"
          required
          style={{ width: '100%', padding: 10, border: '1px solid #e5e7eb', borderRadius: 8, marginBottom: 12 }}
        />

        <label style={{ display: 'block', marginBottom: 6, fontWeight: 700 }}>Delivery Address</label>
        <input
          type="text"
          value={form.deliveryAddress}
          onChange={(e) => setForm({ ...form, deliveryAddress: e.target.value })}
          placeholder="Where the volunteer should deliver the donation"
          required
          style={{ width: '100%', padding: 10, border: '1px solid #e5e7eb', borderRadius: 8, marginBottom: 12 }}
        />

        <div style={{ display: 'flex', gap: 10 }}>
          <button type="submit" style={{ padding: '10px 16px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer' }}>Assign</button>
          <button type="button" onClick={() => navigate(-1)} style={{ padding: '10px 16px', background: '#6b7280', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer' }}>Cancel</button>
        </div>
      </form>
    </div>
  );
}





