'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import {
  FiArchive,
  FiAward,
  FiChevronLeft,
  FiBookOpen,
  FiChevronRight,
  FiFilter,
  FiGrid,
  FiImage,
  FiLayers,
  FiRefreshCw,
  FiSearch,
  FiShield,
  FiUsers,
  FiX,
} from 'react-icons/fi';

const CATEGORY_META = {
  CBC: { label: 'CBC Department', color: 'bg-blue-50 text-blue-700 border-blue-100', icon: FiBookOpen },
  EIGHT_FOUR_FOUR: { label: '8-4-4 Department', color: 'bg-amber-50 text-amber-700 border-amber-100', icon: FiAward },
  TEACHING: { label: 'Teaching Department', color: 'bg-emerald-50 text-emerald-700 border-emerald-100', icon: FiUsers },
  SUPPORT: { label: 'Support / Non-Teaching', color: 'bg-slate-50 text-slate-700 border-slate-100', icon: FiShield },
};

const LEADERSHIP_ORDER = {
  Principal: 1,
  'Deputy Principal': 2,
  'Senior Teacher': 3,
  'Head of Department': 4,
  HOD: 4,
  'Assistant Head of Department': 5,
  AHOD: 5,
};

const BRAND_LOGO = '/seo/kinyui.png';

const getLeadershipRank = (staff) => {
  const role = (staff?.role || '').toLowerCase();
  const position = (staff?.position || '').toLowerCase();

  if (role === 'principal' || position === 'principal') return 1;
  if (role === 'deputy principal' && (position.includes('academic') || position.includes('academics'))) return 2;
  if (role === 'deputy principal' && (position.includes('admin') || position.includes('administration'))) return 3;
  if (role === 'deputy principal' || position.includes('deputy principal')) return 4;
  if (role === 'senior teacher' || position.includes('senior teacher')) return 5;
  if (role === 'hod' || (role.includes('head of department') && !role.includes('assistant'))) return 6;
  if (position.includes('head of department') && !position.includes('assistant')) return 6;

  return LEADERSHIP_ORDER[staff?.role] || 99;
};

const isLeadershipProfile = (staff) => {
  const role = (staff?.role || '').toLowerCase();
  const position = (staff?.position || '').toLowerCase();
  return (
    role === 'principal' ||
    role === 'deputy principal' ||
    role === 'senior teacher' ||
    role === 'hod' ||
    (role.includes('head of department') && !role.includes('assistant')) ||
    position.includes('principal') ||
    position.includes('senior teacher') ||
    (position.includes('head of department') && !position.includes('assistant'))
  );
};

const generateSlug = (name, id) =>
  `${(name || 'staff')
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()}-${id}`;

const getDepartmentImages = (department) => {
  const images = Array.isArray(department?.images)
    ? department.images.map((image) => image.url).filter(Boolean)
    : [];

  if (department?.image && !images.includes(department.image)) {
    images.unshift(department.image);
  }

  return images.length ? images : ['/teachers.png'];
};

const normalizeList = (value) => {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (typeof value === 'string') return value.split(',').map((item) => item.trim()).filter(Boolean);
  return [];
};

function LeadershipCard({ staff }) {
  const href = `/pages/staff/${staff.id}/${generateSlug(staff.name, staff.id)}`;

  return (
    <article className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
      <div className="aspect-[4/3] overflow-hidden bg-slate-100">
        <img
          src={staff.image || '/male.png'}
          alt={staff.name}
          className="h-full w-full object-cover object-top"
        />
      </div>
      <div className="p-5">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-blue-700">
          <FiShield size={12} />
          Leadership
        </div>
        <h3 className="text-lg font-black text-slate-900">{staff.name}</h3>
        <p className="mt-1 text-sm font-bold text-slate-500">{staff.position || staff.role}</p>
        {staff.department && <p className="mt-1 text-xs font-semibold text-slate-400">{staff.department}</p>}
        {staff.bio && <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-slate-600">{staff.bio}</p>}
        <Link
          href={href}
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-black uppercase tracking-widest text-white"
        >
          View Profile <FiChevronRight />
        </Link>
      </div>
    </article>
  );
}

function DepartmentCard({ department, onSelect, selected }) {
  const meta = CATEGORY_META[department.category] || CATEGORY_META.TEACHING;
  const Icon = meta.icon;
  const images = getDepartmentImages(department);
  const extra = typeof department.extra === 'object' && department.extra ? department.extra : {};

  return (
    <article
      className={`overflow-hidden rounded-2xl border bg-white shadow-sm transition ${
        selected ? 'border-amber-300 ring-4 ring-amber-100' : 'border-slate-100 hover:border-slate-200'
      }`}
      onClick={() => onSelect(department)}
    >
      <div className="grid h-56 grid-cols-3 gap-1 bg-slate-100">
        <img src={images[0]} alt={department.name} className="col-span-2 h-full w-full object-cover" />
        <div className="grid gap-1">
          <img src={images[1] || images[0]} alt="" className="h-full w-full object-cover" />
          <div className="relative h-full w-full overflow-hidden">
            <img src={images[2] || images[0]} alt="" className="h-full w-full object-cover" />
            {images.length > 3 && (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-950/60 text-sm font-black text-white">
                +{images.length - 2}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="p-5">
        <div className={`mb-4 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-widest ${meta.color}`}>
          <Icon size={12} />
          {meta.label}
        </div>
        <h3 className="text-xl font-black text-slate-900">{department.name}</h3>
        <p className="mt-3 line-clamp-3 min-h-[4.75rem] text-sm leading-relaxed text-slate-600">
          {department.description || 'Department information will be updated soon.'}
        </p>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-slate-50 p-3">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">HOD</p>
            <p className="mt-1 truncate text-sm font-bold text-slate-800">{department.headName || 'Available soon'}</p>
          </div>
          <div className="rounded-xl bg-slate-50 p-3">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Staff Count</p>
            <p className="mt-1 text-sm font-bold text-slate-800">{department.staffCount || 0}</p>
          </div>
        </div>

        {normalizeList(extra.focusAreas).length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {normalizeList(extra.focusAreas).slice(0, 3).map((area) => (
              <span key={area} className="rounded-full bg-slate-50 px-3 py-1 text-[11px] font-bold text-slate-500">
                {area}
              </span>
            ))}
          </div>
        )}

        <Link
          href={`/pages/staff/departments/${department.id}`}
          onClick={(event) => event.stopPropagation()}
          className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-xs font-black uppercase tracking-widest text-white"
        >
          View Department <FiChevronRight />
        </Link>
      </div>
    </article>
  );
}

function DepartmentModal({ department, onClose }) {
  const images = getDepartmentImages(department);
  const meta = CATEGORY_META[department.category] || CATEGORY_META.TEACHING;
  const Icon = meta.icon;
  const extra = typeof department.extra === 'object' && department.extra ? department.extra : {};
  const subjects = normalizeList(extra.subjects);
  const focusAreas = normalizeList(extra.focusAreas);

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="max-h-[92vh] w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-2xl" onClick={(event) => event.stopPropagation()}>
        <div className="flex items-start justify-between bg-slate-900 p-5 text-white">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest">
              <Icon size={12} />
              {meta.label}
            </div>
            <h2 className="text-2xl font-black">{department.name}</h2>
            <p className="mt-1 text-sm text-white/60">{department.description || 'Department overview'}</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-xl bg-white/10 p-2">
            <FiX />
          </button>
        </div>
        <div className="max-h-[calc(92vh-150px)] overflow-y-auto p-5">
          <div className="grid gap-3 sm:grid-cols-2">
            {images.map((image, index) => (
              <img key={`${image}-${index}`} src={image} alt={`${department.name} ${index + 1}`} className="h-56 w-full rounded-xl object-cover" />
            ))}
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">HOD</p>
              <p className="mt-1 font-bold text-slate-900">{department.headName || 'Available soon'}</p>
            </div>
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Assistant HOD</p>
              <p className="mt-1 font-bold text-slate-900">{department.assistantHeadName || 'Available soon'}</p>
            </div>
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Staff Count</p>
              <p className="mt-1 font-bold text-slate-900">{department.staffCount || 0}</p>
            </div>
          </div>

          {(focusAreas.length > 0 || subjects.length > 0 || extra.location) && (
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {focusAreas.length > 0 && (
                <div className="rounded-xl border border-slate-100 p-4">
                  <h3 className="text-sm font-black text-slate-900">Focus Areas</h3>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {focusAreas.map((area) => <span key={area} className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">{area}</span>)}
                  </div>
                </div>
              )}
              {subjects.length > 0 && (
                <div className="rounded-xl border border-slate-100 p-4">
                  <h3 className="text-sm font-black text-slate-900">Subjects / Services</h3>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {subjects.map((subject) => <span key={subject} className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">{subject}</span>)}
                  </div>
                </div>
              )}
              {extra.location && (
                <div className="rounded-xl border border-slate-100 p-4 md:col-span-2">
                  <h3 className="text-sm font-black text-slate-900">Department Location</h3>
                  <p className="mt-2 text-sm font-semibold text-slate-600">{extra.location}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function TeacherMiniCard({ teacher }) {
  const image = teacher?.image || (teacher?.gender === 'female' ? '/female.png' : '/male.png');

  return (
    <article className="w-[260px] shrink-0 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm sm:w-[300px]">
      <div className="relative h-48 bg-slate-100">
        <img src={image} alt={teacher.name} className="h-full w-full object-cover object-top" />
        <div className="absolute left-3 top-3 rounded-full bg-slate-950/80 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white">
          Teacher
        </div>
      </div>
      <div className="p-5">
        <h3 className="text-lg font-black text-slate-900">{teacher.name}</h3>
        <p className="mt-1 text-sm font-bold text-amber-700">{teacher.subjectOffered || teacher.position || 'Subject teacher'}</p>
        <p className="mt-3 line-clamp-3 min-h-[4.5rem] text-sm leading-relaxed text-slate-600">
          {teacher.bio || `${teacher.name} serves in the ${teacher.department || 'selected'} department at Kinyui Boys Senior School.`}
        </p>
      </div>
    </article>
  );
}

function DepartmentTeacherCarousel({ department }) {
  const scrollRef = useRef(null);
  const teachers = Array.isArray(department?.teachers) ? department.teachers : [];

  if (!department) return null;

  const scroll = (direction) => {
    const node = scrollRef.current;
    if (!node) return;
    node.scrollBy({ left: direction * Math.min(node.clientWidth, 680), behavior: 'smooth' });
  };

  return (
    <section className="mb-8 overflow-hidden rounded-[1.5rem] border border-slate-100 bg-white p-4 shadow-sm sm:p-5">
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-amber-700">Selected Department</p>
          <h3 className="mt-1 text-2xl font-black text-slate-900">{department.name}</h3>
          <p className="mt-1 text-sm font-medium text-slate-500">
            {teachers.length ? `${teachers.length} teacher${teachers.length === 1 ? '' : 's'} mapped to this department` : 'Teacher mapping will appear here once records are added.'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => scroll(-1)}
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-700"
            aria-label="Previous teachers"
          >
            <FiChevronLeft />
          </button>
          <button
            type="button"
            onClick={() => scroll(1)}
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-700"
            aria-label="Next teachers"
          >
            <FiChevronRight />
          </button>
          <Link
            href={`/pages/staff/departments/${department.id}`}
            className="hidden rounded-xl bg-slate-900 px-4 py-3 text-xs font-black uppercase tracking-widest text-white sm:inline-flex"
          >
            Full Page
          </Link>
        </div>
      </div>

      {teachers.length > 0 ? (
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {teachers.map((teacher) => (
            <TeacherMiniCard key={teacher.id} teacher={teacher} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center">
          <FiUsers className="mx-auto text-4xl text-slate-300" />
          <h4 className="mt-3 text-lg font-black text-slate-900">No teachers mapped yet</h4>
          <p className="mt-2 text-sm text-slate-500">Add teacher records in the dashboard and link them to this department.</p>
        </div>
      )}
    </section>
  );
}

export default function StaffDirectory() {
  const [leadership, setLeadership] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [selectedDepartment, setSelectedDepartment] = useState(null);

  const fetchData = async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);
      setError('');

      const [staffResponse, departmentResponse] = await Promise.all([
        fetch('/api/staff'),
        fetch('/api/staff/departments?includeTeachers=1'),
      ]);

      const [staffData, departmentData] = await Promise.all([
        staffResponse.json(),
        departmentResponse.json(),
      ]);

      if (!staffResponse.ok || !staffData.success) {
        throw new Error(staffData.error || 'Failed to load leadership profiles');
      }
      if (!departmentResponse.ok || !departmentData.success) {
        throw new Error(departmentData.error || 'Failed to load departments');
      }

      const visibleLeadership = (staffData.staff || [])
        .filter(isLeadershipProfile)
        .sort((a, b) => {
          const roleA = getLeadershipRank(a);
          const roleB = getLeadershipRank(b);
          if (roleA !== roleB) return roleA - roleB;
          return (a.name || '').localeCompare(b.name || '');
        });

      setLeadership(visibleLeadership);
      setDepartments(departmentData.departments || []);
    } catch (err) {
      console.error('Staff page load error:', err);
      setError(err.message || 'Unable to load staff information');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredDepartments = useMemo(() => {
    const search = query.trim().toLowerCase();
    return departments.filter((department) => {
      const matchesCategory = category === 'all' || department.category === category;
      const searchable = [
        department.name,
        department.category,
        department.description,
        department.headName,
        department.assistantHeadName,
      ].filter(Boolean).join(' ').toLowerCase();
      return matchesCategory && (!search || searchable.includes(search));
    });
  }, [departments, query, category]);

  const totalGroupedStaff = departments.reduce((sum, department) => sum + (Number(department.staffCount) || 0), 0);
  const groupedDepartments = useMemo(() => {
    return Object.entries(CATEGORY_META)
      .map(([key, meta]) => ({
        key,
        meta,
        departments: filteredDepartments.filter((department) => department.category === key),
      }))
      .filter((group) => group.departments.length > 0);
  }, [filteredDepartments]);

  useEffect(() => {
    if (loading || filteredDepartments.length === 0) return;
    const selectedStillVisible = selectedDepartment
      ? filteredDepartments.some((department) => department.id === selectedDepartment.id)
      : false;
    if (!selectedStillVisible) {
      setSelectedDepartment(filteredDepartments[0]);
    }
  }, [filteredDepartments, loading, selectedDepartment]);

  return (
    <div className="min-h-screen bg-slate-50">
      <section className="relative overflow-hidden bg-slate-950 px-4 py-14 text-white sm:px-6 lg:px-8">
        <img
          src={BRAND_LOGO}
          alt=""
          className="pointer-events-none absolute -right-12 -top-12 h-64 w-64 object-contain opacity-[0.04]"
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(245,158,11,0.18),transparent_35%),radial-gradient(circle_at_90%_20%,rgba(14,165,233,0.12),transparent_30%)]" />
        <div className="mx-auto max-w-7xl">
          <div className="relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div className="mb-5 inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-3 py-2">
                <img src={BRAND_LOGO} alt="Kinyui Boys Senior School logo" className="h-9 w-9 rounded-xl object-contain bg-white/10 p-1" />
                <p className="text-[11px] font-black uppercase tracking-[0.3em] text-amber-200">Kinyui Boys Senior School</p>
              </div>
              <h1 className="mt-4 text-3xl font-black tracking-tight sm:text-5xl">Staff Leadership & Departments</h1>
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-300 sm:text-base">
                Public staff information is privacy-first: school leaders are shown as individual profiles while teaching and support teams are presented as department collections.
              </p>
            </div>
            <button
              type="button"
              onClick={() => fetchData(true)}
              disabled={refreshing}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-xs font-black uppercase tracking-widest text-slate-950 disabled:opacity-60"
            >
              <FiRefreshCw className={refreshing ? 'animate-spin' : ''} />
              Refresh
            </button>
          </div>

          <div className="relative mt-10 grid gap-3 sm:grid-cols-3">
            {[
              { icon: FiShield, value: leadership.length, label: 'Leadership Profiles' },
              { icon: FiArchive, value: departments.length, label: 'Departments' },
              { icon: FiUsers, value: totalGroupedStaff, label: 'Grouped Staff' },
            ].map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <stat.icon className="text-2xl text-blue-300" />
                <p className="mt-3 text-3xl font-black">{stat.value}</p>
                <p className="text-[10px] font-black uppercase tracking-widest text-white/40">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-8 rounded-2xl border border-red-100 bg-red-50 p-5 text-sm font-bold text-red-700">
            {error}
          </div>
        )}

        <section>
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white">
              <FiShield />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900">Leadership Profiles</h2>
              <p className="text-sm text-slate-500">Principal, deputies, senior teacher, and HOD leadership profiles.</p>
            </div>
          </div>

          {loading ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {[1, 2, 3, 4].map((item) => <div key={item} className="h-80 animate-pulse rounded-2xl bg-white" />)}
            </div>
          ) : leadership.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {leadership.map((staff) => <LeadershipCard key={staff.id} staff={staff} />)}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center">
              <FiShield className="mx-auto text-4xl text-slate-300" />
              <h3 className="mt-3 text-lg font-black text-slate-900">No leadership profiles available</h3>
            </div>
          )}
        </section>

        <section className="mt-12">
          <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white">
                <FiGrid />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-900">Department Collections</h2>
                <p className="text-sm text-slate-500">Teaching and support staff are represented by department groups.</p>
              </div>
            </div>

            <div className="grid gap-3 rounded-2xl border border-slate-100 bg-white p-3 shadow-sm sm:grid-cols-[1fr_230px] lg:w-[620px]">
              <div className="relative">
                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search departments..."
                  className="w-full rounded-xl bg-slate-50 py-3 pl-11 pr-4 text-sm font-bold text-slate-700 outline-none focus:bg-white"
                />
              </div>
              <div className="relative">
                <FiFilter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <select
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                  className="w-full appearance-none rounded-xl bg-slate-50 py-3 pl-11 pr-4 text-xs font-black uppercase tracking-widest text-slate-700 outline-none focus:bg-white"
                >
                  <option value="all">All Types</option>
                  {Object.entries(CATEGORY_META).map(([key, meta]) => (
                    <option key={key} value={key}>{meta.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {[1, 2, 3].map((item) => <div key={item} className="h-96 animate-pulse rounded-2xl bg-white" />)}
            </div>
          ) : groupedDepartments.length > 0 ? (
            <div className="space-y-8">
              <DepartmentTeacherCarousel department={selectedDepartment} />
              {groupedDepartments.map(({ key, meta, departments: groupDepartments }) => {
                const Icon = meta.icon;
                return (
                  <div key={key} className="rounded-[1.5rem] border border-slate-100 bg-white/70 p-4 shadow-sm sm:p-5">
                    <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`flex h-11 w-11 items-center justify-center rounded-2xl border ${meta.color}`}>
                          <Icon />
                        </div>
                        <div>
                          <h3 className="text-lg font-black text-slate-900">{meta.label}s</h3>
                          <p className="text-sm font-medium text-slate-500">
                            {groupDepartments.length} collection{groupDepartments.length === 1 ? '' : 's'}
                          </p>
                        </div>
                      </div>
                      <span className="w-fit rounded-full bg-slate-100 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-slate-500">
                        Department Group
                      </span>
                    </div>
                    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                      {groupDepartments.map((department) => (
                        <DepartmentCard
                          key={department.id}
                          department={department}
                          onSelect={setSelectedDepartment}
                          selected={selectedDepartment?.id === department.id}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center">
              <FiImage className="mx-auto text-4xl text-slate-300" />
              <h3 className="mt-3 text-lg font-black text-slate-900">No departments found</h3>
              <p className="mt-2 text-sm text-slate-500">Try changing the search or department type filter.</p>
            </div>
          )}
        </section>
      </main>

    </div>
  );
}
