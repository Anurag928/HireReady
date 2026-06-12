"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Bot, Sparkles, BrainCircuit } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { fadeIn, slideUp } from "@/animations";

export default function LoginPage() {
  const { signInWithGoogle, user, dbUser, loading, authInitialized } = useAuth();
  const router = useRouter();
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  useEffect(() => {
    // Only route if auth is fully initialized (Firebase + Backend sync completed)
    if (authInitialized) {
      console.log("Firebase user:", user);
      console.log("DB user:", dbUser);
      console.log("Initialized:", authInitialized);

      if (user && dbUser) {
        if (dbUser.onboarding_completed === true) {
          console.log("Redirect target: /dashboard");
          router.replace("/dashboard");
        } else {
          console.log("Redirect target: /onboarding");
          router.replace("/onboarding");
        }
      } else {
        // Auth initialized but no user (logged out), just stay on login page.
        setIsAuthenticating(false);
      }
    }
  }, [authInitialized, user, dbUser, router]);

  const handleLogin = async () => {
    setIsAuthenticating(true);
    await signInWithGoogle();
    // Revert state if something fails or gets canceled
    setTimeout(() => {
      // only revert if still not initialized
      if (!authInitialized) {
        setIsAuthenticating(false);
      }
    }, 10000); 
  };

  // If Firebase is loading or we are actively authenticating and waiting for sync
  const showLoader = loading || (isAuthenticating && !authInitialized);

  return (
    <div className="min-h-screen flex bg-background overflow-hidden relative">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-accent-purple/10 rounded-full blur-[150px] mix-blend-screen" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-accent-blue/10 rounded-full blur-[150px] mix-blend-screen" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20" />
      </div>

      <div className="flex-1 flex flex-col justify-center items-center px-4 relative z-10">
        
        <Link href="/" className="absolute top-8 left-8 inline-flex items-center gap-2 group">
          <div className="bg-card border border-white/10 p-2 rounded-xl group-hover:border-accent-blue/40 transition-colors">
            <Bot className="w-6 h-6 text-accent-blue" />
          </div>
          <span className="font-bold text-xl tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 drop-shadow-[0_0_8px_rgba(34,211,238,0.4)]">
            HireReady
          </span>
        </Link>

        <AnimatePresence mode="wait">
          {showLoader ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="text-center"
            >
              <div className="relative w-32 h-32 mx-auto mb-8">
                <div className="absolute inset-0 rounded-full border-4 border-accent-blue/20" />
                <motion.div 
                  className="absolute inset-0 rounded-full border-4 border-t-accent-blue border-r-accent-purple border-b-transparent border-l-transparent"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <BrainCircuit className="w-12 h-12 text-accent-blue animate-pulse" />
                </div>
              </div>
              <h2 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
                Initializing your AI workspace...
              </h2>
              <p className="text-foreground/50 max-w-sm mx-auto text-lg">
                Securely syncing your profile and fetching intelligent insights.
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="login"
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, y: -20 }}
              variants={slideUp}
              className="w-full max-w-md mx-auto"
            >
              <div className="mb-10 text-center">
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="w-20 h-20 bg-card/50 backdrop-blur-md border border-white/10 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-accent-blue/20 to-accent-purple/20 rounded-3xl opacity-50" />
                  <Sparkles className="w-10 h-10 text-accent-blue relative z-10" />
                </motion.div>
                
                <h1 className="text-3xl md:text-4xl font-bold mb-3 tracking-tight">Enter the OS</h1>
                <p className="text-foreground/50">Authenticate to access your AI career companion.</p>
              </div>

              <div className="bg-card/40 backdrop-blur-xl p-8 rounded-3xl border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.3)] relative overflow-hidden">
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-accent-blue/50 to-transparent" />
                
                <button
                  onClick={handleLogin}
                  className="w-full relative z-10 flex items-center justify-center gap-4 px-6 py-4 rounded-2xl border border-white/10 bg-background hover:bg-foreground/5 transition-all text-foreground font-semibold group overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-accent-blue/10 to-accent-purple/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <svg className="w-6 h-6 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  <span className="text-lg relative z-10">Continue with Google</span>
                </button>

                <div className="mt-8 text-center text-xs text-foreground/40 leading-relaxed">
                  By continuing, you acknowledge that you have read and understood, and agree to our Terms of Service and Privacy Policy.
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
