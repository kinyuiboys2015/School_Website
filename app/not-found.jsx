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
} from "react-icons/fi";

const KinyuiBoys404 = () => {
  const [currentMessage, setCurrentMessage] = useState(0);

  const quickLinks = [
    {
      name: "Home Base",
      href: "/",
      icon: FiHome,
      description: "Back to main campus",
    },
    {
      name: "Academics",
      href: "/pages/academics",
      icon: FiBook,
      description: "Course directory",
    },
    {
      name: "Gallery",
      href: "/pages/gallery",
      icon: FiBookOpen,
      description: "School memories",
    },
    {
      name: "Admissions",
      href: "/pages/admissions",
      icon: FiUsers,
      description: "Join Kinyui family",
    },
    {
      name: "Events & News",
      href: "/pages/eventsandnews",
      icon: FiCalendar,
      description: "Upcoming events",
    },
    {
      name: "Contact Us",
      href: "/pages/contact",
      icon: FiMail,
      description: "Talk to the office",
    },
    {
      name: "Student Portal",
      href: "/pages/StudentPortal",
      icon: FiBookOpen,
      description: "Student resources",
    },
    {
      name: "Guidance",
      href: "/pages/Guidance-and-Councelling",
      icon: FiUsers,
      description: "Guidance sessions",
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
      {/* Decorative Background Elements - Kinyui Colors (Amber/Orange) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-[0.03]">
        <div className="absolute top-1/4 -left-8 text-amber-600 scale-[4] rotate-12">
          <FiGlobe />
        </div>
        <div className="absolute bottom-1/4 -right-8 text-orange-600 scale-[4] -rotate-12">
          <FiMapPin />
        </div>
        <div className="absolute top-1/2 left-1/4 text-amber-500 scale-[3] rotate-45">
          <FiSearch />
        </div>
        <div className="absolute top-3/4 right-1/3 text-orange-500 scale-[3] -rotate-45">
          <FiAlertCircle />
        </div>
        <div className="absolute top-1/3 right-1/4 text-amber-400 scale-[2] rotate-90">
          <FiStar />
        </div>
        <div className="absolute bottom-1/3 left-1/3 text-orange-400 scale-[3] rotate-12">
          <FiAward />
        </div>
      </div>

      <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 py-8 md:py-12 relative z-10">
        <div className="container mx-auto max-w-6xl w-full">
          <div className="flex flex-col lg:flex-row gap-8 md:gap-12 lg:gap-16 items-center">
            {/* Left Side: Error Message Section */}
            <div className="w-full lg:w-1/2 text-center lg:text-left space-y-6 md:space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 rounded-full text-sm font-semibold tracking-wide border border-amber-200">
                <FiBell className="text-base" />
                <span>Kinyui Boys Announcement</span>
              </div>

              <div className="relative">
                <h1 className="text-7xl sm:text-8xl md:text-9xl font-black tracking-tighter text-slate-900 flex justify-center lg:justify-start items-baseline">
                  <span className="text-amber-600 drop-shadow-sm">4</span>
                  <span className="text-orange-500 mx-1 md:mx-2 drop-shadow-sm">
                    0
                  </span>
                  <span className="text-amber-600 drop-shadow-sm">4</span>
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

              <div className="flex flex-row items-center gap-2 sm:gap-4 pt-4 w-full">
                {/* Back to Assembly - Kinyui Colors (Amber/Orange) */}
                <a
                  href="/"
                  className="
                    group
                    flex flex-1 sm:flex-none items-center justify-center gap-1.5 sm:gap-3
                    bg-gradient-to-r from-amber-600 to-orange-600
                    text-white
                    px-2 sm:px-6 py-2.5 sm:py-3 md:px-8 md:py-4
                    rounded-xl md:rounded-2xl
                    transition-all duration-300
                    shadow-lg shadow-amber-200/50
                    active:scale-95
                  "
                >
                  <FiHome className="text-sm sm:text-xl" />
                  <span className="whitespace-nowrap font-black uppercase tracking-tighter sm:tracking-widest text-[10px] sm:text-sm md:text-base">
                    <span className="hidden xs:inline">Back to </span>Assembly
                  </span>
                  <FiChevronRight className="hidden md:block text-lg" />
                </a>

                {/* Previous Lesson - Outline */}
                <button
                  onClick={() => window.history.back()}
                  className="
                    group
                    flex flex-1 sm:flex-none items-center justify-center gap-1.5 sm:gap-3
                    bg-white
                    border-2 border-slate-100
                    text-slate-700
                    px-2 sm:px-6 py-2.5 sm:py-3 md:px-8 md:py-4
                    rounded-xl md:rounded-2xl
                    transition-all duration-300
                    shadow-sm
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

            {/* Right Side: School Directory */}
            <div className="w-full lg:w-1/2">
              <div className="relative">
                <div className="absolute -inset-2 sm:-inset-4 bg-gradient-to-tr from-amber-100 via-white to-orange-100 rounded-[2rem] sm:rounded-[3rem] blur-xl opacity-60 -z-10"></div>

                <div className="bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-[2.5rem] shadow-2xl shadow-slate-200/60 border border-slate-100/80 p-6 sm:p-8 md:p-10">
                  <div className="flex items-center justify-between mb-6 md:mb-8">
                    <h3 className="text-xl sm:text-2xl font-bold text-slate-800 flex items-center gap-2">
                      <FiMapPin className="text-amber-600" />
                      Kinyui Directory
                    </h3>
                    <div className="flex gap-1">
                      <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-amber-400"></div>
                      <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-orange-400"></div>
                      <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-amber-400"></div>
                    </div>
                  </div>

                  {/* Grid layout */}
                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    {quickLinks.map((link) => {
                      const Icon = link.icon;

                      return (
                        <a
                          key={link.name}
                          href={link.href}
                          className="
                            p-3 sm:p-4
                            rounded-xl
                            border border-slate-100
                            bg-white
                            active:scale-[0.98]
                          "
                        >
                          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                            {/* Icon */}
                            <div
                              className="
                                p-2 sm:p-3
                                bg-amber-50
                                text-amber-600
                                rounded-lg
                                shadow-sm
                                flex-shrink-0
                              "
                            >
                              <Icon className="text-base sm:text-xl" />
                            </div>

                            {/* Text */}
                            <div className="min-w-0 flex-1 text-left">
                              <h4 className="font-semibold text-slate-800 text-sm sm:text-base truncate">
                                {link.name}
                              </h4>
                              <p className="text-[10px] sm:text-xs text-slate-500 truncate">
                                {link.description}
                              </p>
                            </div>

                            {/* Arrow */}
                            <FiChevronRight className="hidden sm:block text-slate-400 flex-shrink-0" />
                          </div>
                        </a>
                      );
                    })}
                  </div>

                  {/* Kinyui Stats Card */}
                  <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-slate-100">
                    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-900 via-orange-800 to-amber-900 p-4 sm:p-6 text-white">
                      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />

                      <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 flex-nowrap">
                        <div className="space-y-1 min-w-0">
                          <p className="text-amber-200 text-xs font-semibold uppercase tracking-wider">
                            Kinyui Boys Enrollment
                          </p>
                          <div className="flex items-baseline gap-2 flex-nowrap">
                            <span className="text-2xl sm:text-3xl font-black text-amber-300">
                              400+
                            </span>
                            <span className="text-xs sm:text-sm text-amber-200">
                              Active Students
                            </span>
                          </div>
                          <p className="text-xs text-amber-200/80 mt-2">
                            P.O. Box 123 - 90145, Matungulu
                          </p>
                        </div>

                        <a
                          href="/pages/contact"
                          className="
                            inline-flex
                            items-center
                            gap-2
                            px-4 py-2
                            text-xs sm:text-sm
                            font-semibold
                            rounded-lg
                            border border-amber-400/30
                            bg-amber-600
                            text-white
                            flex-shrink-0
                          "
                        >
                          <FiMail className="text-sm" />
                          Contact Office
                        </a>
                      </div>
                      <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-amber-500/10 to-orange-500/10 -rotate-45 translate-x-8 -translate-y-8 rounded-full" />
                    </div>
                  </div>

                  {/* Motto */}
                  <div className="mt-4 text-center">
                    <p className="text-xs text-amber-600 font-semibold italic">
                      "Soaring to Excellence"
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <footer className="mt-8 md:mt-12 lg:mt-16 text-center">
            <p className="text-slate-500 text-sm font-medium">
              © {new Date().getFullYear()} Kinyui Boys Senior School | Matungulu,
              Machakos County
              <span className="mx-2 text-slate-300">•</span>
              Soaring to Excellence
              <span className="mx-2 text-slate-300">•</span>
              <a
                href="/"
                className="text-amber-600 font-semibold hover:text-amber-700 transition-colors"
              >
                Back to Homepage
              </a>
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default KinyuiBoys404;