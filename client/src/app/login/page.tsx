"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sparkles } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  // Check if already logged in
  useEffect(() => {
    const user = localStorage.getItem("agrosense_user");
    if (user) {
      router.push("/");
    }
  }, [router]);

  const handleFillDemo = () => {
    setEmail("farmer.ramesh@agrosense.ai");
    setPassword("password123");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create dummy user
    const dummyUser = {
      name: "AgroSense User",
      email: email,
      token: "dummy-token-123",
    };

    // Save to localStorage
    localStorage.setItem("agrosense_user", JSON.stringify(dummyUser));
    
    // Redirect to dashboard
    router.push("/");
  };

  return (
    <div className="flex min-h-screen bg-white font-sans text-gray-900">
      {/* Left side: Branding / Illustration (Desktop only) */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center items-center bg-[#F1F8F1] p-12">
        <div className="max-w-md w-full text-center lg:text-left space-y-6">
          <div className="flex items-center space-x-2 text-emerald-800">
            <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">A</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight">AgroSense AI</h1>
          </div>
          <p className="text-xl text-emerald-900/70 font-medium leading-relaxed">
            Smart farming powered by real-time data
          </p>
          <div className="relative aspect-video w-full mt-8 flex items-center justify-center">
            <Image
              src="/auth-illustration.png"
              alt="AgroSense AI Illustration"
              width={500}
              height={500}
              className="object-contain"
              priority
            />
          </div>
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
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                placeholder="Enter your email"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200"
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
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200 mb-2"
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
              className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl shadow-lg shadow-emerald-200 transition-all duration-200 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              Login
            </button>

            <button
              type="button"
              onClick={handleFillDemo}
              className="w-full py-3 px-4 bg-white border border-emerald-100 text-emerald-700 font-semibold rounded-xl hover:bg-emerald-50 transition-all duration-200 flex items-center justify-center gap-2 group"
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
