'use client';

import { useState, useEffect } from 'react';
import {
  FiMail,
  FiPhone,
  FiAward,
  FiBookOpen,
  FiBriefcase,
  FiUsers,
  FiStar,
  FiChevronRight,
  FiMapPin,
  FiCalendar,
  FiShield,
  FiUser,
  FiCheck,
  FiArrowLeft,
  FiClock,
  FiGlobe,
} from 'react-icons/fi';
import { Loader2 } from 'lucide-react';
import { IoPeopleOutline, IoRibbonOutline } from 'react-icons/io5';
import { GiGraduateCap } from 'react-icons/gi';

// Helper function for image URLs
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
  const [staff, setStaff] = useState([]);
  const [principal, setPrincipal] = useState(null);
  const [featuredStaff, setFeaturedStaff] = useState(null);
  const [academicsDeputy, setAcademicsDeputy] = useState(null);
  const [adminDeputy, setAdminDeputy] = useState(null);
  const [randomTeacher, setRandomTeacher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [showAllStaff, setShowAllStaff] = useState(false);

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
            const nonLeadershipStaff = allStaff.filter(
              (s) =>
                !s.role?.toLowerCase().includes('principal') &&
                !s.role?.toLowerCase().includes('deputy') &&
                !s.position?.toLowerCase().includes('principal') &&
                !s.position?.toLowerCase().includes('deputy')
            );
            setRandomTeacher(
              nonLeadershipStaff.length > 0
                ? nonLeadershipStaff[Math.floor(Math.random() * nonLeadershipStaff.length)]
                : null
            );
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
    if (!role) return 'bg-gradient-to-r from-indigo-500 to-purple-500';
    const roleLower = role.toLowerCase();
    if (roleLower.includes('principal')) return 'bg-gradient-to-r from-slate-700 via-indigo-800 to-purple-800';
    if (roleLower.includes('deputy')) return 'bg-gradient-to-r from-purple-600 to-pink-600';
    if (roleLower.includes('teacher')) return 'bg-gradient-to-r from-emerald-600 to-teal-600';
    return 'bg-gradient-to-r from-blue-600 to-indigo-600';
  };

  const getRoleTitle = (staffMember) => {
    if (!staffMember) return 'Staff Member';
    if (staffMember.position) return staffMember.position;
    if (staffMember.role) return staffMember.role;
    return 'Staff Member';
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 space-y-4 bg-gradient-to-br from-slate-50 to-white min-h-screen">
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-blue-400 opacity-20 animate-ping"></div>
          <Loader2 className="w-10 h-10 text-blue-600 animate-spin relative z-10" />
        </div>
        <div className="space-y-1 text-center">
          <h3 className="text-lg font-black text-slate-900 tracking-tight">Fetching our Faculty</h3>
          <p className="text-sm font-bold text-slate-500 animate-pulse">Please wait a moment...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-white">
        <div className="text-center p-8">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">Error Loading Data</h3>
          <p className="text-slate-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!featuredStaff || !principal) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-white">
        <div className="text-center p-8">
          <div className="text-slate-400 text-6xl mb-4">👨‍🏫</div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">No Staff Data Available</h3>
          <p className="text-slate-600">Please check back later.</p>
        </div>
      </div>
    );
  }

  const sideCards = [
    { staff: principal, label: 'Principal', color: 'from-slate-700 to-indigo-800' },
    { staff: academicsDeputy, label: 'Deputy (Academics)', color: 'from-emerald-600 to-teal-600' },
    { staff: adminDeputy, label: 'Deputy (Admin)', color: 'from-amber-500 to-orange-500' },
    { staff: randomTeacher, label: randomTeacher?.role || 'Teaching Staff', color: 'from-blue-600 to-indigo-600' },
  ].filter((item) => item.staff !== null);

  // Get all staff excluding the ones already shown in sideCards
  const allOtherStaff = staff.filter(
    (s) => !sideCards.some(card => card.staff.id === s.id)
  );

  // Staff counts for stats card
  const leadershipCount = staff.filter(
    (s) =>
      s.role?.toLowerCase().includes('principal') ||
      s.position?.toLowerCase().includes('principal') ||
      s.role?.toLowerCase().includes('deputy')
  ).length;

  const teachingCount = staff.filter(
    (s) => s.role?.toLowerCase().includes('teacher') || s.role?.toLowerCase().includes('teaching')
  ).length;

  const supportCount = staff.filter((s) => s.role?.toLowerCase().includes('support')).length;

  return (
    <div className="bg-gradient-to-br from-slate-50 via-white to-slate-100 font-sans">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-900 via-indigo-800 to-purple-800 text-white py-16 md:py-24">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-6">
            <IoPeopleOutline className="w-4 h-4" />
            <span className="text-sm font-bold tracking-wider">Leadership Team</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-4">
            Meet Our{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-amber-400">
              School Leadership
            </span>
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto">
            Committed professionals dedicated to academic excellence, student development,
            and community engagement.
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-slate-50 to-transparent"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        {/* Back to Principal Button (only when viewing other staff) */}
        {featuredStaff.id !== principal.id && (
          <div className="mb-6 flex justify-start">
            <button
              onClick={returnToPrincipal}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-full text-slate-700 hover:bg-slate-50 hover:border-blue-300 transition-all shadow-sm text-sm font-medium"
            >
              <FiArrowLeft size={16} />
              Back to Principal
            </button>
          </div>
        )}

        {/* Featured Staff Card */}
        <div
          id="featured-staff-card"
          className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 mb-16 transition-all duration-300 hover:shadow-3xl"
        >
          <div className="grid md:grid-cols-2 gap-8">
            {/* Image Side */}
            <div className="relative h-96 md:h-full min-h-[400px]">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-transparent z-10"></div>
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
                <div className="w-full h-full bg-gradient-to-br from-blue-600 to-indigo-800 flex items-center justify-center">
                  <GiGraduateCap className="text-8xl text-white/40" />
                </div>
              )}
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-20 md:hidden">
                <div className="text-white">
                  <span
                    className={`px-3 py-1 ${getRoleColor(
                      featuredStaff?.role
                    )} text-xs font-black uppercase tracking-wider rounded-full inline-block mb-2`}
                  >
                    {getRoleTitle(featuredStaff)}
                  </span>
                  <h2 className="text-2xl font-black">{featuredStaff?.name}</h2>
                  <p className="text-white/80 text-sm mt-1">{featuredStaff?.department || 'Administration'}</p>
                </div>
              </div>
            </div>

            {/* Content Side */}
            <div className="p-6 md:p-8 flex flex-col justify-between">
              <div>
                <div className="hidden md:block mb-4">
                  <span
                    className={`px-3 py-1 ${getRoleColor(
                      featuredStaff?.role
                    )} text-xs font-black uppercase tracking-wider rounded-full inline-block`}
                  >
                    {getRoleTitle(featuredStaff)}
                  </span>
                </div>
                <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-2 hidden md:block">
                  {featuredStaff?.name}
                </h2>
                <p className="text-slate-500 text-sm mb-6 hidden md:block">
                  {featuredStaff?.department || 'Administration'}
                </p>

                {/* Bio */}
                <div className="mb-6">
                  <h3 className="text-sm font-black text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <FiUser className="text-blue-500" /> Professional Biography
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    {featuredStaff?.bio ||
                      `${featuredStaff?.name} is a dedicated member of our school's leadership team with a passion for education and student development.`}
                  </p>
                </div>

                {/* Quote */}
                {featuredStaff?.quote && (
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl border-l-4 border-blue-600 mb-6">
                    <p className="text-slate-700 italic font-medium">"{featuredStaff.quote}"</p>
                  </div>
                )}

                {/* Expertise */}
                {featuredStaff?.expertise && featuredStaff.expertise.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-sm font-black text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                      <FiStar className="text-yellow-500" /> Areas of Expertise
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {featuredStaff.expertise.slice(0, 4).map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1.5 bg-slate-100 text-slate-700 text-xs font-bold rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Responsibilities & Achievements Grid */}
              <div className="grid sm:grid-cols-2 gap-6 mt-6">
                {featuredStaff?.responsibilities && featuredStaff.responsibilities.length > 0 && (
                  <div>
                    <h3 className="text-sm font-black text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                      <FiBriefcase className="text-green-500" /> Key Responsibilities
                    </h3>
                    <ul className="space-y-2">
                      {featuredStaff.responsibilities.slice(0, 4).map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                          <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 flex-shrink-0"></div>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div>
                  <h3 className="text-sm font-black text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <IoRibbonOutline className="text-amber-500" /> Notable Achievements
                  </h3>
                  <ul className="space-y-2">
                    {featuredStaff?.achievements && featuredStaff.achievements.length > 0 ? (
                      featuredStaff.achievements.slice(0, 4).map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                          <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 flex-shrink-0"></div>
                          <span>{item}</span>
                        </li>
                      ))
                    ) : (
                      <li className="text-sm text-slate-500 italic">Contributing to educational excellence</li>
                    )}
                  </ul>
                </div>
              </div>

              {/* Contact - Removed phone number, only email */}
              <div className="mt-6 pt-6 border-t border-slate-200">
                <h3 className="text-sm font-black text-slate-400 uppercase tracking-wider mb-3">Contact</h3>
                <div className="flex flex-wrap gap-4">
                  {featuredStaff?.email && (
                    <a
                      href={`mailto:${featuredStaff.email}`}
                      className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      <FiMail className="text-sm" />
                      <span className="text-sm">{featuredStaff.email}</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Side Cards Grid - Reduced Height */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {sideCards.map(({ staff, label, color }, idx) => (
            <button
              key={staff.id}
              onClick={() => handleStaffClick(staff)}
              className={`group relative bg-white rounded-xl p-3 shadow-md border transition-all duration-300 text-left hover:shadow-lg ${
                featuredStaff?.id === staff.id
                  ? 'border-blue-500 ring-2 ring-blue-200'
                  : 'border-slate-100 hover:border-blue-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                  {staff.image ? (
                    <img
                      src={getImageUrl(staff.image)}
                      alt={staff.name}
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          staff.name
                        )}&background=${color.split('-')[1]}&color=fff&bold=true&size=96`;
                      }}
                    />
                  ) : (
                    <div
                      className={`w-full h-full bg-gradient-to-br ${color} flex items-center justify-center`}
                    >
                      <FiUser className="text-white text-sm" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="mb-0.5">
                    <span
                      className={`inline-block px-1.5 py-0.5 bg-gradient-to-r ${color} text-white text-[9px] font-black uppercase tracking-wider rounded-full`}
                    >
                      {label}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm truncate">{staff.name}</h3>
                  <p className="text-slate-500 text-xs truncate">{staff.position || staff.role}</p>
                </div>
              </div>
              {featuredStaff?.id === staff.id && (
                <div className="absolute top-2 right-2 text-blue-500">
                  <FiCheck className="text-xs" />
                </div>
              )}
            </button>
          ))}
        </div>

        {/* All Staff Grid - Compact Cards */}
        {showAllStaff && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 mb-12">
            {allOtherStaff.map((staffMember) => (
              <button
                key={staffMember.id}
                onClick={() => handleStaffClick(staffMember)}
                className="group bg-white rounded-xl p-3 shadow-sm border border-slate-100 hover:shadow-md hover:border-blue-300 transition-all text-left"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="relative w-16 h-16 rounded-full overflow-hidden mb-2">
                    {staffMember.image ? (
                      <img
                        src={getImageUrl(staffMember.image)}
                        alt={staffMember.name}
                        className="w-full h-full object-cover object-top"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            staffMember.name
                          )}&background=4f46e5&color=fff&bold=true&size=128`;
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                        <FiUser className="text-white text-2xl" />
                      </div>
                    )}
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm truncate w-full">{staffMember.name}</h3>
                  <p className="text-slate-500 text-xs truncate w-full">{staffMember.position || staffMember.role || 'Staff Member'}</p>
                  <div className="mt-2 text-xs text-blue-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    View Profile
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

   {/* Staff Section */}
<section className="py-16 px-6 bg-gradient-to-b from-gray-50 to-white">
  <div className="max-w-6xl mx-auto text-center">

    {/* Heading */}
    <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-4">
      Meet Our Dedicated Staff
    </h2>

    {/* Short Modern Description */}
    <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
      Our team of passionate educators and professionals is committed to shaping 
      excellence, discipline, and innovation in every student. Explore the people 
      behind our success and discover the strength of our academic community.
    </p>

    {/* Optional Feature Highlights (Modern Touch) */}
    <div className="grid md:grid-cols-3 gap-6 mb-12">
      <div className="p-6 bg-white rounded-2xl shadow-sm hover:shadow-md transition">
        <h3 className="font-semibold text-gray-800 mb-2">Qualified Experts</h3>
        <p className="text-sm text-gray-500">
          Highly trained teachers with years of experience.
        </p>
      </div>

      <div className="p-6 bg-white rounded-2xl shadow-sm hover:shadow-md transition">
        <h3 className="font-semibold text-gray-800 mb-2">Student Focused</h3>
        <p className="text-sm text-gray-500">
          Dedicated to nurturing each learner’s potential.
        </p>
      </div>

      <div className="p-6 bg-white rounded-2xl shadow-sm hover:shadow-md transition">
        <h3 className="font-semibold text-gray-800 mb-2">Support System</h3>
        <p className="text-sm text-gray-500">
          Strong mentorship and guidance programs.
        </p>
      </div>
    </div>

    {/* CTA Button */}
    <div className="text-center">
      <a
        href="/pages/staff"
        className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-7 py-3 rounded-full font-semibold shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300"
      >
        <FiUsers className="text-lg" />
        View Complete Directory
        <FiChevronRight className="text-lg" />
      </a>
    </div>

  </div>
</section>

        {/* Mobile Hint */}
        {isMobile && (
          <p className="text-center text-sm text-slate-500 mt-8">
            Tap on any staff card to see their full profile.
          </p>
        )}
      </div>
    </div>
  );
};

export default ModernStaffLeadership;