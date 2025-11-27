import api from "../api";

export default async function deleteMyResume() {
  try {
    const token = localStorage.getItem("authToken");
    if (!token) {
      return { error: true, message: "Not authenticated" };
    }

    await api.delete("/candidate/delete_my_resume", {
      params: { token },
    });

    return { success: true };
  } catch (err) {
    return {
      error: true,
      message: err.response?.data?.detail || "Failed to delete resume",
    };
  }
}
