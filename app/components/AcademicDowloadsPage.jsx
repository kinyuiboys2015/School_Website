"use client";

import { useEffect, useMemo, useState } from "react";
import {
  FiAlertCircle,
  FiBookOpen,
  FiCalendar,
  FiDownload,
  FiFileText,
  FiRefreshCw,
  FiSearch,
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

  const pageTitle = isAssignments ? "Student Assignments" : "Exam Resources";
  const pageDescription = isAssignments
    ? "Find current assignments, instructions, and supporting files shared by the school."
    : "Browse active student learning materials, revision documents, and examination resources.";

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <section className="relative overflow-hidden bg-slate-950 px-4 pb-24 pt-28 text-white sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(249,115,22,0.3),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(14,116,144,0.25),transparent_38%)]" />
        <div className="relative mx-auto max-w-6xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-orange-300/30 bg-orange-400/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-orange-200">
            <FiBookOpen className="h-4 w-4" />
            Academic downloads
          </span>
          <h1 className="mt-6 max-w-3xl text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
            {pageTitle}
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
            {pageDescription}
          </p>
        </div>
      </section>

      <section className="relative z-10 mx-auto -mt-12 max-w-6xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="grid gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-xl shadow-slate-200/60 md:grid-cols-3">
          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
              Search
            </label>
            <div className="flex min-h-12 items-center gap-3 rounded-xl border border-slate-200 px-4 focus-within:border-orange-500 focus-within:ring-4 focus-within:ring-orange-100">
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
          />

          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
              Class
            </label>
            <select
              value={className}
              onChange={(event) => setClassName(event.target.value)}
              className="min-h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-800 shadow-sm outline-none transition focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
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
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 shadow-sm transition hover:border-orange-300 hover:text-orange-700 disabled:cursor-not-allowed disabled:opacity-60"
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
                className="h-64 animate-pulse rounded-3xl border border-slate-200 bg-white"
              />
            ))}
          </div>
        ) : error ? (
          <div className="mt-8 rounded-3xl border border-red-200 bg-red-50 p-8 text-center">
            <FiAlertCircle className="mx-auto h-10 w-10 text-red-600" />
            <h2 className="mt-4 text-lg font-black text-red-950">
              Academic downloads could not be loaded
            </h2>
            <p className="mt-2 text-sm text-red-800">{error}</p>
          </div>
        ) : visibleItems.length ? (
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {visibleItems.map((item) => {
              const files = getItemFiles(item, contentType);
              return (
                <article
                  key={item.id}
                  className="flex flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-orange-200 hover:shadow-xl hover:shadow-orange-100/60"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="rounded-2xl bg-orange-100 p-3 text-orange-700">
                      <FiFileText className="h-6 w-6" />
                    </div>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
                      {humanizeValue(
                        isAssignments ? item.status : item.category,
                        isAssignments ? "Assignment" : "Resource"
                      )}
                    </span>
                  </div>

                  <h2 className="mt-5 text-xl font-black text-slate-950">
                    {item.title || "Untitled academic item"}
                  </h2>
                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">
                    {item.description || "No description has been provided."}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-2 text-xs font-semibold text-slate-600">
                    <span className="rounded-lg bg-slate-100 px-3 py-2">
                      {item.subject || "General Studies"}
                    </span>
                    <span className="rounded-lg bg-slate-100 px-3 py-2">
                      {item.className || "All Classes"}
                    </span>
                  </div>

                  <div className="mt-5 grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
                    <span className="flex items-center gap-2">
                      <FiUser className="h-4 w-4 text-orange-600" />
                      {item.teacher || item.uploadedBy || "School Admin"}
                    </span>
                    <span className="flex items-center gap-2">
                      <FiCalendar className="h-4 w-4 text-orange-600" />
                      {formatDisplayDate(
                        isAssignments ? item.dueDate : item.createdAt,
                        isAssignments ? "No due date" : "Date unavailable"
                      )}
                    </span>
                  </div>

                  <div className="mt-6 border-t border-slate-100 pt-5">
                    {files.length ? (
                      <div className="space-y-2">
                        {files.map((file, index) => (
                          <a
                            key={`${file.url}-${index}`}
                            href={file.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between gap-3 rounded-xl bg-slate-950 px-4 py-3 text-sm font-bold text-white transition hover:bg-orange-600"
                          >
                            <span className="truncate">{file.name}</span>
                            <FiDownload className="h-4 w-4 shrink-0" />
                          </a>
                        ))}
                      </div>
                    ) : (
                      <p className="rounded-xl bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-900">
                        No downloadable file is attached yet.
                      </p>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="mt-8 rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">
            <FiBookOpen className="mx-auto h-10 w-10 text-slate-400" />
            <h2 className="mt-4 text-lg font-black text-slate-900">
              No matching academic downloads
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
