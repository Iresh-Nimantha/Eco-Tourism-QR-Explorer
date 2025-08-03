"use client";

import "../../globals.css";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { LoginFormData } from "../../types/auth";
import logo from "@/public/loginLogo.svg";
import Image from "next/image";

export default function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<LoginFormData>();

  const emailValue = watch("email");

  useEffect(() => {
    setIsClient(true);
    const savedEmail = localStorage.getItem("loginEmail");
    const savedRememberMe = localStorage.getItem("rememberMePreference");
    if (savedEmail) setValue("email", savedEmail);
    if (savedRememberMe === "true") setValue("rememberMe", true);
  }, [setValue]);

  useEffect(() => {
    if (emailValue && isClient) {
      const emailRememberPreference = localStorage.getItem(
        `rememberMe_${emailValue}`
      );
      setValue("rememberMe", emailRememberPreference === "true");
    }
  }, [emailValue, setValue, isClient]);

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError("");
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (result.success) {
        if (data.rememberMe) {
          localStorage.setItem("loginEmail", data.email);
          localStorage.setItem("rememberMePreference", "true");
          localStorage.setItem(`rememberMe_${data.email}`, "true");
        } else {
          localStorage.setItem("loginEmail", data.email);
          localStorage.setItem("rememberMePreference", "false");
          localStorage.setItem(`rememberMe_${data.email}`, "false");
        }
        router.push("/admin");
        router.refresh();
      } else {
        setError(result.error || "Login failed");
      }
    } catch (err) {
      console.error("Network error:", err);
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 py-4 sm:py-8">
      {isClient && (
        <>
          <div className="absolute top-1/4 left-1/4 w-48 h-48 md:w-72 md:h-72 bg-green-300/20 rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-36 h-36 md:w-64 md:h-64 bg-emerald-300/20 rounded-full blur-2xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-28 h-28 md:w-40 md:h-40 bg-teal-300/20 rounded-full blur-xl animate-pulse delay-500"></div>
        </>
      )}
      <div className="relative max-w-sm w-full mx-2 sm:mx-4 z-10">
        <div className="text-center mb-6 sm:mb-8">
          <div
            className={`mx-auto bg-gradient-to-br from-green-500 via-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-xl border-4 border-white/20 ${
              isClient
                ? "transform rotate-3 hover:rotate-0 transition-all duration-300"
                : ""
            }`}
            style={{ width: "85px", height: "85px" }}
          >
            <Image
              src={logo}
              alt="Logo"
              width={72}
              height={72}
              className="object-contain"
            />
          </div>
          <h2 className="mt-1 text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-700 to-teal-700 tracking-tight py-1">
            Admin Login
          </h2>
          <p className="mt-1 text-xs sm:text-base font-medium text-gray-600 tracking-wide">
            "Eco Tourism" Location Management System
          </p>
        </div>
        <div className="bg-white/90 backdrop-blur-xl py-6 px-4 sm:py-8 sm:px-6 shadow-xl rounded-2xl border border-white/50 relative overflow-hidden">
          <form
            className="space-y-5 sm:space-y-6 relative z-10"
            onSubmit={handleSubmit(onSubmit)}
          >
            {error && (
              <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200/50 rounded-xl p-3 sm:p-4 mb-2 backdrop-blur-sm">
                <div className="flex items-start">
                  <svg
                    className="h-4 w-4 text-red-500 mr-2 mt-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p className="text-xs sm:text-sm font-semibold text-red-800">
                    {error}
                  </p>
                </div>
              </div>
            )}
            {/* Email */}
            <div className="space-y-1">
              <label
                htmlFor="email"
                className="block text-xs sm:text-sm font-semibold text-gray-800 tracking-wide"
              >
                Email Address
              </label>
              <input
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^\S+@\S+$/,
                    message: "Invalid email address",
                  },
                })}
                suppressHydrationWarning
                type="email"
                className="block w-full pl-4 pr-4 py-2 sm:py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 text-gray-900 placeholder-gray-400 font-medium bg-gray-50 transition-all"
                placeholder="admin@example.com"
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-600 flex items-center">
                  <svg
                    className="w-3 h-3 mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {errors.email.message}
                </p>
              )}
            </div>
            {/* Password */}
            <div className="space-y-1">
              <label
                htmlFor="password"
                className="block text-xs sm:text-sm font-semibold text-gray-800 tracking-wide"
              >
                Password
              </label>
              <div className="relative">
                <input
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                  suppressHydrationWarning
                  type={showPassword ? "text" : "password"}
                  className="block w-full pl-4 pr-10 py-2 sm:py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 text-gray-900 placeholder-gray-400 font-medium bg-gray-50 transition-all"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  suppressHydrationWarning
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-green-500 transition-shadow"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 25"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-red-600 flex items-center">
                  <svg
                    className="w-3 h-3 mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {errors.password.message}
                </p>
              )}
            </div>
            {/* Remember Me */}
            <div className="flex items-center">
              <input
                {...register("rememberMe")}
                id="rememberMe"
                type="checkbox"
                className="h-4 w-4 text-green-600 focus:ring-green-500/30 focus:ring-2 border border-gray-300 rounded bg-gray-50 transition-all"
              />
              <label
                htmlFor="rememberMe"
                className="ml-2 block text-xs font-medium text-gray-700 cursor-pointer"
              >
                Remember me for 30 days
              </label>
            </div>
            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={isLoading}
                suppressHydrationWarning
                className="w-full flex justify-center py-3 px-5 border-0 text-base font-bold rounded-xl text-white bg-gradient-to-r from-green-500 via-emerald-500 to-teal-600 hover:from-green-600 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-green-500/30 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200"
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Signing In...
                  </>
                ) : (
                  "Sign In"
                )}
              </button>
            </div>
          </form>
          {/* Small Footer */}
          <div className="mt-5 text-center">
            <div className="inline-flex items-center text-xs font-medium text-gray-500 bg-gray-50/50 px-3 py-1 rounded-full border border-gray-200/50">
              <svg
                className="w-3.5 h-3.5 text-green-500 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              Secure admin access for "Eco Tourism" Location Management
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
