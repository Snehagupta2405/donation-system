import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authFetch, getUser } from "../../utils/auth";

export default function DonorDashboard() {
  const navigate = useNavigate();
  const current = getUser();
  const donorName = current?.name || "Donor";

  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
  const [detailsFilter, setDetailsFilter] = useState("all");

  useEffect(() => {
    setLoading(true);
    authFetch("/api/donations/donor")
      .then(async (r) => { const d = await r.json(); return r.ok ? d : []; })
      .then((data) => {
        setDonations(Array.isArray(data) ? data : []);
      })
      .catch(() => setDonations([]))
      .finally(() => setLoading(false));
  }, [donorName]);

  const stats = useMemo(() => {
    const total = donations.length;
    const accepted = donations.filter((d) => d.status === "accepted").length;
    const rejected = donations.filter((d) => d.status === "rejected").length;
    const pending = donations.filter((d) => d.status === "pending").length;
    const delivered = donations.filter((d) => d.status === "delivered").length;
    return { total, accepted, rejected, pending, delivered };
  }, [donations]);

  const visibleRows = useMemo(() => {
    if (detailsFilter === "all") return donations;
    return donations.filter((d) => d.status === detailsFilter);
  }, [donations, detailsFilter]);

  const logout = () => {
    localStorage.removeItem("donorName");
    navigate("/");
  };

  if (loading) return <div style={{ padding: 20 }}>Loading…</div>;

  const cards = [
    { title: "My Total Donations", value: stats.total, filter: "all" },
    { title: "My Accepted Donations", value: stats.accepted, filter: "accepted" },
    { title: "My Rejected Donations", value: stats.rejected, filter: "rejected" },
    { title: "My Pending Donations", value: stats.pending, filter: "pending" },
    { title: "My Successfully Delivered Donations 😊", value: stats.delivered, filter: "delivered" },
  ];

  return (
    <div className={`donor-shell ${collapsed ? "collapsed" : ""}`}>
      <style>{css}</style>

      {/* Sidebar */}
      <aside className="sidebar">
        <div className="brand">
          <div className="avatar">D</div>
          <div>
            <div className="brand-title">DONATION MANAGEMENT</div>
            <div className="brand-sub">{donorName}</div>
          </div>
        </div>

        <nav className="nav">
          <button className="nav-link" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Dashboard</button>
          <button className="nav-link" onClick={() => navigate('/donate')}>Donate Now</button>
          <button className="nav-link" onClick={() => document.getElementById('history')?.scrollIntoView({ behavior: 'smooth' })}>Donation History</button>
          <button className="nav-link" onClick={() => navigate('/donor-profile')}>Profile</button>
          <button className="nav-link" onClick={() => navigate('/donor-change-password')}>Change Password</button>
        </nav>

        <button className="logout" onClick={logout}>Logout</button>
      </aside>

      {/* Main */}
      <main className="main">
        <header className="topbar">
          <button className="toggle" onClick={() => setCollapsed((v) => !v)}>☰ TOGGLE</button>
        </header>

        <section className="content">
          <div className="card-grid">
            {cards.map((c) => (
              <div className="card" key={c.title}>
                <div className="card-header">{c.title}</div>
                <div className="card-value">{c.value}</div>
                <button className="card-link" onClick={() => setDetailsFilter(c.filter)}>View Details &gt;&gt;</button>
              </div>
            ))}
          </div>

          {/* Details Table */}
          <div id="history" className="history">
            <div className="history-title">Donation History ({detailsFilter})</div>
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Category</th>
                    <th>Amount</th>
                    <th>Collection Address</th>
                    <th>Delivery Address</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleRows.length === 0 && (
                    <tr><td colSpan={6} style={{ textAlign: 'center', color: '#6b7280' }}>No records</td></tr>
                  )}
                  {visibleRows.map((d) => (
                    <tr key={d._id}>
                      <td>{d.date ? new Date(d.date).toLocaleDateString() : '-'}</td>
                      <td>{d.category}</td>
                      <td>{d.amount || '-'}</td>
                      <td>{d.collectionAddress || '-'}</td>
                      <td>{d.deliveryAddress || '-'}</td>
                      <td style={{ textTransform: 'capitalize' }}>{d.status || 'pending'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

const css = `
.donor-shell{display:flex; min-height:100vh; background: linear-gradient(135deg,#c7e5ff,#8db2ff,#1e3aff);}
.sidebar{width:260px; background:#eafff1; box-shadow:2px 0 12px rgba(0,0,0,.06); display:flex; flex-direction:column; overflow:hidden; transition: width 240ms ease}
.donor-shell.collapsed .sidebar{width:78px}
.brand{display:flex; gap:12px; align-items:center; padding:16px; border-bottom:1px solid #e5f3ea}
.avatar{width:42px; height:42px; border-radius:50%; background:#fff3d6; display:grid; place-items:center; font-weight:700; color:#ef4444}
.brand-title{font-size:12px; color:#ef4444; font-weight:800}
.brand-sub{font-size:12px; color:#6b7280}
.nav{padding:10px}
.nav-link{display:block; width:100%; text-align:left; background:#eafff1; border:none; padding:10px 12px; margin:4px 8px; border-radius:8px; cursor:pointer; color:#0f766e; white-space:nowrap}
.nav-link:hover{background:#d9ffe7}
.logout{margin-top:auto; background:#fff; border-top:1px solid #e5f3ea; padding:12px 16px; color:#ef4444; font-weight:700; cursor:pointer}
.main{flex:1; display:flex; flex-direction:column}
.topbar{padding:14px}
.toggle{background:#fff; color:#0ea5e9; border:none; padding:10px 14px; border-radius:10px; font-weight:700; box-shadow:0 8px 24px rgba(0,0,0,.12); cursor:pointer}
.content{padding:18px}
.card-grid{display:grid; grid-template-columns:repeat(auto-fill,minmax(280px,1fr)); gap:18px}
.card{background:#fff; border-radius:8px; box-shadow:0 10px 24px rgba(0,0,0,.12); padding:14px}
.card-header{color:#0ea5e9; font-size:18px; font-weight:800; margin-bottom:8px}
.card-value{font-size:22px; font-weight:800; color:#000; margin-bottom:8px}
.card-link{background:none; border:none; color:#ef476f; cursor:pointer; font-weight:600}
.history{margin-top:22px}
.history-title{font-weight:800; margin:10px 0}
.table-wrap{background:#fff; border-radius:10px; overflow:auto}
.table{width:100%; border-collapse:collapse}
.table th,.table td{padding:12px 14px; border-bottom:1px solid #e5e7eb; text-align:left}
.table th{background:#f5f7fb; color:#6b7280; font-size:14px}
`;


