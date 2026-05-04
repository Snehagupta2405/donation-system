import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/About.css';
import aboutImage from '../assets/about.jpg'; // make sure this file exists

function useCountOnVisible(target) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    let started = false;
    let rafId = null;

    const animate = (start, end, duration = 1200) => {
      const startTime = performance.now();
      const step = (now) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const value = Math.floor(start + (end - start) * progress);
        setCount(value);
        if (progress < 1) rafId = requestAnimationFrame(step);
      };
      rafId = requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !started) {
            started = true;
            animate(0, target);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.35 }
    );

    if (ref.current) observer.observe(ref.current);

    return () => {
      observer.disconnect();
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [target]);

  return [count, ref];
}

const About = () => {
  const [donations, donationsRef] = useCountOnVisible(1250);
  const [volunteers, volunteersRef] = useCountOnVisible(320);
  const [projects, projectsRef] = useCountOnVisible(48);

  return (
    <div className="about page-container">
      <div className="about-row">
        <div className="about-image-wrapper">
          <img src={aboutImage} alt="Volunteers packing donations" className="about-img" />
        </div>

        <div className="about-content">
          <h2>About Us</h2>
          <p className="about-lead">
          We believe in the power of connection.
          Charity Connect is more than just a platform; it's a bridge between generous people and verified causes. Our mission is to make donating simple, transparent, and impactful, ensuring essential supplies reach those in need in education and healthcare. We work closely with our local partners and a dedicated team of volunteers to guarantee every contribution creates real-world results. We are committed to a community built on trust, accountability, and the shared goal of making a tangible difference in people's lives.
          </p>

          <p>
          At Charity Connect, we believe in people helping people. Our story began with a simple question: How can we make a real difference, together? We exist to answer that question by creating a direct link between generous donors and the causes that matter most. We partner with local heroes and empower our dedicated volunteers to deliver essential support where it's needed most in education and healthcare. Join us in building a community where every act of kindness creates a ripple effect of change.
          </p>

          <div className="about-cta">
            <Link to="/donate" className="btn btn-primary">Donate Now</Link>
            <Link to="/contact" className="btn btn-outline">Contact Us</Link>
          </div>
        </div>
      </div>

      <div className="about-stats">
        <div className="stat-card">
          <div className="stat-number" ref={donationsRef}>{donations}</div>
          <div className="stat-label">Donations</div>
        </div>
        <div className="stat-card">
          <div className="stat-number" ref={volunteersRef}>{volunteers}</div>
          <div className="stat-label">Volunteers</div>
        </div>
        <div className="stat-card">
          <div className="stat-number" ref={projectsRef}>{projects}</div>
          <div className="stat-label">Projects</div>
        </div>
      </div>
    </div>
  );
};

export default About;
