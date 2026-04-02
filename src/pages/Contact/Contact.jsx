import React from 'react';
import Navigation from '../../components/landing/Navigation';
import Footer from '../../components/landing/Footer';
import ContactHero from './sections/ContactHero';
import ContactInfo from './sections/ContactInfo';
import ContactForm from './sections/ContactForm';
import './Contact.css';

const Contact = () => {
  return (
    <div className="contact-page">
      <Navigation />
      <ContactHero />
      <ContactInfo />
      <ContactForm />
      <Footer />
    </div>
  );
};

export default Contact;
