export type ResumeAnalysisPayload = {
  uid?: string;
  target_role: string;
  job_description: string;
  resume_text: string;
};

export type ResumeAnalysisResult = {
  ats_score: number;
  keyword_match: number;
  resume_strength: number;
  recruiter_confidence?: number;
  technical_depth?: number;
  market_readiness?: number;
  summary?: string;
  strengths?: string[];
  gaps?: string[];
  recommendations?: string[];
  status_message?: string;
  fallback_mode?: boolean;
  raw?: unknown;
};

export type ResumeAnalysisResponse = {
  success: boolean;
  ai_available?: boolean;
  message?: string;
  error?: string;
  analysis?: ResumeAnalysisResult | null;
  mode_label?: string;
  local_intelligence?: {
    estimated_ats_band: string;
    estimated_recruiter_match: string;
    commentary: string;
    signals: string[];
    resume_words: number;
    matched_keywords: string[];
  };
};

export const API_BASE =
  (process.env.NEXT_PUBLIC_API_URL || "https://hireready-53q1.onrender.com").replace(/\/$/, "");

async function parseResponse(response: Response) {
  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return response.json();
  }

  return response.text();
}

export async function analyzeResume(payload: ResumeAnalysisPayload): Promise<ResumeAnalysisResponse> {
  try {
    const response = await fetch(`${API_BASE}/api/analyze-resume`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await parseResponse(response);

    if (!response.ok) {
      const message = typeof data === "string" ? data : data?.error || data?.message || `HTTP ${response.status}`;
      throw new Error(message);
    }

    return data as ResumeAnalysisResponse;
  } catch (error) {
    console.error("Resume Analysis Error:", error);
    throw error;
  }
}