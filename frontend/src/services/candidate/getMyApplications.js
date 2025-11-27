import api from "../api";

export default async function getMyApplications(page = 1, limit = 10) {
  try {
    const token = localStorage.getItem("authToken");

    const skip = (page - 1) * limit;

    const res = await api.get(
      `/candidate/my_applications`,
      {
        params: {
          token: token,
          skip: skip,
          limit: limit
        }
      }
    );

    return res.data;

  } catch (err) {
    console.log("❌ Error fetching applications:", err.response?.data);
    return {
      error: true,
      message: err.response?.data?.detail || err.message,
    };
  }
}
