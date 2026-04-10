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

// Dynamic import for BookReader (reduces initial bundle size)
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
  const [isHovered, setIsHovered] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [likes, setLikes] = useState(issue.likes || 0);
  const [isLiked, setIsLiked] = useState(false);

  const handleLike = (e) => {
    e.stopPropagation();
    if (isLiked) {
      setLikes(prev => prev - 1);
      setIsLiked(false);
    } else {
      setLikes(prev => prev + 1);
      setIsLiked(true);
    }
  };

  const handleBookmark = (e) => {
    e.stopPropagation();
    setIsBookmarked(!isBookmarked);
    // Save to localStorage
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
        whileHover={{ scale: 1.01 }}
        onClick={() => onOpen(issue)}
        className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all cursor-pointer overflow-hidden border border-slate-200 group"
      >
        <div className="flex flex-col sm:flex-row">
          <div className="relative w-full sm:w-48 h-48 sm:h-auto bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
            {issue.thumbnail ? (
              <Image
                src={issue.thumbnail}
                alt={issue.title}
                fill
                className="object-cover"
              />
            ) : (
              <BookOpen className="w-12 h-12 text-amber-600/40" />
            )}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all" />
          </div>
          <div className="flex-1 p-5">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-800 mb-1">{issue.title}</h3>
                <div className="flex items-center gap-3 text-sm text-slate-500 mb-3">
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
                <button
                  onClick={handleLike}
                  className={`p-1.5 rounded-lg transition-all ${isLiked ? 'text-red-500 bg-red-50' : 'text-slate-400 hover:text-red-500 hover:bg-red-50'}`}
                >
                  <Heart size={18} fill={isLiked ? "currentColor" : "none"} />
                </button>
                <span className="text-xs text-slate-500">{likes}</span>
                <button
                  onClick={handleBookmark}
                  className={`p-1.5 rounded-lg transition-all ${isBookmarked ? 'text-amber-600 bg-amber-50' : 'text-slate-400 hover:text-amber-600 hover:bg-amber-50'}`}
                >
                  {isBookmarked ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
                </button>
                <button
                  onClick={handleShare}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all"
                >
                  <Share2 size={18} />
                </button>
              </div>
            </div>
            <p className="text-slate-600 text-sm line-clamp-2 mb-3">{issue.description}</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-amber-600">
                <Eye size={12} />
                <span>{issue.views || 0} views</span>
                <span className="w-1 h-1 bg-slate-300 rounded-full" />
                <Download size={12} />
                <span>{issue.downloads || 0} downloads</span>
              </div>
              <span className="text-xs font-medium text-amber-600 group-hover:translate-x-1 transition-transform">
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
      whileHover={{ y: -8 }}
      onClick={() => onOpen(issue)}
      className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Cover Image Area */}
      <div className="relative h-64 bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center overflow-hidden">
        {issue.thumbnail ? (
          <Image
            src={issue.thumbnail}
            alt={issue.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <BookOpen className="w-16 h-16 text-amber-600/30" />
        )}
        
        {/* Year Badge */}
        <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm rounded-lg px-2 py-1">
          <span className="text-white text-xs font-bold">{issue.year}</span>
        </div>

        {/* Action Buttons Overlay */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 flex items-center justify-center gap-3"
            >
              <button
                onClick={(e) => { e.stopPropagation(); handleLike(e); }}
                className={`p-2 rounded-full bg-white/90 backdrop-blur-sm transition-all hover:scale-110 ${isLiked ? 'text-red-500' : 'text-slate-600'}`}
              >
                <Heart size={18} fill={isLiked ? "currentColor" : "none"} />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); handleBookmark(e); }}
                className={`p-2 rounded-full bg-white/90 backdrop-blur-sm transition-all hover:scale-110 ${isBookmarked ? 'text-amber-600' : 'text-slate-600'}`}
              >
                {isBookmarked ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); handleShare(e); }}
                className="p-2 rounded-full bg-white/90 backdrop-blur-sm text-slate-600 transition-all hover:scale-110"
              >
                <Share2 size={18} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Content Area */}
      <div className="p-5">
        <h3 className="font-bold text-slate-800 text-lg mb-2 line-clamp-1 group-hover:text-amber-700 transition-colors">
          {issue.title}
        </h3>
        <p className="text-slate-500 text-sm line-clamp-2 mb-3">
          {issue.description || "Annual magazine showcasing school achievements, events, and student stories."}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <Eye size={12} />
              {issue.views || 0}
            </span>
            <span className="flex items-center gap-1">
              <Heart size={12} />
              {likes}
            </span>
          </div>
          <span className="text-amber-600 text-sm font-medium group-hover:translate-x-1 transition-transform">
            Read Now →
          </span>
        </div>
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
  const [viewMode, setViewMode] = useState("grid"); // grid or list
  const [sortBy, setSortBy] = useState("year"); // year, title, views, downloads
  const [sortOrder, setSortOrder] = useState("desc"); // asc or desc
  const [showFilters, setShowFilters] = useState(false);
  const [stats, setStats] = useState({
    totalIssues: 0,
    totalPages: 0,
    earliestYear: null,
    latestYear: null
  });

  // Fetch magazines
  useEffect(() => {
    const fetchMagazines = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/school');
        const data = await response.json();
        // The magazine is nested under data.school.magazine
        let magazines = [];
        if (data.school && data.school.magazine) {
          // If you expect only one magazine, wrap it in an array
          magazines = [data.school.magazine];
        }
        setMagazines(magazines);

        // Calculate stats
        const years = magazines.map(m => m.year);
        const totalPages = magazines.reduce((sum, m) => sum + (m.pages || 80), 0);
        setStats({
          totalIssues: magazines.length,
          totalPages: totalPages,
          earliestYear: Math.min(...years),
          latestYear: Math.max(...years)
        });
      } catch (error) {
        console.error('Error fetching magazines:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMagazines();
  }, []);

  // Filter and sort magazines
  const filteredAndSortedMagazines = useMemo(() => {
    let filtered = [...magazines];

    // Filter by search
    if (searchQuery) {
      filtered = filtered.filter(m =>
        m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.year.toString().includes(searchQuery)
      );
    }

    // Filter by year
    if (selectedYear !== "all") {
      filtered = filtered.filter(m => m.year === parseInt(selectedYear));
    }

    // Sort
    filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case "year":
          comparison = a.year - b.year;
          break;
        case "title":
          comparison = a.title.localeCompare(b.title);
          break;
        case "views":
          comparison = (a.views || 0) - (b.views || 0);
          break;
        case "downloads":
          comparison = (a.downloads || 0) - (b.downloads || 0);
          break;
        default:
          comparison = a.year - b.year;
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });

    return filtered;
  }, [magazines, searchQuery, selectedYear, sortBy, sortOrder]);

  const years = useMemo(() => {
    const uniqueYears = [...new Set(magazines.map(m => m.year))];
    return uniqueYears.sort((a, b) => b - a);
  }, [magazines]);


if (loading) {
  return (
    <Box 
      className="min-h-[70vh] flex items-center justify-center p-4 bg-transparent"
    >
      <Stack 
        spacing={2} 
        alignItems="center"
        className="w-full transition-all duration-500"
      >
        {/* Modern Layered Loader - Responsive sizing */}
        <Box className="relative flex items-center justify-center scale-90 sm:scale-110">
          <CircularProgress
            variant="determinate"
            value={100}
            size={48} 
            thickness={4.5}
            sx={{ color: '#f1f5f9' }} 
          />
          <CircularProgress
            variant="indeterminate"
            disableShrink
            size={48}
            thickness={4.5}
            sx={{
              color: '#0f172a', // Matches your dark slate theme
              animationDuration: '1000ms',
              position: 'absolute',
              [`& .MuiCircularProgress-circle`]: {
                strokeLinecap: 'round',
              },
            }}
          />
          <Box className="absolute">
            <IoSparkles className="text-blue-600 text-sm animate-pulse" />
          </Box>
        </Box>

        {/* Minimalist Typography */}
        <div className="text-center px-4">
          <p className="text-slate-900 font-medium text-sm sm:text-base tracking-tight italic">
Loading for our School Magazines          </p>
          <p className="text-slate-400 text-[10px] sm:text-xs uppercase tracking-widest mt-1 font-bold">
            kinyui boys Senior School
          </p>
        </div>
      </Stack>
    </Box>
  );
}

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-amber-900 via-orange-900 to-amber-900 text-white overflow-hidden">
        {/* Low-opacity background image */}
        <div className="absolute inset-0">
          <img src="/kin.jpeg" alt="Kinyui Hero" className="w-full h-full object-cover opacity-20" />
        </div>
        {/* Logo watermark overlay */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
          <img src="/kinyui.png" alt="Kinyui Logo" className="w-1/2 max-w-xs opacity-10" />
        </div>
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20 sm:py-28">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 mb-6">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span className="text-sm font-medium">Digital Archive</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black mb-4">
              School Magazine
              <span className="block text-amber-300">Archive</span>
            </h1>
            <p className="text-lg sm:text-xl text-amber-100 max-w-2xl mx-auto">
              Discover the rich history and achievements of Kinyui Boys through our digital magazine collection
            </p>
          </motion.div>

          {/* Stats Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-12 flex flex-wrap justify-center gap-8"
          >
            <div className="text-center">
              <div className="text-3xl font-black">{stats.totalIssues}</div>
              <div className="text-amber-200 text-sm">Issues Published</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-black">{stats.totalPages}+</div>
              <div className="text-amber-200 text-sm">Total Pages</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-black">{stats.earliestYear} - {stats.latestYear}</div>
              <div className="text-amber-200 text-sm">Years of Excellence</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Search & Filter Section */}
      <section className="sticky top-0 z-30 bg-white/95 backdrop-blur-md shadow-md py-4 px-2 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row gap-4 w-full">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-700" size={18} />
              <input
                type="text"
                placeholder="Search by title, year, or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-2 border-amber-700 text-amber-900 font-bold rounded-xl text-sm focus:outline-none focus:border-amber-800 focus:ring-2 focus:ring-amber-700/30 transition-all"
              />
            </div>

            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="px-4 py-2.5 bg-amber-50 border-2 border-amber-700 text-amber-900 font-bold rounded-xl text-sm flex items-center gap-2 hover:bg-amber-100 transition-all"
              >
                <Filter size={16} className="text-amber-700" />
                Filters
                {showFilters ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>

              <div className="flex bg-amber-50 rounded-xl p-1 border border-amber-200">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg transition-all ${viewMode === "grid" ? "bg-amber-700 shadow-sm text-white font-bold" : "text-amber-700"}`}
                >
                  <Grid3x3 size={18} />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg transition-all ${viewMode === "list" ? "bg-amber-700 shadow-sm text-white font-bold" : "text-amber-700"}`}
                >
                  <List size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* Expanded Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 pt-4 border-t border-slate-200"
              >
                <div className="flex flex-wrap gap-4">
                  <div className="flex-1 min-w-[150px]">
                    <label className="block text-xs font-medium text-slate-500 mb-1">Year</label>
                    <select
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border-2 border-amber-700 text-amber-900 font-bold rounded-lg text-sm focus:outline-none focus:border-amber-800"
                    >
                      <option value="all">All Years</option>
                      {years.map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex-1 min-w-[150px]">
                    <label className="block text-xs font-medium text-slate-500 mb-1">Sort By</label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border-2 border-amber-700 text-amber-900 font-bold rounded-lg text-sm focus:outline-none focus:border-amber-800"
                    >
                      <option value="year">Year</option>
                      <option value="title">Title</option>
                      <option value="views">Most Viewed</option>
                      <option value="downloads">Most Downloaded</option>
                    </select>
                  </div>

                  <div className="flex-1 min-w-[150px]">
                    <label className="block text-xs font-medium text-slate-500 mb-1">Order</label>
                    <select
                      value={sortOrder}
                      onChange={(e) => setSortOrder(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border-2 border-amber-700 text-amber-900 font-bold rounded-lg text-sm focus:outline-none focus:border-amber-800"
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
      <section className="py-12 px-4 sm:px-6 max-w-7xl mx-auto">
        {filteredAndSortedMagazines.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <BookOpen className="mx-auto text-slate-300 mb-4" size={64} />
            <h3 className="text-xl font-bold text-slate-700 mb-2">No magazines found</h3>
            <p className="text-slate-500">Try adjusting your search or filter criteria</p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedYear("all");
              }}
              className="mt-4 px-4 py-2 bg-amber-800 text-white rounded-lg text-sm font-bold hover:bg-amber-900 transition-all"
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
                key={issue.id}
                issue={issue}
                onOpen={setSelectedIssue}
                viewMode={viewMode}
              />
            ))}
          </div>
        )}
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 bg-gradient-to-br from-amber-50 to-orange-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900">Why Read Our Magazine?</h2>
            <p className="text-slate-600 mt-2">Every edition captures the essence of Kinyui Boys</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <FeatureCard
              icon={Trophy}
              title="Achievements"
              description="Academic and sports excellence recognized and celebrated"
              color="from-amber-800 to-orange-900"
            />
            <FeatureCard
              icon={Users}
              title="Student Stories"
              description="Inspiring journeys and success stories of our young men"
              color="from-orange-800 to-red-900"
            />
            <FeatureCard
              icon={Calendar}
              title="Events Coverage"
              description="Memorable moments from school events and activities"
              color="from-amber-900 to-amber-800"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-br from-amber-900 to-orange-900 rounded-3xl p-10 shadow-2xl"
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