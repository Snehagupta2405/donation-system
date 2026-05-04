import React from "react";
import { Link } from "react-router-dom";

export default function Contact() {
  const [form, setForm] = React.useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = React.useState({ type: "idle", msg: "" });

  const submit = async (e) => {
    e.preventDefault();
    setStatus({ type: "loading", msg: "Sending..." });
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to send');
      setStatus({ type: "success", msg: "Thanks! Your message has been sent." });
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (e) {
      setStatus({ type: "error", msg: e.message });
    }
  };

  return (
    <div style={{ fontFamily: 'Inter, system-ui, Arial, sans-serif' }}>
      <header style={{ background: '#e6f4ff', padding: '24px 16px', textAlign: 'center' }}>
        <h1 style={{ margin: 0, fontSize: 32, color: '#1f2937' }}>Contact Us</h1>
        <p style={{ margin: '8px 0 0', color: '#4b5563' }}>We would love to hear from you. Reach out using any of the options below.</p>
      </header>

      <main style={{ maxWidth: 1000, margin: '0 auto', padding: 16 }}>
        <section style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 16,
          marginTop: 24,
        }}>
          <Card icon="📞" title="Contact" value="+91 8169460301" />
          <Card icon="✉️" title="Send Mail" value="DonateNow123@gmail.com" />
          <Card icon="📍" title="Office Address" value="Maharashtra, India" />
          <Card icon="⏰" title="Office Hours" value="9:00 AM - 7:00 PM" />
        </section>

        <section style={{ marginTop: 32, textAlign: 'center' }}>
          <h2 style={{ margin: '0 0 16px', color: '#1f2937' }}>Login Options</h2>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link className="btn" to="/donor-login">Go to Donor Login</Link>
            <Link className="btn" to="/volunteer-login">Go to Volunteer Login</Link>
            <Link className="btn" to="/admin-login">Go to Admin Login</Link>
          </div>
        </section>

        <section style={{ marginTop: 40 }}>
          <h3 style={{ marginBottom: 8, color: '#111827' }}>Send us a message</h3>
          <form
            onSubmit={submit}
            style={{ background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 16 }}
          >
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <input type="text" placeholder="Your Name" required style={inputStyle} value={form.name} onChange={(e)=>setForm({...form, name:e.target.value})} />
              <input type="email" placeholder="Your Email" required style={inputStyle} value={form.email} onChange={(e)=>setForm({...form, email:e.target.value})} />
            </div>
            <input type="text" placeholder="Subject" required style={{ ...inputStyle, marginTop: 12 }} value={form.subject} onChange={(e)=>setForm({...form, subject:e.target.value})} />
            <textarea placeholder="Your Message" rows={5} required style={{ ...inputStyle, marginTop: 12, resize: 'vertical' }} value={form.message} onChange={(e)=>setForm({...form, message:e.target.value})} />
            {status.type !== 'idle' && (
              <div style={{ marginTop: 8, color: status.type === 'error' ? '#b91c1c' : '#065f46' }}>{status.msg}</div>
            )}
            <button type="submit" className="btn" style={{ marginTop: 12 }}>Send Message</button>
          </form>
        </section>
      </main>

      <style>{`
        .btn { padding: 10px 16px; background:#2563eb; color:#fff; border:none; border-radius:8px; text-decoration:none; display:inline-block }
        .btn:hover { background:#1e40af }
      `}</style>
    </div>
  );
}

function Card({ icon, title, value }) {
  return (
    <div style={{ background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 16 }}>
      <div style={{ fontSize: 28 }} aria-hidden>{icon}</div>
      <div style={{ marginTop: 6, fontWeight: 700, color: '#374151' }}>{title}</div>
      <div style={{ color: '#4b5563', marginTop: 2 }}>{value}</div>
    </div>
  );
}

const inputStyle = {
  width: '100%',
  padding: 12,
  borderRadius: 8,
  border: '1px solid #e5e7eb',
  outline: 'none',
};
