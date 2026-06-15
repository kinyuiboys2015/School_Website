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
  FiShield,
  FiTarget,
  FiUser,
  FiBook,
  FiClipboard,
  FiInfo,
  FiUsers,
  FiChevronRight,
} from "react-icons/fi";
import {
  getDepartmentLeader,
  getDepartmentPathway,
  isCbcDepartment,
} from "../../../../../libs/staffDepartmentConfig";

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

const fetchDepartmentJson = async (url, attempts = 3) => {
  let lastError;

  for (let attempt = 0; attempt < attempts; attempt += 1) {
    try {
      const response = await fetch(url, { cache: "no-store" });
      const data = await response.json();

      if (response.ok && data.success) return data;
      lastError = new Error(data.error || `Request failed: ${response.status}`);
    } catch (error) {
      lastError = error;
    }

    if (attempt < attempts - 1) {
      await new Promise((resolve) => setTimeout(resolve, 750 * (attempt + 1)));
    }
  }

  throw lastError || new Error("Unable to load department");
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

      const data = await fetchDepartmentJson(
        `/api/staff/departments/${params.id}?includeStaff=1`
      );

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
  const leader = getDepartmentLeader(department);
  const pathway = getDepartmentPathway(department);
  const departmentStaff = department.staff || [];

  // Default Kinyui Boys Mathematics Department data
  const defaultOverview = "Coordinates Mathematics teaching, numeracy support, assessment preparation, and performance tracking across the school.";
  const defaultExtraDetails = [
    { key: "Notes", value: "Department information is maintained at group level.", icon: FiClipboard },
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

        {department.parentDepartment && (
          <Link
            href={`/pages/staff/departments/${department.parentDepartment.id}`}
            className="mb-5 ml-2 inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-blue-700"
          >
            {department.parentDepartment.name} <FiChevronRight size={13} />
          </Link>
        )}

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
            <div className={`grid gap-4 grid-cols-1 ${isCbcDepartment(department) ? "sm:grid-cols-4" : "sm:grid-cols-3"}`}>
              <ModernStatCard icon={FiUser} label={leader.label} value={leader.name || "Not listed"} color="emerald" />
              {isCbcDepartment(department) && (
                <ModernStatCard icon={FiTarget} label="CBC Pathway" value={pathway?.name || "Not listed"} color="blue" />
              )}
              <ModernStatCard icon={Icon} label="Category" value={meta.label} color="purple" />
              <ModernStatCard icon={FiUsers} label="Staff Members" value={department.staffCount || 0} color="blue" />
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

                {department.subDepartments?.length > 0 && (
                  <section>
                    <div className="mb-4 flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                        <FiLayers size={14} />
                      </div>
                      <h2 className="text-sm font-black uppercase tracking-widest text-slate-900">
                        Sub-Departments
                      </h2>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      {department.subDepartments.map((subDepartment) => (
                        <Link
                          key={subDepartment.id}
                          href={`/pages/staff/departments/${subDepartment.id}`}
                          className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <img
                            src={getDepartmentImage(subDepartment)}
                            alt={subDepartment.name}
                            className="h-20 w-20 shrink-0 rounded-xl object-cover"
                          />
                          <div className="min-w-0">
                            <p className="text-[9px] font-black uppercase tracking-widest text-blue-600">
                              Sub-Department
                            </p>
                            <h3 className="mt-1 text-base font-black text-slate-900">
                              {subDepartment.name}
                            </h3>
                            <p className="mt-2 text-xs font-bold text-slate-500">
                              {subDepartment.staffCount || 0} staff members
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </section>
                )}

                <section>
                  <div className="mb-4 flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                      <FiUsers size={14} />
                    </div>
                    <h2 className="text-sm font-black uppercase tracking-widest text-slate-900">
                      Assigned Staff
                    </h2>
                  </div>

                  {departmentStaff.length > 0 ? (
                    <div className="grid gap-3 sm:grid-cols-2">
                      {departmentStaff.map((staffMember) => (
                        <div
                          key={staffMember.id}
                          className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-3 shadow-sm"
                        >
                          <img
                            src={staffMember.image || "/teachers.png"}
                            alt={staffMember.name}
                            className="h-14 w-14 shrink-0 rounded-xl object-cover"
                          />
                          <div className="min-w-0">
                            <p className="truncate text-sm font-black text-slate-900">
                              {staffMember.name}
                            </p>
                            <p className="mt-1 truncate text-xs font-semibold text-slate-500">
                              {staffMember.position || staffMember.role}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-sm font-semibold text-slate-500">
                      No non-teaching staff members are assigned to this department yet.
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

          </div>
        </article>
      </div>
    </div>
  );
}
