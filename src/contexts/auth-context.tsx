"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { User, onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import { createUserInBackend } from "@/api";

interface AuthContextType {
  user: User | null;
  dbUser: any | null;
  loading: boolean;
  authInitialized: boolean;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  dbUser: null,
  loading: true,
  authInitialized: false,
  signInWithGoogle: async () => {},
  logout: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [dbUser, setDbUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [authInitialized, setAuthInitialized] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setLoading(true);
      
      if (user) {
        try {
          // Ensure token exists before calling backend
          await user.getIdToken();
          
          // Sync user with backend
          const response = await createUserInBackend({
            uid: user.uid,
            name: user.displayName,
            email: user.email,
            photoURL: user.photoURL
          });
          setDbUser(response.data?.user || null);
        } catch (error) {
          console.error("Failed to sync user with backend:", error);
          // Don't log out the user locally just because backend failed, but we can set dbUser to null
          setDbUser(null);
        }
      } else {
        setDbUser(null);
      }
      
      setUser(user);
      setLoading(false);
      setAuthInitialized(true);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Error signing in with Google:", error);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      // Fully clear storage and cached user data
      localStorage.clear();
      sessionStorage.clear();
      setUser(null);
      setDbUser(null);
      // Hard redirect to the landing page to reset application state
      window.location.href = "/";
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };



  return (
    <AuthContext.Provider value={{ user, dbUser, loading, authInitialized, signInWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
