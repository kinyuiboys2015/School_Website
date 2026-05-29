"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  FiArrowLeft,
  FiAward,
  FiBookOpen,
  FiBriefcase,
  FiCheckCircle,
  FiLayers,
  FiMapPin,
  FiRefreshCw,
  FiShield,
  FiTarget,
  FiUser,
  FiUsers,
  FiBook,
  FiClipboard,
  FiInfo,
} from "react-icons/fi";

const CATEGORY_META = {
  CBC: {
    label: "CBC Department",
    icon: FiBookOpen,
    badge: "bg-blue-50 text-blue-700 border-blue-200",
    accent: "from-blue-600 to-cyan-600",
  },
  EIGHT_FOUR_FOUR: {
    label: "8-4-4 Department",
    icon: FiAward,
    badge: "bg-amber-50 text-amber-700 border-amber-200",
    accent: "from-amber-500 to-orange-600",
  },
  TEACHING: {
    label: "Teaching Department",
    icon: FiBriefcase,
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
    accent: "from-emerald-500 to-teal-600",
  },
  SUPPORT: {
    label: "Support Department",
    icon: FiShield,
    badge: "bg-slate-50 text-slate-700 border-slate-200",
    accent: "from-slate-700 to-slate-900",
  },
};

const getCategoryMeta = (category) => CATEGORY_META[category] || CATEGORY_META.TEACHING;

const getDepartmentImage = (department) => {
  return department?.image || department?.images?.[0]?.url || "/teachers.png";
};

const getTeacherImage = (teacher) => {
  if (teacher?.image) return teacher.image;
  return teacher?.gender === "female" ? "/female.png" : "/male.png";
};

const parseExtra = (extra) => {
  if (!extra) return {};
  if (typeof extra === "object") return extra;

  try {
    return JSON.parse(extra);
  } catch {
    return {};
  }
};

const formatKey = (key) => {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^./, (char) => char.toUpperCase());
};

const formatValue = (value) => {
  if (Array.isArray(value)) return value.filter(Boolean).join(", ");
  if (value && typeof value === "object") return Object.values(value).filter(Boolean).join(", ");
  return value?.toString() || "";
};

// REDESIGNED: Modern stat card with gradient accent
const ModernStatCard = ({ icon: Icon, label, value, color = "slate" }) => {
  const colorStyles = {
    slate: { bg: "bg-slate-50", iconBg: "bg-slate-900", text: "text-slate-900" },
    blue: { bg: "bg-blue-50", iconBg: "bg-blue-600", text: "text-blue-900" },
    emerald: { bg: "bg-emerald-50", iconBg: "bg-emerald-600", text: "text-emerald-900" },
    amber: { bg: "bg-amber-50", iconBg: "bg-amber-600", text: "text-amber-900" },
    purple: { bg: "bg-purple-50", iconBg: "bg-purple-600", text: "text-purple-900" },
  };
  const styles = colorStyles[color] || colorStyles.slate;

  return (
    <div className={`rounded-xl ${styles.bg} p-4 border border-${color}-100 transition-all hover:shadow-md`}>
      <div className="flex items-center gap-3">
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${styles.iconBg} text-white`}>
          <Icon size={18} />
        </div>
        <div className="min-w-0">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</p>
          <p className={`mt-1 truncate text-base font-black ${styles.text}`}>{value || "Not listed"}</p>
        </div>
      </div>
    </div>
  );
};

// REDESIGNED: Teacher card with modern hover effects
const ModernTeacherCard = ({ teacher }) => (
  <article className="group overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
    <div className="relative aspect-[4/3] bg-gradient-to-br from-slate-200 to-slate-100 overflow-hidden">
      <img
        src={getTeacherImage(teacher)}
        alt={teacher.name}
        className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      {teacher.subjectOffered && (
        <span className="absolute bottom-3 left-3 right-3 rounded-full bg-white/95 backdrop-blur-sm px-3 py-1.5 text-center text-[10px] font-black uppercase tracking-widest text-emerald-700 shadow-md">
          {teacher.subjectOffered}
        </span>
      )}
    </div>
    <div className="p-4">
      <h3 className="truncate text-base font-black text-slate-900 group-hover:text-blue-600 transition-colors">
        {teacher.name}
      </h3>
      <div className="mt-1 flex items-center gap-2">
        <span className="inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Teaching Staff</p>
      </div>
      {teacher.bio && (
        <p className="mt-3 line-clamp-2 text-xs font-medium leading-relaxed text-slate-500">
          {teacher.bio}
        </p>
      )}
    </div>
  </article>
);

// REDESIGNED: Info badge component
const InfoBadge = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-3 rounded-xl border border-slate-100 bg-white p-4 shadow-sm transition-all hover:shadow-md hover:border-slate-200">
    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
      <Icon size={14} />
    </div>
    <div className="min-w-0 flex-1">
      <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">{label}</p>
      <p className="mt-1 text-sm font-semibold text-slate-700 break-words">{value}</p>
    </div>
  </div>
);

export default function StaffDepartmentDetailPage() {
  const params = useParams();
  const [department, setDepartment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDepartment = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/staff/departments/${params.id}?includeTeachers=1`, {
        cache: "no-store",
      });
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Department not found");
      }

      setDepartment(data.department);
    } catch (err) {
      console.error("Error loading department:", err);
      setError(err.message || "Unable to load department");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (params?.id) fetchDepartment();
  }, [params?.id]);

  const extraDetails = useMemo(() => {
    const extra = parseExtra(department?.extra);
    return Object.entries(extra)
      .map(([key, value]) => [key, formatValue(value)])
      .filter(([, value]) => value);
  }, [department?.extra]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
        <div className="text-center">
          <div className="relative mx-auto h-12 w-12">
            <div className="absolute inset-0 rounded-full border-2 border-slate-200"></div>
            <div className="absolute inset-0 rounded-full border-2 border-t-blue-600 border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
          </div>
          <p className="mt-4 text-sm font-black uppercase tracking-widest text-slate-500">Loading department</p>
        </div>
      </div>
    );
  }

  if (error || !department) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
        <div className="max-w-md rounded-2xl border border-red-100 bg-white p-8 text-center shadow-sm">
          <FiLayers className="mx-auto text-5xl text-red-300" />
          <h1 className="mt-4 text-2xl font-black text-slate-900">Department Unavailable</h1>
          <p className="mt-2 text-sm leading-relaxed text-slate-500">{error || "This department could not be found."}</p>
          <Link
            href="/pages/staff"
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-xs font-black uppercase tracking-widest text-white transition-all hover:bg-slate-800"
          >
            <FiArrowLeft size={14} /> Back to Staff
          </Link>
        </div>
      </div>
    );
  }

  const meta = getCategoryMeta(department.category);
  const Icon = meta.icon;
  const teachers = Array.isArray(department.teachers)
    ? department.teachers
    : Array.isArray(department.staff)
    ? department.staff
    : [];

  // Default Kinyui Boys Mathematics Department data
  const defaultOverview = "Coordinates Mathematics teaching, numeracy support, assessment preparation, and performance tracking across the school.";
  const defaultExtraDetails = [
    { key: "Notes", value: "Seeded from the 2025 Kinyui Boys teacher list.", icon: FiClipboard },
    { key: "Location", value: "Academic block", icon: FiMapPin },
    { key: "Subjects", value: "Mathematics", icon: FiBook },
    { key: "Focus Areas", value: "Mathematics, Numeracy, Assessment preparation", icon: FiTarget },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 text-slate-900">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:py-8">
        <Link
          href="/pages/staff"
          className="group mb-5 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs font-black uppercase tracking-widest text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:border-slate-300"
        >
          <FiArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" /> Staff Directory
        </Link>

        <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
          
          {/* TOP HERO IMAGE - UNCHANGED */}
          <div className="relative w-full">
            <div className="relative h-[55vh] sm:h-[65vh] lg:h-[70vh] w-full bg-slate-900">
              <img
                src={getDepartmentImage(department)}
                alt={department.name}
                className="absolute inset-0 h-full w-full object-contain bg-slate-800"
                style={{ objectPosition: "center top" }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
            </div>
            
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white sm:p-10">
              <span
                className={`inline-flex w-fit items-center gap-2 rounded-full bg-white/95 backdrop-blur-sm px-4 py-2 text-[10px] font-black uppercase tracking-widest shadow-md ${meta.badge}`}
              >
                <Icon size={14} /> {meta.label}
              </span>
              <h1 className="mt-4 max-w-3xl text-3xl font-black tracking-tight drop-shadow-lg sm:text-4xl lg:text-5xl">
                {department.name}
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/90 drop-shadow-md sm:text-base">
                {department.description || defaultOverview}
              </p>
            </div>
          </div>

          <div className="p-5 sm:p-8">
            
            {/* REDESIGNED STATS GRID - Modern cards with different colors */}
            <div className="grid gap-4 grid-cols-2 sm:grid-cols-4">
              <ModernStatCard icon={FiUsers} label="Teachers/Staff" value={`${department.staffCount || 0} members`} color="blue" />
              <ModernStatCard icon={FiUser} label="Head of Department" value={department.headName || "Miss Stella Marris"} color="emerald" />
              <ModernStatCard icon={FiShield} label="AHOD" value={department.assistantHeadName || "Not listed"} color="amber" />
              <ModernStatCard icon={Icon} label="Category" value={meta.label} color="purple" />
            </div>

            {/* REDESIGNED TWO-COLUMN LAYOUT */}
            <div className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
              
              {/* LEFT SIDE - Department Overview & Details */}
              <div className="space-y-6">
                {/* Overview Section - Redesigned */}
                <section className="rounded-2xl bg-gradient-to-br from-slate-50 to-white border border-slate-100 p-5 sm:p-6 shadow-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                      <FiInfo size={14} />
                    </div>
                    <h2 className="text-sm font-black uppercase tracking-widest text-slate-900">Department Overview</h2>
                  </div>
                  <p className="text-sm leading-7 text-slate-600 sm:text-base">
                    {department.description || defaultOverview}
                  </p>
                </section>

                {/* Additional Details - Redesigned as modern info badges */}
                <section>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                      <FiCheckCircle size={14} />
                    </div>
                    <h2 className="text-sm font-black uppercase tracking-widest text-slate-900">Additional Details</h2>
                  </div>
                  
                  {extraDetails.length > 0 ? (
                    <div className="grid gap-3 sm:grid-cols-2">
                      {extraDetails.map(([key, value]) => (
                        <InfoBadge key={key} icon={FiClipboard} label={formatKey(key)} value={value} />
                      ))}
                    </div>
                  ) : (
                    <div className="grid gap-3 sm:grid-cols-2">
                      {defaultExtraDetails.map((item) => (
                        <InfoBadge key={item.key} icon={item.icon} label={item.key} value={item.value} />
                      ))}
                    </div>
                  )}
                </section>
              </div>

              {/* RIGHT SIDE - Privacy Panel - Redesigned */}
              <div>
                <section className="rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 p-5 sm:p-6 text-white shadow-lg sticky top-6">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/20 text-white">
                      <FiShield size={14} />
                    </div>
                    <h2 className="text-sm font-black uppercase tracking-widest">Privacy Notice</h2>
                  </div>
                  <p className="text-sm leading-7 text-white/80">
                    Individual teacher and support staff contact details are not published. Department
                    information is shared at group level.
                  </p>
                  <div className="mt-4 pt-4 border-t border-white/20">
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/50">Data Protection Compliant</p>
                  </div>
                </section>
              </div>

            </div>

            {/* REDESIGNED TEACHERS GRID SECTION */}
            <section className="mt-10">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                    <FiUsers size={14} />
                  </div>
                  <h2 className="text-sm font-black uppercase tracking-widest text-slate-900">Department Teachers</h2>
                </div>
                {teachers.length > 0 && (
                  <span className="text-[10px] font-black text-slate-400 bg-slate-100 px-2 py-1 rounded-full">
                    {teachers.length} members
                  </span>
                )}
              </div>
              
              {teachers.length > 0 ? (
                <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                  {teachers.map((teacher) => (
                    <ModernTeacherCard key={teacher.id} teacher={teacher} />
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-12 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                      <FiUsers size={20} />
                    </div>
                    <p className="text-sm font-semibold text-slate-500">
                      Teachers assigned to this department will appear here.
                    </p>
                    <p className="text-xs text-slate-400">Check back soon for updates</p>
                  </div>
                </div>
              )}
            </section>
          </div>
        </article>
      </div>
    </div>
  );
}