import React, { useState } from "react";
import "../styles/Donate.css";
import { authFetch } from "../utils/auth";

const Donate = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    donationType: "",
    amount: "",
    collectionAddress: "",
    deliveryAddress: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Build payload for secured endpoint
    const payload = {
      category: formData.donationType,
      collectionAddress: formData.collectionAddress,
      deliveryAddress: formData.deliveryAddress,
      message: formData.message || "",
    };
    if (formData.donationType === "money") {
      const amt = Number(formData.amount || 0);
      if (!amt) { alert("Enter a valid amount for Money donations."); return; }
      payload.amount = amt;
    }

    try {
      const res = await authFetch("/api/donations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 401) { alert("Please log in as a donor first."); window.location.href = "/donor-login"; return; }
        throw new Error(data.message || "Failed to submit donation");
      }
      alert("Thank you for your donation!");
      setFormData({ name:"", email:"", phone:"", donationType:"", amount:"", collectionAddress:"", deliveryAddress:"", message:"" });
    } catch (error) {
      alert(error.message || "Failed to submit donation");
    }
  };

  return (
    <div className="donate-container">
      <h2>Make a Donation</h2>
      <form onSubmit={handleSubmit} className="donate-form">
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <input
          type="tel"
          name="phone"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleChange}
          required
        />

        <select
          name="donationType"
          value={formData.donationType}
          onChange={handleChange}
          required
        >
          <option value="">Select Donation Type</option>
          <option value="clothes">Clothes</option>
          <option value="food">Food</option>
          <option value="books">Books</option>
          <option value="money">Money</option>
          <option value="toys">Toys</option>
          <option value="others">Others</option>
          <option value="delivery">Delivery Request</option>
        </select>

        {formData.donationType === "money" && (
          <input
            type="number"
            name="amount"
            placeholder="Amount (in USD)"
            value={formData.amount}
            onChange={handleChange}
            min="1"
            required
          />
        )}

        <input
          type="text"
          name="collectionAddress"
          placeholder="Collection Address"
          value={formData.collectionAddress}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="deliveryAddress"
          placeholder="Delivery Address"
          value={formData.deliveryAddress}
          onChange={handleChange}
          required
        />

        <textarea
          name="message"
          placeholder="Additional Information (optional)"
          value={formData.message}
          onChange={handleChange}
        />

        <button type="submit">Donate Now</button>
      </form>
    </div>
  );
};

export default Donate;
