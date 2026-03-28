'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  FiMenu, FiX, FiHome, FiInfo, FiBook, FiUserPlus,
  FiCalendar, FiImage, FiMail, FiUsers, FiFileText,
  FiChevronDown, FiBriefcase, FiChevronRight, FiLock,
  FiDollarSign, FiGrid
} from 'react-icons/fi';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export default function ModernNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAcademicDropdownOpen, setIsAcademicDropdownOpen] = useState(false);
  const [isResourcesDropdownOpen, setIsResourcesDropdownOpen] = useState(false);
  const [isMobileDropdownOpen, setIsMobileDropdownOpen] = useState(false);
  const [isMobileResourcesDropdownOpen, setIsMobileResourcesDropdownOpen] = useState(false);
  
  const academicDropdownRef = useRef(null);
  const resourcesDropdownRef = useRef(null);
  const mobileDropdownRef = useRef(null);
  const mobileResourcesDropdownRef = useRef(null);
  const pathname = usePathname();

  // Scroll and resize handlers
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsOpen(false);
        setIsMobileDropdownOpen(false);
        setIsMobileResourcesDropdownOpen(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (academicDropdownRef.current && !academicDropdownRef.current.contains(event.target))
        setIsAcademicDropdownOpen(false);
      if (resourcesDropdownRef.current && !resourcesDropdownRef.current.contains(event.target))
        setIsResourcesDropdownOpen(false);
      if (mobileDropdownRef.current && !mobileDropdownRef.current.contains(event.target))
        setIsMobileDropdownOpen(false);
      if (mobileResourcesDropdownRef.current && !mobileResourcesDropdownRef.current.contains(event.target))
        setIsMobileResourcesDropdownOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  const mainNavigation = [
    { name: 'Home', href: '/', icon: FiHome, exact: true },
    { name: 'About', href: '/pages/AboutUs', icon: FiInfo },
    { name: 'Academics', href: '/pages/academics', icon: FiBook, hasDropdown: true },
    { name: 'Admissions', href: '/pages/admissions', icon: FiUserPlus },
    { name: 'Gallery', href: '/pages/gallery', icon: FiImage },
    { name: 'News & Events', href: '/pages/eventsandnews', icon: FiCalendar },
    { name: 'Contact', href: '/pages/contact', icon: FiMail },
    { name: 'Fees', href: '/pages/fees', icon: FiDollarSign },
  ];

  const academicDropdownItems = [
    { name: 'Student Portal', href: '/pages/StudentPortal', icon: FiFileText },
    { name: 'Guidance & Counselling', href: '/pages/Guidance-and-Councelling', icon: FiUsers },
    { name: 'Apply Now', href: '/pages/apply-for-admissions', icon: FiUserPlus },
    { name: 'School Rules', href: '/pages/OurSchoolPolicies', icon: FiUserPlus },
  ];

  const resourcesDropdownItems = [
    { name: 'Staff Directory', href: '/pages/staff', icon: FiUsers },
    { name: 'Careers', href: '/pages/careers', icon: FiBriefcase },
    { name: 'Admin Login', href: '/pages/adminLogin', icon: FiLock, isHighlighted: true },
  ];

  const isActiveLink = (href, exact = false) => {
    if (!pathname) return false;
    if (href === '/') return pathname === '/';
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  const handleLogoClick = () => (window.location.href = '/');

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/80 backdrop-blur-md shadow-md border-b border-gray-200'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo Section */}
            <div
              className="flex items-center gap-3 cursor-pointer"
              onClick={handleLogoClick}
              role="button"
              tabIndex={0}
            >
              <div className="relative w-10 h-10 sm:w-12 sm:h-12 bg-white/10 rounded-full overflow-hidden shadow-md">
                <Image
                  src="/kinyui.png"
                  alt="Kinyui Boys Senior School Logo"
                  fill
                  className="object-contain p-1"
                  priority
                />
              </div>
              <div>
                <h1 className="text-base sm:text-xl font-bold text-gray-900 tracking-tight">
                  Kinyui Boys
                </h1>
                <p className="text-xs text-gray-500 hidden sm:block">Soaring to Excellence</p>
              </div>
            </div>

            {/* Desktop Navigation (right-aligned) */}
            <div className="hidden lg:flex items-center space-x-1">
              {mainNavigation.map((item) => {
                const isActive = isActiveLink(item.href, item.exact);
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
                        className={`group px-3 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-1 ${
                          isActive || isAcademicDropdownOpen
                            ? 'text-blue-600'
                            : 'text-gray-700 hover:text-blue-600'
                        }`}
                      >
                        <item.icon className="w-4 h-4" />
                        {item.name}
                        <FiChevronDown
                          className={`w-3 h-3 transition-transform duration-200 ${
                            isAcademicDropdownOpen ? 'rotate-180' : ''
                          }`}
                        />
                      </button>

                      {isAcademicDropdownOpen && (
                        <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50">
                          <div className="px-4 py-2 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Academic
                          </div>
                          {academicDropdownItems.map((item) => (
                            <a
                              key={item.name}
                              href={item.href}
                              className={`flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors ${
                                isActiveLink(item.href) ? 'text-blue-600 bg-blue-50' : ''
                              }`}
                              onClick={() => setIsAcademicDropdownOpen(false)}
                            >
                              <item.icon className="w-4 h-4" />
                              <span>{item.name}</span>
                            </a>
                          ))}
                          <a
                            href="https://analytics.zeraki.app/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors"
                            onClick={() => setIsAcademicDropdownOpen(false)}
                          >
                            <div className="w-4 h-4 rounded-full overflow-hidden">
                              <img src="/zeraki.jpg" alt="Zeraki" className="w-full h-full object-cover" />
                            </div>
                            <span>Zeraki Analytics</span>
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
                    className={`group px-3 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-1 relative ${
                      isActive
                        ? 'text-blue-600'
                        : 'text-gray-700 hover:text-blue-600'
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.name}
                    <span
                      className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-5 ${
                        isActive ? 'w-5' : ''
                      }`}
                    />
                  </a>
                );
              })}

              {/* Resources Dropdown */}
              <div
                className="relative"
                ref={resourcesDropdownRef}
                onMouseEnter={() => setIsResourcesDropdownOpen(true)}
                onMouseLeave={() => setIsResourcesDropdownOpen(false)}
              >
                <button
                  className={`group px-3 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-1 ${
                    isResourcesDropdownOpen ||
                    isActiveLink('/pages/staff') ||
                    isActiveLink('/pages/careers') ||
                    isActiveLink('/pages/adminLogin')
                      ? 'text-blue-600'
                      : 'text-gray-700 hover:text-blue-600'
                  }`}
                >
                  <FiGrid className="w-4 h-4" />
                  Resources
                  <FiChevronDown
                    className={`w-3 h-3 transition-transform duration-200 ${
                      isResourcesDropdownOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isResourcesDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Resources & Admin
                    </div>
                    {resourcesDropdownItems.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        className={`flex items-center gap-2 px-4 py-2 text-sm transition-colors ${
                          isActiveLink(item.href)
                            ? 'text-blue-600 bg-blue-50'
                            : item.isHighlighted
                            ? 'text-orange-600 hover:bg-orange-50'
                            : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
                        }`}
                        onClick={() => setIsResourcesDropdownOpen(false)}
                      >
                        <item.icon className="w-4 h-4" />
                        <span>{item.name}</span>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 rounded-full text-gray-700 hover:bg-gray-100 transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu (Slide-up panel) */}
        <div
          className={`lg:hidden fixed inset-x-0 top-16 sm:top-20 bg-white shadow-xl transition-transform duration-300 ease-out ${
            isOpen ? 'translate-y-0' : '-translate-y-full'
          }`}
          style={{ maxHeight: 'calc(100vh - 4rem)', overflowY: 'auto' }}
        >
          <div className="px-4 py-6 space-y-2">
            {mainNavigation.map((item) => {
              const isActive = isActiveLink(item.href, item.exact);
              if (item.hasDropdown) {
                return (
                  <div key={item.name} className="border-b border-gray-100 pb-2">
                    <button
                      onClick={() => setIsMobileDropdownOpen(!isMobileDropdownOpen)}
                      className="flex items-center justify-between w-full py-3 text-left"
                    >
                      <div className="flex items-center gap-3">
                        <item.icon className="w-5 h-5 text-gray-500" />
                        <span className="font-medium text-gray-800">{item.name}</span>
                      </div>
                      <FiChevronDown
                        className={`w-4 h-4 text-gray-400 transition-transform ${
                          isMobileDropdownOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {isMobileDropdownOpen && (
                      <div className="ml-8 space-y-2 pb-2">
                        {academicDropdownItems.map((sub) => (
                          <a
                            key={sub.name}
                            href={sub.href}
                            className={`flex items-center gap-3 py-2 text-sm ${
                              isActiveLink(sub.href)
                                ? 'text-blue-600'
                                : 'text-gray-600 hover:text-blue-600'
                            }`}
                            onClick={() => setIsOpen(false)}
                          >
                            <sub.icon className="w-4 h-4" />
                            {sub.name}
                          </a>
                        ))}
                        <a
                          href="https://analytics.zeraki.app/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 py-2 text-sm text-gray-600 hover:text-blue-600"
                          onClick={() => setIsOpen(false)}
                        >
                          <div className="w-4 h-4 rounded-full overflow-hidden">
                            <img src="/zeraki.jpg" alt="" className="w-full h-full object-cover" />
                          </div>
                          Zeraki Analytics
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
                  className={`flex items-center gap-3 py-3 ${
                    isActive ? 'text-blue-600 font-medium' : 'text-gray-700 hover:text-blue-600'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </a>
              );
            })}

            {/* Mobile Resources Section */}
            <div className="border-t border-gray-100 pt-2">
              <button
                onClick={() => setIsMobileResourcesDropdownOpen(!isMobileResourcesDropdownOpen)}
                className="flex items-center justify-between w-full py-3 text-left"
              >
                <div className="flex items-center gap-3">
                  <FiGrid className="w-5 h-5 text-gray-500" />
                  <span className="font-medium text-gray-800">Resources</span>
                </div>
                <FiChevronDown
                  className={`w-4 h-4 text-gray-400 transition-transform ${
                    isMobileResourcesDropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {isMobileResourcesDropdownOpen && (
                <div className="ml-8 space-y-2 pb-2">
                  {resourcesDropdownItems.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className={`flex items-center gap-3 py-2 text-sm ${
                        isActiveLink(item.href)
                          ? 'text-blue-600'
                          : item.isHighlighted
                          ? 'text-orange-600'
                          : 'text-gray-600 hover:text-blue-600'
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      <item.icon className="w-4 h-4" />
                      {item.name}
                    </a>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-4 text-center text-xs text-gray-400">
              Soaring to Excellence
            </div>
          </div>
        </div>
      </nav>

      {/* Spacer */}
      <div className="h-16 sm:h-20"></div>
    </>
  );
}