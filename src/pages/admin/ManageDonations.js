import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authFetch } from "../../utils/auth";

function ManageDonations() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const res = await authFetch("/api/admin/donations");
      if (res.status === 401 || res.status === 403) {
        navigate("/admin-login");
        return;
      }
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load donations", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const onDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this donation?")) {
      try {
        const res = await authFetch(`/api/admin/donations/${id}`, { method: "DELETE" });
        if (res.status === 401 || res.status === 403) { navigate("/admin-login"); return; }
        if (res.ok) await load();
      } catch (err) {
        console.error("Failed to delete donation", err);
      }
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Manage Donations</h2>
      
      <div style={{ marginBottom: "20px" }}>
        <button 
          onClick={load} 
          style={{ 
            padding: "8px 16px", 
            backgroundColor: "#007bff", 
            color: "white", 
            border: "none", 
            borderRadius: "4px",
            cursor: "pointer"
          }}
        >
          Refresh
        </button>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", border: "1px solid #dee2e6" }}>
          <thead>
            <tr style={{ backgroundColor: "#f8f9fa" }}>
              <th style={{ padding: "12px", border: "1px solid #dee2e6", textAlign: "left" }}>Donor</th>
              <th style={{ padding: "12px", border: "1px solid #dee2e6", textAlign: "left" }}>Category</th>
              <th style={{ padding: "12px", border: "1px solid #dee2e6", textAlign: "left" }}>Amount</th>
              <th style={{ padding: "12px", border: "1px solid #dee2e6", textAlign: "left" }}>Message</th>
              <th style={{ padding: "12px", border: "1px solid #dee2e6", textAlign: "left" }}>Date</th>
              <th style={{ padding: "12px", border: "1px solid #dee2e6", textAlign: "left" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((d) => (
              <tr key={d._id}>
                <td style={{ padding: "12px", border: "1px solid #dee2e6" }}>
                  {typeof d.donor === 'object' ? d.donor.name || d.donor.email : d.donor}
                </td>
                <td style={{ padding: "12px", border: "1px solid #dee2e6" }}>{String(d.category ?? "-")}</td>
                <td style={{ padding: "12px", border: "1px solid #dee2e6" }}>
                  {typeof d.amount === 'number' ? `$${d.amount}` : "N/A"}
                </td>
                <td style={{ padding: "12px", border: "1px solid #dee2e6" }}>{String(d.message ?? "-")}</td>
                <td style={{ padding: "12px", border: "1px solid #dee2e6" }}>
                  {d.date ? new Date(d.date).toLocaleDateString() : '-'}
                </td>
                <td style={{ padding: "12px", border: "1px solid #dee2e6" }}>
                  <button 
                    onClick={() => onDelete(d._id)}
                    style={{ 
                      padding: "4px 8px", 
                      backgroundColor: "#dc3545", 
                      color: "white", 
                      border: "none", 
                      borderRadius: "3px",
                      cursor: "pointer"
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ManageDonations;