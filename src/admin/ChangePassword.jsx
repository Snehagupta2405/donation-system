import React from "react";
import { authFetch, clearAuth } from "../utils/auth";
import { useNavigate } from "react-router-dom";
export default function ChangePassword() {
  const [form, setForm] = React.useState({ currentPassword: "", newPassword: "", confirm: "" });
  const [status, setStatus] = React.useState({ type: "idle", msg: "" });
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    if (form.newPassword !== form.confirm) {
      setStatus({ type: 'error', msg: 'New password and confirmation do not match.' });
      return;
    }
    setStatus({ type: 'loading', msg: 'Updating…' });
    try {
      const r = await authFetch('/api/users/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword: form.currentPassword, newPassword: form.newPassword })
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.message || 'Failed to update');
      setStatus({ type: 'success', msg: 'Password updated. Redirecting to login…' });
      // Force re-login with new password
      setTimeout(() => { clearAuth(); navigate('/admin-login'); }, 1000);
    } catch (e) {
      setStatus({ type: 'error', msg: e.message });
    }
  };

  const css = `
    .cp-wrap{min-height: calc(100vh - 72px); padding:24px 16px; display:flex; justify-content:center; align-items:center}
    .cp-card{width:100%; max-width:560px; background:#ffffff; color:#111827; border:1px solid #e5e7eb; border-radius:16px; padding:20px; box-shadow:0 10px 20px rgba(0,0,0,.08)}
    .cp-title{margin:0 0 8px; font-size:20px}
    .cp-sub{margin:0 0 12px; color:#6b7280; font-size:14px}
    .cp-form{display:grid; gap:12px}
    .cp-input{width:100%; height:44px; padding:10px 14px; border-radius:10px; border:1px solid #e5e7eb; background:#ffffff; color:#111827; box-sizing:border-box; font-size:14px; line-height:22px}
    .cp-input:focus{outline:none; border-color:#60a5fa; box-shadow:0 0 0 3px rgba(96,165,250,.25)}
    .cp-btn{padding:12px 16px; border:none; border-radius:10px; background:#3b82f6; color:#fff; font-weight:700; cursor:pointer}
    .cp-btn:hover{background:#2563eb}
    .cp-msg{font-size:14px}
    .cp-msg.err{color:#fecaca}
    .cp-msg.ok{color:#bbf7d0}
  `;

  return (
    <div className="cp-wrap">
      <style>{css}</style>
      <div className="cp-card">
        <h3 className="cp-title">Change Password</h3>
        <p className="cp-sub">Choose a strong password. You will be asked to log in again after updating.</p>
        <ul className="cp-rules" style={{marginTop:0, marginBottom:12, paddingLeft:18, color:'#6b7280'}}>
          <li>At least 8 characters</li>
          <li>Include a number</li>
          <li>Include a lowercase and uppercase letter</li>
          <li>Include a symbol (e.g., ! @ #)</li>
        </ul>
        <form onSubmit={submit} className="cp-form">
          <input className="cp-input" type="password" placeholder="Current Password" value={form.currentPassword} onChange={(e)=>setForm({ ...form, currentPassword:e.target.value })} required />
          <input className="cp-input" type="password" placeholder="New Password" value={form.newPassword} onChange={(e)=>setForm({ ...form, newPassword:e.target.value })} required />
          <input className="cp-input" type="password" placeholder="Confirm New Password" value={form.confirm} onChange={(e)=>setForm({ ...form, confirm:e.target.value })} required />
          {status.type !== 'idle' && (
            <div className={`cp-msg ${status.type==='error'?'err':'ok'}`}>{status.msg}</div>
          )}
          <button type="submit" className="cp-btn">Update Password</button>
        </form>
      </div>
    </div>
  );
}
