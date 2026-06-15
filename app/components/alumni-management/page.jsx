"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  FiAward,
  FiBriefcase,
  FiCalendar,
  FiEdit2,
  FiExternalLink,
  FiImage,
  FiMapPin,
  FiPlus,
  FiRefreshCw,
  FiSearch,
  FiTrash2,
  FiUsers,
  FiX,
} from "react-icons/fi";
import { toast } from "sonner";

const EMPTY_FORM = {
  title: "",
  graduationYear: "",
  currentRole: "",
  organization: "",
  location: "",
  story: "",
  achievement: "",
  website: "",
  displayOrder: "0",
  isFeatured: false,
  isActive: true,
};

const createSlug = (value = "") =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") || "alumni";

const getAuthHeaders = () => ({
  "x-admin-token":
    localStorage.getItem("admin_token") ||
    localStorage.getItem("token") ||
    "",
  "x-device-token":
    localStorage.getItem("device_token") ||
    localStorage.getItem("deviceToken") ||
    "",
});

const getRecordImages = (record) => {
  const images = Array.isArray(record?.images)
    ? record.images.filter((image) => image?.url)
    : [];

  if (record?.image && !images.some((image) => image.url === record.image)) {
    return [{ url: record.image, altText: record.title }, ...images];
  }

  return images;
};

export default function AlumniManager() {
  const [alumni, setAlumni] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [imageFiles, setImageFiles] = useState([]);

  const loadAlumni = useCallback(async () => {
    setLoading(true);

    try {
      const response = await fetch("/api/alumini?includeInactive=1", {
        cache: "no-store",
        headers: getAuthHeaders(),
      });
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || data.error || "Failed to load alumni");
      }

      setAlumni(data.alumni || []);
    } catch (error) {
      toast.error(error.message || "Failed to load alumni records");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAlumni();
  }, [loadAlumni]);

  const filteredAlumni = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return alumni;

    return alumni.filter((record) =>
      [
        record.title,
        record.currentRole,
        record.organization,
        record.location,
        record.graduationYear,
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query))
    );
  }, [alumni, search]);

  const openCreateForm = () => {
    setEditingRecord(null);
    setForm(EMPTY_FORM);
    setImageFiles([]);
    setShowForm(true);
  };

  const openEditForm = (record) => {
    setEditingRecord(record);
    setForm({
      title: record.title || "",
      graduationYear: record.graduationYear || "",
      currentRole: record.currentRole || "",
      organization: record.organization || "",
      location: record.location || "",
      story: record.story || "",
      achievement: record.achievement || "",
      website: record.website || "",
      displayOrder: String(record.displayOrder ?? 0),
      isFeatured: Boolean(record.isFeatured),
      isActive: Boolean(record.isActive),
    });
    setImageFiles([]);
    setShowForm(true);
  };

  const closeForm = () => {
    if (saving) return;
    setShowForm(false);
    setEditingRecord(null);
    setImageFiles([]);
  };

  const updateField = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.title.trim()) {
      toast.error("Alumni name is required");
      return;
    }

    setSaving(true);

    try {
      const payload = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        payload.append(key, String(value));
      });
      imageFiles.forEach((file) => payload.append("images", file));

      const response = await fetch(
        editingRecord ? `/api/alumini/${editingRecord.id}` : "/api/alumini",
        {
          method: editingRecord ? "PUT" : "POST",
          headers: getAuthHeaders(),
          body: payload,
        }
      );
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || data.error || "Unable to save alumni");
      }

      toast.success(
        editingRecord ? "Alumni profile updated" : "Alumni profile created"
      );
      setShowForm(false);
      setEditingRecord(null);
      setImageFiles([]);
      await loadAlumni();
    } catch (error) {
      toast.error(error.message || "Unable to save alumni profile");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (record) => {
    const confirmed = window.confirm(
      `Delete the alumni profile for ${record.title}? This cannot be undone.`
    );
    if (!confirmed) return;

    try {
      const response = await fetch(`/api/alumini/${record.id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || data.error || "Unable to delete alumni");
      }

      setAlumni((current) => current.filter((item) => item.id !== record.id));
      toast.success("Alumni profile deleted");
    } catch (error) {
      toast.error(error.message || "Unable to delete alumni profile");
    }
  };

  return (
    <div className="min-h-full bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="overflow-hidden rounded-3xl bg-slate-950 px-6 py-8 text-white shadow-xl sm:px-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-orange-500/15 px-3 py-1.5 text-xs font-black uppercase tracking-widest text-orange-200">
                <FiUsers />
                Alumni Administration
              </span>
              <h1 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">
                Kinyui Boys Alumni
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
                Create and maintain the alumni profiles displayed in the public
                directory and individual showcase pages.
              </p>
            </div>
            <button
              type="button"
              onClick={openCreateForm}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-600 px-5 py-3 text-sm font-black text-white hover:bg-orange-500"
            >
              <FiPlus />
              Add Alumni
            </button>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <StatCard label="Total Profiles" value={alumni.length} />
          <StatCard
            label="Published"
            value={alumni.filter((record) => record.isActive).length}
          />
          <StatCard
            label="Featured"
            value={alumni.filter((record) => record.isFeatured).length}
          />
        </div>

        <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center">
          <label className="relative flex-1">
            <span className="sr-only">Search alumni</span>
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by name, role, organization, year..."
              className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
            />
          </label>
          <button
            type="button"
            onClick={loadAlumni}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-black text-slate-700 hover:border-orange-300 hover:text-orange-700 disabled:opacity-60"
          >
            <FiRefreshCw className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {[0, 1, 2].map((item) => (
              <div
                key={item}
                className="h-96 animate-pulse rounded-3xl bg-slate-200"
              />
            ))}
          </div>
        ) : filteredAlumni.length ? (
          <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filteredAlumni.map((record) => {
              const image = getRecordImages(record)[0];
              const profileUrl = `/alumini/${record.id}/${createSlug(
                record.title
              )}`;

              return (
                <article
                  key={record.id}
                  className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
                >
                  <div className="relative aspect-[16/9] bg-slate-200">
                    {image ? (
                      <img
                        src={image.url}
                        alt={image.altText || record.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-gradient-to-br from-orange-100 to-amber-200 text-orange-700">
                        <FiUsers className="h-12 w-12" />
                      </div>
                    )}
                    <div className="absolute left-3 top-3 flex flex-wrap gap-2">
                      <StatusBadge active={record.isActive} />
                      {record.isFeatured ? (
                        <span className="rounded-full bg-amber-400 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-amber-950">
                          Featured
                        </span>
                      ) : null}
                    </div>
                  </div>

                  <div className="p-5">
                    <h2 className="text-xl font-black text-slate-950">
                      {record.title}
                    </h2>
                    <div className="mt-3 space-y-2 text-sm text-slate-600">
                      {record.graduationYear ? (
                        <p className="flex items-center gap-2">
                          <FiCalendar className="text-orange-600" />
                          Class of {record.graduationYear}
                        </p>
                      ) : null}
                      {record.currentRole || record.organization ? (
                        <p className="flex items-start gap-2">
                          <FiBriefcase className="mt-0.5 shrink-0 text-orange-600" />
                          {[record.currentRole, record.organization]
                            .filter(Boolean)
                            .join(" at ")}
                        </p>
                      ) : null}
                      {record.location ? (
                        <p className="flex items-center gap-2">
                          <FiMapPin className="text-orange-600" />
                          {record.location}
                        </p>
                      ) : null}
                    </div>

                    <div className="mt-5 grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => openEditForm(record)}
                        className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-slate-950 px-3 py-2.5 text-xs font-black text-white hover:bg-orange-700"
                      >
                        <FiEdit2 />
                        Edit
                      </button>
                      <Link
                        href={profileUrl}
                        target="_blank"
                        className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2.5 text-xs font-black text-slate-700 hover:border-orange-300 hover:text-orange-700"
                      >
                        <FiExternalLink />
                        View
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(record)}
                        className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-red-200 px-3 py-2.5 text-xs font-black text-red-700 hover:bg-red-50"
                      >
                        <FiTrash2 />
                        Delete
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="mt-6 rounded-3xl border border-dashed border-orange-300 bg-white p-12 text-center">
            <FiUsers className="mx-auto h-10 w-10 text-orange-500" />
            <h2 className="mt-4 text-lg font-black text-slate-950">
              No alumni profiles found
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Add the first alumni profile or adjust your search.
            </p>
          </div>
        )}
      </div>

      {showForm ? (
        <div
          className="fixed inset-0 z-[80] overflow-y-auto bg-slate-950/70 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="alumni-form-title"
        >
          <div className="mx-auto my-4 max-w-4xl rounded-3xl bg-white shadow-2xl sm:my-8">
            <div className="flex items-start justify-between border-b border-slate-200 p-6">
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-orange-700">
                  Alumni Profile
                </p>
                <h2
                  id="alumni-form-title"
                  className="mt-2 text-2xl font-black text-slate-950"
                >
                  {editingRecord ? "Edit alumni" : "Add alumni"}
                </h2>
              </div>
              <button
                type="button"
                onClick={closeForm}
                aria-label="Close alumni form"
                className="rounded-xl p-2 text-slate-500 hover:bg-slate-100"
              >
                <FiX className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid gap-5 md:grid-cols-2">
                <FormField label="Alumni Name" required>
                  <input
                    name="title"
                    value={form.title}
                    onChange={updateField}
                    required
                    className="form-input"
                    placeholder="Full name or alumni group title"
                  />
                </FormField>
                <FormField label="Graduation Year">
                  <input
                    name="graduationYear"
                    type="number"
                    min="1900"
                    max="2100"
                    value={form.graduationYear}
                    onChange={updateField}
                    className="form-input"
                    placeholder="2020"
                  />
                </FormField>
                <FormField label="Current Role">
                  <input
                    name="currentRole"
                    value={form.currentRole}
                    onChange={updateField}
                    className="form-input"
                    placeholder="Engineer, entrepreneur, student..."
                  />
                </FormField>
                <FormField label="Organization">
                  <input
                    name="organization"
                    value={form.organization}
                    onChange={updateField}
                    className="form-input"
                    placeholder="Company or institution"
                  />
                </FormField>
                <FormField label="Location">
                  <input
                    name="location"
                    value={form.location}
                    onChange={updateField}
                    className="form-input"
                    placeholder="City, country"
                  />
                </FormField>
                <FormField label="External Website">
                  <input
                    name="website"
                    type="url"
                    value={form.website}
                    onChange={updateField}
                    className="form-input"
                    placeholder="https://..."
                  />
                </FormField>
                <FormField label="Display Order">
                  <input
                    name="displayOrder"
                    type="number"
                    value={form.displayOrder}
                    onChange={updateField}
                    className="form-input"
                  />
                </FormField>
                <FormField label="Profile Images">
                  <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-orange-300 bg-orange-50 px-4 py-3 text-sm font-bold text-orange-800">
                    <FiImage />
                    <span>
                      {imageFiles.length
                        ? `${imageFiles.length} image(s) selected`
                        : "Choose one or more images"}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="sr-only"
                      onChange={(event) =>
                        setImageFiles(Array.from(event.target.files || []))
                      }
                    />
                  </label>
                </FormField>
                <FormField label="Alumni Story" wide>
                  <textarea
                    name="story"
                    value={form.story}
                    onChange={updateField}
                    rows="5"
                    className="form-input resize-y"
                    placeholder="Share the alumni journey after Kinyui Boys..."
                  />
                </FormField>
                <FormField label="Key Achievement" wide>
                  <textarea
                    name="achievement"
                    value={form.achievement}
                    onChange={updateField}
                    rows="3"
                    className="form-input resize-y"
                    placeholder="Highlight an achievement or contribution..."
                  />
                </FormField>
              </div>

              <div className="mt-6 flex flex-col gap-3 rounded-2xl bg-slate-50 p-4 sm:flex-row">
                <ToggleField
                  name="isActive"
                  checked={form.isActive}
                  onChange={updateField}
                  label="Published"
                  description="Show this profile publicly"
                />
                <ToggleField
                  name="isFeatured"
                  checked={form.isFeatured}
                  onChange={updateField}
                  label="Featured"
                  description="Give this profile priority"
                  icon={<FiAward />}
                />
              </div>

              <div className="mt-6 flex flex-col-reverse gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeForm}
                  disabled={saving}
                  className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-black text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-700 px-6 py-3 text-sm font-black text-white hover:bg-orange-600 disabled:cursor-wait disabled:opacity-60"
                >
                  {saving ? (
                    <FiRefreshCw className="animate-spin" />
                  ) : editingRecord ? (
                    <FiEdit2 />
                  ) : (
                    <FiPlus />
                  )}
                  {saving
                    ? "Saving..."
                    : editingRecord
                      ? "Update Alumni"
                      : "Create Alumni"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      <style jsx>{`
        :global(.form-input) {
          width: 100%;
          border: 1px solid rgb(226 232 240);
          border-radius: 0.75rem;
          padding: 0.75rem 1rem;
          color: rgb(15 23 42);
          outline: none;
        }
        :global(.form-input:focus) {
          border-color: rgb(234 88 12);
          box-shadow: 0 0 0 3px rgb(255 237 213);
        }
      `}</style>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-black uppercase tracking-widest text-slate-400">
        {label}
      </p>
      <p className="mt-2 text-3xl font-black text-slate-950">{value}</p>
    </div>
  );
}

function StatusBadge({ active }) {
  return (
    <span
      className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wider ${
        active
          ? "bg-emerald-500 text-white"
          : "bg-slate-700 text-slate-100"
      }`}
    >
      {active ? "Published" : "Draft"}
    </span>
  );
}

function FormField({ label, children, required = false, wide = false }) {
  return (
    <label className={wide ? "md:col-span-2" : ""}>
      <span className="mb-2 block text-sm font-black text-slate-700">
        {label}
        {required ? <span className="text-red-600"> *</span> : null}
      </span>
      {children}
    </label>
  );
}

function ToggleField({
  name,
  checked,
  onChange,
  label,
  description,
  icon = null,
}) {
  return (
    <label className="flex flex-1 cursor-pointer items-center gap-3 rounded-xl bg-white p-3">
      <input
        name={name}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="h-5 w-5 rounded border-slate-300 text-orange-700 focus:ring-orange-600"
      />
      <span>
        <span className="flex items-center gap-2 text-sm font-black text-slate-800">
          {icon}
          {label}
        </span>
        <span className="text-xs text-slate-500">{description}</span>
      </span>
    </label>
  );
}
