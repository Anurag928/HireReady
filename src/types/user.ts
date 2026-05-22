export interface User {
  uid: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
  createdAt: Date;
  lastLogin: Date;
}

export interface CareerGoals {
  primaryGoal: string;
  targetRole: string;
  targetCompany?: string;
  expectedSalaryRange?: string;
  timelineMonths?: number;
}

export interface Skills {
  current: string[];
  toLearn: string[];
  expert: string[];
}

export interface RoadmapProgress {
  totalModules: number;
  completedModules: number;
  currentModuleId?: string;
  lastUpdated: Date;
}

export interface ResumeAnalysis {
  lastScore: number;
  atsMatchPercentage: number;
  missingKeywords: string[];
  lastAnalyzed: Date;
}

export interface InterviewStats {
  totalInterviews: number;
  averageScore: number;
  strongAreas: string[];
  weakAreas: string[];
}

export interface UserProfile {
  uid: string; // Foreign key to User
  name?: string;
  email?: string;
  photoURL?: string;
  role: string;
  experienceLevel: string;
  skills: string[];
  targetRole: string;
  learningGoals: string;
  preferredDomain: string;
  // Future MongoDB relational or nested data structure preparation
  careerGoals?: CareerGoals;
  detailedSkills?: Skills;
  roadmapProgress?: RoadmapProgress;
  resumeAnalysis?: ResumeAnalysis;
  interviewStats?: InterviewStats;
  
  onboardingCompleted: boolean;
  updatedAt: Date;
}
