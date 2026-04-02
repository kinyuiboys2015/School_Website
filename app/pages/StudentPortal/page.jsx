'use client';

import { useState, useEffect, useCallback } from 'react';
import { Toaster, toast } from 'sonner';
import StudentLoginModal from '../../components/studentloginmodel/page';
import NavigationSidebar from '../../components/studentportalcomponents/aside/page.jsx';
import ResultsView from '../../components/studentportalcomponents/result/page.jsx';
import ResourcesAssignmentsView from '../../components/studentportalcomponents/ass/page.jsx';
import GuidanceEventsView from '../../components/studentportalcomponents/session/page';
import LoadingScreen from '../../components/studentportalcomponents/loading/page';
import FeesView from '../../components/studentportalcomponents/feebalance/page';

/// Font Awesome 6 - Modern versions
import { 
  FaBell, FaBars, FaCalendar, FaBook, FaAward, FaDollarSign, 
  FaClock, FaChartLine, FaChartBar, FaFolder, FaComments,
  FaRocket, FaPalette, FaGem, FaChartPie, FaTrendingUp, FaCrown,
  FaLightbulb, FaBrain, FaHandshake, FaHeart, FaLock, FaGlobe, 
  FaArrowRight, FaFire, FaBolt, FaCalendarCheck, FaUserPlus, 
  FaUserCheck, FaRoute, FaDirections, FaQrcode, FaFingerprint, 
  FaIdCard, FaDesktop, FaWandMagic, FaUser, FaShieldAlt, FaSchool
} from 'react-icons/fa6';

import { useRouter } from 'next/navigation';
import Image from 'next/image';

// Font Awesome 5 (Legacy)
import { 
  FaHome, FaSearch, FaTimes, FaSync, FaExclamationCircle, 
  FaCircleExclamation, FaSparkles, FaCloudUpload, FaUserFriends,
  FaQuestionCircle
} from 'react-icons/fa';
import { HiSparkles } from "react-icons/hi2";
import { FaCheckCircle } from "react-icons/fa6";

// Feather icons
import { 
  FiMenu, FiX, FiRefreshCw, FiBookOpen, FiExternalLink, 
  FiShield, FiExpand, FiCompress, FiMapPin, FiSmartphone, FiTablet
} from 'react-icons/fi';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

// ==================== RESPONSIVE STYLES ====================
// Description: Mobile-first responsive styles ensuring proper display across all device sizes
// from smartphones (320px) to desktops (1920px+)
const responsiveStyles = `
@media (max-width: 768px) {
  .mobile-scroll-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  .mobile-scroll-hide::-webkit-scrollbar {
    display: none;
  }
  
  .mobile-touch-friendly {
    min-height: 44px;
    min-width: 44px;
  }
  
  .mobile-text-truncate {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  
  .mobile-stack {
    flex-direction: column !important;
  }
  
  .mobile-compact {
    padding: 0.75rem !important;
    margin: 0.5rem !important;
  }
  
  .mobile-full-width {
    width: 100% !important;
    max-width: 100% !important;
  }
  
  .mobile-modal-fix {
    max-height: 80vh !important;
    margin: 1rem !important;
  }
}

@media (max-width: 640px) {
  .xs-text-sm {
    font-size: 0.875rem !important;
  }
  
  .xs-p-2 {
    padding: 0.5rem !important;
  }
  
  .xs-gap-2 {
    gap: 0.5rem !important;
  }
}

.mobile-contain {
  max-width: 100% !important;
  height: auto !important;
}
`;

// ==================== MODERN STUDENT HEADER ====================
// Description: Top navigation header displaying student information, school branding,
// and mobile menu toggle. Features Kinyui Boys' School theme with maroon and amber colors.
// Includes responsive design that adapts from mobile to desktop views.
function ModernStudentHeader({ 
  student, 
  searchTerm, 
  setSearchTerm, 
  onRefresh,
  onMenuToggle,
  isMenuOpen,
  currentView 
}) {
  
  // Description: Generates initials from student's full name (max 2 characters)
  // Used for avatar display when no profile image is available
  const getInitials = (name) => {
    if (!name) return 'KB';
    return name
      .split(' ')
      .map(part => part.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('');
  };

  // Description: Returns gradient color scheme based on first letter of student's name
  // Creates personalized color combinations using school's maroon and amber theme
  const getGradientColor = (name) => {
    const char = name.trim().charAt(0).toUpperCase();
    const gradients = {
      A: "bg-gradient-to-r from-maroon-700 to-amber-600",
      B: "bg-gradient-to-r from-amber-600 to-maroon-700",
      C: "bg-gradient-to-r from-maroon-800 to-amber-500",
      D: "bg-gradient-to-r from-amber-700 to-maroon-600",
      E: "bg-gradient-to-r from-maroon-600 to-amber-700",
      F: "bg-gradient-to-r from-amber-500 to-maroon-800",
      G: "bg-gradient-to-r from-maroon-900 to-amber-600",
      H: "bg-gradient-to-r from-amber-600 to-maroon-900",
      I: "bg-gradient-to-r from-maroon-700 to-amber-500",
      J: "bg-gradient-to-r from-amber-500 to-maroon-700",
      K: "bg-gradient-to-r from-maroon-800 to-amber-600",
      L: "bg-gradient-to-r from-amber-600 to-maroon-800",
      M: "bg-gradient-to-r from-maroon-600 to-amber-500",
      N: "bg-gradient-to-r from-amber-500 to-maroon-600",
      O: "bg-gradient-to-r from-maroon-900 to-amber-700",
      P: "bg-gradient-to-r from-amber-700 to-maroon-900",
      Q: "bg-gradient-to-r from-maroon-700 to-amber-600",
      R: "bg-gradient-to-r from-amber-600 to-maroon-700",
      S: "bg-gradient-to-r from-maroon-800 to-amber-500",
      T: "bg-gradient-to-r from-amber-500 to-maroon-800",
      U: "bg-gradient-to-r from-maroon-600 to-amber-700",
      V: "bg-gradient-to-r from-amber-700 to-maroon-600",
      W: "bg-gradient-to-r from-maroon-900 to-amber-600",
      X: "bg-gradient-to-r from-amber-600 to-maroon-900",
      Y: "bg-gradient-to-r from-maroon-700 to-amber-500",
      Z: "bg-gradient-to-r from-amber-500 to-maroon-700",
    };
    return gradients[char] || "bg-gradient-to-r from-maroon-700 to-amber-600";
  };

  // Description: Returns appropriate icon based on current view selection
  // Helps users quickly identify which section they're currently viewing
  const getViewIcon = (view) => {
    switch(view) {
      case 'home': return <FaHome className="text-amber-500" />;
      case 'results': return <FaChartBar className="text-amber-500" />;
      case 'resources': return <FaFolder className="text-amber-500" />;
      case 'guidance': return <FaComments className="text-amber-500" />;
      case 'fees': return <FaDollarSign className="text-amber-500" />;
      default: return <FaHome className="text-amber-500" />;
    }
  };

  return (
    <>
      <style jsx global>{responsiveStyles}</style>
      <header className="bg-gradient-to-r from-maroon-900 via-maroon-800 to-amber-800 border-b border-amber-600/30 shadow-xl sticky top-0 z-30">
        <div className="container mx-auto px-3 xs:px-4 sm:px-6">
          <div className="flex items-center justify-between h-14 sm:h-16 md:h-20">
            {/* Left Section: Student Info + Mobile Menu */}
            <div className="flex items-center gap-2 sm:gap-3 md:gap-5">
              {/* Mobile Menu Button - Description: Toggles sidebar navigation on mobile devices */}
              <button
                onClick={onMenuToggle}
                className="lg:hidden p-2 sm:p-3 rounded-xl bg-white/10 backdrop-blur-sm shadow-sm hover:bg-white/20 transition-all mobile-touch-friendly"
                aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              >
                {isMenuOpen ? 
                  <FaTimes className="text-amber-300 w-4 h-4 sm:w-5 sm:h-5" /> : 
                  <FaBars className="text-amber-300 w-4 h-4 sm:w-5 sm:h-5" />
                }
              </button>

              {/* Student Info Section - Description: Displays student avatar, name, form, and stream */}
              {student && (
                <div className="flex items-center gap-2 sm:gap-3">
                  {/* Avatar with gradient background based on student name */}
                  <div className="relative group">
                    <div
                      className={`absolute inset-0 ${getGradientColor(student.fullName)} rounded-full blur opacity-70 group-hover:opacity-100 transition-opacity`}
                    />
                    <div className="relative w-9 h-9 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-full flex items-center justify-center font-bold text-white text-base sm:text-lg md:text-xl bg-gradient-to-br from-maroon-800 to-amber-700 border-2 border-amber-400 shadow-lg">
                      {getInitials(student.fullName)}
                    </div>
                  </div>

                  {/* Name & Form/Stream - Description: Shows student's full name and class details */}
                  <div className="hidden xs:flex flex-col">
                    <p className="text-sm sm:text-base md:text-lg font-bold text-white mobile-text-truncate max-w-[120px] sm:max-w-[160px] md:max-w-none">
                      {student.fullName}
                    </p>
                    <div className="flex items-center gap-1 sm:gap-2">
                      <span className="text-xs sm:text-sm text-amber-200 mobile-text-truncate max-w-[100px] sm:max-w-none">
                        {student.form} • {student.stream}
                      </span>
                      <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-gradient-to-r from-amber-400 to-amber-500 rounded-full animate-pulse"></span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Current View Display - Description: Shows active section title on mobile devices */}
            <div className="lg:hidden flex items-center gap-2 sm:gap-3">
              <div className="p-2 sm:p-2.5 bg-white/10 backdrop-blur-sm rounded-xl shadow-sm">
                {getViewIcon(currentView)}
              </div>
              <div className="max-w-[140px] sm:max-w-none">
                <h1 className="text-sm sm:text-base md:text-lg font-bold text-white mobile-text-truncate">
                  {currentView === 'home' && 'Dashboard'}
                  {currentView === 'results' && 'Results'}
                  {currentView === 'resources' && 'Resources'}
                  {currentView === 'guidance' && 'Guidance'}
                  {currentView === 'fees' && 'Fee Balance'}
                </h1>
                <p className="text-xs text-amber-200 hidden sm:block">Kinyui Boys' Portal</p>
              </div>
            </div>

            {/* School Badge - Description: Desktop-only display of school name and branding */}
            <div className="hidden lg:flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 rounded-full border border-amber-500/30">
                <div className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse" />
                <span className="text-[10px] font-black text-amber-200 uppercase tracking-wider">KINYUI BOYS'</span>
                <FaShieldAlt className="w-3 h-3 text-amber-400" />
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}

// ==================== MODERN HOME VIEW ====================
// Description: Main dashboard view displaying student statistics, fee balance,
// quick action cards, and personalized welcome message. Serves as the landing page
// after successful login, providing an overview of all portal features.
function ModernHomeView({ student, feeBalance, feeLoading, token }) {
  const [showFeeDetails, setShowFeeDetails] = useState(false);

  // Description: Student information cards showing key academic details
  // Includes form, stream, admission number, and current academic year
  const stats = [
    { 
      label: 'Current Form', 
      value: `${student?.form || 'N/A'}`, 
      icon: <FaUser className="text-base sm:text-lg md:text-xl" />, 
      gradient: 'from-maroon-600 to-amber-600',
      bgGradient: 'from-maroon-50 to-amber-50'
    },
    { 
      label: 'Stream', 
      value: student?.stream || 'N/A', 
      icon: <FaBook className="text-base sm:text-lg md:text-xl" />, 
      gradient: 'from-amber-600 to-maroon-600',
      bgGradient: 'from-amber-50 to-maroon-50'
    },
    { 
      label: 'Admission No', 
      value: student?.admissionNumber || 'N/A', 
      icon: <FaAward className="text-base sm:text-lg md:text-xl" />, 
      gradient: 'from-maroon-700 to-amber-500',
      bgGradient: 'from-maroon-50 to-amber-50'
    },
    { 
      label: 'Academic Year', 
      value: new Date().getFullYear().toString(),
      icon: <FaCalendar className="text-base sm:text-lg md:text-xl" />, 
      gradient: 'from-amber-500 to-maroon-600',
      bgGradient: 'from-amber-50 to-maroon-50'
    },
  ];

  // Description: Quick action modules providing access to main portal features
  // Each card describes the purpose and available actions for different sections
  const quickActions = [
    {
      tab: 'learning',
      title: 'Learning Hub',
      description: 'Access all your academic learning tools in one place, including assignments, revision materials, notes, and other essential learning resources provided by your teachers to support your daily studies and exam preparation.',
      icon: <FiBookOpen className="text-lg sm:text-xl md:text-2xl" />,
      gradient: 'from-maroon-600 to-amber-600',
      bgGradient: 'from-maroon-50 to-amber-100',
      actions: ['View Assignments', 'Browse Learning Resources']
    },
    {
      tab: 'results',
      title: 'Academic Results Center',
      description: 'Review your academic performance in detail by accessing both class-wide results and your personal examination results, allowing you to track progress, identify strengths, and understand areas that need improvement for better performance.',
      icon: <FaChartLine className="text-lg sm:text-xl md:text-2xl" />,
      gradient: 'from-amber-600 to-maroon-600',
      bgGradient: 'from-amber-50 to-maroon-100',
      actions: ['View Class Results', 'Access Personal Results']
    },
    {
      tab: 'support',
      title: 'Student Support Services',
      description: 'Stay informed and supported through access to guidance and counselling services, important school announcements, upcoming events, and news updates designed to support your academic, personal, and social wellbeing throughout your journey at Kinyui Boys.',
      icon: <FaUserFriends className="text-lg sm:text-xl md:text-2xl" />,
      gradient: 'from-maroon-700 to-amber-500',
      bgGradient: 'from-maroon-50 to-amber-100',
      actions: ['Guidance & Counselling', 'School News & Events']
    }
  ];

  return (
    <div className="space-y-4 sm:space-y-6 md:space-y-8 mobile-scroll-hide">
      {/* Welcome Section - Description: Personalized greeting with school branding */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-maroon-800 via-maroon-700 to-amber-700 opacity-100"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black opacity-20"></div>
        <div className="relative p-4 sm:p-6 md:p-8 text-white">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 md:gap-5 mb-3 sm:mb-4 md:mb-6">
            <div className="p-3 sm:p-4 bg-white bg-opacity-20 rounded-xl sm:rounded-2xl backdrop-blur-sm w-fit">
              <FaRocket className="text-xl sm:text-2xl md:text-3xl text-amber-300" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold leading-tight">
                Welcome back, {student?.fullName?.split(" ")[0] || "Student"}! 🚀
              </h2>
              <p className="text-amber-100 text-xs sm:text-sm md:text-base lg:text-lg mt-1 sm:mt-2 max-w-2xl">
                Ready to continue your learning journey at Kinyui Boys' Senior School? Access all your academic resources, track performance, and stay connected with school updates.
              </p>
            </div>
          </div>

          {/* Status Badges - Description: Shows student status and school affiliation */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 md:gap-4 mt-3 sm:mt-4 md:mt-6">
            <span className="inline-flex items-center gap-1 sm:gap-2 bg-white bg-opacity-20 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full backdrop-blur-sm text-xs sm:text-sm font-bold">
              <HiSparkles className="text-amber-300 text-xs sm:text-sm md:text-base" />
              Active Student
            </span>
            <span className="inline-flex items-center gap-1 sm:gap-2 bg-white bg-opacity-20 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full backdrop-blur-sm text-xs sm:text-sm font-bold">
              <FaCalendarCheck className="text-amber-200 text-xs sm:text-sm md:text-base" />
              Kinyui Boys' Senior School
            </span>
          </div>
        </div>
      </div>

      {/* Quick Stats Grid - Description: Displays key student information in card format */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4 lg:gap-5">
        {stats.map((stat, index) => (
          <div key={index} className="group relative w-full">
            <div 
              className={`absolute inset-0 bg-gradient-to-r ${stat.gradient} rounded-lg sm:rounded-xl md:rounded-2xl blur-xl opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
            />
            <div className="relative bg-white/95 backdrop-blur-xs rounded-lg sm:rounded-xl md:rounded-2xl p-2.5 sm:p-3 md:p-4 border border-amber-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden h-full">
              <div className="absolute -right-1.5 -top-1.5 w-12 h-12 bg-gradient-to-br from-amber-50/30 to-transparent rounded-full opacity-40 group-hover:scale-100 transition-transform duration-500" />
              <div className="flex flex-col h-full">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-1.5 sm:mb-2 md:mb-3">
                  <div className={`flex justify-center sm:justify-start p-1.5 sm:p-2 bg-gradient-to-br ${stat.gradient} rounded-lg sm:rounded-xl text-white shadow-xs group-hover:scale-100 transition-transform duration-300 self-center sm:self-auto mb-1 sm:mb-0`}>
                    <div className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6">
                      {stat.icon}
                    </div>
                  </div>
                </div>
                <div className="mt-0.5 sm:mt-1 md:mt-2 flex-grow text-center sm:text-left">
                  <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-extrabold text-maroon-900 tracking-tight leading-none">
                    {stat.value}
                  </h3>
                  <p className="text-[9px] sm:text-[10px] md:text-xs font-medium text-maroon-600 mt-0.5 sm:mt-1 line-clamp-2">
                    {stat.label}
                  </p>
                </div>
                <div className="mt-1.5 sm:mt-2 md:mt-3 pt-1.5 sm:pt-2 border-t border-amber-100">
                  <div className="flex items-center justify-between">
                    <div className="hidden xs:flex -space-x-1 sm:-space-x-1.5">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="w-3 h-3 sm:w-4 sm:h-4 rounded-full border border-white bg-amber-200" />
                      ))}
                    </div>
                    <span className="text-[7px] sm:text-[8px] md:text-[10px] font-medium text-maroon-400 italic">
                      {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Fee Balance Component - Description: Displays student's fee status and payment history */}
      <FeesView student={student} token={token} />   
      
      {/* Dashboard Overview Section - Description: Main content area with quick action cards */}
      <section className="mb-4 sm:mb-6 md:mb-8 lg:mb-10">
        <div className="mb-3 sm:mb-4 md:mb-6">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-maroon-900">
            Student Dashboard Overview
          </h2>
          <p className="mt-1 text-xs sm:text-sm md:text-base text-maroon-600 max-w-3xl">
            Your central hub for accessing learning resources, completing assignments, reviewing academic results, 
            and connecting with student support services at Kinyui Boys' Senior School.
          </p>
        </div>

        {/* Quick Actions Grid - Description: Interactive cards for main portal features */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 md:gap-5 lg:gap-6">
          {quickActions.map((action, index) => (
            <div key={index} className="relative group mobile-full-width">
              <div className={`hidden sm:block absolute inset-0 bg-gradient-to-r ${action.gradient} rounded-2xl sm:rounded-3xl blur-2xl opacity-0 group-hover:opacity-20 transition-opacity`} />
              <div className="relative h-full bg-white rounded-xl sm:rounded-2xl border border-amber-200 p-3 sm:p-4 md:p-5 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col">
                <div className="flex items-start gap-2.5 sm:gap-3 md:gap-4 mb-2.5 sm:mb-3 md:mb-4">
                  <div className={`p-2.5 sm:p-3 md:p-3.5 rounded-xl sm:rounded-2xl bg-gradient-to-br ${action.gradient} text-white shadow-sm`}>
                    {action.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm sm:text-base md:text-lg font-bold text-maroon-900 leading-tight mobile-text-truncate">
                      {action.title}
                    </h4>
                    <p className="mt-0.5 sm:mt-1 text-xs sm:text-sm text-maroon-500 mobile-text-truncate">
                      {action.tab === 'learning' && 'Access assignments & study materials'}
                      {action.tab === 'results' && 'View class & personal performance'}
                      {action.tab === 'support' && 'Get guidance & school updates'}
                    </p>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-maroon-600 leading-relaxed flex-1 mb-3 sm:mb-4 md:mb-5 line-clamp-3 sm:line-clamp-4">
                  {action.description}
                </p>
                <button 
                  onClick={() => {
                    // This would navigate to the respective section
                    toast.info(`Navigating to ${action.title}`);
                  }}
                  className="mt-auto inline-flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-semibold text-amber-600 hover:text-amber-800 transition-colors mobile-touch-friendly"
                >
                  <span>Access {action.title}</span>
                  <FaArrowRight className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

// ==================== MAIN MODERN COMPONENT ====================
// Description: Primary portal component managing authentication, state, data fetching,
// and rendering of the main student interface. Handles login/logout flows, session management,
// and coordinates all sub-components.
export default function ModernStudentPortalPage() {
  // Authentication State - Description: Manages user login status and session data
  const [student, setStudent] = useState(null);
  const [token, setToken] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(true);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState(null);
  const [requiresContact, setRequiresContact] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // View State - Description: Controls which section of the portal is currently displayed
  const [currentView, setCurrentView] = useState('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const router = useRouter();

  // Data State - Description: Stores fetched data from various API endpoints
  const [assignments, setAssignments] = useState([]);
  const [resources, setResources] = useState([]);
  const [studentResults, setStudentResults] = useState([]);
  const [feeBalance, setFeeBalance] = useState(null);
  
  // Loading States - Description: Tracks loading status for each data fetch operation
  const [assignmentsLoading, setAssignmentsLoading] = useState(false);
  const [resourcesLoading, setResourcesLoading] = useState(false);
  const [resultsLoading, setResultsLoading] = useState(false);
  const [feeLoading, setFeeLoading] = useState(false);

  // Error States - Description: Stores error messages for failed data operations
  const [assignmentsError, setAssignmentsError] = useState(null);
  const [resourcesError, setResourcesError] = useState(null);
  const [resultsError, setResultsError] = useState(null);
  const [feeError, setFeeError] = useState(null);

  // Description: Checks for existing authentication token on component mount
  // Verifies token validity with backend and restores user session if valid
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
          
          // Description: Sets up automatic logout after 2 hours for security
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

  // Description: Fetches all student data when authentication is successful
  useEffect(() => {
    if (student && token) {
      fetchAllData();
    }
  }, [student, token]);

  // Description: Handles responsive sidebar behavior on window resize and view changes
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

  // Description: Parallel data fetching function that loads all student-related information
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

  // Description: Fetches student assignments from the API
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

  // Description: Fetches learning resources from the API
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

  // Description: Fetches student's academic results using admission number
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

  // Description: Fetches student's fee balance and payment history
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

  // Description: Handles student login authentication with the backend
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

  // Description: Handles user logout, clears session, and resets application state
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

  // Description: Manually refreshes all portal data
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

  // Description: Handles file downloads from resources and assignments
  const handleDownload = (item) => {
    toast.success('Download Started', {
      description: `Downloading ${item.title || 'file'}...`
    });
  };

  // Description: Handles viewing detailed information for resources/assignments
  const handleViewDetails = (item) => {
    toast.info('Viewing Details', {
      description: `Opening details for ${item.title}`
    });
  };

  // Description: Toggles mobile sidebar menu visibility
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Description: Closes mobile menu after navigation on small screens
  const closeMenuOnMobile = () => {
    if (window.innerWidth < 1024) {
      setIsMenuOpen(false);
    }
  };

  // Description: Changes the current view and handles mobile menu closure
  const handleViewChange = (view) => {
    setCurrentView(view);
    closeMenuOnMobile();
  };

  // Description: Shows loading screen while initial authentication is in progress
  if (isLoading) {
    return <LoadingScreen />;
  }

  // Description: Renders login interface for unauthenticated users
  if (!student || !token) {
    const features = [
      { 
        icon: <FaBook className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600" />, 
        title: "Digital Learning Resources", 
        desc: "Access comprehensive digital notes, revision e-books, past examination papers, and supplementary learning materials to enhance your understanding of various subjects." 
      },
      { 
        icon: <FaAward className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600" />, 
        title: "Assignments & Projects", 
        desc: "View and submit your subject-specific tasks, holiday assignments, and academic projects. Track submission deadlines and receive feedback from teachers." 
      },
      { 
        icon: <FaChartBar className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600" />, 
        title: "Performance Analytics", 
        desc: "Access personalized performance reports comparing your results with class averages and KCSE targets. Identify strengths and areas needing improvement." 
      },
      { 
        icon: <FaDollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600" />, 
        title: "Fee Management System", 
        desc: "Check current fee balance, download detailed statements, view payment history, and access fee structures and payment deadlines." 
      },
      { 
        icon: <FaCalendar className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600" />, 
        title: "School Calendar", 
        desc: "Stay updated with academic term dates, examination schedules, sports fixtures, co-curricular activities, and parent-teacher meeting dates." 
      },
      { 
        icon: <FaComments className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600" />, 
        title: "Communication Hub", 
        desc: "Receive important announcements from the administration, school news updates, and notifications about upcoming events and deadlines." 
      }
    ];

    return (
      <div className="min-h-screen bg-gradient-to-br from-maroon-50 via-amber-50 to-white font-sans overflow-x-hidden">
        <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.03]" 
             style={{ backgroundImage: 'radial-gradient(#800020 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        
        <Toaster position="top-right" expand={true} richColors theme="light" />
        
        <main className="relative z-10 flex flex-col min-h-screen">
          {/* Navigation Bar - Description: Top navigation for unauthenticated users */}
          <nav className="sticky top-0 z-50 bg-gradient-to-r from-maroon-900 via-maroon-800 to-amber-800 backdrop-blur-lg border-b border-amber-600/30 px-3 py-2.5 sm:px-4 sm:py-3 md:px-6 md:py-4 lg:px-12">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
              <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3">
                <div className="relative">
                  <div className="absolute inset-0 bg-amber-500/30 rounded-md blur-sm"></div>
                  <Image
                    src="/kinyui.png"
                    alt="Kinyui Boys Senior School Logo"
                    width={32}
                    height={32}
                    className="rounded-md w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 relative"
                    priority
                  />
                </div>
                <div>
                  <span className="text-sm xs:text-base sm:text-lg md:text-xl font-black tracking-tighter block leading-none text-white">
                    KINYUI BOYS'
                  </span>
                  <span className="text-[7px] xs:text-[8px] sm:text-[9px] md:text-[10px] font-bold text-amber-300 
                    tracking-[0.1em] xs:tracking-[0.15em] sm:tracking-[0.2em] uppercase">
                    Student Portal
                  </span>
                </div>
              </div>

              <div className="hidden md:flex items-center gap-4 lg:gap-6 xl:gap-8">
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white/10 rounded-full border border-amber-500/30">
                  <div className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse" />
                  <span className="text-[10px] font-black text-amber-200 uppercase tracking-wider">Secure Access</span>
                  <FaShieldAlt className="w-3 h-3 text-amber-400" />
                </div>
                <button className="text-sm font-bold text-amber-200 hover:text-white transition-colors">Support Center</button>
              </div>

              <button onClick={router.back} className="md:hidden flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-lg 
                bg-white/10 hover:bg-white/20 transition-colors active:scale-95">
                <FaBars className="w-4 h-4 sm:w-5 sm:h-5 text-amber-300" />
              </button>
            </div>
          </nav>

          {/* Hero Section - Description: Landing page content with login button */}
          <section className="px-3 xs:px-4 sm:px-6 md:px-8 lg:px-12 py-6 sm:py-8 md:py-12 lg:py-20 max-w-7xl mx-auto w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 xs:gap-8 sm:gap-10 md:gap-12 lg:gap-16 items-center">
              <div className="space-y-4 xs:space-y-5 sm:space-y-6 md:space-y-8">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-maroon-100 rounded-lg border border-amber-200 
                  text-[8px] xs:text-[9px] sm:text-[10px] font-bold tracking-widest uppercase text-maroon-700 whitespace-nowrap">
                  <HiSparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-amber-600" />
                  Excellence in Education Since 1976
                </div>
                <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 
                  font-black tracking-tighter leading-[0.85] xs:leading-[0.9] text-maroon-950">
                  EDUCATION  
                  <span className="block text-amber-600 italic mt-1 xs:mt-2">IS LIGHT.</span>
                </h1>
                <p className="text-sm xs:text-base sm:text-lg md:text-xl text-maroon-600 font-medium 
                  max-w-full xs:max-w-xs sm:max-w-md leading-relaxed xs:leading-snug">
                  Welcome to the Kinyui Boys' Senior School Digital Student Portal. Your centralized platform for academic resources, financial management, and school communication.
                </p>
                
                <div className="flex flex-row items-center gap-2 sm:gap-4 w-full max-w-full">
                  <button
                    onClick={() => setShowLoginModal(true)}
                    className="flex-[2] sm:flex-none flex items-center justify-center gap-1.5 sm:gap-3 px-3 sm:px-8 py-2.5 sm:py-4 bg-maroon-800 text-white rounded-xl sm:rounded-2xl font-black sm:font-bold text-[10px] sm:text-base uppercase sm:capitalize tracking-wider sm:tracking-normal hover:bg-amber-700 transition-all duration-300 active:scale-95 shadow-md sm:shadow-xl group"
                  >
                    <span>Access Your Portal</span>
                    <FaArrowRight className="w-3 h-3 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                  
                  <button
                    onClick={() => router.push("/pages/contact")}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 sm:px-7 py-2.5 sm:py-4 bg-white border border-amber-300 text-maroon-700 rounded-xl sm:rounded-2xl font-black sm:font-bold text-[10px] sm:text-base uppercase sm:capitalize tracking-wider sm:tracking-normal hover:bg-amber-50 transition-all active:scale-95"
                  >
                    Get Help
                  </button>
                </div>
              </div>

              {/* Features Preview - Description: Shows key portal features to visitors */}
              <div className="relative group mt-4 xs:mt-6 sm:mt-0">
                <div className="absolute -inset-2 xs:-inset-3 sm:-inset-4 bg-amber-100/40 rounded-[2rem] xs:rounded-[2.5rem] blur-xl xs:blur-2xl sm:blur-3xl opacity-40 group-hover:opacity-60 transition-opacity duration-300" />
                <div className="relative bg-white border border-amber-200 shadow-lg xs:shadow-xl rounded-[1.5rem] xs:rounded-[2rem] sm:rounded-[2.5rem] p-4 xs:p-5 sm:p-6 md:p-8 space-y-4 xs:space-y-5 sm:space-y-6">
                  <div className="flex items-center justify-between border-b border-amber-100 pb-3 xs:pb-4">
                    <h3 className="font-black text-xs xs:text-sm uppercase tracking-widest text-maroon-400 whitespace-nowrap">
                      Portal Features
                    </h3>
                    <FaBrain className="w-4 h-4 xs:w-5 xs:h-5 text-amber-500" />
                  </div>
                  <div className="space-y-3 xs:space-y-4">
                    <div className="p-3 xs:p-4 bg-gradient-to-r from-maroon-50 to-amber-50 rounded-xl xs:rounded-2xl border border-amber-100">
                      <p className="text-[10px] xs:text-xs font-bold text-maroon-700 mb-0.5 xs:mb-1">Digital Library</p>
                      <p className="text-xs xs:text-sm font-semibold text-maroon-800 leading-tight">
                        Access e-books, revision materials, and past papers.
                      </p>
                    </div>
                    <div className="p-3 xs:p-4 bg-gradient-to-r from-amber-50 to-maroon-50 rounded-xl xs:rounded-2xl border border-amber-100">
                      <p className="text-[10px] xs:text-xs font-bold text-maroon-700 mb-0.5 xs:mb-1">Performance Dashboard</p>
                      <p className="text-xs xs:text-sm font-semibold text-maroon-800 leading-tight">
                        Track your academic progress and KCSE preparedness.
                      </p>
                    </div>
                    <div className="p-3 xs:p-4 bg-gradient-to-r from-maroon-50 to-amber-50 rounded-xl xs:rounded-2xl border border-amber-100">
                      <p className="text-[10px] xs:text-xs font-bold text-maroon-700 mb-0.5 xs:mb-1">Financial Dashboard</p>
                      <p className="text-xs xs:text-sm font-semibold text-maroon-800 leading-tight">
                        View balances, statements, and payment records.
                      </p>
                    </div>
                  </div>
                  <button className="w-full py-2.5 xs:py-3 text-center text-[10px] xs:text-xs font-black uppercase tracking-widest text-maroon-400 hover:text-amber-600 transition-colors duration-300">
                    Explore All Features
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Feature Grid - Description: Detailed feature showcase for visitors */}
          <section className="bg-gradient-to-r from-maroon-50 to-amber-50 border-y border-amber-200 py-8 xs:py-12 sm:py-16 md:py-20 px-3 xs:px-4 sm:px-6 md:px-8 lg:px-12">
            <div className="max-w-7xl mx-auto">
              <div className="mb-6 xs:mb-8 sm:mb-10 md:mb-12 px-2">
                <h2 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-black tracking-tight mb-1 xs:mb-2 text-maroon-900">
                  Complete Portal Modules
                </h2>
                <p className="text-maroon-600 font-medium text-sm xs:text-base">
                  Everything you need to excel in your academic journey at Kinyui Boys'.
                </p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 xs:gap-4 sm:gap-5 md:gap-6 px-2">
                {features.map((feature, i) => (
                  <div key={i} className="group p-4 xs:p-5 sm:p-6 md:p-8 bg-white border border-amber-200 rounded-[1.5rem] xs:rounded-[1.75rem] sm:rounded-[2rem] hover:shadow-xl hover:shadow-amber-200/30 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300">
                    <div className="w-8 h-8 xs:w-9 xs:h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gradient-to-r from-maroon-100 to-amber-100 rounded-lg xs:rounded-xl sm:rounded-2xl flex items-center justify-center mb-3 xs:mb-4 sm:mb-6 group-hover:scale-105 transition-transform duration-300">
                      {feature.icon}
                    </div>
                    <h3 className="text-base xs:text-lg sm:text-xl md:text-2xl font-bold text-maroon-900 mb-1.5 xs:mb-2 sm:mb-3 leading-tight">
                      {feature.title}
                    </h3>
                    <p className="text-maroon-600 text-xs xs:text-sm leading-relaxed mb-3 xs:mb-4 sm:mb-6 line-clamp-2 xs:line-clamp-3">
                      {feature.desc}
                    </p>
                    <div className="flex items-center gap-1.5 xs:gap-2 text-[10px] xs:text-xs font-black uppercase tracking-widest text-maroon-400 group-hover:text-amber-600 transition-colors duration-300 cursor-pointer">
                      Login to Access 
                      <FaArrowRight className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Footer - Description: Copyright and policy links */}
          <footer className="px-3 xs:px-4 sm:px-6 md:px-8 lg:px-12 py-6 xs:py-8 sm:py-10 md:py-12 bg-gradient-to-r from-maroon-900 to-amber-900">
            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-center gap-6 xs:gap-8 sm:gap-10 md:gap-12">
              <div className="flex flex-col items-center lg:items-start gap-3 xs:gap-4 text-center lg:text-left">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 bg-white/10 rounded-lg flex items-center justify-center">
                    <FaSchool className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4 text-amber-400" />
                  </div>
                  <span className="text-sm xs:text-base font-bold tracking-tight text-white">Kinyui Boys' Senior School</span>
                </div>
                <p className="text-[9px] xs:text-[10px] font-bold text-amber-300 uppercase tracking-widest">
                  © {new Date().getFullYear()} Kinyui Boys' Senior School. All Rights Reserved.
                </p>
              </div>
              
              <div className="flex flex-wrap justify-center gap-4 xs:gap-6 sm:gap-8 md:gap-10">
                <div className="space-y-1 xs:space-y-2 text-center">
                  <p className="text-[9px] xs:text-[10px] font-black text-amber-300 uppercase tracking-widest">
                    Academics
                  </p>
                  <p className="text-xs font-bold text-white hover:text-amber-300 cursor-pointer transition-colors duration-300">
                    KNEC Portal
                  </p>
                </div>
                <div className="space-y-1 xs:space-y-2 text-center">
                  <p className="text-[9px] xs:text-[10px] font-black text-amber-300 uppercase tracking-widest">
                    Finance
                  </p>
                  <p className="text-xs font-bold text-white hover:text-amber-300 cursor-pointer transition-colors duration-300">
                    Payment Options
                  </p>
                </div>
                <div className="space-y-1 xs:space-y-2 text-center">
                  <p className="text-[9px] xs:text-[10px] font-black text-amber-300 uppercase tracking-widest">
                    Support
                  </p>
                  <p className="text-xs font-bold text-white hover:text-amber-300 cursor-pointer transition-colors duration-300">
                    IT Help Desk
                  </p>
                </div>
              </div>
            </div>
          </footer>
        </main>

        {/* Login Modal - Description: Authentication dialog for student access */}
        <StudentLoginModal
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
          onLogin={handleStudentLogin}
          isLoading={loginLoading}
          error={loginError}
          requiresContact={requiresContact}
        />
      </div>
    );
  }

  // Description: Renders the main authenticated portal interface
  return (
    <div className="min-h-screen bg-gradient-to-br from-maroon-50 via-amber-50 to-white">
      <Toaster position="top-right" expand={true} richColors theme="light" />
      
      {/* Login Modal - Description: Shown when session expires or user logs out */}
      <StudentLoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLogin={handleStudentLogin}
        isLoading={loginLoading}
        error={loginError}
        requiresContact={requiresContact}
      />

      {/* Mobile Menu Overlay - Description: Dark background when sidebar is open on mobile */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-maroon-950/70 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300 animate-fadeIn"
          onClick={toggleMenu}
        />
      )}

      {/* Main Layout Container - Description: Flex layout with sidebar and content area */}
      <div className="flex">
        {/* Navigation Sidebar - Description: Persistent navigation menu */}
        <div className={`
          ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
          fixed lg:sticky lg:top-0
          h-screen z-50 transition-transform duration-300 ease-in-out
          flex-shrink-0
          w-[85vw] sm:w-4/5 md:w-3/5 lg:w-72 xl:w-80
          shadow-2xl mobile-scroll-hide
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

        {/* Main Content Area - Description: Dynamic content based on selected view */}
        <div className="flex-1 flex flex-col min-h-screen w-full lg:w-[calc(100%-18rem)] xl:w-[calc(100%-20rem)] transition-all duration-300">
          {/* Header - Description: Top bar with student info and controls */}
          <ModernStudentHeader
            student={student}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            onRefresh={handleRefresh}
            onMenuToggle={toggleMenu}
            isMenuOpen={isMenuOpen}
            currentView={currentView}
          />

          {/* Dynamic Content Area - Description: Renders different components based on navigation */}
          <main className="flex-1 overflow-y-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8 container mx-auto max-w-7xl mobile-scroll-hide sm:overflow-y-auto">
            {currentView === 'home' && (
              <ModernHomeView
                student={student}
                feeBalance={feeBalance}
                feeLoading={feeLoading}
                token={token}
              />
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

            {currentView === 'guidance' && (
              <GuidanceEventsView />
            )}

            {currentView === 'fees' && (
              <FeesView
                student={student}
                token={token}
              />
            )}
          </main>

          {/* Footer - Description: Copyright and policy information */}
          <footer className="border-t border-amber-200 bg-gradient-to-r from-maroon-900 via-maroon-800 to-amber-800 py-4 sm:py-6 md:py-8">
            <div className="container mx-auto px-3 sm:px-4 md:px-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6">
                <div className="text-center md:text-left">
                  <p className="text-amber-100 text-sm font-bold">
                    © {new Date().getFullYear()} Kinyui Boys' Senior School
                  </p>
                  <p className="text-amber-300 text-xs mt-1 sm:mt-2">
                    Digital Student Portal • Empowering Excellence Through Technology
                  </p>
                  <div className="flex items-center gap-2 sm:gap-3 mt-2 sm:mt-3">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gradient-to-r from-amber-400 to-amber-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-amber-300">Secure Session Active</span>
                  </div>
                </div>
                <div className="flex items-center justify-center gap-4 sm:gap-6 flex-wrap">
                  <button
                    onClick={() => router.push('/pages/OurSchoolPolicies')}
                    className="text-amber-200 hover:text-white text-xs sm:text-sm font-medium transition-colors mobile-touch-friendly"
                  >
                    Privacy Policy
                  </button>

                  <button
                    onClick={() => router.push('/pages/OurSchoolPolicies')}
                    className="text-amber-200 hover:text-white text-xs sm:text-sm font-medium transition-colors mobile-touch-friendly"
                  >
                    Terms of Service
                  </button>

                  <button
                    onClick={() => router.push('/pages/OurSchoolPolicies')}
                    className="text-amber-200 hover:text-white text-xs sm:text-sm font-medium transition-colors mobile-touch-friendly"
                  >
                    Help Center
                  </button>

                  <button
                    onClick={() => router.push('/pages/OurSchoolPolicies')}
                    className="text-amber-200 hover:text-white transition-colors mobile-touch-friendly"
                    aria-label="Language & Accessibility"
                  >
                    <FaGlobe className="w-3 h-3 sm:w-4 sm:h-4" />
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