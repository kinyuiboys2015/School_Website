"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { 
  ChevronLeft, ChevronRight, ArrowRight, 
  Trophy, BookOpen, Clock, 
  Play, X, MapPin, Sparkles, GraduationCap, Users, School, Award
} from 'lucide-react';
import { GiGraduateCap } from 'react-icons/gi';
import { useRouter } from 'next/navigation';

const heroSlides = [
  {
    title: "Kinyui",
    titleAccent: "Senior",
    subtitle: "Matungulu, Machakos County",
    description: "A Extra County Level public boys' boarding school in Matungulu sub-county. Established to serve the Eastern Region with excellence in STEM, Social Sciences, and Arts & Sports pathways under CBC curriculum.",
    image: "/home/student-leaders-library.jpg",
    tags: ["Public School", "Boys' Boarding", "STEM", "Social Sciences"],
    cta: "Admissions",
    link: "/pages/admissions",
    accent: "blue",
  },
  {
    title: "CBC",
    titleAccent: "Pathways",
    subtitle: "Curriculum & Programs",
    description: "Specialized pathways including Pure Sciences, Applied Sciences, Humanities & Business Studies, and Creative Arts. Career guidance and mentorship programs available.",
    image: "/home/teacher-student.jpg",
    tags: ["STEM", "Social Sciences", "Arts & Sports", "Mentorship"],
    cta: "Learn More",
    link: "/pages/AboutUs",
    accent: "emerald",
  },
  {
    title: "Eastern",
    titleAccent: "Pride",
    subtitle: "Regional Excellence",
    description: "A C3 public senior school serving Matungulu, Machakos, and the greater Eastern Region. Boarding options with strong community ties and academic track record.",
    image: "/home/campus-student-life.jpg",
    tags: ["Community", "Regional", "Boarding", "Excellence"],
    cta: "Contact Us",
    link: "/pages/contact",
    accent: "amber",
  }
];

const accentColors = {
  blue: { text: "text-blue-400", bg: "bg-blue-700", border: "border-blue-700/40", glow: "shadow-blue-700/20", ring: "ring-blue-700/30", gradient: "from-blue-900 to-blue-700" },
  emerald: { text: "text-emerald-400", bg: "bg-emerald-700", border: "border-emerald-700/40", glow: "shadow-emerald-700/20", ring: "ring-emerald-700/30", gradient: "from-emerald-900 to-emerald-700" },
  amber: { text: "text-amber-400", bg: "bg-amber-800", border: "border-amber-800/40", glow: "shadow-amber-800/20", ring: "ring-amber-800/30", gradient: "from-amber-900 to-amber-800" },
};

const extractYouTubeId = (url) => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url?.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

const ModernHero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [schoolData, setSchoolData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [navigationBlocked, setNavigationBlocked] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [progress, setProgress] = useState(0);

  const router = useRouter();

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setNavigationBlocked(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (showVideoModal) return;
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) return 100;
        return prev + (100 / 80);
      });
    }, 100);
    return () => clearInterval(interval);
  }, [currentSlide, showVideoModal]);

  const handleSlideChange = useCallback((index) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentSlide(index);
      setIsTransitioning(false);
    }, 500);
  }, []);

  const nextSlide = useCallback(() => {
    handleSlideChange(currentSlide === heroSlides.length - 1 ? 0 : currentSlide + 1);
  }, [currentSlide, handleSlideChange]);

  const prevSlide = useCallback(() => {
    handleSlideChange(currentSlide === 0 ? heroSlides.length - 1 : currentSlide - 1);
  }, [currentSlide, handleSlideChange]);

  const openVideoModal = useCallback(() => setShowVideoModal(true), []);
  const closeVideoModal = useCallback(() => {
    setShowVideoModal(false);
    setSchoolData(null);
    setError(null);
  }, []);

  const handleSlideButtonClick = useCallback(() => {
    if (navigationBlocked) return;
    const link = heroSlides[currentSlide].link;
    setTimeout(() => router.push(link), 100);
  }, [currentSlide, router, navigationBlocked]);

  const handleContactClick = useCallback(() => {
    closeVideoModal();
    if (navigationBlocked) return;
    setTimeout(() => router.push('/pages/AboutUs'), 100);
  }, [closeVideoModal, router, navigationBlocked]);

  useEffect(() => {
    if (showVideoModal) {
      setLoading(true);
      setError(null);
      fetch('/api/school')
        .then(response => {
          if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
          return response.json();
        })
        .then(data => {
          if (data.success && data.school) { setSchoolData(data.school); setError(null); }
          else throw new Error(data.message || 'No school data found');
        })
        .catch(err => { console.error('Error fetching school video:', err); setError(err.message); setSchoolData(null); })
        .finally(() => setLoading(false));
    }
  }, [showVideoModal]);

  useEffect(() => {
    if (showVideoModal) return;
    const timer = setInterval(() => nextSlide(), 8000);
    return () => clearInterval(timer);
  }, [currentSlide, nextSlide, showVideoModal]);

  const retryVideoLoad = useCallback(() => {
    setLoading(true);
    setError(null);
    fetch('/api/school')
      .then(response => {
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return response.json();
      })
      .then(data => {
        if (data.success && data.school) { setSchoolData(data.school); setError(null); }
        else throw new Error(data.message || 'No school data found');
      })
      .catch(err => { console.error('Error fetching school video:', err); setError(err.message); setSchoolData(null); })
      .finally(() => setLoading(false));
  }, []);

  const slide = heroSlides[currentSlide];
  const colors = accentColors[slide.accent];

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gray-950 font-sans">
      {/* Background Images */}
      {heroSlides.map((s, idx) => (
        <div
          key={idx}
          className={`absolute inset-0 transition-all duration-[1200ms] ease-in-out ${
            idx === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-110'
          }`}
        >
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${s.image})` }}
          />
        </div>
      ))}
      {/* Low-opacity hero background image */}
      <div className="absolute inset-0 pointer-events-none select-none">
        <img src="/home/students-campus-grounds.jpg" alt="Kinyui students on campus" className="w-full h-full object-cover opacity-20" />
      </div>
      {/* Logo watermark overlay */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
        <img src="/SchoolLogo.png" alt="Kinyui Logo" className="w-1/2 max-w-xs opacity-10" />
      </div>

      {/* Overlay with adjusted padding for content */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/30" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/40" />

      {/* Decorative grid pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
        backgroundSize: '60px 60px'
      }} />

      {/* Left accent bar */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 md:w-1.5 ${colors.bg} z-30 transition-colors duration-700`} />

      {/* Slide number badge */}
      <div className="absolute top-6 left-6 md:top-10 md:left-10 z-30 flex items-center gap-3">
        <span className={`text-5xl md:text-7xl font-black ${colors.text} opacity-20 leading-none select-none transition-colors duration-700`}>
          0{currentSlide + 1}
        </span>
        <div className="flex flex-col gap-1">
          {heroSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => handleSlideChange(i)}
              className={`h-1 rounded-full transition-all duration-500 ${
                i === currentSlide ? `w-8 ${colors.bg}` : 'w-3 bg-white/20 hover:bg-white/40'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Main Content — with 20% padding from both left and right */}
      <div className={`relative z-20 h-full flex flex-col justify-center px-[10%] md:px-[20%] transition-all duration-500 ${isTransitioning ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
        
        {/* Subtitle tag */}
        <div className="flex items-center gap-2 mb-4 md:mb-5">
          <MapPin className={`w-3.5 h-3.5 ${colors.text}`} />
          <span className={`text-xs md:text-sm uppercase tracking-[0.2em] font-semibold ${colors.text}`}>{slide.subtitle}</span>
        </div>

        {/* Title — reduced size */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white leading-[1.1] mb-4 md:mb-6">
          {slide.title}
          <span className={`${colors.text} inline-block ml-2`}>
            {slide.titleAccent}
          </span>
        </h1>

        {/* Description with better readability */}
        <p className="text-sm sm:text-base md:text-lg text-gray-300 max-w-2xl leading-relaxed mb-5 md:mb-7">
          {isMobile ? slide.description.substring(0, 200) + '...' : slide.description}
        </p>

        {/* Tags row */}
        <div className="flex flex-wrap gap-2 mb-6 md:mb-8">
          {slide.tags.map((tag, i) => (
            <span
              key={i}
              className={`px-3 py-1.5 text-[10px] sm:text-xs font-medium uppercase tracking-wider 
                rounded-full border ${colors.border} text-white/80 bg-white/5 backdrop-blur-sm
                transition-all duration-300 hover:bg-white/10`}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={handleSlideButtonClick}
            disabled={navigationBlocked}
            className={`group relative px-6 sm:px-8 py-3 sm:py-3.5 bg-gradient-to-r ${colors.gradient} 
              text-white rounded-lg font-bold text-sm sm:text-base
              hover:shadow-lg ${colors.glow} hover:shadow-xl
              transition-all duration-300
              flex items-center gap-2
              disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {slide.cta}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={openVideoModal}
            className="group flex items-center gap-2 px-5 sm:px-6 py-3 sm:py-3.5
              border border-white/20 text-white rounded-lg font-semibold text-sm sm:text-base
              hover:bg-white/10 hover:border-white/40
              backdrop-blur-sm transition-all duration-300"
          >
            <span className="relative flex items-center justify-center w-6 h-6 rounded-full bg-white/15 group-hover:bg-white/25 transition-colors">
              <Play className="w-3 h-3 ml-0.5" />
            </span>
            {isMobile ? 'Tour' : 'Virtual Tour'}
          </button>
        </div>
      </div>

      {/* Right-side info card with additional Kinyui Boys info */}
      {!isMobile && (
        <div className={`absolute right-14 lg:right-24 top-1/2 -translate-y-1/2 z-20 w-72 lg:w-80 
          transition-all duration-700 ${isTransitioning ? 'opacity-0 translate-x-8' : 'opacity-100 translate-x-0'}`}>
          <div className="bg-white/[0.07] backdrop-blur-xl border border-white/10 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colors.gradient} flex items-center justify-center`}>
                <GiGraduateCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-white font-bold text-base">Kinyui Boys</p>
                <p className="text-gray-400 text-xs">Senior School</p>
              </div>
            </div>
            
            <div className="h-px bg-white/10" />
            
            {/* School Details */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <School className="w-3.5 h-3.5 text-gray-400" />
                <span className="text-gray-400 text-xs">Category:</span>
                <span className={`text-xs font-semibold ${colors.text}`}>C3 Public School</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-3.5 h-3.5 text-gray-400" />
                <span className="text-gray-400 text-xs">Enrollment:</span>
                <span className="text-white text-xs">Boys' Boarding</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-gray-400" />
                <span className="text-gray-400 text-xs">Location:</span>
                <span className="text-white text-xs">Matungulu, Machakos</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-3.5 h-3.5 text-gray-400" />
                <span className="text-gray-400 text-xs">Region:</span>
                <span className="text-white text-xs">Eastern Region</span>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="w-3.5 h-3.5 text-gray-400" />
                <span className="text-gray-400 text-xs">Curriculum:</span>
                <span className="text-white text-xs">CBC Pathways</span>
              </div>
            </div>
            
            <div className="h-px bg-white/10" />
            
            {/* Additional Info */}
            <div className="bg-white/5 rounded-xl p-3 space-y-2">
              <p className="text-white/70 text-xs font-semibold">Quick Facts:</p>
              <div className="grid grid-cols-2 gap-2 text-[10px]">
                <span className="text-gray-400">Founded:</span>
                <span className="text-white">1970s</span>
                <span className="text-gray-400">Status:</span>
                <span className="text-white">Active</span>
                <span className="text-gray-400">Type:</span>
                <span className="text-white">Boarding</span>
              </div>
            </div>
            
            <button
              onClick={openVideoModal}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 
                text-white text-xs font-semibold transition-colors duration-300 border border-white/5"
            >
              <Play className="w-3.5 h-3.5" />
              Watch School Tour
            </button>
          </div>
        </div>
      )}

      {/* Navigation arrows */}
      <div className={`absolute z-30 flex gap-2 ${isMobile ? 'bottom-20 right-5' : 'bottom-8 right-8'}`}>
        <button 
          onClick={prevSlide}
          className="w-10 h-10 md:w-12 md:h-12 rounded-xl border border-white/15 text-white 
            hover:bg-white hover:text-black transition-all duration-300 
            backdrop-blur-sm bg-white/5 flex items-center justify-center"
        >
          <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
        </button>
        <button 
          onClick={nextSlide}
          className="w-10 h-10 md:w-12 md:h-12 rounded-xl border border-white/15 text-white 
            hover:bg-white hover:text-black transition-all duration-300 
            backdrop-blur-sm bg-white/5 flex items-center justify-center"
        >
          <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
        </button>
      </div>

      {/* Bottom progress bar */}
      <div className="absolute bottom-0 left-0 right-0 z-30 h-1 bg-white/5">
        <div 
          className={`h-full ${colors.bg} transition-all duration-100 ease-linear`}
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Bottom info strip with 20% padding */}
      <div className={`absolute bottom-1 left-0 right-0 z-20 py-2.5 px-[10%] md:px-[20%]
        flex items-center ${isMobile ? 'justify-center' : 'justify-between'}
        text-white/50 text-[10px] md:text-xs uppercase tracking-[0.15em] font-medium`}>
        {isMobile ? (
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1"><MapPin className="w-2.5 h-2.5" /> Matungulu</span>
            <span className="flex items-center gap-1"><Trophy className="w-2.5 h-2.5" /> C3 Public</span>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-6">
              <span className="flex items-center gap-1.5"><School className="w-3 h-3" /> Kinyui Boys Senior School</span>
              <span className="flex items-center gap-1.5"><MapPin className="w-3 h-3" /> Matungulu, Machakos</span>
              <span className="flex items-center gap-1.5"><Users className="w-3 h-3" /> Boys' Boarding</span>
            </div>
            <div className="flex items-center gap-6">
              <span className="flex items-center gap-1.5"><BookOpen className="w-3 h-3" /> CBC Pathways</span>
              <span className="text-white/30">
                {String(currentSlide + 1).padStart(2, '0')} / {String(heroSlides.length).padStart(2, '0')}
              </span>
            </div>
          </>
        )}
      </div>

      {/* Video Modal */}
      {showVideoModal && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-2 sm:p-4">
          <div className="relative w-full max-w-full sm:max-w-4xl md:max-w-5xl lg:max-w-6xl rounded-xl sm:rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl">
            <div className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-black/80 to-transparent p-3 sm:p-4 flex items-center justify-between">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className={`w-8 h-8 md:w-10 md:h-10 rounded-xl bg-gradient-to-br ${colors.gradient} flex items-center justify-center flex-shrink-0`}>
                  <Play className="text-white w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
                <div className="overflow-hidden">
                  <h4 className="text-white font-bold text-xs sm:text-sm md:text-base truncate">Kinyui Boys School Tour</h4>
                  <p className="text-white/50 text-[10px] sm:text-xs truncate">
                    {schoolData?.name || 'Kinyui Boys Senior School'} — Virtual Tour
                  </p>
                </div>
              </div>
              <button
                onClick={closeVideoModal}
                className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-white/10 text-white 
                  hover:bg-white/20 transition-colors flex items-center justify-center"
                aria-label="Close video"
              >
                <X className="w-4 h-4 md:w-5 md:h-5" />
              </button>
            </div>
            
            <div className="relative bg-black aspect-video">
              {loading ? (
                <div className="w-full h-full flex flex-col items-center justify-center">
                  <div className="animate-spin rounded-full h-10 w-10 border-2 border-white/20 border-t-white mb-4"></div>
                  <p className="text-white/70 text-sm">Loading video tour...</p>
                </div>
              ) : error ? (
                <div className="w-full h-full flex flex-col items-center justify-center p-6">
                  <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
                    <X className="w-6 h-6 text-red-400" />
                  </div>
                  <p className="text-white text-center text-sm mb-4">{error}</p>
                  <button
                    onClick={retryVideoLoad}
                    className={`px-4 py-2 bg-gradient-to-r ${colors.gradient} text-white rounded-lg text-sm font-medium`}
                  >
                    Retry Loading
                  </button>
                </div>
              ) : schoolData?.videoType === 'youtube' && schoolData?.videoTour ? (
                <iframe
                  src={`https://www.youtube.com/embed/${extractYouTubeId(schoolData.videoTour)}?autoplay=1&rel=0&modestbranding=1&controls=1`}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={`${schoolData.name} Virtual Tour`}
                />
              ) : schoolData?.videoType === 'file' && schoolData?.videoTour ? (
                <video
                  src={schoolData.videoTour}
                  className="w-full h-full"
                  autoPlay
                  controls
                  title={`${schoolData.name} Virtual Tour`}
                  poster={schoolData?.videoThumbnail}
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-6">
                  <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-4">
                    <Play className="w-6 h-6 text-gray-500" />
                  </div>
                  <p className="text-gray-400 text-center text-sm">No video tour available</p>
                </div>
              )}
            </div>
            
            <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black/80 to-transparent p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <p className="text-white/50 text-xs hidden sm:block">Experience Kinyui Boys Senior School from anywhere</p>
                <button
                  onClick={handleContactClick}
                  className={`px-5 py-2.5 text-sm bg-gradient-to-r ${colors.gradient} 
                    text-white font-semibold rounded-lg hover:opacity-90 transition-all duration-300 
                    disabled:opacity-50 disabled:cursor-not-allowed`}
                  disabled={navigationBlocked}
                >
                  {isMobile ? 'Learn More' : 'Get To Know Us More'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {navigationBlocked && (
        <div className="absolute inset-0 z-40 pointer-events-none">
          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 
            bg-black/60 text-white/70 text-[10px] px-3 py-1.5 rounded-full backdrop-blur-sm">
            Loading...
          </div>
        </div>
      )}
    </div>
  );
};

export default ModernHero;
