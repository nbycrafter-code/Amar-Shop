"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isBn, setIsBn] = useState(true);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [token, setToken] = useState("");

  useEffect(() => {
    const tokenParam = searchParams.get("token");
    if (!tokenParam) {
      toast.error(isBn ? "অকার্যকর রিসেট লিংক" : "Invalid reset link");
      router.push("/login");
    } else {
      setToken(tokenParam);
    }
  }, [searchParams, router, isBn]);

  const toggleLanguage = () => {
    setIsBn(!isBn);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  // Password validation rules
  const [rules, setRules] = useState({
    length: false,
    uppercase: false,
    number: false,
    special: false
  });

  const validatePassword = (value: string) => {
    setRules({
      length: value.length >= 8,
      uppercase: /[A-Z]/.test(value),
      number: /[0-9]/.test(value),
      special: /[^A-Za-z0-9]/.test(value)
    });
    setPassword(value);
  };

  const checkMatch = () => {
    return password && confirmPassword && password === confirmPassword;
  };

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!password || !confirmPassword) {
      toast.error(isBn ? "দুইটি ফিল্ডই পূরণ করুন" : "Please fill in both fields");
      return;
    }

    if (password.length < 8) {
      toast.error(isBn ? "পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে" : "Password must be at least 8 characters");
      return;
    }

    if (!rules.uppercase) {
      toast.error(isBn ? "একটি বড় হাতের অক্ষর প্রয়োজন" : "One uppercase letter required");
      return;
    }

    if (!rules.number) {
      toast.error(isBn ? "একটি সংখ্যা প্রয়োজন" : "One number required");
      return;
    }

    if (!rules.special) {
      toast.error(isBn ? "একটি বিশেষ চিহ্ন প্রয়োজন" : "One special character required");
      return;
    }

    if (password !== confirmPassword) {
      toast.error(isBn ? "পাসওয়ার্ড মিলছে না" : "Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      setError("");
      
      const response = await fetch("/api/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, password }),
      });
      
      const result = await response.json();
      
      if (!response.ok || result?.error) {
        const errorMsg = result?.error || "Failed to reset password";
        setError(errorMsg);
        toast.error(errorMsg);
      } else {
        setSuccess(true);
        toast.success(result?.message || (isBn ? "পাসওয়ার্ড সফলভাবে পরিবর্তন হয়েছে!" : "Password reset successfully!"));
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      }
    } catch (err: any) {
      console.error("Reset password error:", err);
      toast.error(`Error: ${err.message}`);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // Bangla translations
  const bn = {
    resetPassword: "নতুন পাসওয়ার্ড দিন",
    subtitle: "শক্তিশালী পাসওয়ার্ড ব্যবহার করুন",
    newPassword: "নতুন পাসওয়ার্ড",
    confirmPassword: "পাসওয়ার্ড নিশ্চিত করুন",
    passwordPlaceholder: "••••••••",
    show: "দেখুন",
    hide: "লুকান",
    ruleLength: "কমপক্ষে ৮ অক্ষর",
    ruleUppercase: "একটি বড় হাতের অক্ষর (A-Z)",
    ruleNumber: "একটি সংখ্যা (0-9)",
    ruleSpecial: "একটি বিশেষ চিহ্ন (!@#$%^&*)",
    changePassword: "পাসওয়ার্ড পরিবর্তন করুন",
    changing: "পরিবর্তন হচ্ছে...",
    backToLogin: "লগইনে ফিরে যান",
    success: "পাসওয়ার্ড পরিবর্তন সফল!",
    successDesc: "আপনার পাসওয়ার্ড সফলভাবে পরিবর্তন হয়েছে। এখন লগইন করুন।",
    loginNow: "লগইন করুন",
    matchMessage: "পাসওয়ার্ড মিলেছে",
    noMatchMessage: "পাসওয়ার্ড মিলছে না"
  };

  // English translations
  const en = {
    resetPassword: "Set New Password",
    subtitle: "Use a strong password",
    newPassword: "New Password",
    confirmPassword: "Confirm Password",
    passwordPlaceholder: "••••••••",
    show: "Show",
    hide: "Hide",
    ruleLength: "At least 8 characters",
    ruleUppercase: "One uppercase letter (A-Z)",
    ruleNumber: "One number (0-9)",
    ruleSpecial: "One special character (!@#$%^&*)",
    changePassword: "Change Password",
    changing: "Changing...",
    backToLogin: "Back to Login",
    success: "Password Changed Successfully!",
    successDesc: "Your password has been changed successfully. Please login now.",
    loginNow: "Login Now",
    matchMessage: "Passwords match",
    noMatchMessage: "Passwords do not match"
  };

  const t = isBn ? bn : en;

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-blue-50 overflow-hidden font-dm relative">
        
        {/* Language Toggle Button */}
        <button
          onClick={toggleLanguage}
          className="fixed top-6 right-6 z-20 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm shadow-md border border-white/50 text-sm font-medium text-gray-700 hover:bg-white transition-all duration-200"
        >
          {isBn ? "English" : "বাংলা"}
        </button>

        {/* Background Blobs */}
        <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute rounded-full w-[500px] h-[500px] bg-[#f4a07a] -top-[150px] -left-[100px] opacity-35 blur-[80px] animate-float-1"></div>
          <div className="absolute rounded-full w-[400px] h-[400px] bg-[#a8c4e0] -bottom-[100px] -right-[80px] opacity-35 blur-[80px] animate-float-2"></div>
          <div className="absolute rounded-full w-[300px] h-[300px] bg-[#f7cbb0] top-1/2 left-[55%] -translate-x-1/2 -translate-y-1/2 opacity-35 blur-[80px] animate-float-3"></div>
        </div>

        {/* Success Card */}
        <div className="relative z-10 w-[420px] px-11 pt-12 pb-10 bg-white/55 backdrop-blur-2xl border border-white/75 rounded-3xl shadow-lg animate-slide-up">
          <div className="flex items-baseline justify-center mb-8">
            <span className="font-playfair text-[32px] font-bold text-[#ef553f] tracking-tight">AMAR</span>
            <span className="font-dm text-[22px] font-normal text-[#2c2c2c] tracking-wide">shop</span>
          </div>

          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-3xl bg-green-100 flex items-center justify-center">
              <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
          </div>

          <h1 className="font-playfair text-[22px] font-semibold text-[#1a1a1a] text-center mb-2">{t.success}</h1>
          <p className="text-center text-sm text-[#888] font-light mb-8 leading-relaxed px-4">
            {t.successDesc}
          </p>

          <a
            href="/login"
            className="flex items-center justify-center w-full h-[50px] text-white rounded-2xl font-dm text-base font-medium bg-gradient-to-r from-[#ef553f] to-[#d43f2a] shadow-[0_4px_12px_rgba(239,85,63,0.25)] transition-all duration-150 hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(239,85,63,0.35)] no-underline"
          >
            {t.loginNow}
          </a>
        </div>

        <style jsx>{`
          @keyframes float-1 {
            0%, 100% { transform: translate(0, 0); }
            50% { transform: translate(30px, 20px); }
          }
          @keyframes float-2 {
            0%, 100% { transform: translate(0, 0); }
            50% { transform: translate(-20px, -30px); }
          }
          @keyframes float-3 {
            0%, 100% { transform: translate(-50%, -50%) rotate(0deg); }
            50% { transform: translate(-50%, -50%) rotate(5deg) scale(1.05); }
          }
          @keyframes slide-up {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-float-1 { animation: float-1 8s ease-in-out infinite; }
          .animate-float-2 { animation: float-2 10s ease-in-out infinite; }
          .animate-float-3 { animation: float-3 12s ease-in-out infinite; }
          .animate-slide-up { animation: slide-up 0.5s ease-out; }
        `}</style>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-blue-50 overflow-hidden font-dm relative">
      
      {/* Language Toggle Button */}
      <button
        onClick={toggleLanguage}
        className="fixed top-6 right-6 z-20 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm shadow-md border border-white/50 text-sm font-medium text-gray-700 hover:bg-white transition-all duration-200"
      >
        {isBn ? "English" : "বাংলা"}
      </button>

      {/* Background Blobs */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute rounded-full w-[500px] h-[500px] bg-[#f4a07a] -top-[150px] -left-[100px] opacity-35 blur-[80px] animate-float-1"></div>
        <div className="absolute rounded-full w-[400px] h-[400px] bg-[#a8c4e0] -bottom-[100px] -right-[80px] opacity-35 blur-[80px] animate-float-2"></div>
        <div className="absolute rounded-full w-[300px] h-[300px] bg-[#f7cbb0] top-1/2 left-[55%] -translate-x-1/2 -translate-y-1/2 opacity-35 blur-[80px] animate-float-3"></div>
      </div>

      {/* Reset Form */}
      <div className="relative z-10 w-[420px] px-11 pt-12 pb-10 bg-white/55 backdrop-blur-2xl border border-white/75 rounded-3xl shadow-lg animate-slide-up">
        
        <Link href={'/'} className="flex items-baseline justify-center mb-8">
          <span className="font-playfair text-[32px] font-bold text-[#ef553f] tracking-tight">AMAR</span>
          <span className="font-dm text-[22px] font-normal text-[#2c2c2c] tracking-wide">shop</span>
        </Link>

        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-[#ef553f]/10 flex items-center justify-center">
            <svg className="w-8 h-8 text-[#ef553f]" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z"/>
            </svg>
          </div>
        </div>

        <h1 className="font-playfair text-[22px] font-semibold text-[#1a1a1a] text-center mb-1.5">{t.resetPassword}</h1>
        <p className="text-center text-sm text-[#888] font-light mb-8 leading-relaxed">
          {t.subtitle}
        </p>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* New Password */}
          <div className="mb-[18px]">
            <label className="block text-[12.5px] font-medium text-[#555] tracking-[0.4px] uppercase mb-[7px]">
              {t.newPassword}
            </label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder={t.passwordPlaceholder}
                value={password}
                onChange={(e) => validatePassword(e.target.value)}
                disabled={loading}
                className="w-full h-[46px] px-4 rounded-xl text-[15px] text-[#1a1a1a] font-dm bg-white/65 border border-black/13 outline-none transition-all duration-200 focus:border-[#ef553f] focus:bg-white/90 focus:ring-4 focus:ring-[#ef553f]/10 placeholder:text-[#bbb] pr-12 disabled:opacity-50 disabled:cursor-not-allowed"
                required
              />
              <button 
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#aaa] hover:text-[#555] transition-colors text-xs font-medium"
              >
                {showPassword ? t.hide : t.show}
              </button>
            </div>

            {/* Password Rules */}
            <div className="mt-3 space-y-1.5 bg-black/[0.03] rounded-xl p-3">
              <div className={`rule-item text-sm ${rules.length ? 'text-green-500' : 'text-[#aaa]'}`}>
                <span className="text-base mr-2">{rules.length ? '✓' : '○'}</span>
                <span>{t.ruleLength}</span>
              </div>
              <div className={`rule-item text-sm ${rules.uppercase ? 'text-green-500' : 'text-[#aaa]'}`}>
                <span className="text-base mr-2">{rules.uppercase ? '✓' : '○'}</span>
                <span>{t.ruleUppercase}</span>
              </div>
              <div className={`rule-item text-sm ${rules.number ? 'text-green-500' : 'text-[#aaa]'}`}>
                <span className="text-base mr-2">{rules.number ? '✓' : '○'}</span>
                <span>{t.ruleNumber}</span>
              </div>
              <div className={`rule-item text-sm ${rules.special ? 'text-green-500' : 'text-[#aaa]'}`}>
                <span className="text-base mr-2">{rules.special ? '✓' : '○'}</span>
                <span>{t.ruleSpecial}</span>
              </div>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="mb-6">
            <label className="block text-[12.5px] font-medium text-[#555] tracking-[0.4px] uppercase mb-[7px]">
              {t.confirmPassword}
            </label>
            <div className="relative">
              <input 
                type={showConfirmPassword ? "text" : "password"} 
                placeholder={t.passwordPlaceholder}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading}
                className="w-full h-[46px] px-4 rounded-xl text-[15px] text-[#1a1a1a] font-dm bg-white/65 border border-black/13 outline-none transition-all duration-200 focus:border-[#ef553f] focus:bg-white/90 focus:ring-4 focus:ring-[#ef553f]/10 placeholder:text-[#bbb] pr-12 disabled:opacity-50 disabled:cursor-not-allowed"
                required
              />
              <button 
                type="button"
                onClick={toggleConfirmPasswordVisibility}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#aaa] hover:text-[#555] transition-colors text-xs font-medium"
              >
                {showConfirmPassword ? t.hide : t.show}
              </button>
            </div>
            {confirmPassword && (
              <p className={`text-[11.5px] mt-1.5 ${checkMatch() ? 'text-green-500' : 'text-red-500'}`}>
                {checkMatch() ? `✓ ${t.matchMessage}` : `✗ ${t.noMatchMessage}`}
              </p>
            )}
          </div>

          <button 
            type="submit"
            disabled={loading || !checkMatch() || !rules.length || !rules.uppercase || !rules.number || !rules.special}
            className="w-full h-[50px] text-white rounded-2xl font-dm text-base font-medium tracking-wide cursor-pointer border-none bg-gradient-to-r from-[#ef553f] to-[#d43f2a] shadow-[0_4px_12px_rgba(239,85,63,0.25)] transition-all duration-150 hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(239,85,63,0.35)] active:translate-y-0 active:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
          >
            {loading ? t.changing : t.changePassword}
          </button>
        </form>

        <p className="text-center mt-6 text-[13.5px] text-[#888]">
          <a href="/login" className="text-[#ef553f] font-medium hover:underline">
            ← {t.backToLogin}
          </a>
        </p>
      </div>

      <style jsx>{`
        @keyframes float-1 {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(30px, 20px); }
        }
        @keyframes float-2 {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(-20px, -30px); }
        }
        @keyframes float-3 {
          0%, 100% { transform: translate(-50%, -50%) rotate(0deg); }
          50% { transform: translate(-50%, -50%) rotate(5deg) scale(1.05); }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-float-1 { animation: float-1 8s ease-in-out infinite; }
        .animate-float-2 { animation: float-2 10s ease-in-out infinite; }
        .animate-float-3 { animation: float-3 12s ease-in-out infinite; }
        .animate-slide-up { animation: slide-up 0.5s ease-out; }
      `}</style>
    </div>
  );
}