"use client";
import React, { useState, useEffect } from "react";
import {
  FiHome,
  FiArrowLeft,
  FiBook,
  FiMail,
  FiCalendar,
  FiBookOpen,
  FiUsers,
  FiBell,
  FiSearch,
  FiAlertCircle,
  FiMapPin,
  FiGlobe,
  FiChevronRight,
  FiStar,
  FiAward,
  FiTarget,
  FiCompass,
  FiBriefcase,
} from "react-icons/fi";

const KinyuiBoys404 = () => {
  const [currentMessage, setCurrentMessage] = useState(0);

  const quickLinks = [
    {
      name: "Home Base",
      href: "/",
      icon: FiHome,
      description: "Back to main campus",
      color: "from-rose-500 to-rose-700",
    },
    {
      name: "Academics",
      href: "/pages/academics",
      icon: FiBook,
      description: "Course directory",
      color: "from-blue-500 to-blue-700",
    },
    {
      name: "Gallery",
      href: "/pages/gallery",
      icon: FiBookOpen,
      description: "School memories",
      color: "from-purple-500 to-purple-700",
    },
    {
      name: "Admissions",
      href: "/pages/admissions",
      icon: FiUsers,
      description: "Join Kinyui family",
      color: "from-emerald-500 to-emerald-700",
    },
    {
      name: "Events & News",
      href: "/pages/eventsandnews",
      icon: FiCalendar,
      description: "Upcoming events",
      color: "from-orange-500 to-orange-700",
    },
    {
      name: "Contact Us",
      href: "/pages/contact",
      icon: FiMail,
      description: "Talk to the office",
      color: "from-cyan-500 to-cyan-700",
    },
    {
      name: "Student Portal",
      href: "/pages/StudentPortal",
      icon: FiCompass,
      description: "Student resources",
      color: "from-indigo-500 to-indigo-700",
    },
    {
      name: "Guidance",
      href: "/pages/Guidance-and-Councelling",
      icon: FiBriefcase,
      description: "Guidance sessions",
      color: "from-pink-500 to-pink-700",
    },
  ];

  const errorMessages = [
    "Oops! This page seems to be on a field trip!",
    "Looks like this classroom is empty!",
    "This page is in detention!",
    "Lesson plan not found!",
    "This page has been sent to the principal's office!",
    "Even the best students lose their way sometimes!",
    "This page is still in assembly!",
    "404: Lesson cancelled today!",
  ];

  useEffect(() => {
    setCurrentMessage(Math.floor(Math.random() * errorMessages.length));
    const messageInterval = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % errorMessages.length);
    }, 5000);
    return () => clearInterval(messageInterval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 overflow-hidden relative font-sans text-slate-900 antialiased">
      
      {/* Background Logo with Gradient Overlay */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {/* Gradient overlay on top of logo */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-50/90 via-orange-50/85 to-yellow-50/90 z-10"></div>
        
        {/* Second gradient overlay for better blending */}
        <div className="absolute inset-0 bg-gradient-to-t from-white/20 via-transparent to-amber-100/30 z-10"></div>
        
        {/* The logo image */}
        <div 
          className="absolute inset-0 flex items-center justify-center z-0"
          style={{
            backgroundImage: `url('/kbss.png')`,
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'contain',
            opacity: 0.40, // Reduced opacity for subtle effect
          }}
        ></div>
        
        {/* Alternative: If you want the logo to repeat as a pattern */}
        {/* <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url('/kbss.png')`,
            backgroundPosition: 'center',
            backgroundRepeat: 'repeat',
            backgroundSize: '200px',
            opacity: 0.08,
          }}
        ></div> */}
      </div>

      {/* Decorative Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-[0.03] z-0">
        <div className="absolute top-1/4 -left-8 text-rose-950 scale-[4] rotate-12">
          <FiGlobe />
        </div>
        <div className="absolute bottom-1/4 -right-8 text-rose-950 scale-[4] -rotate-12">
          <FiMapPin />
        </div>
        <div className="absolute top-1/2 left-1/4 text-rose-950 scale-[3] rotate-45">
          <FiSearch />
        </div>
        <div className="absolute top-3/4 right-1/3 text-rose-950 scale-[3] -rotate-45">
          <FiAlertCircle />
        </div>
        <div className="absolute top-1/3 right-1/4 text-rose-950 scale-[2] rotate-90">
          <FiStar />
        </div>
        <div className="absolute bottom-1/3 left-1/3 text-rose-950 scale-[3] rotate-12">
          <FiAward />
        </div>
      </div>

      <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 py-8 md:py-12 relative z-10">
        <div className="container mx-auto max-w-6xl w-full">
          <div className="flex flex-col lg:flex-row gap-8 md:gap-12 lg:gap-16 items-stretch">
            
            {/* Error Message Section - First on mobile, Second on desktop */}
            <div className="w-full lg:w-1/2 order-1 lg:order-2 text-center lg:text-left space-y-6 md:space-y-8 flex flex-col justify-center backdrop-blur-sm bg-white/10 rounded-2xl p-6 lg:p-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 rounded-full text-sm font-semibold tracking-wide border border-amber-200 w-fit mx-auto lg:mx-0">
                <FiBell className="text-base" />
                <span>Kinyui Boys Announcement</span>
              </div>

              <div className="relative">
                <h1 className="text-7xl sm:text-8xl md:text-9xl font-black tracking-tighter text-slate-900 flex justify-center lg:justify-start items-baseline">
                  <span className="text-rose-950 drop-shadow-sm">4</span>
                  <span className="text-rose-800 mx-1 md:mx-2 drop-shadow-sm">
                    0
                  </span>
                  <span className="text-rose-950 drop-shadow-sm">4</span>
                </h1>
                <div className="h-2 w-32 bg-gradient-to-r from-amber-400 via-orange-400 to-amber-400 mx-auto lg:mx-0 mt-2 md:mt-4 rounded-full"></div>
              </div>

              <div className="space-y-4 md:space-y-6">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-800 leading-tight">
                  {errorMessages[currentMessage]}
                </h2>
                <p className="text-base md:text-lg text-slate-600 max-w-lg mx-auto lg:mx-0 leading-relaxed">
                  Even the best students at Kinyui Boys lose their way sometimes.
                  Let's guide you back to your studies with the options below.
                </p>
              </div>

              <div className="flex flex-row items-center gap-2 sm:gap-4 pt-4 w-full justify-center lg:justify-start">
                <a
                  href="/"
                  className="
                    group
                    flex flex-1 sm:flex-none items-center justify-center gap-1.5 sm:gap-3
                    bg-gradient-to-r from-rose-950 to-orange-950
                    text-white
                    px-2 sm:px-6 py-2.5 sm:py-3 md:px-8 md:py-4
                    rounded-xl md:rounded-2xl
                    transition-all duration-300
                    shadow-lg shadow-amber-200/50
                    hover:shadow-xl hover:scale-105
                    active:scale-95
                  "
                >
                  <FiHome className="text-sm sm:text-xl" />
                  <span className="whitespace-nowrap font-black uppercase tracking-tighter sm:tracking-widest text-[10px] sm:text-sm md:text-base">
                    <span className="hidden xs:inline">Back to </span>Assembly
                  </span>
                  <FiChevronRight className="hidden md:block text-lg group-hover:translate-x-1 transition-transform" />
                </a>

                <button
                  onClick={() => window.history.back()}
                  className="
                    group
                    flex flex-1 sm:flex-none items-center justify-center gap-1.5 sm:gap-3
                    bg-white
                    border-2 border-slate-200
                    text-slate-700
                    px-2 sm:px-6 py-2.5 sm:py-3 md:px-8 md:py-4
                    rounded-xl md:rounded-2xl
                    transition-all duration-300
                    shadow-sm
                    hover:shadow-md hover:bg-slate-50
                    active:scale-95
                  "
                >
                  <FiArrowLeft className="text-sm sm:text-xl" />
                  <span className="whitespace-nowrap font-black uppercase tracking-tighter sm:tracking-widest text-[10px] sm:text-sm md:text-base">
                    <span className="hidden xs:inline">Prev</span> Lesson
                  </span>
                </button>
              </div>
            </div>

            {/* Directory Section - Redesigned */}
            <div className="w-full lg:w-1/2 order-2 lg:order-1">
              <div className="relative h-full">
                <div className="absolute -inset-2 sm:-inset-4 bg-gradient-to-tr from-amber-100 via-white to-orange-100 rounded-[2rem] sm:rounded-[3rem] blur-xl opacity-60 -z-10"></div>

                <div className="bg-gradient-to-br from-white/95 to-amber-50/90 backdrop-blur-sm rounded-2xl sm:rounded-[2.5rem] shadow-2xl shadow-slate-200/60 border border-amber-100/80 p-6 sm:p-8 md:p-10 h-full">
                  
                  {/* Header with decorative elements */}
                  <div className="relative mb-8 md:mb-10">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-amber-200/30 to-orange-200/30 rounded-full blur-2xl"></div>
                    <div className="flex items-center justify-between relative">
                      <div>
                        <h3 className="text-2xl sm:text-3xl font-bold text-slate-800 flex items-center gap-3">
                          <div className="p-2 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl shadow-lg">
                            <FiMapPin className="text-white text-xl" />
                          </div>
                          <span className="bg-gradient-to-r from-amber-900 to-orange-800 bg-clip-text text-transparent">
                            Kinyui Directory
                          </span>
                        </h3>
                        <p className="text-slate-500 text-sm mt-2 ml-1">
                          Navigate your way around
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-amber-400 animate-pulse"></div>
                        <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-orange-400"></div>
                        <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-amber-400"></div>
                      </div>
                    </div>
                  </div>

                  {/* Modern grid layout with card design */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                    {quickLinks.map((link, idx) => {
                      const Icon = link.icon;

                      return (
                        <a
                          key={link.name}
                          href={link.href}
                          className="
                            group
                            relative
                            overflow-hidden
                            rounded-xl
                            border border-amber-100
                            bg-white
                            transition-all duration-300
                            hover:shadow-lg hover:scale-[1.02]
                            active:scale-[0.98]
                            cursor-pointer
                          "
                        >
                          {/* Gradient hover effect */}
                          <div className={`absolute inset-0 bg-gradient-to-r ${link.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
                          
                          <div className="relative p-4">
                            <div className="flex items-start gap-3">
                              {/* Icon with gradient background */}
                              <div className={`
                                p-2.5 rounded-lg
                                bg-gradient-to-br ${link.color}
                                shadow-md
                                transition-all duration-300
                                group-hover:scale-110
                                group-hover:shadow-lg
                              `}>
                                <Icon className="text-white text-lg" />
                              </div>

                              {/* Text content */}
                              <div className="flex-1 min-w-0">
                                <h4 className="font-bold text-slate-800 text-sm sm:text-base mb-1 group-hover:text-amber-800 transition-colors">
                                  {link.name}
                                </h4>
                                <p className="text-xs text-slate-500 truncate">
                                  {link.description}
                                </p>
                              </div>

                              {/* Arrow indicator */}
                              <FiChevronRight className="text-slate-300 group-hover:text-amber-500 group-hover:translate-x-1 transition-all duration-300 flex-shrink-0 mt-2" />
                            </div>
                          </div>
                        </a>
                      );
                    })}
                  </div>

                  {/* Enhanced Stats Card */}
                  <div className="mt-6 pt-6 border-t-2 border-amber-200/50">
                    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-900 via-orange-800 to-amber-900 p-5 sm:p-6 text-white shadow-xl">
                    <div className="absolute inset-0 opacity-20"></div>

                    <div className="relative z-10">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <FiAward className="text-amber-300 text-lg" />
                              <p className="text-amber-200 text-xs font-semibold uppercase tracking-wider">
                                School Enrollment
                              </p>
                            </div>
                            <div className="flex items-baseline gap-2">
                              <span className="text-3xl sm:text-4xl font-black text-amber-300">
                                400+
                              </span>
                              <span className="text-sm text-amber-200">
                                Active Students
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-amber-200/80">
                              <FiMapPin className="text-amber-300" />
                              <span>P.O. Box 123 - 90145, Matungulu</span>
                            </div>
                          </div>

                          <a
                            href="/pages/contact"
                            className="
                              group
                              inline-flex
                              items-center
                              gap-2
                              px-5 py-2.5
                              text-sm
                              font-bold
                              rounded-xl
                              border-2 border-amber-400/50
                              bg-white/10
                              backdrop-blur-sm
                              text-white
                              hover:bg-white/20
                              hover:border-amber-400
                              transition-all duration-300
                              hover:scale-105
                            "
                          >
                            <FiMail className="text-amber-300" />
                            Contact Office
                            <FiChevronRight className="group-hover:translate-x-1 transition-transform" />
                          </a>
                        </div>
                      </div>
                      
                      {/* Decorative circles */}
                      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-400/10 to-orange-500/10 -rotate-45 translate-x-12 -translate-y-12 rounded-full"></div>
                      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-rose-500/10 to-amber-500/10 rotate-45 -translate-x-8 translate-y-8 rounded-full"></div>
                    </div>
                  </div>

                  {/* Motto with decoration */}
                  <div className="mt-6 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-100 to-orange-100 rounded-full">
                      <FiStar className="text-amber-600 text-xs" />
                      <p className="text-xs text-rose-950 font-bold italic tracking-wide">
                        "Soaring to Excellence"
                      </p>
                      <FiTarget className="text-amber-600 text-xs" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <footer className="mt-12 md:mt-16 lg:mt-20 text-center">
            <div className="py-6 border-t border-amber-200/50 backdrop-blur-sm">
              <p className="text-slate-600 text-sm font-medium">
                © {new Date().getFullYear()} Kinyui Boys Senior School | Matungulu,
                Machakos County
                <span className="mx-2 text-amber-300">◆</span>
                Soaring to Excellence
                <span className="mx-2 text-amber-300">◆</span>
                <a
                  href="/"
                  className="text-rose-950 font-bold hover:text-amber-800 transition-colors hover:underline"
                >
                  Back to Homepage
                </a>
              </p>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default KinyuiBoys404;