"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  FiArrowLeft,
  FiAward,
  FiBookOpen,
  FiChevronRight,
  FiImage,
  FiMapPin,
  FiGrid, 
  FiRefreshCw,
  FiShield,
  FiUsers,
} from "react-icons/fi";

const CATEGORY_META = {
  CBC: { label: "CBC Department", icon: FiBookOpen, color: "bg-blue-50 text-blue-700" },
  EIGHT_FOUR_FOUR: { label: "8-4-4 Department", icon: FiAward, color: "bg-amber-50 text-amber-700" },
  TEACHING: { label: "Teaching Department", icon: FiUsers, color: "bg-emerald-50 text-emerald-700" },
  SUPPORT: { label: "Support Department", icon: FiShield, color: "bg-slate-100 text-slate-700" },
};

const getImages = (department) => {
  const related = Array.isArray(department?.images)
    ? department.images.map((image) => image.url).filter(Boolean)
    : [];
  if (department?.image && !related.includes(department.image)) related.unshift(department.image);
  return related.length ? related : ["/teachers.png"];
};

const normalizeList = (value) => {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (typeof value === "string") return value.split(",").map((item) => item.trim()).filter(Boolean);
  return [];
};

function TeacherCard({ teacher }) {
  const image = teacher?.image || (teacher?.gender === "female" ? "/female.png" : "/male.png");
  return (
    <article className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
      <div className="h-56 bg-slate-100">
        <img src={image} alt={teacher.name} className="h-full w-full object-cover object-top" />
      </div>
      <div className="p-5">
        <div className="mb-3 inline-flex rounded-full bg-amber-50 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-amber-700">
          {teacher.subjectOffered || "Teacher"}
        </div>
        <h3 className="text-lg font-black text-slate-900">{teacher.name}</h3>
        <p className="mt-1 text-sm font-bold text-slate-500">{teacher.position || teacher.role}</p>
        <p className="mt-4 line-clamp-4 text-sm leading-relaxed text-slate-600">
          {teacher.bio || `${teacher.name} supports learning and mentorship in this department.`}
        </p>
      </div>
    </article>
  );
}

export default function DepartmentDetailClient({ id }) {
  const [department, setDepartment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const loadDepartment = async (isRefresh = false) => {
    try {
      setError("");
      if (isRefresh) setRefreshing(true);
      else setLoading(true);

      const response = await fetch(`/api/staff/departments/${id}?includeTeachers=1`, { cache: "no-store" });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.error || "Failed to load department");
      setDepartment(data.department);
    } catch (err) {
      setError(err.message || "Failed to load department");
      setDepartment(null);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadDepartment(false);
  }, [id]);

  const images = useMemo(() => getImages(department), [department]);
  const meta = CATEGORY_META[department?.category] || CATEGORY_META.TEACHING;
  const Icon = meta.icon;
  const extra = typeof department?.extra === "object" && department?.extra ? department.extra : {};
  const focusAreas = normalizeList(extra.focusAreas);
  const subjects = normalizeList(extra.subjects);
  const teachers = Array.isArray(department?.teachers) ? department.teachers : [];

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-12">
        <div className="mx-auto max-w-7xl">
          <div className="h-[520px] animate-pulse rounded-[2rem] bg-white" />
        </div>
      </div>
    );
  }

  if (error || !department) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-12">
        <div className="mx-auto max-w-3xl rounded-2xl border border-red-100 bg-white p-8 text-center shadow-sm">
          <FiShield className="mx-auto text-4xl text-red-400" />
          <h1 className="mt-4 text-2xl font-black text-slate-900">Department unavailable</h1>
          <p className="mt-2 text-sm font-semibold text-slate-500">{error || "This department could not be found."}</p>
          <Link href="/pages/staff" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-xs font-black uppercase tracking-widest text-white">
            <FiArrowLeft /> Back to Staff
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <section className="bg-slate-950 px-4 py-10 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <Link href="/pages/staff" className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-widest text-white">
              <FiArrowLeft /> Staff
            </Link>
            <button
              type="button"
              onClick={() => loadDepartment(true)}
              disabled={refreshing}
              className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-xs font-black uppercase tracking-widest text-slate-950 disabled:opacity-60"
            >
              <FiRefreshCw className={refreshing ? "animate-spin" : ""} /> Refresh
            </button>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
            <div>
              <div className={`mb-5 inline-flex items-center gap-2 rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest ${meta.color}`}>
                <Icon /> {meta.label}
              </div>
              <h1 className="max-w-4xl text-4xl font-black tracking-tight sm:text-6xl">{department.name}</h1>
              <p className="mt-5 max-w-3xl text-sm leading-7 text-slate-300 sm:text-base">
                {department.description || "Department information will be updated soon."}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[
                ["HOD", department.headName || "Available soon"],
                ["Assistant HOD", department.assistantHeadName || "Available soon"],
                ["Teachers", teachers.length],
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/40">{label}</p>
                  <p className="mt-2 text-sm font-black text-white">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <section className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="grid gap-3 sm:grid-cols-2">
            {images.slice(0, 4).map((image, index) => (
              <img
                key={`${image}-${index}`}
                src={image}
                alt={`${department.name} ${index + 1}`}
                className="h-64 w-full rounded-2xl object-cover"
              />
            ))}
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-black text-slate-900">Department Focus</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              {extra.notes || "This page brings together the department overview, learning focus, and teachers mapped to this department."}
            </p>

            {(focusAreas.length > 0 || subjects.length > 0 || extra.location) && (
              <div className="mt-6 space-y-5">
                {focusAreas.length > 0 && (
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Focus Areas</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {focusAreas.map((area) => (
                        <span key={area} className="rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700">{area}</span>
                      ))}
                    </div>
                  </div>
                )}
                {subjects.length > 0 && (
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Subjects / Services</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {subjects.map((subject) => (
                        <span key={subject} className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">{subject}</span>
                      ))}
                    </div>
                  </div>
                )}
                {extra.location && (
                  <p className="flex items-center gap-2 rounded-xl bg-slate-50 px-4 py-3 text-sm font-bold text-slate-700">
                    <FiMapPin /> {extra.location}
                  </p>
                )}
              </div>
            )}
          </div>
        </section>

        <section className="mt-12">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.24em] text-amber-700">Teacher Team</p>
              <h2 className="mt-1 text-3xl font-black text-slate-900">Teachers Under {department.name}</h2>
            </div>
            <FiChevronRight className="hidden text-3xl text-slate-300 sm:block" />
          </div>

          {teachers.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {teachers.map((teacher) => (
                <TeacherCard key={teacher.id} teacher={teacher} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center">
              <FiImage className="mx-auto text-4xl text-slate-300" />
              <h3 className="mt-3 text-lg font-black text-slate-900">No teachers mapped yet</h3>
              <p className="mt-2 text-sm text-slate-500">Teacher records linked to this department will appear here.</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
