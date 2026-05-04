import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authFetch, getUser } from "../../utils/auth";

export default function VolunteerDashboard() {
  const navigate = useNavigate();
  const current = getUser();
  const volunteerName = current?.name || "Volunteer";

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
  const [filter, setFilter] = useState("assigned");

  const prevIdsRef = useRef(new Set());

  // initial load + polling to get assignment updates
  useEffect(() => {
    let isMounted = true;
    const fetchNow = async () => {
      try {
        const r = await authFetch("/api/donations/volunteer");
        const data = await r.json();
        const list = Array.isArray(data) ? data : [];
        if (!isMounted) return;
        // detect newly assigned donations
        const currentIds = new Set(list.map((d) => d._id));
        const prevIds = prevIdsRef.current;
        const newOnes = list.filter((d) => !prevIds.has(d._id) && d.status === 'assigned');
        if (newOnes.length > 0) {
          const count = newOnes.length;
          // basic notification
          try {
            if (Notification && Notification.permission === 'granted') {
              new Notification('New assignment', { body: `${count} new donation${count>1?'s':''} assigned to you.` });
            } else if (Notification && Notification.permission !== 'denied') {
              Notification.requestPermission();
            }
          } catch {}
          alert(`${count} new donation${count>1?'s':''} assigned to you.`);
        }
        prevIdsRef.current = currentIds;
        setItems(list);
      } catch {
        if (!isMounted) return;
        setItems([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    setLoading(true);
    fetchNow();
    const id = setInterval(fetchNow, 15000); // poll every 15s
    return () => { isMounted = false; clearInterval(id); };
  }, [volunteerName]);

  const stats = useMemo(() => {
    const newReq = items.filter((d) => d.status === "assigned").length;
    const received = items.filter((d) => d.status === "collected").length;
    const notReceived = items.filter((d) => d.status === "assigned").length;
    const delivered = items.filter((d) => d.status === "delivered").length;
    return { newReq, received, notReceived, delivered };
  }, [items]);

  const rows = useMemo(() => {
    if (filter === "all") return items;
    return items.filter((d) => d.status === filter);
  }, [items, filter]);

  const updateStatus = async (id, status) => {
    try {
      const r = await authFetch(`/api/donations/volunteer/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.message || 'Update failed');
      // refresh list quickly
      setItems((prev) => prev.map((d) => d._id === id ? data : d));
    } catch (e) {
      alert(e.message || 'Failed to update');
    }
  };

  const logout = () => {
    localStorage.removeItem("volunteerName");
    navigate("/");
  };

  if (loading) return <div style={{ padding: 20 }}>Loading…</div>;

  const cards = [
    { title: "New Donation Collection Req.", value: stats.newReq, filter: "assigned" },
    { title: "Total Donation Received", value: stats.received, filter: "collected" },
    { title: "Total Donation NotReceived", value: stats.notReceived, filter: "assigned" },
    { title: "Total Donation Delivered", value: stats.delivered, filter: "delivered" },
  ];

  return (
    <div className={`vol-shell ${collapsed ? "collapsed" : ""}`}>
      <style>{css}</style>
      <aside className="sidebar">
        <div className="brand">
          <div className="avatar">V</div>
          <div>
            <div className="brand-title">DONATION MANAGEMENT</div>
            <div className="brand-sub">{volunteerName}</div>
          </div>
        </div>
        <nav className="nav">
          <button className="nav-link" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Dashboard</button>
          <button className="nav-link" onClick={() => setFilter('assigned')}>Donation Collection Req.</button>
          <button className="nav-link" onClick={() => document.getElementById('history')?.scrollIntoView({ behavior: 'smooth' })}>Collection History</button>
          <button className="nav-link" onClick={() => navigate('/volunteer-profile')}>Profile</button>
          <button className="nav-link" onClick={() => navigate('/volunteer-change-password')}>Change Password</button>
        </nav>
        <button className="logout" onClick={logout}>Logout</button>
      </aside>

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
                <button className="card-link" onClick={() => setFilter(c.filter)}>View Details &gt;&gt;</button>
              </div>
            ))}
          </div>

          <div id="history" className="history">
            <div className="history-title">Collection History ({filter})</div>
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Donor</th>
                    <th>Category</th>
                    <th>Collection Address</th>
                    <th>Delivery Address</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.length === 0 && (
                    <tr><td colSpan={6} style={{ textAlign: 'center', color: '#6b7280' }}>No records</td></tr>
                  )}
                  {rows.map((d) => (
                    <tr key={d._id}>
                      <td>{d.date ? new Date(d.date).toLocaleDateString() : '-'}</td>
                      <td>{typeof d.donor === 'object' ? d.donor.name || d.donor.email : (d.donor || '-')}</td>
                      <td>{d.category}</td>
                      <td>{d.collectionAddress || '-'}</td>
                      <td>{d.deliveryAddress || '-'}</td>
                      <td style={{ textTransform: 'capitalize' }}>
                        {d.status || 'assigned'}
                        <div style={{ display:'flex', gap:6, marginTop:6 }}>
                          {d.status === 'assigned' && (
                            <button onClick={() => updateStatus(d._id, 'collected')} style={{ padding:'4px 8px' }}>Mark Collected</button>
                          )}
                          {d.status !== 'delivered' && (
                            <button onClick={() => updateStatus(d._id, 'delivered')} style={{ padding:'4px 8px' }}>Mark Delivered</button>
                          )}
                          {d.status === 'assigned' && (
                            <button onClick={() => updateStatus(d._id, 'not_received')} style={{ padding:'4px 8px' }}>Not Received</button>
                          )}
                        </div>
                      </td>
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
.vol-shell{display:flex; min-height:100vh; background: linear-gradient(135deg,#c7e5ff,#8db2ff,#1e3aff)}
.sidebar{width:260px; background:#ffe8e8; box-shadow:2px 0 12px rgba(0,0,0,.06); display:flex; flex-direction:column; overflow:hidden; transition: width 240ms ease}
.vol-shell.collapsed .sidebar{width:78px}
.brand{display:flex; gap:12px; align-items:center; padding:16px; border-bottom:1px solid #ffd2d2}
.avatar{width:42px; height:42px; border-radius:50%; background:#fff3d6; display:grid; place-items:center; font-weight:700; color:#f97316}
.brand-title{font-size:12px; color:#ef4444; font-weight:800}
.brand-sub{font-size:12px; color:#6b7280}
.nav{padding:10px}
.nav-link{display:block; width:100%; text-align:left; background:#ffe8e8; border:none; padding:10px 12px; margin:4px 8px; border-radius:8px; cursor:pointer; color:#047857; white-space:nowrap}
.nav-link:hover{background:#ffdcdc}
.logout{margin-top:auto; background:#fff; border-top:1px solid #ffd2d2; padding:12px 16px; color:#ef4444; font-weight:700; cursor:pointer}
.main{flex:1; display:flex; flex-direction:column}
.topbar{padding:14px}
.toggle{background:#fff; color:#ef4444; border:none; padding:10px 14px; border-radius:10px; font-weight:700; box-shadow:0 8px 24px rgba(0,0,0,.12); cursor:pointer}
.content{padding:18px}
.card-grid{display:grid; grid-template-columns:repeat(auto-fill,minmax(280px,1fr)); gap:18px}
.card{background:#fff; border-radius:8px; box-shadow:0 10px 24px rgba(0,0,0,.12); padding:14px}
.card-header{color:#059669; font-size:18px; font-weight:800; margin-bottom:8px}
.card-value{font-size:22px; font-weight:800; color:#000; margin-bottom:8px}
.card-link{background:none; border:none; color:#2563eb; cursor:pointer; font-weight:600}
.history{margin-top:22px}
.history-title{font-weight:800; margin:10px 0}
.table-wrap{background:#fff; border-radius:10px; overflow:auto}
.table{width:100%; border-collapse:collapse}
.table th,.table td{padding:12px 14px; border-bottom:1px solid #e5e7eb; text-align:left}
.table th{background:#f5f7fb; color:#6b7280; font-size:14px}
`;


