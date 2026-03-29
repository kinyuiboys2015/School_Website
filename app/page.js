"use client";
import { useEffect, useState, useCallback } from 'react';
import { 
  FiArrowRight, 
  FiStar, 
  FiUsers, 
  FiPlay,
  FiCalendar,
  FiMapPin,
  FiBook,
  FiActivity,
  FiShare2,
  FiMail,
  FiUser,
  FiBookOpen,
  FiHome,
  FiPhone,
  FiClock,
  FiTrendingUp,
  FiTarget,
  FiCheckCircle,
  FiGlobe,
  FiHeart,
  FiShield,
  FiCheck,
  FiTarget as FiTargetIcon,
  FiShield as FiShieldIcon,
  FiUsers as FiUsersIcon,
  FiBook as FiBookIcon,
  FiAward,
  FiMap,
  FiGlobe as FiGlobeIcon,
  FiBookmark,
  FiBarChart2,
  FiActivity as FiActivityIcon,
  FiChevronLeft,
  FiChevronRight,
  FiChevronUp,
  FiExternalLink,
  FiLoader 
} from 'react-icons/fi';
import { FiAlertCircle, FiPhoneCall } from 'react-icons/fi';
import Hero from "./components/Hero/page";
import Why from "./components/why/page";
import { Trophy, Sparkles, GraduationCap, Target, Users, Globe, BookOpen } from 'lucide-react';

import { 
  IoRocketOutline, 
  IoPeopleOutline,
  IoLibraryOutline,
  IoBusinessOutline,
  IoSparkles,
  IoSchoolOutline,
  IoStatsChart,
  IoMedalOutline,
  IoClose,
  IoHeartOutline,
  IoBulbOutline,
  IoStarOutline,
  IoRibbonOutline,
  IoCalendarOutline,
  IoTimeOutline,
  IoLocationOutline,
  IoArrowForward,
  IoBookOutline,
  IoDesktopOutline
} from 'react-icons/io5';
import { FaCalendarAlt, FaWhatsapp, FaChalkboardTeacher  } from 'react-icons/fa';
import { 
  GiGraduateCap, 
  GiModernCity,
  GiTreeGrowth,
  GiBrain,
  GiTeacher,
  GiLightBulb,
  GiAchievement,
  GiStoneBridge,
  GiBookPile,
  GiBurningBook,
  GiRingingBell,
  GiTrophyCup,
  GiChemicalDrop,
  GiAbstract066,
  GiCircuitry
} from 'react-icons/gi';
import { BsArrowRightCircle, BsLightningCharge } from 'react-icons/bs';
import { TbUsersGroup } from 'react-icons/tb';
import { useRouter } from 'next/navigation';

// External Components
import ChatBot from './components/chat/page';
import EnhancedEventsSection from './components/events/page';
import ModernLeadershipSection from './components/leadership/page';

// Modern Loading Screen Component with Mirror Effect
const ModernLoadingScreen = () => {
  const [textIndex, setTextIndex] = useState(0);
  const [glowIntensity, setGlowIntensity] = useState(0);
  
  const motto = "Soaring to Excellence";
  const schoolName = "KINYUI BOYS' SENIOR";

  // Animated text effect
  useEffect(() => {
    const interval = setInterval(() => {
      setTextIndex((prev) => (prev + 1) % 3);
    }, 300);
    return () => clearInterval(interval);
  }, []);

  // Pulsing glow effect
  useEffect(() => {
    const glowInterval = setInterval(() => {
      setGlowIntensity((prev) => (prev + 1) % 100);
    }, 50);
    return () => clearInterval(glowInterval);
  }, []);

  return (
    <div className="fixed inset-0 bg-white z-50 flex items-center justify-center overflow-hidden">
      {/* Dynamic Background Effect */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Animated Gradient Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse-slow animation-delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-indigo-400/10 to-blue-400/10 rounded-full blur-3xl animate-spin-slow"></div>
        
        {/* Moving Light Beams - TV Channel Style */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent animate-beam"></div>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent animate-beam animation-delay-500"></div>
          <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-transparent via-purple-500 to-transparent animate-beam-vertical"></div>
          <div className="absolute right-0 top-0 w-1 h-full bg-gradient-to-b from-transparent via-pink-500 to-transparent animate-beam-vertical animation-delay-300"></div>
        </div>

        {/* Diagonal Scanning Lines */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent animate-scan"></div>
        
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-4xl px-6">
        {/* Logo with Mirror Effect Container */}
        <div className="relative mb-8 md:mb-12">
          {/* Mirror Effect Base */}
          <div className="relative">
            {/* Glowing Background */}
            <div 
              className="absolute inset-0 bg-gradient-to-r from-blue-500 via-cyan-500 to-purple-500 rounded-full blur-2xl transition-all duration-300"
              style={{ 
                opacity: 0.3 + (glowIntensity / 100) * 0.3,
                transform: `scale(${1 + (glowIntensity / 100) * 0.1})`
              }}
            ></div>
            
            {/* Logo Container with Mirror Effect */}
            <div className="relative w-28 h-28 md:w-36 md:h-36 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 p-1 shadow-2xl">
              <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden relative">
                {/* Mirror Reflection Effect */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-transparent to-white/10 pointer-events-none"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
                
                <img 
                  src="/kinyui.png" 
                  alt="Kinyui Boys Senior School Logo" 
                  className="w-20 h-20 md:w-28 md:h-28 object-contain p-2 relative z-10"
                />
              </div>
            </div>
          </div>
        </div>

        {/* School Name with Mirror Effect Inside Letters */}
        <div className="text-center mb-6 md:mb-8">
          <div className="relative inline-block">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-wider relative">
              {schoolName.split('').map((letter, index) => (
                <span
                  key={index}
                  className="inline-block animate-text-wave"
              
                >
                  {letter}
                </span>
              ))}
            </h1>
            
            {/* Mirror Reflection of Text */}
            <div className="absolute -bottom-1 left-0 right-0 opacity-30 transform scale-y-[-0.3] translate-y-2 pointer-events-none">
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-wider blur-sm">
                {schoolName}
              </h1>
            </div>
            
            {/* Animated Gradient Underline */}
            <div className="absolute -bottom-3 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent animate-underline"></div>
          </div>
          
          <p className="text-gray-500 text-xs md:text-sm mt-4 tracking-wider">EST. 1976 | CENTRE OF EXCELLENCE</p>
        </div>

        {/* Motto with Animated Style */}
        <div className="text-center mb-8 md:mb-10">
          <div className="relative inline-block">
            <p className="text-xl md:text-3xl lg:text-4xl font-bold italic tracking-wide">
              {motto.split('').map((char, index) => (
                <span
                  key={index}
                  className={`inline-block transition-all duration-300 ${
                    index === textIndex ? 'text-blue-600 scale-110' : 'text-gray-800'
                  }`}
                  style={{
                    animation: 'fadeInUp 0.5s ease-out forwards',
                    animationDelay: `${index * 0.03}s`,
                    opacity: 0,
                    transform: 'translateY(20px)'
                  }}
                >
                  {char === ' ' ? '\u00A0' : char}
                </span>
              ))}
            </p>
            
            {/* Motto Reflection */}
            <div className="absolute -bottom-2 left-0 right-0 opacity-20 transform scale-y-[-0.3] translate-y-2 pointer-events-none">
              <p className="text-xl md:text-3xl lg:text-4xl font-bold italic blur-sm tracking-wide">
                {motto}
              </p>
            </div>
          </div>
        </div>

        {/* Animated Loading Indicators */}
        <div className="flex flex-col items-center gap-4">
          {/* Modern Progress Ring */}
          <div className="relative w-16 h-16 md:w-20 md:h-20">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="50%"
                cy="50%"
                r="45%"
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="3"
                className="opacity-30"
              />
              <circle
                cx="50%"
                cy="50%"
                r="45%"
                fill="none"
                stroke="url(#gradient)"
                strokeWidth="3"
                strokeLinecap="round"
                className="animate-progress-ring"
                style={{
                  strokeDasharray: 283,
                  strokeDashoffset: `calc(283 - (283 * ${(Date.now() % 3000) / 3000}))`
                }}
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="50%" stopColor="#06b6d4" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-3 h-3 md:w-4 md:h-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full animate-pulse"></div>
            </div>
          </div>

          {/* Loading Text with Dots Animation */}
          <div className="flex items-center gap-1 text-gray-500 text-sm md:text-base font-medium">
            <span>Loading experience</span>
            <span className="flex gap-1">
              <span className="animate-bounce" style={{ animationDelay: '0s' }}>.</span>
              <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>.</span>
              <span className="animate-bounce" style={{ animationDelay: '0.4s' }}>.</span>
            </span>
          </div>
        </div>

        {/* Decorative Bottom Bar */}
        <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-2">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400 animate-pulse"
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
        
        @keyframes scan {
          0% { transform: translate(-100%, -100%); opacity: 0; }
          50% { opacity: 0.1; }
          100% { transform: translate(100%, 100%); opacity: 0; }
        }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        @keyframes text-wave {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        
        @keyframes fadeInUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes underline {
          0% { width: 0%; opacity: 0; }
          50% { width: 100%; opacity: 1; }
          100% { width: 0%; opacity: 0; }
        }
        
        @keyframes progress-ring {
          0% { stroke-dashoffset: 283; }
          100% { stroke-dashoffset: 0; }
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
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
        
        .animate-scan {
          animation: scan 4s ease-in-out infinite;
        }
        
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
        
        .animate-text-wave {
          animation: text-wave 0.6s ease-in-out infinite;
        }
        
        .animate-underline {
          animation: underline 2s ease-in-out infinite;
        }
        
        .animate-progress-ring {
          animation: progress-ring 2s linear infinite;
        }
        
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        
        .animate-bounce {
          animation: bounce 0.6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default function ModernHero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [apiData, setApiData] = useState({
    events: [],
    news: [],
    staff: [],
    schoolInfo: null,
    guidanceEvents: []
  });
  const [isAnimating, setIsAnimating] = useState(false);
  const [schoolData, setSchoolData] = useState(null);
  const [videoLoading, setVideoLoading] = useState(false);
  const [videoError, setVideoError] = useState(null);
  const [navigationBlocked, setNavigationBlocked] = useState(true);

  const router = useRouter();

  // JSON-LD structured data for SEO
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'School',
  name: 'kinyui boys Senior School',
  image: 'https://kinyui-senior.vercel.app/kinyui.png',
  description: 'A secondary school committed to academic excellence, integrity, and holistic student development.',
  address: {
    '@type': 'PostalAddress',
    'streetAddress': 'kinyui boys',
    'addressLocality': 'Machakos', // Adjust if the specific locality differs
    'addressRegion': 'Machakos County',
    'addressCountry': 'KE'
  },
  url: 'https://kinyui-senior.vercel.app',
  telephone: '+254710894145', // Update with the actual school office line
  sameAs: [
    'https://facebook.com/kinyui boyshigh',
    'https://twitter.com/kinyui boyshigh',
    'https://instagram.com/kinyui boyshigh'
  ],
  foundingDate: '1976', // Update with the actual founding year
  numberOfStudents: '800', // Update with current enrollment
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Educational Programs',
    itemListElement: [
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Course',
          name: 'KCSE Curriculum (Form 1-4)'
        }
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Course',
          name: 'Extra-Curricular & Sports'
        }
      }
    ]
  }
};

  // Block automatic navigation on initial load
  useEffect(() => {
    const timer = setTimeout(() => {
      setNavigationBlocked(false);
      console.log('Navigation unblocked after 2 seconds');
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);


  // Enhanced Hero Slides with Modern Design
  const heroSlides = [
    {
      title: "Academic Excellence",
      subtitle: "Redefined Through Innovation",
      gradient: "from-blue-500 via-cyan-400 to-purple-600",
      description: "At kinyui boys Senior School, we're pioneering a new era of education. With a 94% KCSE success rate and state-of-the-art STEM facilities, we're not just teaching—we're inspiring the next generation of leaders and innovators.",
      background: "bg-gradient-to-br from-blue-900/90 via-indigo-900/80 to-purple-900/70",
      image: "/student.jpg",
      stats: { 
        students: "400+ Active Learners", 
        excellence: "94% KCSE Success", 
        years: "10+ Years Excellence" 
      },
      features: ["Modern STEM Labs", "Digital Library", "Expert Faculty", "Research Programs"],
      cta: "Explore Our Programs",
      highlightColor: "blue",
      testimonial: "\"The academic rigor combined with innovative teaching transformed my child's approach to learning.\" - Parent of 2023 Graduate",
      icon: GiGraduateCap
    },
    {
      title: "Holistic Development",
      subtitle: "Nurturing Complete Individuals",
      gradient: "from-emerald-500 via-teal-400 to-green-600",
      description: "Beyond academics, we cultivate well-rounded individuals through 15+ clubs, competitive sports teams, and comprehensive life skills training. Our balanced approach ensures students develop essential competencies for lifelong success.",
      background: "bg-gradient-to-br from-emerald-900/90 via-green-900/80 to-teal-900/70",
      image: "/im.jpg",
      stats: { 
        teams: "10+ Sports Teams", 
        clubs: "15+ Clubs", 
        success: "National Awards" 
      },
      features: ["Sports Excellence", "Creative Arts", "Leadership Training", "Community Service"],
      cta: "View Our Facilities",
      highlightColor: "green",
      testimonial: "\"The extracurricular programs helped my child discover their passion for drama and develop crucial leadership skills.\" - Current Parent",
      icon: GiTrophyCup
    },
    {
      title: "Future-Ready Education",
      subtitle: "Preparing for the Digital Age",
      gradient: "from-cyan-500 via-blue-400 to-indigo-600",
      description: "Experience cutting-edge education with our technology-enhanced smart classrooms, advanced computer labs, and comprehensive digital literacy programs. We prepare students for careers in an increasingly technological world.",
      background: "bg-gradient-to-br from-cyan-900/90 via-blue-900/80 to-indigo-900/70",
      image: "/im2.jpeg",
      stats: { 
        labs: "3 Modern Labs", 
        tech: "Digital Classrooms", 
        innovation: "STEM Programs" 
      },
      features: ["Computer Studies", "Science Innovation", "Career Guidance", "Coding Classes"],
      cta: "Apply Now",
      highlightColor: "cyan",
      testimonial: "\"The advanced computer labs gave me skills that directly contributed to securing my university scholarship in Computer Science.\" - 2022 Alumni",
      icon: IoRocketOutline
    }
  ];

  // API Data Fetching - Fixed to avoid async/await in client component
  useEffect(() => {
    const fetchAllData = () => {
      try {
        setIsLoading(true);
        
        const endpoints = [
          { key: 'events', url: '/api/events' },
          { key: 'school', url: '/api/school' }
        ];

        Promise.allSettled(
          endpoints.map(endpoint => 
            fetch(endpoint.url)
              .then(res => {
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                return res.json();
              })
              .then(data => ({ key: endpoint.key, data }))
              .catch(() => ({ 
                key: endpoint.key, 
                data: null
              }))
          )
        ).then(results => {
          const fetchedData = {
            events: [],
            staff: [],
            schoolInfo: null
          };

          results.forEach(result => {
            if (result.status === 'fulfilled') {
              const { key, data } = result.value;
              if (data) {
                switch (key) {
                  case 'events':
                    fetchedData.events = data.events || [];
                    break;
                  case 'staff':
                    fetchedData.staff = data.staff || [];
                    break;
                  case 'school':
                    fetchedData.schoolInfo = data.school || data;
                    break;
                }
              }
            }
          });

          setApiData(fetchedData);
        }).catch(error => {
          console.error('Error fetching data:', error);
          setApiData({
            events: [],
            staff: [],
            schoolInfo: null
          });
        }).finally(() => {
          setTimeout(() => setIsLoading(false), 4000);
        });

      } catch (error) {
        console.error('Error in fetchAllData:', error);
        setApiData({
          events: [],
          staff: [],
          schoolInfo: null
        });
        setIsLoading(false);
      }
    };

    fetchAllData();
  }, []);

  // Auto-slide for hero carousel with animation
  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
        setIsAnimating(false);
      }, 500);
    }, 8000);
    return () => clearInterval(interval);
  }, [heroSlides.length]);

  const nextSlide = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
      setIsAnimating(false);
    }, 500);
  };

  const prevSlide = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
      setIsAnimating(false);
    }, 500);
  };

  // School Video API Service - Fixed to avoid async/await
  const fetchSchoolVideo = useCallback(() => {
    setVideoLoading(true);
    setVideoError(null);
    
    fetch('/api/school')
      .then(response => {
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return response.json();
      })
      .then(data => {
        if (data.success && data.school) {
          setSchoolData(data.school);
          setVideoError(null);
          console.log('Video data loaded:', {
            name: data.school.name,
            videoType: data.school.videoType,
            videoTour: data.school.videoTour
          });
        } else {
          throw new Error(data.message || 'No school data found');
        }
      })
      .catch(err => {
        console.error('Error fetching school video:', err);
        setVideoError(err.message);
        setSchoolData(null);
      })
      .finally(() => {
        setVideoLoading(false);
      });
  }, []);

  // Call this when modal opens
  useEffect(() => {
    if (showVideoModal) {
      console.log('Fetching video data...');
      fetchSchoolVideo();
    }
  }, [showVideoModal, fetchSchoolVideo]);

  // Extract YouTube ID
  const extractYouTubeId = (url) => {
    if (!url) return null;
    
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /youtube\.com\/v\/([^&\n?#]+)/
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }
    
    return null;
  };

  // Navigation handlers - FIXED to prevent automatic navigation
  const handleAcademicsClick = useCallback(() => {
    if (navigationBlocked) {
      console.log('Navigation blocked (cooling period)');
      return;
    }
    router.push('/pages/academics');
  }, [router, navigationBlocked]);

  const handleWatchTour = useCallback(() => {
    setShowVideoModal(true);
  }, []);

  const closeVideoModal = useCallback(() => {
    setShowVideoModal(false);
    setSchoolData(null);
    setVideoError(null);
  }, []);

  const handleEventClick = useCallback(() => {
    if (navigationBlocked) {
      console.log('Navigation blocked (cooling period)');
      return;
    }
    router.push('/pages/eventsandnews');
  }, [router, navigationBlocked]);

  const handleStaffClick = useCallback(() => {
    if (navigationBlocked) {
      console.log('Navigation blocked (cooling period)');
      return;
    }
    router.push('/pages/staff');
  }, [router, navigationBlocked]);

  // FIXED: Changed from automatic admissions to manual click only
  const handleAdmissionsClick = useCallback(() => {
    if (navigationBlocked) {
      console.log('Navigation blocked (cooling period)');
      return;
    }
    router.push('/pages/admissions');
  }, [router, navigationBlocked]);

  // FIXED: Changed from admissions to AboutUs
  const handleContactClick = useCallback(() => {
    if (navigationBlocked) {
      console.log('Navigation blocked (cooling period)');
      return;
    }
    closeVideoModal();
    // Navigate to AboutUs instead of admissions
    setTimeout(() => {
      router.push('/pages/AboutUs');
    }, 100);
  }, [router, closeVideoModal, navigationBlocked]);

  if (isLoading) {
    return <ModernLoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Inject JSON-LD structured data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />


      <Hero />
      {/* Modern Achievements & Stats Section */}
      <section className="py-12  md:py-16 bg-white">
        <Why/>
      </section>


      <ModernLeadershipSection />


      <EnhancedEventsSection 
        events={apiData.events}
        onViewAll={handleEventClick}
        schoolInfo={apiData.schoolInfo}
      />
      {showVideoModal && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-6xl rounded-3xl overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-r from-black/80 to-transparent p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
                  <FiPlay className="text-white" />
                </div>
                <div>
                  <h4 className="text-white font-bold">Virtual Campus Tour</h4>
                  <p className="text-white/60 text-sm">
                    {schoolData?.name || 'Loading...'}
                  </p>
                </div>
              </div>
              <button
                onClick={closeVideoModal}
                className="w-10 h-10 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors flex items-center justify-center"
                aria-label="Close video"
              >
                <IoClose className="w-6 h-6" />
              </button>
            </div>
            
            {/* Video Container */}
            <div className="relative bg-black aspect-video">
              {videoLoading ? (
                // Loading state
                <div className="w-full h-full flex flex-col items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-4"></div>
                  <p className="text-white">Loading video tour...</p>
                </div>
              ) : videoError ? (
                // Error state
                <div className="w-full h-full flex flex-col items-center justify-center p-8">
                  <FiAlertCircle className="text-5xl text-red-500 mb-4" />
                  <p className="text-white text-center mb-4">{videoError}</p>
                  <button
                    onClick={fetchSchoolVideo}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    Retry Loading
                  </button>
                </div>
              ) : schoolData?.videoType === 'youtube' && schoolData?.videoTour ? (
                // YouTube Video
                <iframe
                  src={`https://www.youtube.com/embed/${extractYouTubeId(schoolData.videoTour)}?autoplay=1&rel=0&modestbranding=1&controls=1`}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={`${schoolData.name} Virtual Tour`}
                />
              ) : schoolData?.videoType === 'file' && schoolData?.videoTour ? (
                // Local MP4 Video
                <div className="relative w-full h-full">
                  <video
                    src={schoolData.videoTour}
                    className="w-full h-full"
                    autoPlay
                    controls
                    title={`${schoolData.name} Virtual Tour`}
                    poster={schoolData?.videoThumbnail}
                  >
                    {/* Fallback message */}
                    <div className="w-full h-full flex flex-col items-center justify-center p-8">
                      <FiAlertCircle className="text-5xl text-gray-400 mb-4" />
                      <p className="text-white text-center">
                        Your browser does not support the video tag.
                      </p>
                    </div>
                  </video>
                </div>
              ) : (
                // No video available
                <div className="w-full h-full flex flex-col items-center justify-center p-8">
                  <FiAlertCircle className="text-5xl text-gray-400 mb-4" />
                  <p className="text-white text-center mb-4">No video tour available</p>
                  <p className="text-white/60 text-sm text-center">
                    Please check back later for our virtual tour
                  </p>
                </div>
              )}
            </div>
            
            {/* Modal Footer */}
            <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-r from-transparent to-black/80 p-4">
              <div className="flex items-center justify-between">
                <div className="text-white/80 text-sm">
                  {schoolData?.description?.substring(0, 100) + '...' || 'Experience our campus from anywhere'}
                </div>
                <button
                  onClick={handleContactClick}
                  className="px-4 sm:px-6 md:px-8 py-2 sm:py-2.5 md:py-3 text-sm sm:text-base bg-gradient-to-br from-amber-900 via-orange-900 to-red-900 text-white font-medium rounded-lg hover:opacity-90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={navigationBlocked}
                >
                  Get To Know Us More
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Blocker Indicator */}
      {navigationBlocked && (
        <div className="fixed top-4 right-4 z-50 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium animate-pulse">
          Navigation Cooling Period...
        </div>
      )}

      <ChatBot />

      {/* Custom Animations */}
      <style jsx global>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        @keyframes float-light {
          0%, 100% { transform: translateY(0px); opacity: 0.2; }
          50% { transform: translateY(-10px); opacity: 0.4; }
        }
        
        @keyframes scroll {
          0% { transform: translateY(0); opacity: 1; }
          100% { transform: translateY(10px); opacity: 0; }
        }
        
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes gradient-loading {
          0% { background-position: -200px 0; }
          100% { background-position: 200px 0; }
        }
        
        .animate-gradient {
          animation: gradient 3s ease infinite;
          background-size: 200% auto;
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-float-light {
          animation: float-light 4s ease-in-out infinite;
        }
        
        .animate-scroll {
          animation: scroll 1.5s ease-in-out infinite;
        }
        
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        
        .animate-gradient-loading {
          animation: gradient-loading 1.5s linear infinite;
        }
      `}</style>
    </div>
  );
}