import React from 'react';
import { LocationOn } from '@mui/icons-material';
import './ContactInfo.css';

const ContactInfo = () => {
  return (
    <section className="contact-details">
      <div className="contact-details__container">
        <div className="contact-details__grid">
          <div className="contact-details__map">
            <div className="contact-details__map-placeholder">
              <div className="contact-details__map-icon"><LocationOn sx={{ fontSize: 48 }} /></div>
              <p>Panchthar, Nepal</p>
            </div>
          </div>

          <div className="contact-details__info">
            <h3>Visit Our Campus</h3>
            <p className="contact-details__text">
              We welcome you to visit our campus and experience the vibrant learning environment firsthand. Our administrative office is open during school hours for admissions and inquiries.
            </p>
            <div className="contact-details__list">
              <div className="contact-details__item">
                <strong>Address:</strong> Panchthar, Nepal
              </div>
              <div className="contact-details__item">
                <strong>Phone:</strong> +977 9815988535
              </div>
              <div className="contact-details__item">
                <strong>Email:</strong> admin.shiningstar@gmail.com
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactInfo;
