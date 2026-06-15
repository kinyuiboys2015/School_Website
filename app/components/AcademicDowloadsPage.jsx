"use client";

import { useEffect, useMemo, useState } from "react";
import {
  FiAlertCircle,
  FiBookOpen,
  FiCheckCircle,
  FiDownload,
  FiEye,
  FiFileText,
  FiFolder,
  FiRefreshCw,
  FiSearch,
  FiTarget,
  FiUser,
  FiX,
} from "react-icons/fi";
import SearchableSubjectDropdown from "./SearchableSubjectDropdown/page";
import {
  ALL_SUBJECTS_LABEL,
  SUBJECT_OPTIONS,
} from "../constants/subjects";
import {
  normalizeDownloadFile,
} from "../../libs/displayNames";

const ALL_CLASSES = "All Classes";
const normalizeFilterValue = (value) =>
  String(value || "").trim().toLowerCase();

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

const fetchAcademicData = async (endpoint, signal, attempts = 3) => {
  let lastError;

  for (let attempt = 0; attempt < attempts; attempt += 1) {
    try {
      const response = await fetch(endpoint, {
        signal,
        cache: "no-store",
      });
      const data = await response.json();

      if (response.ok && data.success) return data;
      lastError = new Error(data.error || `Request failed: ${response.status}`);
    } catch (error) {
      if (error.name === "AbortError") throw error;
      lastError = error;
    }

    if (attempt < attempts - 1) {
      await new Promise((resolve) => setTimeout(resolve, 750 * (attempt + 1)));
    }
  }

  throw lastError || new Error("Unable to load academic downloads.");
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
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    const loadItems = async () => {
      setLoading(true);
      setError("");

      try {
        const endpoint = isAssignments
          ? "/api/assignment?limit=250"
          : "/api/resources?isActive=true&limit=250";
        const data = await fetchAcademicData(endpoint, controller.signal);

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

  useEffect(() => {
    if (!selectedItem) return undefined;

    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setSelectedItem(null);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [selectedItem]);

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
    const query = normalizeFilterValue(searchTerm);
    const selectedSubject = normalizeFilterValue(subject);
    const selectedClass = normalizeFilterValue(className);

    return items.filter((item) => {
      const files = getItemFiles(item, contentType);
      const searchableText = [
        item.title,
        item.description,
        item.subject,
        item.teacher,
        item.className,
        ...files.flatMap((file) => [
          file.name,
          file.extension,
          file.fileType,
        ]),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return (
        (!query || searchableText.includes(query)) &&
        (subject === ALL_SUBJECTS_LABEL ||
          normalizeFilterValue(item.subject) === selectedSubject) &&
        (className === ALL_CLASSES ||
          normalizeFilterValue(item.className) === selectedClass)
      );
    });
  }, [className, contentType, items, searchTerm, subject]);

  const hasActiveFilters =
    Boolean(searchTerm.trim()) ||
    subject !== ALL_SUBJECTS_LABEL ||
    className !== ALL_CLASSES;

  const clearFilters = () => {
    setSearchTerm("");
    setSubject(ALL_SUBJECTS_LABEL);
    setClassName(ALL_CLASSES);
  };

  const downloadAllFiles = (files) => {
    files.forEach((file, index) => {
      window.setTimeout(() => {
        const link = document.createElement("a");
        link.href = file.url;
        link.download = file.name || `academic-file-${index + 1}`;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        document.body.appendChild(link);
        link.click();
        link.remove();
      }, index * 250);
    });
  };

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
          <div className="relative mx-auto max-w-6xl">
            <div className="max-w-3xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-amber-300/30 bg-amber-400/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-amber-200">
                <FiTarget className="h-4 w-4" />
                {pageTitle}
              </span>
              <h1 className="mt-6 max-w-3xl text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
                Open the task. Complete the work.
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-amber-50/75 sm:text-lg">
                Review current Kinyui Boys assignments, teacher instructions,
                and every submitted file needed to complete your coursework.
              </p>
            </div>

          </div>
        </section>
      ) : (
        <section className="relative overflow-hidden bg-gradient-to-br from-teal-950 via-slate-950 to-cyan-950 px-4 pb-24 pt-24 text-white sm:px-6 lg:px-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.2),transparent_36%),radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.2),transparent_34%)]" />
          <div className="relative mx-auto max-w-6xl">
            <div className="max-w-3xl">
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
                aria-label={`Search ${
                  isAssignments ? "assignment" : "resource"
                } table`}
                className="min-w-0 flex-1 bg-transparent text-sm outline-none"
              />
              {searchTerm ? (
                <button
                  type="button"
                  onClick={() => setSearchTerm("")}
                  aria-label="Clear search"
                  className="rounded-full p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                >
                  <FiX className="h-4 w-4" />
                </button>
              ) : null}
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

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
          <p className="text-sm font-semibold text-slate-600">
            {loading
              ? `Loading ${isAssignments ? "assignments" : "resources"}...`
              : `Browse the submitted ${
                  isAssignments ? "assignments" : "resources"
                } below.`}
          </p>
          <div className="flex items-center gap-2">
            {hasActiveFilters ? (
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50"
              >
                <FiX className="h-4 w-4" />
                Clear filters
              </button>
            ) : null}
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
              <FiRefreshCw
                className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
              />
              Refresh
            </button>
          </div>
        </div>

        {error ? (
          <div className="mt-8 rounded-3xl border border-red-200 bg-red-50 p-8 text-center">
            <FiAlertCircle className="mx-auto h-10 w-10 text-red-600" />
            <h2 className="mt-4 text-lg font-black text-red-950">
              {pageTitle} could not be loaded
            </h2>
            <p className="mt-2 text-sm text-red-800">{error}</p>
          </div>
        ) : (
          <div
            className={`mt-8 overflow-hidden rounded-3xl border bg-white shadow-sm ${
              isAssignments ? "border-amber-200" : "border-cyan-200"
            }`}
          >
            <div
              className={`flex items-center justify-between gap-4 border-b px-5 py-4 sm:px-6 ${
                isAssignments
                  ? "border-amber-100 bg-amber-50"
                  : "border-cyan-100 bg-cyan-50"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl text-white ${
                    isAssignments
                      ? "bg-gradient-to-br from-amber-500 to-orange-600"
                      : "bg-gradient-to-br from-teal-500 to-cyan-600"
                  }`}
                >
                  {isAssignments ? (
                    <FiCheckCircle className="h-5 w-5" />
                  ) : (
                    <FiFolder className="h-5 w-5" />
                  )}
                </div>
                <div>
                  <h2 className="font-black text-slate-950">
                    {isAssignments ? "Academic Assignments" : "Digital Resources"}
                  </h2>
                  <p className="text-xs font-semibold text-slate-500">
                    {loading
                      ? "Loading records..."
                      : "Only submitted information is shown"}
                  </p>
                </div>
              </div>
              <span
                className={`hidden rounded-full px-3 py-1 text-xs font-black sm:inline-flex ${
                  isAssignments
                    ? "bg-amber-100 text-amber-900"
                    : "bg-cyan-100 text-cyan-900"
                }`}
              >
                Scroll sideways on small screens
              </span>
            </div>

            <div className="overflow-x-auto">
              {isAssignments ? (
                <table className="w-full min-w-[850px] border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 text-left">
                      <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-slate-500">
                        Assignment
                      </th>
                      <th className="px-5 py-4 text-xs font-black uppercase tracking-wider text-slate-500">
                        Subject / Class
                      </th>
                      <th className="px-5 py-4 text-xs font-black uppercase tracking-wider text-slate-500">
                        Teacher
                      </th>
                      <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-slate-500">
                        Files
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {loading ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-16 text-center">
                          <FiRefreshCw className="mx-auto h-7 w-7 animate-spin text-amber-600" />
                          <p className="mt-3 text-sm font-bold text-slate-600">
                            Loading assignments into the table...
                          </p>
                        </td>
                      </tr>
                    ) : visibleItems.length ? (
                      visibleItems.map((item) => {
                        const files = getItemFiles(item, contentType);

                        return (
                          <tr
                            key={item.id}
                            className="align-top transition hover:bg-amber-50/50"
                          >
                          <td className="max-w-[330px] px-6 py-5">
                            <div className="flex items-start gap-3">
                              <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-800">
                                <FiFileText className="h-5 w-5" />
                              </div>
                              <div className="min-w-0">
                                <p className="font-black text-slate-950">
                                  {item.title || "Untitled assignment"}
                                </p>
                                <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">
                                  {item.description ||
                                    "No description has been provided."}
                                </p>
                                <button
                                  type="button"
                                  onClick={() => setSelectedItem(item)}
                                  className="mt-3 inline-flex items-center gap-2 rounded-lg border border-amber-200 bg-white px-3 py-2 text-xs font-black text-amber-900 transition hover:bg-amber-100"
                                >
                                  <FiEye className="h-3.5 w-3.5" />
                                  View details
                                </button>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-5">
                            <p className="text-sm font-black text-slate-900">
                              {item.subject || "Not provided"}
                            </p>
                            <p className="mt-1 text-xs font-semibold text-slate-500">
                              {item.className || "Not provided"}
                            </p>
                          </td>
                          <td className="px-5 py-5">
                            <span className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                              <FiUser className="h-4 w-4 text-amber-700" />
                              {item.teacher || "Not provided"}
                            </span>
                          </td>
                          <td className="min-w-[220px] px-6 py-5">
                            {files.length ? (
                              <div className="space-y-2">
                                {files.map((file, index) => (
                                  <a
                                    key={`${file.url}-${index}`}
                                    href={file.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex max-w-[240px] items-center justify-between gap-2 rounded-lg bg-amber-100 px-3 py-2 text-xs font-black text-amber-900 transition hover:bg-amber-500 hover:text-[#2b1208]"
                                  >
                                    <span className="truncate">{file.name}</span>
                                    <FiDownload className="h-3.5 w-3.5 shrink-0" />
                                  </a>
                                ))}
                                <button
                                  type="button"
                                  onClick={() => downloadAllFiles(files)}
                                  className="flex w-full max-w-[240px] items-center justify-center gap-2 rounded-lg bg-[#2b1208] px-3 py-2 text-xs font-black text-white transition hover:bg-amber-700"
                                >
                                  <FiDownload className="h-3.5 w-3.5" />
                                  Download all
                                </button>
                              </div>
                            ) : (
                              <span className="text-xs font-semibold text-slate-400">
                                No files attached
                              </span>
                            )}
                          </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={4} className="px-6 py-16 text-center">
                          <FiBookOpen className="mx-auto h-9 w-9 text-slate-400" />
                          <p className="mt-3 font-black text-slate-900">
                            No matching assignments
                          </p>
                          <p className="mt-1 text-sm text-slate-500">
                            Change the search phrase, subject, or class.
                          </p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              ) : (
                <table className="w-full min-w-[850px] border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 text-left">
                      <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-slate-500">
                        Resource
                      </th>
                      <th className="px-5 py-4 text-xs font-black uppercase tracking-wider text-slate-500">
                        Subject / Class
                      </th>
                      <th className="px-5 py-4 text-xs font-black uppercase tracking-wider text-slate-500">
                        Teacher
                      </th>
                      <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-slate-500">
                        Files
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {loading ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-16 text-center">
                          <FiRefreshCw className="mx-auto h-7 w-7 animate-spin text-teal-600" />
                          <p className="mt-3 text-sm font-bold text-slate-600">
                            Loading resources into the table...
                          </p>
                        </td>
                      </tr>
                    ) : visibleItems.length ? (
                      visibleItems.map((item) => {
                        const files = getItemFiles(item, contentType);

                        return (
                          <tr
                            key={item.id}
                            className="align-top transition hover:bg-cyan-50/50"
                          >
                          <td className="max-w-[330px] px-6 py-5">
                            <div className="flex items-start gap-3">
                              <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 text-white">
                                <FiFolder className="h-5 w-5" />
                              </div>
                              <div className="min-w-0">
                                <p className="font-black text-slate-950">
                                  {item.title || "Untitled resource"}
                                </p>
                                <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">
                                  {item.description ||
                                    "No description has been provided."}
                                </p>
                                <button
                                  type="button"
                                  onClick={() => setSelectedItem(item)}
                                  className="mt-3 inline-flex items-center gap-2 rounded-lg border border-teal-200 bg-white px-3 py-2 text-xs font-black text-teal-900 transition hover:bg-teal-50"
                                >
                                  <FiEye className="h-3.5 w-3.5" />
                                  View details
                                </button>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-5">
                            <p className="text-sm font-black text-slate-900">
                              {item.subject || "Not provided"}
                            </p>
                            <p className="mt-1 text-xs font-semibold text-slate-500">
                              {item.className || "Not provided"}
                            </p>
                          </td>
                          <td className="px-5 py-5">
                            <span className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                              <FiUser className="h-4 w-4 text-teal-600" />
                              {item.teacher || "Not provided"}
                            </span>
                          </td>
                          <td className="min-w-[220px] px-6 py-5">
                            {files.length ? (
                              <div className="space-y-2">
                                {files.map((file, index) => (
                                  <a
                                    key={`${file.url}-${index}`}
                                    href={file.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex max-w-[240px] items-center justify-between gap-2 rounded-lg border border-teal-200 bg-teal-50 px-3 py-2 text-xs font-black text-teal-900 transition hover:border-teal-600 hover:bg-teal-600 hover:text-white"
                                  >
                                    <span className="truncate">{file.name}</span>
                                    <FiDownload className="h-3.5 w-3.5 shrink-0" />
                                  </a>
                                ))}
                                <button
                                  type="button"
                                  onClick={() => downloadAllFiles(files)}
                                  className="flex w-full max-w-[240px] items-center justify-center gap-2 rounded-lg bg-teal-700 px-3 py-2 text-xs font-black text-white transition hover:bg-teal-800"
                                >
                                  <FiDownload className="h-3.5 w-3.5" />
                                  Download all
                                </button>
                              </div>
                            ) : (
                              <span className="text-xs font-semibold text-slate-400">
                                No files attached
                              </span>
                            )}
                          </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={4} className="px-6 py-16 text-center">
                          <FiBookOpen className="mx-auto h-9 w-9 text-slate-400" />
                          <p className="mt-3 font-black text-slate-900">
                            No matching resources
                          </p>
                          <p className="mt-1 text-sm text-slate-500">
                            Change the search phrase, subject, or class.
                          </p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}
      </section>

      {selectedItem ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="academic-details-title"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setSelectedItem(null);
          }}
        >
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
            <div
              className={`sticky top-0 z-10 flex items-start justify-between gap-4 border-b px-6 py-5 ${
                isAssignments
                  ? "border-amber-200 bg-amber-50"
                  : "border-cyan-200 bg-cyan-50"
              }`}
            >
              <div>
                <p
                  className={`text-xs font-black uppercase tracking-[0.18em] ${
                    isAssignments ? "text-amber-800" : "text-teal-700"
                  }`}
                >
                  {isAssignments ? "Assignment details" : "Resource details"}
                </p>
                <h2
                  id="academic-details-title"
                  className="mt-2 text-2xl font-black text-slate-950"
                >
                  {selectedItem.title ||
                    (isAssignments ? "Untitled assignment" : "Untitled resource")}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                aria-label="Close details"
                className="rounded-full border border-slate-200 bg-white p-2 text-slate-600 transition hover:bg-slate-100 hover:text-slate-950"
              >
                <FiX className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-7 p-6">
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {[
                  ["Subject", selectedItem.subject || "Not provided"],
                  ["Class", selectedItem.className || "Not provided"],
                  [
                    "Teacher",
                    selectedItem.teacher || "Not provided",
                  ],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                  >
                    <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-500">
                      {label}
                    </p>
                    <p className="mt-2 text-sm font-bold text-slate-900">
                      {value}
                    </p>
                  </div>
                ))}
              </div>

              <section>
                <h3 className="text-sm font-black uppercase tracking-[0.16em] text-slate-500">
                  Description
                </h3>
                <div className="mt-3 whitespace-pre-wrap rounded-2xl border border-slate-200 bg-white p-5 text-sm leading-7 text-slate-700">
                  {selectedItem.description ||
                    `No ${
                      isAssignments ? "instructions" : "description"
                    } have been provided.`}
                </div>
              </section>

              <section>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="text-sm font-black uppercase tracking-[0.16em] text-slate-500">
                    Attached files
                  </h3>
                  {getItemFiles(selectedItem, contentType).length ? (
                    <button
                      type="button"
                      onClick={() =>
                        downloadAllFiles(
                          getItemFiles(selectedItem, contentType)
                        )
                      }
                      className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-black text-white transition ${
                        isAssignments
                          ? "bg-amber-700 hover:bg-amber-800"
                          : "bg-teal-700 hover:bg-teal-800"
                      }`}
                    >
                      <FiDownload className="h-4 w-4" />
                      Download all
                    </button>
                  ) : null}
                </div>

                <div className="mt-3 space-y-2">
                  {getItemFiles(selectedItem, contentType).length ? (
                    getItemFiles(selectedItem, contentType).map(
                      (file, index) => (
                        <a
                          key={`${file.url}-modal-${index}`}
                          href={file.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-800 transition hover:border-slate-400 hover:bg-white"
                        >
                          <span className="min-w-0 truncate">{file.name}</span>
                          <FiDownload className="h-4 w-4 shrink-0" />
                        </a>
                      )
                    )
                  ) : (
                    <p className="rounded-xl border border-dashed border-slate-300 p-5 text-sm font-semibold text-slate-500">
                      No files are attached to this item.
                    </p>
                  )}
                </div>
              </section>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}
