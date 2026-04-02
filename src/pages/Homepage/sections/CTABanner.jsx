import React from 'react';
import Button from '../../../components/landing/ui/Button';
import './CTABanner.css';

const CTABanner = () => {
  return (
    <section className="cta-banner-section">
      <div className="cta-banner">
        <div className="cta-banner__circle cta-banner__circle--1"></div>
        <div className="cta-banner__circle cta-banner__circle--2"></div>

        <div className="cta-banner__content">
          <h2 className="cta-banner__title">
            Ready to Join Our <em>Community</em>?
          </h2>
          <p className="cta-banner__description">
            Start your child's journey towards excellence. Enroll now for the upcoming academic session.
          </p>
        </div>

        <div className="cta-banner__actions">
          <Button variant="white" size="large">Get Admission Info</Button>
          <Button variant="secondary" size="large">Contact Us</Button>
        </div>
      </div>
    </section>
  );
};

export default CTABanner;
