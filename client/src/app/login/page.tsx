"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sparkles } from "lucide-react";
import { authService } from "@/services/auth.service";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Check if already logged in
  useEffect(() => {
    const user = authService.getCurrentUser();
    if (user) {
      router.push("/");
    }
  }, [router]);

  const handleFillDemo = () => {
    setEmail("farmer.ramesh@agrosense.ai");
    setPassword("password123");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const data = await authService.login({ email, password });

      // Save user and token
      localStorage.setItem("agrosense_user", JSON.stringify(data.data.user));
      localStorage.setItem("agrosense_token", data.data.token);

      // Redirect to dashboard
      router.push("/");
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-white font-sans text-gray-900">
      {/* Left side: Branding / Illustration (Desktop only) */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-center items-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/rice field-bro.svg"
            alt="AgroSense AI Illustration"
            fill
            className="object-cover"
            priority
          />
          {/* Subtle overlay for text readability */}
          <div className="absolute inset-0 bg-emerald-900/10" />
        </div>

      </div>

      {/* Right side: Form (Main focus) */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="max-w-[400px] w-full space-y-8">
          {/* Mobile Logo */}
          <div className="lg:hidden flex flex-col items-center mb-8">
            <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-200 mb-4">
              <span className="text-white font-bold text-2xl">A</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">AgroSense AI</h1>
            <p className="text-gray-500 text-sm">Smart farming solutions</p>
          </div>

          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">Sign In</h2>
            <p className="text-gray-500">
              Welcome back! Please enter your details.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-100 text-red-600 text-sm font-medium">
                {error}
              </div>
            )}
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                disabled={isLoading}
                placeholder="Enter your email"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200 disabled:opacity-50"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-1.5 text-right">
              <label htmlFor="password" title="Password" className="text-sm font-medium text-gray-700 text-left block">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                disabled={isLoading}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200 mb-2 disabled:opacity-50"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Link
                href="/auth/forgot-password"
                className="text-sm font-semibold text-emerald-700 hover:text-emerald-800 transition-colors"
              >
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl shadow-lg shadow-emerald-200 transition-all duration-200 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                "Login"
              )}
            </button>

            <button
              type="button"
              onClick={handleFillDemo}
              disabled={isLoading}
              className="w-full py-3 px-4 bg-white border border-emerald-100 text-emerald-700 font-semibold rounded-xl hover:bg-emerald-50 transition-all duration-200 flex items-center justify-center gap-2 group disabled:opacity-50"
            >
              <Sparkles size={18} className="group-hover:rotate-12 transition-transform text-emerald-500" />
              Fill Demo Details
            </button>
          </form>

          <p className="text-center text-gray-600 text-sm">
            Net yet a member?{" "}
            <Link
              href="/register"
              className="font-bold text-emerald-700 hover:text-emerald-800 transition-colors underline-offset-4 hover:underline"
            >
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
