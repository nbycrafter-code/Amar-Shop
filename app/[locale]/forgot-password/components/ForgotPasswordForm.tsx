"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";

export function ForgotPasswordForm() {
  const router = useRouter();
  const [isBn, setIsBn] = useState(true);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [emailSent, setEmailSent] = useState(false);

  const toggleLanguage = () => {
    setIsBn(!isBn);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email) {
      toast.error(isBn ? "আপনার ইমেইল ঠিকানা দিন" : "Please enter your email address");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error(isBn ? "সঠিক ইমেইল ঠিকানা দিন" : "Please enter a valid email address");
      return;
    }

    try {
      setLoading(true);
      setError("");
      
      const data = {
        email: email.trim().toLowerCase(),
      };
      
      const response = await fetch("/api/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      
      const result = await response.json();
      
      if (!response.ok || result?.error) {
        const errorMsg = result?.error || "Failed to send reset link";
        setError(errorMsg);
        toast.error(errorMsg);
      } else {
        setEmailSent(true);
        toast.success(result?.message || (isBn ? "রিসেট লিংক ইমেইলে পাঠানো হয়েছে!" : "Reset link sent to your email!"));
      }
    } catch (err: any) {
      console.error("Password reset error:", err);
      toast.error(`Error: ${err.message}`);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) return;
    
    try {
      setLoading(true);
      const response = await fetch("/api/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        toast.error(result?.error || "Failed to resend");
      } else {
        toast.success(result?.message || (isBn ? "আবার পাঠানো হয়েছে!" : "Resent successfully!"));
      }
    } catch (err: any) {
      toast.error(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Bangla translations
  const bn = {
    forgotPassword: "পাসওয়ার্ড পুনরুদ্ধার",
    subtitle: "আপনার ইমেইল দিন, আমরা পাসওয়ার্ড রিসেটের লিংক পাঠাবো",
    email: "ইমেইল ঠিকানা",
    emailPlaceholder: "your@email.com",
    sendLink: "রিসেট লিংক পাঠান",
    sending: "পাঠানো হচ্ছে...",
    rememberPassword: "মনে পড়ে গেছে?",
    login: "লগইন করুন",
    emailSent: "ইমেইল পাঠানো হয়েছে!",
    emailSentDesc: "আপনার ইমেইলে রিসেট লিংক পাঠানো হয়েছে। ইনবক্স চেক করুন।",
    emailNotReceived: "ইমেইল না পেলে",
    spamFolder: "স্প্যাম ফোল্ডার",
    checkSpam: "চেক করুন অথবা কিছুক্ষণ পর আবার চেষ্টা করুন।",
    resend: "আবার পাঠান",
    backToLogin: "লগইনে ফিরে যান"
  };

  // English translations
  const en = {
    forgotPassword: "Forgot Password",
    subtitle: "Enter your email and we'll send you a reset link",
    email: "Email Address",
    emailPlaceholder: "your@email.com",
    sendLink: "Send Reset Link",
    sending: "Sending...",
    rememberPassword: "Remember password?",
    login: "Login",
    emailSent: "Email Sent!",
    emailSentDesc: "We've sent a password reset link to your email. Please check your inbox.",
    emailNotReceived: "Didn't receive the email?",
    spamFolder: "Spam folder",
    checkSpam: "Check your spam folder or try again in a few minutes.",
    resend: "Resend",
    backToLogin: "Back to Login"
  };

  const t = isBn ? bn : en;

  if (emailSent) {
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

        {/* Step 2: Email Sent Success */}
        <div className="relative z-10 w-[420px] px-11 pt-12 pb-10 bg-white/55 backdrop-blur-2xl border border-white/75 rounded-3xl shadow-lg animate-slide-up">
          <div className="flex items-baseline justify-center mb-8">
            <span className="font-playfair text-[32px] font-bold text-[#ef553f] tracking-tight">AMAR</span>
            <span className="font-dm text-[22px] font-normal text-[#2c2c2c] tracking-wide">shop</span>
          </div>

          {/* Success Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-green-100 flex items-center justify-center">
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"/>
              </svg>
            </div>
          </div>

          <h1 className="font-playfair text-[22px] font-semibold text-[#1a1a1a] text-center mb-1.5">{t.emailSent}</h1>
          <p className="text-center text-sm text-[#888] font-light mb-8 leading-relaxed px-4">
            {t.emailSentDesc}
          </p>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm text-center">
              {error}
            </div>
          )}

          <div className="bg-[#ef553f]/5 border border-[#ef553f]/15 rounded-2xl p-4 mb-6">
            <p className="text-[13px] text-[#666] text-center leading-relaxed">
              {t.emailNotReceived} <span className="font-medium text-[#444]">{t.spamFolder}</span> {t.checkSpam}
            </p>
          </div>

          <button 
            onClick={handleResend}
            disabled={loading}
            className="w-full h-[50px] text-white rounded-2xl font-dm text-base font-medium tracking-wide cursor-pointer border-none bg-gradient-to-r from-[#ef553f] to-[#d43f2a] shadow-[0_4px_12px_rgba(239,85,63,0.25)] transition-all duration-150 hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(239,85,63,0.35)] active:translate-y-0 active:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
          >
            {loading ? (isBn ? "পাঠানো হচ্ছে..." : "Sending...") : t.resend}
          </button>

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

      {/* Step 1: Email Input */}
      <div className="relative z-10 w-[420px] px-11 pt-12 pb-10 bg-white/55 backdrop-blur-2xl border border-white/75 rounded-3xl shadow-lg animate-slide-up">
        
        <Link href={'/'} className="flex items-baseline justify-center mb-8">
          <span className="font-playfair text-[32px] font-bold text-[#ef553f] tracking-tight">AMAR</span>
          <span className="font-dm text-[22px] font-normal text-[#2c2c2c] tracking-wide">shop</span>
        </Link>

        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-[#ef553f]/10 flex items-center justify-center">
            <svg className="w-8 h-8 text-[#ef553f]" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"/>
            </svg>
          </div>
        </div>

        <h1 className="font-playfair text-[22px] font-semibold text-[#1a1a1a] text-center mb-1.5">{t.forgotPassword}</h1>
        <p className="text-center text-sm text-[#888] font-light mb-8 leading-relaxed">
          {t.subtitle}
        </p>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-[12.5px] font-medium text-[#555] tracking-[0.4px] uppercase mb-[7px]">
              {t.email}
            </label>
            <input 
              type="email" 
              placeholder={t.emailPlaceholder}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              className="w-full h-[46px] px-4 rounded-xl text-[15px] text-[#1a1a1a] font-dm bg-white/65 border border-black/13 outline-none transition-all duration-200 focus:border-[#ef553f] focus:bg-white/90 focus:ring-4 focus:ring-[#ef553f]/10 placeholder:text-[#bbb] disabled:opacity-50 disabled:cursor-not-allowed"
              required
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full h-[50px] text-white rounded-2xl font-dm text-base font-medium tracking-wide cursor-pointer border-none bg-gradient-to-r from-[#ef553f] to-[#d43f2a] shadow-[0_4px_12px_rgba(239,85,63,0.25)] transition-all duration-150 hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(239,85,63,0.35)] active:translate-y-0 active:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
          >
            {loading ? t.sending : t.sendLink}
          </button>
        </form>

        <p className="text-center mt-6 text-[13.5px] text-[#888]">
          {t.rememberPassword}
          <Link href="/login" className="text-[#ef553f] font-medium hover:underline ml-1">
            {t.login}
          </Link>
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