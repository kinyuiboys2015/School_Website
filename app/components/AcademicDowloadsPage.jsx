"use client";

import { useEffect, useMemo, useState } from "react";
import {
  FiAlertCircle,
  FiBookOpen,
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiDownload,
  FiFileText,
  FiFolder,
  FiLayers,
  FiRefreshCw,
  FiSearch,
  FiTarget,
  FiUser,
} from "react-icons/fi";
import SearchableSubjectDropdown from "./SearchableSubjectDropdown/page";
import {
  ALL_SUBJECTS_LABEL,
  SUBJECT_OPTIONS,
} from "../constants/subjects";
import {
  formatDisplayDate,
  humanizeValue,
  normalizeDownloadFile,
} from "../../libs/displayNames";

const ALL_CLASSES = "All Classes";

const getItemFiles = (item, contentType) => {
  const rawFiles =
    contentType === "assignments"
      ? [...(item.assignmentFiles || []), ...(item.attachments || [])]
      : item.files || [];

  return rawFiles
    .map((file, index) =>
      normalizeDownloadFile(file, `${item.title || "Academic"} file ${index + 1}`)
    )
    .filter(Boolean);
};

const isDueWithinAWeek = (assignment) => {
  if (!assignment.dueDate || assignment.status === "completed") return false;

  const dueDate = new Date(assignment.dueDate);
  const now = new Date();
  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 7);

  return !Number.isNaN(dueDate.getTime()) && dueDate >= now && dueDate <= nextWeek;
};

export default function AcademicDowloadsPage({ contentType = "assignments" }) {
  const isAssignments = contentType === "assignments";
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [subject, setSubject] = useState(ALL_SUBJECTS_LABEL);
  const [className, setClassName] = useState(ALL_CLASSES);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    const loadItems = async () => {
      setLoading(true);
      setError("");

      try {
        const endpoint = isAssignments
          ? "/api/assignment?limit=250"
          : "/api/resources?accessLevel=student&isActive=true&limit=250";
        const response = await fetch(endpoint, {
          signal: controller.signal,
          cache: "no-store",
        });
        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.error ||
              `Unable to load ${isAssignments ? "assignments" : "resources"}`
          );
        }

        setItems(
          isAssignments
            ? Array.isArray(data.assignments)
              ? data.assignments
              : []
            : Array.isArray(data.resources)
              ? data.resources
              : []
        );
      } catch (loadError) {
        if (loadError.name !== "AbortError") {
          setError(loadError.message || "Unable to load academic downloads.");
          setItems([]);
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    loadItems();
    return () => controller.abort();
  }, [isAssignments, refreshKey]);

  const subjectOptions = useMemo(() => {
    const values = items.map((item) => item.subject).filter(Boolean);
    return Array.from(new Set([...SUBJECT_OPTIONS, ...values]));
  }, [items]);

  const classOptions = useMemo(
    () => [
      ALL_CLASSES,
      ...Array.from(
        new Set(items.map((item) => item.className).filter(Boolean))
      ).sort(),
    ],
    [items]
  );

  const visibleItems = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return items.filter((item) => {
      const searchableText = [
        item.title,
        item.description,
        item.subject,
        item.teacher,
        item.className,
        item.category,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return (
        (!query || searchableText.includes(query)) &&
        (subject === ALL_SUBJECTS_LABEL || item.subject === subject) &&
        (className === ALL_CLASSES || item.className === className)
      );
    });
  }, [className, items, searchTerm, subject]);

  const dueSoonCount = useMemo(
    () => items.filter(isDueWithinAWeek).length,
    [items]
  );
  const totalFiles = useMemo(
    () =>
      items.reduce(
        (total, item) => total + getItemFiles(item, contentType).length,
        0
      ),
    [contentType, items]
  );

  const pageTitle = isAssignments ? "Student Assignments" : "Exam Resources";

  return (
    <main
      className={`min-h-screen text-slate-950 ${
        isAssignments ? "bg-amber-50/40" : "bg-cyan-50/40"
      }`}
    >
      {isAssignments ? (
        <section className="relative overflow-hidden bg-[#2b1208] px-4 pb-24 pt-24 text-white sm:px-6 lg:px-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.35),transparent_34%),linear-gradient(135deg,transparent,rgba(124,45,18,0.35))]" />
          <div className="relative mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1fr_320px] lg:items-end">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-amber-300/30 bg-amber-400/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-amber-200">
                <FiTarget className="h-4 w-4" />
                {pageTitle}
              </span>
              <h1 className="mt-6 max-w-3xl text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
                Plan the work. Meet the deadline.
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-amber-50/75 sm:text-lg">
                Review current Kinyui Boys assignments, teacher instructions,
                due dates, and every file needed to complete your coursework.
              </p>
            </div>

            <div className="rounded-3xl border border-amber-200/20 bg-white/10 p-6 backdrop-blur">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-amber-200">
                Weekly focus
              </p>
              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-white/10 p-4">
                  <p className="text-3xl font-black">{items.length}</p>
                  <p className="mt-1 text-xs font-semibold text-amber-50/65">
                    Total tasks
                  </p>
                </div>
                <div className="rounded-2xl bg-amber-400 p-4 text-[#2b1208]">
                  <p className="text-3xl font-black">{dueSoonCount}</p>
                  <p className="mt-1 text-xs font-bold">Due in 7 days</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <section className="relative overflow-hidden bg-gradient-to-br from-teal-950 via-slate-950 to-cyan-950 px-4 pb-24 pt-24 text-white sm:px-6 lg:px-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.2),transparent_36%),radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.2),transparent_34%)]" />
          <div className="relative mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1fr_360px] lg:items-center">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-cyan-300/30 bg-cyan-400/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-cyan-200">
                <FiFolder className="h-4 w-4" />
                {pageTitle}
              </span>
              <h1 className="mt-6 max-w-3xl text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
                Your revision library, always ready.
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-cyan-50/70 sm:text-lg">
                Browse active Kinyui Boys notes, revision documents, past
                papers, and examination resources by subject and class.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-[28px] border border-cyan-200/20 bg-cyan-400/10 p-6 backdrop-blur">
                <FiLayers className="h-6 w-6 text-cyan-300" />
                <p className="mt-7 text-4xl font-black">{items.length}</p>
                <p className="mt-1 text-xs font-bold uppercase tracking-wider text-cyan-100/60">
                  Resources
                </p>
              </div>
              <div className="mt-8 rounded-[28px] bg-emerald-400 p-6 text-emerald-950">
                <FiFileText className="h-6 w-6" />
                <p className="mt-7 text-4xl font-black">{totalFiles}</p>
                <p className="mt-1 text-xs font-black uppercase tracking-wider">
                  Files ready
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="relative z-10 mx-auto -mt-10 max-w-6xl px-4 pb-20 sm:px-6 lg:px-8">
        <div
          className={`grid gap-4 rounded-3xl border bg-white p-5 shadow-xl md:grid-cols-3 ${
            isAssignments
              ? "border-amber-200 shadow-amber-100/60"
              : "border-cyan-200 shadow-cyan-100/60"
          }`}
        >
          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
              Search
            </label>
            <div
              className={`flex min-h-12 items-center gap-3 rounded-xl border border-slate-200 px-4 focus-within:ring-4 ${
                isAssignments
                  ? "focus-within:border-amber-500 focus-within:ring-amber-100"
                  : "focus-within:border-teal-500 focus-within:ring-teal-100"
              }`}
            >
              <FiSearch className="h-4 w-4 text-slate-500" />
              <input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder={`Search ${
                  isAssignments ? "assignments" : "resources"
                }...`}
                className="min-w-0 flex-1 bg-transparent text-sm outline-none"
              />
            </div>
          </div>

          <SearchableSubjectDropdown
            value={subject}
            onChange={setSubject}
            options={subjectOptions}
            tone={isAssignments ? "amber" : "teal"}
          />

          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
              Class
            </label>
            <select
              value={className}
              onChange={(event) => setClassName(event.target.value)}
              className={`min-h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-800 shadow-sm outline-none transition focus:ring-4 ${
                isAssignments
                  ? "focus:border-amber-500 focus:ring-amber-100"
                  : "focus:border-teal-500 focus:ring-teal-100"
              }`}
            >
              {classOptions.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-between gap-4">
          <p className="text-sm font-semibold text-slate-600">
            {visibleItems.length} {visibleItems.length === 1 ? "item" : "items"}{" "}
            available
          </p>
          <button
            type="button"
            onClick={() => setRefreshKey((key) => key + 1)}
            disabled={loading}
            className={`inline-flex items-center gap-2 rounded-xl border bg-white px-4 py-2 text-sm font-bold shadow-sm transition disabled:cursor-not-allowed disabled:opacity-60 ${
              isAssignments
                ? "border-amber-200 text-amber-900 hover:bg-amber-50"
                : "border-teal-200 text-teal-900 hover:bg-teal-50"
            }`}
          >
            <FiRefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {[0, 1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-72 animate-pulse rounded-3xl border border-slate-200 bg-white"
              />
            ))}
          </div>
        ) : error ? (
          <div className="mt-8 rounded-3xl border border-red-200 bg-red-50 p-8 text-center">
            <FiAlertCircle className="mx-auto h-10 w-10 text-red-600" />
            <h2 className="mt-4 text-lg font-black text-red-950">
              {pageTitle} could not be loaded
            </h2>
            <p className="mt-2 text-sm text-red-800">{error}</p>
          </div>
        ) : visibleItems.length ? (
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {visibleItems.map((item) => {
              const files = getItemFiles(item, contentType);

              if (isAssignments) {
                return (
                  <article
                    key={item.id}
                    className="flex flex-col overflow-hidden rounded-3xl border border-amber-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-amber-100"
                  >
                    <div className="h-2 bg-gradient-to-r from-amber-400 via-orange-500 to-red-500" />
                    <div className="flex flex-1 flex-col p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="rounded-2xl bg-amber-100 p-3 text-amber-800">
                          <FiCheckCircle className="h-6 w-6" />
                        </div>
                        <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-black text-amber-900">
                          {humanizeValue(item.status, "Assignment")}
                        </span>
                      </div>

                      <h2 className="mt-5 text-xl font-black text-slate-950">
                        {item.title || "Untitled assignment"}
                      </h2>
                      <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">
                        {item.description || "No description has been provided."}
                      </p>

                      <div className="mt-5 grid grid-cols-[1fr_auto] gap-3">
                        <div className="rounded-2xl bg-slate-100 p-4">
                          <p className="text-xs font-black uppercase tracking-wider text-slate-400">
                            Subject and class
                          </p>
                          <p className="mt-2 text-sm font-black text-slate-900">
                            {item.subject || "General Studies"}
                          </p>
                          <p className="mt-1 text-xs font-semibold text-slate-500">
                            {item.className || "All Classes"}
                          </p>
                        </div>
                        <div className="min-w-28 rounded-2xl bg-[#2b1208] p-4 text-white">
                          <FiClock className="h-4 w-4 text-amber-300" />
                          <p className="mt-3 text-xs font-bold text-amber-100/60">
                            Due date
                          </p>
                          <p className="mt-1 text-sm font-black">
                            {formatDisplayDate(item.dueDate, "Not set")}
                          </p>
                        </div>
                      </div>

                      <p className="mt-4 flex items-center gap-2 text-sm font-semibold text-slate-600">
                        <FiUser className="h-4 w-4 text-amber-700" />
                        {item.teacher || "Kinyui Boys teacher"}
                      </p>

                      <div className="mt-6 border-t border-amber-100 pt-5">
                        {files.length ? (
                          <div className="space-y-2">
                            {files.map((file, index) => (
                              <a
                                key={`${file.url}-${index}`}
                                href={file.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-between gap-3 rounded-xl bg-amber-500 px-4 py-3 text-sm font-black text-[#2b1208] transition hover:bg-amber-400"
                              >
                                <span className="truncate">{file.name}</span>
                                <FiDownload className="h-4 w-4 shrink-0" />
                              </a>
                            ))}
                          </div>
                        ) : (
                          <p className="rounded-xl bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-900">
                            No assignment file is attached yet.
                          </p>
                        )}
                      </div>
                    </div>
                  </article>
                );
              }

              return (
                <article
                  key={item.id}
                  className="group flex flex-col rounded-[28px] border border-cyan-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-teal-300 hover:shadow-xl hover:shadow-cyan-100"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="rounded-[20px] bg-gradient-to-br from-teal-500 to-cyan-600 p-4 text-white shadow-lg shadow-cyan-200">
                      <FiFolder className="h-7 w-7" />
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-black text-teal-700">
                        {files.length}
                      </p>
                      <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
                        Files
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-2">
                    <span className="rounded-full bg-cyan-50 px-3 py-1 text-xs font-black text-cyan-800">
                      {humanizeValue(item.category, "Learning resource")}
                    </span>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                      {humanizeValue(item.type, "Document")}
                    </span>
                  </div>

                  <h2 className="mt-4 text-xl font-black text-slate-950">
                    {item.title || "Untitled resource"}
                  </h2>
                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">
                    {item.description || "No description has been provided."}
                  </p>

                  <div className="mt-5 grid gap-3 rounded-2xl bg-cyan-50/70 p-4 sm:grid-cols-2">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-wider text-teal-700/60">
                        Subject
                      </p>
                      <p className="mt-1 text-sm font-black text-teal-950">
                        {item.subject || "General Studies"}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-wider text-teal-700/60">
                        Class
                      </p>
                      <p className="mt-1 text-sm font-black text-teal-950">
                        {item.className || "All Classes"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap justify-between gap-3 text-sm font-semibold text-slate-500">
                    <span className="flex items-center gap-2">
                      <FiUser className="h-4 w-4 text-teal-600" />
                      {item.teacher || item.uploadedBy || "Kinyui Boys"}
                    </span>
                    <span className="flex items-center gap-2">
                      <FiCalendar className="h-4 w-4 text-teal-600" />
                      {formatDisplayDate(item.createdAt, "Date unavailable")}
                    </span>
                  </div>

                  <div className="mt-6 border-t border-cyan-100 pt-5">
                    {files.length ? (
                      <div className="space-y-2">
                        {files.map((file, index) => (
                          <a
                            key={`${file.url}-${index}`}
                            href={file.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between gap-3 rounded-xl border border-teal-200 bg-teal-50 px-4 py-3 text-sm font-black text-teal-900 transition hover:border-teal-600 hover:bg-teal-600 hover:text-white"
                          >
                            <span className="truncate">{file.name}</span>
                            <FiDownload className="h-4 w-4 shrink-0" />
                          </a>
                        ))}
                      </div>
                    ) : (
                      <p className="rounded-xl bg-cyan-50 px-4 py-3 text-sm font-semibold text-cyan-900">
                        No resource file is attached yet.
                      </p>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div
            className={`mt-8 rounded-3xl border border-dashed bg-white p-12 text-center ${
              isAssignments ? "border-amber-300" : "border-cyan-300"
            }`}
          >
            <FiBookOpen className="mx-auto h-10 w-10 text-slate-400" />
            <h2 className="mt-4 text-lg font-black text-slate-900">
              No matching {isAssignments ? "assignments" : "resources"}
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Try a different subject, class, or search phrase.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
