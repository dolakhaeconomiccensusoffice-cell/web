import React from 'react';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const nepaliYear = currentYear + 57; // Approximate conversion to BS

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>🏛️ District Economic Census Office</h3>
          <p>Dolakha, Nepal</p>
          <p>Under National Statistics Office (NSO)</p>
          <p>Government of Nepal</p>
        </div>

        <div className="footer-section">
          <h3>📞 Contact Us</h3>
          <p>📧 deco.dolakha@census.gov.np</p>
          <p>📱 +977-49-123456</p>
          <p>📍 District Administration Office Complex</p>
          <p>Dolakha Bazar, Dolakha</p>
        </div>

        <div className="footer-section">
          <h3>🔗 Quick Links</h3>
          <ul>
            <li><a href="#">National Statistics Office</a></li>
            <li><a href="#">Economic Census 2082</a></li>
            <li><a href="#">Staff Portal</a></li>
            <li><a href="#">Privacy Policy</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>🕐 Office Hours</h3>
          <p>Sunday - Thursday: 10:00 AM - 5:00 PM</p>
          <p>Friday: 10:00 AM - 3:00 PM</p>
          <p>Saturday: Closed</p>
          <p className="footer-note">GPS Attendance Mandatory</p>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-copyright">
          <p>&copy; {currentYear} ({nepaliYear}) District Economic Census Office, Dolakha. All rights reserved.</p>
          <p className="footer-powered">Powered by National Statistics Office, Nepal</p>
        </div>
        <div className="footer-links">
          <a href="#">Terms of Service</a>
          <a href="#">Privacy Policy</a>
          <a href="#">Accessibility</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;