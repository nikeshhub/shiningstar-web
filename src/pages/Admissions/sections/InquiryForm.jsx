import React, { useState } from 'react';
import SectionLabel from '../../../components/landing/ui/SectionLabel';
import Button from '../../../components/landing/ui/Button';
import './InquiryForm.css';

const InquiryForm = () => {
  const [formData, setFormData] = useState({
    parentName: '',
    studentName: '',
    email: '',
    phone: '',
    studentAge: '',
    grade: '',
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
    console.log('Inquiry submitted:', formData);
  };

  return (
    <section className="inquiry-form-section">
      <div className="inquiry-form__container">
        <div className="inquiry-form__header">
          <SectionLabel>Apply Now</SectionLabel>
          <h2>Admission <em>Inquiry</em></h2>
          <p className="inquiry-form__intro">
            Submit your inquiry and our admission team will get back to you shortly
          </p>
        </div>

        <form className="inquiry-form" onSubmit={handleSubmit}>
          <div className="inquiry-form__grid">
            <div className="form-group">
              <label className="form-label">Parent/Guardian Name</label>
              <input
                type="text"
                name="parentName"
                className="form-input"
                placeholder="Enter parent name"
                value={formData.parentName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Student Name</label>
              <input
                type="text"
                name="studentName"
                className="form-input"
                placeholder="Enter student name"
                value={formData.studentName}
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
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Student Age</label>
              <input
                type="number"
                name="studentAge"
                className="form-input"
                placeholder="Age"
                value={formData.studentAge}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Grade Applying For</label>
              <select
                name="grade"
                className="form-input"
                value={formData.grade}
                onChange={handleChange}
                required
              >
                <option value="">Select grade</option>
                <option value="Nursery">Nursery</option>
                <option value="LKG">LKG</option>
                <option value="UKG">UKG</option>
                <option value="Class 1">Class 1</option>
                <option value="Class 2">Class 2</option>
                <option value="Class 3">Class 3</option>
                <option value="Class 4">Class 4</option>
                <option value="Class 5">Class 5</option>
                <option value="Class 6">Class 6</option>
                <option value="Class 7">Class 7</option>
                <option value="Class 8">Class 8</option>
                <option value="Class 9">Class 9</option>
                <option value="Class 10">Class 10</option>
              </select>
            </div>
          </div>

          <div className="form-group form-group--full">
            <label className="form-label">Message (Optional)</label>
            <textarea
              name="message"
              className="form-textarea"
              rows="5"
              placeholder="Any additional information or questions..."
              value={formData.message}
              onChange={handleChange}
            ></textarea>
          </div>

          <div className="inquiry-form__submit">
            <Button variant="primary" size="large" type="submit">
              Submit Inquiry
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default InquiryForm;
