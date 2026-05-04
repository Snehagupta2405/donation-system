import React from 'react';
import '../styles/Home.css';

import heroImage from '../assets/hero.jpg';
import aboutImage from '../assets/about.jpg';
import clothesImage from '../assets/clothes.jpg';
import foodImage from '../assets/food.jpg';
import booksImage from '../assets/books.jpg';
import moneyImage from '../assets/Money.jpg';
import toysImage from '../assets/toys.jpg';
import Footer from '../components/Footer'; 
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <>
      <div className="hero-section">
        <div className="hero-text">
          <h1>"Giving is not just about making a donation, it's about making a difference."</h1>
          <p>Help us bring change to those in need.</p>
          {/* Changed to Link for navigation */}
          <Link to="/donate" className="donate-btn">Donate Now</Link>
        </div>
        <div className="hero-image">
          <img src={heroImage} alt="Donation Visual" />
        </div>
      </div>

      <div className="about-section">
        <div className="about-image">
          <img src={aboutImage} alt="About us" />
        </div>
        <div className="about-text">
          <h2>About Us</h2>
          <p>We are committed to making the world a better place through donations and volunteer work.</p>
          <p>Join us to spread kindness and change lives for the better.</p>
          {/* Changed to Link for navigation */}
          <Link to="/about" className="read-more-btn">Read More</Link>
        </div>
      </div>

      <div className="donation-section">
        <h2>What You Can Donate</h2>
        <div className="donation-cards">
          <div className="donation-card">
            <img src={clothesImage} alt="clothes" />
            <h3>Clothes</h3>
            <p>Donate clean and wearable clothes for those in need.</p>
          </div>
          <div className="donation-card">
            <img src={foodImage} alt="Food" />
            <h3>Food</h3>
            <p>Non-perishable food items can help feed families.</p>
          </div>
          <div className="donation-card">
            <img src={booksImage} alt="Books" />
            <h3>Books</h3>
            <p>Educational and storybooks to empower young minds.</p>
          </div>
          <div className="donation-card">
            <img src={moneyImage} alt="Money" />
            <h3>Money</h3>
            <p>Your financial support helps fund various causes.</p>
          </div>
          <div className="donation-card">
            <img src={toysImage} alt="Toys" />
            <h3>Toys</h3>
            <p>Bring joy to children with your old but loved toys.</p>
          </div>
        </div>
      </div>

      <div className="contact-us">
        <h2>Contact Us</h2>
        <div className="contact-details">
          <div><strong>📞 Contact</strong><br/>+91 8169460301</div>
          <div><strong>📧 Send Mail</strong><br/>DonateNow123@gmail.com</div>
          <div><strong>📍 Office Address</strong><br/>Maharashtra, India</div>
          <div><strong>⏰ Office Hours</strong><br/>9:00 AM - 7:00 PM</div>
        </div>
      </div>

      <div className="login-links-section">
        <h2>Login Options</h2>
        <div className="login-links">
          <Link to="/donor-login">Go to Donor Login</Link><br/>
          <Link to="/volunteer-login">Go to Volunteer Login</Link><br/>
          <Link to="/admin-login">Go to Admin Login</Link>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Home;
