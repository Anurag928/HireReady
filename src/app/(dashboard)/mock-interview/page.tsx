"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mic,
  Settings2,
  Play,
  Square,
  ChevronRight,
  Trash2,
  Award,
  AlertCircle,
  BookOpen,
  Briefcase,
  Clock,
  Sparkles,
  CheckCircle2,
  ThumbsUp,
  ThumbsDown,
  ArrowLeft,
  History,
  User,
  Check,
  Loader2,
  Volume2,
  Info,
  Calendar,
  ExternalLink,
  Target,
  Search,
  ChevronDown
} from "lucide-react";
import { fadeIn, slideUp, staggerContainer } from "@/animations";
import { useAuth } from "@/contexts/auth-context";
import { toast } from "sonner";
import Link from "next/link";
import {
  startMockInterview,
  evaluateMockInterviewAnswer,
  finalizeMockInterview,
  getMockInterviewHistory,
  deleteMockInterview
} from "@/api";

// Recharts components
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  RadialBarChart,
  RadialBar
} from "recharts";

// Speech Recognition API Types
interface SpeechRecognitionEvent {
  resultIndex: number;
  results: {
    length: number;
    [key: number]: {
      [key: number]: {
        transcript: string;
      };
    };
  };
}

const ROLE_CATALOG = [
  {
    category: "Software Engineering",
    roles: ["Software Engineer", "Full Stack Developer", "Frontend Developer", "Backend Developer", "MERN Stack Developer", "Java Developer", "Python Developer", "Node.js Developer", "React Developer", "Angular Developer", "Mobile App Developer", "Android Developer", "iOS Developer"]
  },
  {
    category: "Data & Analytics",
    roles: ["Data Analyst", "Business Analyst", "BI Developer", "Power BI Developer", "Data Engineer", "Analytics Engineer"]
  },
  {
    category: "AI / ML",
    roles: ["AI Engineer", "Machine Learning Engineer", "Deep Learning Engineer", "NLP Engineer", "Computer Vision Engineer", "Generative AI Engineer", "LLM Engineer", "MLOps Engineer", "AI Research Engineer"]
  },
  {
    category: "Cloud & DevOps",
    roles: ["DevOps Engineer", "Cloud Engineer", "Site Reliability Engineer", "Platform Engineer", "Infrastructure Engineer", "Kubernetes Engineer"]
  },
  {
    category: "Cyber Security",
    roles: ["Cyber Security Analyst", "Security Engineer", "SOC Analyst", "Penetration Tester", "Ethical Hacker"]
  },
  {
    category: "Product & Management",
    roles: ["Product Manager", "Technical Product Manager", "Project Manager", "Program Manager"]
  },
  {
    category: "Design",
    roles: ["UI Designer", "UX Designer", "Product Designer"]
  },
  {
    category: "Testing & QA",
    roles: ["QA Engineer", "Automation Test Engineer", "SDET"]
  },
  {
    category: "Emerging Roles",
    roles: ["Blockchain Developer", "AR/VR Developer", "Robotics Engineer", "Embedded Systems Engineer", "IoT Engineer"]
  }
] as const;

const LENGTH_OPTIONS = [
  { key: 'quick', label: 'Quick Practice', questions: 5 },
  { key: 'standard', label: 'Standard Interview', questions: 10 },
  { key: 'deep', label: 'Deep Assessment', questions: 15 },
  { key: 'recruiter', label: 'Recruiter Simulation', questions: 20 }
] as const;

const QUESTION_DISTRIBUTIONS: Record<string, { label: string; pct: number }[]> = {
  Mixed: [
    { label: 'Technical', pct: 40 },
    { label: 'Project Deep Dive', pct: 20 },
    { label: 'System Design', pct: 20 },
    { label: 'Behavioral', pct: 20 }
  ],
  Technical: [{ label: 'Technical', pct: 70 }, { label: 'System Design', pct: 20 }, { label: 'Behavioral', pct: 10 }],
  Behavioral: [{ label: 'Behavioral', pct: 70 }, { label: 'Technical', pct: 15 }, { label: 'Project Deep Dive', pct: 15 }],
  'System Design': [{ label: 'System Design', pct: 60 }, { label: 'Technical', pct: 25 }, { label: 'Behavioral', pct: 15 }],
  'Project Deep Dive': [{ label: 'Project Deep Dive', pct: 60 }, { label: 'Technical', pct: 20 }, { label: 'System Design', pct: 20 }],
  'HR Round': [{ label: 'Behavioral', pct: 80 }, { label: 'Technical', pct: 10 }, { label: 'Project Deep Dive', pct: 10 }]
};

const getRecommendedRoles = (profileText: string) => {
  const text = profileText.toLowerCase();
  const recommendations: string[] = [];
  const pushUnique = (items: string[]) => items.forEach(role => { if (!recommendations.includes(role)) recommendations.push(role); });

  if (/(python|sql|power bi|business intelligence|analytics|machine learning|data)/.test(text)) {
    pushUnique(["Data Analyst", "AI Engineer", "Machine Learning Engineer", "Data Engineer", "Power BI Developer"]);
  }
  if (/(react|frontend|ui|ux|javascript|typescript|next\.js)/.test(text)) {
    pushUnique(["Frontend Developer", "React Developer", "Full Stack Developer", "UI Designer"]);
  }
  if (/(node|backend|api|express|nestjs|java|spring)/.test(text)) {
    pushUnique(["Backend Developer", "Node.js Developer", "Software Engineer", "Full Stack Developer"]);
  }
  if (/(aws|azure|gcp|devops|kubernetes|docker|terraform|sre)/.test(text)) {
    pushUnique(["DevOps Engineer", "Cloud Engineer", "Site Reliability Engineer", "Platform Engineer"]);
  }
  if (/(security|soc|penetration|ethical hacker|cyber)/.test(text)) {
    pushUnique(["Cyber Security Analyst", "Security Engineer", "SOC Analyst", "Penetration Tester"]);
  }
  if (/(product|pm|roadmap|stakeholder|launch)/.test(text)) {
    pushUnique(["Product Manager", "Technical Product Manager", "Project Manager"]);
  }
  if (/(test|qa|sdet|automation)/.test(text)) {
    pushUnique(["QA Engineer", "Automation Test Engineer", "SDET"]);
  }

  return recommendations.slice(0, 5);
};

// small animated counter helper
const AnimatedCounter: React.FC<{value:number, className?:string, suffix?:string}> = ({value, className, suffix = "%"}) => {
  const [v, setV] = React.useState(0);
  React.useEffect(()=>{
    let raf: number | null = null;
    const start = performance.now();
    const dur = 600;
    const tick = (t:number)=>{
      const p = Math.min(1,(t-start)/dur);
      setV(Math.round(p*value));
      if(p<1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return ()=>{ if(raf) cancelAnimationFrame(raf); };
  },[value]);
  return <span className={className}>{v}{suffix}</span>;
};

export default function MockInterviewPage() {
  const { user, dbUser } = useAuth();
  
  // Navigation States
  // 'setup' | 'preview' | 'interview' | 'report'
  const [viewState, setViewState] = useState<"setup" | "preview" | "interview" | "report">("setup");
  
  // Interview Setup Config
  const [config, setConfig] = useState({
    target_role: "",
    interview_type: "",
    difficulty: "",
    company_style: "",
    duration: ""
  });

  const [selectedLength, setSelectedLength] = useState<string | null>(null);
  const [questionCount, setQuestionCount] = useState<number>(0);
  const [estimatedMinutes, setEstimatedMinutes] = useState<number>(0);
  const [roleSearch, setRoleSearch] = useState("");
  const [roleSelectorOpen, setRoleSelectorOpen] = useState(true);
  const [recentRoles, setRecentRoles] = useState<string[]>([]);
  const [roleTouched, setRoleTouched] = useState(false);

  useEffect(() => {
    const found = LENGTH_OPTIONS.find(l => l.key === selectedLength) || null;
    const count = found?.questions || 0;
    setQuestionCount(count);
    const map: Record<number, number> = { 5: 13, 10: 25, 15: 40, 20: 52 };
    const duration = found ? (map[count] || 0) : 0;
    setEstimatedMinutes(duration);
    setConfig(prev => ({ ...prev, duration: duration ? `${duration} min` : "" }));
  }, [selectedLength]);

  useEffect(() => {
    try {
      const key = 'mockInterviewRecentRoles_v1';
      const stored = typeof window !== 'undefined' ? localStorage.getItem(key) : null;
      if (stored) setRecentRoles(JSON.parse(stored));
    } catch {
      setRecentRoles([]);
    }
  }, []);

  useEffect(() => {
    if (roleTouched) return;
    const profileRole = (dbUser?.target_role || dbUser?.role || user?.displayName || "AI/ML Engineer") as string;
    if (profileRole) setConfig(prev => ({ ...prev, target_role: profileRole }));
  }, [dbUser, user, roleTouched]);

  const getQuestionDistribution = (type: string) => {
    return QUESTION_DISTRIBUTIONS[type] || QUESTION_DISTRIBUTIONS.Mixed;
  };

  const profileText = [
    dbUser?.skills,
    dbUser?.resume_summary,
    dbUser?.roadmap_focus,
    dbUser?.analysis,
    dbUser?.summary,
    dbUser?.target_role,
    dbUser?.role,
    user?.displayName
  ]
    .filter(Boolean)
    .map((value) => Array.isArray(value) ? value.join(" ") : String(value))
    .join(" ");

  const recommendedRoles = getRecommendedRoles(profileText);
  const filteredRoleGroups = ROLE_CATALOG.map((group) => ({
    ...group,
    roles: group.roles.filter((role) => {
      if (!roleSearch.trim()) return true;
      const q = roleSearch.toLowerCase();
      return role.toLowerCase().includes(q) || group.category.toLowerCase().includes(q);
    })
  })).filter((group) => group.roles.length > 0);

  const missingFields = [
    !config.target_role ? "Please select a Target Role" : null,
    !selectedLength ? "Please select an Interview Length" : null,
    !config.interview_type ? "Please select an Interview Type" : null,
    !config.difficulty ? "Please select Difficulty" : null,
    !config.company_style ? "Please select a Host Style" : null
  ].filter(Boolean) as string[];

  const isConfigComplete = missingFields.length === 0;
  const interviewReadinessScore = isConfigComplete ? Math.min(95, 60 + (selectedLength ? 8 : 0) + (config.interview_type ? 8 : 0) + (config.difficulty ? 8 : 0) + (config.company_style ? 8 : 0) + (config.target_role ? 8 : 0)) : 0;

  const selectionCardClass = (selected: boolean, tone: "blue" | "purple" | "cyan" = "blue") => {
    const selectedStyles = {
      blue: "bg-blue-50 border-cyan-400 dark:bg-cyan-500/10 shadow-[0_0_40px_rgba(6,182,212,0.18)] ring-1 ring-cyan-400/20",
      purple: "bg-purple-50 border-cyan-400 dark:bg-cyan-500/10 shadow-[0_0_40px_rgba(139,92,246,0.18)] ring-1 ring-cyan-400/20",
      cyan: "bg-cyan-50 border-cyan-400 dark:bg-cyan-500/10 shadow-[0_0_40px_rgba(6,182,212,0.18)] ring-1 ring-cyan-400/20"
    };
    const idleStyles = "bg-white border-slate-200 dark:bg-white/[0.04] dark:border-white/10 hover:-translate-y-0.5 hover:shadow-[0_0_25px_rgba(139,92,246,0.10)]";
    return `${selected ? selectedStyles[tone] : idleStyles} rounded-2xl border transition-all duration-300 relative overflow-hidden`;
  };

  const updateRecentRoles = (role: string) => {
    setRecentRoles((prev) => {
      const next = [role, ...prev.filter((item) => item !== role)].slice(0, 6);
      try {
        localStorage.setItem('mockInterviewRecentRoles_v1', JSON.stringify(next));
      } catch {
        // ignore storage errors
      }
      return next;
    });
  };

  const handleSelectRole = (role: string) => {
    setRoleTouched(true);
    setConfig((prev) => ({ ...prev, target_role: role }));
    updateRecentRoles(role);
  };

  // Recruiter confidence should be stable and not depend on question count/length.
  const [recruiterConfidence, setRecruiterConfidence] = React.useState<number>(() => {
    // default fallback
    return 75;
  });

  // Initialize recruiterConfidence once from localStorage or user profile metadata.
  React.useEffect(() => {
    try {
      const key = 'recruiterConfidence_v1';
      const stored = typeof window !== 'undefined' ? localStorage.getItem(key) : null;
      if (stored) {
        setRecruiterConfidence(Number(stored));
        return;
      }

      // derive from available user profile signals if present (resume intelligence, ATS, tech score)
      if (user) {
        const resume = (user as any).resumeScore || (user as any).resume_intel || null;
        const ats = (user as any).atsScore || (user as any).ats_score || null;
        const tech = (user as any).technicalDepthScore || (user as any).techScore || null;
        const roadmap = (user as any).roadmapScore || null;
        let sum = 0;
        let count = 0;
        [resume, ats, tech, roadmap].forEach(v => {
          if (typeof v === 'number') { sum += v; count++; }
        });
        if (count > 0) {
          const derived = Math.round(sum / count);
          setRecruiterConfidence(Math.min(95, Math.max(35, derived)));
          return;
        }
      }

      // fallback default remains
      setRecruiterConfidence(75);
    } catch (e) {
      setRecruiterConfidence(75);
    }
  }, [user]);


  const saveConfigToHistory = (cfg: any) => {
    try {
      const key = 'mockInterviewConfigs_v1';
      const existing = JSON.parse(localStorage.getItem(key) || '[]');
      // eslint-disable-next-line react-hooks/purity
      const entry = { id: Date.now(), date: new Date().toISOString(), config: cfg };
      const updated = [entry, ...existing].slice(0, 50);
      localStorage.setItem(key, JSON.stringify(updated));
      setHistory(prev => [entry, ...prev]);
    } catch (e) {
      console.warn('Failed to persist config to localStorage', e);
    }
  };

  const saveSessionState = (updates: any) => {
    if (typeof window === 'undefined') return;
    try {
      const existing = JSON.parse(localStorage.getItem('activeMockInterviewSession') || '{}');
      const newState = { ...existing, ...updates };
      localStorage.setItem('activeMockInterviewSession', JSON.stringify(newState));
    } catch (e) {}
  };

  const clearSessionState = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('activeMockInterviewSession');
    }
  };

  // History & Progress States
  const [history, setHistory] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [comparisonReport, setComparisonReport] = useState<any | null>(null);

  // Active Session States
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answerText, setAnswerText] = useState("");
  const [isSubmittingAnswer, setIsSubmittingAnswer] = useState(false);
  const [activeEvaluation, setActiveEvaluation] = useState<any | null>(null);
  
  // Follow-up States
  const [followUpQuestion, setFollowUpQuestion] = useState<string | null>(null);
  const [followUpAnswer, setFollowUpAnswer] = useState("");
  const [isFollowUpStep, setIsFollowUpStep] = useState(false);
  const [isEvaluatingFollowUp, setIsEvaluatingFollowUp] = useState(false);

  // Live transcript accumulator
  const [sessionTranscript, setSessionTranscript] = useState<any[]>([]);
  const [interviewStartedTime, setInterviewStartedTime] = useState<number>(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Media (Webcam) Stream
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);

  // Voice Speech-to-Text Recognition States
  const [recognition, setRecognition] = useState<any>(null);
  const [isListening, setIsListening] = useState(false);
  const [responseTab, setResponseTab] = useState<"Speak" | "Transcript" | "Notes">("Speak");
  const [notes, setNotes] = useState("");

  // Final scorecard report
  const [scorecard, setScorecard] = useState<any | null>(null);
  const [isFinalizing, setIsFinalizing] = useState(false);

  const liveProgress = questions.length > 0 ? Math.round(((currentQuestionIndex + (activeEvaluation ? 1 : 0)) / questions.length) * 100) : 0;

  const fetchHistory = async () => {
    if (!user?.uid) return;
    setLoadingHistory(true);
    try {
      const res = await getMockInterviewHistory(user.uid);
      if (res.data?.success) {
        setHistory(res.data.data.history || []);
      }
    } catch (err) {
      console.error("Failed to load interview history:", err);
    } finally {
      setLoadingHistory(false);
    }
  };

  // Initial loads
  useEffect(() => {
    if (user?.uid) {
      fetchHistory();
      if (typeof window !== 'undefined') {
        try {
          const saved = localStorage.getItem('activeMockInterviewSession');
          if (saved) {
            const parsed = JSON.parse(saved);
            if (parsed && parsed.questions && parsed.questions.length > 0) {
              setQuestions(parsed.questions);
              if (parsed.config) setConfig(parsed.config);
              if (parsed.currentQuestionIndex !== undefined) setCurrentQuestionIndex(parsed.currentQuestionIndex);
              if (parsed.sessionTranscript) setSessionTranscript(parsed.sessionTranscript);
              if (parsed.activeEvaluation) setActiveEvaluation(parsed.activeEvaluation);
              if (parsed.answerText) setAnswerText(parsed.answerText);
              if (parsed.followUpQuestion) setFollowUpQuestion(parsed.followUpQuestion);
              if (parsed.followUpAnswer) setFollowUpAnswer(parsed.followUpAnswer);
              if (parsed.isFollowUpStep !== undefined) setIsFollowUpStep(parsed.isFollowUpStep);
              setViewState("interview");
            }
          }
        } catch (e) {}
      }
    }
  }, [user]);

  // Handle SpeechRecognition Setup
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRec) {
        const rec = new SpeechRec();
        rec.continuous = true;
        rec.interimResults = true;
        rec.lang = "en-US";

        rec.onresult = (event: SpeechRecognitionEvent) => {
          let transcriptStr = "";
          for (let i = event.resultIndex; i < event.results.length; i++) {
            transcriptStr += event.results[i][0].transcript;
          }
          if (isFollowUpStep) {
            setFollowUpAnswer(transcriptStr);
          } else {
            setAnswerText(transcriptStr);
          }
        };

        rec.onerror = (err: any) => {
          console.error("Speech recognition error:", err);
          setIsListening(false);
        };

        rec.onend = () => {
          setIsListening(false);
        };

        setRecognition(rec);
      }
    }
  }, [isFollowUpStep]);

  // Session timer management
  useEffect(() => {
    if (viewState === "interview") {
      setInterviewStartedTime(Date.now());
      setElapsedTime(0);
      timerRef.current = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [viewState]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      setCameraStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsCameraActive(true);
    } catch (err) {
      console.warn("Camera stream access not available:", err);
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
  };

  // Webcam stream control
  useEffect(() => {
    if (viewState === "interview" && isCameraActive) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [viewState, isCameraActive]);





  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this interview record?")) return;
    try {
      const res = await deleteMockInterview(id);
      if (res.data?.success) {
        setHistory(prev => prev.filter(item => item._id !== id));
        if (scorecard && scorecard._id === id) {
          setScorecard(null);
        }
      }
    } catch (err) {
      console.error("Failed to delete interview:", err);
    }
  };

  const handleStartInterview = async () => {
    if (!user?.uid) return;
    setViewState("interview");
    setIsSubmittingAnswer(true);
    setActiveEvaluation(null);
    setAnswerText("");
    setFollowUpQuestion(null);
    setIsFollowUpStep(false);
    setCurrentQuestionIndex(0);
    setSessionTranscript([]);

    try {
      const payload = {
        uid: user.uid,
        ...config,
        question_count: questionCount,
        // eslint-disable-next-line react-hooks/purity
        seed: Date.now()
      };
      // persist chosen configuration for quick access
      saveConfigToHistory(payload);

      const res = await startMockInterview(payload);
      if (res.data?.success && res.data.data.questions) {
        setQuestions(res.data.data.questions);
        saveSessionState({ 
          questions: res.data.data.questions, 
          config, 
          currentQuestionIndex: 0, 
          sessionTranscript: [], 
          // eslint-disable-next-line react-hooks/purity
          timestamp: Date.now() 
        });
      } else {
        alert("Failed to initialize questions. Using fallback configuration.");
        setQuestions(getFallbackQuestions());
        saveSessionState({ questions: getFallbackQuestions(), config, currentQuestionIndex: 0, sessionTranscript: [] });
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || err.message || "Unknown error";
      console.error("Failed to load questions:", err);
      alert(`Failed to load interview questions: ${errorMsg}\n\nUsing fallback configuration.`);
      setQuestions(getFallbackQuestions());
    } finally {
      setIsSubmittingAnswer(false);
    }
  };

  const handleSpeechToggle = () => {
    if (!recognition) {
      alert("Speech recognition API is not supported in this browser. Please use Google Chrome.");
      return;
    }
    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      recognition.start();
      setIsListening(true);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!answerText.trim()) return;
    setIsSubmittingAnswer(true);
    setIsListening(false);
    if (recognition) recognition.stop();

    const currentQuestion = questions[currentQuestionIndex];
    
    // As per requirement: "Do NOT evaluate publicly. Store evaluation internally. Move to next question."
    // And "Evaluate ALL answers together."
    const finalTranscript = [...sessionTranscript, {
      questionNumber: currentQuestionIndex + 1,
      type: currentQuestion.type,
      difficulty: currentQuestion.difficulty,
      question: currentQuestion.question,
      answer: answerText,
      evaluation: null // Evaluated together at the end
    }];
    
    setSessionTranscript(finalTranscript);
    saveSessionState({ sessionTranscript: finalTranscript });
    
    if (currentQuestionIndex === questions.length - 1) {
      handleEndInterview(finalTranscript);
    } else {
      setCurrentQuestionIndex(prev => {
        const nextIdx = prev + 1;
        saveSessionState({
          currentQuestionIndex: nextIdx,
          answerText: "",
          activeEvaluation: null,
          followUpQuestion: null,
          followUpAnswer: "",
          isFollowUpStep: false
        });
        return nextIdx;
      });
      setAnswerText("");
      setActiveEvaluation(null);
      setFollowUpQuestion(null);
      setFollowUpAnswer("");
      setIsFollowUpStep(false);
    }
    
    setIsSubmittingAnswer(false);
  };

  const handleSubmitFollowUp = async () => {
    if (!followUpAnswer.trim()) return;
    setIsEvaluatingFollowUp(true);
    setIsListening(false);
    if (recognition) recognition.stop();

    const currentQuestion = questions[currentQuestionIndex];
    try {
      const res = await evaluateMockInterviewAnswer({
        settings: config,
        active_question: {
          ...currentQuestion,
          question: followUpQuestion,
          intent: "Follow-up evaluation testing clarity and consistency."
        },
        answer: followUpAnswer
      });

      if (res.data?.success) {
        const evaluation = res.data.data;
        
        // Log details into transcript
        const transcriptEntry = {
          questionNumber: currentQuestionIndex + 1,
          type: currentQuestion.type,
          difficulty: currentQuestion.difficulty,
          question: currentQuestion.question,
          answer: answerText,
          evaluation: activeEvaluation,
          follow_up_question: followUpQuestion,
          follow_up_answer: followUpAnswer,
          follow_up_evaluation: evaluation
        };
        
        let updated: any[] = [];
        setSessionTranscript(prev => {
          updated = [...prev, transcriptEntry];
          saveSessionState({ sessionTranscript: updated });
          return updated;
        });
        
        if (currentQuestionIndex === questions.length - 1) {
          handleEndInterview(updated);
        } else {
          setCurrentQuestionIndex(prev => {
            const nextIdx = prev + 1;
            saveSessionState({ currentQuestionIndex: nextIdx, answerText: "", activeEvaluation: null, followUpQuestion: null, followUpAnswer: "", isFollowUpStep: false });
            return nextIdx;
          });
          setAnswerText("");
          setActiveEvaluation(null);
          setFollowUpQuestion(null);
          setFollowUpAnswer("");
          setIsFollowUpStep(false);
        }
      }
    } catch (err: any) {
      console.error("Failed to evaluate follow up:", err);
      toast.error("Failed to evaluate follow-up answer. Please try again.");
      
      // Do NOT advance to next question on failure. Keep follow-up question active and allow resubmission.
    } finally {
      setIsEvaluatingFollowUp(false);
    }
  };

  const handleNextQuestion = () => {
    // If we didn't have a follow-up, or we completed it, log simple transcript entry
    if (activeEvaluation && !isFollowUpStep && !followUpQuestion) {
      const currentQuestion = questions[currentQuestionIndex];
      const existsInTranscript = sessionTranscript.some(item => item.questionNumber === currentQuestionIndex + 1);
      
      if (!existsInTranscript) {
        setSessionTranscript(prev => {
          const updated = [...prev, {
            questionNumber: currentQuestionIndex + 1,
            type: currentQuestion.type,
            difficulty: currentQuestion.difficulty,
            question: currentQuestion.question,
            answer: answerText,
            evaluation: activeEvaluation
          }];
          saveSessionState({ sessionTranscript: updated });
          return updated;
        });
      }
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => {
        const nextIdx = prev + 1;
        saveSessionState({
          currentQuestionIndex: nextIdx,
          answerText: "",
          activeEvaluation: null,
          followUpQuestion: null,
          followUpAnswer: "",
          isFollowUpStep: false
        });
        return nextIdx;
      });
      setAnswerText("");
      setActiveEvaluation(null);
      setFollowUpQuestion(null);
      setFollowUpAnswer("");
      setIsFollowUpStep(false);
    } else {
      handleEndInterview();
    }
  };

  const handleEndInterview = async (explicitTranscript?: any[]) => {
    if (!user?.uid) return;
    
    let updatedTranscript = explicitTranscript || [...sessionTranscript];
    
    if (!explicitTranscript) {
      // Add current answer to transcript if not already saved
      const currentQuestion = questions[currentQuestionIndex];
      const exists = updatedTranscript.some(item => item.questionNumber === currentQuestionIndex + 1);
      
      if (!exists && answerText.trim()) {
        updatedTranscript.push({
          questionNumber: currentQuestionIndex + 1,
          type: currentQuestion.type,
          difficulty: currentQuestion.difficulty,
          question: currentQuestion.question,
          answer: answerText,
          evaluation: null,
          follow_up_question: followUpQuestion,
          follow_up_answer: followUpAnswer
        });
      }
    }

    if (updatedTranscript.length === 0) {
      // User aborted without answering anything
      setViewState("setup");
      clearSessionState();
      return;
    }

    console.log("Interview completed");

    setIsFinalizing(true);
    setViewState("report");
    stopCamera();

    console.log("Generating final score");

    try {
      const res = await finalizeMockInterview({
        uid: user.uid,
        settings: {
          ...config,
          duration: `${Math.floor(elapsedTime / 60)} min`
        },
        transcript: updatedTranscript
      });

      if (res.data?.success) {
        console.log("Results generated");
        setScorecard(res.data.data);
        fetchHistory(); // refresh history
        clearSessionState();
      } else {
        alert("Failed to compile final scorecard.");
        setViewState("setup"); // revert view state on failure
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || err.message || "Unknown error";
      console.error("Failed to finalize interview:", err);
      alert(`Evaluation Failed: ${errorMsg}\n\nPlease check your network connection and try again.`);
      setViewState("setup"); // revert view state on failure
    } finally {
      setIsFinalizing(false);
    }
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const getFallbackQuestions = () => [
    {
      question_number: 1,
      type: "Technical",
      difficulty: "Medium",
      intent: "Evaluating production readiness, docker, and cloud patterns.",
      question: "Can you explain the structural difference between multi-stage Docker builds and standard Dockerfiles, and why this matters in production ML setups?",
      guidelines: "Expect candidate to explain size reduction, security isolation, keeping compiler chains out of output image, and caching stages."
    },
    {
      question_number: 2,
      type: "Behavioral",
      difficulty: "Medium",
      intent: "Evaluating teamwork, critical conflict management, and ownership.",
      question: "Describe a situation where you discovered a major bug or design bottleneck in someone else's code right before deployment. How did you communicate this?",
      guidelines: "Check for diplomatic communication, collaborative solutions, ownership, and priority alignment."
    },
    {
      question_number: 3,
      type: "Project Deep Dive",
      difficulty: "Hard",
      intent: "Evaluating core data flow, modeling architecture, and framework choice.",
      question: "When deploying model metrics drift monitoring, how did you architect the automated alerting pipeline to prevent alert fatigue?",
      guidelines: "Look for alert thresholds, sliding-window triggers, webhook integration, and fallback logging."
    },
    {
      question_number: 4,
      type: "Role-Specific",
      difficulty: "Medium",
      intent: "Evaluating day-to-day software lifecycle and infrastructure constraints.",
      question: "How do you handle secrets, credentials, and API tokens securely in a high-velocity production environment?",
      guidelines: "Look for references to HashiCorp Vault, AWS Secrets Manager, GitHub encrypted actions secrets, and dynamic loading."
    }
  ];

  // Radar chart axes data compilation
  const getRadarData = () => {
    if (!scorecard) return [];
    return [
      { subject: "Technical Skills", score: scorecard.technicalScore || 70, fullMark: 100 },
      { subject: "Communication", score: scorecard.communicationScore || 70, fullMark: 100 },
      { subject: "Problem Solving", score: scorecard.problemSolvingScore || 70, fullMark: 100 },
      { subject: "Confidence", score: scorecard.confidenceScore || 70, fullMark: 100 },
      { subject: "Leadership / Culture", score: scorecard.overallScore - 5 > 0 ? scorecard.overallScore - 5 : 70, fullMark: 100 }
    ];
  };

  // Timeline question scores compilation
  const getTimelineData = () => {
    if (!scorecard || !scorecard.timeline) return [];
    return scorecard.timeline.map((item: any) => ({
      name: `Q${item.questionNumber}`,
      Overall: item.overallScore,
      Technical: item.technicalScore,
      Communication: item.communicationScore
    }));
  };

  // Score distribution statistics
  const getScoreDistributionData = () => {
    if (!scorecard) return [];
    return [
      { name: "Technical", Score: scorecard.technicalScore || 70 },
      { name: "Communication", Score: scorecard.communicationScore || 70 },
      { name: "Problem Solving", Score: scorecard.problemSolvingScore || 70 },
      { name: "Confidence", Score: scorecard.confidenceScore || 70 },
      { name: "Sys Design", Score: scorecard.systemDesignReadiness || 70 },
      { name: "Prod Readiness", Score: scorecard.productionReadiness || 70 }
    ];
  };

  const getHiringVerdictColor = (verdict: string) => {
    const v = (verdict || "").toLowerCase();
    if (v.includes("strong hire") || v.includes("proceed")) return "text-emerald-500 bg-emerald-500/10 border-emerald-500/20";
    if (v.includes("hire")) return "text-emerald-400 bg-emerald-400/10 border-emerald-400/20";
    if (v.includes("hold") || v.includes("reassess") || v.includes("borderline")) return "text-amber-500 bg-amber-500/10 border-amber-500/20";
    return "text-red-500 bg-red-500/10 border-red-500/20";
  };

  const getGradeAndColor = (score: number) => {
    if (score >= 95) return { grade: "A+", color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/20" };
    if (score >= 90) return { grade: "A", color: "text-emerald-400", bg: "bg-emerald-400/10", border: "border-emerald-400/20" };
    if (score >= 85) return { grade: "B+", color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/20" };
    if (score >= 80) return { grade: "B", color: "text-blue-400", bg: "bg-blue-400/10", border: "border-blue-400/20" };
    if (score >= 70) return { grade: "C+", color: "text-cyan-500", bg: "bg-cyan-500/10", border: "border-cyan-500/20" };
    if (score >= 60) return { grade: "C", color: "text-amber-500", bg: "bg-amber-500/10", border: "border-amber-500/20" };
    return { grade: "D", color: "text-red-500", bg: "bg-red-500/10", border: "border-red-500/20" };
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "#10b981"; // emerald
    if (score >= 80) return "#3b82f6"; // blue
    if (score >= 70) return "#06b6d4"; // cyan
    if (score >= 60) return "#f59e0b"; // amber
    return "#ef4444"; // red
  };

  return (
    <div className="relative min-h-screen w-full px-4 md:px-8 pb-4 overflow-x-hidden font-sans bg-[#f8fafc] dark:bg-[#050816]">
      
      {/* Universal Grain Noise overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.015] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

      {/* Aurora floating glow blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <motion.div
          animate={{
            x: [0, 60, -30, 0],
            y: [0, -40, 30, 0],
            scale: [1, 1.15, 0.95, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -top-32 -left-32 w-80 h-80 bg-accent-blue/10 rounded-full blur-[80px] dark:bg-accent-blue/15"
        />
        <motion.div
          animate={{
            x: [0, -60, 40, 0],
            y: [0, 50, -30, 0],
            scale: [1, 0.95, 1.1, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -bottom-32 -right-32 w-80 h-80 bg-accent-purple/10 rounded-full blur-[80px] dark:bg-accent-purple/15"
        />
      </div>

      <div className="relative z-10 w-full max-w-[1800px] mx-auto flex flex-col gap-6 overflow-x-hidden">
        
        {/* ==================================================================================== */}
        {/* VIEWSTATE: SETUP & HISTORY */}
        {/* ==================================================================================== */}
        {viewState === "setup" && (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="flex flex-col gap-8 w-full"
          >
            {/* Premium SaaS Hero Section */}
            <div className="w-full max-w-[1800px] mx-auto min-h-[320px] flex flex-col lg:flex-row items-center gap-12 pt-6 pb-12">
              
              {/* Left Column: Content */}
              <div className="flex-1 flex flex-col items-start gap-6 z-10 relative w-full">
                {/* Top Badge */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="inline-flex items-center justify-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.15)] relative overflow-hidden group"
                >
                  <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  <span className="text-[10px] sm:text-xs font-bold text-cyan-500 tracking-widest uppercase">AI Recruiter Operating System</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                </motion.div>

                {/* Main Heading */}
                <motion.h1 
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
                  className="text-5xl md:text-6xl xl:text-7xl font-black tracking-tighter leading-[1.1] text-transparent bg-clip-text bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 drop-shadow-sm pb-2"
                >
                  Mock Interview <br className="hidden lg:block" />
                  Intelligence
                </motion.h1>

                {/* Highlight Line */}
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1, delay: 0.4 }}
                  className="text-base md:text-lg font-semibold text-foreground/80 max-w-2xl"
                >
                  Powered by <span className="text-cyan-500 drop-shadow-[0_0_8px_rgba(6,182,212,0.4)]">AI Recruiters</span>, <span className="text-blue-500 drop-shadow-[0_0_8px_rgba(59,130,246,0.4)]">Real Hiring Signals</span>, and <span className="text-purple-500 drop-shadow-[0_0_8px_rgba(168,85,247,0.4)]">Personalized Career Intelligence</span>.
                </motion.div>

                {/* Subtitle */}
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="text-lg md:text-xl leading-relaxed text-slate-600 dark:text-slate-300 max-w-4xl"
                >
                  Experience recruiter-grade interview simulations tailored to your profile, projects, skills, and career goals. Receive intelligent evaluations, real-world hiring feedback, and personalized improvement strategies.
                </motion.p>

                {/* Statistics Strip */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full mt-4"
                >
                  {[
                    { label: "Questions Generated", value: 5000, suffix: "+" },
                    { label: "Interview Types", value: 25, suffix: "+" },
                    { label: "AI Accuracy", value: 95, suffix: "%" },
                    { label: "Recruiter Personas", value: 15, suffix: "+" }
                  ].map((stat, i) => (
                    <div key={i} className="flex flex-col items-start p-4 rounded-2xl bg-white/[0.85] dark:bg-white/[0.04] backdrop-blur-xl border border-border/50 hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
                      <span className="text-2xl font-black text-foreground flex items-center">
                        <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                      </span>
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mt-1">{stat.label}</span>
                    </div>
                  ))}
                </motion.div>
              </div>

              {/* Right Column: AI Orb (Desktop Only) */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="hidden lg:flex flex-1 items-center justify-center relative min-h-[400px]"
              >
                {/* Outer Glow */}
                <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/10 via-blue-500/10 to-purple-500/10 blur-[100px] rounded-full" />
                
                {/* Rotating Rings */}
                <div className="absolute w-80 h-80 rounded-full border border-cyan-500/20 border-dashed animate-[spin_20s_linear_infinite]" />
                <div className="absolute w-64 h-64 rounded-full border border-purple-500/20 border-dotted animate-[spin_15s_linear_infinite_reverse]" />
                <div className="absolute w-96 h-96 rounded-full border border-blue-500/10 animate-[spin_30s_linear_infinite]" />

                {/* Pulse Elements */}
                <div className="absolute w-48 h-48 bg-gradient-to-br from-cyan-400/20 to-purple-600/20 rounded-full blur-xl animate-pulse" style={{ animationDuration: '3s' }} />
                
                {/* Center Core */}
                <div className="relative w-32 h-32 rounded-full bg-background/80 backdrop-blur-md border border-border/80 shadow-[0_0_50px_rgba(59,130,246,0.3)] flex items-center justify-center overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/10 to-purple-600/10" />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60" />
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 shadow-[0_0_30px_rgba(6,182,212,0.8)] animate-pulse flex items-center justify-center">
                    <Mic className="w-6 h-6 text-white" />
                  </div>
                </div>

                {/* Floating Particles / Badges */}
                <motion.div animate={{ y: [-10, 10, -10] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} className="absolute top-10 left-10 px-3 py-1.5 rounded-full bg-background/80 backdrop-blur-md border border-border/50 shadow-lg flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="text-[10px] font-bold text-foreground uppercase tracking-wider">Evaluating</span>
                </motion.div>
                
                <motion.div animate={{ y: [10, -10, 10] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }} className="absolute bottom-10 right-10 px-3 py-1.5 rounded-full bg-background/80 backdrop-blur-md border border-border/50 shadow-lg flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-cyan-400" />
                  <span className="text-[10px] font-bold text-foreground uppercase tracking-wider">Listening</span>
                </motion.div>
                
              </motion.div>
            </div>

            {!isConfigComplete && (
              <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-300 backdrop-blur-xl">
                <div className="font-semibold">Complete all interview configuration fields before launching the simulation.</div>
                <ul className="mt-2 space-y-1 text-xs opacity-90">
                  {missingFields.map((msg) => (
                    <li key={msg}>• {msg}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Layout Grid: Setup (Left) & Preview (Right) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full items-start">
              
              {/* Setup panel (left) */}
              <div className="bg-card/45 backdrop-blur-xl border border-border/60 rounded-3xl p-6 md:p-8 flex flex-col gap-6 shadow-xl relative overflow-hidden group">
                <div className="absolute -right-20 -top-20 w-48 h-48 bg-accent-blue/5 rounded-full blur-[50px] pointer-events-none" />
                
                <h3 className="text-lg font-bold flex items-center gap-2 border-b border-border/40 pb-4">
                  <Settings2 className="w-5 h-5 text-accent-blue" />
                  Configure Simulation
                </h3>

                <div className="flex flex-col gap-5">
                  {/* Target Role */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between gap-3">
                      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Target Role</label>
                      <button
                        onClick={() => setRoleSelectorOpen((prev) => !prev)}
                        className="text-[11px] font-semibold text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
                      >
                        Smart Search
                        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${roleSelectorOpen ? 'rotate-180' : ''}`} />
                      </button>
                    </div>

                    <div className={`${selectionCardClass(!!config.target_role, 'blue')} p-4` }>
                      <button
                        type="button"
                        onClick={() => setRoleSelectorOpen((prev) => !prev)}
                        className="w-full flex items-center justify-between gap-3 text-left"
                      >
                        <div>
                          <div className="text-lg font-semibold text-foreground">{config.target_role || 'Select a target role'}</div>
                          <div className="text-sm text-muted-foreground opacity-70">Search, browse, and pick one role</div>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          {config.target_role ? <Check className="w-4 h-4 text-emerald-400" /> : <Search className="w-4 h-4" />}
                        </div>
                      </button>

                      <AnimatePresence>
                        {roleSelectorOpen && (
                          <motion.div
                            initial={{ opacity: 0, height: 0, y: -4 }}
                            animate={{ opacity: 1, height: 'auto', y: 0 }}
                            exit={{ opacity: 0, height: 0, y: -4 }}
                            transition={{ duration: 0.2 }}
                            className="mt-4 overflow-hidden"
                          >
                            <div className="relative">
                              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                              <input
                                value={roleSearch}
                                onChange={(e) => setRoleSearch(e.target.value)}
                                placeholder="Search roles by title or category"
                                className="w-full rounded-2xl border border-border/60 bg-background/60 pl-10 pr-4 py-3 text-sm outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                              />
                            </div>

                            {(recentRoles.length > 0 || recommendedRoles.length > 0) && (
                              <div className="mt-4 grid gap-4 md:grid-cols-2">
                                {recentRoles.length > 0 && (
                                  <div>
                                    <div className="mb-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Recent Roles</div>
                                    <div className="flex flex-wrap gap-2">
                                      {recentRoles.map((role) => (
                                        <button key={role} onClick={() => handleSelectRole(role)} className="rounded-full border border-border/60 bg-background/50 px-3 py-1.5 text-xs text-foreground hover:border-cyan-400/50 hover:bg-cyan-500/10 transition-colors">
                                          {role}
                                        </button>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {recommendedRoles.length > 0 && (
                                  <div>
                                    <div className="mb-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Recommended for You</div>
                                    <div className="flex flex-wrap gap-2">
                                      {recommendedRoles.map((role) => (
                                        <button key={role} onClick={() => handleSelectRole(role)} className="rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1.5 text-xs text-cyan-700 dark:text-cyan-100 hover:border-cyan-400 hover:bg-cyan-500/20 transition-colors">
                                          {role}
                                        </button>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}

                            <div className="mt-4 max-h-72 overflow-y-auto pr-1 custom-scrollbar space-y-4">
                              {filteredRoleGroups.length === 0 ? (
                                <div className="rounded-2xl border border-border/50 bg-background/40 px-4 py-3 text-sm text-muted-foreground">No roles match your search.</div>
                              ) : filteredRoleGroups.map((group) => (
                                <div key={group.category}>
                                  <div className="mb-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">{group.category}</div>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    {group.roles.map((role) => {
                                      const selected = config.target_role === role;
                                      return (
                                        <motion.button
                                          key={role}
                                          onClick={() => handleSelectRole(role)}
                                          whileHover={{ translateY: -2 }}
                                          animate={selected ? { scale: 1.02 } : { scale: 1 }}
                                          className={`${selectionCardClass(selected, 'cyan')} p-3 text-left`}
                                        >
                                          <div className="flex items-start justify-between gap-3">
                                            <div>
                                              <div className="text-sm font-semibold text-foreground">{role}</div>
                                              <div className="text-[11px] text-muted-foreground opacity-70">{group.category}</div>
                                            </div>
                                            {selected && <Check className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />}
                                          </div>
                                        </motion.button>
                                      );
                                    })}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                    {!config.target_role && <div className="text-xs text-red-500">Please select a Target Role</div>}
                  </div>

                  {/* Interview Length - animated selection cards */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Interview Length</label>
                    <div className="grid grid-cols-2 gap-3">
                      {LENGTH_OPTIONS.map(opt => {
                        const selected = selectedLength === opt.key;
                        return (
                          <motion.button
                            key={opt.key}
                            onClick={() => setSelectedLength(opt.key)}
                            whileHover={{ translateY: -2 }}
                            animate={selected ? { scale: 1.02 } : { scale: 1 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                            className={`p-4 text-left ${selectionCardClass(selected, 'cyan')}`}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <div className="text-lg font-semibold text-foreground">{opt.label}</div>
                                <div className="text-sm text-muted-foreground opacity-70 mt-1">{opt.questions} Questions</div>
                              </div>
                              {selected && <Check className="w-4 h-4 text-cyan-400 shrink-0 mt-1" />}
                            </div>
                          </motion.button>
                        );
                      })}
                    </div>
                    {!selectedLength && <div className="text-xs text-red-500">Please select an Interview Length</div>}
                  </div>

                  {/* Interview Type - cards */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Interview Type</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {['Technical','Behavioral','Mixed','System Design','Project Deep Dive','HR Round'].map(type => {
                        const selected = config.interview_type === type;
                        return (
                          <motion.button
                            key={type}
                            onClick={() => setConfig({ ...config, interview_type: type })}
                            whileHover={{ translateY: -2 }}
                            animate={selected ? { scale: 1.02 } : { scale: 1 }}
                            className={`p-3 text-left ${selectionCardClass(selected, 'blue')}`}
                          >
                            <div className="flex items-center justify-between gap-2">
                              <div className="text-sm font-semibold text-foreground">{type}</div>
                              {selected && <Check className="w-4 h-4 text-cyan-400" />}
                            </div>
                          </motion.button>
                        );
                      })}
                    </div>
                    {!config.interview_type && <div className="text-xs text-red-500">Please select an Interview Type</div>}
                  </div>

                  {/* Difficulty */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Difficulty</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {['Beginner','Intermediate','Advanced','Recruiter Challenge'].map(lvl => {
                        const selected = config.difficulty === lvl;
                        return (
                          <motion.button
                            key={lvl}
                            onClick={() => setConfig({ ...config, difficulty: lvl })}
                            whileHover={{ translateY: -2 }}
                            animate={selected ? { scale: 1.02 } : { scale: 1 }}
                            className={`p-3 text-left ${selectionCardClass(selected, 'purple')}`}
                          >
                            <div className="flex items-center justify-between gap-2">
                              <div className="text-sm font-semibold text-foreground">{lvl}</div>
                              {selected && <Check className="w-4 h-4 text-cyan-400" />}
                            </div>
                          </motion.button>
                        );
                      })}
                    </div>
                    {!config.difficulty && <div className="text-xs text-red-500">Please select Difficulty</div>}
                  </div>

                  {/* Host Style */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Host Style</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {['Friendly Mentor','Startup CTO','Senior Engineering Manager','FAANG Interviewer','Technical Recruiter'].map(h => {
                        const selected = config.company_style === h;
                        return (
                          <motion.button
                            key={h}
                            onClick={() => setConfig({ ...config, company_style: h })}
                            whileHover={{ translateY: -2 }}
                            animate={selected ? { scale: 1.02 } : { scale: 1 }}
                            className={`p-3 text-left ${selectionCardClass(selected, 'blue')}`}
                          >
                            <div className="flex items-center justify-between gap-2">
                              <div className="text-sm font-semibold text-foreground">{h}</div>
                              {selected && <Check className="w-4 h-4 text-cyan-400" />}
                            </div>
                          </motion.button>
                        );
                      })}
                    </div>
                    {!config.company_style && <div className="text-xs text-red-500">Please select a Host Style</div>}
                  </div>

                  {/* Live Preview removed to avoid duplication; use Recruiter Intelligence panel on the right */}
                </div>

                {/* Left CTA removed - use the premium CTA on the right panel only */}
              </div>

              {/* Right: Compact AI Interview Preview */}
              <div className="flex flex-col gap-6 w-full">
                <div className="bg-card/45 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-[0_0_40px_rgba(59,130,246,0.08)] flex flex-col gap-4 hover:-translate-y-1 hover:shadow-[0_0_60px_rgba(139,92,246,0.12)] transition-transform">
                  <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2">Recruiter Intelligence</h3>

                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <div className="text-sm font-bold text-foreground">{config.target_role}</div>
                      <div className="text-xs text-muted-foreground">{config.interview_type || 'Select interview type'} · {config.difficulty || 'Select difficulty'}</div>
                    </div>

                    <div className="text-right">
                      <div className="text-sm font-bold text-foreground">Questions</div>
                      <div className="text-xs text-muted-foreground">{questionCount || '—'}</div>
                      <div className="text-sm font-bold text-foreground mt-2">Estimated</div>
                      <div className="text-xs text-muted-foreground">{estimatedMinutes ? `${estimatedMinutes} min` : '—'}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="rounded-2xl border border-white/10 bg-background/30 p-3">
                      <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Recruiter Style</div>
                      <div className="mt-1 font-semibold text-foreground">{config.company_style || 'Select host style'}</div>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-background/30 p-3">
                      <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Difficulty Level</div>
                      <div className="mt-1 font-semibold text-foreground">{config.difficulty || 'Select difficulty'}</div>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-background/30 p-3 col-span-2">
                      <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Interview Readiness Score</div>
                      <div className="mt-1 flex items-center gap-3">
                        <div className="text-2xl font-black text-cyan-300">{isConfigComplete ? interviewReadinessScore : '—'}</div>
                        <div className="text-xs text-muted-foreground">{isConfigComplete ? 'Configuration is complete and ready to launch.' : 'Complete all fields to generate readiness.'}</div>
                      </div>
                    </div>
                  </div>

                  {/* Segmented gradient distribution bar */}
                  <div className="mt-3">
                    <div className="h-4 w-full rounded-full bg-background/20 backdrop-blur-sm overflow-hidden border border-white/6">
                      <div className="flex h-full items-center">
                        {getQuestionDistribution(config.interview_type || 'Mixed').map((d, i) => {
                          const gradients: any = {
                            'Technical': 'linear-gradient(90deg, #06b6d4, #3b82f6)',
                            'Project Deep Dive': 'linear-gradient(90deg, #7c3aed, #8b5cf6)',
                            'System Design': 'linear-gradient(90deg, #f59e0b, #fb923c)',
                            'Behavioral': 'linear-gradient(90deg, #10b981, #34d399)'
                          };
                          return (
                            <motion.div key={i} title={`${d.label} ${d.pct}%`} className="h-full" style={{ width: `${d.pct}%`, background: gradients[d.label] || 'linear-gradient(90deg,#64748b,#94a3b8)' }} initial={{ width: 0 }} animate={{ width: `${d.pct}%` }} transition={{ duration: 0.8, ease: 'easeOut' }} />
                          );
                        })}
                      </div>
                    </div>

                    <div className="mt-2 grid grid-cols-2 gap-2 text-[12px] text-muted-foreground">
                      {getQuestionDistribution(config.interview_type || 'Mixed').map((d,i)=> (
                        <div key={i} className="flex items-center gap-2">
                          <span className="w-3 h-3 rounded-full" style={{background: (()=>{
                            if(d.label==='Technical') return 'linear-gradient(90deg,#06b6d4,#3b82f6)';
                            if(d.label==='Project Deep Dive') return 'linear-gradient(90deg,#7c3aed,#8b5cf6)';
                            if(d.label==='System Design') return 'linear-gradient(90deg,#f59e0b,#fb923c)';
                            return 'linear-gradient(90deg,#10b981,#34d399)';
                          })()}} />
                          <div>{d.label}</div>
                          <div className="ml-auto font-bold">{d.pct}%</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recruiter Confidence mini gauge */}
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div style={{width:64,height:64}}>
                        <ResponsiveContainer width={64} height={64}>
                          <RadialBarChart cx="50%" cy="50%" innerRadius="70%" outerRadius="100%" barSize={8} data={[{name:'conf', value: recruiterConfidence}]} startAngle={180} endAngle={0}>
                            <RadialBar dataKey="value" cornerRadius={30} fill="#06b6d4" />
                          </RadialBarChart>
                        </ResponsiveContainer>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <div className="text-xs text-muted-foreground">Recruiter Confidence</div>
                          <span title="Based on profile analysis, resume intelligence, project quality, ATS compatibility, and roadmap readiness. Independent of interview length.">
                            <Info className="w-3.5 h-3.5 text-muted-foreground/60" />
                          </span>
                        </div>
                        <div className="text-xl font-black text-accent-blue"><AnimatedCounter value={recruiterConfidence} /></div>
                      </div>
                    </div>

                    <div className="text-right text-[12px] text-muted-foreground">Strong interview structure generated based on role requirements.</div>
                  </div>

                </div>

                <div className="flex items-center justify-center">
                  <button
                    onClick={() => setViewState("preview")}
                    disabled={!isConfigComplete}
                    className={`w-full lg:w-2/3 py-4 rounded-2xl font-bold shadow-lg transform transition-all flex items-center justify-center gap-3 ${isConfigComplete ? 'bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 text-white hover:-translate-y-0.5 hover:shadow-[0_0_60px_rgba(99,102,241,0.18)]' : 'bg-slate-400/40 text-slate-200 cursor-not-allowed opacity-70'}`}
                  >
                    <span>Proceed to Preview</span>
                    <ChevronRight className="w-4 h-4 opacity-90" />
                  </button>
                </div>
              </div>

            </div>
          </motion.div>
        )}

        {/* ==================================================================================== */}
        {/* VIEWSTATE: PREVIEW SCREEN */}
        {/* ==================================================================================== */}
        {viewState === "preview" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-4xl mx-auto flex flex-col gap-8"
          >
            <div className="bg-card/45 backdrop-blur-xl border border-border/60 rounded-3xl p-8 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-accent-blue/10 rounded-full blur-[80px] pointer-events-none" />
              
              <h2 className="text-3xl font-black text-foreground mb-2">Interview Briefing</h2>
              <p className="text-muted-foreground mb-8">Review your session configuration and expected focus areas before starting.</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Configuration Summary */}
                <div className="flex flex-col gap-4">
                  <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider border-b border-border/40 pb-2">Session Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs text-muted-foreground">Target Role</div>
                      <div className="font-bold text-foreground">{config.target_role}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Type</div>
                      <div className="font-bold text-foreground">{config.interview_type}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Difficulty</div>
                      <div className="font-bold text-foreground">{config.difficulty}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Host Style</div>
                      <div className="font-bold text-foreground">{config.company_style}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Total Questions</div>
                      <div className="font-bold text-foreground">{questionCount}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Estimated Duration</div>
                      <div className="font-bold text-foreground">{estimatedMinutes} minutes</div>
                    </div>
                  </div>
                </div>

                {/* Focus Areas & Strategy */}
                <div className="flex flex-col gap-4">
                  <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider border-b border-border/40 pb-2">Expected Focus Areas</h3>
                  <div className="flex flex-wrap gap-2">
                    {config.target_role?.toLowerCase().includes("data") || config.target_role?.toLowerCase().includes("bi") ? (
                      ["SQL", "Data Modeling", "Business Insights", "Statistics"].map(f => <span key={f} className="px-3 py-1 bg-accent-blue/10 text-accent-blue rounded-lg text-sm font-semibold">{f}</span>)
                    ) : config.target_role?.toLowerCase().includes("ai") || config.target_role?.toLowerCase().includes("machine") ? (
                      ["Machine Learning", "Deep Learning", "MLOps", "Model Deployment"].map(f => <span key={f} className="px-3 py-1 bg-accent-blue/10 text-accent-blue rounded-lg text-sm font-semibold">{f}</span>)
                    ) : (
                      ["Data Structures", "Algorithms", "System Design", "Problem Solving", "Backend Core"].map(f => <span key={f} className="px-3 py-1 bg-accent-blue/10 text-accent-blue rounded-lg text-sm font-semibold">{f}</span>)
                    )}
                  </div>
                  
                  <div className="mt-4">
                    <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3">Question Distribution</h3>
                    <div className="h-4 w-full rounded-full bg-background/20 backdrop-blur-sm overflow-hidden border border-white/6 flex">
                      {getQuestionDistribution(config.interview_type || 'Mixed').map((d, i) => {
                        const gradients: any = {
                          'Technical': 'linear-gradient(90deg, #06b6d4, #3b82f6)',
                          'Project Deep Dive': 'linear-gradient(90deg, #7c3aed, #8b5cf6)',
                          'System Design': 'linear-gradient(90deg, #f59e0b, #fb923c)',
                          'Behavioral': 'linear-gradient(90deg, #10b981, #34d399)'
                        };
                        return (
                          <div key={i} title={`${d.label} ${d.pct}%`} className="h-full" style={{ width: `${d.pct}%`, background: gradients[d.label] || 'linear-gradient(90deg,#64748b,#94a3b8)' }} />
                        );
                      })}
                    </div>
                    <div className="mt-2 grid grid-cols-2 gap-2 text-[12px] text-muted-foreground">
                      {getQuestionDistribution(config.interview_type || 'Mixed').map((d,i)=> (
                        <div key={i} className="flex items-center gap-2">
                          <span className="w-3 h-3 rounded-full" style={{background: (()=>{
                            if(d.label==='Technical') return 'linear-gradient(90deg,#06b6d4,#3b82f6)';
                            if(d.label==='Project Deep Dive') return 'linear-gradient(90deg,#7c3aed,#8b5cf6)';
                            if(d.label==='System Design') return 'linear-gradient(90deg,#f59e0b,#fb923c)';
                            return 'linear-gradient(90deg,#10b981,#34d399)';
                          })()}} />
                          <div>{d.label}</div>
                          <div className="ml-auto font-bold">{d.pct}%</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* AI Strategy Summary */}
              <div className="mt-8 p-5 bg-accent-purple/5 border border-accent-purple/10 rounded-2xl flex items-start gap-4">
                <Info className="w-5 h-5 text-accent-purple shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-accent-purple uppercase tracking-wider mb-1">AI Recruiter Strategy</h4>
                  <p className="text-sm text-foreground/80 leading-relaxed">
                    The {config.company_style} will evaluate your technical depth and problem-solving framework. 
                    Expect follow-up questions challenging your design decisions. Stay structured in your answers and speak clearly into your microphone.
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-border/40">
                <button onClick={() => setViewState("setup")} className="px-6 py-3 rounded-xl font-bold bg-background/50 border border-border/60 hover:bg-muted text-foreground transition-all">
                  Back to Setup
                </button>
                <button onClick={handleStartInterview} className="px-8 py-3 rounded-xl font-bold bg-gradient-to-r from-accent-blue to-accent-purple text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center gap-2">
                  <Play className="w-4 h-4 fill-current" /> Start Interview
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* ==================================================================================== */}
        {/* VIEWSTATE: ACTIVE LIVE INTERVIEW SESSION */}
        {/* ==================================================================================== */}
        {viewState === "interview" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col xl:flex-row gap-6 w-full items-start justify-center max-w-[1300px] mx-auto"
          >
            {/* 1. LEFT PANEL: SESSION SNAPSHOT & CAMERA */}
            <div className="flex flex-col gap-6 order-3 xl:order-1 w-full xl:max-w-[320px] shrink-0">
              
              {/* Snapshot Stats Card */}
              <div className="bg-card/45 backdrop-blur-xl border border-border/60 rounded-3xl p-5 shadow-lg flex flex-col gap-4 relative overflow-hidden">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-extrabold tracking-tight text-foreground flex items-center gap-3">
                      <span className="px-3 py-1 rounded-full bg-gradient-to-r from-accent-blue to-accent-purple text-xs font-black text-background">{config.target_role}</span>
                      <span className="text-[11px] text-muted-foreground">Mock Interview</span>
                    </h3>

                    <div className="mt-3 flex items-center gap-2">
                      <span className="text-[10px] px-2 py-1 rounded-full bg-muted border border-border text-muted-foreground font-semibold">{config.company_style}</span>
                      <span className="text-[10px] px-2 py-1 rounded-full bg-background/5 border border-accent-purple text-accent-purple font-semibold">{config.difficulty}</span>
                      <span className="ml-2 text-[10px] px-2 py-1 rounded-full bg-accent-blue/10 text-accent-blue font-bold">{questions.length ? `${currentQuestionIndex+1} / ${questions.length}` : "0 / 0"}</span>
                    </div>
                  </div>

                  <div className="absolute -top-8 -right-8 w-44 h-44 rounded-full blur-[40px] bg-accent-purple/20 pointer-events-none" />
                </div>

                <div className="flex flex-col gap-3 mt-4">
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <div className="text-xs text-muted-foreground">Expected Duration</div>
                      <div className="font-bold text-foreground">{config.duration}</div>
                    </div>

                    <div className="flex-1">
                      <div className="text-xs text-muted-foreground">Session Timer</div>
                      <div className="font-mono font-bold text-accent-blue">{formatTimer(elapsedTime)}</div>
                    </div>
                  </div>
                </div>
              </div>

                {/* Interview Environment (voice-only) */}
                <div className="bg-card/45 backdrop-blur-xl border border-border/60 rounded-3xl p-4 flex flex-col gap-4 shadow-lg">
                  <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Interview Environment</h4>
                  <div className="grid grid-cols-1 gap-3">
                    {[
                      { label: 'Microphone', status: isListening ? 'Listening' : 'Ready', color: isListening ? 'bg-red-500' : 'bg-emerald-400' },
                      { label: 'AI Recruiter', status: 'Online', color: 'bg-emerald-400' },
                      { label: 'Connection', status: 'Stable', color: 'bg-emerald-400' },
                      { label: 'Speech-to-Text', status: recognition ? (isListening ? 'Active' : 'Idle') : 'Unavailable', color: recognition ? 'bg-emerald-400' : 'bg-amber-400' }
                    ].map((s, i) => (
                      <div key={i} className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <span className={`w-3 h-3 rounded-full ${s.color} animate-pulse`} />
                          <span className="text-sm font-medium text-foreground">{s.label}</span>
                        </div>
                        <div className="text-sm text-muted-foreground">{s.status}</div>
                      </div>
                    ))}
                  </div>
                </div>

              {/* Voice control orb */}
              <div className="mx-auto mt-2 flex items-center justify-center">
                <div className={`relative w-28 h-28 rounded-full transition-all duration-300 ${isListening ? 'bg-gradient-to-r from-red-500 to-amber-500 shadow-[0_0_30px_rgba(248,113,113,0.12)]' : 'bg-gradient-to-tr from-accent-blue to-accent-purple shadow-[0_0_24px_rgba(99,102,241,0.08)]'}`}>
                  <button onClick={handleSpeechToggle} className="absolute inset-3 rounded-full flex items-center justify-center text-white text-xl font-bold">
                    <Mic className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Voice wave helper animation (when listening) */}
              <AnimatePresence>
                {isListening && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="p-4 rounded-3xl bg-accent-blue/5 border border-accent-blue/10 flex items-center justify-between gap-4"
                  >
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-accent-blue">Transcribing Speech...</span>
                      <span className="text-[10px] text-muted-foreground">Speak clearly into your microphone.</span>
                    </div>

                    <div className="flex items-center gap-0.5">
                      {[...Array(6)].map((_, i) => (
                        <motion.div
                          key={i}
                          animate={{ scaleY: [0.4, 1.6, 0.4] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.06 }}
                          className="w-1 h-6 bg-accent-blue rounded-full origin-center"
                        />
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>

            {/* 2. CENTER PANEL: ACTIVE QUESTION & RESPONSE INPUT */}
            <div className="bg-card/45 backdrop-blur-xl border border-border/60 rounded-3xl p-6 md:p-8 flex flex-col gap-6 shadow-xl min-h-[320px] order-1 xl:order-2 w-full max-w-[900px]">
              
              {/* Question metadata header */}
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2 border-b border-border/40 pb-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold bg-accent-blue/10 text-accent-blue border border-accent-blue/15 px-2.5 py-1 rounded-full uppercase tracking-wider">{questions.length > 0 ? `Question ${currentQuestionIndex + 1}` : "Question"}</span>
                  <span className="hidden md:inline text-xs font-bold bg-muted border border-border text-muted-foreground px-2.5 py-1 rounded-full uppercase tracking-wider">{questions[currentQuestionIndex]?.type || "Technical"}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold bg-muted/5 text-muted-foreground px-2.5 py-1 rounded-full uppercase tracking-wider">{questions[currentQuestionIndex]?.type || "Technical"}</span>
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Est. Difficulty: <span className="font-bold text-foreground">{questions[currentQuestionIndex]?.difficulty || config.difficulty}</span></span>
                </div>
              </div>

              {/* Simulated Interviewer Avatar & Dialogue Card */}
              <div className="flex flex-col md:flex-row gap-5 items-start p-5 rounded-2xl bg-background/55 border border-border/50 relative overflow-hidden group">
                <div className="absolute right-0 bottom-0 w-32 h-32 bg-accent-blue/5 rounded-full blur-2xl pointer-events-none" />
                
                {/* Robot Avatar visualization */}
                <div className="relative shrink-0 mx-auto md:mx-0">
                  <div className="w-16 h-16 rounded-full bg-accent-blue/5 border border-accent-blue/20 flex items-center justify-center relative shadow-sm">
                    <div className="absolute inset-0 rounded-full border border-accent-blue/20 animate-ping opacity-15" style={{ animationDuration: '3s' }} />
                    <div className="absolute inset-[-10px] rounded-full border border-accent-blue/15 animate-ping opacity-10" style={{ animationDuration: '2s' }} />
                    <span className="text-2xl select-none">🤖</span>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5 text-center md:text-left flex-1">
                  <span className="text-[10px] font-bold text-accent-blue uppercase tracking-widest">AI Recruiter Host</span>
                  {questions.length === 0 && isSubmittingAnswer ? (
                    <div className="flex items-center gap-2 justify-center md:justify-start py-2">
                      <Loader2 className="w-4 h-4 text-accent-blue animate-spin" />
                      <span className="text-sm text-muted-foreground">Analyzing profile and generating questions...</span>
                    </div>
                  ) : (
                    <p className="text-foreground font-semibold text-sm md:text-base break-words overflow-hidden max-w-full leading-relaxed whitespace-pre-wrap">
                      {isFollowUpStep ? `"${followUpQuestion}"` : `"${questions[currentQuestionIndex]?.question}"`}
                    </p>
                  )}
                </div>
              </div>

              {/* Recruiter Intent Card */}
              {!isFollowUpStep && questions[currentQuestionIndex]?.intent && (
                <div className="p-4 rounded-xl bg-accent-purple/5 border border-accent-purple/10 flex items-start gap-3">
                  <Info className="w-4 h-4 text-accent-purple shrink-0 mt-0.5" />
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] font-bold text-accent-purple uppercase tracking-wider">Recruiter Intent</span>
                    <p className="text-xs text-muted-foreground leading-relaxed break-words max-w-full">
                      {questions[currentQuestionIndex].intent}
                    </p>
                  </div>
                </div>
              )}

              {/* Answer Input Area */}
              <div className="flex-1 flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                    {isFollowUpStep ? "Your Follow-up Answer" : "Your Answer"}
                  </label>
                  
                  {recognition && (
                    <button
                      onClick={handleSpeechToggle}
                      className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition-all duration-300 flex items-center gap-1.5 cursor-pointer ${isListening ? 'bg-red-500/10 border-red-500/20 text-red-500 animate-pulse' : 'bg-background hover:bg-muted border-border text-foreground/75'}`}
                    >
                      <Mic className="w-3.5 h-3.5" />
                      {isListening ? "Stop Voice Mode" : "Voice Interview Mode"}
                    </button>
                  )}
                </div>

                {/* Tabs: Speak / Transcript / Notes */}
                <div>
                  <div className="flex gap-2 mb-3">
                    {['Speak','Transcript','Notes'].map(t => (
                      <button key={t} onClick={() => setResponseTab(t as "Speak" | "Transcript" | "Notes")} className={`px-3 py-2 rounded-xl text-xs font-semibold ${responseTab===t ? 'bg-accent-blue text-white' : 'bg-background/5 text-foreground border border-border/40'}`}>
                        {t}
                      </button>
                    ))}
                  </div>

                  <div>
                    {responseTab === 'Speak' && (
                      <div className="p-3 rounded-2xl bg-background/55 border border-border/80 min-h-[160px]">
                        <div className="text-sm text-foreground break-words leading-relaxed">{isFollowUpStep ? followUpAnswer : answerText || (isListening ? 'Listening...' : 'Speak your answer or type here.')}</div>
                        <div className="mt-2 text-[11px] text-muted-foreground">Words: {((isFollowUpStep ? followUpAnswer : answerText) || '').split(/\s+/).filter(Boolean).length} • Speaking Time: {formatTimer(elapsedTime)}</div>
                      </div>
                    )}

                    {responseTab === 'Transcript' && (
                      <div className="p-3 rounded-2xl bg-background/55 border border-border/80 min-h-[160px]">
                        <div className="text-sm text-foreground leading-relaxed max-h-48 overflow-y-auto custom-scrollbar">
                          {sessionTranscript.length === 0 ? <div className="text-muted-foreground">No transcript yet.</div> : sessionTranscript.map((s,i)=>(<div key={i} className="mb-2"><strong>Q{s.questionNumber}:</strong> {s.answer}</div>))}
                        </div>
                      </div>
                    )}

                    {responseTab === 'Notes' && (
                      <textarea value={notes} onChange={(e)=>setNotes(e.target.value)} placeholder="Personal notes..." className="w-full min-h-[160px] p-3 rounded-2xl bg-background/55 border border-border/80 text-sm" />
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons Panel */}
              <div className="sticky bottom-4 bg-transparent pt-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 border-t border-border/40 pt-4">
                  <button
                    onClick={() => handleEndInterview()}
                    className="px-4 py-3 rounded-xl border border-red-500/20 text-red-500/80 hover:bg-red-500/10 hover:text-red-500 font-bold text-xs transition-all duration-300 flex items-center gap-1.5 cursor-pointer w-full md:w-auto justify-center"
                  >
                    <Square className="w-3.5 h-3.5" />
                    End Session
                  </button>

                  <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto md:justify-end">
                    {/* Submit Answer Actions */}
                    {isFollowUpStep ? (
                      <button
                        onClick={handleSubmitFollowUp}
                        disabled={isEvaluatingFollowUp || !followUpAnswer.trim()}
                        className="px-5 py-3 rounded-xl font-bold bg-accent-blue text-white hover:bg-accent-blue/95 disabled:bg-accent-blue/40 text-xs transition-all flex items-center gap-1.5 shadow-md duration-300 cursor-pointer w-full md:w-auto justify-center"
                      >
                        {isEvaluatingFollowUp ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Processing response...
                          </>
                        ) : (
                          <>
                            Submit Follow-up
                            <Check className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    ) : (
                      <button
                        onClick={handleSubmitAnswer}
                        disabled={isSubmittingAnswer || !answerText.trim() || questions.length === 0}
                        className="px-5 py-3 rounded-xl font-bold bg-accent-blue text-white hover:bg-accent-blue/95 disabled:bg-accent-blue/40 text-xs transition-all flex items-center gap-1.5 shadow-md duration-300 cursor-pointer w-full md:w-auto justify-center"
                      >
                        {isSubmittingAnswer ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Processing response...
                          </>
                        ) : (
                          <>
                            Submit Answer
                            <Check className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>

            </div>

            {/* 3. RIGHT PANEL REMOVED FOR BLIND EVALUATION */}
          </motion.div>
        )}

        {/* ==================================================================================== */}
        {/* VIEWSTATE: REPORT & ANALYTICS DASHBOARD */}
        {/* ==================================================================================== */}
        {viewState === "report" && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-8 w-full max-w-7xl mx-auto"
          >
            {isFinalizing ? (
              <div className="min-h-[600px] flex-1 flex flex-col items-center justify-center text-center p-8 bg-card/45 backdrop-blur-xl border border-border/60 rounded-3xl shadow-xl">
                <Loader2 className="w-16 h-16 text-accent-blue animate-spin mb-6" />
                <h3 className="text-2xl font-black mb-2 tracking-tight">Compiling Final Report</h3>
                <p className="text-sm text-muted-foreground max-w-md">
                  AI Hiring manager is analyzing your transcript, mapping core skills gaps, and generating a detailed recruiter scorecard...
                </p>
              </div>
            ) : !scorecard ? (
              <div className="min-h-[400px] flex-1 flex flex-col items-center justify-center text-center p-8 bg-card/45 border border-border rounded-3xl">
                <AlertCircle className="w-12 h-12 text-red-500 mb-4 animate-bounce" />
                <h3 className="text-lg font-bold mb-1">Evaluation Failed</h3>
                <p className="text-xs text-muted-foreground max-w-sm mb-6">
                  An error occurred while compiling your final scorecard. Please check your network connection.
                </p>
                <button onClick={() => setViewState("setup")} className="px-6 py-3 bg-foreground text-background rounded-xl font-bold">Back to Dashboard</button>
              </div>
            ) : (
              <div className="flex flex-col gap-8 w-full pb-12">
                
                {/* 1. TOP HERO SECTION */}
                <div className="bg-card/45 backdrop-blur-xl border border-border/60 rounded-3xl p-8 md:p-12 shadow-xl flex flex-col items-center justify-center text-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-b from-accent-blue/5 to-transparent pointer-events-none" />
                  
                  <div className="inline-flex items-center justify-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-sm font-bold uppercase tracking-wider mb-4">
                    <Target className="w-4 h-4" /> Interview Assessment Complete
                  </div>
                  
                  <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-4 text-foreground">
                    AI Recruiter Analysis
                  </h2>
                  <p className="text-muted-foreground max-w-2xl mx-auto mb-12">
                    Your responses have been evaluated across technical accuracy, communication, problem-solving, and role alignment.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl mx-auto items-center">
                    
                    {/* Left: Grade */}
                    <div className="flex flex-col items-center gap-2">
                      <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Interview Grade</span>
                      <div className={`w-32 h-32 rounded-full border-4 flex items-center justify-center ${getGradeAndColor(scorecard.overallScore).bg} ${getGradeAndColor(scorecard.overallScore).border}`}>
                        <span className={`text-5xl font-black ${getGradeAndColor(scorecard.overallScore).color}`}>{getGradeAndColor(scorecard.overallScore).grade}</span>
                      </div>
                      <span className={`text-sm font-bold uppercase mt-2 ${getGradeAndColor(scorecard.overallScore).color}`}>
                        {scorecard.overallScore >= 80 ? "Strong Candidate" : scorecard.overallScore >= 60 ? "Average Performance" : "Needs Improvement"}
                      </span>
                    </div>

                    {/* Center: Radial Gauge */}
                    <div className="flex flex-col items-center">
                      <div className="h-64 w-64 md:h-80 md:w-80 relative flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                          <RadialBarChart cx="50%" cy="50%" innerRadius="80%" outerRadius="100%" barSize={24} data={[{ name: "overall", value: scorecard.overallScore, fill: getScoreColor(scorecard.overallScore) }]} startAngle={210} endAngle={-30}>
                            <RadialBar background dataKey="value" cornerRadius={12} />
                          </RadialBarChart>
                        </ResponsiveContainer>
                        <div className="absolute flex flex-col items-center justify-center">
                          <span className={`text-7xl font-black tracking-tighter ${getGradeAndColor(scorecard.overallScore).color}`}>
                            <AnimatedCounter value={scorecard.overallScore} />
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Decision */}
                    <div className="flex flex-col items-center gap-4">
                      <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Recruiter Decision</span>
                      <div className={`px-6 py-4 rounded-2xl border-2 font-black text-xl uppercase tracking-wider text-center w-full max-w-[200px] shadow-lg ${getHiringVerdictColor(scorecard.recruiterVerdict?.hiringRecommendation)}`}>
                        {scorecard.recruiterVerdict?.hiringRecommendation || "Assess"}
                      </div>
                    </div>

                  </div>
                </div>

                {/* 2. SCORING ENGINE METRICS GRID */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {[
                    { label: "Technical Accuracy", score: scorecard.technicalScore || 70 },
                    { label: "Communication", score: scorecard.communicationScore || 70 },
                    { label: "Confidence", score: scorecard.confidenceScore || 70 },
                    { label: "Completeness", score: scorecard.timeline?.[scorecard.timeline?.length - 1]?.communicationScore || 75 },
                    { label: "Problem Solving", score: scorecard.problemSolvingScore || 70 },
                    { label: "Role Alignment", score: scorecard.systemDesignReadiness || 70 }
                  ].map((metric, i) => (
                    <div key={i} className="bg-card/45 backdrop-blur-xl border border-border/60 rounded-2xl p-5 flex flex-col items-center justify-center gap-2 shadow-md">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider text-center leading-tight h-8 flex items-center">{metric.label}</span>
                      <span className={`text-3xl font-black ${getGradeAndColor(metric.score).color}`}>{metric.score}%</span>
                    </div>
                  ))}
                </div>

                {/* 3. INTERVIEW SUMMARY CARD & COACHING */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Summary Card */}
                  <div className="bg-card/45 backdrop-blur-xl border border-border/60 rounded-3xl p-6 shadow-lg">
                    <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest border-b border-border/40 pb-4 mb-4">Interview Summary</h3>
                    <div className="flex flex-col gap-4">
                      <div className="flex justify-between items-center border-b border-border/20 pb-3">
                        <span className="text-xs text-muted-foreground font-medium">Role</span>
                        <span className="text-sm font-bold">{config.target_role || "Software Engineer"}</span>
                      </div>
                      <div className="flex justify-between items-center border-b border-border/20 pb-3">
                        <span className="text-xs text-muted-foreground font-medium">Difficulty</span>
                        <span className="text-sm font-bold">{config.difficulty || "Medium"}</span>
                      </div>
                      <div className="flex justify-between items-center border-b border-border/20 pb-3">
                        <span className="text-xs text-muted-foreground font-medium">Host Style</span>
                        <span className="text-sm font-bold">{config.company_style || "Recruiter"}</span>
                      </div>
                      <div className="flex justify-between items-center border-b border-border/20 pb-3">
                        <span className="text-xs text-muted-foreground font-medium">Questions Answered</span>
                        <span className="text-sm font-bold">{scorecard.timeline?.length || 0}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-muted-foreground font-medium">Duration</span>
                        <span className="text-sm font-bold">{config.duration || "N/A"}</span>
                      </div>
                    </div>
                  </div>

                  {/* AI Recruiter Feedback (Strengths/Concerns) */}
                  <div className="lg:col-span-2 bg-card/45 backdrop-blur-xl border border-border/60 rounded-3xl p-6 shadow-lg flex flex-col gap-6">
                    <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest border-b border-border/40 pb-4">AI Recruiter Feedback</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-2">
                          <ThumbsUp className="w-5 h-5 text-emerald-500" />
                          <span className="font-bold text-emerald-500 uppercase tracking-wider text-xs">Top Strengths</span>
                        </div>
                        <ul className="space-y-3">
                          {scorecard.recruiterVerdict?.strengths?.slice(0, 3).map((str: string, i: number) => (
                            <li key={i} className="text-sm text-foreground/90 bg-emerald-500/5 p-3 rounded-xl border border-emerald-500/10 leading-relaxed">
                              • {str}
                            </li>
                          )) || <li className="text-sm text-muted-foreground">No significant strengths identified.</li>}
                        </ul>
                      </div>

                      <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-2">
                          <AlertCircle className="w-5 h-5 text-amber-500" />
                          <span className="font-bold text-amber-500 uppercase tracking-wider text-xs">Concerns & Weaknesses</span>
                        </div>
                        <ul className="space-y-3">
                          {scorecard.weaknesses?.slice(0, 3).map((w: any, i: number) => (
                            <li key={i} className="text-sm text-foreground/90 bg-amber-500/5 p-3 rounded-xl border border-amber-500/10 leading-relaxed">
                              • {w.topic || w}
                            </li>
                          )) || <li className="text-sm text-muted-foreground">No critical weaknesses found.</li>}
                        </ul>
                      </div>
                    </div>

                    {scorecard.learningPlan?.areasToImprove && (
                      <div className="mt-2 border-t border-border/40 pt-6">
                        <span className="font-bold text-accent-purple uppercase tracking-wider text-xs mb-4 block">Next Improvements</span>
                        <div className="flex flex-wrap gap-2">
                          {scorecard.learningPlan.areasToImprove.slice(0, 3).map((item: string, i: number) => (
                            <span key={i} className="text-xs bg-accent-purple/10 text-accent-purple border border-accent-purple/20 px-3 py-1.5 rounded-lg font-semibold">
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* 4. VISUAL ANALYTICS (Charts) */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="bg-card/45 backdrop-blur-xl border border-border/60 rounded-3xl p-6 shadow-lg">
                    <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest border-b border-border/40 pb-4 mb-6">Capability Radar</h3>
                    <div className="h-72 w-full flex items-center justify-center">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="75%" data={getRadarData()}>
                          <PolarGrid stroke="rgba(255,255,255,0.1)" />
                          <PolarAngleAxis dataKey="subject" stroke="#94a3b8" fontSize={11} fontWeight="bold" />
                          <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#64748b" fontSize={10} />
                          <Radar name="Score" dataKey="score" stroke="#3b82f6" strokeWidth={3} fill="#3b82f6" fillOpacity={0.3} />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="bg-card/45 backdrop-blur-xl border border-border/60 rounded-3xl p-6 shadow-lg">
                    <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest border-b border-border/40 pb-4 mb-6">Performance Trend</h3>
                    <div className="h-72 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={getTimelineData()} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
                          <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} fontWeight="bold" />
                          <YAxis domain={[0, 100]} stroke="#64748b" fontSize={11} />
                          <Tooltip contentStyle={{ background: "rgba(15,23,42,0.95)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px" }} />
                          <Line type="monotone" dataKey="Overall" stroke="#3b82f6" strokeWidth={4} dot={{ r: 4, fill: "#3b82f6" }} activeDot={{ r: 6 }} name="Overall" />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                {/* 5. QUESTION-BY-QUESTION ANALYSIS */}
                <div className="bg-card/45 backdrop-blur-xl border border-border/60 rounded-3xl p-6 md:p-8 shadow-lg flex flex-col gap-6">
                  <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest border-b border-border/40 pb-4">Question-by-Question Analysis</h3>
                  
                  <div className="flex flex-col gap-4">
                    {scorecard.transcript?.map((item: any, i: number) => {
                      const evalScore = item.evaluation?.overallQuality || 0;
                      return (
                        <div key={i} className="border border-border/50 bg-background/50 rounded-2xl p-5 md:p-6 flex flex-col gap-4 transition-all hover:border-accent-blue/30">
                          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                            <div className="flex-1 flex flex-col gap-2">
                              <div className="flex items-center gap-3">
                                <span className="bg-accent-blue/10 text-accent-blue font-bold px-3 py-1 rounded-lg text-xs uppercase tracking-wider">Question {i + 1}</span>
                                <span className="text-xs font-semibold text-muted-foreground">{item.type}</span>
                              </div>
                              <p className="text-foreground font-semibold text-sm md:text-base leading-relaxed mt-1">{item.question}</p>
                            </div>
                            <div className="flex flex-col items-end shrink-0">
                              <span className={`text-2xl font-black ${getGradeAndColor(evalScore).color}`}>{evalScore}%</span>
                              <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Score</span>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                            <div className="bg-muted/30 rounded-xl p-4 border border-border/40">
                              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2 block">Your Answer</span>
                              <p className="text-xs text-foreground/80 leading-relaxed max-h-32 overflow-y-auto custom-scrollbar italic">"{item.answer}"</p>
                            </div>
                            <div className="bg-accent-purple/5 rounded-xl p-4 border border-accent-purple/10">
                              <span className="text-[10px] font-bold text-accent-purple uppercase tracking-wider mb-2 block">AI Feedback</span>
                              <p className="text-xs text-foreground/90 leading-relaxed">{item.evaluation?.feedback}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 6. ACTION BUTTONS */}
                <div className="flex flex-wrap items-center justify-center gap-4 mt-4 pt-8 border-t border-border/40">
                  <button onClick={() => { setViewState("setup"); setScorecard(null); }} className="px-6 py-4 rounded-xl font-bold bg-foreground text-background hover:scale-105 transition-all flex items-center gap-2 shadow-xl shadow-foreground/10">
                    <History className="w-5 h-5" /> Retake Interview
                  </button>
                  <button className="px-6 py-4 rounded-xl font-bold bg-background/50 border border-border/60 hover:bg-muted transition-all flex items-center gap-2 text-foreground">
                    <Award className="w-5 h-5" /> Download Report
                  </button>
                  <Link href="/roadmap" className="px-6 py-4 rounded-xl font-bold bg-gradient-to-r from-accent-blue to-accent-purple text-white hover:scale-105 transition-all flex items-center gap-2 shadow-xl shadow-accent-purple/20">
                    <Sparkles className="w-5 h-5" /> Generate Improvement Roadmap
                  </Link>
                </div>

              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
