'use client';

import { useState, useEffect, useRef } from 'react';
import {
  FiMenu, 
  FiX, 
  FiHome, 
  FiInfo, 
  FiBook, 
  FiUserPlus,
  FiCalendar,
  FiImage,
  FiMail,
  FiUsers,
  FiFileText,
  FiChevronDown,
  FiBriefcase,
  FiChevronRight,
  FiHeart,
  FiLock,
  FiDollarSign,
  FiGrid,
  FiBookOpen,
  FiAward
} from 'react-icons/fi';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export default function ModernNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAcademicDropdownOpen, setIsAcademicDropdownOpen] = useState(false);
  const [isResourcesDropdownOpen, setIsResourcesDropdownOpen] = useState(false);
  const [isMobileDropdownOpen, setIsMobileDropdownOpen] = useState(false);
  const [isMobileResourcesDropdownOpen, setIsMobileResourcesDropdownOpen] = useState(false);
  
  const academicDropdownRef = useRef(null);
  const resourcesDropdownRef = useRef(null);
  const mobileDropdownRef = useRef(null);
  const mobileResourcesDropdownRef = useRef(null);
  const pathname = usePathname();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsOpen(false);
        setIsMobileDropdownOpen(false);
        setIsMobileResourcesDropdownOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (academicDropdownRef.current && !academicDropdownRef.current.contains(event.target)) {
        setIsAcademicDropdownOpen(false);
      }
      if (resourcesDropdownRef.current && !resourcesDropdownRef.current.contains(event.target)) {
        setIsResourcesDropdownOpen(false);
      }
      if (mobileDropdownRef.current && !mobileDropdownRef.current.contains(event.target)) {
        setIsMobileDropdownOpen(false);
      }
      if (mobileResourcesDropdownRef.current && !mobileResourcesDropdownRef.current.contains(event.target)) {
        setIsMobileResourcesDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  // Main navigation - RESHUFFLED ORDER
  const mainNavigation = [
    { 
      name: 'Home', 
      href: '/', 
      icon: FiHome,
      exact: true
    },
    { 
      name: 'About School', 
      href: '/pages/AboutUs',
      icon: FiInfo
    },
    {
      name: 'School Hub',
      href: '/pages/school-hub',
      icon: FiGrid
    },
    { 
      name: 'Academics', 
      href: '#academics',
      icon: FiBook,
      hasDropdown: true
    },
    { 
      name: 'Admissions', 
      href: '/pages/admissions',
      icon: FiUserPlus
    },
    { 
      name: 'Gallery', 
      href: '/pages/gallery', 
      icon: FiImage 
    },
    { 
      name: 'Activities & News', 
      href: '/pages/eventsandnews', 
      icon: FiCalendar 
    },
    { 
      name: 'Fees', 
      href: '/pages/fees', 
      icon: FiDollarSign 
    },
  ];

  // Academic dropdown items - WITH DESCRIPTIONS
  const academicDropdownItems = [
    {
      name: 'Student Portal',
      href: '/pages/StudentPortal',
      icon: FiFileText,
      description: 'Access your academic records & results'
    },
    {
      name: 'Guidance & Counselling',
      href: '/pages/Guidance-and-Counselling',
      icon: FiUsers,
      description: 'Student support & wellness services'
    },
    {
      name: 'Magazine',
      href: '/pages/Magazine',
      icon: FiBookOpen,
      description: 'School publications & newsletters'
    },
    {
      name: 'Apply Now',
      href: '/pages/Apply%20Now',
      icon: FiUserPlus,
      description: 'Start your application process'
    },
    {
      name: 'School Rules',
      href: '/pages/OurSchoolPolicies',
      icon: FiBook,
      description: 'Policies & student regulations'
    },
    {
      name: 'School Achievements',
      href: '/pages/Achievements',
      icon: FiAward,
      description: 'Celebrating our students\' successes & milestones'
    },
    {
      name: 'Clubs & Societies',
      href: '/pages/school-hub/clubs',
      icon: FiGrid,
      description: 'Explore student clubs, societies & leadership'
    },
      {
      name: 'Our Alumni page',
      href: 'https://www.facebook.com/KinyuiBoysHighSchool/',
      icon: FiHeart,
      description: 'Connect with fellow alumni'
    }

  ];

  // Resources dropdown items - WITH DESCRIPTIONS ADDED
  const resourcesDropdownItems = [
    {
      name: 'Careers',
      href: '/pages/careers',
      icon: FiBriefcase,
      description: 'Job opportunities at Kinyui Boys'
    },
    {
      name: 'Staff Directory',
      href: '/pages/staff',
      icon: FiUsers,
      description: 'Find staff contacts & departments'
    },
    {
      name: 'School Hub',
      href: '/pages/school-hub',
      icon: FiGrid,
      description: 'Clubs, boarding, ICT, farm, security & departments'
    },
    {
      name: 'Sign In',
      href: '/pages/Sign In',
      icon: FiLock,
      description: 'Secure access for school administrators',
      rel: 'nofollow',
      isHighlighted: true
    }
  ];

  const topUtilityLinks = [
    {
      name: 'Student Portal',
      href: '/pages/StudentPortal',
      icon: FiFileText
    },
    {
      name: 'School Hub',
      href: '/pages/school-hub',
      icon: FiGrid
    },
    {
      name: 'Help Center',
      href: '/pages/contact',
      icon: FiMail
    },
    {
      name: 'Admin Login',
      href: '/pages/Sign In',
      icon: FiLock,
      rel: 'nofollow',
      isHighlighted: true
    }
  ];

  // Function to check if a link is active
  const isActiveLink = (href, exact = false) => {
    if (!pathname) return false;
    if (href === '/') {
      return pathname === '/';
    }
    if (exact) {
      return pathname === href;
    }
    return pathname && pathname.startsWith(href);
  };

  // Navigation handlers
  const handleLogoClick = () => {
    window.location.href = '/';
  };

  const handleLogoKeyDown = (e) => {
    if (e.key === 'Enter') {
      window.location.href = '/';
    }
  };

  const isAcademicActive = academicDropdownItems.some((item) => (
    item.href.startsWith('/pages') && isActiveLink(item.href)
  ));
  const isResourcesActive = resourcesDropdownItems.some((item) => isActiveLink(item.href));

  return (
    <>
      <nav className="fixed w-full z-50 bg-white shadow-xl">
        <div className="w-full px-3 xs:px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-y-2 min-h-[4.5rem] sm:min-h-[5.2rem] lg:py-3">
            
{/* Logo Section */}
<div 
  className="flex items-center gap-3 md:gap-4 cursor-pointer group min-w-0"
  onClick={handleLogoClick}
  role="button"
  tabIndex={0}
  onKeyDown={handleLogoKeyDown}
>
  {/* Hexagon/Shield Container for the Logo */}
  <div className="relative flex items-center justify-center">
    <div className="absolute -inset-1 bg-gradient-to-tr from-amber-500 to-yellow-200 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-500"></div>
    <div className="relative w-12 h-12 xs:w-14 xs:h-14 sm:w-16 sm:h-16 bg-white rounded-2xl flex items-center justify-center border border-amber-200/40 shadow-2xl overflow-hidden">
      {/* Subtle background pattern/glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(245,158,11,0.18),transparent)]"></div>
      
      <Image
        src="/seo/SchoolLogo.png"
        alt="Kinyui Boys Senior School Logo"
        width={64}
        height={64}
        className="relative z-10 w-10 h-10 xs:w-12 xs:h-12 sm:w-14 sm:h-14 object-contain transition-transform duration-500 group-hover:scale-105"
        priority
      />
    </div>
  </div>

  {/* Text Content */}
  <div className="flex flex-col justify-center min-w-0">
    <div className="overflow-hidden">
      <h1 className="text-lg xs:text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tighter text-slate-950 leading-none truncate">
        KINYUI <span className="text-amber-600">BOYS</span>
      </h1>
    </div>
    
    <div className="flex items-center gap-2 mt-1 min-w-0">
      <span className="h-[1px] w-4 bg-amber-500/70"></span>
      <p className="text-[9px] xs:text-[10px] sm:text-xs uppercase tracking-[0.16em] sm:tracking-[0.2em] font-semibold text-slate-600 italic truncate">
        Blessed and Favoured
      </p>
    </div>
  </div>
</div>

            <div className="hidden lg:flex items-center justify-end gap-2">
              {topUtilityLinks.map((item) => {
                const isActive = isActiveLink(item.href);

                return (
                  <a
                    key={item.name}
                    href={item.href}
                    rel={item.rel}
                    className={`group inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition-all ${
                      isActive
                        ? 'bg-amber-500 text-white shadow-sm'
                        : item.isHighlighted
                          ? 'bg-[#3b1e0a] text-white shadow-sm hover:bg-[#4b270e]'
                          : 'text-slate-700 hover:bg-amber-50 hover:text-[#3b1e0a]'
                    }`}
                  >
                    <item.icon className="text-sm flex-shrink-0" />
                    <span className="whitespace-nowrap">{item.name}</span>
                  </a>
                );
              })}
            </div>

            {/* Desktop Navigation - second row */}
            <div className="hidden lg:flex order-3 w-full flex-none items-center justify-center border-t border-white/10 bg-[#3b1e0a] -mx-3 xs:-mx-4 sm:-mx-6 lg:-mx-8 px-3 xs:px-4 sm:px-6 lg:px-8 pt-2 pb-2">
              <div className="flex w-full min-w-0 flex-wrap items-center justify-center gap-1.5 px-1 py-1">
                {mainNavigation.map((item) => {
                  const isActive = item.hasDropdown ? isAcademicActive : isActiveLink(item.href, item.exact);
                  
                  if (item.hasDropdown) {
                    return (
                      <div 
                        key={item.name} 
                        className="relative"
                        ref={academicDropdownRef}
                        onMouseEnter={() => setIsAcademicDropdownOpen(true)}
                        onMouseLeave={() => setIsAcademicDropdownOpen(false)}
                      >
                        <button
                          className={`group flex items-center gap-1.5 font-bold transition-all text-[0.8rem] xl:text-[0.84rem] tracking-normal whitespace-nowrap px-2.5 xl:px-3 py-2 rounded-full relative ${
                            isActive || isAcademicDropdownOpen
                              ? 'text-slate-950 bg-amber-300'
                              : 'text-white/80 hover:text-white hover:bg-white/10'
                          }`}
                          aria-expanded={isAcademicDropdownOpen}
                          aria-haspopup="true"
                        >
                          <item.icon className="text-xs flex-shrink-0" />
                          <span className="truncate">{item.name}</span>
                          <FiChevronDown className={`text-xs transition-transform duration-200 ${
                            isAcademicDropdownOpen ? 'rotate-180' : ''
                          }`} />
                          
                          {(isActive || isAcademicDropdownOpen) && (
                            <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-6 h-0.5 bg-amber-400 rounded-full"></span>
                          )}
                        </button>

                        {/* Academic Dropdown - With descriptions */}
                        {isAcademicDropdownOpen && (
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50">
                            <div className="bg-gradient-to-r from-amber-600 to-orange-600 px-5 py-3">
                              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                                <FiBook className="text-amber-200" />
                                Academic Resources
                              </h3>
                              <p className="text-amber-100 text-xs mt-0.5">Everything you need for your academic journey</p>
                            </div>
                            
                            <div className="p-2">
                              {academicDropdownItems.map((dropdownItem) => (
                                <a
                                  key={dropdownItem.name}
                                  href={dropdownItem.href}
                                  className={`group flex items-start gap-3 px-3 py-3 rounded-xl transition-all duration-200 ${
                                    isActiveLink(dropdownItem.href)
                                      ? 'bg-amber-50'
                                      : 'hover:bg-gray-50'
                                  }`}
                                  onClick={() => setIsAcademicDropdownOpen(false)}
                                >
                                  <div className={`p-2 rounded-lg ${
                                    isActiveLink(dropdownItem.href)
                                      ? 'bg-amber-100 text-amber-700'
                                      : 'bg-gray-100 text-gray-600 group-hover:bg-amber-100 group-hover:text-amber-700'
                                  } transition-colors`}>
                                    <dropdownItem.icon className="text-sm" />
                                  </div>
                                  <div className="flex-1">
                                    <div className={`font-semibold text-sm ${
                                      isActiveLink(dropdownItem.href)
                                        ? 'text-amber-800'
                                        : 'text-gray-800 group-hover:text-amber-800'
                                    }`}>
                                      {dropdownItem.name}
                                    </div>
                                    {dropdownItem.description && (
                                      <p className="text-xs text-gray-500 mt-0.5">{dropdownItem.description}</p>
                                    )}
                                  </div>
                                  <FiChevronRight className={`text-xs mt-2 transition-all ${
                                    isActiveLink(dropdownItem.href)
                                      ? 'text-amber-600 opacity-100'
                                      : 'text-gray-400 opacity-0 group-hover:opacity-100 group-hover:text-amber-600'
                                  }`} />
                                </a>
                              ))}
                            </div>
                            
                            <div className="border-t border-gray-100 bg-gray-50 px-4 py-2">
                              <a 
                                href="https://analytics.zeraki.app/" 
                                className="flex items-center justify-between group py-1.5"
                                onClick={() => setIsAcademicDropdownOpen(false)}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <div className="flex items-center gap-2">
                                  <div className="w-5 h-5">
                                    <img 
                                      src="/zeraki.jpg" 
                                      alt="Zeraki Analytics" 
                                      className="w-full h-full object-cover rounded"
                                    />
                                  </div>
                                  <span className="text-xs font-medium text-gray-600 group-hover:text-amber-700">Zeraki Analytics</span>
                                </div>
                                <span className="text-xs text-gray-400 group-hover:text-amber-600">External →</span>
                              </a>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  }

                  return (
                    <a
                      key={item.name}
                      href={item.href}
                      className={`group flex items-center gap-1.5 font-bold transition-all text-[0.8rem] xl:text-[0.84rem] tracking-normal whitespace-nowrap px-2.5 xl:px-3 py-2 rounded-full relative ${
                        isActive
                          ? 'text-slate-950 bg-amber-300'
                          : 'text-white/80 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <item.icon className="text-xs flex-shrink-0" />
                      <span className="truncate">{item.name}</span>

                      {isActive && (
                        <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-5 h-0.5 bg-amber-400 rounded-full"></span>
                      )}

                      <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-amber-400/50 rounded-full group-hover:w-5 transition-all duration-300"></span>
                    </a>
                  );
                })}

                {/* Resources Dropdown - UPDATED WITH DESCRIPTIONS AND NEW LAYOUT */}
                <div
                  className="relative"
                  ref={resourcesDropdownRef}
                  onMouseEnter={() => setIsResourcesDropdownOpen(true)}
                  onMouseLeave={() => setIsResourcesDropdownOpen(false)}
                >
                  <button
                    className={`group flex items-center gap-1.5 font-bold transition-all text-[0.8rem] xl:text-[0.84rem] tracking-normal whitespace-nowrap px-2.5 xl:px-3 py-2 rounded-full relative ${
                      isResourcesDropdownOpen ||
                      isResourcesActive
                        ? 'text-slate-950 bg-amber-300'
                        : 'text-white/80 hover:text-white hover:bg-white/10'
                    }`}
                    aria-expanded={isResourcesDropdownOpen}
                    aria-haspopup="true"
                  >
                    <FiGrid className="text-xs flex-shrink-0" />
                    <span className="truncate">Resources</span>
                    <FiChevronDown className={`text-xs transition-transform duration-200 ${
                      isResourcesDropdownOpen ? 'rotate-180' : ''
                    }`} />

                    {(isResourcesDropdownOpen || isResourcesActive) && (
                      <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-amber-400 rounded-full"></span>
                    )}
                  </button>

                  {/* Resources Dropdown - NEW LAYOUT WITH DESCRIPTIONS (matching Academics style) */}
                  {isResourcesDropdownOpen && (
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50">
                      {/* Header with gradient */}
                      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3">
                        <h3 className="font-bold text-white text-sm flex items-center gap-2">
                          <FiGrid className="text-blue-200" />
                          Resources & Information
                        </h3>
                        <p className="text-blue-100 text-xs mt-0.5">Essential links for staff & administrators</p>
                      </div>
                      
                      {/* Menu items with descriptions */}
                      <div className="p-2">
                        {resourcesDropdownItems.map((dropdownItem) => (
                          <a
                            key={dropdownItem.name}
                            href={dropdownItem.href}
                            rel={dropdownItem.rel}
                            className={`group flex items-start gap-3 px-3 py-3 rounded-xl transition-all duration-200 ${
                              isActiveLink(dropdownItem.href)
                                ? dropdownItem.isHighlighted
                                  ? 'bg-amber-50'
                                  : 'bg-blue-50'
                                : dropdownItem.isHighlighted
                                  ? 'hover:bg-amber-50'
                                  : 'hover:bg-gray-50'
                            }`}
                            onClick={() => setIsResourcesDropdownOpen(false)}
                          >
                            <div className={`p-2 rounded-lg ${
                              isActiveLink(dropdownItem.href)
                                ? dropdownItem.isHighlighted
                                  ? 'bg-amber-100 text-amber-700'
                                  : 'bg-blue-100 text-blue-700'
                                : dropdownItem.isHighlighted
                                  ? 'bg-gray-100 text-amber-600 group-hover:bg-amber-100 group-hover:text-amber-700'
                                  : 'bg-gray-100 text-gray-600 group-hover:bg-blue-100 group-hover:text-blue-700'
                            } transition-colors`}>
                              <dropdownItem.icon className="text-sm" />
                            </div>
                            <div className="flex-1">
                              <div className={`font-semibold text-sm ${
                                isActiveLink(dropdownItem.href)
                                  ? dropdownItem.isHighlighted
                                    ? 'text-amber-800'
                                    : 'text-blue-800'
                                  : dropdownItem.isHighlighted
                                    ? 'text-gray-800 group-hover:text-amber-800'
                                    : 'text-gray-800 group-hover:text-blue-800'
                              }`}>
                                {dropdownItem.name}
                                {dropdownItem.isHighlighted && (
                                  <span className="ml-2 text-[10px] font-bold bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full">Secure</span>
                                )}
                              </div>
                              {dropdownItem.description && (
                                <p className="text-xs text-gray-500 mt-0.5">{dropdownItem.description}</p>
                              )}
                            </div>
                            <FiChevronRight className={`text-xs mt-2 transition-all ${
                              isActiveLink(dropdownItem.href)
                                ? dropdownItem.isHighlighted
                                  ? 'text-amber-600 opacity-100'
                                  : 'text-blue-600 opacity-100'
                                : 'text-gray-400 opacity-0 group-hover:opacity-100 group-hover:text-blue-600'
                            }`} />
                          </a>
                        ))}
                      </div>
                      
                      {/* Footer with additional info */}
                      <div className="border-t border-gray-100 bg-gray-50 px-4 py-2">
                        <p className="text-[10px] text-gray-400 text-center">
                          Secure access for authorized personnel only
                        </p>
                      </div>
                    </div>
                  )}
                </div>

              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2.5 xs:p-3 rounded-lg xs:rounded-xl text-white bg-[#3b1e0a] hover:bg-[#4b270e] transition-all active:scale-95 ml-auto"
              aria-label={isOpen ? "Close menu" : "Open menu"}
              aria-expanded={isOpen}
            >
              {isOpen ? (
                <FiX className="text-xl xs:text-2xl sm:text-3xl" />
              ) : (
                <FiMenu className="text-xl xs:text-2xl sm:text-3xl" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="lg:hidden bg-[#3b1e0a] border-t border-white/10">
            <div className="px-3 xs:px-4 sm:px-6 py-6 xs:py-8 max-w-2xl mx-auto">
              <div className="space-y-1.5 xs:space-y-2 mb-6 xs:mb-8">
                {topUtilityLinks.map((item) => {
                  const isActive = isActiveLink(item.href);

                  return (
                    <a
                      key={item.name}
                      href={item.href}
                      rel={item.rel}
                      className={`flex items-center gap-2 xs:gap-3 p-3 xs:p-4 rounded-lg xs:rounded-xl ${
                        isActive
                          ? 'bg-white/10 text-amber-200'
                          : item.isHighlighted
                            ? 'bg-amber-400 text-slate-950'
                            : 'text-white/90 hover:bg-white/5'
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      <item.icon className="text-lg xs:text-xl" />
                      <span className="font-bold text-base xs:text-lg tracking-normal">{item.name}</span>
                    </a>
                  );
                })}

                <div className="my-3 h-px bg-white/10"></div>

                {mainNavigation.map((item) => {
                  const isActive = item.hasDropdown ? isAcademicActive : isActiveLink(item.href, item.exact);
                  
                  if (item.hasDropdown) {
                    return (
                      <div key={item.name} className="space-y-1.5 xs:space-y-2" ref={mobileDropdownRef}>
                        <button
                          onClick={() => setIsMobileDropdownOpen(!isMobileDropdownOpen)}
                          className={`w-full flex items-center justify-between p-3 xs:p-4 rounded-lg xs:rounded-xl text-left ${
                            isActive || isMobileDropdownOpen
                              ? 'bg-white/10 text-amber-200'
                              : 'text-white/90 hover:bg-white/5'
                          }`}
                          aria-expanded={isMobileDropdownOpen}
                        >
                          <div className="flex items-center gap-2 xs:gap-3">
                            <item.icon className="text-lg xs:text-xl" />
                            <span className="font-bold text-base xs:text-lg tracking-normal">{item.name}</span>
                          </div>
                          <FiChevronDown className={`text-lg xs:text-xl transition-transform duration-200 ${
                            isMobileDropdownOpen ? 'rotate-180' : ''
                          }`} />
                        </button>
                        
                        {isMobileDropdownOpen && (
                          <div className="ml-6 xs:ml-8 space-y-1.5 xs:space-y-2 pl-3 xs:pl-4 border-l-2 border-white/20">
                            {academicDropdownItems.map((dropdownItem) => (
                              <a
                                key={dropdownItem.name}
                                href={dropdownItem.href}
                                className={`flex items-center gap-2 xs:gap-3 p-2.5 xs:p-3 rounded-lg ${
                                  isActiveLink(dropdownItem.href)
                                    ? 'bg-white/10 text-amber-200'
                                    : 'text-white/80 hover:bg-white/5'
                                }`}
                                onClick={() => {
                                  setIsOpen(false);
                                  setIsMobileDropdownOpen(false);
                                }}
                              >
                                <dropdownItem.icon className="text-base xs:text-lg" />
                                <div>
                                  <span className="font-medium text-sm xs:text-base">{dropdownItem.name}</span>
                                  {dropdownItem.description && (
                                    <p className="text-xs text-white/60 mt-0.5">{dropdownItem.description}</p>
                                  )}
                                </div>
                              </a>
                            ))}
                            
                            <a
                              href="https://analytics.zeraki.app/"
                              className="flex items-center gap-2 xs:gap-3 p-2.5 xs:p-3 rounded-lg text-white/80 hover:bg-white/5"
                              onClick={() => {
                                setIsOpen(false);
                                setIsMobileDropdownOpen(false);
                              }}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <div className="w-5 h-5 xs:w-6 xs:h-6 flex-shrink-0">
                                <img 
                                  src="/zeraki.jpg" 
                                  alt="Zeraki Analytics" 
                                  className="w-full h-full object-cover rounded-md border border-white/30"
                                />
                              </div>
                              <span className="font-medium text-sm xs:text-base">Zeraki Analytics</span>
                            </a>
                          </div>
                        )}
                      </div>
                    );
                  }

                  return (
                    <a
                      key={item.name}
                      href={item.href}
                      className={`flex items-center gap-2 xs:gap-3 p-3 xs:p-4 rounded-lg xs:rounded-xl ${
                        isActive
                          ? 'bg-white/10 text-amber-200'
                          : 'text-white/90 hover:bg-white/5'
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      <item.icon className="text-lg xs:text-xl" />
                      <span className="font-bold text-base xs:text-lg tracking-normal">{item.name}</span>
                    </a>
                  );
                })}

                {/* Mobile Resources Dropdown - WITH DESCRIPTIONS */}
                <div className="space-y-1.5 xs:space-y-2" ref={mobileResourcesDropdownRef}>
                  <button
                    onClick={() => setIsMobileResourcesDropdownOpen(!isMobileResourcesDropdownOpen)}
                    className={`w-full flex items-center justify-between p-3 xs:p-4 rounded-lg xs:rounded-xl text-left ${
                      isMobileResourcesDropdownOpen ||
                      isResourcesActive
                        ? 'bg-white/10 text-amber-200'
                        : 'text-white/90 hover:bg-white/5'
                    }`}
                    aria-expanded={isMobileResourcesDropdownOpen}
                  >
                    <div className="flex items-center gap-2 xs:gap-3">
                      <FiGrid className="text-lg xs:text-xl" />
                      <span className="font-bold text-base xs:text-lg tracking-normal">Resources</span>
                    </div>
                    <FiChevronDown className={`text-lg xs:text-xl transition-transform duration-200 ${
                      isMobileResourcesDropdownOpen ? 'rotate-180' : ''
                    }`} />
                  </button>
                  
                  {isMobileResourcesDropdownOpen && (
                    <div className="ml-6 xs:ml-8 space-y-1.5 xs:space-y-2 pl-3 xs:pl-4 border-l-2 border-white/20">
                      {resourcesDropdownItems.map((dropdownItem) => (
                        <a
                          key={dropdownItem.name}
                          href={dropdownItem.href}
                          rel={dropdownItem.rel}
                          className={`flex items-center gap-2 xs:gap-3 p-2.5 xs:p-3 rounded-lg ${
                            isActiveLink(dropdownItem.href)
                              ? dropdownItem.isHighlighted
                                ? 'bg-gradient-to-r from-amber-500/20 to-amber-600/20 text-amber-200'
                                : 'bg-white/10 text-amber-200'
                              : dropdownItem.isHighlighted
                                ? 'text-white hover:bg-gradient-to-r hover:from-amber-500/20 hover:to-amber-600/20'
                                : 'text-white/80 hover:bg-white/5'
                          }`}
                          onClick={() => {
                            setIsOpen(false);
                            setIsMobileResourcesDropdownOpen(false);
                          }}
                        >
                          <dropdownItem.icon className="text-base xs:text-lg" />
                          <div>
                            <span className={`font-medium text-sm xs:text-base ${
                              dropdownItem.isHighlighted ? 'font-bold' : ''
                            }`}>
                              {dropdownItem.name}
                            </span>
                            {dropdownItem.description && (
                              <p className="text-xs text-white/60 mt-0.5">{dropdownItem.description}</p>
                            )}
                          </div>
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Mobile Footer - CAPITALIZED "The" */}
              <div className="mt-6 xs:mt-8 pt-4 xs:pt-6 border-t border-white/20 text-center">
                <p className="text-white/70 text-xs xs:text-sm font-medium">
Blessed and Favoured
   </p>
              </div>
            </div>
          </div>
        )}
      </nav>

      <div className="h-[4.5rem] xs:h-20 sm:h-22 lg:h-32 transition-all duration-300"></div>
    </>
  );
}
