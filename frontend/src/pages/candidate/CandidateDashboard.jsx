import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logout from "../../services/user/logout";
import SpotlightCard from "../../components/common/SpotlightCard";
import Aurora from "../../components/common/Aurora";

export default function CandidateDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("jobs");
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [resumeFile, setResumeFile] = useState(null);
  const [hasResume, setHasResume] = useState(false);
  const [applyingJobId, setApplyingJobId] = useState(null);
  const [coverLetter, setCoverLetter] = useState("");

  useEffect(() => {
    loadUserData();
    if (activeTab === "jobs") {
      loadJobs();
    } else if (activeTab === "applications") {
      loadApplications();
    } else if (activeTab === "resume") {
      checkResume();
    }
  }, [activeTab]);

  const loadUserData = async () => {
    const response = await getCurrentUser();
    if (response.error) {
      if (response.message.includes("token") || response.message.includes("Invalid")) {
        navigate("/login");
      }
    } else {
      setUser(response);
    }
    setLoading(false);
  };

  const loadJobs = async () => {
    setLoading(false); //true
    const response = await getAllJobs();
    if (!response.error) {
      setJobs(response);
    }
    setLoading(false);
  };

  const loadApplications = async () => {
    setLoading(false); //true
    const response = await getMyApplications();
    if (!response.error) {
      setApplications(response);
    }
    setLoading(false);
  };

  const checkResume = async () => {
    setLoading(false); //true
    const response = await getMyResume();
    setHasResume(!response.error);
    setLoading(false);
  };

  const handleApply = async (jobId) => {
    setApplyingJobId(jobId);
    const response = await applyToJob(jobId, coverLetter || null);
    if (!response.error) {
      alert("Application submitted successfully!");
      setCoverLetter("");
      loadApplications();
      loadJobs();
    } else {
      alert(response.message || "Failed to apply");
    }
    setApplyingJobId(null);
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith(".pdf") && 
        !file.name.toLowerCase().endsWith(".doc") && 
        !file.name.toLowerCase().endsWith(".docx")) {
      alert("Please upload a PDF, DOC, or DOCX file");
      return;
    }

    setLoading(false); //true
    const response = await uploadResume(file);
    if (!response.error) {
      alert("Resume uploaded successfully!");
      setHasResume(false); //true
    } else {
      alert(response.message || "Failed to upload resume");
    }
    setLoading(false);
  };

  const handleDeleteResume = async () => {
    if (!confirm("Are you sure you want to delete your resume?")) return;

    setLoading(false); //true
    const response = await deleteMyResume();
    if (!response.error) {
      alert("Resume deleted successfully!");
      setHasResume(false);
    } else {
      alert(response.message || "Failed to delete resume");
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      await logout({ token });
      localStorage.removeItem("authToken");
      localStorage.removeItem("userRole");
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      localStorage.removeItem("authToken");
      localStorage.removeItem("userRole");
      navigate("/login");
    }
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
      {/* Aurora Background */}
      <div className="fixed inset-0 z-0">
        <Aurora
          colorStops={["#3A29FF", "#40ffaa", "#4079ff"]}
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
              <h1 className="text-2xl font-bold bg-gradient-to-r from-[#40ffaa] via-[#4079ff] to-[#40ffaa] bg-[length:300%_300%] animate-gradient-text bg-clip-text text-transparent">
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

        {/* Tabs */}
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex gap-4 mb-6 border-b border-white/10">
            {["jobs", "applications", "resume"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 capitalize font-medium transition-colors border-b-2 ${
                  activeTab === tab
                    ? "border-sky-400 text-sky-300"
                    : "border-transparent text-gray-400 hover:text-gray-200"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Jobs Tab */}
          {activeTab === "jobs" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-sky-300 mb-4">
                Available Jobs
              </h2>
              {loading ? (
                <div className="text-center py-12">Loading jobs...</div>
              ) : jobs.length === 0 ? (
                <SpotlightCard>
                  <p className="text-center text-gray-400">No jobs available at the moment.</p>
                </SpotlightCard>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {jobs.map((job) => (
                    <SpotlightCard
                      key={job.id}
                      className="hover:scale-[1.02] transition-all duration-300"
                      spotlightColor="rgba(64, 121, 255, 0.2)"
                    >
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-xl font-semibold text-sky-300 mb-2">
                            {job.title}
                          </h3>
                          <p className="text-sm text-gray-400 mb-2">
                            📍 {job.location}
                          </p>
                          {job.employment_type && (
                            <p className="text-sm text-gray-400 mb-2">
                              💼 {job.employment_type}
                            </p>
                          )}
                        </div>
                        {job.description && (
                          <p className="text-gray-300 text-sm line-clamp-3">
                            {job.description}
                          </p>
                        )}
                        <div className="pt-4 border-t border-white/10">
                          <textarea
                            placeholder="Cover letter (optional)"
                            value={coverLetter}
                            onChange={(e) => setCoverLetter(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 mb-3 focus:outline-none focus:border-sky-400"
                            rows="3"
                          />
                          <button
                            onClick={() => handleApply(job.id)}
                            disabled={applyingJobId === job.id}
                            className="w-full px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {applyingJobId === job.id ? "Applying..." : "Apply Now"}
                          </button>
                        </div>
                      </div>
                    </SpotlightCard>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Applications Tab */}
          {activeTab === "applications" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-sky-300 mb-4">
                My Applications
              </h2>
              {loading ? (
                <div className="text-center py-12">Loading applications...</div>
              ) : applications.length === 0 ? (
                <SpotlightCard>
                  <p className="text-center text-gray-400">
                    You haven't applied to any jobs yet.
                  </p>
                </SpotlightCard>
              ) : (
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
                            Applied: {new Date(app.applied_at).toLocaleDateString()}
                          </p>
                        </div>
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
                      </div>
                    </SpotlightCard>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Resume Tab */}
          {activeTab === "resume" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-sky-300 mb-4">
                Resume Management
              </h2>
              {loading ? (
                <div className="text-center py-12">Loading...</div>
              ) : (
                <SpotlightCard spotlightColor="rgba(64, 121, 255, 0.2)">
                  <div className="space-y-6">
                    {hasResume ? (
                      <>
                        <div className="flex items-center gap-4">
                          <div className="flex-1">
                            <p className="text-green-400 mb-2">✓ Resume uploaded</p>
                            <p className="text-sm text-gray-400">
                              Your resume is ready for job applications.
                            </p>
                          </div>
                          <button
                            onClick={handleDeleteResume}
                            className="px-4 py-2 rounded-lg bg-red-600/80 hover:bg-red-600 transition-colors"
                          >
                            Delete Resume
                          </button>
                        </div>
                      </>
                    ) : (
                      <div>
                        <p className="text-gray-400 mb-4">
                          Upload your resume to apply for jobs.
                        </p>
                        <label className="block">
                          <input
                            type="file"
                            accept=".pdf,.doc,.docx"
                            onChange={handleResumeUpload}
                            className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-sky-600 file:text-white hover:file:bg-sky-700 cursor-pointer"
                          />
                        </label>
                        <p className="text-xs text-gray-500 mt-2">
                          Accepted formats: PDF, DOC, DOCX
                        </p>
                      </div>
                    )}
                  </div>
                </SpotlightCard>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
