'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  FiMail,
  FiPhone,
  FiAward,
  FiBookOpen,
  FiUsers,
  FiStar,
  FiChevronRight,
  FiHeart,
  FiUser,
  FiCheck,
  FiArrowLeft,
  FiMessageSquare,
  FiTarget,
  FiLoader,
  FiExternalLink,
} from 'react-icons/fi';
import { IoPeopleOutline, IoSparkles } from 'react-icons/io5';
import { GiGraduateCap } from 'react-icons/gi';

const getImageUrl = (imagePath) => {
  if (!imagePath || typeof imagePath !== 'string') return null;
  const trimmedPath = imagePath.trim();
  if (!trimmedPath) return null;
  if (trimmedPath.includes('cloudinary.com')) return trimmedPath;
  if (trimmedPath.startsWith('/') || trimmedPath.startsWith('http')) return trimmedPath;
  if (trimmedPath.startsWith('data:image')) return trimmedPath;
  return trimmedPath;
};

const ModernStaffLeadership = () => {
  const router = useRouter();
  const [staff, setStaff] = useState([]);
  const [principal, setPrincipal] = useState(null);
  const [featuredStaff, setFeaturedStaff] = useState(null);
  const [academicsDeputy, setAcademicsDeputy] = useState(null);
  const [adminDeputy, setAdminDeputy] = useState(null);
  const [randomTeacher, setRandomTeacher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/staff');
        const data = await response.json();

        if (data.success && Array.isArray(data.staff)) {
          const allStaff = data.staff;
          setStaff(allStaff);

          const foundPrincipal = allStaff.find(
            (s) =>
              s.id === 1 ||
              s.position?.toLowerCase() === 'chief principal' ||
              s.role?.toLowerCase() === 'principal'
          ) || allStaff[0];

          setPrincipal(foundPrincipal);
          setFeaturedStaff(foundPrincipal);

          const allDeputies = allStaff.filter(
            (s) =>
              s.role?.toLowerCase().includes('deputy') ||
              s.position?.toLowerCase().includes('deputy')
          );

          const foundAcademicsDeputy = allDeputies.find((s) =>
            s.position?.toLowerCase().includes('academics')
          );
          const foundAdminDeputy = allDeputies.find((s) =>
            s.position?.toLowerCase().includes('admin') ||
            s.position?.toLowerCase().includes('administration')
          );

          setAcademicsDeputy(foundAcademicsDeputy || null);
          setAdminDeputy(foundAdminDeputy || null);

          const teachingStaff = allStaff.filter((s) => {
            const role = s.role?.toLowerCase() || '';
            const position = s.position?.toLowerCase() || '';
            const isLeadership =
              role.includes('principal') ||
              role.includes('deputy') ||
              position.includes('principal') ||
              position.includes('deputy') ||
              s.id === 1 ||
              s.id === 2 ||
              s.id === 3;
            return !isLeadership;
          });

          if (teachingStaff.length > 0) {
            const randomIndex = Math.floor(Math.random() * teachingStaff.length);
            setRandomTeacher(teachingStaff[randomIndex]);
          } else {
            setRandomTeacher(null);
          }
        } else {
          throw new Error('Format error: Expected successful staff array');
        }
      } catch (err) {
        console.error('Fetch Error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStaff();
  }, []);

  const handleStaffClick = (staffMember) => {
    if (featuredStaff?.id === staffMember.id) return;
    setFeaturedStaff(staffMember);
    if (isMobile) {
      setTimeout(() => {
        const mainCard = document.getElementById('featured-staff-card');
        if (mainCard) {
          mainCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  };

  const returnToPrincipal = () => {
    if (principal) {
      setFeaturedStaff(principal);
      if (isMobile) {
        setTimeout(() => {
          const mainCard = document.getElementById('featured-staff-card');
          if (mainCard) {
            mainCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 100);
      }
    }
  };

  const getRoleColor = (role) => {
    if (!role) return 'from-indigo-600 to-sky-500';
    const roleLower = role.toLowerCase();
    if (roleLower.includes('principal')) return 'from-slate-700 via-indigo-800 to-purple-800';
    if (roleLower.includes('deputy')) return 'from-indigo-600 to-violet-600';
    if (roleLower.includes('teacher')) return 'from-emerald-600 to-teal-600';
    return 'from-blue-600 to-indigo-600';
  };

  const getRoleTitle = (staffMember) => {
    if (!staffMember) return 'Staff Member';
    if (staffMember.position) return staffMember.position;
    if (staffMember.role) return staffMember.role;
    return 'Staff Member';
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 space-y-4 bg-[#f6f7fb] min-h-screen">
        <div className="relative">
          <FiLoader className="w-10 h-10 text-indigo-600 animate-spin" />
        </div>
        <div className="space-y-1 text-center">
          <h3 className="text-lg font-black text-slate-900 tracking-tight">Fetching Faculty</h3>
          <p className="text-sm font-bold text-slate-500">Please wait a moment...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f6f7fb]">
        <div className="text-center p-8">
          <h3 className="text-xl font-black text-slate-900 mb-2">Error Loading Data</h3>
          <p className="text-slate-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-indigo-600 text-white rounded-2xl font-black text-sm"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!featuredStaff || !principal) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f6f7fb]">
        <div className="text-center p-8">
          <h3 className="text-xl font-black text-slate-900 mb-2">No Staff Data Available</h3>
          <p className="text-slate-600">Please check back later.</p>
        </div>
      </div>
    );
  }

  const sideCards = [
    { staff: principal, label: 'Principal', color: 'from-slate-700 to-indigo-800' },
    { staff: academicsDeputy, label: 'Deputy Academics', color: 'from-emerald-600 to-teal-600' },
    { staff: adminDeputy, label: 'Deputy Admin', color: 'from-amber-500 to-orange-500' },
    { staff: randomTeacher, label: randomTeacher?.role || 'Teaching Staff', color: 'from-blue-600 to-indigo-600' },
  ].filter((item) => item.staff !== null);

  return (
    <div className="min-h-screen bg-[#f6f7fb] text-slate-900 overflow-x-hidden">
      
      {/* Hero Section - Matching school layout style */}
      <section className="relative py-16 sm:py-20 lg:py-24">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 left-1/2 h-[30rem] w-[30rem] -translate-x-1/2 rounded-full bg-gradient-to-br from-indigo-200/70 via-sky-200/40 to-emerald-200/30 blur-3xl" />
          <div className="absolute -bottom-28 left-10 h-[22rem] w-[22rem] rounded-full bg-gradient-to-br from-violet-200/40 to-fuchsia-200/20 blur-3xl" />
          <div className="absolute top-24 right-10 h-[20rem] w-[20rem] rounded-full bg-gradient-to-br from-sky-200/35 to-indigo-200/20 blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/70 border border-slate-200 text-[10px] font-black uppercase tracking-[0.25em] text-slate-700 mb-5">
              <IoPeopleOutline className="w-4 h-4 text-indigo-600" />
              Leadership & Faculty
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 leading-tight mb-4 tracking-tight">
              Meet Our{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-sky-600 to-emerald-600">
                School Leadership
              </span>
            </h1>
            <p className="text-slate-600 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed font-medium">
              Dedicated professionals committed to academic excellence, student development, and community engagement.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        
        {/* Back to Principal Button */}
        {featuredStaff.id !== principal.id && (
          <div className="mb-8 flex justify-start">
            <button
              onClick={returnToPrincipal}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white border border-slate-200 text-slate-700 font-black text-xs uppercase tracking-wider shadow-sm"
            >
              <FiArrowLeft size={14} />
              Back to Principal
            </button>
          </div>
        )}

        {/* Featured Staff Card */}
        <div id="featured-staff-card" className="bg-white rounded-[2rem] border border-slate-200/70 shadow-[0_20px_50px_rgba(2,6,23,0.08)] overflow-hidden mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Image Side */}
            <div className="relative h-80 lg:h-full lg:min-h-[500px]">
              {getImageUrl(featuredStaff?.image) ? (
                <img
                  src={getImageUrl(featuredStaff.image)}
                  alt={featuredStaff?.name}
                  className="w-full h-full object-cover object-top"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      featuredStaff?.name || 'Staff'
                    )}&background=4f46e5&color=fff&bold=true&size=512`;
                  }}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-indigo-600 to-sky-500 flex items-center justify-center">
                  <GiGraduateCap className="text-8xl text-white/40" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 lg:hidden">
                <span className={`px-3 py-1 bg-gradient-to-r ${getRoleColor(featuredStaff?.role)} text-xs font-black uppercase tracking-wider rounded-full text-white inline-block mb-2`}>
                  {getRoleTitle(featuredStaff)}
                </span>
                <h2 className="text-2xl font-black text-white">{featuredStaff?.name}</h2>
                <p className="text-white/80 text-sm">{featuredStaff?.department || 'Administration'}</p>
              </div>
            </div>

            {/* Content Side */}
            <div className="p-6 sm:p-8 lg:p-10 flex flex-col justify-between">
              <div>
                <div className="hidden lg:block mb-4">
                  <span className={`px-3 py-1 bg-gradient-to-r ${getRoleColor(featuredStaff?.role)} text-xs font-black uppercase tracking-wider rounded-full text-white inline-block`}>
                    {getRoleTitle(featuredStaff)}
                  </span>
                </div>
                <h2 className="hidden lg:block text-3xl font-black text-slate-900 mb-1">{featuredStaff?.name}</h2>
                <p className="hidden lg:block text-slate-500 text-sm mb-6">{featuredStaff?.department || 'Administration'}</p>

                {/* Quote */}
                {featuredStaff?.quote && (
                  <div className="rounded-2xl border-l-4 border-indigo-500 bg-slate-50 p-4 sm:p-5 mb-6">
                    <div className="flex items-start gap-3">
                      <FiMessageSquare className="text-indigo-500 text-lg mt-0.5 shrink-0" />
                      <div>
                        <span className="text-[10px] font-black text-indigo-600 uppercase tracking-wider block mb-1.5">
                          Personal Quote
                        </span>
                        <p className="text-slate-700 font-bold text-sm sm:text-base leading-relaxed">
                          "{featuredStaff.quote}"
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Bio */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-600 to-sky-500 flex items-center justify-center">
                      <FiUser className="text-white text-xs" />
                    </div>
                    <h3 className="text-[11px] font-black text-slate-700 uppercase tracking-wider">
                      Professional Biography
                    </h3>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                    <p className="text-slate-700 text-sm leading-relaxed font-medium">
                      {featuredStaff?.bio ||
                        `${featuredStaff?.name} is a dedicated member of our school's leadership team with a passion for education and student development.`}
                    </p>
                  </div>
                </div>

                {/* Achievements & Responsibilities Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                  {featuredStaff?.achievements && featuredStaff.achievements.length > 0 && (
                    <div className="bg-amber-50/50 rounded-xl p-4 border border-amber-100">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                          <FiAward className="text-white text-xs" />
                        </div>
                        <h3 className="text-[10px] font-black text-amber-700 uppercase tracking-wider">Key Achievements</h3>
                      </div>
                      <ul className="space-y-2">
                        {featuredStaff.achievements.slice(0, 4).map((item, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs text-slate-700 font-medium">
                            <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {featuredStaff?.responsibilities && featuredStaff.responsibilities.length > 0 && (
                    <div className="bg-emerald-50/50 rounded-xl p-4 border border-emerald-100">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                          <FiTarget className="text-white text-xs" />
                        </div>
                        <h3 className="text-[10px] font-black text-emerald-700 uppercase tracking-wider">Core Responsibilities</h3>
                      </div>
                      <ul className="space-y-2">
                        {featuredStaff.responsibilities.slice(0, 4).map((item, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs text-slate-700 font-medium">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Expertise Tags */}
                {featuredStaff?.expertise && featuredStaff.expertise.length > 0 && (
                  <div className="mt-5 pt-4 border-t border-slate-100">
                    <h3 className="text-xs font-black text-slate-500 uppercase tracking-wider mb-3">Areas of Expertise</h3>
                    <div className="flex flex-wrap gap-2">
                      {featuredStaff.expertise.slice(0, 4).map((skill, idx) => (
                        <span key={idx} className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-lg">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Contact */}
              <div className="mt-6 pt-4 border-t border-slate-200">
                {featuredStaff?.email && (
                  <a
                    href={`mailto:${featuredStaff.email}`}
                    className="inline-flex items-center gap-2 text-indigo-600 font-bold text-sm"
                  >
                    <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center">
                      <FiMail className="text-sm" />
                    </div>
                    {featuredStaff.email}
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Side Cards Grid - Desktop */}
        <div className="hidden lg:grid grid-cols-4 gap-4 mb-12">
          {sideCards.map(({ staff, label, color }) => (
            <button
              key={staff.id}
              onClick={() => handleStaffClick(staff)}
              className={`bg-white rounded-[1rem] p-4 border transition-all text-left ${
                featuredStaff?.id === staff.id
                  ? 'border-indigo-500 ring-2 ring-indigo-200'
                  : 'border-slate-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0">
                  {staff.image ? (
                    <img
                      src={getImageUrl(staff.image)}
                      alt={staff.name}
                      className="w-full h-full object-cover object-top"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(staff.name)}&background=4f46e5&color=fff&bold=true&size=96`;
                      }}
                    />
                  ) : (
                    <div className={`w-full h-full bg-gradient-to-br ${color} flex items-center justify-center`}>
                      <FiUser className="text-white text-sm" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <span className={`inline-block px-2 py-0.5 bg-gradient-to-r ${color} text-white text-[9px] font-black uppercase tracking-wider rounded-full mb-1`}>
                    {label}
                  </span>
                  <h3 className="font-black text-slate-900 text-sm truncate">{staff.name}</h3>
                  <p className="text-slate-500 text-xs truncate">{staff.position || staff.role}</p>
                </div>
              </div>
              {featuredStaff?.id === staff.id && (
                <div className="absolute top-2 right-2 text-indigo-500">
                  <FiCheck className="text-xs" />
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Side Cards - Mobile Horizontal Scroll */}
        <div className="lg:hidden overflow-x-auto pb-4 mb-8 scrollbar-hide">
          <div className="flex gap-3 min-w-max px-1">
            {sideCards.map(({ staff, label, color }) => (
              <button
                key={staff.id}
                onClick={() => handleStaffClick(staff)}
                className={`flex-shrink-0 w-[160px] bg-white rounded-[1rem] p-3 border text-left ${
                  featuredStaff?.id === staff.id
                    ? 'border-indigo-500 ring-2 ring-indigo-200'
                    : 'border-slate-100'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0">
                    {staff.image ? (
                      <img
                        src={getImageUrl(staff.image)}
                        alt={staff.name}
                        className="w-full h-full object-cover object-top"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(staff.name)}&background=4f46e5&color=fff&bold=true&size=80`;
                        }}
                      />
                    ) : (
                      <div className={`w-full h-full bg-gradient-to-br ${color} flex items-center justify-center`}>
                        <FiUser className="text-white text-sm" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className={`inline-block px-1.5 py-0.5 bg-gradient-to-r ${color} text-white text-[8px] font-black uppercase tracking-wider rounded-full mb-0.5`}>
                      {label}
                    </span>
                    <h3 className="font-black text-slate-900 text-xs truncate">{staff.name.split(' ')[0]}</h3>
                    <p className="text-slate-500 text-[10px] truncate">{staff.position?.split(' ').slice(0, 2).join(' ') || staff.role}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Staff Directory CTA */}
        <div className="text-center mt-12">
          <button
            onClick={() => router.push('/pages/staff')}
            className="inline-flex items-center gap-2 px-8 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 via-sky-600 to-emerald-600 text-white font-black text-sm tracking-tight shadow-lg shadow-indigo-600/20 active:scale-[0.99]"
          >
            <FiUsers className="w-4 h-4" />
            View Complete Staff Directory
            <FiChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default ModernStaffLeadership;