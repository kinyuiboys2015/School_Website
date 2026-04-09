"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import dynamic from "next/dynamic";
import {
  BookOpen, Calendar, X, ChevronLeft, ChevronRight,
  Download, Eye, Users, Trophy,
  Sparkles, Clock, FileText,
  ArrowUp, Star, Newspaper,
  Maximize, Minimize, ZoomIn, ZoomOut,
  Search
} from "lucide-react";
import Image from "next/image";

// ============================================================
// Dynamically import BookReader with NO SSR
// This prevents DOMMatrix error during server-side rendering
// ============================================================
const BookReader = dynamic(
() => import("../../components/book/BookReader.jsx"),  { 
    ssr: false,
    loading: () => (
      <div className="fixed inset-0 z-50 bg-[#1a1a2e] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white">Loading magazine reader...</p>
        </div>
      </div>
    )
  }
);

// ============================================================
// Scroll to Top Button
// ============================================================
export default function MagazinePage() {
  const [magazineData, setMagazineData] = useState([]);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedYear, setSelectedYear] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchMagazines() {
      setLoading(true);
      setError(null);
      try {
        // Fetch from /api/school (adjust if you have a dedicated /api/magazine)
        const res = await fetch('/api/school');
        const data = await res.json();
        // If your API returns an array of magazines, set directly. If only one, wrap in array.
        let magazines = [];
        if (data?.school?.magazine) {
          // If only one magazine (object), wrap in array
          magazines = Array.isArray(data.school.magazine)
            ? data.school.magazine
            : [data.school.magazine];
        }
        setMagazineData(magazines);
      } catch (err) {
        setError('Failed to load magazine data');
      } finally {
        setLoading(false);
      }
    }
    fetchMagazines();
  }, []);

  // Get unique years from data
  const years = [...new Set(magazineData.map(m => m.year))].sort((a, b) => b - a);

  // Filter magazines
  const filteredMagazines = magazineData.filter(issue => {
    const matchesYear = selectedYear === 'all' || issue.year === selectedYear;
    const matchesSearch = (issue.title?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (issue.description?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (issue.year?.toString() || '').includes(searchQuery);
    return matchesYear && matchesSearch;
  });

  // Total stats
  const totalIssues = magazineData.length;
  const totalPages = magazineData.reduce((sum, m) => sum + (m.pageCount || 0), 0);
  const earliestYear = magazineData.length > 0 ? Math.min(...magazineData.map(m => m.year)) : '';
  const latestYear = magazineData.length > 0 ? Math.max(...magazineData.map(m => m.year)) : '';

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-slate-600">Loading magazine...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* ═══════════════════════ HERO SECTION ═══════════════════════ */}
      <section className="relative min-h-[55vh] flex items-center overflow-hidden">
        <Image
          src="/hero/kin.jpeg"
          alt="School Magazine Archive"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/30" />
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-900/20 backdrop-blur-sm border border-amber-900/30 mb-6">
              <Newspaper className="text-amber-900" size={14} />
              <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">Annual Publication</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white leading-[1.05] tracking-tight mb-5">
              The Kinyui Echo
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-900 to-orange-400">
                Magazine Archive
              </span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-slate-300 max-w-2xl leading-relaxed">
              Our annual school magazine captures the spirit, achievements, and memories 
              of Kinyui Boys Senior School — celebrating excellence year after year.
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════ STATS BAR ═══════════════════════ */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Stats */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <BookOpen className="text-amber-900" size={18} />
                <span className="text-slate-700 font-bold">{totalIssues} Issues</span>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="text-amber-900" size={18} />
                <span className="text-slate-700 font-bold">{totalPages}+ Pages</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="text-amber-900" size={18} />
                <span className="text-slate-700 font-bold">{earliestYear} - {latestYear}</span>
              </div>
            </div>

            {/* Search & Filter */}
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  type="text"
                  placeholder="Search by year or keyword..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-100 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-amber-900 focus:ring-1 focus:ring-amber-900 transition-all"
                />
              </div>
              
              {/* Year Filter Dropdown */}
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="px-4 py-2 bg-slate-100 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-amber-900 cursor-pointer"
              >
                <option value="all">All Years</option>
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════ MAGAZINE GRID ═══════════════════════ */}
      <section className="py-16 px-4 sm:px-6 max-w-7xl mx-auto">
        {filteredMagazines.length === 0 ? (
          <div className="text-center py-20">
            <BookOpen className="mx-auto text-slate-300 mb-4" size={64} />
            <h3 className="text-xl font-bold text-slate-700 mb-2">No magazines found</h3>
            <p className="text-slate-500">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {filteredMagazines.map(issue => (
              <MagazineCard key={issue.id} issue={issue} onOpen={setSelectedIssue} />
            ))}
          </div>
        )}
      </section>

      {/* ═══════════════════════ FEATURE SECTION ═══════════════════════ */}
      <section className="py-16 px-4 sm:px-6 bg-gradient-to-br from-amber-50 to-orange-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900">Why Read Our Magazine?</h2>
            <p className="text-slate-600 mt-2">Every edition captures the essence of Kinyui Boys</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Trophy, title: "Achievements", desc: "Academic and sports excellence recognized" },
              { icon: Users, title: "Student Stories", desc: "Inspiring journeys of our young men" },
              { icon: Calendar, title: "Events Coverage", desc: "Memorable moments from school events" }
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="bg-white rounded-2xl p-6 text-center shadow-md">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-900 to-orange-600 flex items-center justify-center mx-auto mb-4">
                    <Icon className="text-white" size={24} />
                  </div>
                  <h3 className="font-black text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-slate-600 text-sm">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════ CTA SECTION ═══════════════════════ */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-br from-amber-600 to-orange-600 rounded-3xl p-10 shadow-2xl">
            <Sparkles className="text-white mx-auto mb-4" size={32} />
            <h2 className="text-2xl sm:text-3xl font-black text-white mb-3">
              Missing an Edition?
            </h2>
            <p className="text-amber-100 mb-6">
              Past magazines are being digitized. Check back soon for more issues!
            </p>
            <div className="inline-flex items-center gap-2 text-white/80 text-sm">
              <Clock size={14} />
              <span>New issues added annually after publication</span>
            </div>
          </div>
        </div>
      </section>

      {/* Book Reader Modal - Dynamically imported, only loads on client */}
      {selectedIssue && (
        <BookReader issue={selectedIssue} onClose={() => setSelectedIssue(null)} />
      )}

      {/* Scroll to Top */}
      <ScrollToTop />
    </div>
  );
}