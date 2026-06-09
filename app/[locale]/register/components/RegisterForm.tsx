"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";

export function RegisterForm() {
  const pathname = usePathname();
  const router = useRouter();
  const [isBn, setIsBn] = useState(true);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, text: "" });

  const toggleLanguage = () => {
    setIsBn(!isBn);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const checkPasswordStrength = (value: string) => {
    let score = 0;
    if (value.length >= 8) score++;
    if (/[A-Z]/.test(value)) score++;
    if (/[0-9]/.test(value)) score++;
    if (/[^A-Za-z0-9]/.test(value)) score++;

    const colors = ['#ef4444', '#f97316', '#eab308', '#22c55e'];
    const labels = isBn
      ? ['খুব দুর্বল', 'দুর্বল', 'ভালো', 'শক্তিশালী']
      : ['Very Weak', 'Weak', 'Good', 'Strong'];

    setPasswordStrength({
      score: score,
      text: value.length ? labels[score - 1] || labels[0] : (isBn ? 'পাসওয়ার্ড দিন' : 'Enter password')
    });

    return score;
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    checkPasswordStrength(value);
  };

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // Validation
    if (!firstName || !lastName || !phone || !email || !password || !confirmPassword) {
      toast.error(isBn ? "সব fields পূরণ করুন" : "Please fill in all fields");
      return;
    }

    if (password.length < 6) {
      toast.error(isBn ? "পাসওয়ার্ড কমপক্ষে 6 অক্ষরের হতে হবে" : "Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      toast.error(isBn ? "পাসওয়ার্ড মিলছে না" : "Passwords do not match");
      return;
    }

    if (!agreeTerms) {
      toast.error(isBn ? "শর্তাবলী মেনে নিতে হবে" : "Please accept the terms and conditions");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const fullName = `${firstName.trim()} ${lastName.trim()}`;
      const isBengali = pathname.split('/')[1];


      const data = {
        name: fullName,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phone: phone.trim(),
        email: email.trim().toLowerCase(),
        password: password,
        language: isBengali,
      };

      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok || result?.error) {
        const errorMsg = result?.error || "Registration failed";
        setError(errorMsg);
        toast.error(errorMsg);
      } else {
        toast.success(result?.message || (isBn ? "রেজিস্ট্রেশন সফল!" : "Registration Successful!"));
        // Redirect to login page after successful registration

        setTimeout(() => {
          router.push(`${result?.redirectUrl}`);
          router.refresh();
        }, 500);
      }
    } catch (err: any) {
      console.error("Registration error:", err);
      toast.error(`Error: ${err.message}`);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // Bangla translations
  const bn = {
    createAccount: "অ্যাকাউন্ট তৈরি করুন",
    subtitle: "আজই যোগ দিন এবং কেনাকাটা শুরু করুন",
    firstName: "প্রথম নাম",
    lastName: "শেষ নাম",
    firstNamePlaceholder: "রাহিম",
    lastNamePlaceholder: "মিয়া",
    phone: "মোবাইল নম্বর",
    phonePlaceholder: "01XXXXXXXXX",
    email: "ইমেইল",
    emailPlaceholder: "your@email.com",
    password: "পাসওয়ার্ড",
    confirmPassword: "পাসওয়ার্ড নিশ্চিত করুন",
    passwordPlaceholder: "••••••••",
    show: "দেখুন",
    hide: "লুকান",
    termsPrefix: "আমি",
    termsLink1: "শর্তাবলী",
    termsLink2: "গোপনীয়তা নীতি",
    termsSuffix: "মেনে নিচ্ছি",
    register: "অ্যাকাউন্ট তৈরি করুন",
    registering: "তৈরি হচ্ছে...",
    or: "অথবা",
    googleRegister: "Google দিয়ে নিবন্ধন",
    haveAccount: "ইতোমধ্যে অ্যাকাউন্ট আছে?",
    login: "লগইন করুন",
    passwordWeak: "খুব দুর্বল",
    passwordMedium: "দুর্বল",
    passwordGood: "ভালো",
    passwordStrong: "শক্তিশালী",
    enterPassword: "পাসওয়ার্ড দিন"
  };

  // English translations
  const en = {
    createAccount: "Create Account",
    subtitle: "Join today and start shopping",
    firstName: "First Name",
    lastName: "Last Name",
    firstNamePlaceholder: "Rahim",
    lastNamePlaceholder: "Mia",
    phone: "Phone Number",
    phonePlaceholder: "01XXXXXXXXX",
    email: "Email",
    emailPlaceholder: "your@email.com",
    password: "Password",
    confirmPassword: "Confirm Password",
    passwordPlaceholder: "••••••••",
    show: "Show",
    hide: "Hide",
    termsPrefix: "I agree to the",
    termsLink1: "Terms",
    termsLink2: "Privacy Policy",
    termsSuffix: "",
    register: "Create Account",
    registering: "Creating...",
    or: "Or",
    googleRegister: "Register with Google",
    haveAccount: "Already have an account?",
    login: "Login",
    passwordWeak: "Very Weak",
    passwordMedium: "Weak",
    passwordGood: "Good",
    passwordStrong: "Strong",
    enterPassword: "Enter password"
  };

  const t = isBn ? bn : en;

  // Get strength bar color
  const getStrengthColor = (index: number) => {
    const colors = ['#ef4444', '#f97316', '#eab308', '#22c55e'];
    if (index < passwordStrength.score) {
      return colors[passwordStrength.score - 1];
    }
    return '#e5e7eb';
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-blue-50 overflow-hidden font-dm py-8 relative">

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

      {/* Register Card */}
      <div className="relative z-10 w-[440px] px-11 pt-12 pb-10 bg-white/55 backdrop-blur-2xl border border-white/75 rounded-3xl shadow-lg animate-slide-up">

        {/* Logo */}
        <Link href={'/'} className="flex items-baseline justify-center mb-8">
          <span className="font-playfair text-[32px] font-bold text-[#ef553f] tracking-tight">AMAR</span>
          <span className="font-dm text-[22px] font-normal text-[#2c2c2c] tracking-wide">shop</span>
        </Link>

        <h1 className="font-playfair text-[22px] font-semibold text-[#1a1a1a] text-center mb-1.5">{t.createAccount}</h1>
        <p className="text-center text-sm text-[#888] font-light mb-8">{t.subtitle}</p>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Name Row */}
          <div className="flex gap-3 mb-[18px]">
            <div className="flex-1">
              <label className="block text-[12.5px] font-medium text-[#555] tracking-[0.4px] uppercase mb-[7px]">
                {t.firstName}
              </label>
              <input
                type="text"
                placeholder={t.firstNamePlaceholder}
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                disabled={loading}
                className="w-full h-[46px] px-4 rounded-xl text-[15px] text-[#1a1a1a] font-dm bg-white/65 border border-black/13 outline-none transition-all duration-200 focus:border-[#ef553f] focus:bg-white/90 focus:ring-4 focus:ring-[#ef553f]/10 placeholder:text-[#bbb] disabled:opacity-50 disabled:cursor-not-allowed"
                required
              />
            </div>
            <div className="flex-1">
              <label className="block text-[12.5px] font-medium text-[#555] tracking-[0.4px] uppercase mb-[7px]">
                {t.lastName}
              </label>
              <input
                type="text"
                placeholder={t.lastNamePlaceholder}
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                disabled={loading}
                className="w-full h-[46px] px-4 rounded-xl text-[15px] text-[#1a1a1a] font-dm bg-white/65 border border-black/13 outline-none transition-all duration-200 focus:border-[#ef553f] focus:bg-white/90 focus:ring-4 focus:ring-[#ef553f]/10 placeholder:text-[#bbb] disabled:opacity-50 disabled:cursor-not-allowed"
                required
              />
            </div>
          </div>

          {/* Phone */}
          <div className="mb-[18px]">
            <label className="block text-[12.5px] font-medium text-[#555] tracking-[0.4px] uppercase mb-[7px]">
              {t.phone}
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[15px] text-[#555] font-medium select-none">+880</span>
              <input
                type="tel"
                placeholder={t.phonePlaceholder}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={loading}
                className="w-full h-[46px] px-4 rounded-xl text-[15px] text-[#1a1a1a] font-dm bg-white/65 border border-black/13 outline-none transition-all duration-200 focus:border-[#ef553f] focus:bg-white/90 focus:ring-4 focus:ring-[#ef553f]/10 placeholder:text-[#bbb] pl-[60px] disabled:opacity-50 disabled:cursor-not-allowed"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div className="mb-[18px]">
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

          {/* Password */}
          <div className="mb-[18px]">
            <label className="block text-[12.5px] font-medium text-[#555] tracking-[0.4px] uppercase mb-[7px]">
              {t.password}
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder={t.passwordPlaceholder}
                value={password}
                onChange={handlePasswordChange}
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

            {/* Strength Bars */}
            <div className="flex gap-1 mt-2">
              {[0, 1, 2, 3].map((index) => (
                <div
                  key={index}
                  className="h-1 flex-1 rounded-full transition-all duration-300"
                  style={{ backgroundColor: getStrengthColor(index) }}
                />
              ))}
            </div>
            <p className="text-[11px] mt-1" style={{ color: passwordStrength.score > 0 ? getStrengthColor(passwordStrength.score - 1) : '#aaa' }}>
              {passwordStrength.text}
            </p>
          </div>

          {/* Confirm Password */}
          <div className="mb-[18px]">
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
          </div>

          {/* Terms */}
          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              disabled={loading}
              className="mt-0.5 w-4 h-4 accent-[#ef553f] cursor-pointer shrink-0 disabled:opacity-50"
            />
            <span className="text-[13px] text-[#666] leading-relaxed">
              {t.termsPrefix} <a href="#" className="text-[#ef553f] font-medium hover:underline">{t.termsLink1}</a> and{' '}
              <a href="#" className="text-[#ef553f] font-medium hover:underline">{t.termsLink2}</a> {t.termsSuffix}
            </span>
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-[50px] mt-6 text-white rounded-2xl font-dm text-base font-medium tracking-wide cursor-pointer border-none bg-gradient-to-r from-[#ef553f] to-[#d43f2a] shadow-[0_4px_12px_rgba(239,85,63,0.25)] transition-all duration-150 hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(239,85,63,0.35)] active:translate-y-0 active:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
          >
            {loading ? t.registering : t.register}
          </button>
        </form>

        <div className="flex items-center gap-3 my-[22px]">
          <div className="flex-1 h-px bg-black/10"></div>
          <span className="text-xs text-[#aaa] whitespace-nowrap">{t.or}</span>
          <div className="flex-1 h-px bg-black/10"></div>
        </div>

        <button
          disabled={loading}
          className="w-full h-[46px] rounded-xl font-dm text-[14.5px] font-medium text-[#333] cursor-pointer flex items-center justify-center gap-2.5 bg-white/70 border border-black/12 transition-all duration-150 hover:bg-white/90 hover:shadow-[0_4px_12px_rgba(0,0,0,0.1)] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg className="w-5 h-5 shrink-0" viewBox="0 0 48 48">
            <path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.6 32.9 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.6 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.6-.4-3.9z" />
            <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 16 19 13 24 13c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.6 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
            <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.3 26.7 36 24 36c-5.2 0-9.6-3.1-11.3-7.5L6.1 33.6C9.5 39.7 16.3 44 24 44z" />
            <path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.3-2.3 4.2-4.3 5.6l6.2 5.2C37 38.1 44 33 44 24c0-1.3-.1-2.6-.4-3.9z" />
          </svg>
          {t.googleRegister}
        </button>

        <p className="text-center mt-6 text-[13.5px] text-[#888]">
          {t.haveAccount}
          <Link href={'/login'} className="text-[#ef553f] font-medium no-underline hover:underline ml-1">
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