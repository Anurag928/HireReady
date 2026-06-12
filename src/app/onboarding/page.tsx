"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Bot, ChevronRight, CheckCircle2, Search } from "lucide-react";
import { slideUp, fadeIn } from "@/animations";
import { useAuth } from "@/contexts/auth-context";
import { onboardingService } from "@/services/onboardingService";

const currentStatusOptions = [
  "School Student", "Diploma Student", "B.Tech Student", "MCA Student", "M.Tech Student", "MBA Student", "Fresher", "Working Professional", "Career Switcher"
];

const currentRoleOptions = [
  "Student", "Frontend Developer", "Backend Developer", "Full Stack Developer", "Data Analyst", "Data Scientist", "AI/ML Engineer", "DevOps Engineer", "Cloud Engineer", "Cybersecurity Analyst", "Mobile App Developer", "QA Engineer", "UI/UX Designer", "Business Analyst", "Product Manager", "Software Engineer", "Freelancer", "Other"
];

const targetRoleGroups = [
  {
    category: "SOFTWARE DEVELOPMENT",
    roles: ["Frontend Developer", "Backend Developer", "Full Stack Developer", "Software Engineer", "Java Developer", "Python Developer", "MERN Stack Developer", ".NET Developer", "Mobile App Developer", "Android Developer", "iOS Developer"]
  },
  {
    category: "DATA & AI",
    roles: ["Data Analyst", "Business Analyst", "Data Scientist", "Machine Learning Engineer", "AI Engineer", "AI/ML Engineer", "NLP Engineer", "Computer Vision Engineer", "Generative AI Engineer", "Data Engineer"]
  },
  {
    category: "CLOUD & DEVOPS",
    roles: ["DevOps Engineer", "Site Reliability Engineer", "Cloud Engineer", "AWS Engineer", "Azure Engineer", "GCP Engineer", "Platform Engineer"]
  },
  {
    category: "CYBERSECURITY",
    roles: ["Security Analyst", "SOC Analyst", "Ethical Hacker", "Penetration Tester", "Security Engineer"]
  },
  {
    category: "PRODUCT & DESIGN",
    roles: ["Product Manager", "UI Designer", "UX Designer", "UI/UX Designer"]
  },
  {
    category: "OTHERS",
    roles: ["Game Developer", "Blockchain Developer", "Embedded Engineer", "IoT Engineer"]
  }
];

const skillGroups = [
  { category: "PROGRAMMING LANGUAGES", skills: ["Java", "Python", "JavaScript", "TypeScript", "C", "C++", "C#", "Go", "Rust", "Kotlin", "Swift", "PHP", "R", "Dart", "Scala"] },
  { category: "FRONTEND", skills: ["HTML", "CSS", "Tailwind CSS", "Bootstrap", "React", "Next.js", "Angular", "Vue.js", "Redux", "Framer Motion"] },
  { category: "BACKEND", skills: ["Node.js", "Express.js", "Spring Boot", "Django", "Flask", "FastAPI", "Laravel", "ASP.NET", "NestJS"] },
  { category: "DATABASES", skills: ["MySQL", "PostgreSQL", "MongoDB", "Oracle", "SQL Server", "Redis", "Firebase", "Supabase"] },
  { category: "AI / ML", skills: ["NumPy", "Pandas", "Matplotlib", "Seaborn", "Scikit-Learn", "TensorFlow", "PyTorch", "Keras", "OpenCV", "Hugging Face", "LangChain", "RAG", "Vector Databases", "Prompt Engineering", "LLMs", "Fine Tuning"] },
  { category: "DATA ANALYTICS", skills: ["Excel", "Power BI", "Tableau", "Looker", "SQL", "Data Cleaning", "Data Visualization", "ETL"] },
  { category: "DEVOPS", skills: ["Docker", "Kubernetes", "Jenkins", "GitHub Actions", "Terraform", "Ansible", "Linux", "Nginx"] },
  { category: "CLOUD", skills: ["AWS", "Azure", "Google Cloud", "Lambda", "EC2", "S3", "Cloud Functions"] },
  { category: "CYBERSECURITY", skills: ["Network Security", "OWASP", "Burp Suite", "Kali Linux", "Metasploit", "SIEM", "SOC Operations"] },
  { category: "MOBILE", skills: ["Android", "Kotlin", "Java Android", "Flutter", "React Native", "Swift"] },
  { category: "TOOLS", skills: ["Git", "GitHub", "VS Code", "Postman", "Jira", "Figma", "Canva"] }
];

const levels = ["Beginner", "Intermediate", "Advanced", "Professional"];

const careerGoalsOptions = [
  "Get Internship", "Get First Job", "Switch Career", "Get Placement", "Become AI Engineer", "Become Data Scientist", "Become Full Stack Developer", "Become Cloud Engineer", "Become Product Manager"
];

export default function OnboardingPage() {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [skillSearchQuery, setSkillSearchQuery] = useState("");
  
  const [formData, setFormData] = useState({
    fullName: "",
    education: "",
    college: "",
    graduationYear: "",
    currentStatus: "",
    role: "", // Current role
    targetRole: "",
    skills: [] as string[],
    level: "",
    goals: "", // Maps to career goal
  });

  const router = useRouter();

  const handleNext = async () => {
    if (step < 7) {
      setStep(step + 1);
    } else {
      if (!user) return;
      setIsSubmitting(true);
      try {
        await onboardingService.saveProfile(user.uid, {
          fullName: formData.fullName,
          education: formData.education,
          college: formData.college,
          graduationYear: formData.graduationYear,
          currentStatus: formData.currentStatus,
          role: formData.role,
          targetRole: formData.targetRole,
          skills: formData.skills,
          experienceLevel: formData.level,
          learningGoals: formData.goals,
        });
        
        window.location.href = "/dashboard";
      } catch (error) {
        console.error("Failed to save onboarding profile", error);
        setIsSubmitting(false);
      }
    }
  };

  const toggleSkill = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
  };

  const isStepValid = () => {
    switch (step) {
      case 1: return formData.fullName.trim() !== "" && formData.education.trim() !== "" && formData.college.trim() !== "" && formData.graduationYear.trim() !== "" && formData.currentStatus !== "";
      case 2: return formData.role !== "";
      case 3: return formData.targetRole.trim() !== "";
      case 4: return formData.skills.length > 0;
      case 5: return formData.level !== "";
      case 6: return formData.goals !== "";
      default: return true;
    }
  }

  const filteredSkills = useMemo(() => {
    if (!skillSearchQuery) return skillGroups;
    const query = skillSearchQuery.toLowerCase();
    return skillGroups.map(group => ({
      ...group,
      skills: group.skills.filter(s => s.toLowerCase().includes(query))
    })).filter(group => group.skills.length > 0);
  }, [skillSearchQuery]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
      <div className="absolute inset-0 overflow-hidden pointer-events-none flex justify-center items-center">
        <div className="w-[800px] h-[800px] bg-accent-blue/5 rounded-full blur-[100px]" />
      </div>

      <motion.div
        variants={fadeIn}
        initial="hidden"
        animate="visible"
        className="w-full max-w-4xl relative z-10 my-8"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-accent-blue/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-accent-blue/20">
            <Bot className="w-8 h-8 text-accent-blue" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Let&apos;s personalize your experience</h1>
          <p className="text-foreground/60">Complete your AI-powered career assessment</p>
        </div>

        {/* Progress Bar */}
        <div className="flex gap-2 mb-12 max-w-2xl mx-auto">
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <div key={i} className="h-1.5 flex-1 bg-card rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-accent-blue"
                initial={{ width: 0 }}
                animate={{ width: step >= i ? "100%" : "0%" }}
                transition={{ duration: 0.3 }}
              />
            </div>
          ))}
        </div>

        <div className="bg-card/80 backdrop-blur-3xl border border-white/5 p-6 sm:p-10 rounded-[2.5rem] shadow-2xl min-h-[500px] flex flex-col relative overflow-hidden">
          <div className="absolute top-0 right-0 p-32 bg-accent-purple/5 blur-[50px] rounded-full pointer-events-none" />

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                variants={slideUp}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="flex-1 max-w-2xl mx-auto w-full"
              >
                <h2 className="text-2xl font-semibold mb-6">Basic Profile Setup</h2>
                <div className="space-y-5">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-widest text-foreground/50 mb-2 block">Full Name</label>
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="e.g., Jane Doe"
                      className="w-full p-4 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-accent-blue/50 transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-widest text-foreground/50 mb-2 block">Current Education</label>
                    <input
                      type="text"
                      value={formData.education}
                      onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                      placeholder="e.g., B.Tech in Computer Science"
                      className="w-full p-4 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-accent-blue/50 transition-all"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="text-xs font-bold uppercase tracking-widest text-foreground/50 mb-2 block">College / University</label>
                      <input
                        type="text"
                        value={formData.college}
                        onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                        placeholder="e.g., MIT"
                        className="w-full p-4 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-accent-blue/50 transition-all"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold uppercase tracking-widest text-foreground/50 mb-2 block">Graduation Year</label>
                      <input
                        type="text"
                        value={formData.graduationYear}
                        onChange={(e) => setFormData({ ...formData, graduationYear: e.target.value })}
                        placeholder="e.g., 2025"
                        className="w-full p-4 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-accent-blue/50 transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-widest text-foreground/50 mb-2 block">Current Status</label>
                    <select
                      value={formData.currentStatus}
                      onChange={(e) => setFormData({ ...formData, currentStatus: e.target.value })}
                      className="w-full p-4 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-accent-blue/50 transition-all cursor-pointer"
                    >
                      <option value="" disabled>Select Current Status</option>
                      {currentStatusOptions.map(status => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                variants={slideUp}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="flex-1 max-w-3xl mx-auto w-full"
              >
                <h2 className="text-2xl font-semibold mb-6">What best describes you today?</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-[400px] overflow-y-auto custom-scrollbar p-1">
                  {currentRoleOptions.map(role => (
                    <button
                      key={role}
                      onClick={() => setFormData({ ...formData, role })}
                      className={`p-3 rounded-xl border text-sm text-left transition-all flex flex-col justify-center ${formData.role === role ? 'border-accent-blue bg-accent-blue/10 shadow-[0_0_15px_rgba(59,130,246,0.3)]' : 'border-border bg-background/50 hover:border-accent-blue/50 hover:bg-background'}`}
                    >
                      <div className="flex justify-between items-start gap-2">
                        <span className="font-medium leading-tight">{role}</span>
                        {formData.role === role && <CheckCircle2 className="w-4 h-4 text-accent-blue shrink-0" />}
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                variants={slideUp}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="flex-1 w-full"
              >
                <h2 className="text-2xl font-semibold mb-2">Select Your Dream Role</h2>
                <p className="text-foreground/60 mb-6 text-sm">Choose the primary target role you want to focus on.</p>
                <div className="space-y-8 max-h-[450px] overflow-y-auto custom-scrollbar pr-2">
                  {targetRoleGroups.map(group => (
                    <div key={group.category} className="space-y-3">
                      <h3 className="text-[10px] font-black uppercase tracking-widest text-foreground/40">{group.category}</h3>
                      <div className="flex flex-wrap gap-2">
                        {group.roles.map(role => (
                          <button
                            key={role}
                            onClick={() => setFormData({ ...formData, targetRole: role })}
                            className={`px-4 py-2 rounded-lg border text-sm transition-all ${formData.targetRole === role ? 'border-accent-blue bg-accent-blue/10 text-accent-blue shadow-[0_0_15px_rgba(59,130,246,0.4)]' : 'border-border bg-background/50 hover:border-accent-blue/50 text-foreground/80'}`}
                          >
                            {role}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                key="step4"
                variants={slideUp}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="flex-1 w-full flex flex-col"
              >
                <div className="flex sm:items-center justify-between gap-4 mb-6 flex-col sm:flex-row">
                  <div>
                    <h2 className="text-2xl font-semibold mb-1">Skills Assessment</h2>
                    <p className="text-foreground/60 text-sm">Select all the skills you possess or are actively learning.</p>
                  </div>
                  <div className="relative w-full sm:w-64 shrink-0">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
                    <input
                      type="text"
                      value={skillSearchQuery}
                      onChange={(e) => setSkillSearchQuery(e.target.value)}
                      placeholder="Search skills..."
                      className="w-full pl-9 pr-4 py-2 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-accent-blue/50 text-sm transition-all"
                    />
                  </div>
                </div>
                
                <div className="flex-1 max-h-[400px] overflow-y-auto custom-scrollbar pr-2 space-y-8">
                  {filteredSkills.map(group => (
                    <div key={group.category} className="space-y-3">
                      <h3 className="text-[10px] font-black uppercase tracking-widest text-foreground/40">{group.category}</h3>
                      <div className="flex flex-wrap gap-2">
                        {group.skills.map(skill => {
                          const isSelected = formData.skills.includes(skill);
                          return (
                            <button
                              key={skill}
                              onClick={() => toggleSkill(skill)}
                              className={`px-3 py-1.5 rounded-full border text-xs font-medium transition-all duration-300 ${isSelected ? 'border-accent-blue bg-accent-blue/20 text-accent-blue shadow-[0_0_15px_rgba(59,130,246,0.5)] scale-105' : 'border-border bg-background/50 hover:border-accent-blue/50 text-foreground/80 hover:bg-background'}`}
                            >
                              {skill}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                  {filteredSkills.length === 0 && (
                    <div className="text-center py-10 text-foreground/40 text-sm">No skills found matching "{skillSearchQuery}"</div>
                  )}
                </div>
              </motion.div>
            )}

            {step === 5 && (
              <motion.div
                key="step5"
                variants={slideUp}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="flex-1 max-w-2xl mx-auto w-full"
              >
                <h2 className="text-2xl font-semibold mb-6">Experience Level</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {levels.map(level => (
                    <button
                      key={level}
                      onClick={() => setFormData({ ...formData, level })}
                      className={`p-6 rounded-2xl border text-left transition-all group ${formData.level === level ? 'border-accent-blue bg-accent-blue/10 shadow-[0_0_20px_rgba(59,130,246,0.2)]' : 'border-border bg-background/50 hover:border-accent-blue/50'}`}
                    >
                      <div className="flex justify-between items-center">
                        <span className={`font-semibold text-lg ${formData.level === level ? 'text-accent-blue' : 'text-foreground group-hover:text-accent-blue transition-colors'}`}>{level}</span>
                        {formData.level === level && <CheckCircle2 className="w-6 h-6 text-accent-blue" />}
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 6 && (
              <motion.div
                key="step6"
                variants={slideUp}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="flex-1 max-w-3xl mx-auto w-full"
              >
                <h2 className="text-2xl font-semibold mb-6">What is your primary career goal?</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {careerGoalsOptions.map(goal => (
                    <button
                      key={goal}
                      onClick={() => setFormData({ ...formData, goals: goal })}
                      className={`p-4 rounded-xl border text-left transition-all ${formData.goals === goal ? 'border-accent-blue bg-accent-blue/10 shadow-[0_0_15px_rgba(59,130,246,0.3)]' : 'border-border bg-background/50 hover:border-accent-blue/50 hover:bg-background'}`}
                    >
                      <div className="flex justify-between items-center gap-2">
                        <span className="font-medium text-sm">{goal}</span>
                        {formData.goals === goal && <CheckCircle2 className="w-4 h-4 text-accent-blue shrink-0" />}
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 7 && (
              <motion.div
                key="step7"
                variants={slideUp}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="flex-1 flex flex-col items-center justify-center text-center max-w-lg mx-auto py-10"
              >
                <div className="w-20 h-20 bg-accent-blue/10 rounded-3xl flex items-center justify-center mb-8 border border-accent-blue/20 relative">
                   <div className="absolute inset-0 bg-accent-blue/20 blur-xl rounded-full" />
                   <Bot className="w-10 h-10 text-accent-blue relative z-10" />
                </div>
                <h2 className="text-3xl font-bold mb-4">Profile Assessment Complete</h2>
                <p className="text-foreground/60 mb-8 leading-relaxed text-sm">
                  We are ready to generate your personalized AI career ecosystem based on your selection as a <span className="text-foreground font-semibold">[{formData.targetRole}]</span>.
                </p>
                <div className="w-full bg-background/50 border border-white/5 rounded-2xl p-6 text-left space-y-3 shadow-inner">
                   <div className="flex items-center gap-3 text-sm text-foreground/80"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Career Readiness</div>
                   <div className="flex items-center gap-3 text-sm text-foreground/80"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Dashboard Insights</div>
                   <div className="flex items-center gap-3 text-sm text-foreground/80"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Skill Gap Analysis</div>
                   <div className="flex items-center gap-3 text-sm text-foreground/80"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> AI Roadmap</div>
                   <div className="flex items-center gap-3 text-sm text-foreground/80"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Mock Interview Configuration</div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-8 flex justify-between items-center pt-6 border-t border-white/10 shrink-0">
            <button
              onClick={() => setStep(step > 1 ? step - 1 : 1)}
              className={`font-medium ${step === 1 ? 'opacity-0 pointer-events-none' : 'text-foreground/60 hover:text-foreground transition-colors'}`}
            >
              Back
            </button>
            <button
              onClick={handleNext}
              disabled={isSubmitting || !isStepValid()}
              className="px-8 py-3 rounded-full font-bold bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-2 transition-all active:scale-95 shadow-[0_0_25px_rgba(59,130,246,0.4)] disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Generating..." : (step === 7 ? "Launch Dashboard" : "Continue")} <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
