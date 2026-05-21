'use client';

import { useEffect, useMemo, useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  FiArrowLeft,
  FiBookOpen,
  FiCalendar,
  FiChevronRight,
  FiExternalLink,
  FiGlobe,
  FiGrid,
  FiImage,
  FiLayers,
  FiMapPin,
  FiMonitor,
  FiSearch,
  FiShield,
  FiUserCheck,
  FiUsers,
  FiX,
  FiStar,
  FiTrendingUp,
  FiClock,
  FiAward,
  FiBriefcase,
  FiHome,
  FiMail,
  FiPhone,
  FiFacebook,
  FiInstagram,
  FiTwitter,
  FiYoutube,
  FiLinkedin,
  FiGithub,
  FiCodepen,
  FiDribbble,
  FiBehance,
  FiFigma,
  FiSlack,
  FiDiscord,
  FiTwitch,
  FiTiktok,
  FiSnapchat,
  FiPinterest,
  FiReddit,
  FiMedium,
  FiBookmark,
  FiShare2,
  FiThumbsUp,
  FiMessageCircle,
  FiSend,
  FiMoreVertical,
  FiCopy,
  FiDownload,
  FiCloud,
  FiCloudLightning,
  FiCloudRain,
  FiCloudSnow,
  FiSun,
  FiMoon,
  FiWind,
  FiCompass,
  FiAnchor,
  FiArchive,
  FiBarChart,
  FiBattery,
  FiBell,
  FiBluetooth,
  FiBox,
  FiBriefcase as FiBriefcaseIcon,
  FiCamera,
  FiCast,
  FiHeart,
  FiChrome,
  FiCircle,
  FiClipboard,
  FiClock as FiClockIcon,
  FiCoffee,
  FiCompass as FiCompassIcon,
  FiAlertTriangle,
} from 'react-icons/fi';
import { 
  FaGraduationCap, 
  FaHome, 
  FaSchool, 
  FaBook, 
  FaChalkboardTeacher, 
  FaUsers as FaUsersIcon,
  FaRobot,
  FaBrain,
  FaMicrochip,
  FaRocket,
  FaGem,
  FaCrown,
  FaMedal,
  FaTrophy,
  FaUniversity,
  FaLandmark,
  FaTree,
  FaSeedling,
  FaHandsHelping,
  FaChild,
  FaApple,
  FaAndroid,
  FaWindows,
  FaLinux,
  FaCode,
  FaDatabase,
  FaCloud,
  FaLock,
  FaShieldAlt,
  FaDragon,
  FaFeather,
  FaFire,
  FaWater,
  FaEarth,
  FaWind as FaWindIcon,
  FaSun as FaSunIcon,
  FaMoon as FaMoonIcon,
  FaStar,
  FaInfinity,
  FaPeace,
  FaDove,
  FaOwl,
  FaWolf,
  FaEagle,
} from 'react-icons/fa';
import { normalizeSchoolImages } from './image-upload-field';

// ============= ENHANCED ICONS CONFIGURATION =============
const ICONS = {
  CLUB: FiUsers,
  SOCIETY: FaGraduationCap,
  STUDENT_COUNCIL: FiUserCheck,
  COMPUTER_LAB: FiMonitor,
  FARM: FaSeedling,
  BOARDING: FaHome,
  SECURITY: FiShield,
  DEPARTMENT: FiLayers,
  SPORTS: FiAward,
  ARTS: FiHeart,
  SCIENCE: FiBookOpen,
  TECHNOLOGY: FiMonitor,
  LEADERSHIP: FiStar,
};

// ============= SIMPLE THEME CONFIGURATIONS (NO BORDERS/SHADOWS) =============
const TYPE_THEMES = {
  CLUB: { 
    bg: 'bg-purple-50', 
    text: 'text-purple-700', 
    iconBg: 'bg-purple-600',
  },
  SOCIETY: { 
    bg: 'bg-indigo-50', 
    text: 'text-indigo-700', 
    iconBg: 'bg-indigo-600',
  },
  STUDENT_COUNCIL: { 
    bg: 'bg-fuchsia-50', 
    text: 'text-fuchsia-700', 
    iconBg: 'bg-fuchsia-600',
  },
  COMPUTER_LAB: { 
    bg: 'bg-sky-50', 
    text: 'text-sky-700', 
    iconBg: 'bg-sky-600',
  },
  FARM: {
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    iconBg: 'bg-emerald-600',
  },
  BOARDING: { 
    bg: 'bg-amber-50', 
    text: 'text-amber-700', 
    iconBg: 'bg-amber-600',
  },
  SECURITY: { 
    bg: 'bg-rose-50', 
    text: 'text-rose-700', 
    iconBg: 'bg-rose-600',
  },
  DEPARTMENT: { 
    bg: 'bg-cyan-50', 
    text: 'text-cyan-700', 
    iconBg: 'bg-cyan-600',
  },
};

// ============= KINYUI BOYS SCHOOL INFORMATION =============
const SCHOOL_INFO = {
  name: 'Kinyui Boys Senior School',
  shortName: 'Kinyui Boys',
  motto: 'Blessed and Favoured',
  vision: 'To be a disciplined centre of excellence that develops confident, service-minded young men.',
  mission: 'To provide quality boys boarding education through academics, mentorship, innovation, talent development, and responsible citizenship.',
  location: 'Matungulu, Machakos County, Kenya',
  email: 'kinyuiboys2015@gmail.com',
  phone: '+254 733 587223',
  website: 'kinyuiboyssenior.school',
  colors: ['Amber', 'Brown', 'White'],
  achievements: [
    'Boys boarding learning environment with strong mentorship',
    'CBC senior school pathways and co-curricular development',
    'Active clubs, societies, student leadership, conservation, and welfare programs',
    'Strong community link in Matungulu, Machakos County',
  ],
  description: `Kinyui Boys Senior School is a public boys boarding senior school in Matungulu, Machakos County.
    The School Hub brings together academics, boarding life, student leadership, clubs, societies, practical learning,
    conservation, ICT, security, and student welfare in one clean public directory.`
};

// ============= UTILITY FUNCTIONS =============
const getTypeLabel = (type) => {
  const labels = {
    CLUB: 'Club', SOCIETY: 'Society', STUDENT_COUNCIL: 'Student Council',
    COMPUTER_LAB: 'Computer Lab', FARM: 'School Farm', BOARDING: 'Boarding', SECURITY: 'Security',
    DEPARTMENT: 'Department', SPORTS: 'Sports', ARTS: 'Arts', SCIENCE: 'Science',
    TECHNOLOGY: 'Technology', LEADERSHIP: 'Leadership'
  };
  return labels[type] || 'School Hub';
};

const getDepartmentCategoryLabel = (category) => {
  const labels = {
    CBC: 'CBC Department', EIGHT_FOUR_FOUR: '8-4-4 Department',
    TEACHING: 'Teaching Department', SUPPORT: 'Support Department'
  };
  return labels[category] || 'Department';
};

const buildDepartmentItem = (dept) => ({
  ...dept,
  type: 'DEPARTMENT',
  title: dept.name,
  shortDescription: dept.description,
  description: dept.description,
  contactName: dept.headName,
  details: [
    { title: 'Category', content: getDepartmentCategoryLabel(dept.category) },
    { title: 'Staffing', content: `${Number(dept.staffCount) || 0} staff members` },
  ].filter((item) => item.content),
});

const getSocialLinks = (item) => {
  let social = item?.socialMedia || {};
  if (typeof social === 'string') {
    try { social = JSON.parse(social); } catch { social = {}; }
  }
  if (!social || typeof social !== 'object' || Array.isArray(social)) return [];
  return Object.entries(social).filter(([, value]) => typeof value === 'string' && value.trim()).map(([label, href]) => ({ label, href: href.trim() }));
};

const renderSchoolName = (text) => {
  if (!text || typeof text !== 'string') return text;
  return text.split(/(Kinyui Boys)/gi).map((part, index) =>
    part.toLowerCase() === 'kinyui boys'
      ? <span key={`${part}-${index}`} className="text-amber-700">{part}</span>
      : part
  );
};

// ============= SIMPLE COMPONENTS (NO BORDERS/SHADOWS) =============

// Simple Info Pill Component
const InfoPill = ({ icon: Icon, children, variant = "default" }) => {
  const variants = {
    default: "bg-gray-100 text-gray-700",
    primary: "bg-emerald-100 text-emerald-700",
    secondary: "bg-indigo-100 text-indigo-700",
  };
  return (
    <span className={`inline-flex items-center gap-2 px-3 py-2 text-xs font-medium ${variants[variant]}`}>
      <Icon className="text-sm" />
      {children}
    </span>
  );
};

// Simple Spinner Component
const Spinner = ({ size = "md", color = "gray" }) => {
  const sizeClasses = { sm: "w-4 h-4", md: "w-5 h-5", lg: "w-6 h-6" };
  const colorClasses = { gray: "border-gray-600", white: "border-white" };
  return (
    <div className={`${sizeClasses[size]} animate-spin rounded-full border-2 ${colorClasses[color]} border-t-transparent`} />
  );
};

// Modern Loading Spinner (simplified)
const ModernLoadingSpinner = ({ message = "Loading content..." }) => (
  <div className="flex flex-col items-center justify-center rounded-lg border border-slate-200 bg-white px-6 py-20">
    <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-slate-900 text-white">
      <Spinner size="lg" color="white" />
    </div>
    <p className="mt-6 text-sm font-semibold text-slate-700">{message}</p>
    <div className="mt-3 flex gap-1">
      {[0, 1, 2].map(i => (
        <div key={i} className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
      ))}
    </div>
  </div>
);

// Simple Refresh Button
const RefreshButton = ({ refreshing, onClick }) => (
  <button
    onClick={onClick}
    disabled={refreshing}
    className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 text-sm font-bold text-white transition hover:bg-slate-800 active:scale-[0.98] disabled:opacity-60"
  >
    {refreshing ? (
      <>
        <Spinner size="sm" color="white" />
        <span>Updating...</span>
      </>
    ) : (
      <>
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        Refresh
      </>
    )}
  </button>
);

// Gallery Modal Component
const GalleryModal = ({ item, onClose }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [shareStatus, setShareStatus] = useState('');
  
  useEffect(() => { setSelectedIndex(0); }, [item?.id, item?.type]);
  if (!item) return null;

  const images = normalizeSchoolImages(item);
  const selectedImage = images[selectedIndex]?.url;
  const Icon = ICONS[item.type] || FiLayers;
  const theme = TYPE_THEMES[item.type] || TYPE_THEMES.DEPARTMENT;
  const socialLinks = getSocialLinks(item);

  const handlePrev = () => {
    setIsAnimating(true);
    setSelectedIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
    setTimeout(() => setIsAnimating(false), 300);
  };

  const handleNext = () => {
    setIsAnimating(true);
    setSelectedIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
    setTimeout(() => setIsAnimating(false), 300);
  };

  const handleShare = async () => {
    const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
    const shareData = {
      title: item.title || 'School Hub',
      text: item.shortDescription || item.description || `View ${item.title || 'this School Hub item'}`,
      url: shareUrl,
    };

    try {
      if (typeof navigator !== 'undefined' && navigator.share) {
        await navigator.share(shareData);
        setShareStatus('Shared');
      } else if (typeof navigator !== 'undefined' && navigator.clipboard && shareUrl) {
        await navigator.clipboard.writeText(shareUrl);
        setShareStatus('Link copied');
      } else {
        setShareStatus('Share unavailable');
      }
    } catch (error) {
      if (error?.name !== 'AbortError') {
        setShareStatus('Unable to share');
      }
    } finally {
      setTimeout(() => setShareStatus(''), 2200);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/75 p-2 sm:p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="relative flex max-h-[96vh] w-full max-w-6xl flex-col overflow-hidden rounded-xl sm:rounded-2xl bg-white shadow-2xl sm:max-h-[92vh]" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute right-2 sm:right-4 top-2 sm:top-4 z-50 flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-white/95 text-slate-700 shadow-lg transition hover:bg-slate-100">
          <FiX className="text-base sm:text-lg" />
        </button>

        <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[1.35fr_0.8fr]">
          <div className="relative bg-slate-100">
            <div className="relative h-[240px] sm:h-[420px] lg:h-[520px]">
              {selectedImage ? (
                <img 
                  src={selectedImage} 
                  alt={item.title} 
                  className={`h-full w-full object-contain transition-all duration-300 ${isAnimating ? 'opacity-50 scale-95' : 'opacity-100 scale-100'}`}
                />
              ) : (
                <div className={`flex h-full w-full items-center justify-center ${theme.bg}`}>
                  <Icon className={`text-6xl ${theme.text}`} />
                </div>
              )}
            </div>
            
            {images.length > 1 && (
              <>
                <button onClick={handlePrev} className="absolute left-2 sm:left-4 top-1/2 flex h-8 w-8 sm:h-10 sm:w-10 -translate-y-1/2 items-center justify-center rounded-lg bg-white/95 text-slate-800 shadow-lg transition hover:bg-white">
                  <FiChevronRight className="rotate-180 text-lg sm:text-xl" />
                </button>
                <button onClick={handleNext} className="absolute right-2 sm:right-4 top-1/2 flex h-8 w-8 sm:h-10 sm:w-10 -translate-y-1/2 items-center justify-center rounded-lg bg-white/95 text-slate-800 shadow-lg transition hover:bg-white">
                  <FiChevronRight className="text-lg sm:text-xl" />
                </button>
              </>
            )}
            
            <div className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-slate-950/80 px-2.5 sm:px-4 py-1 sm:py-1.5 text-[10px] sm:text-xs font-bold text-white">
              {selectedIndex + 1} / {images.length}
            </div>
          </div>

          <div className="flex min-h-0 flex-col bg-white">
            <div className="border-b border-slate-100 p-3 sm:p-4 md:p-5">
              <div className="mb-2 sm:mb-3 flex items-center justify-between gap-2">
                <span className={`inline-flex items-center gap-1.5 sm:gap-2 rounded-full px-2 sm:px-3 py-0.5 sm:py-1 text-[9px] sm:text-xs font-black uppercase tracking-wider ${theme.bg} ${theme.text}`}>
                  <Icon className="text-[8px] sm:text-xs" /> {getTypeLabel(item.type)}
                </span>
                <button
                  type="button"
                  onClick={handleShare}
                  className="rounded-lg p-1.5 sm:p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                  aria-label="Share item"
                >
                  <FiShare2 className="text-sm sm:text-base" />
                </button>
              </div>
              <h2 className="text-lg sm:text-xl md:text-2xl font-black tracking-tight text-slate-950">{item.title}</h2>
              {item.description && (
                <p className="mt-2 sm:mt-3 text-xs sm:text-sm font-medium leading-5 sm:leading-6 text-slate-600">{item.description}</p>
              )}
              {shareStatus && (
                <p className="mt-2 sm:mt-3 text-[9px] sm:text-xs font-black uppercase tracking-[0.14em] text-emerald-700">{shareStatus}</p>
              )}
            </div>

            <div className="min-h-0 flex-1 space-y-3 sm:space-y-4 overflow-y-auto p-3 sm:p-4 md:p-5">
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                <div className="rounded-lg bg-slate-50 p-2 sm:p-3 text-center">
                  <p className="text-lg sm:text-xl font-black text-slate-950">{images.length}</p>
                  <p className="mt-0.5 sm:mt-1 text-[9px] sm:text-xs font-bold uppercase tracking-wider text-slate-500">Photos</p>
                </div>
                <div className="rounded-lg bg-slate-50 p-2 sm:p-3 text-center">
                  <p className="text-lg sm:text-xl font-black text-slate-950">{item.details?.length || 0}</p>
                  <p className="mt-0.5 sm:mt-1 text-[9px] sm:text-xs font-bold uppercase tracking-wider text-slate-500">Details</p>
                </div>
              </div>

              {images.length > 1 && (
                <div>
                  <p className="mb-2 text-[9px] sm:text-xs font-black uppercase tracking-wider text-slate-400">All Photos</p>
                  <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
                    {images.slice(0, 8).map((image, index) => (
                      <button
                        key={image.url}
                        onClick={() => setSelectedIndex(index)}
                        className={`relative aspect-square overflow-hidden rounded-lg ${
                          selectedIndex === index ? 'ring-2 ring-slate-700' : ''
                        }`}
                      >
                        <img src={image.url} alt={image.altText || `${item.title} ${index + 1}`} className="h-full w-full object-cover" />
                        {index === 7 && images.length > 8 && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/60 text-[10px] sm:text-xs font-bold text-white">
                            +{images.length - 8}
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {(item.location || item.established || item.website) && (
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {item.location && <InfoPill icon={FiMapPin}>{item.location}</InfoPill>}
                  {item.established && <InfoPill icon={FiCalendar}>{item.established}</InfoPill>}
                  {item.website && (
                    <a href={item.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2 sm:px-3 py-1.5 sm:py-2 text-[9px] sm:text-xs font-bold text-slate-700 transition hover:bg-slate-200">
                      <FiGlobe className="text-xs" /> Website <FiExternalLink className="text-[9px] sm:text-[10px]" />
                    </a>
                  )}
                </div>
              )}

              {item.contactName && (
                <div className="rounded-lg bg-slate-50 p-3 sm:p-4">
                  <p className="mb-2 text-[9px] sm:text-xs font-black uppercase tracking-wider text-slate-400">Contact Person</p>
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className={`flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg ${theme.iconBg} text-white`}>
                      <FiUserCheck className="text-sm sm:text-base" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm font-bold text-slate-950">{item.contactName}</p>
                      {item.contactEmail && <p className="text-[10px] sm:text-xs text-slate-500">{item.contactEmail}</p>}
                      {item.contactPhone && <p className="text-[10px] sm:text-xs text-slate-500">{item.contactPhone}</p>}
                    </div>
                  </div>
                </div>
              )}

              {socialLinks.length > 0 && (
                <div className="rounded-lg border border-slate-100 bg-white p-3 sm:p-4">
                  <p className="mb-2 text-[9px] sm:text-xs font-black uppercase tracking-wider text-slate-400">Connect With Us</p>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {socialLinks.map((link) => (
                      <a key={`${link.label}-${link.href}`} href={link.href} target="_blank" rel="noopener noreferrer" className={`rounded-full px-2 sm:px-3 py-1 sm:py-1.5 text-[9px] sm:text-xs font-bold capitalize ${theme.bg} ${theme.text}`}>
                        {link.label}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {Array.isArray(item.details) && item.details.length > 0 && (
                <div className="space-y-2 sm:space-y-3">
                  <p className="text-[9px] sm:text-xs font-black uppercase tracking-wider text-slate-400">Additional Information</p>
                  {item.details.map((detail, index) => (
                    <div key={`${detail?.title || 'detail'}-${index}`} className="rounded-lg border border-slate-100 bg-white p-3 sm:p-4">
                      <p className="text-xs sm:text-sm font-bold text-slate-950">{detail?.title || `Detail ${index + 1}`}</p>
                      {detail?.content && <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm font-medium leading-5 sm:leading-6 text-slate-600">{detail.content}</p>}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex flex-col gap-1.5 sm:gap-2 border-t border-slate-100 bg-slate-50 p-3 sm:p-4 md:flex-row">
              <button onClick={onClose} className="flex-1 rounded-lg bg-slate-900 px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-bold text-white transition hover:bg-slate-800">
                Close
              </button>
              <button
                type="button"
                onClick={handleShare}
                className="inline-flex items-center justify-center gap-1.5 sm:gap-2 rounded-lg bg-white px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-bold text-slate-700 transition hover:bg-slate-100"
              >
                <FiExternalLink className="text-xs sm:text-sm" /> {shareStatus || 'Share'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Hub Card Component
const HubCard = ({ item, onView }) => {
  const images = normalizeSchoolImages(item);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const image = images[activeImageIndex]?.url || images[0]?.url;
  const Icon = ICONS[item.type] || FiLayers;
  const theme = TYPE_THEMES[item.type] || TYPE_THEMES.DEPARTMENT;
  const detailCount = Array.isArray(item.details) ? item.details.length : 0;

  useEffect(() => {
    if (images.length < 2) return undefined;
    const timer = setInterval(() => {
      setActiveImageIndex((index) => (index + 1) % images.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <button
      onClick={onView}
      className="group grid w-full overflow-hidden rounded-xl sm:rounded-2xl border border-slate-200 bg-white text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg lg:grid-cols-[minmax(320px,0.95fr)_minmax(0,1.25fr)]"
    >
      <div className="relative min-h-[200px] w-full bg-slate-100 sm:min-h-[260px] md:min-h-[320px] lg:min-h-full">
        {image ? (
          <img src={image} alt={item.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        ) : (
          <div className={`flex h-full w-full items-center justify-center ${theme.bg}`}>
            <Icon className={`text-3xl sm:text-4xl ${theme.text}`} />
          </div>
        )}
        
        <div className="absolute left-2 sm:left-3 top-2 sm:top-3">
          <span className={`inline-flex items-center gap-1 rounded-full bg-white/95 px-2 sm:px-2.5 py-0.5 sm:py-1 text-[9px] sm:text-[10px] font-black uppercase tracking-wider ${theme.text} shadow-sm`}>
            <Icon className="text-[8px] sm:text-xs" /> {getTypeLabel(item.type)}
          </span>
        </div>
        
        <div className="absolute right-2 sm:right-3 top-12 sm:top-14 inline-flex items-center gap-1 rounded-full bg-slate-950/80 px-2 sm:px-2.5 py-0.5 sm:py-1 text-[9px] sm:text-xs font-bold text-white">
          <FiImage className="text-[10px] sm:text-[11px]" /> {images.length}
        </div>

        {images.length > 1 && (
          <div className="absolute inset-x-2 sm:inset-x-3 bottom-2 sm:bottom-3 flex gap-1 sm:gap-2 overflow-x-auto rounded-lg sm:rounded-xl bg-slate-950/65 p-1.5 sm:p-2 backdrop-blur-md">
            {images.slice(0, 6).map((thumb, index) => (
              <span
                key={thumb.url}
                onClick={(event) => {
                  event.stopPropagation();
                  setActiveImageIndex(index);
                }}
                className={`relative h-12 w-16 shrink-0 overflow-hidden rounded-lg border transition ${
                  activeImageIndex === index ? 'border-white ring-2 ring-white/45' : 'border-white/20 opacity-75'
                }`}
              >
                <img src={thumb.url} alt={thumb.altText || `${item.title} ${index + 1}`} className="h-full w-full object-cover" />
              </span>
            ))}
            {images.length > 6 && (
              <span className="flex h-12 w-16 shrink-0 items-center justify-center rounded-lg bg-white/15 text-xs font-black text-white">
                +{images.length - 6}
              </span>
            )}
          </div>
        )}
      </div>

      <div className="flex min-h-[300px] flex-1 flex-col p-5 sm:p-6">
        <h3 className="text-2xl font-black leading-tight text-slate-950">
          {item.title}
        </h3>
        
        {(item.shortDescription || item.description) && (
          <p className="mt-3 text-sm font-medium leading-7 text-slate-600 line-clamp-4">
            {item.shortDescription || item.description}
          </p>
        )}

        <div className="mt-5 flex flex-wrap gap-2">
          {detailCount > 0 && (
            <span className="flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600">
              <FiLayers className="text-xs" /> {detailCount}
            </span>
          )}
          {item.location && (
            <span className="flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600">
              <FiMapPin className="text-xs" /> {item.location.length > 20 ? item.location.slice(0, 20) + '...' : item.location}
            </span>
          )}
        </div>

        {images.length > 1 && (
          <div className="mt-5 grid grid-cols-4 gap-2 sm:grid-cols-6">
            {images.slice(0, 6).map((thumb, index) => (
              <span
                key={`${thumb.url}-small`}
                onClick={(event) => {
                  event.stopPropagation();
                  setActiveImageIndex(index);
                }}
                className={`relative aspect-[4/3] overflow-hidden rounded-lg border bg-slate-100 ${
                  activeImageIndex === index ? 'border-slate-900' : 'border-slate-200'
                }`}
              >
                <img src={thumb.url} alt={thumb.altText || `${item.title} preview ${index + 1}`} className="h-full w-full object-cover" />
              </span>
            ))}
          </div>
        )}

        <div className="mt-auto flex items-center justify-between pt-6">
          <span className="text-xs font-black uppercase tracking-wider text-slate-400">View Details</span>
          <span className={`ml-2 flex h-9 w-9 items-center justify-center rounded-xl ${theme.iconBg} text-white transition group-hover:translate-x-0.5`}>
            <FiChevronRight className="text-sm" />
          </span>
        </div>
      </div>
    </button>
  );
};

const HubCarousel = ({ items, onView }) => {
  if (!items?.length) return null;

  return (
    <div className="grid gap-5 rounded-2xl bg-slate-50 p-3 sm:p-4">
      {items.map((item) => (
        <HubCard
          key={`${item.type}-${item.id}`}
          item={item}
          onView={() => onView(item)}
        />
      ))}
    </div>
  );
};

const HubList = ({ items, onView }) => {
  if (!items?.length) return null;

  return (
    <div className="w-full divide-y divide-slate-100 border-y border-slate-200 bg-white">
      {items.map((item) => {
        const images = normalizeSchoolImages(item);
        const image = images[0]?.url;
        const Icon = ICONS[item.type] || FiLayers;
        const theme = TYPE_THEMES[item.type] || TYPE_THEMES.DEPARTMENT;
        const detailCount = Array.isArray(item.details) ? item.details.length : 0;

        return (
          <button
            key={`${item.type}-${item.id}`}
            onClick={() => onView(item)}
            className="group flex w-full flex-col gap-4 py-5 text-left transition hover:bg-slate-50 sm:flex-row sm:items-center"
          >
            <div className="h-20 w-full shrink-0 overflow-hidden rounded-xl bg-slate-100 sm:w-28">
              {image ? (
                <img src={image} alt={item.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
              ) : (
                <div className={`flex h-full w-full items-center justify-center ${theme.bg}`}>
                  <Icon className={`text-3xl ${theme.text}`} />
                </div>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wider ${theme.bg} ${theme.text}`}>
                <Icon className="text-xs" /> {getTypeLabel(item.type)}
              </span>
              <h3 className="mt-2 text-xl font-black text-slate-950">{item.title}</h3>
              {(item.shortDescription || item.description) && (
                <p className="mt-2 max-w-5xl text-sm leading-6 text-slate-600">
                  {item.shortDescription || item.description}
                </p>
              )}
              <div className="mt-3 flex flex-wrap gap-2">
                {detailCount > 0 && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600">
                    <FiLayers className="text-xs" /> {detailCount} details
                  </span>
                )}
                {item.contactName && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700">
                    <FiUserCheck className="text-xs" /> {item.contactName}
                  </span>
                )}
                {images.length > 0 && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600">
                    <FiImage className="text-xs" /> {images.length} photo{images.length === 1 ? '' : 's'}
                  </span>
                )}
              </div>
            </div>

            <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${theme.iconBg} text-white transition group-hover:translate-x-0.5`}>
              <FiChevronRight className="text-sm" />
            </span>
          </button>
        );
      })}
    </div>
  );
};

// Main Component
export default function PublicSchoolHubPage({
  title = "School Hub",
  eyebrow = "Kinyui Boys Senior School",
  description = SCHOOL_INFO.description,
  singleType,
  sections,
  departments = false,
  emptyText = 'No information available yet.',
}) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [active, setActive] = useState(null);

  const load = async (isRefresh = false) => {
    try {
      setError('');
      if (isRefresh) setRefreshing(true);
      else setLoading(true);

      if (departments) {
        const res = await fetch('/api/staff/departments?grouped=1', { cache: 'no-store' });
        const data = await res.json();
        if (!res.ok || !data.success) throw new Error(data.error || `Failed to load departments (${res.status})`);
        setItems((data.departments || []).map(buildDepartmentItem));
      } else if (Array.isArray(sections) && sections.length > 0) {
        const responses = await Promise.all(sections.map((section) => fetch(`/api/schoolhub?type=${section.type}`, { cache: 'no-store' })));
        const payloads = await Promise.all(responses.map((res) => res.json()));
        const failed = responses.findIndex((res, index) => !res.ok || !payloads[index].success);
        if (failed >= 0) throw new Error(payloads[failed].error || `Failed to load ${sections[failed].title}`);
        const merged = payloads.flatMap((data, index) =>
          Array.isArray(data.items) ? data.items.map((item) => ({ ...item, sectionTitle: sections[index].title })) : []
        );
        setItems(merged);
      } else {
        const res = await fetch(`/api/schoolhub?type=${singleType || 'CLUB'}`, { cache: 'no-store' });
        const data = await res.json();
        if (!res.ok || !data.success) throw new Error(data.error || `Failed to load ${title} (${res.status})`);
        setItems(Array.isArray(data.items) ? data.items : []);
      }
    } catch (e) {
      setItems([]);
      setError(e?.message || `Failed to load ${title}.`);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { load(false); }, []);

  const visibleItems = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter((item) =>
      [item.title, item.shortDescription, item.description, item.contactName, item.location, item.established, item.sectionTitle]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(q))
    );
  }, [items, search]);

  const renderedSections = useMemo(() => {
    if (Array.isArray(sections) && sections.length > 0) {
      return sections.map((section) => ({
        ...section,
        items: visibleItems.filter((item) => item.type === section.type),
      }));
    }
    if (departments) {
      return [
        { title: 'CBC Departments', type: 'DEPARTMENT', icon: FiLayers, items: visibleItems.filter((item) => item.category === 'CBC') },
        { title: '8-4-4 Departments', type: 'DEPARTMENT', icon: FiBookOpen, items: visibleItems.filter((item) => item.category === 'EIGHT_FOUR_FOUR') },
        { title: 'Teaching Departments', type: 'DEPARTMENT', icon: FiBookOpen, items: visibleItems.filter((item) => item.category === 'TEACHING') },
        { title: 'Support Departments', type: 'DEPARTMENT', icon: FiShield, items: visibleItems.filter((item) => item.category === 'SUPPORT') },
      ];
    }
    return [{ title, type: singleType || 'CLUB', items: visibleItems }];
  }, [departments, sections, singleType, title, visibleItems]);

  const totalImages = items.reduce((sum, item) => sum + normalizeSchoolImages(item).length, 0);
  const activeSectionCount = renderedSections.filter((section) => section.items.length > 0).length;
  const heroType = singleType || sections?.[0]?.type || 'DEPARTMENT';
  const HeroIcon = ICONS[heroType] || FiGrid;
  const heroStats = [
    { label: 'Published Items', value: items.length, icon: FiLayers },
    { label: 'Gallery Photos', value: totalImages, icon: FiImage },
    { label: 'Active Sections', value: activeSectionCount || renderedSections.length, icon: FiGrid },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] text-gray-900">
      <GalleryModal item={active} onClose={() => setActive(null)} />
<main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
  <section className="overflow-hidden rounded-2xl bg-transparent text-slate-950">
    <div className="grid gap-8 px-5 py-8 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-stretch lg:px-10 lg:py-10">
      <div className="flex flex-col justify-center">
      <div className="inline-flex max-w-full items-center gap-2 sm:gap-3 rounded-full bg-amber-50 px-3 sm:px-4 py-1.5 sm:py-2 text-[10px] sm:text-[11px] font-black uppercase tracking-[0.14em] text-amber-900">
        <span className="flex h-8 sm:h-10 w-8 sm:w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white ring-1 ring-amber-100">
          <Image
            src="/seo/SchoolLogo.png"
            alt="Kinyui Boys Senior School logo"
            width={40}
            height={40}
            className="h-full w-full object-contain p-0.5 sm:p-1"
          />
        </span>

        {renderSchoolName(eyebrow)}
      </div>

      <div className="mt-6 sm:mt-8 flex h-12 sm:h-16 w-12 sm:w-16 items-center justify-center rounded-lg sm:rounded-2xl bg-[#3b1e0a] text-white shadow-sm">
        <HeroIcon className="text-2xl sm:text-3xl" />
      </div>

      <div className="mt-8 max-w-4xl">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black leading-tight tracking-tight">
          {title}
          <span className="block text-slate-700">
            {renderSchoolName(SCHOOL_INFO.name)}
          </span>
        </h1>

        <p className="mt-4 sm:mt-5 max-w-2xl text-xs sm:text-sm md:text-base font-medium leading-6 sm:leading-7 text-slate-600">
          {description || SCHOOL_INFO.description}
        </p>
      </div>

      <div className="relative mt-8 sm:mt-10 grid grid-cols-2 gap-2 sm:gap-3 md:grid-cols-3">
        {heroStats.map(({ label, value, icon: StatIcon }, index) => (
          <div
            key={label}
            className={`min-h-[100px] sm:min-h-[128px] rounded-lg sm:rounded-2xl border border-white/10 bg-slate-950 p-3 sm:p-5 text-white ${
              index === 0 ? 'col-span-2 md:col-span-1' : ''
            }`}
          >
            <div className="flex items-start justify-between gap-2 sm:gap-3">
              <StatIcon className="text-xl sm:text-2xl text-blue-300" />
              <p className="text-2xl sm:text-3xl font-black leading-none">
                {value}
              </p>
            </div>

            <p className="mt-6 text-[10px] font-black uppercase tracking-widest text-white/45">
              {label}
            </p>
          </div>
        ))}
      </div>
      </div>

      <div className="flex flex-col justify-between rounded-lg sm:rounded-2xl bg-slate-950 p-3 sm:p-5 text-white">
        <div className="aspect-[4/3] overflow-hidden rounded-lg sm:rounded-xl bg-slate-800">
          <img src="/hero/kinyui.jpeg" alt="Kinyui Boys Senior School students and school life" className="h-full w-full object-cover" />
        </div>
        <div className="mt-3 sm:mt-5 rounded-lg sm:rounded-xl bg-white/5 p-3 sm:p-5">
        <p className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.18em] text-slate-500">
          {renderSchoolName(SCHOOL_INFO.shortName)}
        </p>

        <h2 className="mt-1.5 sm:mt-2 text-lg sm:text-2xl font-black text-white">
          {SCHOOL_INFO.motto}
        </h2>
        </div>
      </div>
    </div>
  </section>

  <section className="mt-4 sm:mt-6 rounded-lg sm:rounded-2xl bg-white p-3 sm:p-5 shadow-sm ring-1 ring-slate-200">
    <div className="flex flex-col gap-3 sm:gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="text-center lg:text-left">
        <p className="text-[9px] sm:text-xs font-black uppercase tracking-[0.16em] text-slate-500">
          Explore School Life
        </p>

        <h2 className="mt-1 sm:mt-2 text-lg sm:text-xl font-black text-slate-950">
          Search clubs, departments, leadership, boarding, and school services
        </h2>
      </div>

      <div className="flex w-full flex-col gap-2 sm:gap-3 sm:flex-row lg:max-w-2xl">
        <div className="relative flex-1">
          <FiSearch className="pointer-events-none absolute left-2.5 sm:left-4 top-1/2 -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-slate-400" />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={`Search ${title.toLowerCase()}...`}
            className="h-10 sm:h-12 w-full rounded-lg sm:rounded-xl bg-slate-50 py-2 sm:py-3 pl-9 sm:pl-11 pr-3 sm:pr-4 text-xs sm:text-sm font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:bg-white focus:ring-4 focus:ring-slate-500/10"
          />
        </div>

        <RefreshButton refreshing={refreshing} onClick={() => load(true)} />
      </div>
    </div>
  </section>

  {error && (
    <div className="mt-4 sm:mt-6 flex items-center justify-between rounded-lg sm:rounded-2xl border border-red-200 bg-red-50 px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-bold text-red-700">
      <span className="flex items-center gap-1.5 sm:gap-2">
        <FiAlertTriangle className="text-sm sm:text-base" /> {error}
      </span>

      <button
        onClick={() => setError("")}
        className="rounded-lg p-1 sm:p-2 text-red-600 transition hover:bg-red-100 hover:text-red-800"
      >
        <FiX className="text-sm sm:text-base" />
      </button>
    </div>
  )}

  <section className="mt-6 sm:mt-8">
    {loading ? (
      <ModernLoadingSpinner message={`Loading ${title.toLowerCase()} content...`} />
    ) : visibleItems.length === 0 ? (
      <div className="rounded-lg sm:rounded-2xl bg-white p-6 sm:p-12 text-center shadow-sm">
        <div className="mx-auto mb-3 sm:mb-4 flex h-12 sm:h-16 w-12 sm:w-16 items-center justify-center rounded-lg sm:rounded-2xl bg-slate-100">
          <FiLayers className="text-2xl sm:text-4xl text-slate-400" />
        </div>

        <h2 className="text-base sm:text-xl font-black text-slate-800">
          {emptyText}
        </h2>

        <p className="mt-2 text-xs sm:text-sm font-medium text-slate-500">
          Check back soon for updates.
        </p>
      </div>
    ) : (
      <div className="space-y-8 sm:space-y-10">
        {renderedSections.map((section) => {
          if (!section.items.length) return null;

          const SectionIcon = section.icon || ICONS[section.type] || FiLayers;

          return (
            <section key={section.title}>
              <div className="mb-3 sm:mb-5 flex flex-col items-center justify-between gap-2 sm:gap-3 pb-3 sm:pb-4 text-center sm:flex-row sm:text-left">
                <div className="flex flex-col items-center gap-2 sm:gap-3 sm:flex-row">
                  <div className="flex h-10 sm:h-12 w-10 sm:w-12 items-center justify-center rounded-lg sm:rounded-2xl bg-slate-900 text-white shadow-md">
                    <SectionIcon className="text-sm sm:text-base" />
                  </div>

                  <div>
                    <h2 className="text-lg sm:text-xl font-black text-slate-950">
                      {section.title}
                    </h2>

                    <p className="text-[9px] sm:text-xs font-bold uppercase text-slate-500">
                      {section.items.length}{" "}
                      {section.items.length === 1 ? "item" : "items"} available
                    </p>
                  </div>
                </div>
              </div>

              {departments ? (
                <HubList items={section.items} onView={setActive} />
              ) : (
                <HubCarousel items={section.items} onView={setActive} />
              )}
            </section>
          );
        })}
      </div>
      </div>
    )}
  </section>
</main>
      
      {/* Custom Animation Styles */}
      <style jsx global>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        .animate-bounce {
          animation: bounce 0.8s infinite ease-in-out;
        }
        @keyframes school-hub-card-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .school-hub-carousel-mask {
          overflow: hidden;
          -webkit-mask-image: linear-gradient(90deg, transparent, #000 7%, #000 93%, transparent);
          mask-image: linear-gradient(90deg, transparent, #000 7%, #000 93%, transparent);
        }
        .school-hub-carousel-track {
          width: max-content;
          animation-name: school-hub-card-scroll;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }
        .school-hub-carousel-track:hover {
          animation-play-state: paused;
        }
        .school-hub-carousel-static {
          animation: none;
        }
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}
