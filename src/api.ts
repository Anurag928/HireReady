import axios from "axios";

// Our Flask backend base URL
const BASE_URL = "http://127.0.0.1:5000/api";

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 60000,
  headers: { "Content-Type": "application/json" },
});

export const createUserInBackend = (payload: {
  uid: string;
  name: string | null;
  email: string | null;
  photoURL: string | null;
}) => api.post("/user", payload);

export const submitOnboardingToBackend = (payload: any) => api.post("/onboarding", payload);

export const getUserFromBackend = (uid: string) => api.get(`/user/${uid}`);

export const generateRoadmapInBackend = (uid: string, force_regenerate: boolean = false, strategy_mode?: string) => api.post("/generate-roadmap", { uid, force_regenerate, strategy_mode });

export const getRoadmapFromBackend = (uid: string) => api.get(`/roadmap/${uid}`);

export const getRoadmapHistoryFromBackend = (uid: string) => api.get(`/roadmap/history/${uid}`);

export const getRoadmapVersionFromBackend = (versionId: string) => api.get(`/roadmap/version/${versionId}`);

export const analyzeResumeInBackend = (payload: { uid: string; resume_text: string; target_role: string; job_description?: string; test_mode?: boolean }) => api.post("/analyze-resume", payload);

export const getResumeAnalysisFromBackend = (uid: string) => api.get(`/resume-analysis/${uid}`);

export const getResumeHistoryFromBackend = (uid: string) => api.get(`/resume-history/${uid}`);

export const rewriteResumeSectionInBackend = (payload: { original_text: string; style: string }) => api.post("/rewrite-resume", payload);

export const generateInterviewQuestionsInBackend = (payload: { resume_text: string }) => api.post("/generate-interview-questions", payload);
