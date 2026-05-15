'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  FiActivity,
  FiAward,
  FiBook,
  FiBookOpen,
  FiBriefcase,
  FiCalendar,
  FiChevronDown,
  FiChevronRight,
  FiDollarSign,
  FiExternalLink,
  FiFileText,
  FiGrid,
  FiHeart,
  FiHome,
  FiImage,
  FiInfo,
  FiLayers,
  FiLock,
  FiMenu,
  FiPhone,
  FiShield,
  FiUsers,
  FiX,
} from 'react-icons/fi';

const primaryLinks = [
  { name: 'Home', href: '/', icon: FiHome, exact: true },
  { name: 'About School', href: '/pages/AboutUs', icon: FiInfo },
];

const secondaryLinks = [
  { name: 'Admissions', href: '/pages/admissions', icon: FiBookOpen },
  { name: 'Gallery', href: '/pages/gallery', icon: FiImage },
  { name: 'Events & News', href: '/pages/eventsandnews', icon: FiCalendar },
  { name: 'Fees', href: '/pages/fees', icon: FiDollarSign },
];

const utilityLinks = [
  { name: 'Student Portal', href: '/pages/StudentPortal', icon: FiFileText },
  { name: 'Contact', href: '/pages/contact', icon: FiPhone },
  { name: 'Admin Login', href: '/pages/Sign%20In', icon: FiLock, secure: true, rel: 'nofollow' },
];

const academicLinks = [
  {
    name: 'Staff Directory',
    href: '/pages/staff',
    icon: FiUsers,
    description: 'Leadership profiles and department groups',
  },
  {
    name: 'Departments',
    href: '/pages/staff',
    icon: FiLayers,
    description: 'Teaching, CBC, 8-4-4 and support departments',
  },
  {
    name: 'Guidance & Counselling',
    href: '/pages/Guidance-and-Counselling',
    icon: FiHeart,
    description: 'Student wellness and counselling services',
  },
  {
    name: 'Achievements',
    href: '/pages/Achievements',
    icon: FiAward,
    description: 'Academic, arts, sports and leadership milestones',
  },
  {
    name: 'School Magazine',
    href: '/pages/Magazine',
    icon: FiBookOpen,
    description: 'School publications and newsletters',
  },
  {
    name: 'School Rules',
    href: '/pages/OurSchoolPolicies',
    icon: FiShield,
    description: 'Policies, rules and student expectations',
  },
  {
    name: 'Zeraki Analytics',
    href: 'https://analytics.zeraki.app/',
    icon: FiExternalLink,
    description: 'External analytics platform',
    external: true,
  },
];

const schoolHubLinks = [
  {
    name: 'School Security',
    href: '/pages/school-hub/security',
    icon: FiShield,
    description: 'Safety measures and campus protection',
  },
  {
    name: 'Clubs',
    href: '/pages/school-hub/clubs',
    icon: FiUsers,
    description: 'Co-curricular clubs and student interests',
  },
  {
    name: 'Student Council',
    href: '/pages/school-hub/student-council',
    icon: FiAward,
    description: 'Student leadership and learner voice',
  },
  {
    name: 'Farm',
    href: '/pages/school-hub/farm',
    icon: FiActivity,
    description: 'Farm projects and practical learning',
  },
  {
    name: 'Boarding',
    href: '/pages/school-hub/boarding',
    icon: FiHome,
    description: 'Boarding life and residential support',
  },
  {
    name: 'Computer Lab',
    href: '/pages/school-hub/computer-lab',
    icon: FiFileText,
    description: 'ICT spaces and digital learning',
  },
  {
    name: 'Societies',
    href: '/pages/school-hub/societies',
    icon: FiHeart,
    description: 'Academic societies and service groups',
  },
  {
    name: 'School Departments',
    href: '/pages/school-hub/departments',
    icon: FiLayers,
    description: 'Department pages inside the school hub',
  },
  {
    name: 'Careers',
    href: '/pages/careers',
    icon: FiBriefcase,
    description: 'Opportunities at Kinyui Boys',
  },
  {
    name: 'Alumni',
    href: 'https://www.facebook.com/KinyuiBoysHighSchool/',
    icon: FiExternalLink,
    description: 'Connect with fellow alumni',
    external: true,
  },
];

const schoolHubGroup = {
  id: 'schoolHub',
  label: 'School Hub',
  icon: FiGrid,
  links: schoolHubLinks,
  activePrefix: '/pages/school-hub',
  description: 'Student life, facilities, leadership and activities',
};

const navGroups = [
  {
    id: 'academics',
    label: 'Academics',
    icon: FiBook,
    links: academicLinks,
    description: 'Staff, departments, policies and academic life',
  },
];

const mainLinks = [...primaryLinks, ...secondaryLinks];

const normalizeHref = (href) => {
  if (!href || !href.startsWith('/')) return '';
  return href.split('#')[0].split('?')[0];
};

export default function ModernNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const navRef = useRef(null);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 24);
    const handleResize = () => {
      if (window.innerWidth >= 1024) setIsOpen(false);
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setActiveDropdown(null);
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const isActiveLink = (href, exact = false) => {
    const normalizedHref = normalizeHref(href);
    if (!pathname || !normalizedHref) return false;
    if (normalizedHref === '/') return pathname === '/';
    return exact ? pathname === normalizedHref : pathname.startsWith(normalizedHref);
  };

  const isGroupActive = (group) => {
    if (group.activePrefix && pathname?.startsWith(group.activePrefix)) return true;
    return group.links.some((link) => isActiveLink(link.href, link.href === group.activePrefix));
  };

  const closeAll = () => {
    setIsOpen(false);
    setActiveDropdown(null);
  };

  return (
    <>
      <nav
        ref={navRef}
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          isScrolled ? 'shadow-xl shadow-slate-950/10' : 'shadow-lg shadow-slate-950/5'
        }`}
      >
        <div className="hidden border-b border-white/10 bg-[#23070d] text-white lg:block">
          <div className="mx-auto flex min-h-[72px] max-w-7xl items-center justify-between gap-6 px-6">
            <a href="/" onClick={closeAll} className="flex min-w-0 items-center gap-3">
              <div className="h-14 w-14 shrink-0 rounded-2xl bg-white/10 p-1 shadow-lg shadow-black/20 ring-1 ring-white/15">
                <div className="flex h-full w-full items-center justify-center rounded-xl bg-white">
                  <Image
                    src="/seo/SchoolLogo.png"
                    alt="Kinyui Boys Senior School Logo"
                    width={42}
                    height={42}
                    className="rounded-lg object-contain"
                    priority
                  />
                </div>
              </div>
              <div className="min-w-0">
                <p className="truncate text-lg font-black tracking-tight text-white">
                  S.A. Kinyui Boys
                </p>
                <p className="truncate text-[10px] font-black uppercase tracking-[0.24em] text-amber-100/70">
                  Senior School | Blessed and Favoured
                </p>
              </div>
            </a>

            <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.07] p-1.5 shadow-inner shadow-black/10">
              <DesktopDropdown
                group={schoolHubGroup}
                open={activeDropdown === schoolHubGroup.id}
                active={isGroupActive(schoolHubGroup)}
                onOpen={() => setActiveDropdown(schoolHubGroup.id)}
                onToggle={() => setActiveDropdown(activeDropdown === schoolHubGroup.id ? null : schoolHubGroup.id)}
                onClose={() => setActiveDropdown(null)}
                isActiveLink={isActiveLink}
                closeAll={closeAll}
                variant="top"
              />

              {utilityLinks.map((item) => (
                <NavLink key={item.name} item={item} compact isActiveLink={isActiveLink} onClose={closeAll} />
              ))}
            </div>
          </div>
        </div>

        <div className="border-b border-slate-200/80 bg-white/90 backdrop-blur-2xl">
          <div className="mx-auto flex min-h-[72px] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:min-h-[64px] lg:justify-center">
            <a href="/" onClick={closeAll} className="flex min-w-0 items-center gap-3 lg:hidden">
              <div className="h-12 w-12 shrink-0 rounded-2xl bg-gradient-to-br from-amber-500 via-orange-500 to-yellow-300 p-[1px] shadow-lg">
                <div className="flex h-full w-full items-center justify-center rounded-2xl bg-white">
                  <Image
                    src="/seo/SchoolLogo.png"
                    alt="Kinyui Boys Senior School Logo"
                    width={38}
                    height={38}
                    className="rounded-xl object-contain"
                    priority
                  />
                </div>
              </div>
              <div className="min-w-0">
                <p className="truncate text-base font-black tracking-tight text-slate-950 sm:text-lg">
                  Kinyui Boys
                </p>
                <p className="truncate text-[10px] font-black uppercase tracking-[0.18em] text-slate-400 sm:text-[11px]">
                  Senior School
                </p>
              </div>
            </a>

            <div className="hidden min-w-0 flex-1 items-center justify-center gap-1 lg:flex">
              {primaryLinks.map((item) => (
                <NavLink key={item.name} item={item} isActiveLink={isActiveLink} onClose={closeAll} />
              ))}

              {navGroups.map((group) => {
                const open = activeDropdown === group.id;
                const active = isGroupActive(group);

                return (
                  <DesktopDropdown
                    key={group.id}
                    group={group}
                    open={open}
                    active={active}
                    onOpen={() => setActiveDropdown(group.id)}
                    onToggle={() => setActiveDropdown(open ? null : group.id)}
                    onClose={() => setActiveDropdown(null)}
                    isActiveLink={isActiveLink}
                    closeAll={closeAll}
                    variant="main"
                  />
                );
              })}

              {secondaryLinks.map((item) => (
                <NavLink key={item.name} item={item} isActiveLink={isActiveLink} onClose={closeAll} />
              ))}
            </div>

            <button
              onClick={() => setIsOpen((value) => !value)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-950 shadow-sm lg:hidden"
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isOpen}
            >
              {isOpen ? <FiX size={22} /> : <FiMenu size={22} />}
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="max-h-[calc(100vh-72px)] overflow-y-auto border-b border-slate-200 bg-white shadow-2xl lg:hidden">
            <div className="space-y-5 px-4 py-5 sm:px-6">
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {utilityLinks.map((item) => (
                  <NavLink key={item.name} item={item} isActiveLink={isActiveLink} onClose={closeAll} />
                ))}
              </div>

              <MobileSection title="Main Navigation" links={mainLinks} isActiveLink={isActiveLink} onClose={closeAll} />
              <MobileSection title="Hub Pages" links={schoolHubLinks} isActiveLink={isActiveLink} onClose={closeAll} />
              <MobileSection title="Academics" links={academicLinks} isActiveLink={isActiveLink} onClose={closeAll} />

              <div className="rounded-[24px] bg-gradient-to-br from-[#3b1e0a] to-[#7c3f12] p-4 text-center text-white">
                <p className="text-xs font-black uppercase tracking-[0.22em] text-amber-100/80">
                  Kinyui Boys
                </p>
                <p className="mt-1 text-sm font-semibold text-white/65">
                  Blessed and Favoured
                </p>
              </div>
            </div>
          </div>
        )}
      </nav>

      <div className="h-[72px] lg:h-[136px]" />
    </>
  );
}

function NavLink({ item, compact = false, isActiveLink, onClose }) {
  const Icon = item.icon;
  const active = isActiveLink(item.href, item.exact);
  const externalProps = item.external ? { target: '_blank', rel: 'noopener noreferrer' } : {};

  return (
    <a
      href={item.href}
      onClick={onClose}
      rel={item.rel}
      className={`group inline-flex items-center gap-2 rounded-2xl border px-3 py-2 text-sm font-extrabold transition-all ${
        active
          ? 'border-amber-200 bg-amber-50 text-amber-900'
          : item.secure
            ? compact
              ? 'border-white/10 bg-amber-400 text-slate-950 hover:bg-amber-300'
              : 'border-amber-200 bg-amber-50 text-amber-900 hover:bg-amber-100'
            : compact
              ? 'border-white/10 bg-white/5 text-white/80 hover:bg-white/10 hover:text-white'
              : 'border-slate-200 bg-white text-slate-800 hover:bg-slate-50 lg:border-transparent lg:text-slate-700'
      }`}
      {...externalProps}
    >
      <Icon className="shrink-0 text-sm" />
      <span className="whitespace-nowrap">{item.name}</span>
      {item.external && <FiExternalLink className="text-[11px] opacity-60" />}
    </a>
  );
}

function DesktopDropdown({
  group,
  open,
  active,
  onOpen,
  onToggle,
  onClose,
  isActiveLink,
  closeAll,
  variant = 'main',
}) {
  const Icon = group.icon;
  const isTop = variant === 'top';

  return (
    <div className="relative" onMouseEnter={onOpen}>
      <button
        onClick={onToggle}
        className={`inline-flex items-center gap-2 rounded-2xl border px-3 py-2 text-sm font-extrabold transition-all ${
          isTop
            ? open || active
              ? 'border-amber-200 bg-white text-[#3a0b14] shadow-lg shadow-black/10'
              : 'border-white/10 bg-white/10 text-white hover:bg-white hover:text-[#3a0b14]'
            : open || active
              ? 'border-amber-200 bg-amber-50 text-amber-900'
              : 'border-transparent text-slate-700 hover:border-slate-200 hover:bg-slate-50'
        }`}
        aria-expanded={open}
        aria-haspopup="true"
      >
        <Icon className="shrink-0 text-sm" />
        <span className="whitespace-nowrap">{group.label}</span>
        <FiChevronDown className={`text-xs transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div
          className={`absolute top-full z-50 mt-3 overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-2xl shadow-slate-950/15 ${
            isTop ? 'right-0 w-[600px]' : 'left-1/2 w-[540px] -translate-x-1/2'
          }`}
          onMouseLeave={onClose}
        >
          <div className="bg-gradient-to-br from-[#25070d] via-[#5b1020] to-[#a87925] px-5 py-4 text-white">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/15 bg-white/10">
                <Icon />
              </div>
              <div>
                <h3 className="text-sm font-black uppercase tracking-[0.18em]">
                  {group.label}
                </h3>
                <p className="mt-1 text-xs font-semibold text-white/70">
                  {group.description || 'Organized links for quick navigation'}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 p-3">
            {group.links.map((item) => (
              <DropdownLink key={item.name} item={item} isActiveLink={isActiveLink} onClose={closeAll} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function DropdownLink({ item, isActiveLink, onClose }) {
  const Icon = item.icon;
  const active = isActiveLink(item.href, item.href === '/pages/school-hub');
  const externalProps = item.external ? { target: '_blank', rel: 'noopener noreferrer' } : {};

  return (
    <a
      href={item.href}
      onClick={onClose}
      className={`group/link flex items-start gap-3 rounded-2xl p-3 transition-all ${
        active ? 'bg-amber-50' : 'hover:bg-slate-50'
      }`}
      {...externalProps}
    >
      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${
        active
          ? 'bg-amber-100 text-amber-800'
          : 'bg-slate-100 text-slate-600 group-hover/link:bg-amber-100 group-hover/link:text-amber-800'
      }`}>
        <Icon />
      </div>
      <div className="min-w-0">
        <p className={`text-sm font-black ${active ? 'text-amber-950' : 'text-slate-900'}`}>
          {item.name}
        </p>
        <p className="mt-0.5 line-clamp-2 text-xs font-semibold leading-5 text-slate-500">
          {item.description}
        </p>
      </div>
      {item.external ? (
        <FiExternalLink className="ml-auto mt-3 shrink-0 text-xs text-slate-300" />
      ) : (
        <FiChevronRight className="ml-auto mt-3 shrink-0 text-xs text-slate-300 opacity-0 transition group-hover/link:opacity-100" />
      )}
    </a>
  );
}

function MobileSection({ title, links, isActiveLink, onClose }) {
  return (
    <section>
      <div className="mb-2 flex items-center gap-2">
        <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
        <h2 className="text-[11px] font-black uppercase tracking-[0.22em] text-slate-400">
          {title}
        </h2>
      </div>
      <div className="space-y-2">
        {links.map((item) => {
          const Icon = item.icon;
          const active = isActiveLink(item.href, item.href === '/pages/school-hub' || item.exact);
          const externalProps = item.external ? { target: '_blank', rel: 'noopener noreferrer' } : {};

          return (
            <a
              key={item.name}
              href={item.href}
              onClick={onClose}
              className={`flex items-center gap-3 rounded-2xl border p-3 transition-all ${
                active
                  ? 'border-amber-200 bg-amber-50 text-amber-950'
                  : 'border-slate-200 bg-white text-slate-800 hover:bg-slate-50'
              }`}
              {...externalProps}
            >
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${
                active ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600'
              }`}>
                <Icon />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-black">{item.name}</p>
                {item.description && (
                  <p className="mt-0.5 line-clamp-1 text-xs font-semibold text-slate-500">
                    {item.description}
                  </p>
                )}
              </div>
              {item.external ? <FiExternalLink className="text-xs text-slate-400" /> : <FiChevronRight className="text-xs text-slate-400" />}
            </a>
          );
        })}
      </div>
    </section>
  );
}
