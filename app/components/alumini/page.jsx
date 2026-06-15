"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  FiAward,
  FiBriefcase,
  FiCalendar,
  FiExternalLink,
  FiMapPin,
  FiRefreshCw,
  FiUsers,
} from "react-icons/fi";

const createSlug = (value = "") =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") || "alumni";

const normalizeImages = (record) => {
  const images = Array.isArray(record.images)
    ? record.images
        .map((image) =>
          typeof image === "string"
            ? { url: image, altText: record.title }
            : image
        )
        .filter((image) => image?.url)
    : [];

  if (record.image && !images.some((image) => image.url === record.image)) {
    images.unshift({ url: record.image, altText: record.title });
  }

  return images;
};

export default function AlumniPage() {
  const [alumni, setAlumni] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadAlumni = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/alumini", { cache: "no-store" });
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to load alumni");
      }

      setAlumni(data.alumni || data.collections || []);
    } catch (fetchError) {
      setError(fetchError.message || "Failed to load alumni");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAlumni();
  }, [loadAlumni]);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <section className="relative overflow-hidden bg-slate-950 px-4 pb-20 pt-28 text-white sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(249,115,22,0.32),transparent_36%),radial-gradient(circle_at_bottom_right,rgba(14,116,144,0.26),transparent_38%)]" />
        <div className="relative mx-auto max-w-6xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-orange-300/30 bg-orange-400/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-orange-200">
            <FiUsers className="h-4 w-4" />
            Alumni collection
          </span>
          <h1 className="mt-6 max-w-4xl text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
            Kinyui Boys Alumni
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
            Meet former students and explore the stories, achievements, and
            journeys shared by the Kinyui Boys community.
          </p>
          <p className="mt-8 text-sm font-black text-orange-200">
            {loading ? "Loading alumni..." : `${alumni.length} alumni records`}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-orange-700">
              From the API
            </p>
            <h2 className="mt-2 text-2xl font-black sm:text-3xl">
              Alumni stories
            </h2>
          </div>
          <button
            type="button"
            onClick={loadAlumni}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-700 shadow-sm transition hover:border-orange-300 hover:text-orange-700 disabled:cursor-wait disabled:opacity-60"
          >
            <FiRefreshCw className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((item) => (
              <div
                key={item}
                className="h-[420px] animate-pulse rounded-3xl bg-slate-200"
              />
            ))}
          </div>
        ) : error ? (
          <div className="mt-8 rounded-3xl border border-red-200 bg-red-50 p-8 text-center">
            <p className="font-black text-red-900">Unable to load alumni.</p>
            <p className="mt-2 text-sm text-red-700">{error}</p>
          </div>
        ) : alumni.length ? (
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {alumni.map((record) => {
              const images = normalizeImages(record);
              const primaryImage = images[0];

              return (
                <article
                  key={record.id}
                  className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
                >
                  <div className="aspect-[4/3] bg-slate-200">
                    {primaryImage ? (
                      <img
                        src={primaryImage.url}
                        alt={primaryImage.altText || record.title || record.name}
                        loading="lazy"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-gradient-to-br from-orange-100 to-amber-200 text-orange-700">
                        <FiUsers className="h-14 w-14" />
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <div className="flex flex-wrap gap-2 text-xs font-black">
                      {record.graduationYear ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-100 px-3 py-1.5 text-orange-800">
                          <FiCalendar />
                          Class of {record.graduationYear}
                        </span>
                      ) : null}
                      {record.isFeatured ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1.5 text-amber-800">
                          <FiAward />
                          Featured
                        </span>
                      ) : null}
                    </div>

                    <h3 className="mt-4 text-xl font-black text-slate-950">
                      {record.title || record.name}
                    </h3>

                    {record.currentRole || record.organization ? (
                      <p className="mt-2 flex items-start gap-2 text-sm font-bold text-slate-700">
                        <FiBriefcase className="mt-0.5 shrink-0 text-orange-600" />
                        <span>
                          {[record.currentRole, record.organization]
                            .filter(Boolean)
                            .join(" at ")}
                        </span>
                      </p>
                    ) : null}

                    {record.location ? (
                      <p className="mt-2 flex items-center gap-2 text-sm text-slate-500">
                        <FiMapPin className="shrink-0 text-orange-600" />
                        {record.location}
                      </p>
                    ) : null}

                    {record.story || record.description ? (
                      <p className="mt-4 line-clamp-5 text-sm leading-6 text-slate-600">
                        {record.story || record.description}
                      </p>
                    ) : null}

                    {record.achievement ? (
                      <p className="mt-4 rounded-2xl bg-orange-50 p-4 text-sm leading-6 text-orange-950">
                        <strong>Achievement:</strong> {record.achievement}
                      </p>
                    ) : null}

                    <div className="mt-5 flex flex-wrap items-center gap-4">
                      <Link
                        href={`/alumini/${record.id}/${createSlug(record.title || record.name)}`}
                        className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-3 text-sm font-black text-white transition hover:bg-orange-700"
                      >
                        View Profile
                        <FiExternalLink />
                      </Link>

                      {record.website ? (
                        <a
                          href={record.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-sm font-black text-orange-700 hover:text-orange-900"
                        >
                          External website
                          <FiExternalLink />
                        </a>
                      ) : null}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="mt-8 rounded-3xl border border-dashed border-orange-300 bg-white p-12 text-center">
            <FiUsers className="mx-auto h-10 w-10 text-orange-400" />
            <h3 className="mt-4 text-lg font-black">No alumni records yet</h3>
            <p className="mt-2 text-sm text-slate-600">
              Records added through the alumni API will appear here.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
