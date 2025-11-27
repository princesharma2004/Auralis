import api from "../api";

export default async function getAllCandidateJobs(page = 1, limit = 10) {
  try {
    const token = localStorage.getItem("authToken");
    const skip = (page - 1) * limit;

    const res = await api.get("/candidate/jobs", {
      params: {
        token,
        skip,
        limit,
      },
    });

    return res.data;
  } catch (error) {
    return {
      error: true,
      message: error.response?.data?.detail || "Failed to load jobs",
    };
  }
}
