/* -- FULL CODE WITH APPLICATION PAGINATION -- */

import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import logout from "../../services/user/logout";
import me from "../../services/user/me";
import getAllCandidateJobs from "../../services/candidate/getAllCandidateJobs";
import getMyResume from "../../services/candidate/getMyResume";
import uploadResume from "../../services/candidate/uploadResume";
import deleteMyResume from "../../services/candidate/deleteMyResume";
import applyToJob from "../../services/candidate/applyToJob";
import deleteApplication from "../../services/candidate/deleteApplication";
import getMyApplications from "../../services/candidate/getMyApplications";

import SpotlightCard from "../../components/common/SpotlightCard";
import Aurora from "../../components/common/Aurora";
import Pagination from "../../components/common/Pagination";

export default function CandidateDashboard() {
  const navigate = useNavigate();
  const { tab, page: pageParam } = useParams();

  const [activeTab, setActiveTab] = useState("jobs");
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [user, setUser] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [hasResume, setHasResume] = useState(false);
  const [applyingJobId, setApplyingJobId] = useState(null);

  // 🔵 Pagination state
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalJobs, setTotalJobs] = useState(0);

  // 🔵 Applications pagination
  const [appPage, setAppPage] = useState(1);
  const [appLimit, setAppLimit] = useState(10);
  const [appTotalPages, setAppTotalPages] = useState(1);
  const [appTotal, setAppTotal] = useState(0);

  useEffect(() => {
    if (tab && tab !== activeTab) setActiveTab(tab);
    if (pageParam) {
      if (activeTab === "jobs") setPage(Number(pageParam));
      if (activeTab === "applications") setAppPage(Number(pageParam));
    }
  }, [tab, pageParam]);

  useEffect(() => {
    loadUserData();
  }, []);

  useEffect(() => {
    if (activeTab === "jobs") loadJobs();
    if (activeTab === "applications") loadApplications();
    if (activeTab === "resume") checkResume();
  }, [activeTab, page, limit, appPage, appLimit]);

  const loadUserData = async () => {
    const response = await me();
    if (response.error) return navigate("/login");
    setUser(response);
  };

  const loadJobs = async () => {
    const response = await getAllCandidateJobs(page, limit);
    if (!response.error) {
      setJobs(response.data || []);
      setTotalPages(response.total_pages);
      setTotalJobs(response.total);
    }
  };

  const loadApplications = async () => {
    const response = await getMyApplications(appPage, appLimit);

    if (response.error) return;

    setApplications(response.data || []);
    setAppTotalPages(response.total_pages);
    setAppTotal(response.total);
  };

  const checkResume = async () => {
    const response = await getMyResume();
    if (!response.error && response.file_url) {
      setHasResume(true);
      setResumeFile(response);
    } else {
      setHasResume(false);
      setResumeFile(null);
    }
  };

  const handleApply = async (jobId) => {
    setApplyingJobId(jobId);
    const response = await applyToJob(jobId);
    if (!response.error) {
      alert("Application submitted successfully!");
      loadApplications();
      loadJobs();
    } else {
      alert(response.message || "Failed to apply");
    }
    setApplyingJobId(null);
  };

  const handleDeleteApplication = async (appId) => {
    const response = await deleteApplication(appId);
    if (!response.error) {
      alert("Application deleted successfully!");
      loadApplications();
    } else {
      alert(response.message || "Failed to delete application");
    }
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const response = await uploadResume(file);
    if (!response.error) {
      alert("Resume uploaded successfully!");
      setHasResume(true);
      checkResume();
    } else {
      alert(response.message || "Failed to upload resume");
    }
  };

  const handleDeleteResume = async () => {
    const response = await deleteMyResume();
    if (!response.error) {
      alert("Resume deleted successfully!");
      setHasResume(false);
      setResumeFile(null);
    } else {
      alert(response.message || "Failed to delete resume");
    }
  };

  const handleLogout = async () => {
    await logout({ token: localStorage.getItem("authToken") });
    localStorage.removeItem("authToken");
    localStorage.removeItem("userRole");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white relative overflow-hidden">
      <div className="fixed inset-0 z-0">
        <Aurora
          colorStops={["#3A29FF", "#40ffaa", "#4079ff"]}
          blend={0.5}
          amplitude={0.6}
          speed={2}
        />
      </div>

      <div className="relative z-10">
        <header className="bg-black/30 backdrop-blur-md border-b border-white/10 sticky top-0 z-20">
          <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-[#40ffaa] via-[#4079ff] to-[#40ffaa] animate-gradient-text bg-clip-text text-transparent">
                Candidate Dashboard
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

        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex gap-4 mb-6 border-b border-white/10">
            {["jobs", "applications", "resume"].map((tabName) => (
              <button
                key={tabName}
                onClick={() => navigate(`/candidate/dashboard/${tabName}/1`)}
                className={`px-6 py-3 capitalize font-medium border-b-2 ${
                  activeTab === tabName
                    ? "border-sky-400 text-sky-300"
                    : "border-transparent text-gray-400 hover:text-gray-200"
                }`}
              >
                {tabName}
              </button>
            ))}
          </div>

          {/* JOBS TAB */}
          {activeTab === "jobs" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-sky-300 mb-4">
                Available Jobs
              </h2>

              <div className="space-y-4">
                {jobs.length === 0 ? (
                  <SpotlightCard>
                    <p className="text-center text-gray-400">No jobs found.</p>
                  </SpotlightCard>
                ) : (
                  jobs.map((job) => (
                    <SpotlightCard
                      key={job.id}
                      className="hover:scale-[1.01] transition-all duration-300"
                      spotlightColor="rgba(64, 121, 255, 0.2)"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-xl font-semibold text-white mb-2">
                            {job.title}
                          </h3>
                          <p className="text-sm text-gray-400 mb-1">
                            Job ID: {job.id}
                          </p>
                          <p className="text-sm text-gray-400 mb-2">
                            Location: {job.location || "Not specified"}
                          </p>
                          <p className="text-gray-300 text-sm">
                            {job.description?.slice(0, 180)}...
                          </p>
                        </div>

                        <button
                          onClick={() => handleApply(job.id)}
                          disabled={applyingJobId === job.id}
                          className="px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-700 disabled:opacity-50"
                        >
                          {applyingJobId === job.id ? "Applying..." : "Apply"}
                        </button>
                      </div>
                    </SpotlightCard>
                  ))
                )}
              </div>

              <Pagination
                page={page}
                totalPages={totalPages}
                total={totalJobs}
                limit={limit}
                onPageChange={(p) =>
                  navigate(`/candidate/dashboard/${activeTab}/${p}`)
                }
                onLimitChange={(l) => {
                  setLimit(l);
                  navigate(`/candidate/dashboard/${activeTab}/1`);
                }}
              />
            </div>
          )}

          {/* APPLICATIONS TAB */}
          {activeTab === "applications" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-sky-300 mb-4">
                My Applications
              </h2>

              {applications.length === 0 ? (
                <SpotlightCard>
                  <p className="text-center text-gray-400">
                    You haven't applied yet.
                  </p>
                </SpotlightCard>
              ) : (
                <>
                  <div className="space-y-4">
                    {applications.map((app) => (
                      <SpotlightCard
                        key={app.id}
                        className="hover:scale-[1.01] transition-all duration-300"
                        spotlightColor="rgba(64, 121, 255, 0.2)"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-sm text-gray-400 mb-1">
                              Application ID: {app.id}
                            </p>

                            <p className="text-sm text-gray-400 mb-2">
                              Job ID: {app.job_id}
                            </p>

                            <p className="text-sm text-gray-400 mb-2">
                              Applied:{" "}
                              {new Date(app.applied_at).toLocaleDateString()}
                            </p>

                            {/* Match Score */}
                            <p className="text-sm text-sky-300 font-medium mt-2">
                              Match Score:{" "}
                              {(app.similarity_score * 100).toFixed(2)}%
                            </p>
                          </div>

                          <div className="flex gap-2 items-center">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${
                                app.status === "applied"
                                  ? "bg-yellow-500/20 text-yellow-300"
                                  : app.status === "accepted"
                                  ? "bg-green-500/20 text-green-300"
                                  : app.status === "rejected"
                                  ? "bg-red-500/20 text-red-300"
                                  : "bg-gray-500/20 text-gray-300"
                              }`}
                            >
                              {app.status}
                            </span>

                            <button
                              onClick={() => handleDeleteApplication(app.id)}
                              className="px-3 py-1 rounded-lg bg-red-600 hover:bg-red-700 text-xs"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </SpotlightCard>
                    ))}
                  </div>

                  {/* 🔵 PAGINATION FOR APPLICATIONS */}
                  <Pagination
                    page={appPage}
                    totalPages={appTotalPages}
                    total={appTotal}
                    limit={appLimit}
                    onPageChange={(p) =>
                      navigate(`/candidate/dashboard/applications/${p}`)
                    }
                    onLimitChange={(l) => {
                      setAppLimit(l);
                      navigate(`/candidate/dashboard/applications/1`);
                    }}
                  />
                </>
              )}
            </div>
          )}

          {/* RESUME TAB */}
          {activeTab === "resume" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-sky-300 mb-4">
                Resume Management
              </h2>

              <SpotlightCard spotlightColor="rgba(64, 121, 255, 0.2)">
                <div className="space-y-6">
                  {hasResume && resumeFile?.file_url ? (
                    <div className="flex flex-col gap-4">
                      <p className="text-green-400 mb-2">✓ Resume uploaded</p>

                      {/* 🔵 SMART PREVIEW (no auto-download) */}
                      {resumeFile.file_url.endsWith(".pdf") ? (
                        <iframe
                          src={`https://docs.google.com/gview?embedded=true&url=${resumeFile.file_url}`}
                          className="w-full h-[600px] border rounded-md"
                          title="Resume Preview"
                        />
                      ) : (
                        <div className="p-4 bg-black/20 rounded-lg text-gray-300">
                          Preview not available for DOC/DOCX — Download the file
                          to view it.
                        </div>
                      )}

                      {/* 🔵 DOWNLOAD BUTTON */}
                      <a
                        href={resumeFile.file_url}
                        download
                        className="px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-700 text-center"
                      >
                        Download Resume
                      </a>

                      <div className="flex gap-4">
                        <button
                          onClick={handleDeleteResume}
                          className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700"
                        >
                          Delete Resume
                        </button>

                        <label className="px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-700 cursor-pointer">
                          Update Resume
                          <input
                            type="file"
                            accept=".pdf,.doc,.docx"
                            onChange={handleResumeUpload}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <p className="text-gray-400 mb-4">
                        Upload your resume to apply for jobs.
                      </p>

                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleResumeUpload}
                        className="block w-full text-sm text-gray-400 file:px-4 file:py-2 file:rounded-lg file:bg-sky-600 file:text-white hover:file:bg-sky-700"
                      />

                      <p className="text-xs text-gray-500 mt-2">
                        Accepted formats: PDF, DOC, DOCX
                      </p>
                    </div>
                  )}
                </div>
              </SpotlightCard>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
