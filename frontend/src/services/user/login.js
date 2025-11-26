import api from "../api";

export const login = async (payload) => {

    try {
    const response = await api.post("/user/login", payload);
    localStorage.setItem('authToken', response.data.token);
    localStorage.setItem('userRole', response.data.role);
    return response.data;
  } catch (error) {
    return {
      error: true,
      message: error.response?.data?.detail || "Login failed",
    };
  }
};

export default login;
