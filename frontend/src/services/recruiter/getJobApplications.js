import api from "../api";

export default async function getJobApplications(jobId, skip = 0, limit = 100) {
  try {
    const token = localStorage.getItem("authToken");

    const res = await api.get("/recruiter/applications", {
      params: { token, job_id: jobId, skip, limit },
    });

    // Map the response to include base64 data for download
    const apps = res.data.data.map((a) => ({
      application_id: a.application_id,
      applicant_name: a.applicant_name,
      email: a.email,
      resume_filename: a.resume_filename,
      resume_data: a.resume_data, // base64 string
      similarity_score: a.similarity_score,
      status: a.status,
    }));

    return apps;
  } catch (err) {
    return {
      error: true,
      message: err.response?.data?.detail || err.message,
    };
  }
}

// Helper to download resume
export function downloadResume(base64Data, filename) {
  const link = document.createElement("a");
  link.href = `data:application/octet-stream;base64,${base64Data}`;
  link.download = filename;
  link.click();
}
