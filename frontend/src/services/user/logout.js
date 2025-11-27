import api from "../api";

export const logout = async () => {

    try {
    await api.delete('/user/logout', {
      params: { token: localStorage.getItem("authToken") }
    });

    localStorage.removeItem("authToken")
    return {}
  } catch (error) {
    return {
      error: true,
      message: error.response?.data?.detail || "Login failed",
    };
  }
};

export default logout;
