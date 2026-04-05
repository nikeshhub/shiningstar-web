import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer__container">
        <div className="footer__grid">
          {/* Column 1 - About */}
          <div className="footer__column">
            <div className="footer__logo">
              <img src="/logo.png" alt="Shining Star English School" className="footer__logo-image" />
              <h3 className="footer__heading">Shining Star</h3>
            </div>
            <p className="footer__text">
              Empowering young minds in Panchthar, Nepal with quality English education since 1994.
            </p>
            <p className="footer__text footer__text--small">
              Committed to excellence in education and character building.
            </p>
          </div>

          {/* Column 2 - Quick Links */}
          <div className="footer__column">
            <h4 className="footer__heading">Quick Links</h4>
            <ul className="footer__list">
              <li><Link to="/" className="footer__link">Home</Link></li>
              <li><Link to="/about" className="footer__link">About Us</Link></li>
              <li><Link to="/academics" className="footer__link">Academics</Link></li>
              <li><Link to="/gallery" className="footer__link">Gallery</Link></li>
              <li><Link to="/contact" className="footer__link">Contact</Link></li>
            </ul>
          </div>

          {/* Column 3 - Programs */}
          <div className="footer__column">
            <h4 className="footer__heading">Programs</h4>
            <ul className="footer__list">
              <li className="footer__link">Pre-Primary (Nursery - UKG)</li>
              <li className="footer__link">Primary (Class 1-5)</li>
              <li className="footer__link">Lower Secondary (Class 6-8)</li>
            </ul>
          </div>

          {/* Column 4 - Contact */}
          <div className="footer__column">
            <h4 className="footer__heading">Contact Us</h4>
            <ul className="footer__list footer__list--contact">
              <li className="footer__text">
                Panchthar, Nepal
              </li>
              <li className="footer__text">
                Phone: +977 9815988535
              </li>
              <li className="footer__text">
                Email: admin.shiningstar@gmail.com
              </li>
            </ul>
          </div>
        </div>

        <div className="footer__bottom">
          <p className="footer__copyright">
            &copy; {new Date().getFullYear()} Shining Star English School. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
