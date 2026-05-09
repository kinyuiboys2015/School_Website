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
  FiEye,
} from 'react-icons/fi';
import { IoPeopleOutline, IoSparkles, IoMailOutline, IoCallOutline, IoShieldOutline } from 'react-icons/io5';
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
  const [academicsDeputy, setAcademicsDeputy] = useState(null);
  const [adminDeputy, setAdminDeputy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedLeader, setSelectedLeader] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
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

          // ----- FIXED PRINCIPAL DETECTION -----
          const foundPrincipal = allStaff.find(
            (s) =>
              s.position?.toLowerCase() === 'chief principal' ||
              s.role?.toLowerCase() === 'principal' ||
              s.position?.toLowerCase().includes('principal') ||
              s.id === 1
          ) || allStaff[0];
          setPrincipal(foundPrincipal);
          setSelectedLeader(foundPrincipal);

          // ----- FIXED DEPUTY CLASSIFICATION -----
          // Get all staff that are deputies (exclude principal)
          const allDeputies = allStaff.filter(
            (member) =>
              member.id !== foundPrincipal?.id &&
              (member.role?.toLowerCase().includes('deputy') ||
               member.position?.toLowerCase().includes('deputy'))
          );

          let academic = null;
          let admin = null;

          if (allDeputies.length === 1) {
            // Only one deputy available: use for BOTH roles
            academic = allDeputies[0];
            admin = allDeputies[0];
          } else if (allDeputies.length >= 2) {
            // Try to assign by keywords
            academic = allDeputies.find(
              (d) =>
                d.position?.toLowerCase().includes('academic') ||
                d.role?.toLowerCase().includes('academic')
            );
            admin = allDeputies.find(
              (d) =>
                d.position?.toLowerCase().includes('admin') ||
                d.role?.toLowerCase().includes('admin') ||
                d.position?.toLowerCase().includes('administration')
            );
            // Fallback if keyword search fails
            if (!academic) academic = allDeputies[0];
            if (!admin) admin = allDeputies[1] || allDeputies[0];
          }
          // else both remain null

          setAcademicsDeputy(academic);
          setAdminDeputy(admin);
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

  const handleLeaderClick = (leader) => {
    setSelectedLeader(leader);
    // Scroll to top on mobile when selecting a new leader
    if (isMobile) {
      setTimeout(() => {
        const mainCard = document.getElementById('featured-leader-card');
        if (mainCard) {
          mainCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  };

  const getRoleColor = (role) => {
    if (!role) return 'from-amber-600 to-orange-600';
    const roleLower = role.toLowerCase();
    if (roleLower.includes('principal')) return 'from-amber-700 via-orange-700 to-amber-800';
    if (roleLower.includes('deputy')) return 'from-amber-600 to-orange-600';
    return 'from-amber-600 to-orange-600';
  };

  const getLeaderTitle = (leader) => {
    if (!leader) return 'Staff Member';
    if (leader === principal) return 'Chief Principal';
    if (leader === academicsDeputy) return 'Deputy Principal - Academics';
    if (leader === adminDeputy) return 'Deputy Principal - Administration';
    if (leader.position) return leader.position;
    if (leader.role) return leader.role;
    return 'Staff Member';
  };

  const getLeaderSubtitle = (leader) => {
    if (!leader) return '';
    if (leader === principal) return 'Executive Leadership';
    if (leader === academicsDeputy) return 'Academics & Curriculum';
    if (leader === adminDeputy) return 'Administration & Student Affairs';
    return leader.department || 'School Administration';
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 space-y-4 bg-white min-h-screen">
        <div className="relative">
          <FiLoader className="w-10 h-10 text-amber-600 animate-spin" />
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
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center p-8 bg-slate-50 rounded-3xl border border-slate-200">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
            <FiAward className="text-red-500 text-2xl" />
          </div>
          <h3 className="text-xl font-black text-slate-900 mb-2">Error Loading Data</h3>
          <p className="text-slate-600 mb-6">{error}</p>
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

  if (!principal) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center p-8">
          <h3 className="text-xl font-black text-slate-900 mb-2">No Staff Data Available</h3>
          <p className="text-slate-600">Please check back later.</p>
        </div>
      </div>
    );
  }

  const leadershipTeam = [
    { staff: principal, label: 'Chief Principal', color: 'from-amber-700 to-orange-700', isPrincipal: true, subtitle: 'Executive Leadership' },
    { staff: academicsDeputy, label: 'Deputy Principal - Academics', color: 'from-amber-600 to-orange-600', isPrincipal: false, subtitle: 'Academics & Curriculum' },
    { staff: adminDeputy, label: 'Deputy Principal - Administration', color: 'from-amber-600 to-orange-600', isPrincipal: false, subtitle: 'Administration & Student Affairs' },
  ].filter((item) => item.staff !== null);

  const currentLeader = selectedLeader || principal;

  return (
    <div className="min-h-screen bg-white text-slate-900 overflow-x-hidden">
      
      {/* Hero Section */}
      <section className="relative py-12 sm:py-16 md:py-20 lg:py-24 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 left-1/2 h-[30rem] w-[30rem] -translate-x-1/2 rounded-full bg-gradient-to-br from-amber-200/70 via-orange-200/40 to-amber-200/30 blur-3xl" />
          <div className="absolute -bottom-28 left-10 h-[22rem] w-[22rem] rounded-full bg-gradient-to-br from-orange-200/40 to-amber-200/20 blur-3xl" />
          <div className="absolute top-24 right-10 h-[20rem] w-[20rem] rounded-full bg-gradient-to-br from-amber-200/35 to-orange-200/20 blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-8 md:mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-slate-200 text-[10px] font-black uppercase tracking-[0.25em] text-slate-700 mb-5">
              <IoPeopleOutline className="w-4 h-4 text-amber-600" />
              Executive Leadership
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 leading-tight mb-3 md:mb-4 tracking-tight">
              Meet Our{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700">
                Executive Leadership
              </span>
            </h1>
            <p className="text-slate-600 text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed font-medium px-4">
              Visionary leaders dedicated to academic excellence, student development, and institutional transformation.
            </p>
          </div>
        </div>
      </section>

      {/* Mobile: Deputy Selector Cards (Visible only on mobile) */}
      {isMobile && (
        <div className="md:hidden px-4 mb-6">
          <div className="flex flex-col gap-3">
            {leadershipTeam.slice(1).map(({ staff, label, color, subtitle }) => (
              <button
                key={staff.id}
                onClick={() => handleLeaderClick(staff)}
                className={`flex items-center gap-4 p-4 rounded-2xl border transition-all text-left ${
                  selectedLeader?.id === staff.id
                    ? 'border-amber-500 bg-amber-50 ring-2 ring-amber-200'
                    : 'border-slate-200 bg-white hover:border-amber-300 hover:bg-amber-50/30'
                }`}
              >
                <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0">
                  {getImageUrl(staff.image) ? (
                    <img
                      src={getImageUrl(staff.image)}
                      alt={staff.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(staff.name)}&background=d97706&color=fff&bold=true&size=80`;
                      }}
                    />
                  ) : (
                    <div className={`w-full h-full bg-gradient-to-br ${color} flex items-center justify-center`}>
                      <GiGraduateCap className="text-white text-2xl" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-[10px] font-black text-amber-600 uppercase tracking-wider">{label}</p>
                  <h3 className="font-black text-slate-900 text-sm">{staff.name}</h3>
                  <p className="text-slate-500 text-xs">{subtitle}</p>
                </div>
                {selectedLeader?.id === staff.id && (
                  <div className="w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center">
                    <FiCheck className="text-white text-xs" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Featured Leader Card */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 md:pb-20 relative z-10">
        
        {/* Desktop: Side by side deputies (Hidden on mobile) */}
        {!isMobile && leadershipTeam.length > 1 && (
          <div className="hidden md:grid grid-cols-2 gap-6 mb-12">
            {leadershipTeam.slice(1).map(({ staff, label, color, subtitle }) => (
              <button
                key={staff.id}
                onClick={() => handleLeaderClick(staff)}
                className={`group bg-white rounded-2xl border overflow-hidden transition-all text-left hover:shadow-xl ${
                  selectedLeader?.id === staff.id
                    ? 'border-amber-500 ring-2 ring-amber-200'
                    : 'border-slate-200 hover:border-amber-300'
                }`}
              >
                <div className="flex items-center gap-4 p-5">
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0">
                    {getImageUrl(staff.image) ? (
                      <img
                        src={getImageUrl(staff.image)}
                        alt={staff.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(staff.name)}&background=d97706&color=fff&bold=true&size=96`;
                        }}
                      />
                    ) : (
                      <div className={`w-full h-full bg-gradient-to-br ${color} flex items-center justify-center`}>
                        <GiGraduateCap className="text-white text-2xl" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] font-black text-amber-600 uppercase tracking-wider">{label}</p>
                    <h3 className="font-black text-slate-900 text-base">{staff.name}</h3>
                    <p className="text-slate-500 text-xs">{subtitle}</p>
                  </div>
                  {selectedLeader?.id === staff.id && (
                    <div className="w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center">
                      <FiCheck className="text-white text-xs" />
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Main Featured Card - Shows selected leader */}
        <div id="featured-leader-card" className="relative group bg-white rounded-[2rem] border-2 border-amber-200 shadow-[0_20px_50px_rgba(245,158,11,0.12)] overflow-hidden">
          {/* Special Golden Accent Bar */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 z-10" />
          
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Image Side */}
            <div className="relative h-80 md:h-96 lg:h-full lg:min-h-[550px]">
              {getImageUrl(currentLeader?.image) ? (
                <img
                  src={getImageUrl(currentLeader.image)}
                  alt={currentLeader?.name}
                  className="w-full h-full object-cover object-top"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      currentLeader?.name || 'Leader'
                    )}&background=d97706&color=fff&bold=true&size=512`;
                  }}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-amber-700 to-orange-700 flex items-center justify-center">
                  <GiGraduateCap className="text-8xl md:text-9xl text-white/40" />
                </div>
              )}
              
              {/* Special Crown Badge for Principal */}
              {currentLeader === principal && (
                <div className="absolute top-4 left-4 md:top-6 md:left-6">
                  <div className="px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-amber-500 text-white text-[8px] md:text-[10px] font-black uppercase tracking-wider shadow-lg flex items-center gap-1 md:gap-2">
                    <IoSparkles className="w-2 h-2 md:w-3 md:h-3" />
                    Chief Principal
                  </div>
                </div>
              )}
              
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6 lg:hidden">
                <h2 className="text-xl md:text-2xl font-black text-white mb-1">{currentLeader?.name}</h2>
                <p className="text-amber-300/90 text-xs md:text-sm">{getLeaderSubtitle(currentLeader)}</p>
              </div>
            </div>

            {/* Content Side */}
            <div className="p-5 sm:p-6 md:p-8 lg:p-10 flex flex-col justify-between">
              <div>
                <div className="hidden lg:block mb-4 md:mb-6">
                  <div className="inline-block px-3 py-1 md:px-4 md:py-1.5 rounded-full bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 text-[9px] md:text-[10px] font-black uppercase tracking-wider border border-amber-200">
                    {getLeaderTitle(currentLeader)}
                  </div>
                </div>
                <h2 className="hidden lg:block text-2xl md:text-3xl lg:text-4xl font-black text-slate-900 mb-1 md:mb-2">{currentLeader?.name}</h2>
                <p className="hidden lg:block text-amber-600 font-bold text-sm md:text-base mb-6 md:mb-8">{getLeaderSubtitle(currentLeader)}</p>

                {/* Quote */}
                {currentLeader?.quote && (
                  <div className="rounded-2xl border-l-4 border-amber-500 bg-amber-50/50 p-4 md:p-5 mb-5 md:mb-6">
                    <div className="flex items-start gap-2 md:gap-3">
                      <FiMessageSquare className="text-amber-500 text-base md:text-lg mt-0.5 shrink-0" />
                      <div>
                        <span className="text-[9px] md:text-[10px] font-black text-amber-600 uppercase tracking-wider block mb-1 md:mb-1.5">
                          Leadership Philosophy
                        </span>
                        <p className="text-slate-700 font-medium text-xs sm:text-sm md:text-base leading-relaxed italic">
                          "{currentLeader.quote}"
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Bio */}
                <div className="mb-5 md:mb-6">
                  <div className="flex items-center gap-2 mb-2 md:mb-3">
                    <div className="w-6 h-6 md:w-7 md:h-7 rounded-lg bg-gradient-to-br from-amber-600 to-orange-600 flex items-center justify-center">
                      <FiUser className="text-white text-[10px] md:text-xs" />
                    </div>
                    <h3 className="text-[10px] md:text-[11px] font-black text-slate-700 uppercase tracking-wider">
                      Professional Profile
                    </h3>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-3 md:p-4 border border-slate-100">
                    <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">
                      {currentLeader?.bio ||
                        (currentLeader === principal 
                          ? `${currentLeader?.name} serves as the Chief Principal of Kinyui Boys Senior School, bringing visionary leadership and decades of educational experience to the institution. Under their stewardship, the school has achieved remarkable milestones in academic excellence and holistic student development.`
                          : `${currentLeader?.name} is a dedicated member of our executive leadership team, committed to excellence in ${currentLeader === academicsDeputy ? 'academic affairs and curriculum development' : 'administration and student welfare'}.`)}
                    </p>
                  </div>
                </div>

                {/* Key Statistics - Only for Principal */}
                {currentLeader === principal && (
                  <div className="grid grid-cols-3 gap-2 md:gap-3 mt-4 md:mt-6">
                    <div className="text-center p-2 md:p-3 bg-amber-50 rounded-xl border border-amber-100">
                      <p className="text-base md:text-lg font-black text-amber-600">25+</p>
                      <p className="text-[8px] md:text-[9px] font-bold text-slate-600">Years Exp.</p>
                    </div>
                    <div className="text-center p-2 md:p-3 bg-amber-50 rounded-xl border border-amber-100">
                      <p className="text-base md:text-lg font-black text-amber-600">8.2</p>
                      <p className="text-[8px] md:text-[9px] font-bold text-slate-600">Mean Score</p>
                    </div>
                    <div className="text-center p-2 md:p-3 bg-amber-50 rounded-xl border border-amber-100">
                      <p className="text-base md:text-lg font-black text-amber-600">1200+</p>
                      <p className="text-[8px] md:text-[9px] font-bold text-slate-600">Students</p>
                    </div>
                  </div>
                )}

                {/* Key Responsibilities - For Deputies */}
                {currentLeader !== principal && currentLeader?.responsibilities && currentLeader.responsibilities.length > 0 && (
                  <div className="mt-4 md:mt-6">
                    <h3 className="text-[10px] md:text-[11px] font-black text-slate-700 uppercase tracking-wider mb-2 md:mb-3">Key Responsibilities</h3>
                    <div className="flex flex-wrap gap-1.5 md:gap-2">
                      {currentLeader.responsibilities.slice(0, 3).map((resp, idx) => (
                        <span key={idx} className="px-2 py-1 md:px-3 md:py-1.5 bg-slate-100 text-slate-700 text-[9px] md:text-[10px] font-bold rounded-lg">
                          {resp}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Contact */}
              <div className="mt-5 md:mt-6 pt-3 md:pt-4 border-t border-slate-200">
                {currentLeader?.email && (
                  <a
                    href={`mailto:${currentLeader.email}`}
                    className="inline-flex items-center gap-2 text-amber-600 font-bold text-xs md:text-sm hover:text-amber-700 transition-colors"
                  >
                    <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-amber-50 flex items-center justify-center">
                      <FiMail className="text-sm md:text-base" />
                    </div>
                    {currentLeader.email}
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile: Back to Principal Button (only shows when viewing a deputy) */}
        {isMobile && selectedLeader !== principal && (
          <div className="mt-6 flex justify-center">
            <button
              onClick={() => handleLeaderClick(principal)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 font-black text-xs uppercase tracking-wider hover:bg-amber-100 transition-all"
            >
              <FiArrowLeft size={12} />
              Back to Principal
            </button>
          </div>
        )}

        {/* View All Staff Button */}
        <div className="text-center mt-12 md:mt-16 pt-6 md:pt-8 border-t border-slate-200">
          <div className="inline-flex flex-col items-center gap-3 md:gap-4">
            <div className="w-10 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent" />
            <button
              onClick={() => router.push('/pages/staff')}
              className="group inline-flex items-center gap-2 md:gap-3 px-6 md:px-8 py-3 md:py-4 rounded-xl md:rounded-2xl bg-white border-2 border-amber-600 text-amber-700 font-black text-xs md:text-sm tracking-wide hover:bg-gradient-to-r hover:from-amber-600 hover:to-orange-600 hover:text-white hover:border-transparent transition-all duration-300 shadow-md hover:shadow-xl"
            >
              <FiEye className="w-4 h-4 md:w-5 md:h-5 group-hover:scale-110 transition-transform" />
              View Complete Staff Directory
              <FiChevronRight className="w-3 h-3 md:w-4 md:h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <p className="text-[10px] md:text-xs text-slate-500 font-medium">
              Explore our full faculty directory including HODs, teachers, and support staff
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernStaffLeadership;