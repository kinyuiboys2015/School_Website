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
  FiMapPin,
  FiCalendar,
} from 'react-icons/fi';
import { IoPeopleOutline, IoSparkles, IoMailOutline, IoCallOutline } from 'react-icons/io5';
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
    if (!role) return 'from-amber-600 to-orange-600';
    const roleLower = role.toLowerCase();
    if (roleLower.includes('principal')) return 'from-amber-700 via-orange-700 to-amber-800';
    if (roleLower.includes('deputy')) return 'from-amber-600 to-orange-600';
    if (roleLower.includes('teacher')) return 'from-amber-500 to-orange-500';
    return 'from-amber-600 to-orange-600';
  };

  const getRoleTitle = (staffMember) => {
    if (!staffMember) return 'Staff Member';
    if (staffMember.position) return staffMember.position;
    if (staffMember.role) return staffMember.role;
    return 'Staff Member';
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 space-y-4 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 min-h-screen">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full blur-xl animate-pulse" />
          <FiLoader className="w-10 h-10 text-amber-500 animate-spin relative z-10" />
        </div>
        <div className="space-y-1 text-center">
          <h3 className="text-lg font-black text-white tracking-tight">Fetching Faculty</h3>
          <p className="text-sm font-bold text-slate-400">Please wait a moment...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="text-center p-8 bg-slate-800/50 rounded-3xl border border-slate-700">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
            <FiAward className="text-red-400 text-2xl" />
          </div>
          <h3 className="text-xl font-black text-white mb-2">Error Loading Data</h3>
          <p className="text-slate-400 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-2xl font-black text-sm hover:shadow-lg transition-all"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!featuredStaff || !principal) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="text-center p-8">
          <h3 className="text-xl font-black text-white mb-2">No Staff Data Available</h3>
          <p className="text-slate-400">Please check back later.</p>
        </div>
      </div>
    );
  }

  const sideCards = [
    { staff: principal, label: 'Principal', color: 'from-amber-700 to-orange-700' },
    { staff: academicsDeputy, label: 'Deputy Academics', color: 'from-amber-600 to-orange-600' },
    { staff: adminDeputy, label: 'Deputy Admin', color: 'from-amber-600 to-orange-600' },
    { staff: randomTeacher, label: randomTeacher?.role || 'Teaching Staff', color: 'from-amber-500 to-orange-500' },
  ].filter((item) => item.staff !== null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-x-hidden">
      
      {/* Subtle Grain Overlay */}
      <div className="fixed inset-0 opacity-[0.02] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] z-0" />
      
      {/* Hero Section */}
      <section className="relative py-16 sm:py-20 lg:py-24 overflow-hidden">
        {/* Warm Ambient Glows */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-600/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-600/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/50 border border-slate-700 text-[10px] font-black uppercase tracking-[0.25em] text-amber-400 mb-5 backdrop-blur-sm">
              <IoPeopleOutline className="w-4 h-4 text-amber-500" />
              Leadership & Faculty
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight mb-4 tracking-tight">
              Meet Our{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600">
                School Leadership
              </span>
            </h1>
            <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed font-medium">
              Dedicated professionals committed to academic excellence, student development, and community engagement.
            </p>
          </div>
        </div>
      </section>

      {/* Staff Overview Description Section */}
      <section className="relative py-12 sm:py-16 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Animated Card */}
          <div className="relative group">
            {/* Glow Effect */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-600 to-orange-600 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-500" />
            
            {/* Main Content Card */}
            <div className="relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-3xl border border-slate-700/50 p-6 sm:p-8 md:p-10">
              
              {/* Decorative Elements */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-amber-600/5 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-orange-600/5 rounded-full blur-3xl pointer-events-none" />
              
              <div className="relative">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-950/50 border border-amber-800/50 text-[10px] font-black uppercase tracking-[0.25em] text-amber-400 mb-6">
                  <GiGraduateCap className="w-4 h-4 text-amber-500" />
                  Our Esteemed Faculty
                </div>

                {/* Title */}
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-4 tracking-tight">
                  Meet the Dedicated Team Behind{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500">
                    Kinyui's Excellence
                  </span>
                </h2>

                {/* Description Paragraphs */}
                <div className="space-y-4 text-slate-300 leading-relaxed">
                  <p className="text-sm sm:text-base">
                    At <span className="font-bold text-amber-400">Kinyui Boys Senior School</span>, our greatest asset is our team of 
                    passionate, dedicated, and highly qualified educators. The staff body comprises over
                    <span className="font-bold text-amber-400"> 85+ professional teachers and administrators</span>, 
                    each bringing unique expertise, experience, and a shared commitment to nurturing young minds.
                  </p>

                  <p className="text-sm sm:text-base">
                    Under the visionary leadership of our Chief Principal, our faculty is structured into specialized 
                    departments including <span className="font-semibold text-amber-300">Mathematics, Sciences, Languages, Humanities, 
                    Technical Studies, and Creative Arts</span>. This strategic organization ensures focused attention 
                    on each subject area while promoting interdisciplinary collaboration and innovative teaching methodologies.
                  </p>

                  <p className="text-sm sm:text-base">
                    Our leadership team, comprising the <span className="font-semibold text-amber-300">Chief Principal, Deputy Principals 
                    (Academics & Administration), Heads of Departments, and Subject Panels</span>, works tirelessly to maintain 
                    high academic standards, foster discipline, and create an enabling environment for both staff and 
                    students to thrive.
                  </p>
                </div>

                {/* Stats Bar */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-700">
                  <div className="text-center">
                    <p className="text-2xl sm:text-3xl font-black text-amber-400">85+</p>
                    <p className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider">Teaching Staff</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl sm:text-3xl font-black text-amber-400">25+</p>
                    <p className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider">Departments</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl sm:text-3xl font-black text-amber-400">15+</p>
                    <p className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider">Avg. Years Exp.</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl sm:text-3xl font-black text-amber-400">100%</p>
                    <p className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider">Qualified Teachers</p>
                  </div>
                </div>

                {/* Call to Action */}
                <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-4">
                  <div className="flex items-center gap-3 text-sm text-slate-400">
                    <div className="w-8 h-8 rounded-full bg-amber-900/30 flex items-center justify-center border border-amber-700/50">
                      <FiUsers className="text-amber-400 text-sm" />
                    </div>
                    <span>Committed to academic excellence and holistic development</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 relative z-10">
        
        {/* Back to Principal Button */}
        {featuredStaff.id !== principal.id && (
          <div className="mb-8 flex justify-start">
            <button
              onClick={returnToPrincipal}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-slate-800/80 border border-slate-700 text-slate-300 font-black text-xs uppercase tracking-wider shadow-sm hover:border-amber-600 hover:text-amber-400 transition-all"
            >
              <FiArrowLeft size={14} />
              Back to Principal
            </button>
          </div>
        )}

        {/* Featured Staff Card */}
        <div id="featured-staff-card" className="relative group bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-[2rem] border border-slate-700/50 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden mb-12">
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
                    )}&background=d97706&color=fff&bold=true&size=512`;
                  }}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-amber-700 to-orange-700 flex items-center justify-center">
                  <GiGraduateCap className="text-8xl text-white/40" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 lg:hidden">
                <span className={`px-3 py-1 bg-gradient-to-r ${getRoleColor(featuredStaff?.role)} text-xs font-black uppercase tracking-wider rounded-full text-white inline-block mb-2`}>
                  {getRoleTitle(featuredStaff)}
                </span>
                <h2 className="text-2xl font-black text-white">{featuredStaff?.name}</h2>
                <p className="text-amber-300/80 text-sm">{featuredStaff?.department || 'Administration'}</p>
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
                <h2 className="hidden lg:block text-3xl font-black text-white mb-1">{featuredStaff?.name}</h2>
                <p className="hidden lg:block text-amber-400 text-sm mb-6">{featuredStaff?.department || 'Administration'}</p>

                {/* Quote */}
                {featuredStaff?.quote && (
                  <div className="rounded-2xl border-l-4 border-amber-500 bg-slate-800/50 p-4 sm:p-5 mb-6">
                    <div className="flex items-start gap-3">
                      <FiMessageSquare className="text-amber-500 text-lg mt-0.5 shrink-0" />
                      <div>
                        <span className="text-[10px] font-black text-amber-400 uppercase tracking-wider block mb-1.5">
                          Personal Quote
                        </span>
                        <p className="text-slate-200 font-bold text-sm sm:text-base leading-relaxed italic">
                          "{featuredStaff.quote}"
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Bio */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-600 to-orange-600 flex items-center justify-center">
                      <FiUser className="text-white text-xs" />
                    </div>
                    <h3 className="text-[11px] font-black text-amber-400 uppercase tracking-wider">
                      Professional Biography
                    </h3>
                  </div>
                  <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                    <p className="text-slate-300 text-sm leading-relaxed font-medium">
                      {featuredStaff?.bio ||
                        `${featuredStaff?.name} is a dedicated member of our school's leadership team with a passion for education and student development.`}
                    </p>
                  </div>
                </div>

                {/* Achievements & Responsibilities Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                  {featuredStaff?.achievements && featuredStaff.achievements.length > 0 && (
                    <div className="bg-amber-950/30 rounded-xl p-4 border border-amber-800/30 hover:bg-amber-950/40 transition-all">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-amber-600 to-orange-600 flex items-center justify-center">
                          <FiAward className="text-white text-xs" />
                        </div>
                        <h3 className="text-[10px] font-black text-amber-400 uppercase tracking-wider">Key Achievements</h3>
                      </div>
                      <ul className="space-y-2">
                        {featuredStaff.achievements.slice(0, 4).map((item, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs text-slate-300 font-medium">
                            <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {featuredStaff?.responsibilities && featuredStaff.responsibilities.length > 0 && (
                    <div className="bg-orange-950/30 rounded-xl p-4 border border-orange-800/30 hover:bg-orange-950/40 transition-all">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-orange-600 to-amber-600 flex items-center justify-center">
                          <FiTarget className="text-white text-xs" />
                        </div>
                        <h3 className="text-[10px] font-black text-orange-400 uppercase tracking-wider">Core Responsibilities</h3>
                      </div>
                      <ul className="space-y-2">
                        {featuredStaff.responsibilities.slice(0, 4).map((item, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs text-slate-300 font-medium">
                            <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-1.5 shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Expertise Tags */}
                {featuredStaff?.expertise && featuredStaff.expertise.length > 0 && (
                  <div className="mt-5 pt-4 border-t border-slate-700">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-3">Areas of Expertise</h3>
                    <div className="flex flex-wrap gap-2">
                      {featuredStaff.expertise.slice(0, 4).map((skill, idx) => (
                        <span key={idx} className="px-3 py-1 bg-slate-800 text-slate-300 text-xs font-bold rounded-lg border border-slate-700 hover:border-amber-500 hover:text-amber-400 transition-all">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Contact */}
              <div className="mt-6 pt-4 border-t border-slate-700">
                {featuredStaff?.email && (
                  <a
                    href={`mailto:${featuredStaff.email}`}
                    className="inline-flex items-center gap-2 text-amber-400 font-bold text-sm hover:text-amber-300 transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-full bg-amber-900/30 flex items-center justify-center border border-amber-700/50 group-hover:bg-amber-800/50 transition-all">
                      <FiMail className="text-sm text-amber-400" />
                    </div>
                    {featuredStaff.email}
                  </a>
                )}
              </div>
            </div>
          </div>
          
          {/* Animated Progress Bar */}
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-500 to-orange-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left" />
        </div>

        {/* Side Cards Grid - Desktop */}
        <div className="hidden lg:grid grid-cols-4 gap-4 mb-12">
          {sideCards.map(({ staff, label, color }) => (
            <button
              key={staff.id}
              onClick={() => handleStaffClick(staff)}
              className={`relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-[1rem] p-4 border transition-all text-left hover:scale-[1.02] ${
                featuredStaff?.id === staff.id
                  ? 'border-amber-500 ring-2 ring-amber-500/30'
                  : 'border-slate-700 hover:border-amber-600/50'
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
                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(staff.name)}&background=d97706&color=fff&bold=true&size=96`;
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
                  <h3 className="font-black text-white text-sm truncate">{staff.name}</h3>
                  <p className="text-slate-400 text-xs truncate">{staff.position || staff.role}</p>
                </div>
              </div>
              {featuredStaff?.id === staff.id && (
                <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center">
                  <FiCheck className="text-xs text-white" />
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
                className={`flex-shrink-0 w-[160px] bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-[1rem] p-3 border text-left transition-all ${
                  featuredStaff?.id === staff.id
                    ? 'border-amber-500 ring-2 ring-amber-500/30'
                    : 'border-slate-700'
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
                          e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(staff.name)}&background=d97706&color=fff&bold=true&size=80`;
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
                    <h3 className="font-black text-white text-xs truncate">{staff.name.split(' ')[0]}</h3>
                    <p className="text-slate-400 text-[10px] truncate">{staff.position?.split(' ').slice(0, 2).join(' ') || staff.role}</p>
                  </div>
                </div>
                {featuredStaff?.id === staff.id && (
                  <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-amber-500 flex items-center justify-center">
                    <FiCheck className="text-[8px] text-white" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Staff Directory CTA */}
        <div className="text-center mt-12">
          <button
            onClick={() => router.push('/pages/staff')}
            className="group inline-flex items-center gap-2 px-8 py-3 rounded-2xl bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white font-black text-sm tracking-tight shadow-lg shadow-amber-600/20 hover:shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <FiUsers className="w-4 h-4 group-hover:rotate-12 transition-transform" />
            View Complete Staff Directory
            <FiChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
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