import api from "../api";

export default async function getMyJobs(page = 1, limit = 10)
{
    try {
        const token = localStorage.getItem("authToken");

        const response = await api.get("/recruiter/my_jobs", {
          params: { token, page, limit },
        });

        return {
          error: false,
          data: response.data.data,
          total: response.data.total,
        };
    } catch (error) {
        return {
          error: true,
          message: error.response?.data?.detail || "Failed to load jobs",
        };
    }
};
