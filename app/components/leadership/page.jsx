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

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/staff');
        const data = await response.json();

        if (data.success && Array.isArray(data.staff)) {
          const allStaff = data.staff;
          setStaff(allStaff);

          // Find Principal (Chief Principal)
          const foundPrincipal = allStaff.find(
            (s) =>
              s.position?.toLowerCase() === 'chief principal' ||
              s.role?.toLowerCase() === 'principal' ||
              s.position?.toLowerCase().includes('principal') ||
              s.id === 1
          ) || allStaff[0];

          setPrincipal(foundPrincipal);

          // Find Deputy Academics
          const foundAcademicsDeputy = allStaff.find(
            (s) =>
              s.position?.toLowerCase().includes('deputy') &&
              (s.position?.toLowerCase().includes('academic') ||
               s.role?.toLowerCase().includes('academic'))
          );

          // Find Deputy Administration
          const foundAdminDeputy = allStaff.find(
            (s) =>
              s.position?.toLowerCase().includes('deputy') &&
              (s.position?.toLowerCase().includes('admin') ||
               s.role?.toLowerCase().includes('admin') ||
               s.position?.toLowerCase().includes('administration'))
          );

          setAcademicsDeputy(foundAcademicsDeputy || null);
          setAdminDeputy(foundAdminDeputy || null);
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

  const getRoleColor = (role) => {
    if (!role) return 'from-amber-600 to-orange-600';
    const roleLower = role.toLowerCase();
    if (roleLower.includes('principal')) return 'from-amber-700 via-orange-700 to-amber-800';
    if (roleLower.includes('deputy')) return 'from-amber-600 to-orange-600';
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
    { staff: principal, label: 'Chief Principal', color: 'from-amber-700 to-orange-700', isPrincipal: true },
    { staff: academicsDeputy, label: 'Deputy Principal - Academics', color: 'from-amber-600 to-orange-600', isPrincipal: false },
    { staff: adminDeputy, label: 'Deputy Principal - Administration', color: 'from-amber-600 to-orange-600', isPrincipal: false },
  ].filter((item) => item.staff !== null);

  return (
    <div className="min-h-screen bg-white text-slate-900 overflow-x-hidden">
      
      {/* Hero Section */}
      <section className="relative py-16 sm:py-20 lg:py-24 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 left-1/2 h-[30rem] w-[30rem] -translate-x-1/2 rounded-full bg-gradient-to-br from-amber-200/70 via-orange-200/40 to-amber-200/30 blur-3xl" />
          <div className="absolute -bottom-28 left-10 h-[22rem] w-[22rem] rounded-full bg-gradient-to-br from-orange-200/40 to-amber-200/20 blur-3xl" />
          <div className="absolute top-24 right-10 h-[20rem] w-[20rem] rounded-full bg-gradient-to-br from-amber-200/35 to-orange-200/20 blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-slate-200 text-[10px] font-black uppercase tracking-[0.25em] text-slate-700 mb-5">
              <IoPeopleOutline className="w-4 h-4 text-amber-600" />
              Executive Leadership
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 leading-tight mb-4 tracking-tight">
              Meet Our{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700">
                Executive Leadership
              </span>
            </h1>
            <p className="text-slate-600 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed font-medium">
              Visionary leaders dedicated to academic excellence, student development, and institutional transformation.
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
            <div className="relative bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 md:p-10 shadow-lg">
              
              <div className="relative">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-[10px] font-black uppercase tracking-[0.25em] text-amber-700 mb-6">
                  <GiGraduateCap className="w-4 h-4 text-amber-600" />
                  School Administration
                </div>

                {/* Title */}
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 mb-4 tracking-tight">
                  The Pillars of{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700">
                    Kinyui's Success
                  </span>
                </h2>

                {/* Description Paragraphs */}
                <div className="space-y-4 text-slate-600 leading-relaxed">
                  <p className="text-sm sm:text-base">
                    At <span className="font-bold text-amber-600">Kinyui Boys Senior School</span>, our executive leadership team brings 
                    decades of combined experience in educational management, curriculum development, and institutional 
                    governance. The <span className="font-bold text-amber-600">Chief Principal, Deputy Principal (Academics), and Deputy 
                    Principal (Administration)</span> form the core decision-making body that steers the school towards 
                    its vision of excellence.
                  </p>

                  <p className="text-sm sm:text-base">
                    Together, this leadership triad oversees all aspects of school operations, from academic performance 
                    monitoring and curriculum implementation to student welfare, staff management, and strategic planning. 
                    Their collaborative approach ensures that every student receives quality education in a conducive 
                    environment that promotes holistic development.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 relative z-10">
        
        {/* Principal - Special Prominent Card */}
        {principal && (
          <div className="mb-16">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-100 to-orange-100 border border-amber-200 text-[11px] font-black uppercase tracking-[0.2em] text-amber-800">
                <IoShieldOutline className="w-4 h-4" />
                Chief Executive Officer
              </div>
            </div>
            
            <div className="relative group bg-white rounded-[2rem] border-2 border-amber-200 shadow-[0_20px_50px_rgba(245,158,11,0.15)] overflow-hidden">
              {/* Special Golden Accent Bar */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 z-10" />
              
              <div className="grid grid-cols-1 lg:grid-cols-2">
                {/* Image Side */}
                <div className="relative h-96 lg:h-full lg:min-h-[550px]">
                  {getImageUrl(principal?.image) ? (
                    <img
                      src={getImageUrl(principal.image)}
                      alt={principal?.name}
                      className="w-full h-full object-cover object-top"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          principal?.name || 'Principal'
                        )}&background=d97706&color=fff&bold=true&size=512`;
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-amber-700 to-orange-700 flex items-center justify-center">
                      <GiGraduateCap className="text-9xl text-white/40" />
                    </div>
                  )}
                  
                  {/* Special Crown Badge */}
                  <div className="absolute top-6 left-6">
                    <div className="px-4 py-2 rounded-full bg-amber-500 text-white text-[10px] font-black uppercase tracking-wider shadow-lg flex items-center gap-2">
                      <IoSparkles className="w-3 h-3" />
                      Chief Principal
                    </div>
                  </div>
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 lg:hidden">
                    <h2 className="text-2xl font-black text-white mb-1">{principal?.name}</h2>
                    <p className="text-amber-300/90 text-sm">{principal?.department || 'School Administration'}</p>
                  </div>
                </div>

                {/* Content Side */}
                <div className="p-6 sm:p-8 lg:p-10 flex flex-col justify-between">
                  <div>
                    <div className="hidden lg:block mb-6">
                      <div className="inline-block px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 text-[10px] font-black uppercase tracking-wider border border-amber-200">
                        Executive Leadership
                      </div>
                    </div>
                    <h2 className="hidden lg:block text-3xl sm:text-4xl font-black text-slate-900 mb-2">{principal?.name}</h2>
                    <p className="hidden lg:block text-amber-600 font-bold text-base mb-8">{principal?.position || 'Chief Principal'}</p>

                    {/* Quote */}
                    {principal?.quote && (
                      <div className="rounded-2xl border-l-4 border-amber-500 bg-amber-50/50 p-5 mb-6">
                        <div className="flex items-start gap-3">
                          <FiMessageSquare className="text-amber-500 text-lg mt-0.5 shrink-0" />
                          <div>
                            <span className="text-[10px] font-black text-amber-600 uppercase tracking-wider block mb-1.5">
                              Leadership Philosophy
                            </span>
                            <p className="text-slate-700 font-medium text-sm sm:text-base leading-relaxed italic">
                              "{principal.quote}"
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
                        <h3 className="text-[11px] font-black text-slate-700 uppercase tracking-wider">
                          Executive Profile
                        </h3>
                      </div>
                      <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                        <p className="text-slate-700 text-sm leading-relaxed">
                          {principal?.bio ||
                            `${principal?.name} serves as the Chief Principal of Kinyui Boys Senior School, bringing visionary leadership and decades of educational experience to the institution. Under their stewardship, the school has achieved remarkable milestones in academic excellence and holistic student development.`}
                        </p>
                      </div>
                    </div>

                    {/* Key Statistics */}
                    <div className="grid grid-cols-3 gap-3 mt-6">
                      <div className="text-center p-3 bg-amber-50 rounded-xl border border-amber-100">
                        <p className="text-lg font-black text-amber-600">25+</p>
                        <p className="text-[9px] font-bold text-slate-600">Years Experience</p>
                      </div>
                      <div className="text-center p-3 bg-amber-50 rounded-xl border border-amber-100">
                        <p className="text-lg font-black text-amber-600">8.2</p>
                        <p className="text-[9px] font-bold text-slate-600">Mean Score</p>
                      </div>
                      <div className="text-center p-3 bg-amber-50 rounded-xl border border-amber-100">
                        <p className="text-lg font-black text-amber-600">1200+</p>
                        <p className="text-[9px] font-bold text-slate-600">Students</p>
                      </div>
                    </div>
                  </div>

                  {/* Contact */}
                  <div className="mt-6 pt-4 border-t border-slate-200">
                    {principal?.email && (
                      <a
                        href={`mailto:${principal.email}`}
                        className="inline-flex items-center gap-2 text-amber-600 font-bold text-sm hover:text-amber-700 transition-colors"
                      >
                        <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center">
                          <FiMail className="text-sm" />
                        </div>
                        {principal.email}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Deputy Principals Grid */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-[10px] font-black uppercase tracking-[0.25em] text-slate-600">
              <FiUsers className="w-3 h-3" />
              Deputy Leadership
            </div>
            <h3 className="text-2xl font-black text-slate-900 mt-4">Supporting Executive Leadership</h3>
            <p className="text-slate-500 text-sm max-w-md mx-auto mt-2">
              Dedicated deputies ensuring academic excellence and operational efficiency
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {academicsDeputy && (
              <div className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300">
                <div className="relative h-64 overflow-hidden">
                  {getImageUrl(academicsDeputy.image) ? (
                    <img
                      src={getImageUrl(academicsDeputy.image)}
                      alt={academicsDeputy.name}
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(academicsDeputy.name)}&background=d97706&color=fff&bold=true&size=400`;
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-amber-600 to-orange-600 flex items-center justify-center">
                      <GiGraduateCap className="text-6xl text-white/40" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <div className="px-3 py-1 rounded-full bg-amber-500 text-white text-[9px] font-black uppercase tracking-wider">
                      Deputy Principal
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-black text-slate-900 mb-1">{academicsDeputy.name}</h3>
                  <p className="text-amber-600 text-sm font-bold mb-4">Academics</p>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {academicsDeputy.bio?.substring(0, 120) || "Oversees curriculum implementation, academic performance monitoring, and examination coordination."}
                  </p>
                  {academicsDeputy.email && (
                    <a href={`mailto:${academicsDeputy.email}`} className="inline-flex items-center gap-2 mt-4 text-amber-600 text-sm font-bold hover:text-amber-700">
                      <FiMail className="text-xs" /> Contact Deputy
                    </a>
                  )}
                </div>
              </div>
            )}

            {adminDeputy && (
              <div className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300">
                <div className="relative h-64 overflow-hidden">
                  {getImageUrl(adminDeputy.image) ? (
                    <img
                      src={getImageUrl(adminDeputy.image)}
                      alt={adminDeputy.name}
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(adminDeputy.name)}&background=d97706&color=fff&bold=true&size=400`;
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-orange-600 to-amber-600 flex items-center justify-center">
                      <GiGraduateCap className="text-6xl text-white/40" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <div className="px-3 py-1 rounded-full bg-amber-500 text-white text-[9px] font-black uppercase tracking-wider">
                      Deputy Principal
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-black text-slate-900 mb-1">{adminDeputy.name}</h3>
                  <p className="text-amber-600 text-sm font-bold mb-4">Administration</p>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {adminDeputy.bio?.substring(0, 120) || "Manages student affairs, discipline, co-curricular activities, and daily school operations."}
                  </p>
                  {adminDeputy.email && (
                    <a href={`mailto:${adminDeputy.email}`} className="inline-flex items-center gap-2 mt-4 text-amber-600 text-sm font-bold hover:text-amber-700">
                      <FiMail className="text-xs" /> Contact Deputy
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* View All Staff Button */}
        <div className="text-center mt-12 pt-8 border-t border-slate-200">
          <div className="inline-flex flex-col items-center gap-4">
            <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent" />
            <button
              onClick={() => router.push('/pages/staff')}
              className="group inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-white border-2 border-amber-600 text-amber-700 font-black text-sm tracking-wide hover:bg-gradient-to-r hover:from-amber-600 hover:to-orange-600 hover:text-white hover:border-transparent transition-all duration-300 shadow-md hover:shadow-xl"
            >
              <FiEye className="w-5 h-5 group-hover:scale-110 transition-transform" />
              View Complete Staff Directory
              <FiChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <p className="text-xs text-slate-500 font-medium">
              Explore our full faculty directory including HODs, teachers, and support staff
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernStaffLeadership;