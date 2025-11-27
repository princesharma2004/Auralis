import api from "../api";

const deleteApplication = async (app_id) => {
  try {
    const token = localStorage.getItem("authToken");

    const res = await api.delete("/candidate/delete_application", {
      params: { token, app_id },
    });

    return { error: false };
  } catch (err) {
    return {
      error: true,
      message: err.response?.data?.detail || err.message,
    };
  }
};

export default deleteApplication;
