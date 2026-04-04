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
  const navItems = [
    { id: 'home', label: 'Dashboard', icon: <FiHome /> },
    { id: 'results', label: 'Academic Results', icon: <FiBarChart2 /> },
    { id: 'resources', label: 'Resources & Assignments', icon: <FiFolder /> },
    { id: 'guidance', label: 'Guidance & Events', icon: <FiMessageSquare /> },
  ];

  const getInitials = (name) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) || 'KB';
  };

  const router = useRouter();

  return (
    <aside className="fixed lg:relative inset-y-0 left-0 z-50 h-full bg-gradient-to-b from-white via-amber-50 to-rose-50 border-r border-amber-200 w-full max-w-[300px] lg:max-w-[280px] xl:max-w-[300px] flex flex-col shadow-xl">
      <div className="flex flex-col h-full">
        
        {/* Header with Kinyui Branding */}
        <div className="p-4 sm:p-5 lg:p-6 border-b border-amber-200 bg-gradient-to-r from-rose-900 via-rose-800 to-amber-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* School Logo with Glow Effect */}
              <div className="relative group">
                <div className="absolute inset-0 bg-amber-500/50 rounded-2xl blur-md group-hover:blur-xl transition-all duration-300"></div>
                <div className="relative w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-rose-700 to-amber-600 rounded-2xl flex items-center justify-center shadow-2xl">
                  <div className="w-full h-full rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
                    <img 
                      src="/kinyui.png" 
                      alt="Kinyui Boys School Logo" 
                      className="w-10 h-10 sm:w-11 sm:h-11 object-contain p-1.5"
                    />
                  </div>
                </div>
                <div className="absolute -top-1 -right-1 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-amber-400 rounded-full border-2 border-rose-900 shadow-lg animate-pulse"></div>
              </div>
              
              <div className="min-w-0">
                <h2 className="font-black text-white text-base sm:text-lg lg:text-xl tracking-tight">
                  KINYUI BOYS'
                </h2>
                <p className="text-slate-800 text-[10px] sm:text-xs font-bold tracking-wider">
                  STUDENT PORTAL
                </p>
              </div>
            </div>
            
            {/* Mobile Close Button - Amber styled */}
            <button
              onClick={onMenuClose}
              className="lg:hidden p-2 hover:bg-white/10 rounded-xl transition-all duration-200 hover:scale-110"
              aria-label="Close sidebar"
            >
              <FiX size={20} className="text-rose-900" />
            </button>
          </div>
          
          {/* School Motto */}
          <div className="mt-3 text-center">
            <p className="text-rose-600 text-[10px] font-bold italic flex items-center justify-center gap-1">
              <FiAward className="text-rose-900 text-xs" />
              "Soaring to Excellence"
              <FiAward className="text-rose-900 text-xs" />
            </p>
          </div>
        </div>

        {/* Student Profile - rose Theme */}
        <div className="p-4 sm:p-5 lg:p-6 border-b border-amber-200 bg-gradient-to-br from-rose-50 to-amber-50">
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Profile Avatar with rose/Amber Gradient */}
            <div className="relative group">
              <div className="absolute inset-0 bg-amber-500/30 rounded-full blur-md group-hover:blur-lg transition-all duration-300"></div>
              <div className="relative w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-rose-700 to-amber-600 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white font-black text-lg sm:text-xl">
                  {getInitials(student?.fullName)}
                </span>
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-rose-900 text-sm sm:text-base lg:text-lg truncate flex items-center gap-1">
                <FiUser className="text-rose-900 text-xs" />
                {student?.fullName || 'Student Name'}
              </h3>
              <div className="flex items-center gap-1.5 sm:gap-2 mt-1.5">
                <span className="px-2 sm:px-3 py-0.5 bg-gradient-to-r from-rose-600 to-amber-600 text-white text-[10px] sm:text-xs font-bold rounded-full">
                  {student?.form} {student?.stream}
                </span>
              </div>
              <div className="flex items-center gap-1 mt-1.5">
                <FiShield className="text-rose-900 text-[10px]" />
                <p className="text-rose-700 text-[10px] sm:text-xs font-mono font-bold">
                  ADM: {student?.admissionNumber || '****'}
                </p>
              </div>
            </div>
          </div>
          
          {/* Session Info */}
          <div className="mt-3 pt-2 border-t border-amber-200">
            <div className="flex items-center justify-between text-[10px]">
              <span className="text-rose-600 font-semibold flex items-center gap-1">
                <FiClock className="text-rose-900" />
                Active Session
              </span>
              <span className="text-rose-800 font-bold">2 Hours</span>
            </div>
          </div>
        </div>

        {/* Navigation - rose/Amber Hover Effects */}
        <nav className="flex-1 p-4 sm:p-5 lg:p-6 overflow-y-auto">
          <div className="space-y-2 sm:space-y-3">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`w-full flex items-center gap-3 sm:gap-4 px-3 sm:px-4 py-3 sm:py-3.5 rounded-xl transition-all duration-300 group relative overflow-hidden ${
                  currentView === item.id 
                    ? 'bg-gradient-to-r from-rose-600 to-amber-600 text-white shadow-lg shadow-rose-900/30' 
                    : 'text-rose-800 hover:bg-gradient-to-r hover:from-rose-50 hover:to-amber-50 hover:text-rose-900'
                }`}
              >
                {/* Active Indicator */}
                {currentView === item.id && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-amber-400 rounded-r-full shadow-lg shadow-amber-500/50"></div>
                )}
                
                {/* Icon */}
                <span className={`text-lg sm:text-xl transition-all duration-200 ${
                  currentView === item.id 
                    ? 'text-white' 
                    : 'text-rose-500 group-hover:text-rose-900'
                }`}>
                  {item.icon}
                </span>
                
                {/* Label */}
                <span className={`font-bold text-left text-sm sm:text-base transition-all duration-200 ${
                  currentView === item.id 
                    ? 'text-white' 
                    : 'text-rose-800 group-hover:text-rose-900'
                }`}>
                  {item.label}
                </span>
                
                {/* Active Chevron */}
                {currentView === item.id && (
                  <div className="ml-auto text-rose-300">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                )}
              </button>
            ))}

            {/* Zeraki Analytics Link - rose Styled */}
            <a
              href="https://analytics.zeraki.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center gap-3 sm:gap-4 px-3 sm:px-4 py-3 sm:py-3.5 rounded-xl transition-all duration-300 text-rose-800 hover:bg-gradient-to-r hover:from-rose-50 hover:to-amber-50 group"
            >
              <div className="relative">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg overflow-hidden border-2 border-amber-300 group-hover:border-amber-500 transition-all duration-200">
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
              <FiExternalLink className="text-rose-900 text-sm sm:text-base group-hover:text-rose-900 transition-all duration-200" />
            </a>
          </div>
        </nav>

        {/* Footer Buttons - rose Theme */}
        <div className="p-3 sm:p-4 lg:p-6 bg-gradient-to-t from-rose-50 to-transparent border-t border-amber-200">
          <div className="flex flex-row items-center gap-2 sm:gap-3 w-full">
            {/* Refresh Button */}
            <button
              onClick={() => {
                router.refresh();
              }}
              className="group flex-1 flex items-center justify-center gap-1.5 sm:gap-2.5 px-3 sm:px-4 py-2.5 sm:py-3 
              bg-white border-2 border-rose-200 text-rose-700 rounded-xl sm:rounded-2xl 
              text-xs sm:text-sm font-black tracking-tight shadow-md 
              hover:bg-gradient-to-r hover:from-rose-50 hover:to-amber-50 hover:border-amber-400
              active:scale-95 transition-all duration-200 min-w-0"
            >
              <FiRefreshCw className="text-sm sm:text-lg group-active:animate-spin text-rose-900" />
              <span className="truncate">Refresh</span>
            </button>

            {/* Logout Button */}
            <button
              onClick={onLogout}
              className="flex-1 flex items-center justify-center gap-1.5 sm:gap-2.5 px-3 sm:px-4 py-2.5 sm:py-3 
              bg-gradient-to-r from-rose-700 to-rose-800 border-2 border-rose-600 text-white rounded-xl sm:rounded-2xl 
              text-xs sm:text-sm font-black tracking-tight shadow-lg 
              hover:from-rose-800 hover:to-rose-900 hover:border-amber-500
              active:scale-95 transition-all duration-200 min-w-0"
            >
              <FiLogOut className="text-sm sm:text-lg text-rose-600" />
              <span className="truncate">Logout</span>
            </button>
          </div>
          
          {/* Footer Text */}
          <div className="mt-3 text-center">
            <p className="text-[8px] text-rose-500 font-bold tracking-wider">
              © {new Date().getFullYear()} KINYUI BOYS' • EST. 1976
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}