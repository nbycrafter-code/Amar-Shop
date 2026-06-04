// app/verify-otp/page.tsx
"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import { signIn } from "next-auth/react";

export function VerifyOTPContent() {
  const [otpValues, setOtpValues] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(120); // 2 minutes (120 seconds)
  const [canResend, setCanResend] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [currentToken, setCurrentToken] = useState<string | null>(null);
  
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const phone = searchParams.get("phone");

  // Initialize token and phone from URL
  useEffect(() => {
    if (!token) {
      toast.error("Invalid verification link");
      setTimeout(() => router.push("/forgot-password"), 1500);
      return;
    }
    
    setCurrentToken(token);
    
    if (phone) {
      setPhoneNumber(phone);
    }
  }, [token, phone, router]);

  // Countdown timer effect
  useEffect(() => {
    if (timer <= 0) {
      setCanResend(true);
      return;
    }
    
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, [timer]);

  // Handle OTP input change
  const handleInputChange = (index: number, value: string) => {
    // Only allow digits
    const digit = value.replace(/\D/g, "");
    if (digit.length > 1) return;
    
    const newOtpValues = [...otpValues];
    newOtpValues[index] = digit;
    setOtpValues(newOtpValues);
    setError("");
    
    // Clear error border
    if (inputRefs.current[index]) {
      inputRefs.current[index]!.style.borderColor = "";
    }
    
    // Auto-focus next input
    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle keydown for backspace
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otpValues[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Handle paste event
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "");
    const digits = pastedData.slice(0, 6).split("");
    
    const newOtpValues = [...otpValues];
    digits.forEach((digit, idx) => {
      if (idx < 6) newOtpValues[idx] = digit;
    });
    setOtpValues(newOtpValues);
    
    // Focus on the next empty input or last input
    const lastFilledIndex = Math.min(digits.length, 5);
    if (lastFilledIndex < 6) {
      inputRefs.current[lastFilledIndex]?.focus();
    }
  };

  // Get full OTP string
  const getFullOtp = () => otpValues.join("");

  // Shake animation for error
  const shakeError = () => {
    const row = document.getElementById("otp-row");
    if (row) {
      row.style.animation = "none";
      row.offsetHeight; // Trigger reflow
      row.style.animation = "shake 0.4s ease-in-out";
      
      // Reset border colors
      inputRefs.current.forEach((input) => {
        if (input) input.style.borderColor = "#ef4444";
      });
      
      setTimeout(() => {
        inputRefs.current.forEach((input) => {
          if (input) input.style.borderColor = "";
        });
        if (row) row.style.animation = "";
      }, 1500);
    }
  };

  // Verify OTP handler
  const handleVerifyOTP = async (event: React.FormEvent) => {
    event.preventDefault();
    
    const otpCode = getFullOtp();
    
    if (otpCode.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      shakeError();
      return;
    }
    
    if (!currentToken) {
      toast.error("Invalid verification session");
      router.push("/forgot-password");
      return;
    }
    
    try {
      setLoading(true);
      setError("");
      
      const response = await fetch("/api/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: currentToken,
          otp: otpCode,
          phone: phoneNumber,
        }),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        setError(result.error);
        toast.error(result.error);
        
        if (result.error?.includes("expired") || result.error?.includes("Expired")) {
          setCanResend(true);
        }
        
        shakeError();
      } else {
        toast.success(result.message || "OTP verified successfully!");
        
        // Store email for sign in
        const userEmail = result.email || result.user?.email;
        
        // Sign in the user after successful verification
        if (userEmail) {
          const signInResult = await signIn("credentials", {
            email: userEmail,
            otpVerified: true,
            redirect: false,
            callbackUrl: "/dashboard",
          });
          
          if (signInResult?.error) {
            console.error("Sign in error:", signInResult.error);
            toast.error("Auto-login failed. Please login manually.");
            router.push("/login");
          } else {
            router.push("/dashboard");
          }
        } else {
          // If no email, redirect to reset password
          router.push("/reset-password");
        }
      }
    } catch (err) {
      console.error("OTP verification error:", err);
      const errorMessage = err instanceof Error ? err.message : "Network error occurred";
      setError(errorMessage);
      toast.error(errorMessage);
      shakeError();
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP handler
  const handleResendOTP = async () => {
    if (!canResend) {
      toast.error(`Please wait ${formatTime(timer)} before requesting another code`);
      return;
    }
    
    if (!currentToken && !token) {
      toast.error("Invalid session. Please request again.");
      router.push("/forgot-password");
      return;
    }
    
    try {
      setLoading(true);
      
      const response = await fetch("/api/resend-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: currentToken || token,
          phone: phoneNumber,
        }),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        toast.error(result.error || "Failed to resend OTP");
      } else {
        toast.success(result.message || "New OTP sent successfully!");
        
        // Update token if provided
        if (result.newToken) {
          setCurrentToken(result.newToken);
          // Update URL without reload
          window.history.replaceState(
            {},
            "",
            `/verify-otp?token=${encodeURIComponent(result.newToken)}${phone ? `&phone=${encodeURIComponent(phone)}` : ""}`,
          );
        }
        
        // Reset timer to 2 minutes (120 seconds)
        setTimer(120);
        setCanResend(false);
        setOtpValues(["", "", "", "", "", ""]);
        setError("");
        
        // Clear error borders
        inputRefs.current.forEach((input) => {
          if (input) input.style.borderColor = "";
        });
        
        // Focus first input
        setTimeout(() => inputRefs.current[0]?.focus(), 100);
      }
    } catch (err) {
      console.error("Resend OTP error:", err);
      toast.error(err instanceof Error ? err.message : "Network error occurred");
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-amber-50 to-red-50 font-dm overflow-hidden relative">
      {/* Background Blobs */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute w-[500px] h-[500px] bg-orange-200/30 -top-[150px] -left-[100px] rounded-full blur-[80px] animate-float-1"></div>
        <div className="absolute w-[400px] h-[400px] bg-blue-200/30 -bottom-[100px] -right-[80px] rounded-full blur-[80px] animate-float-2"></div>
        <div className="absolute w-[300px] h-[300px] bg-amber-200/30 top-1/2 left-[55%] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[80px] animate-float-3"></div>
      </div>

      <div className="relative z-10 w-[420px] px-11 pt-12 pb-10 bg-white/55 backdrop-blur-2xl border border-white/75 rounded-3xl shadow-[0_8px_48px_rgba(180,100,60,0.10),0_1.5px_8px_rgba(0,0,0,0.06)] animate-slide-up">
        {/* Logo */}
        <Link href={'/'} className="flex items-baseline justify-center mb-8">
          <span className="font-playfair text-[32px] font-bold text-brand tracking-tight">AMAR</span>
          <span className="font-dm text-[22px] font-normal text-[#2c2c2c] tracking-wide">shop</span>
        </Link>

        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-brand/10 flex items-center justify-center">
            <svg className="w-8 h-8 text-brand" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18h3" />
            </svg>
          </div>
        </div>

        <h1 className="font-playfair text-[22px] font-semibold text-[#1a1a1a] text-center mb-1.5">
          OTP যাচাই করুন
        </h1>
        <p className="text-center text-sm text-[#888] font-light mb-2 leading-relaxed">
          আপনার মোবাইলে পাঠানো ৬ সংখ্যার কোড দিন
        </p>
        <p className="text-center text-[13px] font-medium text-brand mb-8">
          {phoneNumber || "+880 1XXXXXXXX"}
        </p>

        <form onSubmit={handleVerifyOTP}>
          {/* OTP Inputs */}
          <div id="otp-row" className="flex justify-center gap-3 mb-4">
            {otpValues.map((value, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                ref={(el) => { inputRefs.current[index] = el; }}
                type="text"
                maxLength={1}
                inputMode="numeric"
                pattern="[0-9]"
                value={value}
                onChange={(e) => handleInputChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                className="otp-input"
                disabled={loading}
                autoFocus={index === 0}
              />
            ))}
          </div>

          {/* Error Message */}
          {error && (
            <p className="text-center text-[12.5px] text-red-500 mb-2">
              {error}
            </p>
          )}

          {/* Countdown */}
          <div className="text-center mb-2">
            <span className="text-[13px] text-[#aaa]">কোড মেয়াদ শেষ হবে: </span>
            <span className={`text-[13px] font-semibold ${timer === 0 ? "text-red-500" : "text-brand"}`}>
              {formatTime(timer)}
            </span>
          </div>

          <button
            type="submit"
            disabled={loading || timer === 0}
            className="btn-primary"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                যাচাই হচ্ছে...
              </span>
            ) : (
              "যাচাই করুন"
            )}
          </button>
        </form>

        {/* Resend */}
        <div className="text-center mt-5">
          <span className="text-[13px] text-[#aaa]">কোড পাননি? </span>
          <button
            onClick={handleResendOTP}
            disabled={!canResend || loading}
            className="text-[13px] text-brand font-medium hover:underline disabled:text-[#ccc] disabled:no-underline disabled:cursor-not-allowed"
          >
            {loading ? "পাঠানো হচ্ছে..." : "পুনরায় পাঠান"}
          </button>
        </div>

        <p className="text-center mt-4 text-[13.5px] text-[#888]">
          <Link href="/forgot-password" className="text-brand font-medium hover:underline">
            ← পিছনে যান
          </Link>
        </p>
        
        {/* Help Text */}
        <div className="mt-6 text-center text-[11px] text-[#aaa] space-y-1">
          <p>✓ আপনার ফোন চেক করুন (SMS ইনবক্স দেখুন)</p>
          <p>✓ কোডটি ২ মিনিটের মধ্যে মেয়াদ শেষ হবে</p>
          <p>✓ নতুন কোড পাঠালে পুরাতনটি বাতিল হয়ে যাবে</p>
        </div>
      </div>

      <style jsx global>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(32px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes float1 {
          0%, 100% {
            transform: translate(0, 0);
          }
          50% {
            transform: translate(30px, 20px);
          }
        }
        
        @keyframes float2 {
          0%, 100% {
            transform: translate(0, 0);
          }
          50% {
            transform: translate(-20px, 30px);
          }
        }
        
        @keyframes float3 {
          0%, 100% {
            transform: translate(-50%, -50%);
          }
          50% {
            transform: translate(-42%, -58%);
          }
        }
        
        @keyframes shake {
          0%, 100% {
            transform: translateX(0);
          }
          20%, 60% {
            transform: translateX(-6px);
          }
          40%, 80% {
            transform: translateX(6px);
          }
        }
        
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
        
        .animate-slide-up {
          animation: slideUp 0.65s cubic-bezier(0.22, 0.9, 0.36, 1) both;
        }
        
        .animate-float-1 {
          animation: float1 8s ease-in-out infinite;
        }
        
        .animate-float-2 {
          animation: float2 10s ease-in-out infinite;
        }
        
        .animate-float-3 {
          animation: float3 12s ease-in-out infinite;
        }
        
        .animate-shake {
          animation: shake 0.4s ease-in-out;
        }
        
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        
        .otp-input {
          width: 3rem;
          height: 3.5rem;
          text-align: center;
          font-size: 1.25rem;
          font-weight: 600;
          color: #1a1a1a;
          font-family: "DM Sans", sans-serif;
          border-radius: 0.75rem;
          background-color: rgba(255, 255, 255, 0.65);
          border: 1px solid rgba(0, 0, 0, 0.13);
          outline: none;
          transition: all 0.2s ease;
          caret-color: #E8522A;
        }
        
        .otp-input:focus {
          border-color: #E8522A;
          background-color: rgba(255, 255, 255, 0.9);
          box-shadow: 0 0 0 3px rgba(232, 82, 42, 0.15);
        }
        
        .btn-primary {
          width: 100%;
          height: 50px;
          color: white;
          border-radius: 1rem;
          font-family: "DM Sans", sans-serif;
          font-size: 1rem;
          font-weight: 500;
          letter-spacing: 0.025em;
          cursor: pointer;
          border: none;
          background: linear-gradient(135deg, #E8522A 0%, #c73d17 100%);
          box-shadow: 0 4px 20px rgba(232, 82, 42, 0.30);
          transition: all 0.15s ease;
        }
        
        .btn-primary:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 28px rgba(232, 82, 42, 0.38);
        }
        
        .btn-primary:active:not(:disabled) {
          transform: translateY(0);
          opacity: 0.9;
        }
        
        .btn-primary:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
        }
      `}</style>
    </div>
  );
}
