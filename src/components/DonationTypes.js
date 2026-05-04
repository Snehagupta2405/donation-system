import React from 'react';
import './DonationTypes.css';

const items = [
  { title: "Clothes", desc: "Used or new clothes for the needy", img: "clothes.jpg" },
  { title: "Books", desc: "Books for children's education", img: "books.jpg" },
  { title: "Food", desc: "Non-perishable food items", img: "food.jpg" },
  { title: "Medicines", desc: "Essential medical supplies", img: "medicine.jpg" }
];

const DonationTypes = () => {
  return (
    <div className="donation-types">
      <h2>What You Can Donate</h2>
      <div className="items">
        {items.map((item, i) => (
          <div className="card" key={i}>
            <img src={`../assets/${item.img}`} alt={item.title} />
            <h3>{item.title}</h3>
            <p>{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DonationTypes;
