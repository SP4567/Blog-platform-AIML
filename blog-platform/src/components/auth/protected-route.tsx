"use client";

import { useAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: "author" | "editor" | "moderator" | "administrator" | "super_admin";
}

export function ProtectedRoute({ children, requiredRole = "author" }: ProtectedRouteProps) {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }

    if (requiredRole && (!user || (user.role !== requiredRole && user.role !== "super_admin" && user.role !== "administrator"))) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, requiredRole, router, user]);

  if (!isAuthenticated || !user) {
    return null;
  }

  if (requiredRole && user.role !== requiredRole && user.role !== "super_admin" && user.role !== "administrator") {
    return null;
  }

  return <>{children}</>;
}
