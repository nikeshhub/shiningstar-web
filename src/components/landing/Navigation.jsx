import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu as MenuIcon, Close } from '@mui/icons-material';
import Button from './ui/Button';
import './Navigation.css';

const Navigation = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll to top when location changes and close mobile menu
  useEffect(() => {
    window.scrollTo(0, 0);
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About Us' },
    { path: '/academics', label: 'Academics' },
    { path: '/admissions', label: 'Admissions' },
    { path: '/gallery', label: 'Gallery' },
    { path: '/contact', label: 'Contact' },
  ];

  return (
    <>
      <nav className={`nav ${scrolled ? 'nav--scrolled' : ''}`}>
        <div className="nav__container">
          <Link to="/" className="nav__logo">
            <img src="https://res.cloudinary.com/duaz5kg1m/image/upload/v1775406211/logo_p6u2km.png" alt="Shining Star English School" className="nav__logo-image" />
            <div className="nav__logo-text-group">
              <span className="nav__logo-text">Shining Star</span>
              <span className="nav__logo-subtitle">English School</span>
            </div>
          </Link>

          <div className="nav__links">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`nav__link ${location.pathname === link.path ? 'nav__link--active' : ''}`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="nav__mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <Close /> : <MenuIcon />}
          </button>

          {/* <div className="nav__actions">
            <Button variant="primary" size="small" href="/login">
              Login
            </Button>
          </div> */}
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div className={`nav__mobile-menu ${mobileMenuOpen ? 'nav__mobile-menu--open' : ''}`}>
        <div className="nav__mobile-links">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`nav__mobile-link ${location.pathname === link.path ? 'nav__mobile-link--active' : ''}`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

export default Navigation;
