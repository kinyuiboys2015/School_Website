"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  LoaderCircle,
  KeyRound,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
  AlertCircle,
  Lock,
  ArrowLeft,
  ShieldCheck,
} from "lucide-react";

const ResetPasswordContent = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [hasMinLength, setHasMinLength] = useState(false);
  const [hasNumber, setHasNumber] = useState(false);
  const [hasLetter, setHasLetter] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(false);

  useEffect(() => {
    if (!token) {
      setError("Invalid or missing reset token. Please request a new password reset link.");
    } else {
      console.log("Token from URL:", token);
    }
  }, [token]);

  useEffect(() => {
    setHasMinLength(newPassword.length >= 8);
    setHasNumber(/[0-9]/.test(newPassword));
    setHasLetter(/[a-zA-Z]/.test(newPassword));
    setPasswordsMatch(newPassword === confirmPassword && newPassword !== "");
  }, [newPassword, confirmPassword]);

  useEffect(() => {
    if (resetSuccess) {
      const timer = setTimeout(() => {
        router.push("/pages/Sign In");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [resetSuccess, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!token) {
      setError("Invalid reset token. Please request a new password reset link.");
      setLoading(false);
      return;
    }

    if (!hasMinLength || !hasNumber || !hasLetter || !passwordsMatch) {
      setError("Please meet all password requirements.");
      setLoading(false);
      return;
    }

    try {
      console.log("Submitting password reset request...");
      console.log("Token being sent:", token);

      const response = await fetch('/api/resetpassword', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: token, newPassword: newPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to reset password');
      }

      console.log("Password reset successful!");
      setResetSuccess(true);
    } catch (error) {
      console.error("Failed to reset password:", error);
      setError(error.message || "Failed to reset password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const ConditionItem = ({ condition, text }) => (
    <li className="flex items-center gap-2.5 py-1">
      {condition ? (
        <CheckCircle size={16} className="text-emerald-600 shrink-0" />
      ) : (
        <XCircle size={16} className="text-slate-300 shrink-0" />
      )}
      <span className={`text-sm ${condition ? 'text-emerald-700 font-medium' : 'text-slate-400'}`}>{text}</span>
    </li>
  );

  // No token state
  if (!token) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03]">
          <img src="/seo/kinyui.png" alt="" className="w-[500px] h-[500px] object-contain" />
        </div>
        <div className="absolute top-0 right-0 w-72 h-72 bg-slate-100 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-slate-50 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 w-full max-w-md mx-auto">
          <div className="bg-white border border-slate-200 rounded-2xl sm:rounded-3xl shadow-xl shadow-slate-200/50 overflow-hidden">
            <div className="bg-[#1a1a2e] px-6 sm:px-8 py-8 sm:py-10 text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-3xl rounded-full -mr-16 -mt-16" />
              <div className="relative z-10">
                <div className="flex items-center justify-center gap-3 mb-5">
                  <img src="/seo/kinyui.png" alt="Kinyui Boys Logo" className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl object-contain bg-white/10 p-1" />
                  <div className="text-left">
                    <p className="text-white/90 text-xs sm:text-sm font-bold uppercase tracking-widest leading-tight">Kinyui Boys</p>
                    <p className="text-white/50 text-[10px] sm:text-xs uppercase tracking-[0.2em] font-medium">Senior School</p>
                  </div>
                </div>
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-red-400/20">
                  <AlertCircle className="text-red-400 w-7 h-7 sm:w-8 sm:h-8" />
                </div>
                <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">Invalid Reset Link</h1>
                <p className="text-white/50 text-[10px] sm:text-xs uppercase tracking-[0.2em] font-medium mt-2">Link Expired or Invalid</p>
              </div>
            </div>
            <div className="px-6 sm:px-8 py-8 sm:py-10 text-center">
              <p className="text-slate-500 text-sm mb-6 leading-relaxed">
                This password reset link is invalid or has expired. Please request a new reset link to continue.
              </p>
              <button
                onClick={() => router.push("/pages/forgotpassword")}
                className="w-full flex items-center justify-center gap-2.5 h-12 sm:h-14 rounded-xl sm:rounded-2xl text-white font-bold text-sm sm:text-base bg-[#1a1a2e] hover:bg-[#2a2a3e] shadow-lg shadow-slate-300 active:scale-[0.98] transition-all"
              >
                Request New Reset Link
              </button>
              <button
                onClick={() => router.push("/pages/Sign In")}
                className="mt-3 w-full flex items-center justify-center gap-2 h-12 sm:h-14 rounded-xl sm:rounded-2xl font-bold text-sm sm:text-base text-slate-600 bg-white border-2 border-slate-200 hover:bg-slate-50 hover:border-slate-300 active:scale-[0.98] transition-all"
              >
                <ArrowLeft size={16} /> Back to Login
              </button>
            </div>
          </div>
          <p className="text-center text-slate-400 text-[10px] sm:text-xs mt-6 sm:mt-8 uppercase tracking-widest font-medium">
            Kinyui Boys Senior School &bull; Matungulu, Machakos County
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03]">
        <img src="/seo/kinyui.png" alt="" className="w-[500px] h-[500px] object-contain" />
      </div>
      <div className="absolute top-0 right-0 w-72 h-72 bg-slate-100 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-slate-50 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-md mx-auto">

        {/* Back link */}
        <button
          onClick={() => router.push("/pages/Sign In")}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-800 text-sm font-medium mb-8 transition-colors group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
          Back to login
        </button>

        {/* Card */}
        <div className="bg-white border border-slate-200 rounded-2xl sm:rounded-3xl shadow-xl shadow-slate-200/50 overflow-hidden">

          {/* Header */}
          <div className="bg-[#1a1a2e] px-6 sm:px-8 py-8 sm:py-10 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-3xl rounded-full -mr-16 -mt-16" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 blur-2xl rounded-full -ml-12 -mb-12" />

            <div className="relative z-10">
              <div className="flex items-center justify-center gap-3 mb-5">
                <img src="/seo/kinyui.png" alt="Kinyui Boys Logo" className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl object-contain bg-white/10 p-1" />
                <div className="text-left">
                  <p className="text-white/90 text-xs sm:text-sm font-bold uppercase tracking-widest leading-tight">Kinyui Boys</p>
                  <p className="text-white/50 text-[10px] sm:text-xs uppercase tracking-[0.2em] font-medium">Senior School</p>
                </div>
              </div>

              {resetSuccess ? (
                <>
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-emerald-400/20">
                    <ShieldCheck className="text-emerald-400 w-7 h-7 sm:w-8 sm:h-8" />
                  </div>
                  <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">Password Reset!</h1>
                  <p className="text-white/50 text-[10px] sm:text-xs uppercase tracking-[0.2em] font-medium mt-2">Success</p>
                </>
              ) : (
                <>
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/10">
                    <Lock className="text-amber-300 w-7 h-7 sm:w-8 sm:h-8" />
                  </div>
                  <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">Reset Password</h1>
                  <p className="text-white/50 text-[10px] sm:text-xs uppercase tracking-[0.2em] font-medium mt-2">Account Security</p>
                </>
              )}
            </div>
          </div>

          {/* Body */}
          <div className="px-6 sm:px-8 py-8 sm:py-10">

            {resetSuccess ? (
              /* Success state */
              <div className="text-center">
                <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-3">
                  <CheckCircle className="text-emerald-600 w-5 h-5 mt-0.5 shrink-0" />
                  <div className="text-left">
                    <p className="text-sm font-bold text-emerald-800">Password updated successfully!</p>
                    <p className="text-xs text-emerald-600 mt-0.5">You can now log in with your new password.</p>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-2 mb-6 text-slate-500">
                  <LoaderCircle className="animate-spin w-4 h-4" />
                  <span className="text-sm">Redirecting to login in 3 seconds...</span>
                </div>

                <button
                  onClick={() => router.push("/pages/Sign In")}
                  className="w-full flex items-center justify-center gap-2.5 h-12 sm:h-14 rounded-xl sm:rounded-2xl text-white font-bold text-sm sm:text-base bg-[#1a1a2e] hover:bg-[#2a2a3e] shadow-lg shadow-slate-300 active:scale-[0.98] transition-all"
                >
                  Go to Login Now
                </button>
              </div>
            ) : (
              /* Form state */
              <>
                {/* Error */}
                {error && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-3">
                    <AlertCircle className="text-red-600 w-5 h-5 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-bold text-red-800">Error</p>
                      <p className="text-xs text-red-600 mt-0.5">{error}</p>
                    </div>
                  </div>
                )}

                <p className="text-slate-500 text-sm mb-6 leading-relaxed">
                  Create a strong new password for your account. Make sure it meets all the requirements below.
                </p>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* New Password */}
                  <div>
                    <label className="text-[10px] sm:text-xs font-black uppercase tracking-[0.15em] text-slate-400 mb-2 block">
                      New Password
                    </label>
                    <div className="relative">
                      <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 sm:w-5 sm:h-5" />
                      <input
                        type={showPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Enter new password"
                        className="w-full h-12 sm:h-14 pl-11 sm:pl-12 pr-11 sm:pr-12 bg-slate-50 text-slate-900 placeholder-slate-400 rounded-xl sm:rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-300 transition-all text-sm sm:text-base font-medium"
                        required
                        disabled={loading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors"
                        disabled={loading}
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  {/* Password Requirements */}
                  <div className="p-4 bg-slate-50 rounded-xl sm:rounded-2xl border border-slate-100">
                    <h3 className="text-[10px] sm:text-xs font-black uppercase tracking-[0.15em] text-slate-400 mb-3">
                      Password Requirements
                    </h3>
                    <ul className="space-y-1">
                      <ConditionItem condition={hasMinLength} text="At least 8 characters" />
                      <ConditionItem condition={hasNumber} text="Contains a number" />
                      <ConditionItem condition={hasLetter} text="Contains a letter" />
                    </ul>
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="text-[10px] sm:text-xs font-black uppercase tracking-[0.15em] text-slate-400 mb-2 block">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 sm:w-5 sm:h-5" />
                      <input
                        type={showPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm new password"
                        className="w-full h-12 sm:h-14 pl-11 sm:pl-12 pr-4 bg-slate-50 text-slate-900 placeholder-slate-400 rounded-xl sm:rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-300 transition-all text-sm sm:text-base font-medium"
                        required
                        disabled={loading}
                      />
                    </div>
                    <div className="mt-2 ml-1">
                      <ConditionItem condition={passwordsMatch} text="Passwords match" />
                    </div>
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={loading || !hasMinLength || !hasNumber || !hasLetter || !passwordsMatch}
                    className={`w-full flex items-center justify-center gap-2.5 h-12 sm:h-14 rounded-xl sm:rounded-2xl text-white font-bold text-sm sm:text-base transition-all duration-300 shadow-lg ${
                      loading || !hasMinLength || !hasNumber || !hasLetter || !passwordsMatch
                        ? 'bg-slate-300 cursor-not-allowed shadow-slate-100'
                        : 'bg-[#1a1a2e] hover:bg-[#2a2a3e] shadow-slate-300 active:scale-[0.98]'
                    }`}
                  >
                    {loading ? (
                      <>
                        <LoaderCircle className="animate-spin w-5 h-5" />
                        <span>Resetting Password...</span>
                      </>
                    ) : (
                      <span>Reset Password</span>
                    )}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-slate-400 text-[10px] sm:text-xs mt-6 sm:mt-8 uppercase tracking-widest font-medium">
          Kinyui Boys Senior School &bull; Matungulu, Machakos County
        </p>
      </div>
    </div>
  );
};

// Main component with Suspense boundary
const ResetPasswordPage = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03]">
          <img src="/seo/kinyui.png" alt="" className="w-[500px] h-[500px] object-contain" />
        </div>
        <div className="relative z-10 w-full max-w-md mx-auto">
          <div className="bg-white border border-slate-200 rounded-2xl sm:rounded-3xl shadow-xl shadow-slate-200/50 overflow-hidden">
            <div className="bg-[#1a1a2e] px-6 sm:px-8 py-8 sm:py-10 text-center relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex items-center justify-center gap-3 mb-5">
                  <img src="/seo/kinyui.png" alt="Kinyui Boys Logo" className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl object-contain bg-white/10 p-1" />
                  <div className="text-left">
                    <p className="text-white/90 text-xs sm:text-sm font-bold uppercase tracking-widest leading-tight">Kinyui Boys</p>
                    <p className="text-white/50 text-[10px] sm:text-xs uppercase tracking-[0.2em] font-medium">Senior School</p>
                  </div>
                </div>
                <LoaderCircle className="animate-spin text-white w-8 h-8 mx-auto mb-3" />
                <h2 className="text-lg font-bold text-white">Loading...</h2>
                <p className="text-white/50 text-xs mt-1">Checking reset link</p>
              </div>
            </div>
          </div>
          <p className="text-center text-slate-400 text-[10px] sm:text-xs mt-6 uppercase tracking-widest font-medium">
            Kinyui Boys Senior School &bull; Matungulu, Machakos County
          </p>
        </div>
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  );
};

export default ResetPasswordPage;