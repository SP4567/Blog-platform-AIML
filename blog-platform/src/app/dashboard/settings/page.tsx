"use client";

import { useState } from "react";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth, type AuthUser } from "@/lib/auth";
import { CheckCircle2, AlertCircle, Palette } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

function ProfileForm({ user, updateUser }: { user: AuthUser; updateUser: (data: Partial<AuthUser>) => void }) {
  const [name, setName] = useState(user.name ?? "");
  const [bio, setBio] = useState(user.bio ?? "");
  const [location, setLocation] = useState(user.location ?? "");
  const [website, setWebsite] = useState(user.website ?? "");
  const [image, setImage] = useState(user.image ?? "");
  const [profileStatus, setProfileStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [profileMsg, setProfileMsg] = useState("");

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileStatus("loading");
    setProfileMsg("");

    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          bio: bio.trim(),
          location: location.trim(),
          website: website.trim() || null,
          image: image.trim() || null,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.ok) {
        setProfileStatus("error");
        setProfileMsg(data.error ?? "Failed to update profile.");
        return;
      }

      updateUser(data.profile);
      setProfileStatus("success");
      setProfileMsg("Profile updated successfully.");
    } catch {
      setProfileStatus("error");
      setProfileMsg("Network error while saving profile.");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Author Profile</CardTitle>
        <CardDescription>Manage your public persona, bio, and social links.</CardDescription>
      </CardHeader>
      <form onSubmit={handleProfileSave} className="space-y-4 pt-1">
        <div>
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Display Name</label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Mina Chen"
            required
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Bio</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell readers about your work, background, and focus areas"
            rows={3}
            className="w-full rounded-2xl border border-slate-200 p-3 text-sm text-slate-800 outline-none focus:border-slate-400 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-slate-600 transition-colors"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Location</label>
          <Input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g. San Francisco, USA"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Personal Website / Portfolio</label>
          <Input
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            placeholder="https://yourportfolio.dev"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Avatar Image URL</label>
          <Input
            value={image}
            onChange={(e) => setImage(e.target.value)}
            placeholder="https://images.unsplash.com/photo-..."
          />
        </div>

        {profileMsg ? (
          <div className={`flex items-center gap-2 text-sm p-3 rounded-2xl ${
            profileStatus === "success"
              ? "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800"
              : "bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-800"
          }`}>
            {profileStatus === "success" ? <CheckCircle2 className="h-4 w-4 shrink-0" /> : <AlertCircle className="h-4 w-4 shrink-0" />}
            <span>{profileMsg}</span>
          </div>
        ) : null}

        <Button type="submit" disabled={profileStatus === "loading"} className="rounded-full dark:bg-indigo-600 dark:hover:bg-indigo-500">
          {profileStatus === "loading" ? "Saving profile…" : "Save profile"}
        </Button>
      </form>
    </Card>
  );
}

function PasswordForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [secStatus, setSecStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [secMsg, setSecMsg] = useState("");

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setSecStatus("loading");
    setSecMsg("");

    if (newPassword !== confirmPassword) {
      setSecStatus("error");
      setSecMsg("New passwords do not match.");
      return;
    }

    if (newPassword.length < 6) {
      setSecStatus("error");
      setSecMsg("New password must be at least 6 characters.");
      return;
    }

    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.ok) {
        setSecStatus("error");
        setSecMsg(data.error ?? "Failed to change password.");
        return;
      }

      setSecStatus("success");
      setSecMsg("Password changed successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch {
      setSecStatus("error");
      setSecMsg("Network error while updating password.");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Security & Password</CardTitle>
        <CardDescription>Update your password to keep your account safe.</CardDescription>
      </CardHeader>
      <form onSubmit={handlePasswordChange} className="space-y-4 pt-1">
        <div>
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Current Password</label>
          <Input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="Enter current password"
            required
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">New Password</label>
          <Input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Min 6 characters"
            required
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Confirm New Password</label>
          <Input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Repeat new password"
            required
          />
        </div>

        {secMsg ? (
          <div className={`flex items-center gap-2 text-sm p-3 rounded-2xl ${
            secStatus === "success"
              ? "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800"
              : "bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-800"
          }`}>
            {secStatus === "success" ? <CheckCircle2 className="h-4 w-4 shrink-0" /> : <AlertCircle className="h-4 w-4 shrink-0" />}
            <span>{secMsg}</span>
          </div>
        ) : null}

        <Button type="submit" disabled={secStatus === "loading"} className="rounded-full dark:bg-indigo-600 dark:hover:bg-indigo-500">
          {secStatus === "loading" ? "Updating password…" : "Update password"}
        </Button>
      </form>
    </Card>
  );
}

export default function SettingsPage() {
  const { user, updateUser } = useAuth();

  return (
    <ProtectedRoute>
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Account</p>
          <h1 className="mt-1 text-3xl font-bold text-slate-950 dark:text-white">Settings & Preferences</h1>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {user ? (
            <ProfileForm key={user.id} user={user} updateUser={updateUser} />
          ) : (
            <Card><p className="p-6 text-sm text-slate-500 dark:text-slate-400">Loading user profile…</p></Card>
          )}
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Palette className="h-5 w-5 text-indigo-500" />
                  <CardTitle>Interface Appearance</CardTitle>
                </div>
                <CardDescription>Select your preferred editorial workspace theme or sync with your operating system.</CardDescription>
              </CardHeader>
              <div className="pt-2">
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-3">Color Mode</label>
                <ThemeToggle variant="segmented" />
              </div>
            </Card>

            <PasswordForm />
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
