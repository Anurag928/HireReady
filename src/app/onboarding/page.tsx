"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Bot, ChevronRight, CheckCircle2 } from "lucide-react";
import { slideUp, fadeIn } from "@/animations";
import { useAuth } from "@/contexts/auth-context";
import { onboardingService } from "@/services/onboardingService";

const roles = ["Student", "Data Analyst", "Web Developer", "AI/ML Engineer", "Software Engineer"];
const levels = ["Beginner", "Intermediate", "Advanced"];
const skillsList = ["Python", "SQL", "Power BI", "React", "Flask", "MongoDB", "Machine Learning", "DSA"];
const domains = ["AI/ML", "Web Development", "Data Science", "Cybersecurity", "Cloud/DevOps"];

export default function OnboardingPage() {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    role: "",
    level: "",
    skills: [] as string[],
    targetRole: "",
    goals: "",
    domain: ""
  });
  const router = useRouter();

  const handleNext = async () => {
    if (step < 6) {
      setStep(step + 1);
    } else {
      if (!user) return;
      setIsSubmitting(true);
      try {
        await onboardingService.saveProfile(user.uid, {
          role: formData.role,
          experienceLevel: formData.level,
          skills: formData.skills,
          targetRole: formData.targetRole,
          learningGoals: formData.goals,
          preferredDomain: formData.domain
        });
        
        // Use window.location.href to force a full reload so AuthContext fetches the updated dbUser
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
      case 1: return formData.role !== "";
      case 2: return formData.level !== "";
      case 3: return formData.skills.length > 0;
      case 4: return formData.targetRole.trim() !== "";
      case 5: return formData.goals.trim() !== "";
      case 6: return formData.domain !== "";
      default: return true;
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
      <div className="absolute inset-0 overflow-hidden pointer-events-none flex justify-center items-center">
        <div className="w-[800px] h-[800px] bg-accent-blue/5 rounded-full blur-[100px]" />
      </div>

      <motion.div
        variants={fadeIn}
        initial="hidden"
        animate="visible"
        className="w-full max-w-2xl relative z-10"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-accent-blue/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-accent-blue/20">
            <Bot className="w-8 h-8 text-accent-blue" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Let&apos;s personalize your experience</h1>
          <p className="text-foreground/60">Help AI understand your career goals</p>
        </div>

        {/* Progress Bar */}
        <div className="flex gap-2 mb-12">
          {[1, 2, 3, 4, 5, 6].map((i) => (
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

        <div className="bg-card border border-border p-8 rounded-3xl shadow-xl min-h-[400px] flex flex-col relative overflow-hidden">
          <div className="absolute top-0 right-0 p-32 bg-accent-purple/5 blur-[50px] rounded-full pointer-events-none" />

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                variants={slideUp}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="flex-1"
              >
                <h2 className="text-2xl font-semibold mb-6">What is your current role?</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {roles.map(role => (
                    <button
                      key={role}
                      onClick={() => setFormData({ ...formData, role })}
                      className={`p-4 rounded-xl border text-left transition-all ${formData.role === role ? 'border-accent-blue bg-accent-blue/10' : 'border-border bg-background hover:border-accent-blue/50'}`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{role}</span>
                        {formData.role === role && <CheckCircle2 className="w-5 h-5 text-accent-blue" />}
                      </div>
                    </button>
                  ))}
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
                className="flex-1"
              >
                <h2 className="text-2xl font-semibold mb-6">What is your current experience level?</h2>
                <div className="flex flex-col gap-4">
                  {levels.map(level => (
                    <button
                      key={level}
                      onClick={() => setFormData({ ...formData, level })}
                      className={`p-6 rounded-xl border text-left transition-all ${formData.level === level ? 'border-accent-blue bg-accent-blue/10' : 'border-border bg-background hover:border-accent-blue/50'}`}
                    >
                      <span className="font-medium text-lg">{level}</span>
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
                className="flex-1"
              >
                <h2 className="text-2xl font-semibold mb-2">Select your skills</h2>
                <p className="text-foreground/60 mb-6">Choose all that apply</p>
                <div className="flex flex-wrap gap-3">
                  {skillsList.map(skill => (
                    <button
                      key={skill}
                      onClick={() => toggleSkill(skill)}
                      className={`px-4 py-2 rounded-full border transition-all ${formData.skills.includes(skill) ? 'border-accent-blue bg-accent-blue/10 text-accent-blue' : 'border-border bg-background hover:border-accent-blue/50 text-foreground/80'}`}
                    >
                      {skill}
                    </button>
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
                className="flex-1"
              >
                <h2 className="text-2xl font-semibold mb-6">What is your target career role?</h2>
                <input
                  type="text"
                  value={formData.targetRole}
                  onChange={(e) => setFormData({ ...formData, targetRole: e.target.value })}
                  placeholder="e.g., Senior Full Stack Developer"
                  className="w-full p-4 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-accent-blue/50 transition-all"
                />
              </motion.div>
            )}

            {step === 5 && (
              <motion.div
                key="step5"
                variants={slideUp}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="flex-1"
              >
                <h2 className="text-2xl font-semibold mb-6">What are your learning goals?</h2>
                <textarea
                  value={formData.goals}
                  onChange={(e) => setFormData({ ...formData, goals: e.target.value })}
                  placeholder="e.g., I want to master React and build scalable applications..."
                  className="w-full h-40 p-4 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-accent-blue/50 resize-none transition-all"
                />
              </motion.div>
            )}

            {step === 6 && (
              <motion.div
                key="step6"
                variants={slideUp}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="flex-1"
              >
                <h2 className="text-2xl font-semibold mb-6">What is your preferred domain?</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {domains.map(domain => (
                    <button
                      key={domain}
                      onClick={() => setFormData({ ...formData, domain })}
                      className={`p-4 rounded-xl border text-left transition-all ${formData.domain === domain ? 'border-accent-blue bg-accent-blue/10' : 'border-border bg-background hover:border-accent-blue/50'}`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{domain}</span>
                        {formData.domain === domain && <CheckCircle2 className="w-5 h-5 text-accent-blue" />}
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-8 flex justify-between items-center pt-6 border-t border-border">
            <button
              onClick={() => setStep(step > 1 ? step - 1 : 1)}
              className={`font-medium ${step === 1 ? 'opacity-0 pointer-events-none' : 'text-foreground/60 hover:text-foreground'}`}
            >
              Back
            </button>
            <button
              onClick={handleNext}
              disabled={isSubmitting || !isStepValid()}
              className="px-6 py-2.5 rounded-full font-medium bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-2 transition-all active:scale-95 shadow-[0_0_15px_rgba(59,130,246,0.3)] disabled:opacity-70"
            >
              {isSubmitting ? "Saving..." : (step === 6 ? "Generate Roadmap" : "Next")} <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
