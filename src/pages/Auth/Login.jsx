import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Button from "../../components/landing/ui/Button";
import { getCurrentBSDateParts } from "../../utils/nepaliDate";
import "./Login.css";

const currentBSYear = getCurrentBSDateParts()?.year || "";

export default function Login() {
  const navigate = useNavigate();
  const { login, getDefaultRoute } = useAuth();
  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await login(formData.identifier, formData.password);

    if (result.success) {
      const defaultRoute = getDefaultRoute(result.user.role);
      navigate(defaultRoute);
    } else {
      setError(result.message || "Login failed. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div className="login-page">
      <div className="login-page__bg">
        <div className="login-page__circle login-page__circle--1"></div>
        <div className="login-page__circle login-page__circle--2"></div>
      </div>

      <div className="login-container">
        <Link to="/" className="login-back">
          ← Back to Website
        </Link>

        <div className="login-card">
          <div className="login-header">
            <img src="/logo.png" alt="Shining Star" className="login-logo" />
            <h1 className="login-title">
              Welcome <em>Back</em>
            </h1>
            <p className="login-subtitle">Management System Login</p>
          </div>
          <form className="login-form" onSubmit={handleSubmit}>
            {error && (
              <div className="login-error">
                <span className="login-error__icon">⚠️</span>
                <span>{error}</span>
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Email or Phone Number</label>
              <input
                type="text"
                name="identifier"
                className="form-input"
                placeholder="Enter your email or phone number"
                value={formData.identifier}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                name="password"
                className="form-input"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <Button
              variant="primary"
              size="large"
              type="submit"
              className="login-button"
            >
              {loading ? "Logging in..." : "Login to Dashboard"}
            </Button>
          </form>
        </div>

        <p className="login-footer">
          © {currentBSYear} Shining Star English School. All rights reserved.
        </p>
      </div>
    </div>
  );
}
