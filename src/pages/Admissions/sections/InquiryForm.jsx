import React, { useState } from "react";
import { message } from "antd";
import SectionLabel from "../../../components/landing/ui/SectionLabel";
import Button from "../../../components/landing/ui/Button";
import "./InquiryForm.css";

const InquiryForm = () => {
  const [formData, setFormData] = useState({
    parentName: "",
    studentName: "",
    email: "",
    phone: "",
    studentAge: "",
    grade: "",
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
          subject: `Admission Inquiry - ${formData.studentName} (${formData.grade})`,
          name: formData.parentName,
          email: formData.email,
          parent_name: formData.parentName,
          student_name: formData.studentName,
          phone: formData.phone,
          student_age: formData.studentAge,
          grade: formData.grade,
          message: formData.message || "No additional message",
        }),
      });

      const result = await response.json();

      if (result.success) {
        message.success(
          "Thank you for your inquiry! We will get back to you soon.",
        );
        // Reset form
        setFormData({
          parentName: "",
          studentName: "",
          email: "",
          phone: "",
          studentAge: "",
          grade: "",
          message: "",
        });
      } else {
        message.error(
          "Failed to send inquiry. Please try again or contact us directly.",
        );
      }
    } catch (error) {
      console.error("Error sending inquiry:", error);
      message.error(
        "Failed to send inquiry. Please try again or contact us directly.",
      );
    }
  };

  return (
    <section className="inquiry-form-section">
      <div className="inquiry-form__container">
        <div className="inquiry-form__header">
          <SectionLabel>Apply Now</SectionLabel>
          <h2>
            Admission <em>Inquiry</em>
          </h2>
          <p className="inquiry-form__intro">
            Submit your inquiry and our admission team will get back to you
            shortly
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
