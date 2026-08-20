import type { Metadata } from "next";
import { createMetadata } from "@/lib/seo";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = createMetadata("Login", "Sign in to your account and continue your publishing workflow.");

export default function LoginPage() {
  return <LoginForm />;
}
