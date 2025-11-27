import api from "../api";

export default async function applyToJob(job_id) {
  try {
    const token = localStorage.getItem("authToken");

    const res = await api.post(
      `/candidate/apply_job?token=${token}&job_id=${job_id}`
    );

    return res.data;

  } catch (err) {
    console.log("❌ Backend error:", err.response?.data);

    return {
      error: true,
      message: err.response?.data?.detail || err.message,
    };
  }
}
