'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  FiMail, FiAward, FiUser, FiCheck, FiArrowLeft,
  FiMessageSquare, FiLoader, FiEye, FiChevronRight,
  FiUsers, FiBriefcase, FiCalendar, FiMapPin
} from 'react-icons/fi';
import { IoPeopleOutline, IoSparkles } from 'react-icons/io5';
import { GiGraduateCap, GiMedal, GiCrown } from 'react-icons/gi';
import { MdOutlineDashboard } from 'react-icons/md';

const getImageUrl = (imagePath) => {
  if (!imagePath || typeof imagePath !== 'string') return null;
  const trimmedPath = imagePath.trim();
  if (!trimmedPath) return null;
  if (trimmedPath.includes('cloudinary.com')) return trimmedPath;
  if (trimmedPath.startsWith('/') || trimmedPath.startsWith('http')) return trimmedPath;
  return null;
};

const ModernStaffLeadership = () => {
  const router = useRouter();
  const [principal, setPrincipal] = useState(null);
  const [academicsDeputy, setAcademicsDeputy] = useState(null);
  const [adminDeputy, setAdminDeputy] = useState(null);
  const [teachers, setTeachers] = useState([]);
  const [supportStaff, setSupportStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedLeader, setSelectedLeader] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [layoutMode, setLayoutMode] = useState('featured'); // 'featured' or 'grid'

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

          // ----- PRINCIPAL DETECTION -----
          const foundPrincipal = allStaff.find(
            (s) =>
              s.position?.toLowerCase() === 'chief principal' ||
              s.role?.toLowerCase() === 'principal' ||
              s.position?.toLowerCase().includes('principal')
          ) || allStaff[0];
          setPrincipal(foundPrincipal);
          setSelectedLeader(foundPrincipal);

          // ----- DEPUTY DETECTION (FIXED) -----
          const allDeputies = allStaff.filter(
            (member) =>
              member.id !== foundPrincipal?.id &&
              (member.role?.toLowerCase().includes('deputy') ||
               member.position?.toLowerCase().includes('deputy'))
          );

          let academic = null;
          let admin = null;

          if (allDeputies.length === 1) {
            // Only one deputy – use for BOTH roles
            academic = allDeputies[0];
            admin = allDeputies[0];
          } else if (allDeputies.length >= 2) {
            academic = allDeputies.find(
              (d) => d.position?.toLowerCase().includes('academic')
            );
            admin = allDeputies.find(
              (d) =>
                d.position?.toLowerCase().includes('admin') ||
                d.position?.toLowerCase().includes('administration')
            );
            if (!academic) academic = allDeputies[0];
            if (!admin) admin = allDeputies[1] || allDeputies[0];
          }

          setAcademicsDeputy(academic);
          setAdminDeputy(admin);

          // ----- TEACHERS & SUPPORT STAFF (for stats) -----
          const allTeachers = allStaff.filter(s =>
            (s.role?.toLowerCase().includes('teacher') ||
             s.position?.toLowerCase().includes('teacher')) &&
            s.id !== foundPrincipal.id &&
            (!academic || s.id !== academic.id) &&
            (!admin || s.id !== admin.id)
          );
          setTeachers(allTeachers);

          const allSupport = allStaff.filter(s =>
            s.id !== foundPrincipal.id &&
            (!academic || s.id !== academic.id) &&
            (!admin || s.id !== admin.id) &&
            !allTeachers.includes(s)
          );
          setSupportStaff(allSupport);
        } else {
          throw new Error('Invalid API response');
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
    if (isMobile) {
      setTimeout(() => {
        const card = document.getElementById('featured-leader-card');
        if (card) card.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  };

  const getLeaderTitle = (leader) => {
    if (!leader) return 'Staff Member';
    if (leader === principal) return 'Chief Principal';
    if (leader === academicsDeputy) return 'Deputy Principal - Academics';
    if (leader === adminDeputy) return 'Deputy Principal - Administration';
    return leader.position || leader.role || 'Staff Member';
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
      <div className="flex flex-col items-center justify-center min-h-screen bg-white">
        <FiLoader className="w-10 h-10 text-amber-600 animate-spin" />
        <p className="mt-4 text-slate-500 font-medium">Loading leadership data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center p-8 bg-slate-50 rounded-3xl">
          <FiAward className="text-red-500 text-3xl mx-auto mb-4" />
          <h3 className="text-xl font-black">Error</h3>
          <p className="text-slate-600 mt-2">{error}</p>
          <button onClick={() => window.location.reload()} className="mt-4 px-6 py-2 bg-amber-600 text-white rounded-xl">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!principal) {
    return <div className="text-center py-20">No staff data available.</div>;
  }

  const leadershipTeam = [
    { staff: principal, label: 'Chief Principal', color: 'from-amber-700 to-orange-700', subtitle: 'Executive Leadership' },
    { staff: academicsDeputy, label: 'Deputy Principal - Academics', color: 'from-amber-600 to-orange-600', subtitle: 'Academics & Curriculum' },
    { staff: adminDeputy, label: 'Deputy Principal - Administration', color: 'from-amber-600 to-orange-600', subtitle: 'Administration & Student Affairs' },
  ].filter(item => item.staff !== null);

  const currentLeader = selectedLeader || principal;

  // ==================== GRID LAYOUT ====================
  if (layoutMode === 'grid') {
    return (
      <div className="min-h-screen bg-white">
        {/* Layout Toggle */}
        <div className="max-w-7xl mx-auto px-4 pt-8 flex justify-end">
          <button
            onClick={() => setLayoutMode('featured')}
            className="flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-700 rounded-xl text-sm font-bold"
          >
            <MdOutlineDashboard /> Switch to Featured Layout
          </button>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-black text-slate-900">Executive Leadership</h1>
            <p className="text-slate-600 mt-2">Meet our dedicated school leaders</p>
            <div className="w-24 h-1 bg-amber-500 mx-auto mt-4 rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {leadershipTeam.map((leader, idx) => (
              <div
                key={leader.staff.id}
                className={`group bg-white rounded-2xl overflow-hidden shadow-lg transition-all hover:shadow-xl hover:-translate-y-1 ${
                  leader.staff === principal ? 'ring-2 ring-amber-500' : 'border border-slate-200'
                }`}
              >
                <div className={`h-2 bg-gradient-to-r ${leader.color}`} />
                <div className="relative h-56 bg-slate-100">
                  {getImageUrl(leader.staff.image) ? (
                    <img
                      src={getImageUrl(leader.staff.image)}
                      alt={leader.staff.name}
                      className="w-full h-full object-cover object-top"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(leader.staff.name)}&background=d97706&color=fff&bold=true&size=200`;
                      }}
                    />
                  ) : (
                    <div className={`w-full h-full bg-gradient-to-br ${leader.color} flex items-center justify-center`}>
                      <GiGraduateCap className="text-white text-6xl opacity-70" />
                    </div>
                  )}
                  {leader.staff === principal && (
                    <div className="absolute top-3 right-3 bg-amber-500 text-white text-[10px] font-black px-2 py-1 rounded-full shadow-lg">
                      Principal
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="text-xl font-black text-slate-900">{leader.staff.name}</h3>
                  <p className="text-amber-600 font-bold text-sm mt-1">{leader.label}</p>
                  <p className="text-slate-500 text-xs">{leader.subtitle}</p>

                  {leader.staff.quote && (
                    <div className="mt-3 text-sm italic text-slate-600 border-l-3 border-amber-500 pl-3">
                      "{leader.staff.quote.substring(0, 80)}"
                    </div>
                  )}

                  <div className="mt-4 pt-3 border-t border-slate-100 space-y-1">
                    {leader.staff.department && (
                      <div className="flex items-center gap-2 text-xs text-slate-600">
                        <FiMapPin className="text-amber-500" size={12} />
                        <span>{leader.staff.department}</span>
                      </div>
                    )}
                    {leader.staff.joinDate && (
                      <div className="flex items-center gap-2 text-xs text-slate-600">
                        <FiCalendar className="text-amber-500" size={12} />
                        <span>Joined: {new Date(leader.staff.joinDate).getFullYear()}</span>
                      </div>
                    )}
                    {leader.staff.email && (
                      <a href={`mailto:${leader.staff.email}`} className="flex items-center gap-2 text-xs text-amber-600 mt-2">
                        <FiMail size={12} /> {leader.staff.email}
                      </a>
                    )}
                  </div>
                </div>
                <div className="px-5 pb-5">
                  <button
                    onClick={() => {
                      setSelectedLeader(leader.staff);
                      setLayoutMode('featured');
                    }}
                    className="w-full py-2 text-xs font-bold rounded-lg bg-slate-100 text-slate-700 hover:bg-amber-100 transition-colors"
                  >
                    View Full Profile →
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Notification when only one deputy serves both roles */}
          {academicsDeputy && adminDeputy && academicsDeputy.id === adminDeputy.id && (
            <div className="mt-8 text-center text-sm text-amber-700 bg-amber-50 p-3 rounded-lg">
              ℹ️ The same Deputy currently holds both Academic and Administrative responsibilities.
            </div>
          )}
        </div>
      </div>
    );
  }

  // ==================== FEATURED LAYOUT (ORIGINAL) ====================
  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Layout Toggle */}
      <div className="max-w-7xl mx-auto px-4 pt-6 flex justify-end">
        <button
          onClick={() => setLayoutMode('grid')}
          className="flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-700 rounded-xl text-sm font-bold"
        >
          <GiCrown /> Switch to Grid Layout
        </button>
      </div>

      {/* Hero Section */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-white to-orange-50" />
        <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-slate-200 text-[10px] font-black uppercase mb-5">
            <IoPeopleOutline className="text-amber-600" />
            Executive Leadership
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-slate-900">
            Meet Our{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600">
              Executive Leadership
            </span>
          </h1>
          <p className="text-slate-600 max-w-2xl mx-auto mt-4">
            Visionary leaders dedicated to academic excellence, student development, and institutional transformation.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 pb-20">
        {/* Mobile Deputy Selector */}
        {isMobile && leadershipTeam.length > 1 && (
          <div className="md:hidden mb-6 space-y-3">
            {leadershipTeam.slice(1).map(({ staff, label, color, subtitle }) => (
              <button
                key={staff.id}
                onClick={() => handleLeaderClick(staff)}
                className={`flex items-center gap-4 p-4 rounded-2xl border transition-all w-full text-left ${
                  selectedLeader?.id === staff.id
                    ? 'border-amber-500 bg-amber-50 ring-2 ring-amber-200'
                    : 'border-slate-200 bg-white'
                }`}
              >
                <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0">
                  {getImageUrl(staff.image) ? (
                    <img src={getImageUrl(staff.image)} alt={staff.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className={`w-full h-full bg-gradient-to-br ${color} flex items-center justify-center`}>
                      <GiGraduateCap className="text-white text-2xl" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-[10px] font-black text-amber-600 uppercase">{label}</p>
                  <h3 className="font-black text-slate-900 text-sm">{staff.name}</h3>
                  <p className="text-slate-500 text-xs">{subtitle}</p>
                </div>
                {selectedLeader?.id === staff.id && <FiCheck className="text-amber-500" />}
              </button>
            ))}
          </div>
        )}

        {/* Desktop Deputy Cards */}
        {!isMobile && leadershipTeam.length > 1 && (
          <div className="hidden md:grid grid-cols-2 gap-6 mb-12">
            {leadershipTeam.slice(1).map(({ staff, label, color, subtitle }) => (
              <button
                key={staff.id}
                onClick={() => handleLeaderClick(staff)}
                className={`bg-white rounded-2xl border p-5 flex items-center gap-4 transition-all ${
                  selectedLeader?.id === staff.id
                    ? 'border-amber-500 ring-2 ring-amber-200'
                    : 'border-slate-200 hover:border-amber-300'
                }`}
              >
                <div className="relative w-16 h-16 rounded-xl overflow-hidden">
                  {getImageUrl(staff.image) ? (
                    <img src={getImageUrl(staff.image)} alt={staff.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className={`w-full h-full bg-gradient-to-br ${color} flex items-center justify-center`}>
                      <GiGraduateCap className="text-white text-2xl" />
                    </div>
                  )}
                </div>
                <div className="flex-1 text-left">
                  <p className="text-[10px] font-black text-amber-600 uppercase">{label}</p>
                  <h3 className="font-black text-slate-900">{staff.name}</h3>
                  <p className="text-slate-500 text-xs">{subtitle}</p>
                </div>
                {selectedLeader?.id === staff.id && <FiCheck className="text-amber-500" />}
              </button>
            ))}
          </div>
        )}

        {/* Main Featured Card */}
        <div id="featured-leader-card" className="bg-white rounded-3xl border-2 border-amber-200 shadow-xl overflow-hidden">
          <div className="h-1.5 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500" />
          <div className="grid lg:grid-cols-2">
            {/* Image */}
            <div className="relative h-80 lg:h-auto min-h-[400px]">
              {getImageUrl(currentLeader.image) ? (
                <img
                  src={getImageUrl(currentLeader.image)}
                  alt={currentLeader.name}
                  className="w-full h-full object-cover object-top"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-amber-700 to-orange-700 flex items-center justify-center">
                  <GiGraduateCap className="text-8xl text-white/40" />
                </div>
              )}
              {currentLeader === principal && (
                <div className="absolute top-4 left-4 bg-amber-500 text-white text-[10px] font-black px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1">
                  <IoSparkles size={12} /> Chief Principal
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-0 p-6 lg:hidden">
                <h2 className="text-white text-2xl font-black">{currentLeader.name}</h2>
                <p className="text-amber-200 text-sm">{getLeaderSubtitle(currentLeader)}</p>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 lg:p-10 flex flex-col justify-between">
              <div>
                <div className="hidden lg:block mb-2">
                  <span className="inline-block px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-[10px] font-black uppercase">
                    {getLeaderTitle(currentLeader)}
                  </span>
                </div>
                <h2 className="hidden lg:block text-3xl font-black text-slate-900">{currentLeader.name}</h2>
                <p className="hidden lg:block text-amber-600 font-bold mt-1 mb-6">{getLeaderSubtitle(currentLeader)}</p>

                {currentLeader.quote && (
                  <div className="rounded-xl border-l-4 border-amber-500 bg-amber-50/50 p-4 mb-6">
                    <div className="flex gap-2">
                      <FiMessageSquare className="text-amber-500 mt-0.5" />
                      <div>
                        <p className="text-[10px] font-black text-amber-600 uppercase">Leadership Philosophy</p>
                        <p className="text-slate-700 text-sm italic">"{currentLeader.quote}"</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-amber-600 to-orange-600 flex items-center justify-center">
                      <FiUser className="text-white text-xs" />
                    </div>
                    <h3 className="text-[10px] font-black text-slate-700 uppercase">Professional Profile</h3>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-4">
                    <p className="text-slate-700 text-sm leading-relaxed">
                      {currentLeader.bio ||
                        (currentLeader === principal
                          ? `${currentLeader.name} serves as the Chief Principal, bringing visionary leadership and commitment to excellence.`
                          : `${currentLeader.name} is a dedicated member of our executive leadership team.`)}
                    </p>
                  </div>
                </div>

                {/* Dynamic Stats (from real data) */}
                {currentLeader === principal && (
                  <div className="grid grid-cols-3 gap-3 mt-2">
                    <div className="text-center p-3 bg-amber-50 rounded-xl">
                      <p className="text-lg font-black text-amber-600">{teachers.length + supportStaff.length}</p>
                      <p className="text-[9px] font-bold text-slate-600">Total Staff</p>
                    </div>
                    <div className="text-center p-3 bg-amber-50 rounded-xl">
                      <p className="text-lg font-black text-amber-600">{teachers.length}</p>
                      <p className="text-[9px] font-bold text-slate-600">Teachers</p>
                    </div>
                    <div className="text-center p-3 bg-amber-50 rounded-xl">
                      <p className="text-lg font-black text-amber-600">{supportStaff.length}</p>
                      <p className="text-[9px] font-bold text-slate-600">Support Staff</p>
                    </div>
                  </div>
                )}

                {currentLeader !== principal && currentLeader.responsibilities?.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-[10px] font-black text-slate-700 uppercase mb-2">Key Responsibilities</h3>
                    <div className="flex flex-wrap gap-1.5">
                      {currentLeader.responsibilities.slice(0, 3).map((resp, i) => (
                        <span key={i} className="px-2 py-1 bg-slate-100 text-slate-700 text-[10px] font-bold rounded-lg">
                          {resp}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {currentLeader.email && (
                <div className="mt-6 pt-4 border-t border-slate-200">
                  <a href={`mailto:${currentLeader.email}`} className="inline-flex items-center gap-2 text-amber-600 font-bold text-sm">
                    <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center">
                      <FiMail size={14} />
                    </div>
                    {currentLeader.email}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Back to Principal button (mobile) */}
        {isMobile && selectedLeader !== principal && (
          <div className="mt-6 flex justify-center">
            <button onClick={() => handleLeaderClick(principal)} className="flex items-center gap-2 px-5 py-2.5 bg-amber-50 border border-amber-200 text-amber-700 font-black text-xs rounded-xl">
              <FiArrowLeft size={12} /> Back to Principal
            </button>
          </div>
        )}

        {/* Footer button */}
        <div className="text-center mt-16 pt-8 border-t border-slate-200">
          <button
            onClick={() => router.push('/pages/staff')}
            className="inline-flex items-center gap-2 px-8 py-4 bg-white border-2 border-amber-600 text-amber-700 font-black rounded-xl hover:bg-gradient-to-r hover:from-amber-600 hover:to-orange-600 hover:text-white transition-all"
          >
            <FiEye /> View Staff Directory <FiChevronRight />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModernStaffLeadership;