import React, { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { FaBars, FaSignOutAlt } from "react-icons/fa";

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  return (
    <div className={`admin-shell ${collapsed ? "collapsed" : ""}`}>
      {/* inject styles once */}
      <style>{css}</style>

      {/* Sidebar */}
      <aside className="sidebar">
        <div className="brand">
          <div className="avatar">A</div>
          <div>
            <div className="brand-title">Donation Management</div>
            <div className="brand-sub">Admin</div>
          </div>
        </div>

        <nav className="nav">
          <NavLink end to="/admin" className="nav-link">
            Dashboard
          </NavLink>

          <div className="nav-section">Donation Management</div>
          <NavLink to="/admin/donations" className="nav-link">
            Donations
          </NavLink>

          <div className="nav-section">Manage</div>
          <NavLink to="/admin/donors" className="nav-link">
            Donors
          </NavLink>
          <NavLink to="/admin/volunteers" className="nav-link">
            Volunteers
          </NavLink>


          <div className="nav-section">Account</div>
          <NavLink to="/admin/profile" className="nav-link">
            Profile
          </NavLink>
          <NavLink to="/admin/change-password" className="nav-link">
            Change Password
          </NavLink>
        </nav>

        <button className="logout" onClick={() => navigate("/")}>
          <FaSignOutAlt />
          <span>Logout</span>
        </button>
      </aside>

      {/* Main */}
      <main className="main">
        <header className="topbar">
          <button className="toggle" onClick={() => setCollapsed(!collapsed)}>
            <FaBars /> <span>Toggle</span>
          </button>
        </header>

        <section className="content">
          <Outlet />
        </section>
      </main>
    </div>
  );
}

const css = `
.admin-shell{
  display:flex;
  min-height:100vh;
  background: linear-gradient(135deg,#c7e5ff,#8db2ff,#1e3aff);
  overflow:hidden;
  font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
}
.sidebar{
  width:260px;
  background:#fff;
  box-shadow: 2px 0 12px rgba(0,0,0,.08);
  display:flex; flex-direction:column;
  overflow:hidden;
  transition: width 240ms ease;
}
.admin-shell.collapsed .sidebar{ width: 78px; }
.admin-shell.collapsed .brand-title,
.admin-shell.collapsed .brand-sub,
.admin-shell.collapsed .nav-section,
.admin-shell.collapsed .logout span { display:none; }
.brand{display:flex; align-items:center; gap:12px; padding:16px; border-bottom:1px solid #eef2f7;}
.avatar{width:42px; height:42px; border-radius:50%; background:#e9efff; color:#4f46e5; font-weight:700; display:grid; place-items:center;}
.brand-title{font-weight:700; font-size:14px; color:#111827;}
.brand-sub{font-size:12px; color:#6b7280;}
.nav{padding:12px}
.nav-section{padding:14px 12px 6px; font-size:12px; color:#9aa3af; text-transform:uppercase;}
.nav-link{
  display:block; padding:10px 12px; margin:4px 8px; border-radius:8px; color:#111827; text-decoration:none;
}
.nav-link:hover{ background:#f3f4f6; }
.nav-link.active{ background:#eef2ff; color:#4338ca; font-weight:600; }

.logout{
  margin-top:auto; display:flex; align-items:center; gap:10px;
  background:#fff; border-top:1px solid #eef2f7; padding:12px 16px; color:#dc2626; font-weight:600; cursor:pointer;
}
.logout:hover{ background:#fef2f2; }

.main{flex:1; display:flex; flex-direction:column;}
.topbar{display:flex; justify-content:flex-start; align-items:center; padding:14px; color:#fff;}
.toggle{
  background:#fff; color:#6d28d9; border:none; padding:10px 14px; border-radius:10px; font-weight:700; display:flex; align-items:center; gap:10px; cursor:pointer;
  box-shadow:0 8px 24px rgba(0,0,0,.12);
}
.content{padding:18px; color:#fff}
.card-grid{
  display:grid;
  grid-template-columns: repeat(auto-fill,minmax(260px,1fr));
  gap:16px;
}
.card{
  background:#111827; color:#fff; border-radius:12px; padding:16px;
  box-shadow: 0 10px 24px rgba(0,0,0,.25);
}
.card-title{font-size:18px; font-weight:700; margin-bottom:10px;}
.card-value{font-size:28px; font-weight:800; margin-bottom:12px;}
.card-link{ color:#f59e0b; font-size:14px; text-decoration:none;}
.card-link:hover{ text-decoration:underline; }
.table{
  width:100%; background:#fff; color:#111827; border-radius:12px; overflow:hidden;
}
.table th, .table td{ padding:12px 14px; border-bottom:1px solid #e5e7eb; }
.table th{ background:#f9fafb; text-align:left; font-size:14px; color:#6b7280; }
`;
