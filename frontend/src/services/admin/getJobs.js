import api from "../api";

export const getJobs = async (page = 1, limit = 10) => {
  try {
    const skip = (page - 1) * limit;
    const res = await api.get("/admin/jobs", { params: {token: localStorage.getItem("authToken"), skip, limit } });
    return { error: false, ...res.data };
  } catch (err) {
    return {
      error: true,
      message: err.response?.data?.detail || err.message || "Failed to load jobs",
    };
  }
};

export default getJobs;
