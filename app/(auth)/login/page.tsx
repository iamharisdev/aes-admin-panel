"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/lib/services/auth.service";
import Input from "@/components/ui/input";
import Button from "@/components/ui/button";
import { Mail, ShieldCheck, Lock } from "lucide-react";

const SUPER_ADMIN_ROLE = "super_admin";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setError("");
    setLoading(true);

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const { data } = await authService.login({ email, password });
      const { accessToken, refreshToken, user } = data.data;

      if (user.role.toLowerCase() !== SUPER_ADMIN_ROLE) {
        setError("You don't have permission to access the dashboard. Super Admin role required.");
        return;
      }

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("user", JSON.stringify(user));
      document.cookie = `token=${accessToken}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;

      router.push("/roles");
      router.refresh();
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? "Invalid email or password.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white-to-br from-slate-900 via-slate-800 to-slate-900 px-4">
    

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-xl shadow-green-500/30 mb-4">
            <ShieldCheck className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">AES Admin</h1>
          <p className="text-slate-900 text-sm mt-1.5">Sign in to your admin account</p>
        </div>

        {/* Card */}
        <div className="bg-white/900 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
          <form action={handleSubmit} className="space-y-5">
            <Input
              name="email"
              type="email"
              label="Email address"
              placeholder="admin@example.com"
              autoComplete="email"
              required
              dark
              inputSize="lg"
              
              leftIcon={<Mail className="w-4 h-4" />}
            />

            <Input
              name="password"
              type="password"
              label="Password"
              placeholder="••••••••"
              autoComplete="current-password"
              required
              dark
              inputSize="lg"
              leftIcon={<Lock className="w-4 h-4" />}
            />

            {error && (
              <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                <svg className="w-4 h-4 text-red-400 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              size="lg"
              fullWidth
              loading={loading}
              className="mt-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 shadow-lg shadow-green-500/25 rounded-xl"
            >
              Sign in
            </Button>
          </form>
        </div>

        <p className="text-center text-slate-500 text-xs mt-6">
          Only Super Admin accounts can access this panel.
        </p>
      </div>
    </div>
  );
}
