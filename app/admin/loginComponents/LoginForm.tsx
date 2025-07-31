'use client';

import '@/styles/globals.css';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { LoginFormData } from '../../types/auth';
import logo from '@/public/loginLogo.svg';
import Image from 'next/image';

export default function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm<LoginFormData>();

  const emailValue = watch('email');

  useEffect(() => {
    setIsClient(true);
    
    // Load saved email and remember me preference from localStorage
    const savedEmail = localStorage.getItem('loginEmail');
    const savedRememberMe = localStorage.getItem('rememberMePreference');
    
    if (savedEmail) {
      setValue('email', savedEmail);
    }
    
    if (savedRememberMe === 'true') {
      setValue('rememberMe', true);
    }
  }, [setValue]);

  
  useEffect(() => {
    if (emailValue && isClient) {
      
      const emailRememberPreference = localStorage.getItem(`rememberMe_${emailValue}`);
      if (emailRememberPreference === 'true') {
        setValue('rememberMe', true);
      } else {
        setValue('rememberMe', false);
      }
    }
  }, [emailValue, setValue, isClient]);

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        
        if (data.rememberMe) {
          // Save email and remember me preference
          localStorage.setItem('loginEmail', data.email);
          localStorage.setItem('rememberMePreference', 'true');
          localStorage.setItem(`rememberMe_${data.email}`, 'true');
        } else {
          
          localStorage.setItem('loginEmail', data.email);
          localStorage.setItem('rememberMePreference', 'false');
          localStorage.setItem(`rememberMe_${data.email}`, 'false');
        }

        router.push('/admin/dashboard');
        router.refresh();
      } else {
        setError(result.error || 'Login failed');
      }

     
       
    } catch (err) {
      console.error('Network error:', err);
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Animated Background - Only render on client */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-green-400/10 via-emerald-400/10 to-teal-400/10"></div>
        {isClient && (
          <>
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-300/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-emerald-300/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-teal-300/20 rounded-full blur-2xl animate-pulse delay-500"></div>
          </>
        )}
      </div>

      <div className="relative max-w-md w-full mx-4 sm:mx-6 lg:mx-8 z-10">
        {/* Logo/Header Section */}
         <div className="text-center mb-8">
          <div className={`mx-auto bg-gradient-to-br from-green-500 via-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-2xl border-4 border-white/20 ${isClient ? 'transform rotate-3 hover:rotate-0 transition-all duration-300' : ''}`} 
            style={{ width: '105px', height: '105px' }}>
              <Image 
                src={logo} 
                alt="Logo" 
                width={100}
                height={100}
                className="object-contain"
              />
            </div>
          <h2 className="mt-1 text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-700 via-emerald-600 to-teal-700 tracking-tight py-1">
            Admin Login
          </h2>
          <p className="mt-1 text-base font-medium text-gray-600 tracking-wide">
            QR Code Tourism Management System
          </p>
          <div className="mt-3 w-24 h-1 bg-gradient-to-r from-green-500 to-emerald-500 mx-auto rounded-full"></div>
        </div>

        {/* Login Form */}
        <div className="bg-white/80 backdrop-blur-xl py-10 px-8 shadow-2xl rounded-3xl border border-white/50 relative overflow-hidden">
          {/* Decorative Elements */}
          
          <div className="absolute top-0 left-0 w-full h-2 -to-r from-white-100 via-emerald-100 to-teal-100"></div>
          {isClient && (
            <>
             
              
            </>
          )}

          <form className="space-y-7 relative z-10" onSubmit={handleSubmit(onSubmit)}>
            {/* Error Message */}
            {error && (
              <div className="bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200/50 rounded-2xl p-5 backdrop-blur-sm">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="h-6 w-6 bg-red-100 rounded-full flex items-center justify-center">
                      <svg className="h-4 w-4 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-semibold text-red-800">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-bold text-gray-800 tracking-wide">
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className={`h-5 w-5 text-gray-400 ${isClient ? 'group-focus-within:text-green-500 transition-colors duration-200' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
                <input
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: 'Invalid email address'
                    }
                  })}
                  suppressHydrationWarning={true}
                  type="email"
                  className={`block w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-green-500/20 focus:border-green-500 text-gray-900 placeholder-gray-400 font-medium bg-gray-50/50 ${isClient ? 'transition-all duration-300 hover:bg-white hover:border-gray-300' : ''}`}
                  placeholder="admin@example.com"
                />
                {isClient && (
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-green-500/10 to-emerald-500/10 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                )}
              </div>
              {errors.email && (
                <p className="mt-2 text-sm text-red-600 font-medium flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-bold text-gray-800 tracking-wide">
                  Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className={`h-5 w-5 text-gray-400 ${isClient ? 'group-focus-within:text-green-500 transition-colors duration-200' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    {...register('password', {
                      required: 'Password is required',
                      minLength: {
                        value: 6,
                        message: 'Password must be at least 6 characters'
                      }
                    })}
                    suppressHydrationWarning={true}
                    type={showPassword ? "text" : "password"}
                    className={`block w-full pl-12 pr-12 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-green-500/20 focus:border-green-500 text-gray-900 placeholder-gray-400 font-medium bg-gray-50/50 ${isClient ? 'transition-all duration-300 hover:bg-white hover:border-gray-300' : ''}`}
                    placeholder="Enter your password"
                  />
                  {/* Password visibility toggle button */}
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    suppressHydrationWarning={true}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-green-500 transition-colors duration-200"
                  >
                    {showPassword ? (
                      <svg className="h-5 w-5  " fill="none" stroke="currentColor" viewBox="0 0 24 25">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5 " fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                  {isClient && (
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-green-500/10 to-emerald-500/10 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  )}
                </div>
                {errors.password && (
                  <p className="mt-2 text-sm text-red-600 font-medium flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.password.message}
                  </p>
                )}
              </div>

            {/* Remember Me */}
            <div className="flex items-center group">
              <div className="relative">
                <input
                  {...register('rememberMe')}
                  id="rememberMe"
                  type="checkbox"
                  className={`h-5 w-5 text-green-600 focus:ring-green-500/30 focus:ring-4 border-2 border-gray-300 rounded-lg bg-gray-50 ${isClient ? 'transition-all duration-200 hover:border-green-400' : ''}`}
                />
                {isClient && (
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-green-500/20 to-emerald-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"></div>
                )}
              </div>
              <label htmlFor="rememberMe" className={`ml-3 block text-sm font-medium text-gray-700 cursor-pointer ${isClient ? 'group-hover:text-green-700 transition-colors duration-200' : ''}`}>
                Remember me for 30 days
              </label>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                suppressHydrationWarning={true}
                className="group relative w-full flex justify-center py-4 px-6 border-0 text-base font-bold rounded-2xl text-white bg-gradient-to-r from-green-500 via-emerald-500 to-teal-600 hover:from-green-600 hover:via-emerald-600 hover:to-teal-700 focus:outline-none focus:ring-4 focus:ring-green-500/30 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02] hover:shadow-2xl hover:shadow-green-500/25 active:scale-[0.98] overflow-hidden"
              >
                {/* Button Shine Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                
                {isLoading ? (
                  <div className="flex items-center relative z-10">
                    <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="tracking-wide">Signing In...</span>
                  </div>
                ) : (
                  <div className="flex items-center relative z-10">
                    <svg className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    <span className="tracking-wide">Sign In</span>
                  </div>
                )}
              </button>
            </div>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center relative z-10">
            <div className="inline-flex items-center justify-center space-x-2 text-xs font-medium text-gray-500 bg-gray-50/50 px-4 py-2 rounded-full border border-gray-200/50">
              <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span>Secure admin access for QR Code Tourism Management</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}