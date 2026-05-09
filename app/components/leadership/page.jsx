'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  FiMail, FiAward, FiUser, FiMessageSquare,
  FiLoader, FiEye, FiChevronRight,
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
  const [principal, setPrincipal] = useState(null);
  const [academicsDeputy, setAcademicsDeputy] = useState(null);
  const [adminDeputy, setAdminDeputy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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

          // 1. Find Principal (Chief Principal)
          const foundPrincipal = allStaff.find(
            (s) =>
              s.position?.toLowerCase() === 'chief principal' ||
              s.role?.toLowerCase() === 'principal' ||
              s.position?.toLowerCase().includes('principal') ||
              s.id === 1
          ) || allStaff[0];
          setPrincipal(foundPrincipal);

          // 2. Find all deputies (exclude principal)
          const allDeputies = allStaff.filter(
            (member) =>
              member.id !== foundPrincipal?.id &&
              (member.role?.toLowerCase().includes('deputy') ||
               member.position?.toLowerCase().includes('deputy'))
          );

          // 3. Classify deputies based on position string
          let academic = null;
          let admin = null;

          for (const deputy of allDeputies) {
            const pos = deputy.position?.toLowerCase() || '';
            if (pos.includes('academic')) {
              academic = deputy;
            } else if (pos.includes('admin') || pos.includes('administration')) {
              admin = deputy;
            } else {
              // Fallback: first deputy becomes admin
              if (!admin) admin = deputy;
              else if (!academic) academic = deputy;
            }
          }

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

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 space-y-4 bg-white min-h-screen">
        <FiLoader className="w-10 h-10 text-amber-600 animate-spin" />
        <p className="text-sm font-bold text-slate-500">Loading leadership data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center p-8 bg-slate-50 rounded-3xl">
          <FiAward className="text-red-500 text-3xl mx-auto mb-4" />
          <h3 className="text-xl font-black text-slate-900 mb-2">Error Loading Data</h3>
          <p className="text-slate-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-2xl font-black"
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
        <p className="text-slate-600">No staff data available.</p>
      </div>
    );
  }

  // Build array of deputies that actually exist (Academics & Administration)
  const deputyCards = [
    { staff: academicsDeputy, label: 'Deputy Principal - Academics', subtitle: 'Academics & Curriculum' },
    { staff: adminDeputy, label: 'Deputy Principal - Administration', subtitle: 'Administration & Student Affairs' },
  ].filter((item) => item.staff !== null);

  return (
    <div className="min-h-screen bg-white text-slate-900 overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative py-12 sm:py-16 md:py-20 lg:py-24 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 left-1/2 h-[30rem] w-[30rem] -translate-x-1/2 rounded-full bg-gradient-to-br from-amber-200/70 via-orange-200/40 to-amber-200/30 blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-slate-200 text-[10px] font-black uppercase tracking-[0.25em] text-slate-700 mb-5">
            <IoPeopleOutline className="w-4 h-4 text-amber-600" />
            Executive Leadership
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 leading-tight mb-3 tracking-tight">
            Meet Our{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700">
              Executive Leadership
            </span>
          </h1>
          <p className="text-slate-600 text-sm sm:text-base md:text-lg max-w-2xl mx-auto">
            Visionary leaders dedicated to academic excellence, student development, and institutional transformation.
          </p>
        </div>
      </section>

      {/* Deputy Cards - only show existing deputies */}
      {deputyCards.length > 0 && (
        <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 ${!isMobile ? 'grid grid-cols-2 gap-6' : 'flex flex-col gap-4'}`}>
          {deputyCards.map(({ staff, label, subtitle }) => (
            <div key={staff.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
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
                    <div className="w-full h-full bg-gradient-to-br from-amber-600 to-orange-600 flex items-center justify-center">
                      <GiGraduateCap className="text-white text-2xl" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-[10px] font-black text-amber-600 uppercase tracking-wider">{label}</p>
                  <h3 className="font-black text-slate-900 text-base">{staff.name}</h3>
                  <p className="text-slate-500 text-xs">{subtitle}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Main Featured Card – PRINCIPAL (always shown, fixed) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 md:pb-20">
        <div className="relative bg-white rounded-[2rem] border-2 border-amber-200 shadow-[0_20px_50px_rgba(245,158,11,0.12)] overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500" />
          
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Image column */}
            <div className="relative h-80 md:h-96 lg:h-full lg:min-h-[550px]">
              {getImageUrl(principal.image) ? (
                <img
                  src={getImageUrl(principal.image)}
                  alt={principal.name}
                  className="w-full h-full object-cover object-top"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(principal.name)}&background=d97706&color=fff&bold=true&size=512`;
                  }}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-amber-700 to-orange-700 flex items-center justify-center">
                  <GiGraduateCap className="text-8xl md:text-9xl text-white/40" />
                </div>
              )}
              
              <div className="absolute top-4 left-4">
                <div className="px-3 py-1.5 rounded-full bg-amber-500 text-white text-[8px] md:text-[10px] font-black uppercase tracking-wider shadow-lg flex items-center gap-1">
                  <IoSparkles className="w-2 h-2 md:w-3 md:h-3" />
                  Chief Principal
                </div>
              </div>
              
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6 lg:hidden">
                <h2 className="text-xl md:text-2xl font-black text-white mb-1">{principal.name}</h2>
                <p className="text-amber-300/90 text-xs md:text-sm">Executive Leadership</p>
              </div>
            </div>

            {/* Content column */}
            <div className="p-5 sm:p-6 md:p-8 lg:p-10 flex flex-col justify-between">
              <div>
                <div className="hidden lg:block mb-4">
                  <div className="inline-block px-3 py-1 rounded-full bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 text-[9px] md:text-[10px] font-black uppercase tracking-wider border border-amber-200">
                    Chief Principal
                  </div>
                </div>
                <h2 className="hidden lg:block text-2xl md:text-3xl lg:text-4xl font-black text-slate-900 mb-1">{principal.name}</h2>
                <p className="hidden lg:block text-amber-600 font-bold text-sm md:text-base mb-6">Executive Leadership</p>

                {/* Quote from API */}
                {principal.quote && (
                  <div className="rounded-2xl border-l-4 border-amber-500 bg-amber-50/50 p-4 md:p-5 mb-5">
                    <div className="flex items-start gap-2">
                      <FiMessageSquare className="text-amber-500 text-base md:text-lg mt-0.5 shrink-0" />
                      <div>
                        <span className="text-[9px] font-black text-amber-600 uppercase tracking-wider block mb-1">
                          Leadership Philosophy
                        </span>
                        <p className="text-slate-700 font-medium text-xs sm:text-sm md:text-base leading-relaxed italic">
                          "{principal.quote}"
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Bio from API */}
                {principal.bio && (
                  <div className="mb-5">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-amber-600 to-orange-600 flex items-center justify-center">
                        <FiUser className="text-white text-[10px]" />
                      </div>
                      <h3 className="text-[10px] font-black text-slate-700 uppercase tracking-wider">
                        Professional Profile
                      </h3>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-3 md:p-4 border border-slate-100">
                      <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">{principal.bio}</p>
                    </div>
                  </div>
                )}

                {/* Education & Experience (if available) */}
                {(principal.education || principal.experience) && (
                  <div className="space-y-3 mt-4">
                    {principal.education && (
                      <div>
                        <h4 className="text-[10px] font-black text-slate-700 uppercase tracking-wider mb-1">Education</h4>
                        <p className="text-slate-600 text-xs">{principal.education}</p>
                      </div>
                    )}
                    {principal.experience && (
                      <div>
                        <h4 className="text-[10px] font-black text-slate-700 uppercase tracking-wider mb-1">Experience</h4>
                        <p className="text-slate-600 text-xs">{principal.experience}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Email from API */}
              {principal.email && (
                <div className="mt-5 pt-3 border-t border-slate-200">
                  <a
                    href={`mailto:${principal.email}`}
                    className="inline-flex items-center gap-2 text-amber-600 font-bold text-xs md:text-sm hover:text-amber-700"
                  >
                    <div className="w-7 h-7 rounded-full bg-amber-50 flex items-center justify-center">
                      <FiMail className="text-sm" />
                    </div>
                    {principal.email}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* View All Staff Button */}
        <div className="text-center mt-12 pt-6 border-t border-slate-200">
          <button
            onClick={() => router.push('/pages/staff')}
            className="inline-flex items-center gap-2 px-6 md:px-8 py-3 md:py-4 rounded-xl md:rounded-2xl bg-white border-2 border-amber-600 text-amber-700 font-black text-xs md:text-sm tracking-wide hover:bg-gradient-to-r hover:from-amber-600 hover:to-orange-600 hover:text-white transition-all"
          >
            <FiEye className="w-4 h-4" />
            View Complete Staff Directory
            <FiChevronRight className="w-3 h-3" />
          </button>
          <p className="text-[10px] text-slate-500 font-medium mt-2">
            Explore our full faculty directory including HODs, teachers, and support staff
          </p>
        </div>
      </div>
    </div>
  );
};

export default ModernStaffLeadership;