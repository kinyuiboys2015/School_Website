"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  ArrowUp,
  Award,
  BookOpen,
  CheckCircle,
  Clock,
  ExternalLink,
  Eye,
  Heart,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Target,
  Users
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const FOUNDING_YEAR = 1965;
const LEGACY_YEARS = new Date().getFullYear() - FOUNDING_YEAR;
const DEFAULT_SLOGAN = "Compose Yourself To Be Great";
const DEFAULT_VIDEO_TOUR = "https://www.youtube.com/watch?v=88g4r7sZjpQ&list=RD88g4r7sZjpQ&start_radio=1";

const DEFAULT_SCHOOL = {
  name: "Kinyui Boys Senior School",
  description:
    "A public boys boarding school in Matungulu, Machakos County, shaping disciplined, God fearing, and academically focused young men through strong values, mentorship, and service.",
  motto: "Soaring To Excellence",
  vision: "To be a leading center of excellence in academic performance and holistic development of the boy child.",
  mission: "To provide a conducive environment for quality teaching and learning through teamwork and effective use of resources.",
  studentCount: 400,
  staffCount: 20,
  videoTour: DEFAULT_VIDEO_TOUR,
  videoType: "youtube",
  admissionContactEmail: "kinyuiboys2015@gmail.com",
  admissionContactPhone: "0790 789847",
  admissionLocation: "Matungulu, Machakos County"
};

const coreValues = [
  {
    title: "God Fearing",
    icon: Heart,
    desc: "We guide boys to honour God, serve others, and make choices shaped by conscience."
  },
  {
    title: "Integrity",
    icon: ShieldCheck,
    desc: "Students are expected to do what is right in class, in dormitory life, and beyond school."
  },
  {
    title: "Honesty",
    icon: Eye,
    desc: "Truthfulness builds trust between learners, teachers, parents, and the wider community."
  },
  {
    title: "Hard Work",
    icon: BookOpen,
    desc: "Every boy is trained to work consistently, revise seriously, and take pride in effort."
  },
  {
    title: "Commitment",
    icon: Target,
    desc: "We teach learners to finish what they start and remain focused on personal growth."
  },
  {
    title: "Respect",
    icon: Users,
    desc: "A Kinyui boy respects teachers, fellow students, support staff, parents, and himself."
  },
  {
    title: "Accountability",
    icon: CheckCircle,
    desc: "Each student learns to own his choices, protect school property, and keep his word."
  }
];

const focusAreas = [
  {
    title: "Academic Focus",
    icon: BookOpen,
    desc: "Structured study, teacher mentorship, and a disciplined timetable keep learners moving toward strong results."
  },
  {
    title: "Character Formation",
    icon: ShieldCheck,
    desc: "The school culture turns rules into habits: order, responsibility, humility, and brotherly respect."
  },
  {
    title: "Boys' Mentorship",
    icon: Users,
    desc: "Guidance, counselling, sports, clubs, and leadership roles help boys grow into dependable young men."
  }
];

const schoolInfo = [
  { icon: BookOpen, label: "Category", value: "Public Boys Boarding" },
  { icon: Award, label: "Curriculum", value: "8-4-4 and CBC" },
  { icon: Clock, label: "School Day", value: "7:45 AM - 4:30 PM" },
  { icon: ShieldCheck, label: "Founded", value: FOUNDING_YEAR }
];

const getYouTubeId = (url = "") => {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([^&\n?#]+)/);
  return match?.[1] || null;
};

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => setIsVisible(window.pageYOffset > 300);
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  if (!isVisible) return null;

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-6 left-6 z-50 rounded-full bg-amber-600 p-3 text-white shadow-lg shadow-amber-900/20 transition hover:bg-slate-900"
      aria-label="Scroll to top"
    >
      <ArrowUp size={20} />
    </button>
  );
};

export default function AboutPage() {
  const topRef = useRef(null);
  const [schoolData, setSchoolData] = useState(null);
  const [schoolStats, setSchoolStats] = useState(null);

  useEffect(() => {
    const fetchSchoolProfile = async () => {
      try {
        const [schoolResponse, statsResponse] = await Promise.all([
          fetch("/api/school"),
          fetch("/api/school-stats")
        ]);

        if (schoolResponse.ok) {
          const data = await schoolResponse.json();
          if (data.success && data.school) setSchoolData(data.school);
        }

        if (statsResponse.ok) {
          const data = await statsResponse.json();
          if (data.success && data.stats) setSchoolStats(data.stats);
        }
      } catch (error) {
        console.error("About page school profile load failed:", error);
      }
    };

    fetchSchoolProfile();
  }, []);

  const school = { ...DEFAULT_SCHOOL, ...(schoolData || {}) };
  const slogan = schoolStats?.slogan || DEFAULT_SLOGAN;
  const sloganDescription =
    schoolStats?.sloganDescription ||
    "A daily reminder for every Kinyui boy to carry discipline, self-control, and ambition into every class, dormitory, field, and responsibility.";
  const videoTour = school.videoTour || DEFAULT_VIDEO_TOUR;
  const videoId = school.videoType === "youtube" ? getYouTubeId(videoTour) : null;
  const dynamicStats = [
    { value: `${school.studentCount || 400}+`, label: "Students", icon: Users },
    { value: `${school.staffCount || 20}+`, label: "Teachers & Staff", icon: Users },
    { value: `${LEGACY_YEARS}+`, label: "Years of Service", icon: Clock },
    { value: "7", label: "Core Values", icon: ShieldCheck }
  ];
  const dynamicSchoolInfo = [
    ...schoolInfo,
    { icon: Users, label: "Student Population", value: school.studentCount || 400 },
    { icon: Users, label: "Teachers", value: school.staffCount || 20 }
  ];

  return (
    <main ref={topRef} className="min-h-screen bg-slate-50 text-slate-900">
      <section className="relative min-h-[90vh] overflow-hidden bg-[#8a2f08]">
        <Image
          src="/home/student-leaders-library.jpg"
          alt="Kinyui Boys Senior School compound"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-[linear-gradient(105deg,rgba(15,23,42,0.96)_0%,rgba(124,45,18,0.88)_48%,rgba(15,23,42,0.96)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-slate-50 via-slate-50/75 to-transparent" />

        <div className="relative z-10 mx-auto flex min-h-[90vh] w-full max-w-7xl flex-col justify-end px-4 pb-8 pt-28 sm:px-6 lg:w-[85%] lg:px-0 lg:pb-12">
          <div className="max-w-4xl">
            <div className="mb-5 inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/10 px-3 py-2 pr-4 text-[10px] font-black uppercase tracking-[0.22em] text-amber-100 backdrop-blur">
              <Image src="/seo/SchoolLogo.png" alt="" width={32} height={32} className="rounded-full bg-white/15 p-1" />
              Founded in {FOUNDING_YEAR} - Matungulu, Machakos County
            </div>

            <h1 className="max-w-3xl text-4xl font-black leading-[0.98] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
              {school.name}
            </h1>

            <p className="mt-6 max-w-2xl text-sm font-semibold leading-7 text-orange-50/90 sm:text-base md:text-lg">
              {school.description}
            </p>

            <div className="mt-5 inline-flex w-fit items-center gap-2 border-l-4 border-amber-400 bg-white/10 px-4 py-3 text-sm font-black uppercase tracking-[0.18em] text-white backdrop-blur">
              {school.motto}
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/pages/Apply%20Now">
                <button className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-xs font-black uppercase tracking-widest text-orange-900 shadow-lg shadow-slate-950/20 transition hover:bg-amber-50 active:scale-95 sm:px-7">
                  Apply Now <ArrowRight size={16} />
                </button>
              </Link>
              <Link href="/pages/OurSchoolPolicies">
                <button className="inline-flex items-center gap-2 rounded-xl border border-white/25 bg-white/10 px-6 py-3 text-xs font-black uppercase tracking-widest text-white backdrop-blur transition hover:bg-white/20 active:scale-95 sm:px-7">
                  School Rules
                </button>
              </Link>
            </div>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4">
            {dynamicStats.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="rounded-2xl border border-white/15 bg-slate-950/35 p-4 text-white shadow-xl shadow-slate-950/10 backdrop-blur-md">
                  <Icon className="mb-4 text-amber-300" size={22} />
                  <p className="text-2xl font-black sm:text-3xl">{item.value}</p>
                  <p className="mt-1 text-[10px] font-black uppercase tracking-widest text-white/50">{item.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-5">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-700">Our Legacy</p>
            <h2 className="mt-4 text-3xl font-black leading-tight tracking-tight text-slate-950 sm:text-5xl">
              Forming boys into men of purpose since {FOUNDING_YEAR}.
            </h2>
          </div>

          <div className="lg:col-span-7">
            <p className="text-sm font-medium leading-7 text-slate-700 sm:text-base">
              {school.name} has served families in Machakos County for more than {LEGACY_YEARS} years. The school combines academic discipline, boarding structure, spiritual grounding, and practical mentorship so every learner can grow in confidence, responsibility, and service.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {focusAreas.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="rounded-lg border border-slate-200 bg-slate-50 p-5">
                    <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-white text-amber-700 shadow-sm">
                      <Icon size={20} />
                    </div>
                    <h3 className="text-sm font-black text-slate-950">{item.title}</h3>
                    <p className="mt-2 text-xs leading-6 text-slate-600">{item.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-700">Mission, Vision and Motto</p>
              <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-950 sm:text-5xl">
                A clear standard for every Kinyui boy.
              </h2>
            </div>

            <div className="grid gap-4 lg:col-span-8 md:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                <Eye className="mb-5 text-amber-600" size={26} />
                <p className="text-xs font-black uppercase tracking-widest text-slate-500">Vision</p>
                <p className="mt-3 text-sm font-semibold leading-7 text-slate-800">
                  {school.vision}
                </p>
              </div>

              <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                <Target className="mb-5 text-amber-600" size={26} />
                <p className="text-xs font-black uppercase tracking-widest text-slate-500">Mission</p>
                <p className="mt-3 text-sm font-semibold leading-7 text-slate-800">
                  {school.mission}
                </p>
              </div>

              <div className="rounded-lg border border-slate-200 bg-slate-950 p-6 shadow-sm">
                <Award className="mb-5 text-amber-400" size={26} />
                <p className="text-xs font-black uppercase tracking-widest text-amber-300">Motto</p>
                <p className="mt-3 text-2xl font-black leading-tight text-white">
                  {school.motto}
                </p>
                <p className="mt-4 text-xs font-semibold uppercase tracking-widest text-slate-400">
                  Reaching greater heights together
                </p>
              </div>

              <div className="rounded-lg border border-orange-200 bg-orange-50 p-6 shadow-sm">
                <CheckCircle className="mb-5 text-orange-700" size={26} />
                <p className="text-xs font-black uppercase tracking-widest text-orange-700">Our Slogan</p>
                <p className="mt-3 text-2xl font-black leading-tight text-slate-950">
                  {slogan}
                </p>
                <p className="mt-4 text-xs font-semibold leading-6 text-slate-600">
                  {sloganDescription}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-5">
            <div className="relative overflow-hidden rounded-lg border border-slate-200 bg-slate-100 shadow-2xl shadow-slate-200">
              <div className="relative aspect-[4/5]">
                <Image
                  src="/home/prefects-campus.jpg"
                  alt="Kinyui Boys Senior School students and compound"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <p className="text-xs font-black uppercase tracking-[0.24em] text-amber-200">The Kinyui Way</p>
                  <p className="mt-2 text-2xl font-black text-white">Values lived daily</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-700">Core Values</p>
            <h2 className="mt-4 text-3xl font-black leading-tight tracking-tight text-slate-950 sm:text-5xl">
              The values that shape our boys.
            </h2>
            <p className="mt-5 max-w-2xl text-sm font-medium leading-7 text-slate-700 sm:text-base">
              These are the standards we expect in classrooms, dormitories, sports fields, worship, leadership, and community life.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {coreValues.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="group rounded-lg border border-slate-200 bg-slate-50 p-5 transition hover:-translate-y-1 hover:border-amber-300 hover:bg-white hover:shadow-lg hover:shadow-slate-200/70">
                    <div className="flex items-start gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-amber-700 shadow-sm transition group-hover:bg-amber-600 group-hover:text-white">
                        <Icon size={20} />
                      </div>
                      <div>
                        <h3 className="text-sm font-black uppercase tracking-wide text-slate-950">{item.title}</h3>
                        <p className="mt-2 text-xs leading-6 text-slate-600">{item.desc}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm sm:p-8 md:p-10">
              <div className="mb-8 flex items-center gap-3">
                <span className="h-10 w-2 rounded-full bg-amber-500" />
                <h2 className="text-2xl font-black text-slate-950 sm:text-4xl">School Information</h2>
              </div>

              <p className="max-w-3xl text-sm font-medium leading-7 text-slate-700 sm:text-base">
                {school.name} is a boys boarding institution in {school.admissionLocation || "Matungulu, Machakos County"}. Our environment is built for academic seriousness, self-control, brotherhood, and responsible citizenship.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {dynamicSchoolInfo.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label} className="flex items-center gap-4 rounded-lg border border-slate-200 bg-slate-50 p-4">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-amber-700 shadow-sm">
                        <Icon size={19} />
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">{item.label}</p>
                        <p className="text-sm font-black text-slate-950">{item.value}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-3">
              <a href={`tel:${school.admissionContactPhone || "0790 789847"}`} className="rounded-lg border border-slate-200 bg-white p-5 transition hover:border-amber-300">
                <Phone className="mb-3 text-amber-600" size={20} />
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Call Us</p>
                <p className="mt-1 text-sm font-bold text-slate-950">{school.admissionContactPhone || "0790 789847"}</p>
              </a>
              <a href={`mailto:${school.admissionContactEmail || "kinyuiboys2015@gmail.com"}`} className="rounded-lg border border-slate-200 bg-white p-5 transition hover:border-amber-300">
                <Mail className="mb-3 text-amber-600" size={20} />
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Email</p>
                <p className="mt-1 truncate text-sm font-bold text-slate-950">{school.admissionContactEmail || "kinyuiboys2015@gmail.com"}</p>
              </a>
              <div className="rounded-lg border border-slate-200 bg-white p-5">
                <MapPin className="mb-3 text-amber-600" size={20} />
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Location</p>
                <p className="mt-1 text-sm font-bold text-slate-950">{school.admissionLocation || "Matungulu, Machakos"}</p>
              </div>
            </div>

            {videoTour && (
              <div className="mt-4 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-100 p-5">
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-700">Video Tour</p>
                  <h3 className="mt-2 text-xl font-black text-slate-950">Take a quick look at the school.</h3>
                </div>
                <div className="relative aspect-video bg-slate-950">
                  {videoId ? (
                    <iframe
                      src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
                      title={`${school.name} video tour`}
                      className="absolute inset-0 h-full w-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <video
                      src={videoTour}
                      className="absolute inset-0 h-full w-full object-cover"
                      controls
                      poster={school.videoThumbnail || ""}
                    />
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-5">
            <div className="h-full min-h-[460px] overflow-hidden rounded-lg border border-slate-200 bg-white p-3 shadow-xl shadow-slate-200">
              <div className="relative h-[360px] overflow-hidden rounded-lg border border-slate-200 sm:h-[430px]">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.123456!2d37.2618!3d-1.2921!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMcKwMTcnMzEuNiJTIDM3wrAxNSc0Mi41IkU!5e0!3m2!1sen!2ske!4v1234567890"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Kinyui Boys Senior School Location"
                />
              </div>

              <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs font-semibold leading-5 text-slate-600">
                  S.A Kinyui Boys Senior School, Matungulu, Machakos County
                </p>
                <a
                  href="https://maps.app.goo.gl/Xg4WbwRWuEvhYR8b9"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-xs font-black uppercase tracking-widest text-white transition hover:bg-amber-600"
                >
                  Directions <ExternalLink size={14} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-950 px-4 py-16 text-white sm:px-6 sm:py-20">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-300">The Kinyui Standard</p>
            <h2 className="mt-4 max-w-3xl text-3xl font-black leading-tight sm:text-5xl">
              Discipline, respect, and accountability make the rules work.
            </h2>
            <p className="mt-5 max-w-2xl text-sm font-medium leading-7 text-slate-300">
              Our policies are written to support a boys school environment where learners are protected, guided, challenged, and prepared for life beyond the gate.
            </p>
          </div>

          <Link href="/pages/OurSchoolPolicies">
            <button className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500 px-7 py-4 text-xs font-black uppercase tracking-widest text-white transition hover:bg-amber-600 sm:w-auto">
              View School Rules <ArrowRight size={16} />
            </button>
          </Link>
        </div>
      </section>

      <ScrollToTop />
    </main>
  );
}
