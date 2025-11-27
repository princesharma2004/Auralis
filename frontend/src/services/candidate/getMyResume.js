import api from "../api";

export default async function getMyResume() {
  const token = localStorage.getItem("authToken");
  try {
    const response = await api.get("candidate/my_resume", {
      params: { token },
      responseType: "blob"
    });

    const file = new Blob([response.data], { type: response.headers["content-type"] });
    const file_url = URL.createObjectURL(file);

    return { file_url, filename: "resume.pdf" };
  } catch (err) {
    return { error: true, message: err.response?.data?.detail || err.message };
  }
}
