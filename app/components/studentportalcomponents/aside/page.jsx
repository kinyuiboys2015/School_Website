'use client';

import { 
  FiHome, 
  FiBarChart2, 
  FiFolder, 
  FiMessageSquare, 
  FiLogOut,
  FiX,
  FiRefreshCw,
  FiExternalLink,
  FiAward,
  FiShield,
  FiClock,
  FiUser
} from 'react-icons/fi';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function NavigationSidebar({ 
  student, 
  onLogout, 
  currentView, 
  setCurrentView,
  onRefresh,
  onMenuClose
}) {
  const academicLevel = student?.academicLevel || student?.gradeLevel || student?.className || student?.form || '';
  const displayClass = student?.displayClass ||
    [academicLevel, student?.stream].filter(Boolean).join(' ') ||
    'Class not set';

  const navItems = [
    { id: 'home', label: 'Dashboard', icon: <FiHome /> },
    { id: 'results', label: 'Academic Results', icon: <FiBarChart2 /> },
    { id: 'resources', label: 'Resources & Assignments', icon: <FiFolder /> },
    { id: 'guidance', label: 'Guidance & Events', icon: <FiMessageSquare /> },
    { id: 'fees', label: 'Fee Balance', icon: <FiAward /> },
  ];

  const getInitials = (name) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) || 'KB';
  };

  const router = useRouter();

  return (
    <aside className="fixed lg:relative inset-y-0 left-0 z-50 h-full w-full max-w-[300px] lg:max-w-[280px] xl:max-w-[300px] flex flex-col overflow-hidden border-r border-slate-200 bg-white shadow-2xl">
      <div className="flex flex-col h-full">
        
        {/* Header with Kinyui Branding */}
        <div className="relative overflow-hidden border-b border-white/10 bg-slate-950 p-4 sm:p-5 lg:p-6">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-amber-400 via-emerald-400 to-sky-400" />
          <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-amber-400/10 blur-3xl" />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative group">
                <div className="absolute inset-0 bg-amber-300/20 rounded-2xl blur-md group-hover:blur-xl transition-all duration-300"></div>
                <div className="relative w-12 h-12 sm:w-14 sm:h-14 bg-white rounded-2xl flex items-center justify-center shadow-2xl ring-1 ring-white/20">
                  <div className="w-full h-full rounded-2xl bg-white flex items-center justify-center">
                    <img 
                      src="/SchoolLogo.png" 
                      alt="Kinyui Boys School Logo" 
                      className="w-10 h-10 sm:w-11 sm:h-11 object-contain p-1.5"
                    />
                  </div>
                </div>
                <div className="absolute -top-1 -right-1 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-emerald-400 rounded-full border-2 border-slate-950 shadow-lg animate-pulse"></div>
              </div>
              
              <div className="min-w-0">
                <h2 className="font-black text-white text-base sm:text-lg lg:text-xl tracking-tight">
                  KINYUI BOYS'
                </h2>
                <p className="text-slate-300 text-[10px] sm:text-xs font-bold tracking-wider">
                  STUDENT PORTAL
                </p>
              </div>
            </div>
            
            {/* Mobile Close Button */}
            <button
              onClick={onMenuClose}
              className="lg:hidden p-2 hover:bg-white/10 rounded-xl transition-all duration-200"
              aria-label="Close sidebar"
            >
              <FiX size={20} className="text-slate-300" />
            </button>
          </div>
          
          <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-center">
            <p className="text-slate-300 text-[10px] font-bold italic flex items-center justify-center gap-1">
              <FiAward className="text-amber-300 text-xs" />
              "Blessed and Favoured"
              <FiAward className="text-amber-300 text-xs" />
            </p>
          </div>
        </div>

        {/* Student Profile */}
        <div className="p-4 sm:p-5 lg:p-6 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="relative group">
              <div className="absolute inset-0 bg-slate-400/30 rounded-full blur-md group-hover:blur-lg transition-all duration-300"></div>
              <div className="relative w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-slate-700 to-slate-950 rounded-2xl flex items-center justify-center shadow-lg ring-4 ring-white">
                <span className="text-white font-black text-lg sm:text-xl">
                  {getInitials(student?.fullName)}
                </span>
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-slate-950 text-sm sm:text-base lg:text-lg truncate flex items-center gap-1">
                <FiUser className="text-slate-500 text-xs" />
                {student?.fullName || 'Student Name'}
              </h3>
              <div className="flex items-center gap-1.5 sm:gap-2 mt-1.5">
                <span className="px-2 sm:px-3 py-0.5 bg-slate-950 text-white text-[10px] sm:text-xs font-bold rounded-full">
                  {displayClass}
                </span>
              </div>
              <div className="flex items-center gap-1 mt-1.5">
                <FiShield className="text-slate-500 text-[10px]" />
                <p className="text-slate-600 text-[10px] sm:text-xs font-mono font-bold">
                  ADM: {student?.admissionNumber || '****'}
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-3 pt-3 border-t border-slate-200">
            <div className="flex items-center justify-between text-[10px]">
              <span className="text-slate-600 font-semibold flex items-center gap-1">
                <FiClock className="text-slate-500" />
                Active Session
              </span>
              <span className="text-slate-900 font-bold">2 Hours</span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 sm:p-5 lg:p-6 overflow-y-auto">
          <p className="mb-3 px-2 text-[10px] font-black uppercase tracking-[0.22em] text-slate-400">Portal Menu</p>
          <div className="space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`w-full flex items-center gap-3 sm:gap-4 px-3 sm:px-4 py-3 sm:py-3.5 rounded-xl transition-all duration-300 group relative overflow-hidden ${
                  currentView === item.id 
                    ? 'bg-slate-950 text-white shadow-lg shadow-slate-900/20' 
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950'
                }`}
              >
                {currentView === item.id && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-amber-300 rounded-r-full shadow-lg shadow-amber-300/40"></div>
                )}
                
                <span className={`text-lg sm:text-xl transition-all duration-200 ${
                  currentView === item.id 
                    ? 'text-white' 
                    : 'text-slate-400 group-hover:text-slate-700'
                }`}>
                  {item.icon}
                </span>
                
                <span className={`font-bold text-left text-sm sm:text-base transition-all duration-200 ${
                  currentView === item.id 
                    ? 'text-white' 
                    : 'text-slate-700 group-hover:text-slate-950'
                }`}>
                  {item.label}
                </span>
                
                {currentView === item.id && (
                  <div className="ml-auto text-white/50">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                )}
              </button>
            ))}

            {/* Zeraki Analytics Link */}
            <a
              href="https://analytics.zeraki.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center gap-3 sm:gap-4 px-3 sm:px-4 py-3 sm:py-3.5 rounded-xl transition-all duration-300 text-slate-600 hover:bg-slate-100 hover:text-slate-950 group"
            >
              <div className="relative">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg overflow-hidden border-2 border-slate-200 group-hover:border-slate-400 transition-all duration-200">
                  <img 
                    src="/zeraki.jpg" 
                    alt="Zeraki Analytics" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <span className="font-bold text-left text-sm sm:text-base flex-1">
                Zeraki Analytics
              </span>
              <FiExternalLink className="text-slate-400 text-sm sm:text-base group-hover:text-slate-700 transition-all duration-200" />
            </a>
          </div>
        </nav>

        {/* Footer Buttons */}
        <div className="p-3 sm:p-4 lg:p-6 bg-slate-50 border-t border-slate-200">
          <div className="flex flex-row items-center gap-2 sm:gap-3 w-full">
            {/* Refresh Button */}
            <button
              onClick={() => {
                if (onRefresh) {
                  onRefresh();
                } else {
                  router.refresh();
                }
              }}
              className="group flex-1 flex items-center justify-center gap-1.5 sm:gap-2.5 px-3 sm:px-4 py-2.5 sm:py-3 
              bg-white border border-slate-200 text-slate-700 rounded-xl sm:rounded-2xl 
              text-xs sm:text-sm font-black tracking-tight shadow-md 
              hover:bg-slate-100 hover:border-slate-300
              active:scale-95 transition-all duration-200 min-w-0"
            >
              <FiRefreshCw className="text-sm sm:text-lg group-active:animate-spin text-slate-700" />
              <span className="truncate">Refresh</span>
            </button>

            {/* Logout Button */}
            <button
              onClick={onLogout}
              className="flex-1 flex items-center justify-center gap-1.5 sm:gap-2.5 px-3 sm:px-4 py-2.5 sm:py-3 
              bg-slate-950 hover:bg-black border border-slate-900 text-white rounded-xl sm:rounded-2xl 
              text-xs sm:text-sm font-black tracking-tight shadow-lg 
              active:scale-95 transition-all duration-200 min-w-0"
            >
              <FiLogOut className="text-sm sm:text-lg text-slate-300" />
              <span className="truncate">Logout</span>
            </button>
          </div>
          
          {/* Footer Text */}
          <div className="mt-3 text-center">
            <p className="text-[8px] text-slate-500 font-bold tracking-wider">
              © {new Date().getFullYear()} KINYUI BOYS' • STUDENT SERVICES
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
