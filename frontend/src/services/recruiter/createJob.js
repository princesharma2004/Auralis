import api from "../api";

const createJob = async (payload) => {
  try {
    const token = localStorage.getItem("authToken");
    const response = await api.post("/recruiter/add_job", payload, {
      params: { token },
    });

    return { error: false, data: response.data };
  } catch (error) {
    return {
      error: true,
      message: error.response?.data?.detail || "Failed to create job",
    };
  }
};

export default createJob;
