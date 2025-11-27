import api from "../api";

export default async function getJobTitles() {
  try {
    const token = localStorage.getItem("authToken");
    const response = await api.get("/recruiter/job_titles", {
      params: { token }
    });
    return response.data;
  } catch (error) {
    return {
      error: true,
      message: error.response?.data?.detail || "Failed to load job titles",
    };
  }
}
