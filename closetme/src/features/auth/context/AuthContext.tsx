import { onAuthStateChanged } from "firebase/auth";
import React, { createContext, useEffect, useState } from "react";
import { auth } from "../../../lib/firebase";
import type { AuthUser } from "../../../types";
import {
  signOut as authSignOut,
  formatAuthUser,
  signInWithEmail,
  signUpWithEmail,
} from "../services/authService";

interface AuthContextData {
  user: AuthUser | null;
  isLoading: boolean;
  signIn: (email: string, pass: string) => Promise<void>;
  signUp: (name: string, email: string, pass: string) => Promise<void>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextData>(
  {} as AuthContextData,
);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Ouve o Firebase em tempo real e mantém a sessão persistida no celular
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser(formatAuthUser(firebaseUser));
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  async function signIn(email: string, pass: string) {
    const authUser = await signInWithEmail(email, pass);
    setUser(authUser);
  }

  async function signUp(name: string, email: string, pass: string) {
    const authUser = await signUpWithEmail(name, email, pass);
    setUser(authUser);
  }

  async function signOut() {
    await authSignOut();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
