"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import { signIn } from "next-auth/react";

export function LoginForm({ }) {
  const router = useRouter();
  const [isBn, setIsBn] = useState(true);
  const [email, setEmail] = useState("dip@nbyit.com");
  const [password, setPassword] = useState("Dip@1234");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const toggleLanguage = () => {
    setIsBn(!isBn);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // Validation
    if (!email || !password) {
      toast.error(isBn ? "ইমেইল এবং পাসওয়ার্ড দিন" : "Please enter email and password");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const data = {
        email: email.trim().toLowerCase(),
        password: password,
      };

      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      
      if (response.status === 201 || !result.success) {
        const errorMsg = result.message || (isBn ? "লগইন ব্যর্থ হয়েছে!" : "Login failed!");
        setError(errorMsg);
        toast.error(errorMsg);
      } else {
        // Check user role and redirect accordingly
        const userRole = result.user.role;
        
        if (userRole === "admin") {
          router.push("/dashboard");
          setTimeout(() => {
            toast.success(isBn ? "অ্যাডমিন লগইন সফল!" : "Admin Login Successful!");
          }, 600);
        } else if (userRole === 'user') {
          router.push("/my-account/dashboard");
          setTimeout(() => {
            toast.success(isBn ? "লগইন সফল!" : "Login Successful!");
          }, 600);
        } else {
          // Default redirect for other roles
          router.push("/dashboard");
          setTimeout(() => {
            toast.success(isBn ? "লগইন সফল!" : "Login Successful!");
          }, 600);
        }
      }

    } catch (err: any) {
      console.error("Login error:", err);
      toast.error(`Error: ${err.message}`);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // Bangla translations
  const bn = {
    email: "ইমেইল",
    password: "পাসওয়ার্ড",
    forgotPassword: "পাসওয়ার্ড ভুলে গেছেন?",
    login: "লগইন করুন",
    loggingIn: "লগইন হচ্ছে...",
    or: "অথবা",
    googleLogin: "Google দিয়ে লগইন",
    newUser: "নতুন ব্যবহারকারী?",
    register: "এখনই নিবন্ধন করুন",
    welcome: "স্বাগতম!",
    subtitle: "আপনার অ্যাকাউন্টে লগইন করুন",
    emailPlaceholder: "your@email.com",
    passwordPlaceholder: "••••••••",
    show: "দেখুন",
    hide: "লুকান"
  };

  // English translations
  const en = {
    email: "Email",
    password: "Password",
    forgotPassword: "Forgot Password?",
    login: "Login",
    loggingIn: "Logging in...",
    or: "Or",
    googleLogin: "Login with Google",
    newUser: "New user?",
    register: "Register now",
    welcome: "Welcome!",
    subtitle: "Login to your account",
    emailPlaceholder: "your@email.com",
    passwordPlaceholder: "••••••••",
    show: "Show",
    hide: "Hide"
  };

  const t = isBn ? bn : en;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-blue-50 overflow-hidden font-dm relative">

      {/* Language Toggle Button */}
      <button
        onClick={toggleLanguage}
        className="fixed top-6 right-6 z-20 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm shadow-md border border-white/50 text-sm font-medium text-gray-700 hover:bg-white transition-all duration-200"
      >
        {isBn ? "English" : "বাংলা"}
      </button>

      {/* Animated Background Blobs */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute rounded-full w-[500px] h-[500px] bg-[#f4a07a] -top-[150px] -left-[100px] opacity-35 blur-[80px] animate-float-1"></div>
        <div className="absolute rounded-full w-[400px] h-[400px] bg-[#a8c4e0] -bottom-[100px] -right-[80px] opacity-35 blur-[80px] animate-float-2"></div>
        <div className="absolute rounded-full w-[300px] h-[300px] bg-[#f7cbb0] top-1/2 left-[55%] -translate-x-1/2 -translate-y-1/2 opacity-35 blur-[80px] animate-float-3"></div>
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-[420px] px-11 pt-12 pb-10 bg-white/55 backdrop-blur-2xl border border-white/75 rounded-3xl shadow-lg animate-slide-up">

        {/* Logo */}
        <Link href={'/'} className="flex items-baseline justify-center mb-8">
          <span className="font-playfair text-[32px] font-bold text-[#ef553f] tracking-tight">AMAR</span>
          <span className="font-dm text-[22px] font-normal text-[#2c2c2c] tracking-wide">shop</span>
        </Link>

        {/* Heading */}
        <h1 className="font-playfair text-[22px] font-semibold text-[#1a1a1a] text-center mb-1.5">{t.welcome}</h1>
        <p className="text-center text-sm text-[#888] font-light mb-8">{t.subtitle}</p>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm text-center">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          {/* Email Field */}
          <div className="mb-[18px]">
            <label className="block text-[12.5px] font-medium text-[#555] tracking-[0.4px] uppercase mb-[7px]">
              {t.email}
            </label>
            <input
              type="email"
              placeholder={t.emailPlaceholder}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              className="w-full h-[46px] px-4 rounded-xl text-[15px] text-[#1a1a1a] font-dm bg-white/65 border border-black/13 outline-none transition-all duration-200 focus:border-[#ef553f] focus:bg-white/90 focus:ring-4 focus:ring-[#ef553f]/10 placeholder:text-[#bbb] disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          {/* Password Field */}
          <div className="mb-[18px]">
            <label className="block text-[12.5px] font-medium text-[#555] tracking-[0.4px] uppercase mb-[7px]">
              {t.password}
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder={t.passwordPlaceholder}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                className="w-full h-[46px] px-4 rounded-xl text-[15px] text-[#1a1a1a] font-dm bg-white/65 border border-black/13 outline-none transition-all duration-200 focus:border-[#ef553f] focus:bg-white/90 focus:ring-4 focus:ring-[#ef553f]/10 placeholder:text-[#bbb] pr-12 disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#aaa] hover:text-[#555] transition-colors text-xs font-medium"
              >
                {showPassword ? t.hide : t.show}
              </button>
            </div>
            <div className="text-right mt-1.5">
              <Link href="/forgot-password" className="text-[12.5px] text-[#ef553f] font-medium no-underline hover:underline">
                {t.forgotPassword}
              </Link>
            </div>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-[50px] mt-6 text-white rounded-2xl font-dm text-base font-medium tracking-wide cursor-pointer border-none bg-gradient-to-r from-[#ef553f] to-[#d43f2a] shadow-[0_4px_12px_rgba(239,85,63,0.25)] transition-all duration-150 hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(239,85,63,0.35)] active:translate-y-0 active:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
          >
            {loading ? t.loggingIn : t.login}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-[22px]">
          <div className="flex-1 h-px bg-black/10"></div>
          <span className="text-xs text-[#aaa] whitespace-nowrap">{t.or}</span>
          <div className="flex-1 h-px bg-black/10"></div>
        </div>

        {/* Google Button */}
        <button
          disabled={loading}
          // onClick={() => {
          //   // Handle Google login
          //   toast.info(isBn ? "Google লগইন শীঘ্রই আসছে" : "Google login coming soon");
          // }}
          onClick={() => signIn("google")}
          className="w-full h-[46px] rounded-xl font-dm text-[14.5px] font-medium text-[#333] cursor-pointer flex items-center justify-center gap-2.5 bg-white/70 border border-black/12 transition-all duration-150 hover:bg-white/90 hover:shadow-[0_4px_12px_rgba(0,0,0,0.1)] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg className="w-5 h-5 shrink-0" viewBox="0 0 48 48">
            <path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.6 32.9 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.6 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.6-.4-3.9z" />
            <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 16 19 13 24 13c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.6 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
            <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.3 26.7 36 24 36c-5.2 0-9.6-3.1-11.3-7.5L6.1 33.6C9.5 39.7 16.3 44 24 44z" />
            <path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.3-2.3 4.2-4.3 5.6l6.2 5.2C37 38.1 44 33 44 24c0-1.3-.1-2.6-.4-3.9z" />
          </svg>
          {t.googleLogin}
        </button>

        {/* Sign Up Link */}
        <p className="text-center mt-6 text-[13.5px] text-[#888]">
          {t.newUser}
          <Link href="/register" className="text-[#ef553f] font-medium no-underline hover:underline ml-1">
            {t.register}
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