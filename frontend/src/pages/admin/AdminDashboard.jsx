import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Pagination from "../../components/common/Pagination";
import overview from "../../services/admin/overview";
import getUsers from "../../services/admin/getUsers";
import getJobs from "../../services/admin/getJobs";
import me from "../../services/user/me";
import logout from "../../services/user/logout";

import SpotlightCard from "../../components/common/SpotlightCard";
import Aurora from "../../components/common/Aurora";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { tab, no } = useParams();

  const [activeTab, setActiveTab] = useState(tab || "overview");
  const [page, setPage] = useState(Number(no) || 1);
  const [limit, setLimit] = useState(10);

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [users, setUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);

  const [jobs, setJobs] = useState([]);
  const [totalJobs, setTotalJobs] = useState(0);

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalJobs: 0,
    activeUsers: 0,
    candidates: 0,
    recruiters: 0,
  });

  // Sync state with URL params
  useEffect(() => {
    setActiveTab(tab || "overview");
    setPage(Number(page) || 1);
  }, [tab, page]);

  // Load current user
  useEffect(() => {
    loadUser();
  }, []);

  // Load data for active tab whenever it or pagination changes
  useEffect(() => {
    if (activeTab === "overview") loadOverview();
    if (activeTab === "users") loadUsers();
    if (activeTab === "jobs") loadJobs();
  }, [activeTab, page, limit]);

  const loadUser = async () => {
    const response = await me();
    if (response.error) {
      navigate("/login");
    } else {
      setUser(response);
    }
    setLoading(false);
  };

  const loadOverview = async () => {
    setLoading(true);
    const res = await overview();
    if (!res.error) setStats(res);
    setLoading(false);
  };

  const loadUsers = async () => {
    setLoading(true);
    const res = await getUsers(page, limit);
    if (!res.error && res.data) {
      setUsers(res.data);
      setTotalUsers(res.total);
    }
    setLoading(false);
  };

  const loadJobs = async () => {
    setLoading(true);
    const res = await getJobs(page, limit);
    if (!res.error && res.data) {
      setJobs(res.data);
      setTotalJobs(res.total);
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    await logout();
    localStorage.removeItem("authToken");
    localStorage.removeItem("userRole");
    navigate("/login");
  };

  const handleTabChange = (newTab) => {
    setActiveTab(newTab);
    navigate(`/admin/dashboard/${newTab}/1`); // reset to page 1
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    navigate(`/admin/dashboard/${activeTab}/${newPage}`);
  };

  const handleLimitChange = (newLimit) => {
    setLimit(newLimit);
    setPage(1);
    navigate(`/admin/dashboard/${activeTab}/1`);
  };

  if (loading && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white relative overflow-hidden">
      <div className="fixed inset-0 z-0">
        <Aurora
          colorStops={["#3A29FF", "#FF3232", "#FF94B4"]}
          blend={0.5}
          amplitude={0.6}
          speed={2}
        />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="bg-black/30 backdrop-blur-md border-b border-white/10 sticky top-0 z-20">
          <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-[#FF3232] via-[#FF94B4] to-[#FF3232] bg-[length:300%_300%] animate-gradient-text bg-clip-text text-transparent">
                Admin Dashboard
              </h1>
              {user && (
                <p className="text-sm text-gray-400 mt-1">
                  Welcome, {user.name} ({user.email})
                </p>
              )}
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-lg bg-red-600/80 hover:bg-red-600 transition-colors"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Tabs */}
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex gap-4 mb-6 border-b border-white/10">
            {["overview", "users", "jobs"].map((tabName) => (
              <button
                key={tabName}
                onClick={() => handleTabChange(tabName)}
                className={`px-6 py-3 capitalize font-medium transition-colors border-b-2 ${
                  activeTab === tabName
                    ? "border-red-400 text-red-300"
                    : "border-transparent text-gray-400 hover:text-gray-200"
                }`}
              >
                {tabName}
              </button>
            ))}
          </div>

          {/* OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-red-300 mb-4">
                Dashboard Overview
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries({
                  "Total Users": stats.totalUsers,
                  "Active Users": stats.activeUsers,
                  "Total Jobs": stats.totalJobs,
                  Candidates: stats.candidates,
                  Recruiters: stats.recruiters,
                }).map(([label, value], i) => (
                  <SpotlightCard
                    key={i}
                    spotlightColor="rgba(255, 50, 50, 0.2)"
                  >
                    <p className="text-sm text-gray-400 mb-2">{label}</p>
                    <p
                      className={`text-3xl font-bold ${
                        label === "Active Users"
                          ? "text-green-300"
                          : label === "Total Jobs"
                          ? "text-blue-300"
                          : label === "Recruiters"
                          ? "text-pink-300"
                          : "text-red-300"
                      }`}
                    >
                      {value}
                    </p>
                  </SpotlightCard>
                ))}
              </div>
            </div>
          )}

          {/* USERS */}
          {activeTab === "users" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-red-300">All Users</h2>

              {loading ? (
                <div className="text-center py-12">Loading users...</div>
              ) : users.length === 0 ? (
                <SpotlightCard>
                  <p className="text-center text-gray-400">No users found.</p>
                </SpotlightCard>
              ) : (
                <>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {users.map((u) => (
                      <SpotlightCard
                        key={u.id}
                        spotlightColor="rgba(255, 50, 50, 0.2)"
                        className="hover:scale-[1.02] transition-all duration-300"
                      >
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <div>
                              <h3 className="text-lg font-semibold text-red-300">
                                {u.name}
                              </h3>
                              <p className="text-sm text-gray-400">{u.email}</p>
                            </div>
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wide 
                                        flex items-center gap-1
                                        ${
                                          u.is_active
                                            ? "bg-green-400/10 text-green-300 border border-green-500/30 shadow-[0_0_8px_rgba(34,197,94,0.4)]"
                                            : "bg-red-400/10 text-red-300 border border-red-500/30 shadow-[0_0_8px_rgba(248,113,113,0.35)]"
                                        }`}
                            >
                              <span
                                className={`w-2 h-2 rounded-full ${
                                  u.is_active
                                    ? "bg-green-400 animate-pulse"
                                    : "bg-red-400"
                                }`}
                              ></span>
                              {u.is_active ? "Active" : "Inactive"}
                            </span>
                          </div>

                          <p className="text-sm text-gray-400">
                            Role:{" "}
                            <span className="text-gray-300">{u.role}</span>
                          </p>

                          <p className="text-xs text-gray-500">
                            Joined:{" "}
                            {new Date(u.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </SpotlightCard>
                    ))}
                  </div>

                  <Pagination
                    page={page}
                    totalPages={Math.ceil(totalUsers / limit)}
                    onPageChange={handlePageChange}
                    limit={limit}
                    onLimitChange={handleLimitChange}
                    total={totalUsers}
                  />
                </>
              )}
            </div>
          )}

          {/* JOBS */}
          {activeTab === "jobs" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-red-300 mb-4">
                All Jobs
              </h2>

              {loading ? (
                <div className="text-center py-12">Loading jobs...</div>
              ) : jobs.length === 0 ? (
                <SpotlightCard>
                  <p className="text-center text-gray-400">No jobs found.</p>
                </SpotlightCard>
              ) : (
                <>
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {jobs.map((job) => (
                      <SpotlightCard
                        key={job.id}
                        spotlightColor="rgba(255, 50, 50, 0.2)"
                        className="hover:scale-[1.02] transition-all duration-300"
                      >
                        <div className="space-y-4">
                          <h3 className="text-xl font-semibold text-red-300">
                            {job.title}
                          </h3>
                          <p className="text-sm text-gray-400">
                            📍 {job.location}
                          </p>
                          {job.employment_type && (
                            <p className="text-sm text-gray-400">
                              💼 {job.employment_type}
                            </p>
                          )}
                          <p className="text-xs text-gray-500">
                            Recruiter ID: {job.recruiter_id}
                          </p>
                          {job.description && (
                            <p className="text-gray-300 text-sm line-clamp-3">
                              {job.description}
                            </p>
                          )}
                          <p className="text-xs text-gray-500 border-t border-white/10 pt-2">
                            Posted:{" "}
                            {new Date(job.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </SpotlightCard>
                    ))}
                  </div>

                  <Pagination
                    page={page}
                    totalPages={Math.ceil(totalJobs / limit)}
                    onPageChange={handlePageChange}
                    limit={limit}
                    onLimitChange={handleLimitChange}
                    total={totalJobs}
                  />
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
