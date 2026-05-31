'use client';
import { useState, useEffect } from 'react';
import { 
  FiHome, 
  FiUsers, 
  FiBook, 
  FiCalendar,
  FiFileText,
  FiLogOut,
  FiMenu,
  FiUser,
  FiMail,
  FiDollarSign,
  FiUserPlus,
  FiImage,
  FiShield,
  FiMessageCircle,
  FiInfo,
  FiTrendingUp,
  FiAward,
  FiClipboard,
  FiMonitor,
  FiSmartphone,
  FiArrowLeft,
  FiArchive,
  FiMessageSquare,
} from 'react-icons/fi';
import { 
  IoStatsChart,
  IoPeopleCircle,
  IoNewspaper,
  IoSparkles,
  IoSchoolOutline,
} from 'react-icons/io5';
import { useRouter } from 'next/navigation';
import { Toaster, toast } from 'sonner'; // Changed to sonner

// Import components
import AdminSidebar from '../components/sidebar/page';
import DashboardOverview from '../components/dashbaord/page';
import AssignmentsManager from '../components/AssignmentsManager/page';
import NewsEventsManager from '../components/eventsandnews/page';
import StaffManager from '../components/staff/page';
import SubscriberManager from '../components/subscriber/page';
import EmailManager from '../components/email/page';
import GalleryManager from '../components/gallery/page';
import AdminManager from '../components/adminsandprofile/page';
import GuidanceCounselingTab from '../components/guidance/page';
import SchoolInfoTab from '../components/schoolinfo/page';
import ApplicationsManager from '../components/applications/page';
import Resources from '../components/resources/page';
import Careers from "../components/career/page";
import Student from "../components/student/page";
import Fees from "../components/fees/page";
import SchoolDocs from "../components/schooldocuments/page";
import SMSManager from "../components/sms/page";
import AchievementsManager from "../components/Achievements/page";
import SchoolHubManager from "../components/schoolhub/page";


export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileWarning, setShowMobileWarning] = useState(false);
  const [realStats, setRealStats] = useState({
    totalStaff: 0,
    totalSubscribers: 0,
    upcomingEvents: 0,
    totalNews: 0,
    activeAssignments: 0,
    galleryItems: 0,
    guidanceSessions: 0,
    totalApplications: 0,
    pendingApplications: 0,
    Resources: 0,
    Careers: 0,
    totalStudent: 0,

    totalFees: 0,
  });

  const router = useRouter();

  // Check screen size on mount and resize
  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      
      if (mobile) {
        setShowMobileWarning(true);
        setSidebarOpen(false);
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Generate device fingerprint
  const generateDeviceFingerprint = () => {
    const fingerprint = {
      userAgent: navigator.userAgent,
      screen: {
        width: screen.width,
        height: screen.height,
        colorDepth: screen.colorDepth,
        pixelRatio: window.devicePixelRatio
      },
      language: navigator.language || navigator.userLanguage,
      platform: navigator.platform,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      languages: navigator.languages
    };

    return {
      raw: fingerprint,
      hash: hashFingerprint(fingerprint)
    };
  };

  // Hash fingerprint
  const hashFingerprint = (fingerprint) => {
    const str = JSON.stringify(fingerprint);
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(36);
  };

  // Device Token Validation Functions
  class DeviceTokenManager {
    static KEYS = {
      DEVICE_TOKEN: 'device_token',
      DEVICE_FINGERPRINT: 'device_fingerprint',
      LOGIN_COUNT: 'login_count',
      LAST_LOGIN: 'last_login'
    };

    // Validate both admin token and device token
    static validateTokens() {
      try {
        // Check admin token
        const adminToken = localStorage.getItem('admin_token');
        if (!adminToken) {
          console.log('❌ Admin token not found');
          return { valid: false, reason: 'no_admin_token' };
        }

        // Check device token
        const deviceToken = localStorage.getItem(this.KEYS.DEVICE_TOKEN);
        if (!deviceToken) {
          console.log('❌ Device token not found');
          return { valid: false, reason: 'no_device_token' };
        }

        // Validate admin token format
        const adminParts = adminToken.split('.');
        if (adminParts.length !== 3) {
          console.log('❌ Invalid admin token format');
          return { valid: false, reason: 'invalid_admin_token_format' };
        }

        // Validate device token
        const deviceValid = this.validateDeviceToken(deviceToken);
        if (!deviceValid.valid) {
          console.log('❌ Device token invalid:', deviceValid.reason);
          return { 
            valid: false, 
            reason: `device_${deviceValid.reason}`,
            details: deviceValid 
          };
        }

        // Generate current device fingerprint
        const currentFingerprint = generateDeviceFingerprint();
        const storedFingerprint = localStorage.getItem(this.KEYS.DEVICE_FINGERPRINT);
        
        if (storedFingerprint !== currentFingerprint.hash) {
          console.log('❌ Device fingerprint mismatch');
          return { valid: false, reason: 'device_fingerprint_mismatch' };
        }

        const loginCount = parseInt(localStorage.getItem(this.KEYS.LOGIN_COUNT) || '0');
        if (loginCount >= 50) {
          console.log('⚠️ High login count detected:', loginCount);
        }

        console.log('✅ Both tokens are valid');
        return { 
          valid: true, 
          adminToken: adminToken,
          deviceToken: deviceToken,
          loginCount: loginCount,
          deviceInfo: deviceValid.payload
        };

      } catch (error) {
        console.error('❌ Token validation error:', error);
        return { valid: false, reason: 'validation_error', error: error.message };
      }
    }

    // Validate device token
    static validateDeviceToken(token) {
      try {
        const payloadStr = decodeURIComponent(escape(atob(token)));
        const payload = JSON.parse(payloadStr);
        
        if (payload.exp * 1000 <= Date.now()) {
          return { valid: false, reason: 'expired', payload };
        }
        
        const createdAt = new Date(payload.createdAt || payload.iat * 1000);
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        
        if (createdAt < thirtyDaysAgo) {
          return { valid: false, reason: 'age_expired', payload };
        }
        
        return { valid: true, payload };
      } catch (error) {
        return { valid: false, reason: 'invalid_format', error: error.message };
      }
    }

    // Clear all tokens
    static clearAllTokens() {
      try {
        const adminKeys = ['admin_token', 'admin_user'];
        adminKeys.forEach(key => localStorage.removeItem(key));
        
        Object.values(this.KEYS).forEach(key => localStorage.removeItem(key));
        
        console.log('✅ All tokens cleared');
        return true;
      } catch (error) {
        console.error('❌ Error clearing tokens:', error);
        return false;
      }
    }
  }

  // Mobile Warning Modal Component
  const MobileWarningModal = () => (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-lg z-[100] flex items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl border border-gray-700 shadow-2xl overflow-hidden animate-scale-in">
        <div className="p-6 sm:p-8 border-b border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">


              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                <FiSmartphone className="text-xl text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Mobile Access Detected</h3>
                <p className="text-gray-400 text-sm">Limited Space</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-blue-900/30 rounded-xl border border-blue-800/50">
            <FiMonitor className="text-blue-400 text-lg" />
            <p className="text-blue-300 text-sm">
              <span className="font-semibold">Recommendation:</span> Use a desktop for the best experience
            </p>
          </div>
        </div>
        
        <div className="p-6 sm:p-8">
          <div className="space-y-4 mb-6">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <FiSmartphone className="text-red-400 text-xs" />
              </div>
              <div>
                <h4 className="text-white font-semibold mb-1">Limited Features</h4>
                <p className="text-gray-400 text-sm">
                  Some admin features are optimized for desktop and may not work properly on mobile.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <FiMonitor className="text-green-400 text-xs" />
              </div>
              <div>
                <h4 className="text-white font-semibold mb-1">Desktop Recommended</h4>
                <p className="text-gray-400 text-sm">
                  For full functionality, data management, and better navigation.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-yellow-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <IoSparkles className="text-yellow-400 text-xs" />
              </div>
              <div>
                <h4 className="text-white font-semibold mb-1">Go Back</h4>
                <p className="text-gray-400 text-sm">
                  Return to the previous page to review or change your settings and Navigate it with the Desktop or Laptop.
                </p>
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-gray-800/50 rounded-xl border border-gray-700 mb-6">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-gray-400 text-xs mb-1">Screen Width</p>
                <p className="text-white font-bold">{window.innerWidth}px</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs mb-1">Device Type</p>
                <p className="text-white font-bold">Mobile Phone</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-6 bg-gray-900/50 border-t border-gray-800 space-y-4">
          <div className="flex justify-center">
            <button
              onClick={() => router.back()}
              className="group flex items-center gap-2 px-6 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white rounded-full border border-gray-700 transition-all  shadow-lg"
            >
              <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm font-bold">Go Back</span>
            </button>
          </div>

          <p className="text-gray-500 text-[10px] sm:text-xs text-center max-w-xs mx-auto leading-relaxed">
            For optimal experience, use a device with screen width greater than 768px
          </p>
        </div>
      </div>
    </div>
  );

  // Loading Screen
// Modern Loading Screen Component for Kinyui Boys' Senior School
const ModernLoadingScreen = () => {
  const [textIndex, setTextIndex] = useState(0);
  const [glowIntensity, setGlowIntensity] = useState(0);
  const [progress, setProgress] = useState(0);
  
  const motto = "Soaring to Excellence";
  const schoolName = "KINYUI BOYS' SENIOR SCHOOL";
  const loadingMessages = [
    "Preparing an exceptional learning experience",
    "Loading Admin Dashboard",
    "Securing your session",
    "Almost ready..."
  ];

  // Animated text effect
  useEffect(() => {
    const interval = setInterval(() => {
      setTextIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Pulsing glow effect
  useEffect(() => {
    const glowInterval = setInterval(() => {
      setGlowIntensity((prev) => (prev + 1) % 100);
    }, 50);
    return () => clearInterval(glowInterval);
  }, []);

  // Progress animation
  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 2;
      });
    }, 80);
    return () => clearInterval(progressInterval);
  }, []);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-orange-50 via-white to-amber-50 z-50 flex items-center justify-center overflow-hidden">
      
      {/* Dynamic Background Effect */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Animated Gradient Orbs - Kinyui Colors */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-orange-700/10 to-amber-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-orange-900/10 to-rose-700/10 rounded-full blur-3xl animate-pulse-slow animation-delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-orange-600/5 to-amber-500/5 rounded-full blur-3xl animate-spin-slow"></div>
        
        {/* Moving Light Beams - Professional Style */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-orange-700 to-transparent animate-beam"></div>
          <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-amber-600 to-transparent animate-beam animation-delay-500"></div>
          <div className="absolute left-0 top-0 w-px h-full bg-gradient-to-b from-transparent via-orange-800 to-transparent animate-beam-vertical"></div>
          <div className="absolute right-0 top-0 w-px h-full bg-gradient-to-b from-transparent via-rose-800 to-transparent animate-beam-vertical animation-delay-300"></div>
        </div>

        {/* Subtle Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
        
        {/* Floating Particles */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-orange-700/30 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.2}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-2xl px-6">
        
        {/* Logo Container - Enhanced */}
        <div className="relative mb-8 md:mb-10">
          {/* Glowing Background - School Colors */}
          <div 
            className="absolute inset-0 bg-gradient-to-r from-orange-800 via-amber-600 to-orange-900 rounded-full blur-2xl transition-all duration-300"
            style={{ 
              opacity: 0.2 + (glowIntensity / 100) * 0.3,
              transform: `scale(${1 + (glowIntensity / 100) * 0.1})`
            }}
          ></div>
          
          {/* Outer Ring Animation */}
          <div className="absolute inset-0 rounded-full border-2 border-orange-700/30 animate-ping-slow"></div>
          <div className="absolute inset-2 rounded-full border-2 border-amber-600/20 animate-spin-slow"></div>
          
          {/* Logo Container */}
          <div className="relative w-28 h-28 md:w-36 md:h-36 rounded-full bg-gradient-to-br from-orange-900 to-amber-800 p-1 shadow-2xl">
            <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-transparent to-white/10 pointer-events-none"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
              
              <img 
                src="/SchoolLogo.png" 
                alt="Kinyui Boys Senior School Logo" 
                className="w-20 h-20 md:w-28 md:h-28 object-contain p-2 relative z-10"
              />
            </div>
          </div>
        </div>

        {/* School Name - Kinyui Branding */}
        <div className="text-center mb-5 md:mb-6">
          <h1 className="text-2xl md:text-3xl lg:text-3xl font-black tracking-wider text-gray-800">
            {schoolName.split("'").map((part, i) => (
              <span key={i}>
                {part}
                {i === 0 && "'"}
              </span>
            ))}
          </h1>
          
          {/* Animated Gradient Underline */}
          <div className="relative mt-2">
            <div className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-orange-700 to-transparent animate-underline"></div>
          </div>
          
          <p className="text-gray-600 text-xs md:text-sm mt-3 tracking-wider font-semibold">
            EST. 1965 | CENTRE OF EXCELLENCE
          </p>
        </div>

        {/* Motto - School Motto */}
        <div className="text-center mb-8 md:mb-10">
          <p className="text-md md:text-xl lg:text-2xl font-bold italic tracking-wide text-gray-700">
            "{motto}"
          </p>
        </div>

        {/* Loading Indicators - Professional */}
        <div className="flex flex-col items-center gap-4 w-full max-w-md">
          
          {/* Progress Bar - Modern */}
          <div className="w-full">
            <div className="relative h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-orange-800 via-amber-600 to-orange-900 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
              </div>
            </div>
            <p className="text-right text-xs text-gray-500 mt-1 font-mono">
              {progress}%
            </p>
          </div>

          {/* Loading Message */}
          <div className="flex items-center gap-2 text-gray-600 text-sm md:text-base font-medium">
            <span>{loadingMessages[textIndex]}</span>
            <span className="flex gap-0.5">
              <span className="animate-bounce-dot" style={{ animationDelay: '0s' }}>.</span>
              <span className="animate-bounce-dot" style={{ animationDelay: '0.2s' }}>.</span>
              <span className="animate-bounce-dot" style={{ animationDelay: '0.4s' }}>.</span>
            </span>
          </div>

          {/* Loading Spinner Ring */}
          <div className="relative w-8 h-8 md:w-10 md:h-10 mt-2">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="50%"
                cy="50%"
                r="45%"
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="2"
                className="opacity-50"
              />
              <circle
                cx="50%"
                cy="50%"
                r="45%"
                fill="none"
                stroke="url(#gradient)"
                strokeWidth="2"
                strokeLinecap="round"
                className="animate-progress-ring"
                style={{
                  strokeDasharray: 283,
                  strokeDashoffset: `calc(283 - (283 * ${(Date.now() % 3000) / 3000}))`
                }}
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#2563eb" />
                  <stop offset="50%" stopColor="#06b6d4" />
                  <stop offset="100%" stopColor="#4f46e5" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        {/* Decorative Bottom Bar - School Colors */}
        <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="w-1 h-1 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 animate-pulse"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>

      {/* Custom Animations */}
      <style jsx global>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.1); }
        }
        
        @keyframes beam {
          0% { transform: translateX(-100%); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateX(100%); opacity: 0; }
        }
        
        @keyframes beam-vertical {
          0% { transform: translateY(-100%); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(100%); opacity: 0; }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) translateX(0px); opacity: 0; }
          25% { transform: translateY(-20px) translateX(10px); opacity: 0.5; }
          50% { transform: translateY(-40px) translateX(-10px); opacity: 0.3; }
          75% { transform: translateY(-20px) translateX(5px); opacity: 0.2; }
        }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        @keyframes underline {
          0% { width: 0%; opacity: 0; left: 50%; }
          50% { width: 100%; opacity: 1; left: 0%; }
          100% { width: 0%; opacity: 0; left: 50%; }
        }
        
        @keyframes progress-ring {
          0% { stroke-dashoffset: 283; }
          100% { stroke-dashoffset: 0; }
        }
        
        @keyframes bounce-dot {
          0%, 100% { transform: translateY(0); opacity: 0.5; }
          50% { transform: translateY(-4px); opacity: 1; }
        }
        
        @keyframes ping-slow {
          0% { transform: scale(1); opacity: 0.3; }
          50% { transform: scale(1.1); opacity: 0.1; }
          100% { transform: scale(1); opacity: 0.3; }
        }
        
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
        
        .animate-ping-slow {
          animation: ping-slow 2s ease-in-out infinite;
        }
        
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
        
        .animation-delay-1000 {
          animation-delay: 1s;
        }
        
        .animation-delay-300 {
          animation-delay: 0.3s;
        }
        
        .animation-delay-500 {
          animation-delay: 0.5s;
        }
        
        .animate-beam {
          animation: beam 3s ease-in-out infinite;
        }
        
        .animate-beam-vertical {
          animation: beam-vertical 3s ease-in-out infinite;
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
        
        .animate-underline {
          animation: underline 2s ease-in-out infinite;
        }
        
        .animate-progress-ring {
          animation: progress-ring 2s linear infinite;
        }
        
        .animate-bounce-dot {
          animation: bounce-dot 0.6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

  // Fetch student count
  const fetchStudentCount = async () => {
    try {
      const response = await fetch('/api/studentupload?action=stats');
      if (!response.ok) {
        console.error('Failed to fetch student stats');
        return 0;
      }
      
      const data = await response.json();
      
      if (data.success) {
        if (data.data?.stats?.totalStudents) {
          return data.data.stats.totalStudents;
        } else if (data.stats?.totalStudents) {
          return data.stats.totalStudents;
        } else if (data.totalStudents) {
          return data.totalStudents;
        }
      }
      
      const allStudentsRes = await fetch('/api/studentupload');
      if (allStudentsRes.ok) {
        const allStudentsData = await allStudentsRes.json();
        if (allStudentsData.success) {
          const students = allStudentsData.data?.students || allStudentsData.students || [];
          return students.length;
        }
      }
      
      return 0;
    } catch (error) {
      console.error('Error fetching student count:', error);
      return 0;
    }
  };

  // Fetch real counts from all APIs
  const fetchRealCounts = async () => {
    try {
      const studentCount = await fetchStudentCount();
      
      const [
        staffRes,
        subscribersRes,
        eventsRes,
        newsRes,
        assignmentsRes,
        galleryRes,
        guidanceRes,
        admissionsRes,
        resourcesRes,
        careersRes,
        studentRes,
        feesRes,
        schooldocumentsRes,
        smsRes,
        achievementsRes
      ] = await Promise.allSettled([
        fetch('/api/staff'),
        fetch('/api/subscriber'),
        fetch('/api/events'),
        fetch('/api/news'),
        fetch('/api/assignment'),
        fetch('/api/gallery'),
        fetch('/api/guidance'),
        fetch('/api/sms'),
        fetch('/api/applyadmission'),
        fetch('/api/resources'),
        fetch('/api/career'),
        fetch('/api/studentupload'),
        fetch('/api/feebalances'),
        fetch('/api/schooldocuments'),
        fetch('/api/achievements')
      ]);

      const staff = staffRes.status === 'fulfilled' ? await staffRes.value.json() : { staff: [] };
      const subscribers = subscribersRes.status === 'fulfilled' ? await subscribersRes.value.json() : { subscribers: [] };
      const events = eventsRes.status === 'fulfilled' ? await eventsRes.value.json() : { events: [] };
      const news = newsRes.status === 'fulfilled' ? await newsRes.value.json() : { news: [] };
      const assignments = assignmentsRes.status === 'fulfilled' ? await assignmentsRes.value.json() : { assignments: [] };
      const gallery = galleryRes.status === 'fulfilled' ? await galleryRes.value.json() : { galleries: [] };
      const guidance = guidanceRes.status === 'fulfilled' ? await guidanceRes.value.json() : { events: [] };
      const admissions = admissionsRes.status === 'fulfilled' ? await admissionsRes.value.json() : { applications: [] };
      const resources = resourcesRes.status === 'fulfilled' ? await resourcesRes.value.json() : { resources: [] };
      const careers = careersRes.status === 'fulfilled' ? await careersRes.value.json() : { careers: [] };
      const student = studentRes.status === 'fulfilled' ? await studentRes.value.json() : { students: [] };
      const fees = feesRes.status === 'fulfilled' ? await feesRes.value.json() : { feebalances: [] };
      const schoolDocs = schooldocumentsRes.status === 'fulfilled' ? await schooldocumentsRes.value.json() : { documents: [] };
      const sms = smsRes.status === 'fulfilled' ? await smsRes.value.json() : { sms: [] };
      const achievements = achievementsRes.status === 'fulfilled' ? await achievementsRes.value.json() : { achievements: [] };
      
      const upcomingEvents = events.events?.filter(e => new Date(e.eventDate) >= new Date()).length || 0;
      const activeAssignments = assignments.assignments?.filter(a => a.status === 'assigned').length || 0;
      const admissionsData = admissions.applications || [];
      const pendingApps = admissionsData.filter(app => app.status === 'PENDING').length || 0;
      const achievementsCount = Array.isArray(achievements.allAchievements)
        ? achievements.allAchievements.length
        : Object.values(achievements.achievements || {}).flat().length;

      setRealStats({
        totalStaff: staff.staff?.length || 0,
        totalSubscribers: subscribers.subscribers?.length || 0,
        upcomingEvents,
        totalNews: news.news?.length || 0,
        activeAssignments,
        galleryItems: gallery.galleries?.length || 0,
        guidanceSessions: guidance.events?.length || 0,
        totalApplications: admissionsData.length || 0,
        pendingApplications: pendingApps,
        Resources: resources.resources?.length || 0,
        sms: sms.sms?.length || 0,
        Careers: careers.careers?.length || 0,
        totalStudent: student.students?.length || 0,
        totalFees: fees.feebalances?.length || 0,
        schooldocuments: schoolDocs.documents?.length || 0,
        achievements: achievementsCount
      });

    } catch (error) {
      console.error('Error fetching real counts:', error);
    }
  };

useEffect(() => {
  const initializeDashboard = async () => {
    setLoading(true);
    
    try {
      console.log('🔍 Starting dashboard initialization...');
      
      const possibleUserKeys = ['admin_user', 'user', 'currentUser', 'auth_user'];
      const possibleAdminTokenKeys = ['admin_token', 'token', 'auth_token', 'jwt_token'];
      const deviceTokenKeys = ['device_token', 'deviceToken'];
      const deviceFingerprintKeys = ['device_fingerprint', 'deviceFingerprint'];
      
      let userData = null;
      let adminToken = null;
      let deviceToken = null;
      let deviceFingerprint = null;
      
      // Find user data
      for (const key of possibleUserKeys) {
        const data = localStorage.getItem(key);
        if (data) {
          console.log(`✅ Found user data in key: ${key}`);
          userData = data;
          break;
        }
      }
      
      // Find admin token
      for (const key of possibleAdminTokenKeys) {
        const data = localStorage.getItem(key);
        if (data) {
          console.log(`✅ Found admin token in key: ${key}`);
          adminToken = data;
          break;
        }
      }
      
      // Find device token (optional for dashboard)
      for (const key of deviceTokenKeys) {
        const data = localStorage.getItem(key);
        if (data) {
          console.log(`✅ Found device token in key: ${key}`);
          deviceToken = data;
          break;
        }
      }
      
      // Find device fingerprint (optional for dashboard)
      for (const key of deviceFingerprintKeys) {
        const data = localStorage.getItem(key);
        if (data) {
          console.log(`✅ Found device fingerprint in key: ${key}`);
          deviceFingerprint = data;
          break;
        }
      }
      
      // ==============================================
      // 1. CHECK ADMIN TOKEN (PRIMARY - REQUIRED)
      // ==============================================
      if (!adminToken) {
        console.log('❌ No admin token found');
        toast.error('Authentication required. Please login again.');
        
        // Clear only authentication data
        possibleUserKeys.forEach(key => localStorage.removeItem(key));
        possibleAdminTokenKeys.forEach(key => localStorage.removeItem(key));
        window.location.href = '/pages/Sign In';
        return;
      }
      
      // Parse and validate admin token (12-hour expiry)
      let adminTokenPayload = null;
      try {
        const tokenParts = adminToken.split('.');
        if (tokenParts.length !== 3) {
          throw new Error('Invalid JWT format');
        }
        
        // Decode the payload (middle part of JWT)
        adminTokenPayload = JSON.parse(atob(tokenParts[1]));
        const currentTime = Math.floor(Date.now() / 1000);
        
        console.log('🔑 Admin token details:', {
          expiresAt: new Date(adminTokenPayload.exp * 1000).toLocaleString(),
          issuedAt: new Date(adminTokenPayload.iat * 1000).toLocaleString(),
          expiresInHours: ((adminTokenPayload.exp - currentTime) / 3600).toFixed(2),
          userRole: adminTokenPayload.role,
          userId: adminTokenPayload.userId
        });
        
        if (adminTokenPayload.exp < currentTime) {
          console.log('❌ Admin token expired');
          toast.error('Session expired. Please login again.');
          
          // Clear only authentication data
          possibleUserKeys.forEach(key => localStorage.removeItem(key));
          possibleAdminTokenKeys.forEach(key => localStorage.removeItem(key));
          window.location.href = '/pages/Sign In';
          return;
        }
        
        console.log('✅ Admin token is valid (12-hour expiry)');
      } catch (tokenError) {
        console.log('⚠️ Admin token validation error:', tokenError.message);
        toast.error('Invalid authentication. Please login again.');
        
        // Clear only authentication data
        possibleUserKeys.forEach(key => localStorage.removeItem(key));
        possibleAdminTokenKeys.forEach(key => localStorage.removeItem(key));
        window.location.href = '/pages/Sign In';
        return;
      }
      
      // ==============================================
      // 2. CHECK USER DATA (REQUIRED)
      // ==============================================
      if (!userData) {
        console.log('❌ No user data found in localStorage');
        toast.error('Please login to access the dashboard');
        window.location.href = '/pages/Sign In';
        return;
      }
      
      // Parse user data
      let user;
      try {
        user = JSON.parse(userData);
        console.log('📋 Parsed user data:', {
          name: user.name,
          email: user.email,
          role: user.role
        });
      } catch (parseError) {
        console.log('❌ Error parsing user data:', parseError);
        toast.error('Invalid user data. Please login again.');
        window.location.href = '/pages/Sign In';
        return;
      }
      
      // ==============================================
      // 3. VERIFY USER ROLE (REQUIRED)
      // ==============================================
      const userRole = user.role;
      const validRoles = ['ADMIN', 'SUPER_ADMIN', 'administrator', 'TEACHER', 'PRINCIPAL'];
      
      if (!userRole || !validRoles.includes(userRole.toUpperCase())) {
        console.log('❌ User does not have valid role:', userRole);
        toast.error('Unauthorized access. Please login with admin credentials.');
        
        possibleUserKeys.forEach(key => localStorage.removeItem(key));
        possibleAdminTokenKeys.forEach(key => localStorage.removeItem(key));
        window.location.href = '/pages/Sign In';
        return;
      }
      
      console.log('✅ User role verified:', userRole);
      
      // ==============================================
      // 4. CHECK DEVICE TOKEN (OPTIONAL - FOR INFO ONLY)
      // ==============================================
      // Device token is only for login verification, not required for dashboard access
      if (deviceToken) {
        try {
          // Decode device token (could be JWT or base64)
          let devicePayload;
          if (deviceToken.includes('.')) {
            // JWT format
            const deviceParts = deviceToken.split('.');
            if (deviceParts.length === 3) {
              devicePayload = JSON.parse(atob(deviceParts[1]));
            }
          } else {
            // Base64 format
            try {
              const decodedStr = atob(deviceToken);
              devicePayload = JSON.parse(decodedStr);
            } catch (e) {
              // Try URL-safe base64
              try {
                const urlSafeToken = deviceToken.replace(/-/g, '+').replace(/_/g, '/');
                const decodedStr = atob(urlSafeToken);
                devicePayload = JSON.parse(decodedStr);
              } catch (e2) {
                console.log('⚠️ Could not decode device token');
                devicePayload = null;
              }
            }
          }
          
          if (devicePayload) {
            console.log('📱 Device token info (optional):', {
              loginCount: devicePayload.loginCount,
              expiresAt: devicePayload.exp ? new Date(devicePayload.exp * 1000).toLocaleString() : 'N/A',
              valid: devicePayload.exp ? (devicePayload.exp * 1000 > Date.now()) : 'Unknown'
            });
          }
          
          // Check device fingerprint if available
          if (deviceFingerprint) {
            const currentFingerprint = generateDeviceFingerprint();
            if (deviceFingerprint !== currentFingerprint.hash) {
              console.log('⚠️ Device fingerprint changed - will be caught on next login');
              // Don't redirect - admin token is still valid
            } else {
              console.log('✅ Device fingerprint matches');
            }
          }
          
        } catch (deviceError) {
          console.log('⚠️ Device token check error (non-critical):', deviceError.message);
          // Continue - device token is not required for dashboard access
        }
      } else {
        console.log('ℹ️ No device token found - not required for dashboard access');
      }
      
      // ==============================================
      // 5. STORE DASHBOARD ACCESS TIMESTAMP
      // ==============================================
      localStorage.setItem('last_dashboard_access', new Date().toISOString());
      
      // ==============================================
      // 6. SUCCESS - SET USER STATE
      // ==============================================
      console.log('✅ User authenticated successfully:', user.name);
      console.log('✅ Admin token validated (12-hour expiry)');
      
      const loginCount = parseInt(localStorage.getItem('login_count') || '0');
      console.log('📱 Security audit:', {
        user: user.name,
        role: user.role,
        adminTokenExpiry: new Date(adminTokenPayload.exp * 1000).toLocaleString(),
        deviceLoginCount: loginCount,
        lastLogin: localStorage.getItem('last_login'),
        dashboardAccess: new Date().toISOString()
      });
      
      setUser(user);
      
      // ==============================================
      // 7. FETCH DASHBOARD STATISTICS
      // ==============================================
      console.log('📊 Fetching dashboard statistics...');
      await fetchRealCounts();
      
      toast.success(`Welcome back, ${user.name}!`);
      
    } catch (error) {
      console.error('❌ Error initializing dashboard:', error);
      toast.error('Failed to load dashboard. Please try again.');
      
      // Clear only authentication data on error
      const possibleUserKeys = ['admin_user', 'user', 'currentUser', 'auth_user'];
      const possibleAdminTokenKeys = ['admin_token', 'token', 'auth_token', 'jwt_token'];
      
      possibleUserKeys.forEach(key => localStorage.removeItem(key));
      possibleAdminTokenKeys.forEach(key => localStorage.removeItem(key));
      
      window.location.href = '/pages/Sign In';
      
    } finally {
      setLoading(false);
    }
  };

  initializeDashboard();
}, []);

  // Refresh counts when tab changes
  useEffect(() => {
    if (!loading) {
      fetchRealCounts();
    }
  }, [activeTab]);

const handleLogout = () => {
  toast.loading('Logging out...');
  
  setTimeout(() => {
    try {
      // Save device tokens before clearing session
      const deviceToken = localStorage.getItem('device_token') || 
                         localStorage.getItem('deviceToken');
      const deviceFingerprint = localStorage.getItem('device_fingerprint') || 
                               localStorage.getItem('deviceFingerprint');
      const loginCount = localStorage.getItem('login_count');
      
      // Clear only session data
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
      localStorage.removeItem('last_login');
      localStorage.removeItem('last_dashboard_access');
      
      // Restore device tokens (if they existed)
      if (deviceToken) {
        localStorage.setItem('device_token', deviceToken);
      }
      if (deviceFingerprint) {
        localStorage.setItem('device_fingerprint', deviceFingerprint);
      }
      if (loginCount) {
        localStorage.setItem('login_count', loginCount);
      }
      
      toast.success('Logged out. Your device is still recognized.');
      
      setTimeout(() => {
        window.location.href = '/pages/Sign In';
      }, 500);
      
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Logout failed. Please try again.');
    }
  }, 500);
};


  const renderContent = () => {
    if (loading) return null;

    switch (activeTab) {
      case 'overview':
        return <DashboardOverview />;
      case 'school-info':
        return <SchoolInfoTab />;
      case 'schooldocuments':
        return <SchoolDocs />;
      case 'schoolhub':
      case 'school-hub':
        return <SchoolHubManager />;
      case 'guidance-counseling':
        return <GuidanceCounselingTab />;
      case 'staff':
        return <StaffManager />;
      case 'assignments':
        return <AssignmentsManager />;
      case 'admissions':
        return <ApplicationsManager />;
      case 'resources':
        return <Resources />; 
      case 'newsevents':
        return <NewsEventsManager />;
      case 'gallery':
        return <GalleryManager />;
      case 'careers':
        return <Careers />; 
        case 'sms':      
          return <SMSManager />;

      case 'achievements':
        return <AchievementsManager />;    

      case 'subscribers':
        return <SubscriberManager />;
      case 'email':
        return <EmailManager />;
      case 'student':
        return <Student />;  
      case 'fees':
        return <Fees />;
      case 'admins-profile':
        return <AdminManager user={user} />;
      default:
        return <DashboardOverview />;
    }
  };

  // Navigation items without counts
  const navigationItems = [
    { 
      id: 'overview', 
      label: 'Dashboard Overview', 
      icon: FiHome,
      badge: 'primary'
    },
    { 
      id: 'school-info', 
      label: 'School Information', 
      icon: FiInfo,
      badge: 'info'
    },
    { 
      id: 'guidance-counseling', 
      label: 'Guidance Counseling', 
      icon: FiMessageCircle,
      badge: 'purple'
    },
    {
      id: 'schooldocuments',
      label: 'School Documents',
      icon: FiArchive, 
      badge: 'indigo'
    },
    {
      id: 'schoolhub',
      label: 'School Hub',
      icon: IoSchoolOutline,
      badge: 'cyan'
    },
    { 
      id: 'staff', 
      label: 'Staff & BOM', 
      icon: IoPeopleCircle,
      badge: 'orange'
    },
    {
      id: 'achievements',
      label: 'Achievements',
      icon: FiAward,
      badge: 'yellow'
    },
    { 
      id: 'assignments', 
      label: 'Assignments', 
      icon: FiBook,
      badge: 'red'
    },
    { 
      id: 'admissions',
      label: 'Admission Applications', 
      icon: FiClipboard,
      badge: 'purple'
    },
    { 
      id: 'resources', 
      label: 'Resources',
      icon: FiFileText,
      badge: 'cyan' 
    },
    {
      id: 'student',
      label: 'Student Records',
      icon: FiInfo,
      badge: 'cyan'
    },
    {
      id: 'fees',
      label: 'Fee Balances',
      icon: FiDollarSign,
      badge: 'yellow'
    },
    {
      id: 'careers',
      label: 'Careers',
      icon: FiCalendar,
      badge: 'lime'
    },
    { 
      id: 'sms',
      label: 'SMS Management',
      icon: FiMessageSquare,
      badge: 'orange'
    },
    { 
      id: 'newsevents', 
      label: 'News & Events', 
      icon: IoNewspaper,
      badge: 'yellow'
    },
    { 
      id: 'gallery', 
      label: 'Media Gallery', 
      icon: FiImage,
      badge: 'pink'
    },
    { 
      id: 'subscribers', 
      label: 'Subscribers', 
      icon: FiUserPlus,
      badge: 'teal'
    },
    { 
      id: 'email', 
      label: 'Email Campaigns', 
      icon: FiMail,
      badge: 'indigo'
    },
    { 
      id: 'admins-profile', 
      label: 'Admins & Profile', 
      icon: FiShield,
      badge: 'gray'
    },
  ];

  const CompactSchoolHeader = () => {
    return (
      <div className="group cursor-default py-4">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          <div className="h-10 w-1 bg-gradient-to-b from-orange-900 to-amber-700 rounded-full shadow-sm " />

          <div className="flex flex-col">
            <h1 className="text-lg md:text-xl font-black text-gray-900 tracking-tight leading-none uppercase italic">
              kinyui boys <span className="text-orange-800 group-hover:text-amber-700 transition-colors">Senior</span>
            </h1>
            
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[9px] font-black text-gray-400 uppercase tracking-[0.3em]">
                  School
              </span>
              <div className="h-[1px] w-4 bg-gray-200" />
              <p className="text-[10px] md:text-xs font-bold text-gray-500 italic">
                "Soaring to Excellence"
              </p>
            </div>
          </div>

          <IoSparkles className="hidden md:block text-yellow-400 text-sm opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-500" />
        </div>
      </div>
    );
  };

  // Show loading screen
  if (loading) {
    return <ModernLoadingScreen />;
  }

  // If no user but loading is false, it means we're redirecting
  if (!user) {
    return null;
  }

  return (
    < >
  <div className="w-full h-full">
    
      {/* Add Sonner Toaster */}
      <Toaster 
        position="top-right"
        expand={false}
        richColors
        closeButton
      />
      
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-orange-50/30 overflow-hidden">
      {showMobileWarning && <MobileWarningModal />}
        
        {/* Sidebar */}
        <AdminSidebar 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          tabs={navigationItems}
        />

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
          {/* Top Header */}
          <header className="bg-white/80 backdrop-blur-xl shadow-sm border-b border-gray-200/50 z-30">
            <div className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="lg:hidden p-3 rounded-2xl hover:bg-gray-100 transition-all duration-200"
                >
                  <FiMenu className="text-xl text-gray-600" />
                </button>
                
                <div className="flex items-center gap-4">
                  <div className="hidden lg:flex w-12 h-12 bg-gradient-to-br from-orange-900 to-amber-800 rounded-2xl items-center justify-center shadow-lg">
                    <FiAward className="text-xl text-white" />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                {/* Quick Stats - Hidden on small screens */}
                <div className="hidden md:flex items-center gap-6">
                  <CompactSchoolHeader/>
                </div>

      
              </div>
            </div>
          </header>

          {/* Main Content Area */}
          <main className="flex-1 overflow-auto bg-transparent [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <div className="h-full">
              {renderContent()}
            </div>
          </main>
        </div>
      </div>
      </div>
    </>
  );
}

// Add CSS animations
const styles = `
  @keyframes scale-in {
    0% {
      opacity: 0;
      transform: scale(0.9);
    }
    100% {
      opacity: 1;
      transform: scale(1);
    }
  }
  
  .animate-scale-in {
    animation: scale-in 0.3s ease-out forwards;
  }
`;

// Add styles to head
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}
