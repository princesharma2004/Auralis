// services/recruiter/updateApplicationStatus.js
import api from "../api";

export default async function updateApplicationStatus(applicationId, newStatus) {
  try {
    const token = localStorage.getItem("authToken");

    const res = await api.get("/recruiter/update_application_status", {
      params: {
        token,
        application_id: applicationId,
        new_status: newStatus,
      },
    });

    return { success: true };
  } catch (err) {
    return {
      error: true,
      message: err.response?.data?.detail || err.message,
    };
  }
}
