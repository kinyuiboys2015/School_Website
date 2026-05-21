"use client";

import { useEffect, useMemo, useState } from "react";
import {
  FiBriefcase,
  FiCalendar,
  FiCheck,
  FiChevronRight,
  FiLoader,
  FiMail,
  FiMapPin,
  FiMessageSquare,
  FiPhone,
  FiRefreshCw,
  FiShield,
  FiStar,
  FiTarget,
  FiUser,
  FiUsers
} from "react-icons/fi";
import {
  BookOpen,
  Building2,
  Crown,
  GraduationCap,
  Medal,
  Sparkles,
  Trophy,
  UserRoundCheck
} from "lucide-react";

const getImageUrl = (imagePath) => {
  if (!imagePath || typeof imagePath !== "string") return null;
  const trimmedPath = imagePath.trim();
  if (!trimmedPath) return null;
  if (trimmedPath.includes("cloudinary.com")) return trimmedPath;
  if (trimmedPath.startsWith("http://") || trimmedPath.startsWith("https://")) return trimmedPath;
  if (trimmedPath.startsWith("/") || trimmedPath.startsWith("data:image")) return trimmedPath;
  return `/${trimmedPath}`;
};

const normalizeText = (value) => (value || "").toString().trim().toLowerCase();

const toArray = (value) => {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (!value) return [];

  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) return parsed.filter(Boolean);
    } catch {
      return value
        .split(/[,\n]/)
        .map((item) => item.trim())
        .filter(Boolean);
    }
  }

  return [];
};

const getInitials = (name = "Staff") =>
  name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

const isPrincipalStaff = (staff) => {
  const role = normalizeText(staff?.role);
  const position = normalizeText(staff?.position);

  return (
    role === "principal" ||
    role === "chief principal" ||
    (role.includes("principal") && !role.includes("deputy")) ||
    position === "principal" ||
    position === "chief principal" ||
    (position.includes("principal") && !position.includes("deputy"))
  );
};

const isDeputyStaff = (staff) => {
  if (isPrincipalStaff(staff)) return false;
  const role = normalizeText(staff?.role);
  const position = normalizeText(staff?.position);
  return role.includes("deputy") || position.includes("deputy");
};

const isSeniorTeacher = (staff) => {
  const combined = `${normalizeText(staff?.role)} ${normalizeText(staff?.position)}`;
  return combined.includes("senior teacher");
};

const isHodStaff = (staff) => {
  const combined = `${normalizeText(staff?.role)} ${normalizeText(staff?.position)}`;
  return combined.includes("head of department") || combined.includes("hod");
};

const getDeputyType = (staff) => {
  const combined = `${normalizeText(staff?.role)} ${normalizeText(staff?.position)}`;
  if (combined.includes("academic") || combined.includes("academics")) return "academics";
  if (combined.includes("admin") || combined.includes("administration")) return "administration";
  return "general";
};

const getLeaderRank = (staff) => {
  if (isPrincipalStaff(staff)) return 0;
  if (isDeputyStaff(staff)) {
    const type = getDeputyType(staff);
    if (type === "academics") return 1;
    if (type === "administration") return 2;
    return 3;
  }
  if (isSeniorTeacher(staff)) return 4;
  if (isHodStaff(staff)) return 5;
  return 6;
};

const getLeaderTitle = (staff) => {
  if (!staff) return "Leadership Profile";
  if (isPrincipalStaff(staff)) return "Chief Principal";
  if (isDeputyStaff(staff)) {
    const type = getDeputyType(staff);
    if (type === "academics") return "Deputy Principal - Academics";
    if (type === "administration") return "Deputy Principal - Administration";
    return staff.position || "Deputy Principal";
  }
  if (isSeniorTeacher(staff)) return staff.position || "Senior Teacher";
  if (isHodStaff(staff)) return staff.position || staff.role || "Head of Department";
  return staff.position || staff.role || "Leadership Team";
};

const getLeaderScope = (staff) => {
  if (!staff) return "School Leadership";
  if (isPrincipalStaff(staff)) return "Strategic Direction";
  if (isDeputyStaff(staff)) {
    const type = getDeputyType(staff);
    if (type === "academics") return "Curriculum, Academics and Assessment";
    if (type === "administration") return "Administration, Welfare and Discipline";
    return "Deputy Leadership";
  }
  if (isSeniorTeacher(staff)) return "Teaching Coordination";
  if (isHodStaff(staff)) return staff.department || staff.subjectOffered || "Department Leadership";
  return staff.department || staff.subjectOffered || "School Leadership";
};

const getRolePalette = (staff) => {
  if (isPrincipalStaff(staff)) {
    return {
      gradient: "from-orange-950 via-amber-900 to-orange-700",
      badge: "bg-amber-300 text-orange-950",
      soft: "bg-orange-50 text-orange-900 border-orange-200",
      icon: Crown
    };
  }

  if (isDeputyStaff(staff)) {
    return {
      gradient: "from-orange-900 via-orange-800 to-amber-700",
      badge: "bg-white/15 text-white",
      soft: "bg-amber-50 text-amber-900 border-amber-200",
      icon: Medal
    };
  }

  if (isSeniorTeacher(staff)) {
    return {
      gradient: "from-amber-900 via-orange-800 to-yellow-700",
      badge: "bg-white/15 text-white",
      soft: "bg-yellow-50 text-yellow-900 border-yellow-200",
      icon: UserRoundCheck
    };
  }

  return {
    gradient: "from-slate-950 via-orange-950 to-amber-800",
    badge: "bg-white/15 text-white",
    soft: "bg-slate-50 text-slate-800 border-slate-200",
    icon: Building2
  };
};

function StaffPortrait({ staff, className = "", priority = false }) {
  const [hasError, setHasError] = useState(false);
  const imageUrl = getImageUrl(staff?.image);

  if (!imageUrl || hasError) {
    return (
      <div className={`${className} flex items-center justify-center bg-gradient-to-br from-orange-950 via-amber-900 to-orange-700`}>
        <span className="text-3xl font-black text-white">{getInitials(staff?.name)}</span>
      </div>
    );
  }

  return (
    <img
      src={imageUrl}
      alt={staff?.name || "Leadership profile"}
      className={`${className} object-cover object-top`}
      loading={priority ? "eager" : "lazy"}
      onError={() => setHasError(true)}
    />
  );
}

function DetailList({ icon: Icon, title, items, emptyText }) {
  return (
    <div className="rounded-lg sm:rounded-2xl border border-orange-100 bg-white p-3 sm:p-5 shadow-sm">
      <div className="mb-2.5 sm:mb-4 flex items-center gap-2">
        <div className="flex h-8 sm:h-9 w-8 sm:w-9 items-center justify-center rounded-lg sm:rounded-xl bg-orange-50 text-orange-800">
          <Icon size={14} />
        </div>
        <h4 className="text-[9px] sm:text-xs font-black uppercase tracking-[0.15em] text-orange-900">{title}</h4>
      </div>

      {items.length > 0 ? (
        <div className="space-y-1.5 sm:space-y-2">
          {items.map((item, index) => (
            <div key={`${title}-${index}`} className="flex items-start gap-1.5 sm:gap-2 text-xs sm:text-sm leading-5 sm:leading-6 text-slate-700">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-orange-700" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-xs sm:text-sm leading-5 sm:leading-6 text-slate-500">{emptyText}</p>
      )}
    </div>
  );
}

export default function ModernStaffLeadership() {
  const [leaders, setLeaders] = useState([]);
  const [selectedLeader, setSelectedLeader] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("/api/staff");
        const data = await response.json();

        if (!data.success || !Array.isArray(data.staff)) {
          throw new Error(data.error || "Leadership data could not be loaded.");
        }

        const sortedLeaders = data.staff
          .filter(Boolean)
          .sort((a, b) => {
            const rankDiff = getLeaderRank(a) - getLeaderRank(b);
            if (rankDiff !== 0) return rankDiff;
            return (a.name || "").localeCompare(b.name || "");
          });

        setLeaders(sortedLeaders);
        setSelectedLeader(sortedLeaders.find(isPrincipalStaff) || sortedLeaders[0] || null);
      } catch (err) {
        console.error("Leadership fetch error:", err);
        setError(err.message || "Unable to load leadership data.");
      } finally {
        setLoading(false);
      }
    };

    fetchStaff();
  }, []);

  const selected = selectedLeader || leaders[0] || null;
  const selectedPalette = getRolePalette(selected);
  const SelectedIcon = selectedPalette.icon;

  const featuredStats = useMemo(() => {
    const principalCount = leaders.filter(isPrincipalStaff).length;
    const deputyCount = leaders.filter(isDeputyStaff).length;
    const departmentCount = new Set(leaders.map((leader) => leader.department).filter(Boolean)).size;

    return [
      { label: "Leadership Profiles", value: leaders.length || 0, icon: FiUsers },
      { label: "Principal Office", value: principalCount || 1, icon: Crown },
      { label: "Deputy Offices", value: deputyCount, icon: Medal },
      { label: "Departments", value: departmentCount, icon: Building2 }
    ];
  }, [leaders]);

  if (loading) {
    return (
      <section className="flex min-h-[70vh] items-center justify-center bg-gradient-to-br from-orange-950 via-amber-950 to-slate-950 px-4 text-white">
        <div className="text-center">
          <FiLoader className="mx-auto h-10 w-10 animate-spin text-amber-300" />
          <h3 className="mt-5 text-xl font-black">Loading Leadership</h3>
          <p className="mt-2 text-sm font-medium text-orange-100/75">Preparing the school leadership profiles...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="flex min-h-[70vh] items-center justify-center bg-gradient-to-br from-orange-950 via-amber-950 to-slate-950 px-4">
        <div className="max-w-md rounded-3xl border border-red-200 bg-white p-8 text-center shadow-2xl">
          <FiShield className="mx-auto text-4xl text-red-500" />
          <h3 className="mt-4 text-xl font-black text-slate-950">Unable To Load Leadership</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">{error}</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-orange-900 px-5 py-3 text-xs font-black uppercase tracking-widest text-white transition hover:bg-orange-800"
          >
            <FiRefreshCw /> Try Again
          </button>
        </div>
      </section>
    );
  }

  if (!selected) {
    return (
      <section className="flex min-h-[70vh] items-center justify-center bg-gradient-to-br from-orange-950 via-amber-950 to-slate-950 px-4">
        <div className="max-w-md rounded-3xl bg-white p-8 text-center shadow-2xl">
          <FiUsers className="mx-auto text-4xl text-orange-800" />
          <h3 className="mt-4 text-xl font-black text-slate-950">No Leadership Profiles Yet</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">Add leadership profiles from the staff module to publish them here.</p>
        </div>
      </section>
    );
  }

  const expertise = toArray(selected.expertise);
  const responsibilities = toArray(selected.responsibilities);
  const achievements = toArray(selected.achievements);
  const parsedJoinYear = selected.joinDate ? new Date(selected.joinDate).getFullYear() : null;
  const joinedYear = Number.isFinite(parsedJoinYear) ? parsedJoinYear : null;
  const roleTitle = getLeaderTitle(selected);
  const leaderScope = getLeaderScope(selected);
  const leaderDepartment = selected.department || selected.departmentGroup?.name || selected.subjectOffered || "School Leadership";
  const experienceSummary = expertise[0] || selected.qualification || leaderScope;
  const achievementSummary = achievements[0] || "Leadership, mentorship, and school improvement.";
  const quickFacts = [
    { label: "Role", value: roleTitle, icon: FiBriefcase },
    { label: "Office", value: leaderScope, icon: FiTarget },
    { label: "Department", value: leaderDepartment, icon: Building2 },
    { label: "Qualification", value: selected.qualification || "Professional educator", icon: GraduationCap },
    { label: "Joined", value: joinedYear || "On record", icon: FiCalendar },
    { label: "Profile Type", value: selected.staffType || selected.role || "Leadership", icon: FiUser }
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-orange-950 via-amber-950 to-slate-950 py-16 text-slate-950 sm:py-20">
      <div className="absolute inset-0 opacity-[0.08]" style={{ backgroundImage: "linear-gradient(90deg, rgba(255,255,255,.18) 1px, transparent 1px), linear-gradient(rgba(255,255,255,.18) 1px, transparent 1px)", backgroundSize: "36px 36px" }} />
      <div className="absolute -right-20 top-10 h-72 w-72 rounded-full bg-amber-500/20 blur-3xl" />
      <div className="absolute -bottom-28 left-0 h-80 w-80 rounded-full bg-orange-600/20 blur-3xl" />

      <div className="relative mx-auto w-full px-4 sm:px-6 lg:w-[85%] lg:px-0">
        <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.24em] text-amber-200 backdrop-blur">
              <Sparkles size={14} />
              School Leadership
            </div>
            <h2 className="mt-5 text-2xl font-black leading-tight tracking-tight text-white sm:text-3xl md:text-4xl lg:text-6xl">
              The team guiding Kinyui Boys forward.
            </h2>
            <p className="mt-5 max-w-2xl text-sm font-medium leading-7 text-orange-100/80 sm:text-base">
              Explore the principal, deputies, senior teachers, and department leaders through one focused leadership view with the full profile details available from the staff records.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:gap-3 sm:grid-cols-4 lg:w-[34rem]">
            {featuredStats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="rounded-lg sm:rounded-2xl border border-white/10 bg-white/10 p-2.5 sm:p-4 text-white backdrop-blur">
                  <Icon className="mb-2 sm:mb-3 text-amber-300" size={16} />
                  <p className="text-lg sm:text-2xl font-black">{stat.value}</p>
                  <p className="mt-0.5 sm:mt-1 text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-orange-100/65">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid gap-4 sm:gap-6 xl:grid-cols-[minmax(0,1fr)_24rem]">
          <article id="featured-leader-card" className="overflow-hidden rounded-xl sm:rounded-[2rem] border border-white/10 bg-white shadow-2xl shadow-black/30">
            <div className="grid sm:grid-cols-1 lg:grid-cols-[minmax(280px,380px)_minmax(0,1fr)]">
              <div className={`relative flex flex-col gap-3 sm:gap-5 bg-gradient-to-br ${selectedPalette.gradient} p-4 text-white sm:p-6`}>
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                  <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 sm:px-3 py-1 sm:py-1.5 text-[8px] sm:text-[10px] font-black uppercase tracking-[0.15em] ${selectedPalette.badge}`}>
                    <SelectedIcon size={12} />
                    {roleTitle}
                  </span>
                  <span className="hidden sm:inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-white">
                    <FiCheck />
                    Active Profile
                  </span>
                </div>

                <div>
                  <StaffPortrait
                    staff={selected}
                    priority
                    className="mx-auto aspect-[3/4] sm:aspect-[4/5] w-full max-w-xs sm:max-w-[21rem] rounded-lg sm:rounded-[1.35rem] border border-white/15 bg-white/10 shadow-2xl"
                  />
                </div>

                <div className="rounded-lg sm:rounded-[1.35rem] border border-white/15 bg-white/10 p-2.5 backdrop-blur sm:p-4">
                  <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.20em] text-amber-200">Featured Leader</p>
                  <h3 className="mt-1.5 text-lg sm:text-xl font-black leading-tight md:text-2xl">{selected.name}</h3>
                  <p className="mt-0.5 text-[11px] sm:text-sm font-semibold text-orange-100/80 sm:mt-1">{leaderScope}</p>
                  <div className="mt-2.5 sm:mt-4 grid grid-cols-2 gap-1.5 sm:gap-2">
                    <div className="rounded-lg sm:rounded-xl border border-white/10 bg-white/10 p-2 sm:p-3">
                      <p className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-amber-200">Department</p>
                      <p className="mt-0.5 sm:mt-1 truncate text-[10px] sm:text-xs font-bold text-white">{leaderDepartment}</p>
                    </div>
                    <div className="rounded-lg sm:rounded-xl border border-white/10 bg-white/10 p-2 sm:p-3">
                      <p className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-amber-200">Joined</p>
                      <p className="mt-0.5 sm:mt-1 text-[10px] sm:text-xs font-bold text-white">{joinedYear || "On record"}</p>
                    </div>
                  </div>
                  <div className="mt-2 hidden gap-2 md:grid">
                    <div className="rounded-xl border border-white/10 bg-white/10 p-3">
                      <p className="text-[9px] font-black uppercase tracking-widest text-amber-200">Experience</p>
                      <p className="mt-1 text-xs font-bold leading-5 text-white">{experienceSummary}</p>
                    </div>
                    <div className="rounded-xl border border-white/10 bg-white/10 p-3">
                      <p className="text-[9px] font-black uppercase tracking-widest text-amber-200">Achievement</p>
                      <p className="mt-1 text-xs font-bold leading-5 text-white">{achievementSummary}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 sm:p-6 lg:p-8">
                <div className="flex flex-col gap-3 sm:gap-5 border-b border-orange-100 pb-4 sm:pb-6 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.20em] text-orange-800">Leadership Profile</p>
                    <h3 className="mt-1.5 sm:mt-2 text-xl sm:text-2xl font-black tracking-tight text-slate-950">{selected.name}</h3>
                    <p className="mt-0.5 sm:mt-1 text-xs sm:text-sm font-bold text-orange-900">{roleTitle}</p>
                  </div>

                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {selected.email && (
                      <a href={`mailto:${selected.email}`} className="inline-flex items-center gap-1.5 rounded-lg sm:rounded-xl border border-orange-200 bg-orange-50 px-2.5 sm:px-3 py-1.5 sm:py-2 text-[11px] sm:text-xs font-bold text-orange-900">
                        <FiMail size={14} /> <span className="hidden sm:inline">Email</span>
                      </a>
                    )}
                    {selected.phone && (
                      <a href={`tel:${selected.phone}`} className="inline-flex items-center gap-1.5 rounded-lg sm:rounded-xl border border-orange-200 bg-orange-50 px-2.5 sm:px-3 py-1.5 sm:py-2 text-[11px] sm:text-xs font-bold text-orange-900">
                        <FiPhone size={14} /> <span className="hidden sm:inline">Call</span>
                      </a>
                    )}
                  </div>
                </div>

                <div className="mt-4 sm:mt-6 grid gap-2 sm:gap-3 grid-cols-2 sm:grid-cols-2 lg:grid-cols-3">
                  {quickFacts.map((fact) => {
                    const Icon = fact.icon;
                    return (
                      <div key={fact.label} className="rounded-lg sm:rounded-2xl border border-orange-100 bg-orange-50/50 p-2.5 sm:p-4">
                        <Icon className="mb-1.5 sm:mb-3 text-orange-800" size={16} />
                        <p className="text-[8px] sm:text-[9px] font-black uppercase tracking-[0.15em] text-slate-500">{fact.label}</p>
                        <p className="mt-0.5 sm:mt-1 text-xs sm:text-sm font-black leading-5 text-slate-950">{fact.value}</p>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-4 sm:mt-6 grid gap-3 sm:gap-4 lg:grid-cols-[1.1fr_.9fr]">
                  <div className="rounded-lg sm:rounded-2xl border border-slate-200 bg-slate-50 p-3 sm:p-5">
                    <div className="mb-2 sm:mb-3 flex items-center gap-2">
                      <FiUser className="text-orange-800" size={16} />
                      <h4 className="text-[10px] sm:text-xs font-black uppercase tracking-[0.15em] text-slate-700">Professional Bio</h4>
                    </div>
                    <p className="text-xs sm:text-sm leading-6 sm:leading-7 text-slate-700">
                      {selected.bio ||
                        `${selected.name} serves in the ${roleTitle.toLowerCase()} office, supporting discipline, academic excellence, mentorship, and the growth of every Kinyui boy.`}
                    </p>
                  </div>

                  <div className="rounded-lg sm:rounded-2xl border border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50 p-3 sm:p-5">
                    <div className="mb-2 sm:mb-3 flex items-center gap-2">
                      <FiMessageSquare className="text-orange-800" size={16} />
                      <h4 className="text-[10px] sm:text-xs font-black uppercase tracking-[0.15em] text-orange-900">Leadership Note</h4>
                    </div>
                    <p className="text-xs sm:text-sm font-semibold italic leading-6 sm:leading-7 text-slate-700">
                      {selected.quote || "Leadership at Kinyui Boys is anchored in discipline, service, accountability, and academic purpose."}
                    </p>
                  </div>
                </div>

                <div className="mt-4 sm:mt-6 grid gap-3 sm:gap-4 lg:grid-cols-3">
                  <DetailList
                    icon={FiBriefcase}
                    title="Responsibilities"
                    items={responsibilities.slice(0, 6)}
                    emptyText="School leadership, learner mentorship, discipline, and institutional improvement."
                  />
                  <DetailList
                    icon={BookOpen}
                    title="Expertise"
                    items={expertise.slice(0, 6)}
                    emptyText="Education leadership, teaching, student support, and school operations."
                  />
                  <DetailList
                    icon={Trophy}
                    title="Achievements"
                    items={achievements.slice(0, 5)}
                    emptyText="Contributing to the growth and excellence of Kinyui Boys Senior School."
                  />
                </div>
              </div>
            </div>
          </article>

          <aside className="space-y-3 sm:space-y-4 xl:sticky xl:top-24 xl:self-start">
            <div className="rounded-lg sm:rounded-[2rem] border border-white/10 bg-white/10 p-4 sm:p-5 text-white backdrop-blur">
              <div className="mb-3 sm:mb-4 flex items-center justify-between gap-3">
                <div>
                  <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.20em] text-amber-200">Leadership Map</p>
                  <h3 className="mt-0.5 sm:mt-1 text-lg sm:text-xl font-black">Select a profile</h3>
                </div>
                <FiUsers className="text-amber-300" size={20} />
              </div>

              <div className="space-y-2 sm:space-y-3 max-h-96 sm:max-h-none overflow-y-auto sm:overflow-y-visible">
                {leaders.map((leader) => {
                  const palette = getRolePalette(leader);
                  const Icon = palette.icon;
                  const isActive = selected.id === leader.id;

                  return (
                    <button
                      type="button"
                      key={leader.id}
                      onClick={() => {
                        setSelectedLeader(leader);
                        setTimeout(() => {
                          document.getElementById("featured-leader-card")?.scrollIntoView({ behavior: "smooth", block: "start" });
                        }, 50);
                      }}
                      className={`w-full rounded-lg sm:rounded-2xl border p-2 sm:p-3 text-left transition ${
                        isActive
                          ? "border-amber-300 bg-white text-slate-950 shadow-xl"
                          : "border-white/10 bg-white/5 text-white hover:border-amber-300/60 hover:bg-white/10"
                      }`}
                    >
                      <div className="flex items-center gap-2 sm:gap-3">
                        <StaffPortrait staff={leader} className="h-10 sm:h-14 w-10 sm:w-14 shrink-0 rounded-lg sm:rounded-xl" />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5 sm:gap-2">
                            <Icon className={isActive ? "text-orange-800" : "text-amber-300"} size={12} />
                            <p className={`truncate text-[8px] sm:text-[10px] font-black uppercase tracking-[0.12em] ${isActive ? "text-orange-900" : "text-orange-100/75"}`}>
                              {getLeaderTitle(leader)}
                            </p>
                          </div>
                          <h4 className="mt-0.5 sm:mt-1 truncate text-xs sm:text-sm font-black">{leader.name}</h4>
                          <p className={`mt-0.25 sm:mt-0.5 truncate text-[10px] sm:text-xs ${isActive ? "text-slate-500" : "text-white/55"}`}>
                            {getLeaderScope(leader)}
                          </p>
                        </div>
                        <FiChevronRight className={`${isActive ? "text-orange-800" : "text-white/40"} shrink-0`} size={16} />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="rounded-lg sm:rounded-[2rem] border border-white/10 bg-white p-4 sm:p-5 shadow-2xl shadow-black/20">
              <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.20em] text-orange-800">Profile Coverage</p>
              <h3 className="mt-1.5 sm:mt-2 text-lg sm:text-xl font-black text-slate-950">What this section displays</h3>
              <div className="mt-3 sm:mt-4 space-y-2 sm:space-y-3">
                {[
                  { icon: FiUser, text: "Name, role, office, department, and qualification" },
                  { icon: FiMessageSquare, text: "Bio and leadership quote where available" },
                  { icon: FiTarget, text: "Responsibilities and leadership scope" },
                  { icon: FiStar, text: "Expertise and achievements from staff records" },
                  { icon: FiMapPin, text: "Joined year and public contact fields when published" }
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.text} className="flex items-start gap-2 sm:gap-3 rounded-lg sm:rounded-xl bg-orange-50 p-2.5 sm:p-3 text-xs sm:text-sm leading-5 text-slate-700">
                      <Icon className="mt-0.5 shrink-0 text-orange-800" size={16} />
                      <span>{item.text}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
