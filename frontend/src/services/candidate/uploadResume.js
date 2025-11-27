import api from "../api";

export default async function uploadResume(file) {
  try {
    const token = localStorage.getItem("authToken");
    if (!token) return { error: true, message: "No token provided" };

    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post(
      "/candidate/upload_resume",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
        params: { token },
      }
    );

    return response.data;
  } catch (err) {
    return { error: true, message: err.response?.data?.detail || err.message };
  }
}
