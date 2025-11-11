import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import Aurora from "../components/common/Aurora";

const ROLES = ["Admin", "Recruiter", "Candidate"];

export default function Login() {
  const [role, setRole] = useState("Candidate");
  const [form, setForm] = useState({
    email: "",
    password: "",
    adminCode: "",
    companyName: "",
    phone: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Build payload depending on role
    const payload = {
      role,
      email: form.email,
      password: form.password,
      ...(role === "Admin" ? { adminCode: form.adminCode } : {}),
      ...(role === "Recruiter" ? { companyName: form.companyName } : {}),
      ...(role === "Candidate" ? { phone: form.phone } : {}),
    };

    console.log("Login payload:", payload);
    // TODO: call auth API with payload
    // On success:
    navigate("/home");
  };

  const roleAccent = {
    Admin: "admin",
    Recruiter: "recruiter",
    Candidate: "candidate",
  }[role];

  return (
    <div className="auralis-login-root">
      {/* Aurora Background */}
      <div className="auralis-aurora-bg">
        <Aurora
          colorStops={["#3A29FF", "#FF94B4", "#FF3232"]}
          blend={0}
          amplitude={0.6}
          speed={2}
        />
      </div>

      {/* Content: frosted login card */}
      <div className="auralis-login-container">
        <div className={`auralis-login-card ${roleAccent}`}>
          {/* Role segmented control */}
          <div className="role-toggle" role="tablist" aria-label="Select role">
            {ROLES.map((r) => (
              <button
                key={r}
                className={`role-btn ${r === role ? "active" : ""}`}
                onClick={() => setRole(r)}
                type="button"
                aria-pressed={r === role}
              >
                {r}
              </button>
            ))}
          </div>

          {/* Title */}
          <h1 className="auralis-login-title">
            {role === "Candidate" ? "Welcome Back" : `${role} Sign In`}
          </h1>
          <p className="auralis-login-sub">
            {role === "Admin" && "Sign in with your admin credentials."}
            {role === "Recruiter" &&
              "Sign in to manage job postings and candidates."}
            {role === "Candidate" &&
              "Sign in to apply for roles and track applications."}
          </p>

          <form className="auralis-login-form" onSubmit={handleSubmit}>
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

            {/* Role-specific inputs */}
            {role === "Admin" && (
              <input
                name="adminCode"
                type="text"
                placeholder="Admin Code"
                value={form.adminCode}
                onChange={handleChange}
                className="auralis-input"
              />
            )}

            {role === "Recruiter" && (
              <input
                name="companyName"
                type="text"
                placeholder="Company Name"
                value={form.companyName}
                onChange={handleChange}
                className="auralis-input"
              />
            )}

            {role === "Candidate" && (
              <input
                name="phone"
                type="tel"
                placeholder="Phone (optional)"
                value={form.phone}
                onChange={handleChange}
                className="auralis-input"
              />
            )}

            <button type="submit" className="auralis-btn-primary">
              Log In as {role}
            </button>
          </form>

          <div className="auralis-login-footer">
            <button
              className="auralis-link-btn"
              onClick={() => navigate("/home")}
              type="button"
            >
              ← Back to Home
            </button>
            <button
              className="auralis-link-btn"
              onClick={() => navigate("/signup")}
              type="button"
            >
              Create account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
