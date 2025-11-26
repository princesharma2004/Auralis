import api from "../api";

export const me = async () => {

    try {
    const response = await api.get('/user/me', {
      params: { token: localStorage.getItem("authToken") }
    });

    return response.data
  } catch (error) {
    return {
      error: true,
      message: error.response?.data?.detail || "Not a user",
    };
  }
};

export default me;
