import api from "../api";

export const signup = async (payload) => {

    try {
    await api.post(`/${payload.role}/signup`, payload);
    return {}
  } catch (error) {
    return {
      error: true,
      message: error.response?.data?.detail || "Signup failed",
    };
  }
};

export default signup;
