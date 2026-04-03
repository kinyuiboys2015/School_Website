'use client';

import { useState, useEffect, useCallback } from 'react';
import { Toaster, toast } from 'sonner';
import StudentLoginModal from '../../components/studentloginmodel/page';
import NavigationSidebar from '../../components/studentportalcomponents/aside/page.jsx';
import ResultsView from '../../components/studentportalcomponents/result/page.jsx';
import ResourcesAssignmentsView from '../../components/studentportalcomponents/ass/page.jsx';
import GuidanceEventsView from '../../components/studentportalcomponents/session/page';
import LoadingScreen from '../../components/studentportalcomponents/loading/page';
import FeesView from '../../components/studentportalcomponents/feebalance/page'; // ADDED IMPORT

import { 
  FaBell, FaBars, FaCalendar, FaBook, FaAward, FaDollarSign, 
  FaClock, FaChartLine, FaChartBar, FaFolder, FaComments,
  FaRocket, FaPalette, FaGem, FaChartPie, FaTrendingUp, FaCrown,
  FaLightbulb, FaBrain, FaHandshake, FaHeart, FaLock, FaGlobe, 
  FaArrowRight, FaFire, FaBolt, FaCalendarCheck, FaUserPlus, 
  FaUserCheck, FaRoute, FaDirections, FaQrcode, FaFingerprint, 
  FaIdCard, FaDesktop, FaWandMagic, FaUser, FaShieldHalved, FaSchool
} from 'react-icons/fa6';

import { useRouter } from 'next/navigation';
import Image from 'next/image';

import { 
  FaHome, FaSearch, FaTimes, FaSync, FaExclamationCircle, 
  FaUserFriends, FaQuestionCircle
} from 'react-icons/fa';
import { HiSparkles } from "react-icons/hi2";
import { FaCircleCheck } from "react-icons/fa6";

import { 
  FiMenu, FiX, FiRefreshCw, FiBookOpen, FiExternalLink, 
  FiShield, FiExpand, FiCompress, FiMapPin, FiSmartphone, FiTablet
} from 'react-icons/fi';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

// ==================== GLOBAL STYLES ====================
const portalStyles = `
  @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
  @keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
  @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
  @keyframes scaleIn { from{opacity:0;transform:scale(0.95)} to{opacity:1;transform:scale(1)} }
  .anim-float { animation: float 4s ease-in-out infinite; }
  .anim-shimmer { background-size: 200% 100%; animation: shimmer 3s ease-in-out infinite; }
  .anim-fade-up { animation: fadeUp 0.5s ease-out both; }
  .anim-scale-in { animation: scaleIn 0.4s ease-out both; }
  .glass { background: rgba(255,255,255,0.7); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); }
  .glass-dark { background: rgba(80,10,30,0.8); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); }
  .hide-scrollbar { -ms-overflow-style:none; scrollbar-width:none; }
  .hide-scrollbar::-webkit-scrollbar { display:none; }
  .touch-target { min-height:44px; min-width:44px; }
  .text-truncate { overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
`;

// ==================== VIEW LABELS ====================
const VIEW_LABELS = {
  home: 'Dashboard',
  results: 'Results',
  resources: 'Resources',
  guidance: 'Guidance',
  fees: 'Fee Balance',
};

const VIEW_ICONS = {
  home: FaHome,
  results: FaChartBar,
  resources: FaFolder,
  guidance: FaComments,
  fees: FaDollarSign,
};

// ==================== STUDENT HEADER ====================
function StudentHeader({ student, onMenuToggle, isMenuOpen, currentView }) {
  const getInitials = (name) => {
    if (!name) return 'KB';
    return name.split(' ').map(p => p[0]?.toUpperCase()).slice(0, 2).join('');
  };

  const ViewIcon = VIEW_ICONS[currentView] || FaHome;

  return (
    <>
      <style>{portalStyles}</style>
      <header className="sticky top-0 z-30 glass-dark border-b border-white/10">
        <div className="max-w-7xl mx-auto px-3 sm:px-5 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Left: Menu + Avatar */}
            <div className="flex items-center gap-2.5 sm:gap-4">
              <button
                onClick={onMenuToggle}
                className="lg:hidden p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors touch-target"
                aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
              >
                {isMenuOpen ?
                  <FiX className="w-5 h-5 text-black" /> :
                  <FiMenu className="w-5 h-5 text-black" />
                }
              </button>

              {student && (
                <div className="flex items-center gap-2.5">
                  <div className="relative">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-amber-400 to-maroon-600 flex items-center justify-center text-white text-xs sm:text-sm font-bold ring-2 ring-amber-400/40">
                      {getInitials(student.fullName)}
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-maroon-900" />
                  </div>
                  <div className="hidden sm:block">
                    <p className="text-sm font-semibold text-white text-truncate max-w-[180px]">
                      {student.fullName}
                    </p>
                    <p className="text-[11px] text-black/80">
                      {student.form} &middot; {student.stream}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Center: Current View (mobile & tablet) */}
            <div className="lg:hidden flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-white/10">
                <ViewIcon className="w-4 h-4 text-black" />
              </div>
              <span className="text-sm font-semibold text-white text-truncate max-w-[120px] sm:max-w-none">
                {VIEW_LABELS[currentView] || 'Dashboard'}
              </span>
            </div>

            {/* Right: School Badge */}
            <div className="hidden lg:flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/10">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[11px] font-bold text-amber-200 uppercase tracking-wide">Kinyui Boys&apos;</span>
                <FiShield className="w-3.5 h-3.5 text-black" />
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}

// ==================== HOME DASHBOARD VIEW ====================
function HomeDashboardView({ student, token }) {
  const firstName = student?.fullName?.split(' ')[0] || 'Student';
  const currentDate = new Date();
  const greeting = currentDate.getHours() < 12 ? 'Good morning' : currentDate.getHours() < 17 ? 'Good afternoon' : 'Good evening';

  const infoCards = [
    { label: 'Form', value: student?.form || '—', icon: FaUser, color: 'from-maroon-500 to-maroon-700' },
    { label: 'Stream', value: student?.stream || '—', icon: FaBook, color: 'from-amber-500 to-amber-700' },
    { label: 'Admission No.', value: student?.admissionNumber || '—', icon: FaIdCard, color: 'from-maroon-600 to-amber-600' },
    { label: 'Academic Year', value: currentDate.getFullYear().toString(), icon: FaCalendar, color: 'from-amber-600 to-maroon-500' },
  ];

  const modules = [
    {
      key: 'learning',
      title: 'Learning Hub',
      subtitle: 'Assignments & study materials',
      description: 'Access assignments, revision materials, notes, and essential learning resources from your teachers.',
      icon: FiBookOpen,
      accent: 'amber',
    },
    {
      key: 'results',
      title: 'Results Center',
      subtitle: 'Class & personal performance',
      description: 'Review class-wide and personal examination results. Track progress and identify areas for improvement.',
      icon: FaChartLine,
      accent: 'maroon',
    },
    {
      key: 'support',
      title: 'Student Support',
      subtitle: 'Guidance & school updates',
      description: 'Access guidance & counselling services, school announcements, events, and important news updates.',
      icon: FaUserFriends,
      accent: 'amber',
    },
  ];

  const accentClasses = {
    amber: {
      badge: 'bg-amber-100 text-amber-800',
      iconBg: 'bg-gradient-to-br from-amber-500 to-amber-700',
      ring: 'group-hover:ring-amber-300',
      arrow: 'text-amber-700',
    },
    maroon: {
      badge: 'bg-maroon-100 text-maroon-800',
      iconBg: 'bg-gradient-to-br from-maroon-600 to-maroon-800',
      ring: 'group-hover:ring-maroon-300',
      arrow: 'text-maroon-700',
    },
  };

  return (
    <div className="space-y-5 sm:space-y-7 hide-scrollbar">
      {/* Greeting Banner */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl anim-fade-up">
        <div className="absolute inset-0 bg-gradient-to-br from-maroon-800 via-maroon-700 to-amber-700" />
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 80% 20%, rgba(255,193,7,0.3) 0%, transparent 50%), radial-gradient(circle at 20% 80%, rgba(128,0,32,0.3) 0%, transparent 50%)' }} />
        <div className="relative px-5 py-6 sm:px-8 sm:py-8 md:py-10">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center anim-float">
              <HiSparkles className="w-6 h-6 sm:w-7 sm:h-7 text-black" />
            </div>
            <div className="flex-1">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                {greeting}, {firstName}
              </h1>
              <p className="text-black text-sm sm:text-base mt-1 max-w-xl">
                Your academic dashboard is ready. Access resources, check results, and stay updated with school activities.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-5">
            <span className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-white">
              <FaCircleCheck className="w-3 h-3 text-emerald-400" />
              Active Session
            </span>
            <span className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-white">
              <FaSchool className="w-3 h-3 text-black" />
              Kinyui Boys&apos; Senior School
            </span>
          </div>
        </div>
      </div>

      {/* Info Cards - Bento Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {infoCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div
              key={i}
              className="group glass rounded-xl sm:rounded-2xl p-3.5 sm:p-4 border border-white/60 hover:border-amber-300/60 shadow-sm hover:shadow-lg transition-all duration-300 anim-scale-in"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center mb-3 shadow-sm group-hover:scale-105 transition-transform`}>
                <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <p className="text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider">{card.label}</p>
              <p className="text-lg sm:text-xl font-extrabold text-gray-900 mt-0.5 text-truncate">{card.value}</p>
            </div>
          );
        })}
      </div>

      {/* Fee Balance Section */}
      <FeesView student={student} token={token} />

      {/* Module Cards */}
      <section>
        <div className="mb-4 sm:mb-5">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">Quick Access</h2>
          <p className="text-sm text-gray-500 mt-0.5">Explore your portal modules</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
          {modules.map((mod, i) => {
            const Icon = mod.icon;
            const ac = accentClasses[mod.accent];
            return (
              <div
                key={i}
                className="group glass rounded-2xl border border-white/60 hover:border-amber-200 p-4 sm:p-5 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col anim-fade-up"
                style={{ animationDelay: `${(i + 4) * 80}ms` }}
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className={`p-2.5 rounded-xl ${ac.iconBg} text-white shadow-md ring-2 ring-transparent ${ac.ring} transition-all`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm sm:text-base font-bold text-gray-900 text-truncate">{mod.title}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">{mod.subtitle}</p>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed flex-1 mb-4 line-clamp-3">
                  {mod.description}
                </p>
                <button
                  onClick={() => toast.info(`Opening ${mod.title}`)}
                  className={`mt-auto inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold ${ac.arrow} hover:underline touch-target`}
                >
                  Open Module
                  <FaArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

// ==================== LANDING PAGE (UNAUTHENTICATED) ====================
function LandingPage({ onOpenLogin, router }) {
  const features = [
    { icon: FaBook, title: 'Digital Learning Resources', desc: 'Access digital notes, revision e-books, past papers, and supplementary materials for all subjects.' },
    { icon: FaAward, title: 'Assignments & Projects', desc: 'View subject-specific tasks, holiday assignments, and projects. Track deadlines and get teacher feedback.' },
    { icon: FaChartBar, title: 'Performance Analytics', desc: 'Personalized reports comparing your results with class averages and KCSE targets.' },
    { icon: FaDollarSign, title: 'Fee Management', desc: 'Check balances, download statements, view payment history, and access fee structures.' },
    { icon: FaCalendar, title: 'School Calendar', desc: 'Academic dates, exam schedules, sports fixtures, and parent-teacher meeting times.' },
    { icon: FaComments, title: 'Communication Hub', desc: 'Announcements, school news, event notifications, and deadline reminders.' },
  ];

  const stats = [
    { num: '1976', label: 'Established' },
    { num: '6', label: 'Portal Modules' },
    { num: '24/7', label: 'Access' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      <style>{portalStyles}</style>
      <Toaster position="top-right" expand richColors theme="light" />

      {/* Subtle background pattern */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.025]"
        style={{ backgroundImage: 'radial-gradient(#800020 0.8px, transparent 0.8px)', backgroundSize: '32px 32px' }} />

      {/* Nav */}
      <nav className="sticky top-0 z-50 glass-dark border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 flex items-center justify-between h-14 sm:h-16">
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <div className="absolute inset-0 bg-amber-400/20 rounded-lg blur-sm" />
              <Image src="/kinyui.png" alt="Kinyui Boys Logo" width={36} height={36}
                className="relative rounded-lg w-8 h-8 sm:w-9 sm:h-9" priority />
            </div>
            <div>
              <span className="text-sm sm:text-base font-extrabold text-white tracking-tight block leading-none">
                KINYUI BOYS&apos;
              </span>
              <span className="text-[8px] sm:text-[9px] font-semibold text-black/70 uppercase tracking-[0.15em]">
                Student Portal
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3 sm:gap-5">
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/10">
              <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
              <span className="text-[10px] font-bold text-amber-200 uppercase tracking-wide">Secure</span>
              <FiShield className="w-3 h-3 text-black" />
            </div>
            <button onClick={onOpenLogin}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-maroon-900 text-xs sm:text-sm font-bold rounded-lg transition-colors touch-target">
              Sign In
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pt-10 sm:pt-16 md:pt-20 pb-12 sm:pb-20">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className="anim-fade-up">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-maroon-100 border border-maroon-200 text-[10px] sm:text-xs font-bold text-maroon-700 uppercase tracking-wider mb-5">
              <HiSparkles className="w-3 h-3 text-black" />
              Excellence in Education Since 1976
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 tracking-tight leading-[1.05]">
              Your Academic
              <span className="block bg-gradient-to-r from-maroon-700 to-amber-600 bg-clip-text text-transparent">
                Journey Starts Here
              </span>
            </h1>
            <p className="mt-4 sm:mt-5 text-base sm:text-lg text-gray-600 max-w-lg leading-relaxed">
              The centralized digital platform for Kinyui Boys&apos; students. Access resources, track performance, manage fees, and stay connected.
            </p>
            <div className="flex flex-wrap gap-3 mt-6 sm:mt-8">
              <button onClick={onOpenLogin}
                className="flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-3.5 bg-maroon-800 hover:bg-maroon-700 text-white rounded-xl font-bold text-sm sm:text-base shadow-lg shadow-maroon-900/20 transition-all active:scale-[0.97] group">
                Access Portal
                <FaArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button onClick={() => router.push('/pages/contact')}
                className="flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-3.5 bg-white hover:bg-gray-50 text-gray-800 rounded-xl font-bold text-sm sm:text-base border border-gray-200 shadow-sm transition-all active:scale-[0.97]">
                Get Help
              </button>
            </div>
            <div className="flex gap-6 sm:gap-10 mt-8 sm:mt-10 pt-6 border-t border-gray-200">
              {stats.map((s, i) => (
                <div key={i}>
                  <p className="text-xl sm:text-2xl font-extrabold text-gray-900">{s.num}</p>
                  <p className="text-xs text-gray-500 font-medium">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Interactive Feature Preview */}
          <div className="relative anim-fade-up" style={{ animationDelay: '150ms' }}>
            <div className="absolute -inset-4 bg-gradient-to-br from-maroon-200/30 to-amber-200/30 rounded-[2.5rem] blur-2xl opacity-50" />
            <div className="relative glass rounded-3xl border border-white/70 p-5 sm:p-7 shadow-xl">
              <div className="flex items-center justify-between pb-4 border-b border-gray-200/60">
                <h3 className="text-xs sm:text-sm font-bold text-gray-900 uppercase tracking-wider">Portal Preview</h3>
                <FaBrain className="w-4 h-4 text-black" />
              </div>
              <div className="space-y-3 mt-4">
                {[
                  { label: 'Digital Library', desc: 'E-books, revision materials, past papers', gradient: 'from-maroon-50 to-amber-50' },
                  { label: 'Performance Dashboard', desc: 'Track progress and KCSE preparedness', gradient: 'from-amber-50 to-maroon-50' },
                  { label: 'Financial Overview', desc: 'Balances, statements, payment records', gradient: 'from-maroon-50 to-amber-50' },
                ].map((item, i) => (
                  <div key={i} className={`p-3.5 rounded-xl bg-gradient-to-r ${item.gradient} border border-gray-100 anim-scale-in`}
                    style={{ animationDelay: `${(i + 3) * 100}ms` }}>
                    <p className="text-[11px] font-bold text-gray-800 mb-0.5">{item.label}</p>
                    <p className="text-xs text-gray-600">{item.desc}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-3 border-t border-gray-100 text-center">
                <button onClick={onOpenLogin} className="text-xs font-bold text-maroon-700 hover:text-amber-700 uppercase tracking-wider transition-colors">
                  Sign In to Explore &rarr;
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="bg-white border-y border-gray-100 py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10 sm:mb-14">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
              Everything You Need
            </h2>
            <p className="mt-2 text-sm sm:text-base text-gray-500 max-w-xl mx-auto">
              Six powerful modules designed to support your academic journey at Kinyui Boys&apos;.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <div key={i} className="group p-5 sm:p-6 rounded-2xl border border-gray-100 bg-gray-50/50 hover:bg-white hover:shadow-xl hover:shadow-gray-200/40 hover:-translate-y-0.5 transition-all duration-300 anim-fade-up"
                  style={{ animationDelay: `${i * 60}ms` }}>
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-maroon-100 to-amber-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="w-5 h-5 text-maroon-700" />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1.5">{f.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed line-clamp-3">{f.desc}</p>
                  <button onClick={onOpenLogin}
                    className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-maroon-700 uppercase tracking-wider group-hover:text-amber-700 transition-colors">
                    Login to Access <FaArrowRight className="w-3 h-3" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-maroon-900 text-white py-8 sm:py-10 px-4 sm:px-6 lg:px-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
              <FaSchool className="w-4 h-4 text-black" />
              <span className="text-sm font-bold">Kinyui Boys&apos; Senior School</span>
            </div>
            <p className="text-[10px] text-black/60 uppercase tracking-widest font-semibold">
              &copy; {new Date().getFullYear()} All Rights Reserved
            </p>
          </div>
          <div className="flex gap-6 sm:gap-8 text-xs font-semibold">
            {['Academics', 'Finance', 'Support'].map((item) => (
              <span key={item} className="text-black/70 hover:text-white cursor-pointer transition-colors">{item}</span>
            ))}
          </div>
        </div>
      </footer>

      <StudentLoginModal isOpen={false} onClose={() => {}} onLogin={() => {}} isLoading={false} error={null} requiresContact={false} />
    </div>
  );
}

// ==================== MAIN COMPONENT ====================
export default function ModernStudentPortalPage() {
  const [student, setStudent] = useState(null);
  const [token, setToken] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(true);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState(null);
  const [requiresContact, setRequiresContact] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [currentView, setCurrentView] = useState('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const router = useRouter();

  const [assignments, setAssignments] = useState([]);
  const [resources, setResources] = useState([]);
  const [studentResults, setStudentResults] = useState([]);
  const [feeBalance, setFeeBalance] = useState(null);

  const [assignmentsLoading, setAssignmentsLoading] = useState(false);
  const [resourcesLoading, setResourcesLoading] = useState(false);
  const [resultsLoading, setResultsLoading] = useState(false);
  const [feeLoading, setFeeLoading] = useState(false);

  const [assignmentsError, setAssignmentsError] = useState(null);
  const [resourcesError, setResourcesError] = useState(null);
  const [resultsError, setResultsError] = useState(null);
  const [feeError, setFeeError] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const savedToken = localStorage.getItem('student_token');
        if (!savedToken) {
          setShowLoginModal(true);
          setIsLoading(false);
          return;
        }

        const response = await fetch('/api/studentlogin', {
          headers: { 'Authorization': `Bearer ${savedToken}` }
        });

        const data = await response.json();

        if (data.success && data.authenticated) {
          setStudent(data.student);
          setToken(savedToken);
          setShowLoginModal(false);

          const logoutTimer = setTimeout(() => {
            toast.success('Your 2-hour session has expired. Please log in again.');
            handleLogout();
          }, 2 * 60 * 60 * 1000);

          return () => clearTimeout(logoutTimer);
        } else {
          handleLogout();
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        handleLogout();
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  useEffect(() => {
    if (student && token) {
      fetchAllData();
    }
  }, [student, token]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMenuOpen(false);
      }
    };

    if (window.innerWidth < 1024) {
      setIsMenuOpen(false);
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [currentView]);

  const fetchAllData = useCallback(async () => {
    if (!token) return;

    try {
      await Promise.all([
        fetchAssignments(),
        fetchResources(),
        fetchStudentResults(),
        fetchFeeBalance()
      ]);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load some data. Please refresh the page.');
    }
  }, [token]);

  const fetchAssignments = async () => {
    setAssignmentsLoading(true);
    setAssignmentsError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/api/assignment?limit=100`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Cache-Control': 'no-cache'
        }
      });
      const data = await response.json();
      if (data.success) {
        setAssignments(data.assignments || []);
      } else {
        throw new Error(data.error || 'Failed to fetch assignments');
      }
    } catch (error) {
      setAssignmentsError(error.message);
      toast.error('Unable to load assignments. Please try again.');
    } finally {
      setAssignmentsLoading(false);
    }
  };

  const fetchResources = async () => {
    setResourcesLoading(true);
    setResourcesError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/api/resources?limit=100`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Cache-Control': 'no-cache'
        }
      });
      const data = await response.json();
      if (data.success) {
        setResources(data.resources || []);
      } else {
        throw new Error(data.error || 'Failed to fetch resources');
      }
    } catch (error) {
      setResourcesError(error.message);
      toast.error('Unable to load learning resources. Please try again.');
    } finally {
      setResourcesLoading(false);
    }
  };

  const fetchStudentResults = async () => {
    if (!student?.admissionNumber) return;

    setResultsLoading(true);
    setResultsError(null);
    try {
      const response = await fetch(`/api/results?action=student-results&admissionNumber=${encodeURIComponent(student.admissionNumber)}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Cache-Control': 'no-cache'
        }
      });
      const data = await response.json();
      if (data.success) {
        setStudentResults(data.results || []);
      } else {
        throw new Error(data.error || 'Failed to fetch results');
      }
    } catch (error) {
      setResultsError(error.message);
      toast.error('Unable to load academic results. Please try again.');
    } finally {
      setResultsLoading(false);
    }
  };

  const fetchFeeBalance = async () => {
    if (!student?.admissionNumber) return;

    setFeeLoading(true);
    setFeeError(null);
    try {
      const response = await fetch(`/api/feebalances/${student.admissionNumber}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Cache-Control': 'no-cache'
        }
      });
      const data = await response.json();
      if (data.success) {
        setFeeBalance(data.data);
      } else {
        throw new Error(data.error || 'Failed to fetch fee balance');
      }
    } catch (error) {
      setFeeError(error.message);
      toast.error('Unable to load fee balance. Please contact accounts office.');
    } finally {
      setFeeLoading(false);
    }
  };

  const handleStudentLogin = async (fullName, admissionNumber) => {
    setLoginLoading(true);
    setLoginError(null);
    setRequiresContact(false);

    try {
      const response = await fetch('/api/studentlogin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, admissionNumber })
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('student_token', data.token);
        setStudent(data.student);
        setToken(data.token);
        setShowLoginModal(false);

        toast.success('Login Successful!', {
          description: `Welcome to Kinyui Boys' Portal, ${data.student.fullName}`
        });

        fetchAllData();
      } else {
        setLoginError(data.error);
        setRequiresContact(data.requiresContact || false);

        if (data.requiresContact) {
          toast.error('Student Record Not Found', {
            description: 'Please contact your class teacher or school administrator for assistance.'
          });
        } else {
          toast.error(data.error || 'Login failed. Please check your credentials.');
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      setLoginError('Network error. Please check your connection and try again.');
      toast.error('Connection Error', {
        description: 'Unable to connect to the server. Please try again later.'
      });
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/studentlogin', { method: 'DELETE' });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('student_token');
      setStudent(null);
      setToken(null);
      setShowLoginModal(true);
      setAssignments([]);
      setResources([]);
      setStudentResults([]);
      setFeeBalance(null);

      toast.success('Logged Out Successfully', {
        description: 'You have been securely logged out of the portal.'
      });
    }
  };

  const handleRefresh = () => {
    if (!token) {
      setShowLoginModal(true);
      return;
    }

    fetchAllData();
    toast.success('Refreshing Data', {
      description: 'Your portal data is being updated.'
    });
  };

  const handleDownload = (item) => {
    toast.success('Download Started', {
      description: `Downloading ${item.title || 'file'}...`
    });
  };

  const handleViewDetails = (item) => {
    toast.info('Viewing Details', {
      description: `Opening details for ${item.title}`
    });
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const closeMenuOnMobile = () => {
    if (window.innerWidth < 1024) setIsMenuOpen(false);
  };

  const handleViewChange = (view) => {
    setCurrentView(view);
    closeMenuOnMobile();
  };

  if (isLoading) return <LoadingScreen />;

  // ========== UNAUTHENTICATED LANDING ==========
  if (!student || !token) {
    return (
      <>
        <LandingPage onOpenLogin={() => setShowLoginModal(true)} router={router} />
        <StudentLoginModal
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
          onLogin={handleStudentLogin}
          isLoading={loginLoading}
          error={loginError}
          requiresContact={requiresContact}
        />
      </>
    );
  }

  // ========== AUTHENTICATED PORTAL ==========
  return (
    <div className="min-h-screen bg-gray-50">
      <style>{portalStyles}</style>
      <Toaster position="top-right" expand richColors theme="light" />

      <StudentLoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLogin={handleStudentLogin}
        isLoading={loginLoading}
        error={loginError}
        requiresContact={requiresContact}
      />

      {/* Mobile overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden" onClick={toggleMenu} />
      )}

      <div className="flex">
        {/* Sidebar */}
        <div className={`
          ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 fixed lg:sticky lg:top-0
          h-screen z-50 transition-transform duration-300 ease-in-out flex-shrink-0
          w-[280px] sm:w-[300px] lg:w-72 xl:w-80 shadow-2xl hide-scrollbar
        `}>
          <NavigationSidebar
            student={student}
            feeBalance={feeBalance}
            feeLoading={feeLoading}
            feeError={feeError}
            onLogout={handleLogout}
            currentView={currentView}
            setCurrentView={handleViewChange}
            onRefresh={handleRefresh}
            onMenuClose={closeMenuOnMobile}
          />
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col min-h-screen">
          <StudentHeader
            student={student}
            onMenuToggle={toggleMenu}
            isMenuOpen={isMenuOpen}
            currentView={currentView}
          />

          <main className="flex-1 overflow-y-auto px-3 sm:px-5 lg:px-8 py-5 sm:py-6 lg:py-8 max-w-7xl mx-auto w-full hide-scrollbar">
            {currentView === 'home' && (
              <HomeDashboardView student={student} token={token} />
            )}
            {currentView === 'results' && (
              <ResultsView
                student={student}
                studentResults={studentResults}
                resultsLoading={resultsLoading}
                resultsError={resultsError}
                onRefreshResults={fetchStudentResults}
              />
            )}
            {currentView === 'resources' && (
              <ResourcesAssignmentsView
                student={student}
                assignments={assignments}
                resources={resources}
                assignmentsLoading={assignmentsLoading}
                resourcesLoading={resourcesLoading}
                onDownload={handleDownload}
                onViewDetails={handleViewDetails}
              />
            )}
            {currentView === 'guidance' && <GuidanceEventsView />}
            {currentView === 'fees' && <FeesView student={student} token={token} />}
          </main>

          {/* Footer */}
          <footer className="border-t border-gray-200 bg-maroon-900 py-5 sm:py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <p className="text-white text-sm font-semibold">&copy; {new Date().getFullYear()} Kinyui Boys&apos; Senior School</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                    <span className="text-xs text-black/70">Secure Session Active</span>
                  </div>
                </div>
                <div className="flex items-center gap-5 flex-wrap">
                  {['Privacy Policy', 'Terms of Service', 'Help Center'].map((label) => (
                    <button key={label} onClick={() => router.push('/pages/OurSchoolPolicies')}
                      className="text-black/70 hover:text-white text-xs font-medium transition-colors touch-target">
                      {label}
                    </button>
                  ))}
                  <button onClick={() => router.push('/pages/OurSchoolPolicies')}
                    className="text-black/70 hover:text-white transition-colors touch-target" aria-label="Accessibility">
                    <FaGlobe className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}