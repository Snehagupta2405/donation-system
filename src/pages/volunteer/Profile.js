import React from "react";
import { authFetch, getUser } from "../../utils/auth";

export default function VolunteerProfile() {
  const [form, setForm] = React.useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    country: "",
    zip: "",
    avatarUrl: "",
    bio: "",
  });
  const [status, setStatus] = React.useState({ type: "idle", msg: "" });

  React.useEffect(() => {
    let mounted = true;
    authFetch("/api/users/me")
      .then(async (r) => {
        const data = await r.json();
        if (!r.ok) throw new Error(data.message || "Failed to load profile");
        if (!mounted) return;
        setForm((f) => ({ ...f, ...data }));
      })
      .catch((e) => setStatus({ type: "error", msg: e.message }));
    return () => { mounted = false; };
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setStatus({ type: "loading", msg: "Saving..." });
    try {
      const r = await authFetch("/api/users/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          address: form.address,
          city: form.city,
          state: form.state,
          country: form.country,
          zip: form.zip,
          avatarUrl: form.avatarUrl,
          bio: form.bio,
        }),
      });
      const data = await r.json();
      if (!r.ok || !data?.user) throw new Error(data.message || "Failed to save");
      try {
        const existing = getUser();
        const updated = { ...(existing || {}), ...data.user };
        localStorage.setItem("user", JSON.stringify(updated));
      } catch {}
      setStatus({ type: "success", msg: "Profile updated" });
      setTimeout(() => setStatus({ type: "idle", msg: "" }), 1200);
    } catch (e) {
      setStatus({ type: "error", msg: e.message });
    }
  };

  const css = `
    .pf-wrap{min-height: calc(100vh - 72px); padding:24px 16px; display:flex; justify-content:center; align-items:flex-start}
    .pf-card{width:100%; max-width:720px; background:#ffffff; color:#111827; border:1px solid #e5e7eb; border-radius:16px; padding:20px; box-shadow:0 10px 20px rgba(0,0,0,.08)}
    .pf-title{margin:0 0 8px; font-size:22px; font-weight:800}
    .pf-sub{margin:0 16px 16px 0; color:#6b7280; font-size:14px}
    .pf-grid{display:grid; grid-template-columns: repeat(auto-fit,minmax(220px,1fr)); gap:12px}
    .pf-input{width:100%; height:44px; padding:10px 14px; border-radius:10px; border:1px solid #e5e7eb; background:#ffffff; color:#111827; box-sizing:border-box; font-size:14px; line-height:22px}
    .pf-input::placeholder{color:#9ca3af}
    .pf-input:focus{outline:none; border-color:#60a5fa; box-shadow:0 0 0 3px rgba(96,165,250,.25)}
    .pf-input:disabled{background:#f9fafb; color:#6b7280}
    .pf-textarea{width:100%; min-height:120px; padding:12px 14px; border-radius:10px; border:1px solid #e5e7eb; background:#ffffff; color:#111827; box-sizing:border-box; font-size:14px; line-height:22px; resize:vertical}
    .pf-textarea:focus{outline:none; border-color:#60a5fa; box-shadow:0 0 0 3px rgba(96,165,250,.25)}
    .pf-btn{margin-top:10px; padding:12px 16px; border:none; border-radius:10px; background:#22c55e; color:#fff; font-weight:700; cursor:pointer}
    .pf-btn:hover{background:#16a34a}
    .pf-msg{font-size:14px}
    .pf-msg.err{color:#dc2626}
    .pf-msg.ok{color:#10b981}
  `;

  return (
    <div className="pf-wrap">
      <style>{css}</style>
      <div className="pf-card">
        <h2 className="pf-title">My Profile</h2>
        <p className="pf-sub">View and update your account information.</p>
        <form onSubmit={submit}>
          <div className="pf-grid">
            <input className="pf-input" type="text" placeholder="Full Name" value={form.name||""} onChange={(e)=>setForm({...form,name:e.target.value})} required />
            <input className="pf-input" type="email" placeholder="Email" value={form.email||""} disabled />
            <input className="pf-input" type="text" placeholder="Phone" value={form.phone||""} onChange={(e)=>setForm({...form,phone:e.target.value})} />
            <input className="pf-input" type="text" placeholder="City" value={form.city||""} onChange={(e)=>setForm({...form,city:e.target.value})} />
            <input className="pf-input" type="text" placeholder="State" value={form.state||""} onChange={(e)=>setForm({...form,state:e.target.value})} />
            <input className="pf-input" type="text" placeholder="Country" value={form.country||""} onChange={(e)=>setForm({...form,country:e.target.value})} />
            <input className="pf-input" type="text" placeholder="ZIP" value={form.zip||""} onChange={(e)=>setForm({...form,zip:e.target.value})} />
            <input className="pf-input" type="text" placeholder="Avatar URL" value={form.avatarUrl||""} onChange={(e)=>setForm({...form,avatarUrl:e.target.value})} />
            <input className="pf-input" type="text" placeholder="Address" value={form.address||""} onChange={(e)=>setForm({...form,address:e.target.value})} />
          </div>
          <textarea className="pf-input pf-textarea" placeholder="Bio" value={form.bio||""} onChange={(e)=>setForm({...form,bio:e.target.value})} />
          {status.type !== 'idle' && (
            <div className={`pf-msg ${status.type==='error'?'err':status.type==='success'?'ok':''}`}>{status.msg}</div>
          )}
          <button className="pf-btn" type="submit">Save Changes</button>
        </form>
      </div>
    </div>
  );
}
