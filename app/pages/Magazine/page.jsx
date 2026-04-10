"use client";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import dynamic from "next/dynamic";
import {
  BookOpen, Search, Calendar, FileText, Trophy, Users, Sparkles,
  Clock, Filter, Grid3x3, List, TrendingUp, Award, Star,
  ChevronDown, ChevronUp, Eye, Heart, Share2, Download,
  Bookmark, BookmarkCheck, AlertCircle, X, Loader2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { IoSparkles } from 'react-icons/io5';
import { CircularProgress, Box, Stack } from '@mui/material';

// Dynamic import for BookReader
const BookReader = dynamic(() => import("../../components/book/BookReader"), {
  loading: () => (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
      <Loader2 className="w-12 h-12 text-amber-500 animate-spin" />
    </div>
  ),
  ssr: false
});

// Scroll to Top Component
const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.pageYOffset > 300);
    };
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-40 p-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110"
        >
          <ChevronUp size={20} />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

// Enhanced Magazine Card Component
const MagazineCard = ({ issue, onOpen, viewMode = "grid" }) => {
  const [isBookmarked, setIsBookmarked] = useState(false);

  const handleBookmark = (e) => {
    e.stopPropagation();
    setIsBookmarked(!isBookmarked);
    const saved = JSON.parse(localStorage.getItem('bookmarked_magazines') || '[]');
    if (!isBookmarked) {
      saved.push(issue.id);
    } else {
      const index = saved.indexOf(issue.id);
      if (index > -1) saved.splice(index, 1);
    }
    localStorage.setItem('bookmarked_magazines', JSON.stringify(saved));
  };

  const handleShare = async (e) => {
    e.stopPropagation();
    if (navigator.share) {
      try {
        await navigator.share({
          title: issue.title,
          text: `Check out ${issue.title} magazine from Kinyui Boys!`,
          url: window.location.href
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (viewMode === "list") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onClick={() => onOpen(issue)}
        className="bg-white rounded-xl shadow-md cursor-pointer overflow-hidden border border-slate-200"
      >
        <div className="flex flex-col sm:flex-row">
          <div className="relative w-full sm:w-48 h-48 sm:h-auto bg-slate-100 flex items-center justify-center">
            {issue.thumbnail ? (
              <Image
                src={issue.thumbnail}
                alt={issue.title}
                fill
                className="object-cover"
              />
            ) : (
              <BookOpen className="w-12 h-12 text-slate-500" />
            )}
          </div>

          <div className="flex-1 p-5">
            <div className="flex items-start justify-between">
              <div>
                {/* BLACK TEXT TITLE */}
                <h3 className="text-xl font-black text-slate-950 mb-1">{issue.title}</h3>
                <div className="flex items-center gap-3 text-sm text-slate-700 mb-3 font-bold">
                  <span className="flex items-center gap-1">
                    <Calendar size={14} />
                    {issue.year}
                  </span>
                  <span className="flex items-center gap-1">
                    <FileText size={14} />
                    {issue.pages || "~80"} pages
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button onClick={handleBookmark} className={`p-1.5 ${isBookmarked ? 'text-amber-600' : 'text-slate-900'}`}>
                  {isBookmarked ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
                </button>
                <button onClick={handleShare} className="p-1.5 text-slate-900">
                  <Share2 size={18} />
                </button>
              </div>
            </div>

            {/* BLACK TEXT DESCRIPTION */}
            <p className="text-slate-900 text-sm font-bold line-clamp-2 mb-3">
              {issue.description}
            </p>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-slate-900 font-black">
                <Eye size={12} />
                <span>{issue.views || 0} views</span>
                <span className="w-1 h-1 bg-slate-950 rounded-full" />
                <Download size={12} />
                <span>{issue.downloads || 0} downloads</span>
              </div>
              
              <span className="text-xs font-black text-slate-950 uppercase tracking-wider">
                Read Now →
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={() => onOpen(issue)}
      className="bg-white rounded-2xl shadow-lg cursor-pointer overflow-hidden border border-slate-200"
    >
      <div className="relative h-64 bg-slate-100 flex items-center justify-center">
        {issue.thumbnail ? (
          <Image src={issue.thumbnail} alt={issue.title} fill className="object-cover" />
        ) : (
          <BookOpen className="w-16 h-16 text-slate-500" />
        )}
        <div className="absolute top-3 left-3 bg-slate-950 rounded-lg px-2 py-1">
          <span className="text-white text-xs font-black">{issue.year}</span>
        </div>
      </div>

      <div className="p-5">
        {/* BLACK TEXT TITLE */}
        <h3 className="font-black text-slate-950 text-lg mb-2 line-clamp-1">
          {issue.title}
        </h3>
        
        {/* BLACK TEXT DESCRIPTION */}
        <p className="text-slate-900 text-sm font-bold line-clamp-2 mb-4">
          {issue.description || "Annual magazine showcasing school achievements, events, and student stories."}
        </p>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3 text-xs text-slate-950 font-black">
            <span className="flex items-center gap-1"><Eye size={12} /> {issue.views || 0}</span>
            <span className="flex items-center gap-1"><Download size={12} /> {issue.downloads || 0}</span>
          </div>
          <div className="flex gap-2">
            <button onClick={handleBookmark} className={isBookmarked ? 'text-amber-600' : 'text-slate-950'}>
               {isBookmarked ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
            </button>
            <button onClick={handleShare} className="text-slate-950">
               <Share2 size={18} />
            </button>
          </div>
        </div>
        
        {issue.pdfUrl && (
          <a
            href={issue.pdfUrl}
            download
            onClick={e => e.stopPropagation()}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-950 text-white rounded-xl font-black text-xs hover:bg-black transition-colors"
          >
            <Download size={16} /> DOWNLOAD PDF
          </a>
        )}
      </div>
    </motion.div>
  );
};
// Feature Card Component
const FeatureCard = ({ icon: Icon, title, description, color }) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="bg-white rounded-2xl p-6 text-center shadow-md hover:shadow-xl transition-all"
  >
    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mx-auto mb-4`}>
      <Icon className="text-white" size={24} />
    </div>
    <h3 className="font-black text-slate-900 mb-2">{title}</h3>
    <p className="text-slate-600 text-sm">{description}</p>
  </motion.div>
);

// Main Component
export default function MagazineArchive() {
  const [magazines, setMagazines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedYear, setSelectedYear] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("year");
  const [sortOrder, setSortOrder] = useState("desc");
  const [showFilters, setShowFilters] = useState(false);
  const [stats, setStats] = useState({
    totalIssues: 0,
    totalPages: 0,
    earliestYear: null,
    latestYear: null
  });

  useEffect(() => {
    const fetchMagazines = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/school');
        const data = await response.json();
        
        console.log("Fetched school data:", data); // Debug log
        
        let magazinesArray = [];
        
        // Extract magazine from the school response
        if (data.success && data.school) {
          // Check if magazine exists in the school object
          if (data.school.magazine) {
            // Single magazine object
            magazinesArray = [data.school.magazine];
          } else if (data.school.Magazine) {
            // Capital M Magazine (from Prisma include)
            magazinesArray = [data.school.Magazine];
          }
        }
        
        // Handle array of magazines if school has multiple (future proofing)
        if (data.magazines && Array.isArray(data.magazines)) {
          magazinesArray = data.magazines;
        }
        
        console.log("Processed magazines:", magazinesArray); // Debug log
        
        setMagazines(magazinesArray);

        // Calculate stats
        if (magazinesArray.length > 0) {
          const years = magazinesArray.map(m => m.year).filter(y => y);
          const totalPages = magazinesArray.reduce((sum, m) => sum + (m.pages || 80), 0);
          setStats({
            totalIssues: magazinesArray.length,
            totalPages: totalPages,
            earliestYear: years.length ? Math.min(...years) : null,
            latestYear: years.length ? Math.max(...years) : null
          });
        } else {
          setStats({
            totalIssues: 0,
            totalPages: 0,
            earliestYear: null,
            latestYear: null
          });
        }
      } catch (error) {
        console.error('Error fetching school/magazines:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMagazines();
  }, []);

  // Filter and sort magazines
  const filteredAndSortedMagazines = useMemo(() => {
    let filtered = [...magazines];

    if (searchQuery) {
      filtered = filtered.filter(m =>
        m.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.year?.toString().includes(searchQuery)
      );
    }

    if (selectedYear !== "all") {
      filtered = filtered.filter(m => m.year === parseInt(selectedYear));
    }

    filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case "year":
          comparison = (a.year || 0) - (b.year || 0);
          break;
        case "title":
          comparison = (a.title || "").localeCompare(b.title || "");
          break;
        case "views":
          comparison = (a.views || 0) - (b.views || 0);
          break;
        case "downloads":
          comparison = (a.downloads || 0) - (b.downloads || 0);
          break;
        default:
          comparison = (a.year || 0) - (b.year || 0);
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });

    return filtered;
  }, [magazines, searchQuery, selectedYear, sortBy, sortOrder]);

  const years = useMemo(() => {
    const uniqueYears = [...new Set(magazines.map(m => m.year).filter(y => y))];
    return uniqueYears.sort((a, b) => b - a);
  }, [magazines]);

  if (loading) {
    return (
      <Box className="min-h-[70vh] flex items-center justify-center p-4 bg-slate-900">
        <Stack spacing={2} alignItems="center" className="w-full transition-all duration-500">
          <Box className="relative flex items-center justify-center scale-90 sm:scale-110">
            <CircularProgress
              variant="determinate"
              value={100}
              size={48}
              thickness={4.5}
              sx={{ color: '#334155' }}
            />
            <CircularProgress
              variant="indeterminate"
              disableShrink
              size={48}
              thickness={4.5}
              sx={{
                color: '#f59e0b',
                animationDuration: '1000ms',
                position: 'absolute',
                '& .MuiCircularProgress-circle': {
                  strokeLinecap: 'round',
                },
              }}
            />
            <Box className="absolute">
              <IoSparkles className="text-amber-500 text-sm animate-pulse" />
            </Box>
          </Box>
          <div className="text-center px-4">
            <p className="text-slate-300 font-medium text-sm sm:text-base tracking-tight">
              Loading School Magazines
            </p>
            <p className="text-slate-500 text-[10px] sm:text-xs uppercase tracking-widest mt-1 font-bold">
              Kinyui Boys Senior School
            </p>
          </div>
        </Stack>
      </Box>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-slate-800 text-white overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="/hero/kin.jpeg" 
            alt="Kinyui Hero" 
            className="w-full h-full object-cover opacity-20" 
          />
        </div>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
          <img 
            src="/hero/kin.jpeg" 
            alt="Kinyui Logo" 
            className="w-1/2 max-w-xs opacity-5" 
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20 sm:py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/10 rounded-full px-4 py-1.5 mb-6">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span className="text-sm font-bold tracking-wide">Digital Archive</span>
            </div>
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black mb-6 tracking-tight text-slate-100">
              School Magazine
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500">
                Archive
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-slate-200 max-w-2xl mx-auto leading-relaxed">
              Discover the rich history and achievements of Kinyui Boys through our digital magazine collection.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-16 flex flex-wrap justify-center gap-12"
          >
            <div className="text-center group">
              <div className="text-4xl font-black text-white group-hover:text-amber-400 transition-colors">
                {stats.totalIssues}
              </div>
              <div className="text-slate-200/60 text-xs uppercase tracking-widest font-bold mt-1">Issues</div>
            </div>
            <div className="text-center group">
              <div className="text-4xl font-black text-white group-hover:text-amber-400 transition-colors">
                {stats.totalPages}+
              </div>
              <div className="text-slate-200/60 text-xs uppercase tracking-widest font-bold mt-1">Pages</div>
            </div>
            <div className="text-center group">
              <div className="text-4xl font-black text-white group-hover:text-amber-400 transition-colors">
                {stats.earliestYear || "-"} {stats.latestYear && stats.earliestYear !== stats.latestYear ? `- ${stats.latestYear}` : ""}
              </div>
              <div className="text-slate-200/60 text-xs uppercase tracking-widest font-bold mt-1">Timeline</div>
            </div>
          </motion.div>
        </div>
      </section>
{/* Search & Filter Section */}
<section className="sticky top-0 z-30 bg-white shadow-md py-4 px-2 sm:px-6">
  <div className="max-w-7xl mx-auto">
    <div className="flex flex-col sm:flex-row gap-4 w-full">
      
      {/* Search Input */}
      <div className="relative flex-1 min-w-[200px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-black" size={18} />
        <input
          type="text"
          placeholder="Search by title, year, or description..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 text-black font-semibold rounded-xl text-sm focus:outline-none focus:border-black focus:ring-2 focus:ring-black/20 transition-all"
        />
      </div>

      {/* Buttons */}
      <div className="flex gap-2 flex-wrap">
        
        {/* Filter Toggle */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="px-4 py-2.5 bg-white border border-gray-300 text-black font-semibold rounded-xl text-sm flex items-center gap-2 hover:bg-gray-100 transition-all"
        >
          <Filter size={16} className="text-black" />
          Filters
          {showFilters ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>

        {/* View Mode */}
        <div className="flex bg-gray-100 rounded-xl p-1 border border-gray-300">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded-lg transition-all ${
              viewMode === "grid"
                ? "bg-black text-white font-bold shadow-sm"
                : "text-black"
            }`}
          >
            <Grid3x3 size={18} />
          </button>

          <button
            onClick={() => setViewMode("list")}
            className={`p-2 rounded-lg transition-all ${
              viewMode === "list"
                ? "bg-black text-white font-bold shadow-sm"
                : "text-black"
            }`}
          >
            <List size={18} />
          </button>
        </div>
      </div>
    </div>

    {/* Filters */}
    <AnimatePresence>
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-4 pt-4 border-t border-gray-300"
        >
          <div className="flex flex-wrap gap-4">
            
            {/* Year */}
            <div className="flex-1 min-w-[150px]">
              <label className="block text-xs font-semibold text-black mb-1">
                Year
              </label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-gray-300 text-black font-semibold rounded-lg text-sm focus:outline-none focus:border-black"
              >
                <option value="all">All Years</option>
                {years.map((year) => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div className="flex-1 min-w-[150px]">
              <label className="block text-xs font-semibold text-black mb-1">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-gray-300 text-black font-semibold rounded-lg text-sm focus:outline-none focus:border-black"
              >
                <option value="year">Year</option>
                <option value="title">Title</option>
                <option value="views">Most Viewed</option>
                <option value="downloads">Most Downloaded</option>
              </select>
            </div>

            {/* Order */}
            <div className="flex-1 min-w-[150px]">
              <label className="block text-xs font-semibold text-black mb-1">
                Order
              </label>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-gray-300 text-black font-semibold rounded-lg text-sm focus:outline-none focus:border-black"
              >
                <option value="desc">Newest First</option>
                <option value="asc">Oldest First</option>
              </select>
            </div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
</section>

      {/* Magazine Grid/List */}
      <section className="py-12 px-4 sm:px-6 max-w-7xl mx-auto bg-white rounded-2xl">
        {filteredAndSortedMagazines.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <BookOpen className="mx-auto text-slate-500 mb-4" size={64} />
            <h3 className="text-xl font-bold text-slate-900 mb-2">No magazines found</h3>
            <p className="text-slate-900">Try adjusting your search or filter criteria</p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedYear("all");
              }}
              className="mt-4 px-4 py-2 bg-amber-600 text-white rounded-lg text-sm font-bold hover:bg-amber-700 transition-all"
            >
              Clear Filters
            </button>
          </motion.div>
        ) : (
          <div className={viewMode === "grid" 
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" 
            : "space-y-4"
          }>
            {filteredAndSortedMagazines.map((issue, index) => (
              <MagazineCard
                key={issue.id || index}
                issue={issue}
                onOpen={setSelectedIssue}
                viewMode={viewMode}
              />
            ))}
          </div>
        )}
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900">Why Read Our Magazine?</h2>
            <p className="text-slate-900 mt-2">Every edition captures the essence of Kinyui Boys</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <FeatureCard
              icon={Trophy}
              title="Achievements"
              description="Academic and sports excellence recognized and celebrated"
              color="from-amber-600 to-orange-600"
            />
            <FeatureCard
              icon={Users}
              title="Student Stories"
              description="Inspiring journeys and success stories of our young men"
              color="from-orange-600 to-red-600"
            />
            <FeatureCard
              icon={Calendar}
              title="Events Coverage"
              description="Memorable moments from school events and activities"
              color="from-amber-700 to-amber-600"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-br from-amber-600 to-orange-600 rounded-3xl p-10 shadow-2xl"
          >
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
          </motion.div>
        </div>
      </section>

      {/* Modals */}
      {selectedIssue && (
        <BookReader issue={selectedIssue} onClose={() => setSelectedIssue(null)} />
      )}

      <ScrollToTop />
    </div>
  );
}