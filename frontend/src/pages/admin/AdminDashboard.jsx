import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logout from "../../services/logout";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/login");
      return;
    }

    setIsLoggingOut(true);
    try {
      const response = await logout({ token }); // 🔹 send token as payload

      if (!response.error) {
        // 🔹 clear all stored credentials
        localStorage.removeItem("authToken");
        localStorage.removeItem("userRole");
        localStorage.removeItem("rememberedEmail");
        localStorage.removeItem("rememberedPassword");

        navigate("/login");
      } else {
        alert(response.message || "Logout failed. Please try again.");
      }
    } catch (error) {
      console.error("Logout error:", error);
      alert("Something went wrong while logging out.");
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
      <h1 className="text-3xl font-semibold mb-6">Admin Dashboard</h1>

      <button
        onClick={handleLogout}
        disabled={isLoggingOut}
        className="px-6 py-2 rounded-lg bg-red-600 hover:bg-red-700 transition-colors disabled:opacity-60"
      >
        {isLoggingOut ? "Logging out..." : "Logout"}
      </button>
    </div>
  );
}
