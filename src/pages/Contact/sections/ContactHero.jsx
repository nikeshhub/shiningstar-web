import React from 'react';
import SectionLabel from '../../../components/landing/ui/SectionLabel';
import './ContactHero.css';

const ContactHero = () => {
  return (
    <section className="page-hero">
      <div className="page-hero__circle"></div>
      <div className="page-hero__container">
        <div className="page-hero__breadcrumb">
          <span>Home</span>
          <span className="page-hero__breadcrumb-separator">/</span>
          <span>Contact</span>
        </div>
        <SectionLabel>Get In Touch</SectionLabel>
        <h1>Contact <em>Us</em></h1>
        <p className="page-hero__description">
          Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
        </p>
      </div>
    </section>
  );
};

export default ContactHero;
