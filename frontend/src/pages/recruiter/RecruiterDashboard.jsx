import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import logout from "../../services/user/logout";
import SpotlightCard from "../../components/common/SpotlightCard";
import Aurora from "../../components/common/Aurora";
import Pagination from "../../components/common/Pagination";
import me from "../../services/user/me";
import getMyJobs from "../../services/recruiter/getMyJobs";
import createJob from "../../services/recruiter/createJob";
import getJobTitles from "../../services/recruiter/getJobTitles";
import deleteJob from "../../services/recruiter/deleteJob";
import getJobApplications from "../../services/recruiter/getJobApplications";
import updateApplicationStatus from "../../services/recruiter/updateApplicationStatus";

export default function RecruiterDashboard() {
  const navigate = useNavigate();
  const { tab } = useParams();

  const [activeTab, setActiveTab] = useState(tab || "my-jobs");
  const [jobs, setJobs] = useState([]);
  const [jobTitles, setJobTitles] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalJobs, setTotalJobs] = useState(0);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [selectedJobId, setSelectedJobId] = useState(null);
  const [applications, setApplications] = useState([]);

  const [newJob, setNewJob] = useState({
    title_id: "",
    description: "",
    location: "",
    employment_type: "",
  });

  // sync url
  useEffect(() => {
    navigate(`/recruiter/dashboard/${activeTab}`);
  }, [activeTab]);

  // user me()
  useEffect(() => {
    (async () => {
      const response = await me();
      if (response.error) navigate("/login");
      else setUser(response);
      setLoading(false);
    })();
  }, []);

  // load job titles dynamically
  useEffect(() => {
    if (activeTab === "create-job") loadJobTitles();
  }, [activeTab]);

  const loadJobTitles = async () => {
    const titles = await getJobTitles();
    if (!titles.error) setJobTitles(titles);
  };

  // load jobs for my-jobs & applications job selector
  useEffect(() => {
    if (activeTab === "my-jobs" || activeTab === "applications") loadJobs();
  }, [activeTab, page, limit]);

  const loadJobs = async () => {
    setLoading(true);
    const skip = (page - 1) * limit;

    const res = await getMyJobs(skip, limit);
    if (!res.error) {
      setJobs(res.data);
      setTotalJobs(res.total);
    }

    setLoading(false);
  };

  // load applications when job changes
  useEffect(() => {
    if (activeTab === "applications" && selectedJobId) {
      loadApplications(selectedJobId);
    } else {
      setApplications([]);
    }
  }, [selectedJobId, activeTab]);

  const loadApplications = async (jobId) => {
    setLoading(true);
    const res = await getJobApplications(jobId);
    if (!res.error) setApplications(res);
    setLoading(false);
  };

  const downloadResume = (base64Data, filename) => {
    const link = document.createElement("a");
    link.href = `data:application/octet-stream;base64,${base64Data}`;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;
    const res = await deleteJob(jobId);

    if (!res.error) {
      alert("Job deleted successfully!");
      if (selectedJobId === jobId) setSelectedJobId(null);
      loadJobs();
    } else {
      alert(res.message);
    }
  };

  const handleCreateJob = async (e) => {
    e.preventDefault();
    setLoading(true);

    const res = await createJob({
      ...newJob,
      title_id: Number(newJob.title_id),
    });

    if (!res.error) {
      alert("Job created successfully!");
      setNewJob({
        title_id: "",
        description: "",
        location: "",
        employment_type: "",
      });
      setActiveTab("my-jobs");
      loadJobs();
    } else {
      alert(res.message);
    }

    setLoading(false);
  };

  const handleLogout = async () => {
    try {
      await logout({ token: localStorage.getItem("authToken") });
    } catch {}
    localStorage.removeItem("authToken");
    localStorage.removeItem("userRole");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white relative overflow-hidden">
      <div className="fixed inset-0 z-0">
        <Aurora
          colorStops={["#3A29FF", "#FF94B4", "#4079ff"]}
          blend={0.5}
          amplitude={0.6}
          speed={2}
        />
      </div>

      <div className="relative z-10">
        {/* HEADER */}
        <header className="bg-black/30 backdrop-blur-md border-b border-white/10 sticky top-0 z-20">
          <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-[#FF94B4] via-[#4079ff] to-[#FF94B4] bg-[length:300%_300%] animate-gradient-text bg-clip-text text-transparent">
                Recruiter Dashboard
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
          {/* TABS */}
          <div className="flex gap-4 mb-6 border-b border-white/10">
            {["my-jobs", "create-job", "applications"].map((t) => (
              <button
                key={t}
                onClick={() => {
                  setActiveTab(t);
                  setSelectedJobId(null);
                  setApplications([]);
                }}
                className={`px-6 py-3 capitalize font-medium transition-colors border-b-2 ${
                  activeTab === t
                    ? "border-pink-400 text-pink-300"
                    : "border-transparent text-gray-400 hover:text-gray-200"
                }`}
              >
                {t.replace("-", " ")}
              </button>
            ))}
          </div>

          {/* CREATE JOB TAB */}
          {activeTab === "create-job" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-pink-300 mb-4">
                Create New Job Posting
              </h2>

              <SpotlightCard spotlightColor="rgba(255, 148, 180, 0.2)">
                <form onSubmit={handleCreateJob} className="space-y-4">
                  {/* Title */}
                  <div>
                    <label className="block text-sm mb-2 text-gray-300">
                      Job Title *
                    </label>
                    <select
                      required
                      value={newJob.title_id}
                      onChange={(e) =>
                        setNewJob({ ...newJob, title_id: e.target.value })
                      }
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white"
                    >
                      <option value="">Select Job Title</option>
                      {jobTitles.map((t, idx) => (
                        <option key={idx} value={idx}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Description */}
                  <textarea
                    rows="6"
                    placeholder="Job description..."
                    value={newJob.description}
                    onChange={(e) =>
                      setNewJob({ ...newJob, description: e.target.value })
                    }
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white"
                  />

                  {/* Location & Type */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm mb-2 text-gray-300">
                        Location *
                      </label>
                      <input
                        required
                        type="text"
                        placeholder="Remote, New York, etc."
                        value={newJob.location}
                        onChange={(e) =>
                          setNewJob({ ...newJob, location: e.target.value })
                        }
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm mb-2 text-gray-300">
                        Employment Type
                      </label>
                      <select
                        value={newJob.employment_type}
                        onChange={(e) =>
                          setNewJob({
                            ...newJob,
                            employment_type: e.target.value,
                          })
                        }
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white"
                      >
                        <option value="">Select type</option>
                        <option>Full-time</option>
                        <option>Part-time</option>
                        <option>Contract</option>
                        <option>Internship</option>
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full px-4 py-2 rounded-lg bg-pink-600 hover:bg-pink-700 disabled:opacity-50"
                  >
                    {loading ? "Creating..." : "Create Job"}
                  </button>
                </form>
              </SpotlightCard>
            </div>
          )}

          {/* MY JOBS TAB */}
          {activeTab === "my-jobs" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-pink-300">
                My Job Postings
              </h2>

              {loading ? (
                <div className="text-center py-8">Loading jobs...</div>
              ) : jobs.length === 0 ? (
                <SpotlightCard>
                  <p className="text-center text-gray-400">
                    You have no job postings yet.
                  </p>
                </SpotlightCard>
              ) : (
                <div className="space-y-4">
                  {jobs.map((job) => (
                    <SpotlightCard
                      key={job.id}
                      spotlightColor="rgba(255, 148, 180, 0.2)"
                      className="hover:scale-[1.01] transition"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="text-xl font-semibold text-pink-300">
                            {job.title}
                          </h3>
                          <p className="text-gray-400 text-sm">
                            📍 {job.location}
                          </p>
                          {job.employment_type && (
                            <p className="text-sm text-gray-400 mb-2">
                              💼 {job.employment_type}
                            </p>
                          )}
                          {job.description && (
                            <p className="text-gray-300 text-sm mt-2 line-clamp-2">
                              {job.description}
                            </p>
                          )}
                          <p className="text-xs text-gray-500 mt-2">
                            Posted:{" "}
                            {new Date(job.created_at).toLocaleDateString()}
                          </p>
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() => handleDeleteJob(job.id)}
                            className="px-2 py-1 text-xs rounded bg-red-600 hover:bg-red-700"
                          >
                            Delete
                          </button>

                          <button
                            onClick={() => {
                              setSelectedJobId(job.id);
                              setActiveTab("applications");
                            }}
                            className="px-2 py-1 text-xs rounded bg-blue-600 hover:bg-blue-700"
                          >
                            Show Applications
                          </button>
                        </div>
                      </div>
                    </SpotlightCard>
                  ))}
                </div>
              )}

              <Pagination
                page={page}
                totalPages={Math.ceil(totalJobs / limit)}
                onPageChange={setPage}
                limit={limit}
                onLimitChange={(l) => {
                  setLimit(l);
                  setPage(1);
                }}
                total={totalJobs}
              />
            </div>
          )}

          {/* APPLICATIONS TAB */}
          <div className="space-y-5">
            {applications.map((app) => (
              <SpotlightCard
                key={app.application_id}
                spotlightColor="rgba(255, 148, 180, 0.2)"
                className="relative p-5 rounded-xl border border-white/10 shadow-lg hover:scale-[1.01] transition-all duration-200"
              >
                {/* Header */}
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-300 font-medium">
                    Application ID:{" "}
                    <span className="text-pink-300">{app.application_id}</span>
                  </p>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      app.status === "applied"
                        ? "bg-yellow-500/20 text-yellow-300"
                        : app.status === "accepted"
                        ? "bg-green-500/20 text-green-300"
                        : app.status === "rejected"
                        ? "bg-red-500/20 text-red-300"
                        : "bg-gray-500/20 text-gray-300"
                    }`}
                  >
                    {app.status.toUpperCase()}
                  </span>
                </div>

                {/* Divider */}
                <div className="border-t border-white/5 my-3"></div>

                {/* Applicant Info */}
                <div className="space-y-1">
                  <p className="text-sm text-gray-300">
                    Applicant:{" "}
                    <span className="text-pink-300 font-medium">
                      {app.applicant_name}
                    </span>
                  </p>

                  <p className="text-sm text-gray-400">Email: {app.email}</p>

                  <p className="text-sm text-sky-300 font-medium">
                    Match Score: {(app.similarity_score * 100).toFixed(2)}%
                  </p>
                </div>

                {/* Divider */}
                <div className="border-t border-white/5 my-4"></div>

                {/* Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() =>
                      downloadResume(app.resume_data, app.resume_filename)
                    }
                    className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-xs font-medium transition"
                  >
                    Download Resume
                  </button>

                  <button
                    onClick={async () => {
                      const res = await updateApplicationStatus(
                        app.application_id,
                        "accepted"
                      );
                      if (!res.error) {
                        alert("Application Accepted");
                        loadApplications(selectedJobId);
                      } else alert(res.message);
                    }}
                    className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-xs font-medium transition"
                  >
                    Accept
                  </button>

                  <button
                    onClick={async () => {
                      const res = await updateApplicationStatus(
                        app.application_id,
                        "rejected"
                      );
                      if (!res.error) {
                        alert("Application Rejected");
                        loadApplications(selectedJobId);
                      } else alert(res.message);
                    }}
                    className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-xs font-medium transition"
                  >
                    Reject
                  </button>
                </div>
              </SpotlightCard>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
