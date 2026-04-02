import React from 'react';
import { Link } from 'react-router-dom';
import Navigation from '../../components/landing/Navigation';
import Footer from '../../components/landing/Footer';
import Button from '../../components/landing/ui/Button';
import './NotFound.css';

const NotFound = () => {
  return (
    <div className="not-found-page">
      <Navigation />

      <section className="not-found">
        <div className="not-found__bg">
          <div className="not-found__circle not-found__circle--1"></div>
          <div className="not-found__circle not-found__circle--2"></div>
        </div>

        <div className="not-found__container">
          <div className="not-found__content">
            <div className="not-found__number">404</div>
            <h1 className="not-found__title">
              Page Not <em>Found</em>
            </h1>
            <p className="not-found__description">
              Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
            </p>

            <div className="not-found__actions">
              <Link to="/">
                <Button variant="primary" size="large">
                  Go to Homepage
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="secondary" size="large">
                  Contact Us
                </Button>
              </Link>
            </div>

            <div className="not-found__links">
              <p className="not-found__links-title">Quick Links:</p>
              <div className="not-found__links-grid">
                <Link to="/about" className="not-found__link">About Us</Link>
                <Link to="/academics" className="not-found__link">Academics</Link>
                <Link to="/admissions" className="not-found__link">Admissions</Link>
                <Link to="/gallery" className="not-found__link">Gallery</Link>
              </div>
            </div>
          </div>

          <div className="not-found__illustration">
            <div className="not-found__book">
              <div className="not-found__book-page"></div>
              <div className="not-found__book-page"></div>
              <div className="not-found__book-page"></div>
            </div>
            <div className="not-found__star not-found__star--1">⭐</div>
            <div className="not-found__star not-found__star--2">⭐</div>
            <div className="not-found__star not-found__star--3">⭐</div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default NotFound;
