import React from 'react';
import './Hero.css';

const Hero = () => {
  return (
    <div className="hero-section">
      <div className="hero-content">
        <div className="hero-text">
          <h1>राष्ट्रिय आर्थिक गणना, २०८२</h1>
          <h2>National Economic Census 2082</h2>
          <p>सही तथ्यांक, समृद्ध नेपाल | Accurate Data, Prosperous Nepal</p>
        </div>
        <div className="hero-stats">
          <div className="hero-stat">
            <span className="hero-stat-number">9</span>
            <span className="hero-stat-label">Municipalities</span>
          </div>
          <div className="hero-stat">
            <span className="hero-stat-number">40+</span>
            <span className="hero-stat-label">Enumerators</span>
          </div>
          <div className="hero-stat">
            <span className="hero-stat-number">100%</span>
            <span className="hero-stat-label">Digital System</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;