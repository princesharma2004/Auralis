import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";
import Aurora from "../components/common/Aurora";
import MainLayout from "../layouts/MainLayout";
import login from "../services/login"

export default function Login() {
  const [form, setForm] = useState({
    email: "",
    password: ""
  });
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      email: form.email,
      password: form.password
    };
    login(payload).then((response) => {
      if(response.error) {alert(response.message);}
      else {console.log('Login successful:', response);}
    })
    .catch((err) => {alert('Something went wrong: ' + err.message);});
  };

  return (
    <MainLayout>
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
          <div className={`auralis-login-card`}>
            {/* Title */}
            <h1 className="auralis-login-title">
              Log in
            </h1>
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
  
              <button type="submit" className="auralis-btn-primary">
                Log In
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
    </MainLayout>
  );
}