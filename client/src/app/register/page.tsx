"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    deviceId: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Simple validation (Optional but good)
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    // Create dummy user from registration data
    const dummyUser = {
      name: formData.name,
      email: formData.email,
      deviceId: formData.deviceId,
      token: "dummy-token-reg-123",
    };

    // Save to localStorage
    localStorage.setItem("agrosense_user", JSON.stringify(dummyUser));

    // Redirect to dashboard
    router.push("/");
  };

  return (
    <div className="flex min-h-screen bg-white font-sans text-gray-900 overflow-hidden">
      {/* Left side: Branding / Illustration (Desktop only) */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-center items-center overflow-hidden h-screen sticky top-0">
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
      <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-12 h-screen overflow-y-auto no-scrollbar">
        <div className="max-w-[440px] w-full space-y-10 py-12">
          {/* Mobile Logo */}
          <div className="lg:hidden flex flex-col items-center mb-8">
            <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-200 mb-4">
              <span className="text-white font-bold text-2xl">A</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">AgroSense AI</h1>
            <p className="text-gray-500 text-sm">Create your smart farming account</p>
          </div>

          <div className="space-y-3">
            <h2 className="text-4xl font-bold tracking-tight text-gray-900">Create Account</h2>
            <p className="text-gray-500 font-medium">
              Start monitoring your crops with precision AI.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1.5">
              <label htmlFor="name" className="text-sm font-semibold text-gray-700">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                required
                placeholder="Enter your name"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
              <div className="space-y-1.5">
                <label htmlFor="email" className="text-sm font-semibold text-gray-700">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  placeholder="abc@example.com"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="deviceId" className="text-sm font-semibold text-gray-700">
                  Device ID <span className="text-emerald-600 font-bold">*</span>
                </label>
                <input
                  id="deviceId"
                  type="text"
                  required
                  placeholder="AS-XXXX-XXXX"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200"
                  value={formData.deviceId}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="password" title="Password" className="text-sm font-semibold text-gray-700">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="confirmPassword" title="Confirm Password" className="text-sm font-semibold text-gray-700">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-4 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-200 transition-all duration-200 active:scale-[0.98] disabled:opacity-70"
            >
              Create Account
            </button>
          </form>

          <p className="text-center text-gray-600 text-sm">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-bold text-emerald-700 hover:text-emerald-800 transition-colors underline-offset-4 hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
