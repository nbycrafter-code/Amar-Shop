"use client";

import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { credentialLogin } from "@/app/actions";
// import { toast } from "sonner";

export function SimpleLoginForm() {
  // const [role, setRole] = useState("Admin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // const gradients = {
  //   Admin: "bg-gradient-to-br from-emerald-500 to-teal-600",
  //   Agent: "bg-gradient-to-br from-indigo-500 to-purple-600",
  //   User: "bg-gradient-to-br from-amber-500 to-orange-600",
  // };

  // const [error, setError] = useState("");
  // const router = useRouter();

  async function handleSubmit(event) {
  //   event.preventDefault();

  //   try {
  //     setLoading(true);
  //     const data = {
  //       email: email,
  //       password: password,
  //     };
  //     // const response = await credentialLogin(data);
  //     const response = await fetch("/api/login", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(data),
  //     });
  //     if (response?.error) {
  //       setError(response.error);
  //       toast.error(response.error);
  //     } else {
  //       toast.success("Login Successfully");
        
  //       router.push("/dashboard");
  //       // router.refresh(); // 🔥 THIS IS THE KEY
  //     }
  //   } catch (err) {
  //     toast.error(`Error: ${err.message}`);
  //     setError(err.message);
  //   } finally {
  //     setLoading(false);
  //   }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-100">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className={`bg-gradient-to-br from-emerald-500 to-teal-600 p-8 text-white text-center`}>
            <div className="w-20 h-20 mx-auto rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl mb-4">
              👨‍💼
            </div>
            <h1 className="text-3xl font-bold">NBYIT</h1>
            <p className="opacity-90 mt-2">E-Commerce Software</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-slate-400 focus:border-transparent outline-none transition"
                placeholder="admin@slotsbytes.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-slate-400 focus:border-transparent outline-none transition"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 rounded-xl font-semibold text-white bg-gradient-to-br from-emerald-500 to-teal-600 hover:shadow-lg transition-all duration-300 disabled:opacity-70`}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                  Signing in...
                </span>
              ) : (
                `Sign in as admin`
              )}
            </button>

            <div className="text-center">
              <button
                type="button"
                className="text-sm text-slate-500 hover:text-slate-700"
              >
                Need help? Contact support
              </button>
            </div>
          </form>
        </div>

        {/* Footer Note */}
        <p className="text-center text-xs text-slate-500 mt-8">
          Secure access to your dashboard. Unauthorized access is prohibited.
        </p>
      </div>
    </div>
  );
}
