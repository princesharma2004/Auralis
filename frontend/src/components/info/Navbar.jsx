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
    <header className="fixed top-4 left-1/2 -translate-x-1/2 w-[75%] z-50 bg-white/10 backdrop-blur-md border border-white/20 rounded-full shadow-lg hover:shadow-xl hover:border-white/30 transition-all duration-300">
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
        {/* Left: Logo */}
        <div
          className="flex-shrink-0 cursor-pointer group"
          onClick={() => navigate("/home")}
        >
          <h1
            onClick={() => navigate("/home")}
            className="cursor-pointer text-2xl md:mt-xl font-extrabold bg-gradient-to-r from-[#40ffaa] via-[#4079ff] to-[#40ffaa] bg-[length:300%_300%] animate-gradient-text bg-clip-text text-transparent drop-shadow-lg transition-all duration-300 hover:scale-110 hover:drop-shadow-2xl"
          >
            Auralis
          </h1>
        </div>

        {/* Center: Navigation Links */}
        <ul className="flex gap-6 md:gap-8 text-white">
          {links.map((link) => (
            <li key={link.path} className="group">
              <NavLink
                to={link.path}
                className={({ isActive }) =>
                  `relative transition-all duration-300 ease-out ${
                    getActivePath(link.path) || isActive
                      ? "text-blue-400 font-semibold"
                      : "hover:text-blue-300 text-white/80"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span className="relative z-10">{link.label}</span>
                    {(getActivePath(link.path) || isActive) && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full animate-slide-in"></span>
                    )}
                    {!(getActivePath(link.path) || isActive) && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-400/0 via-blue-400/50 to-blue-400/0 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center"></span>
                    )}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Right: Buttons */}
        <div className="flex gap-3 flex-shrink-0">
          <button
            onClick={() => navigate("/login")}
            className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-full border border-white/30 hover:border-white/40 transition-all duration-300 hover:scale-105 hover:shadow-lg backdrop-blur-sm"
          >
            Log In
          </button>
          <button
            onClick={() => navigate("/signup")}
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-full border border-transparent hover:border-blue-400/50 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25"
          >
            Get Started
          </button>
        </div>
      </nav>
    </header>
  );
}
