"use client";

import { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";

export type UserRole = "visitor" | "registered_user" | "author" | "editor" | "moderator" | "administrator" | "super_admin";

export interface AuthUser {
  id: string;
  name: string | null;
  email: string;
  role: UserRole;
  image?: string | null;
  bio?: string | null;
  location?: string | null;
  website?: string | null;
}

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
  updateUser: (data: Partial<AuthUser>) => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      const response = await fetch("/api/auth/me", { credentials: "include" });
      if (!response.ok) {
        setUser(null);
        return;
      }

      const payload = (await response.json()) as { user: AuthUser | null };
      setUser(payload.user);
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    fetch("/api/auth/me", { credentials: "include" })
      .then((res) => {
        if (!res.ok) return { user: null };
        return res.json();
      })
      .then((data: { user: AuthUser | null }) => {
        if (isMounted) {
          setUser(data.user);
        }
      })
      .catch(() => {
        if (isMounted) setUser(null);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    if (!email || !password) {
      return { ok: false, error: "Please enter your email and password." };
    }

    try {
      const normalizedEmail = email.trim().toLowerCase();
      const response = await fetch("/api/auth/login", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: normalizedEmail, password }),
      });

      const payload = (await response.json()) as { ok?: boolean; error?: string; user?: AuthUser | null };
      if (!response.ok || !payload.ok || !payload.user) {
        setUser(null);
        return { ok: false, error: payload.error ?? "Invalid email or password." };
      }

      setUser(payload.user);
      return { ok: true };
    } catch {
      return { ok: false, error: "Network error. Please try again." };
    }
  };

  const register = async (name: string, email: string, password: string) => {
    if (!name || !email || !password) {
      return { ok: false, error: "Please fill in all required fields." };
    }

    try {
      const normalizedEmail = email.trim().toLowerCase();
      const response = await fetch("/api/auth/register", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), email: normalizedEmail, password }),
      });

      const payload = (await response.json()) as { ok?: boolean; error?: string; user?: AuthUser | null };
      if (!response.ok || !payload.ok || !payload.user) {
        return { ok: false, error: payload.error ?? "Registration failed." };
      }

      setUser(payload.user);
      return { ok: true };
    } catch {
      return { ok: false, error: "Network error. Please try again." };
    }
  };

  const signOut = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } finally {
      setUser(null);
    }
  };

  const updateUser = (data: Partial<AuthUser>) => {
    setUser((prev) => (prev ? { ...prev, ...data } : null));
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isLoading,
      signIn,
      register,
      signOut,
      refreshUser,
      updateUser,
      isAuthenticated: Boolean(user),
    }),
    [user, isLoading, refreshUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
