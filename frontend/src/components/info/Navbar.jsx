import React from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const links = [
    { path: "/home", label: "Home" },
    { path: "/features", label: "Features" },
    { path: "/about", label: "About" },
    { path: "/contact", label: "Contact" },
  ];

  const getActivePath = (path) => {
    if (location.pathname === "/" && path === "/home") return true; // Default to home
    return location.pathname === path;
  };

  return (
    <header className="fixed top-4 left-1/2 -translate-x-1/2 w-[75%] z-50 bg-white/10 backdrop-blur-md border border-white/20 rounded-full shadow-lg">
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
        {/* Left: Logo */}
        <div
          className="flex-shrink-0 cursor-pointer"
          onClick={() => navigate("/home")}
        >
          <h1
            onClick={() => navigate("/home")}
            className="cursor-pointer text-2xl md:mt-xl font-extrabold bg-gradient-to-r from-[#40ffaa] via-[#4079ff] to-[#40ffaa] bg-[length:300%_300%] animate-gradient-text bg-clip-text text-transparent drop-shadow-lg transition-transform hover:scale-105"
          >
            Auralis
          </h1>
        </div>

        {/* Center: Navigation Links */}
        <ul className="flex gap-8 text-white">
          {links.map((link) => (
            <li key={link.path}>
              <NavLink
                to={link.path}
                className={({ isActive }) =>
                  `transition-all duration-200 ${
                    getActivePath(link.path) || isActive
                      ? "text-blue-400 font-semibold border-b-2 border-blue-400 pb-1"
                      : "hover:text-blue-300"
                  }`
                }
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Right: Buttons */}
        <div className="flex gap-3 flex-shrink-0">
          <button
            onClick={() => navigate("/login")}
            className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-full border border-white/30 transition"
          >
            Log In
          </button>
          <button
            onClick={() => navigate("/signup")}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full border border-blue-600 transition"
          >
            Get Started
          </button>
        </div>
      </nav>
    </header>
  );
}
