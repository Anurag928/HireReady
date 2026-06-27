import axios from "axios";

// Flask backend base URL with production-friendly fallback
const BASE_URL = `${process.env.NEXT_PUBLIC_API_URL || "https://hireready-53q1.onrender.com"}/api`;

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 60000,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

// Global store for recent API stats (for Developer Debug Panel)
export const recentApiStats = {
  lastCall: null as any
};

api.interceptors.request.use(async (config) => {
  (config as any).metadata = { startTime: new Date() };
  
  // Try to attach Firebase ID token if a user is logged in
  try {
    const { auth } = await import("@/lib/firebase");
    if (auth.currentUser) {
      const token = await auth.currentUser.getIdToken();
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (error) {
    // Ignore error if Firebase isn't initialized yet
  }

  return config;
});

api.interceptors.response.use(
  (response) => {
    const duration = new Date().getTime() - (response.config as any).metadata.startTime.getTime();
    recentApiStats.lastCall = {
      url: response.config.url,
      method: response.config.method?.toUpperCase(),
      status: response.status,
      duration,
      requestData: response.config.data,
      responseData: response.data,
      error: null
    };
    return response;
  },
  (error) => {
    const duration = error.config?.metadata?.startTime 
      ? new Date().getTime() - error.config.metadata.startTime.getTime() 
      : 0;
      
    const status = error.response?.status;
    const message = error.response?.data?.error || error.response?.data?.message || error.message;
    const data = error.response?.data;
    
    const errorDetails = {
      status,
      data,
      message,
      url: error.config?.url,
      method: error.config?.method?.toUpperCase(),
      duration
    };

    recentApiStats.lastCall = {
      ...errorDetails,
      requestData: error.config?.data,
      error: message
    };

    // Don't log 404s to console as they are often expected (e.g. checking if roadmap exists)
    if (status !== 404) {
      console.error(
        `[API Request Failed] ${error.config?.method?.toUpperCase() || "UNKNOWN"} ${error.config?.url || "UNKNOWN"}`,
        `\nStatus: ${error.response?.status || "Network Error / CORS Blocked"}`,
        `\nMessage: ${message || "No message available"}`,
        `\nBackend Error:`, error.response?.data || "None"
      );
    }
    
    return Promise.reject(error);
  }
);

export const createUserInBackend = (payload: {
  uid: string;
  name: string | null;
  email: string | null;
  photoURL: string | null;
}) => api.post("/user", payload);

export const deleteUserAccount = (uid: string) => api.delete(`/user/${uid}`);

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

export const startMockInterview = (payload: {
  uid: string;
  target_role: string;
  interview_type: string;
  difficulty: string;
  company_style: string;
  duration: string;
}) => api.post("/mock-interview/start", payload);

export const evaluateMockInterviewAnswer = (payload: {
  settings: any;
  active_question: any;
  answer: string;
}) => api.post("/mock-interview/evaluate", payload);

export const finalizeMockInterview = (payload: {
  uid: string;
  settings: any;
  transcript: any[];
}) => api.post("/mock-interview/finalize", payload);

export const getMockInterviewHistory = (uid: string) => api.get(`/mock-interview/history/${uid}`);

export const deleteMockInterview = (interviewId: string) => api.delete(`/mock-interview/history/${interviewId}`);

export const getDashboardMetrics = (uid: string) => api.get(`/dashboard/${uid}`);

export const getUnifiedHistoryFromBackend = (uid: string) => api.get(`/history/${uid}`);
