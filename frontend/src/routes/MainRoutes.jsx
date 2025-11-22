import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ScrollContainer from "../components/common/ScrollContainer";
import Home from "../pages/Home";
import About from "../pages/About";
import Features from "../pages/Features";
import Contact from "../pages/Contact";
import PageNotFound from "../pages/PageNotFound";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminUsers from "../pages/admin/AdminUsers";
import RecruiterDashboard from "../pages/recruiter/RecruiterDashboard";
import CandidateDashboard from "../pages/candidate/CandidateDashboard";

export default function MainRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<ScrollContainer />} />
        <Route path="/features" element={<ScrollContainer />} />
        <Route path="/about" element={<ScrollContainer />} />
        <Route path="/contact" element={<ScrollContainer />} />

        <Route
          path="/signup/*"
          element={<Navigate to="/signup/candidate" replace />}
        />
        <Route path="/signup/:role" element={<Signup />} />

        <Route path="/login" element={<Login />} />

        <Route
          path="/admin"
          element={<Navigate to="/admin/dashboard" replace />}
        />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/dashboard/users" element={<AdminUsers />} />

        <Route
          path="/recruiter"
          element={<Navigate to="/recruiter/dashboard" replace />}
        />
        <Route path="/recruiter/dashboard" element={<RecruiterDashboard />} />

        <Route
          path="/candidate"
          element={<Navigate to="/candidate/dashboard" replace />}
        />
        <Route path="/candidate/dashboard" element={<CandidateDashboard />} />

        {/* <Route path="*" element={<PageNotFound />} /> */}
      </Routes>
    </BrowserRouter>
  );
}
