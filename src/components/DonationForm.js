import React, { useState } from 'react';
import { authFetch } from '../utils/auth'; // already added in utils

function DonationForm() {
  const [formData, setFormData] = useState({
    category: 'clothes',
    amount: '',
    area: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        category: formData.category,
        area: formData.area,
        message: formData.message || ''
      };
      if (formData.category === 'money') {
        const amt = Number(formData.amount || 0);
        if (!amt) { alert('Enter a valid amount.'); setSubmitting(false); return; }
        payload.amount = amt;
      }
      const res = await authFetch('/api/donations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 401) { alert('Please log in as a donor first.'); window.location.href = '/donor-login'; return; }
        throw new Error(data.message || 'Submit failed');
      }
      alert('Donation submitted successfully.');
      setFormData({ category: 'clothes', amount: '', area: '', message: '' });
    } catch (err) {
      alert('Failed to submit donation');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="donation-form">
      <select name="category" value={formData.category} onChange={handleChange}>
        <option value="clothes">Clothes</option>
        <option value="food">Food</option>
        <option value="books">Books</option>
        <option value="money">Money</option>
        <option value="toys">Toys</option>
        <option value="others">Others</option>
      </select>

      {formData.category === 'money' && (
        <input
          type="number"
          name="amount"
          placeholder="Amount"
          value={formData.amount}
          onChange={handleChange}
        />
      )}

      <input
        type="text"
        name="area"
        placeholder="Area"
        required
        value={formData.area}
        onChange={handleChange}
      />

      <textarea
        name="message"
        placeholder="Message (optional)"
        value={formData.message}
        onChange={handleChange}
      />

      <button type="submit" disabled={submitting}>
        {submitting ? 'Submitting…' : 'Donate Now'}
      </button>
    </form>
  );
}

export default DonationForm;