import type { Metadata } from "next";
import { createMetadata } from "@/lib/seo";
import { RegisterForm } from "@/components/auth/register-form";

export const metadata: Metadata = createMetadata("Register", "Create a new account and join the community.");

export default function RegisterPage() {
  return <RegisterForm />;
}
