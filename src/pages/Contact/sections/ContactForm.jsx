import React, { useState } from "react";
import { message } from "antd";
import SectionLabel from "../../../components/landing/ui/SectionLabel";
import Button from "../../../components/landing/ui/Button";
import "./ContactForm.css";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Send email using Web3Forms
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          access_key: "aa677a60-51e1-4639-b310-8bff457f956b",
          subject: `Contact Inquiry - ${formData.subject}`,
          name: formData.name,
          email: formData.email,
          phone: formData.phone || "Not provided",
          inquiry_subject: formData.subject,
          message: formData.message,
        }),
      });

      const result = await response.json();

      if (result.success) {
        message.success(
          "Thank you for your message! We will get back to you soon.",
        );
        // Reset form
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        });
      } else {
        message.error(
          "Failed to send message. Please try again or contact us directly.",
        );
      }
    } catch (error) {
      console.error("Error sending message:", error);
      message.error(
        "Failed to send message. Please try again or contact us directly.",
      );
    }
  };

  return (
    <section className="contact-form-section">
      <div className="contact-form__container">
        <div className="contact-form__header">
          <SectionLabel>Send Message</SectionLabel>
          <h2>
            Get in <em>Touch</em>
          </h2>
          <p className="contact-form__intro">
            Fill out the form below and we'll get back to you as soon as
            possible
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
