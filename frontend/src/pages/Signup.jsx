import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Signup.css";
import Aurora from "../components/common/Aurora";
import MainLayout from "../layouts/MainLayout";

const ROLES = ["Recruiter", "Candidate"];

export default function Signup() {
  const [role, setRole] = useState("Candidate");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const payload = {
      role,
      name: form.name,
      email: form.email,
      password: form.password,
      ...(role === "Recruiter" ? { companyName: form.companyName } : {}),
      ...(role === "Candidate" ? { phone: form.phone } : {}),
    };

    console.log("Signup payload:", payload);
    // TODO: Send to API
    navigate("/home");
  };

  const roleAccent = role === "Recruiter" ? "recruiter" : "candidate";

  return (
    <MainLayout>
      <div className="auralis-signup-root">
      {/* Aurora Background */}
      <div className="auralis-aurora-bg">
        <Aurora
          colorStops={["#3A29FF", "#FF94B4", "#FF3232"]}
          blend={0}
          amplitude={0.6}
          speed={2}
        />
      </div>

      {/* Signup card */}
      <div className="auralis-signup-container">
        <div
          className={`auralis-signup-card ${roleAccent}`}
          data-role={role.toLowerCase()}
        >
          {/* Role toggle */}
          <div className="role-toggle" role="tablist" aria-label="Select role">
            {ROLES.map((r, idx) => (
              <button
                key={r}
                className={`role-btn ${r === role ? "active" : ""}`}
                onClick={() => setRole(r)}
                type="button"
                aria-pressed={r === role}
                data-index={idx}
              >
                {r}
              </button>
            ))}

            <div
              className="role-indicator"
              style={{
                transform: `translateX(${ROLES.indexOf(role) * 100}%)`,
              }}
              aria-hidden
            />
          </div>

          {/* Title */}
          <h1 className="auralis-signup-title">
            {role === "Candidate"
              ? "Create your Candidate account"
              : "Create your Recruiter account"}
          </h1>
          <p className="auralis-signup-sub">
            {role === "Recruiter"
              ? "Sign up to post jobs and manage candidates."
              : "Sign up to apply for jobs and track applications."}
          </p>

          {/* Form */}
          <form className="auralis-signup-form" onSubmit={handleSubmit}>
            <input
              name="name"
              type="text"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              required
              className="auralis-input"
            />

            <input
              name="email"
              type="email"
              placeholder={role === "Recruiter" ? "Work Email" : "Email"}
              value={form.email}
              onChange={handleChange}
              required
              className="auralis-input"
            />

            <input
              name="password"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
              className="auralis-input"
            />

            <input
              name="confirmPassword"
              type="password"
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={handleChange}
              required
              className="auralis-input"
            />

            <button type="submit" className="auralis-btn-primary">
              Sign Up as {role}
            </button>
          </form>

          <div className="auralis-signup-footer">
            <button
              className="auralis-link-btn"
              onClick={() => navigate("/home")}
              type="button"
            >
              ← Back to Home
            </button>
            <button
              className="auralis-link-btn"
              onClick={() => navigate("/login")}
              type="button"
            >
              Already have an account? Log In
            </button>
          </div>
        </div>
      </div>
    </div>
    </MainLayout>
  );
}
