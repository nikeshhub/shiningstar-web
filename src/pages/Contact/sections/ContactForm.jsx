import React, { useState } from 'react';
import SectionLabel from '../../../components/landing/ui/SectionLabel';
import Button from '../../../components/landing/ui/Button';
import './ContactForm.css';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
  };

  return (
    <section className="contact-form-section">
      <div className="contact-form__container">
        <div className="contact-form__header">
          <SectionLabel>Send Message</SectionLabel>
          <h2>Get in <em>Touch</em></h2>
          <p className="contact-form__intro">
            Fill out the form below and we'll get back to you as soon as possible
          </p>
        </div>

        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="contact-form__grid">
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                name="name"
                className="form-input"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                name="email"
                className="form-input"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input
                type="tel"
                name="phone"
                className="form-input"
                placeholder="Enter your phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Subject</label>
              <input
                type="text"
                name="subject"
                className="form-input"
                placeholder="Subject of inquiry"
                value={formData.subject}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group form-group--full">
            <label className="form-label">Message</label>
            <textarea
              name="message"
              className="form-textarea"
              rows="6"
              placeholder="Write your message here..."
              value={formData.message}
              onChange={handleChange}
              required
            ></textarea>
          </div>

          <div className="contact-form__submit">
            <Button variant="primary" size="large" type="submit">
              Send Message
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default ContactForm;
