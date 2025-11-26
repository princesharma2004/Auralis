import api from "../api";

const deleteJob = async (jobId) => {
  try {
    const token = localStorage.getItem("authToken");

    await api.delete("/recruiter/remove_job", {
      params: { job_id: jobId, token },
    });

    return { error: false };
  } catch (error) {
    return {
      error: true,
      message: error.response?.data?.detail || "Failed to delete job",
    };
  }
};

export default deleteJob;
