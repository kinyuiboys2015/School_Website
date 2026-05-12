"use client";
import React, { useState } from 'react';
import { Mail, ShieldQuestion, LoaderCircle, Lock, ArrowLeft, CheckCircle } from 'lucide-react';
import { toast, Toaster } from 'sonner';
import Link from 'next/link';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [gmailEnabled, setGmailEnabled] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const loadingToast = toast.loading('Sending reset link...');

    try {
      const res = await fetch("/api/forgotpassword", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.dismiss(loadingToast);
        toast.success(data.message || 'Reset link sent! Check your email.');
        setEmail("");
        setGmailEnabled(true);
      } else {
        toast.dismiss(loadingToast);
        toast.error(data.message || 'Failed to send reset link.');
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error('Failed to send reset link. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleGmailClick = () => {
    if (!email) {
      toast.warning('Please enter your email first');
      return;
    }
    toast.info('Opening Gmail...');
    window.location.href = `https://mail.google.com/mail/u/0/#search/${encodeURIComponent(email)}`;
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      <Toaster position="top-right" richColors />

      {/* Watermark school logo */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03]">
        <img src="/seo/SchoolLogo.png" alt="" className="w-[500px] h-[500px] object-contain" />
      </div>

      {/* Subtle background accents */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-slate-100 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-slate-50 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-md mx-auto">

        {/* Back link */}
        <button
          onClick={() => window.history.back()}
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
              {/* School branding */}
              <div className="flex items-center justify-center gap-3 mb-5">
                <img src="/seo/SchoolLogo.png" alt="Kinyui Boys Logo" className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl object-contain bg-white/10 p-1" />
                <div className="text-left">
                  <p className="text-white/90 text-xs sm:text-sm font-bold uppercase tracking-widest leading-tight">Kinyui Boys</p>
                  <p className="text-white/50 text-[10px] sm:text-xs uppercase tracking-[0.2em] font-medium">Senior School</p>
                </div>
              </div>

              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/10">
                <Lock className="text-amber-300 w-7 h-7 sm:w-8 sm:h-8" />
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Password Recovery
              </h1>
              <p className="text-white/50 text-[10px] sm:text-xs uppercase tracking-[0.2em] font-medium mt-2">
                Account Security
              </p>
            </div>
          </div>

          {/* Form Body */}
          <div className="px-6 sm:px-8 py-8 sm:py-10">

            {/* Success state */}
            {gmailEnabled && (
              <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-3">
                <CheckCircle className="text-emerald-600 w-5 h-5 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-bold text-emerald-800">Reset link sent!</p>
                  <p className="text-xs text-emerald-600 mt-0.5">Check your email inbox for the password reset link.</p>
                </div>
              </div>
            )}

            <p className="text-slate-500 text-sm mb-6 leading-relaxed">
              Enter your registered email address and we&apos;ll send you a secure link to reset your password.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email field */}
              <div>
                <label className="text-[10px] sm:text-xs font-black uppercase tracking-[0.15em] text-slate-400 mb-2 block">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 sm:w-5 sm:h-5" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full h-12 sm:h-14 pl-11 sm:pl-12 pr-4 bg-slate-50 text-slate-900 placeholder-slate-400 rounded-xl sm:rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-300 transition-all text-sm sm:text-base font-medium"
                    required
                  />
                </div>
              </div>

         <div className="flex flex-row items-center gap-2 sm:gap-4 w-full mt-6">
  {/* 1. Submit button - Flex 1 to share space */}
  <button
    type="submit"
    disabled={loading}
    className={`flex-1 flex items-center justify-center gap-2 h-12 sm:h-14 rounded-xl sm:rounded-2xl text-white font-black text-[11px] sm:text-base uppercase tracking-wider transition-all duration-300 shadow-lg ${
      loading
        ? 'bg-slate-400 cursor-not-allowed shadow-slate-200'
        : 'bg-[#1a1a2e] hover:bg-[#2a2a3e] shadow-slate-200 active:scale-[0.95]'
    }`}
  >
    {loading ? (
      <>
        <LoaderCircle className="animate-spin w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
        <span className="truncate">Sending...</span>
      </>
    ) : (
      <span className="truncate">Reset Link</span>
    )}
  </button>

  {/* 2. Open Gmail button - Flex 1 to share space */}
  <button
    type="button"
    disabled={!gmailEnabled}
    onClick={handleGmailClick}
    className={`flex-1 flex items-center justify-center gap-2 h-12 sm:h-14 rounded-xl sm:rounded-2xl font-black text-[11px] sm:text-base uppercase tracking-wider transition-all duration-300 border-2 ${
      !gmailEnabled
        ? 'bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed'
        : 'bg-white text-slate-800 border-slate-200 hover:bg-slate-50 hover:border-slate-300 active:scale-[0.95]'
    }`}
  >
    <Mail size={16} className="shrink-0 sm:size-[18px]" />
    <span className="truncate">
      {gmailEnabled ? 'Gmail' : 'Link first'}
    </span>
  </button>
</div>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-4 my-6 sm:my-8">
              <div className="flex-1 h-px bg-slate-200" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">or</span>
              <div className="flex-1 h-px bg-slate-200" />
            </div>

            {/* Back to login */}
            <div className="text-center">
              <p className="text-slate-500 text-sm">
                Remembered your password?{' '}
                <span
                  onClick={() => window.history.back()}
                  className="text-slate-900 font-bold hover:underline cursor-pointer transition-colors"
                >
                  Log in
                </span>
              </p>
            </div>
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

export default ForgotPasswordPage;