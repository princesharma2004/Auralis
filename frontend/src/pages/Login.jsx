import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";
import Aurora from "../components/common/Aurora";
import MainLayout from "../layouts/MainLayout";
import login from "../services/login";

export default function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const navigate = useNavigate();

  // Load remembered email on mount
  useEffect(() => {
    const rememberedEmail = localStorage.getItem("rememberedEmail");
    if (rememberedEmail) {
      setForm((prev) => ({ ...prev, email: rememberedEmail, rememberMe: true }));
    }
  }, []);

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      email: form.email,
      password: form.password,
    };

    // Save or clear remembered email
    if (form.rememberMe) {
      localStorage.setItem("rememberedEmail", form.email);
    } else {
      localStorage.removeItem("rememberedEmail");
    }

    login(payload).then((response) => {
      if (response.error) {
        alert(response.message);
      } else {
        setForm({ email: "", password: "", rememberMe: false });
        switch (response.role) {
          case "admin":
            navigate("/admin");
            break;
          case "recruiter":
            navigate("/recruiter");
            break;
          case "candidate":
            navigate("/candidate");
            break;
          default:
            navigate("/home");
        }
      }
    });
  };

  return (
    <MainLayout>
      <div className="auralis-login-root">
        {/* Aurora Background */}
        <div className="auralis-aurora-bg">
          <Aurora
            colorStops={["#3A29FF", "#FF94B4", "#FF3232"]}
            blend={0.5}
            amplitude={0.6}
            speed={2}
          />
        </div>

        {/* Content: frosted login card */}
        <div className="auralis-login-container">
          <div className={`auralis-login-card`}>
            {/* Title */}
            <h1 className="auralis-login-title">Log in</h1>
            <p className="auralis-login-sub">
              Welcome back to Auralis — your journey continues!
            </p>

            <form className="auralis-login-form" onSubmit={handleSubmit}>
              <input
                name="email"
                type="email"
                placeholder="Email"
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

              <div className="auralis-rememberme flex items-center gap-2 mb-3">
                <input
                  type="checkbox"
                  id="rememberMe"
                  name="rememberMe"
                  checked={form.rememberMe}
                  onChange={handleChange}
                  className="cursor-pointer"
                />
                <label htmlFor="rememberMe" className="text-sm text-gray-200 cursor-pointer">
                  Remember me
                </label>
              </div>

              <button type="submit" className="auralis-btn-primary">
                Log In
              </button>
            </form>

            <div className="auralis-login-footer">
              <button
                className="auralis-link-btn group transition-all duration-300 flex items-center gap-2"
                onClick={() => navigate("/home")}
                type="button"
              >
                <span className="transition-transform duration-300 group-hover:-translate-x-1">
                  ←
                </span>
                Back to Home
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
    </MainLayout>
  );
}
