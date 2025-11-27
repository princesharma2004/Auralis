import api from "../api";

export const overview = async () => {

    try {
    const response = await api.get('/admin/overview', {
      params: { token: localStorage.getItem("authToken") }
    });

    return response.data
  } catch (error) {
    return {
      error: true,
      message: error.response?.data?.detail || "No overview",
    };
  }
};

export default overview;
