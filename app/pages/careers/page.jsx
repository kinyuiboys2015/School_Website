"use client";
import { useState, useEffect } from 'react';
import { Toaster, toast } from 'sonner';
import {
  FiBriefcase,
  FiFilter,
  FiCalendar,
  FiUsers,
  FiGraduationCap,
  FiClock,
  FiArrowUpRight,
  FiMail,
  FiPhone,
  FiInfo,
  FiArrowRight,
  FiHeart,
  FiDownload,
  FiShare2,
  FiEye,
  FiChevronDown,
  FiChevronUp,
  FiSearch,
  FiX,
  FiBookmark,
  FiExternalLink,
  FiAward,
  FiStar,
  FiShield,
  FiZap,
  FiTrendingUp,
  FiGlobe,
  FiCopy,
  FiBell,
  FiList,
  FiMapPin,
  FiFileText,
  FiSend
} from 'react-icons/fi';
import { FaGraduationCap, FaBuilding as FiBuilding, FaWhatsapp } from 'react-icons/fa';
import {
  IoCalendarClearOutline,
  IoSparkles,
  IoRibbonOutline,
  IoPeopleCircle,
  IoStatsChart,
  IoShareSocialOutline,
  IoClose,
  IoLocationOutline,
  IoTimeOutline,
  IoPersonOutline,
  IoShareOutline,
  IoNewspaperOutline,
  IoSchoolOutline,
  IoBusinessOutline
} from 'react-icons/io5';
import { FiGrid, FiList } from 'react-icons/fi';
import { CircularProgress, Box, Typography, Stack } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';

// ============================================================
// Animated Stat Counter Component (from About page)
// ============================================================
const AnimatedCounter = ({ value, label, icon: Icon, suffix = "" }) => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      const numValue = parseInt(value) || 0;
      if (count < numValue) {
        setCount(prev => Math.min(prev + Math.ceil(numValue / 50), numValue));
      }
    }, 30);
    return () => clearTimeout(timer);
  }, [count, value]);

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 flex items-center gap-3 shadow-lg shadow-slate-200/50 border border-slate-200 hover:shadow-xl transition-all hover:border-amber-200">
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center flex-shrink-0 shadow-md">
        <Icon className="text-white" size={18} />
      </div>
      <div>
        <div className="text-xl sm:text-2xl font-black text-slate-900 leading-none">{count}{suffix}</div>
        <div className="text-[10px] sm:text-xs text-amber-700 font-bold uppercase tracking-wider mt-0.5">{label}</div>
      </div>
    </div>
  );
};

// ============================================================
// Modern Job Card Component (Amber/Orange Theme)
// ============================================================
const ModernJobCard = ({ job, onView, onBookmark, onShare, viewMode = 'grid' }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const handleWhatsAppShare = (e) => {
    e.stopPropagation();
    const text = `Job Opening: ${job?.jobTitle} at Kinyui Boys Senior School. ${job?.jobType} position in ${job?.department || 'various departments'}.`;
    const url = window.location.href;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`;
    window.open(whatsappUrl, '_blank');
  };

  const getJobTypeStyle = (type) => {
    const styles = {
      'full-time': { gradient: 'from-emerald-500 to-green-500', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
      'part-time': { gradient: 'from-blue-500 to-cyan-500', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
      'contract': { gradient: 'from-purple-500 to-pink-500', bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
      'internship': { gradient: 'from-amber-500 to-orange-500', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' }
    };
    return styles[type] || styles['full-time'];
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'teaching': FaGraduationCap,
      'administrative': FiBriefcase,
      'support': FiUsers,
      'technical': FiZap,
      'medical': FiShield,
      'maintenance': FiTrendingUp
    };
    return icons[category] || FiBriefcase;
  };

  const formatDate = (dateString) => {
    try {
      if (!dateString) return 'Open until filled';
      const date = new Date(dateString);
      const now = new Date();
      const diff = Math.ceil((date - now) / (1000 * 60 * 60 * 24));
      
      if (diff === 0) return 'Today';
      if (diff === 1) return 'Tomorrow';
      if (diff < 0) return 'Closed';
      if (diff < 7) return `${diff} days`;
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } catch {
      return 'Open';
    }
  };

  const CategoryIcon = getCategoryIcon(job?.category);

  // Grid View
  if (viewMode === 'grid') {
    const theme = getJobTypeStyle(job?.jobType);
    const daysLeft = formatDate(job?.applicationDeadline);
    const isUrgent = daysLeft === 'Today' || daysLeft === 'Tomorrow';

    return (
      <div 
        onClick={() => onView(job)}
        className="relative bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden cursor-pointer hover:shadow-xl transition-all hover:border-amber-200"
      >
        <div className={`relative h-1.5 bg-gradient-to-r ${theme.gradient}`}>
          {isUrgent && (
            <div className="absolute top-1 left-1/2 transform -translate-x-1/2 px-2 py-0.5 bg-red-500 text-white rounded-full text-[8px] font-bold uppercase tracking-wider animate-pulse">
              Urgent
            </div>
          )}
        </div>

        <div className="p-5">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className={`p-2 rounded-xl ${theme.bg} ${theme.text} border ${theme.border}`}>
                <CategoryIcon size={16} />
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-wider ${theme.text}`}>
                {job?.category || 'General'}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={handleWhatsAppShare}
                className="p-1.5 rounded-lg text-green-500 hover:text-green-600 hover:bg-green-50"
                title="Share on WhatsApp"
              >
                <FaWhatsapp size={14} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onBookmark(job);
                }}
                className={`p-1.5 rounded-lg ${isBookmarked ? 'text-amber-500 bg-amber-50' : 'text-slate-300 hover:text-slate-500'}`}
              >
                <FiBookmark className={isBookmarked ? 'fill-current' : ''} size={14} />
              </button>
            </div>
          </div>

          <h3 className="text-lg font-bold text-slate-900 mb-1 line-clamp-2 leading-tight">
            {job?.jobTitle || 'Position Available'}
          </h3>

          <div className="flex items-center gap-2 mb-3">
            <FiBuilding className="text-slate-400" size={12} />
            <span className="text-xs font-medium text-slate-600">
              {job?.department || 'School Department'}
            </span>
          </div>

          <p className="text-slate-500 text-xs mb-4 line-clamp-2 leading-relaxed">
            {job?.jobDescription || 'Join our dedicated team at Kinyui Boys Senior School.'}
          </p>

          <div className="grid grid-cols-2 gap-2 mb-4">
            <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-100">
              <div className={`p-1 rounded-lg ${theme.bg}`}>
                <FiCalendar className={`${theme.text}`} size={10} />
              </div>
              <div>
                <p className="text-[8px] font-bold text-slate-400 uppercase">Deadline</p>
                <p className="text-[10px] font-bold text-slate-900">{daysLeft}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-100">
              <div className={`p-1 rounded-lg ${theme.bg}`}>
                <FiUsers className={`${theme.text}`} size={10} />
              </div>
              <div>
                <p className="text-[8px] font-bold text-slate-400 uppercase">Positions</p>
                <p className="text-[10px] font-bold text-slate-900">{job?.positionsAvailable || 1}</p>
              </div>
            </div>
          </div>

          <button className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 text-white text-[10px] font-black rounded-xl flex items-center justify-center gap-2 hover:shadow-lg transition-all active:scale-95">
            View Details <FiArrowRight size={12} />
          </button>
        </div>
      </div>
    );
  }

  // List View
  return (
    <div 
      onClick={() => onView(job)}
      className="relative bg-white rounded-xl border border-slate-200 p-4 shadow-sm cursor-pointer hover:shadow-md transition-all hover:border-amber-200"
    >
      <div className="flex gap-4">
        <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 shadow-sm">
          <div className={`w-full h-full bg-gradient-to-br ${getJobTypeStyle(job?.jobType).gradient} flex items-center justify-center`}>
            <CategoryIcon className="text-white text-xl" />
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <span className={`px-2 py-0.5 rounded-lg text-[8px] font-bold uppercase tracking-wider border ${
                getJobTypeStyle(job?.jobType).bg
              } ${getJobTypeStyle(job?.jobType).text} ${
                getJobTypeStyle(job?.jobType).border
              }`}>
                {job?.jobType?.replace('-', ' ') || 'Full-time'}
              </span>
              <span className="text-[8px] font-bold text-slate-400 uppercase">
                {formatDate(job?.applicationDeadline)}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={handleWhatsAppShare}
                className="p-1 rounded-lg text-green-500 hover:text-green-600"
              >
                <FaWhatsapp size={12} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onBookmark(job);
                }}
                className={`p-1 rounded-lg ${isBookmarked ? 'text-amber-500' : 'text-slate-300'}`}
              >
                <FiBookmark className={isBookmarked ? 'fill-current' : ''} size={12} />
              </button>
            </div>
          </div>

          <h3 className="text-sm font-bold text-slate-900 leading-snug mb-1">
            {job?.jobTitle || 'Position Available'}
          </h3>

          <div className="flex items-center gap-3 text-xs text-slate-500 mb-2">
            <div className="flex items-center gap-1">
              <FiBuilding size={10} />
              <span>{job?.department || 'Department'}</span>
            </div>
            <div className="flex items-center gap-1">
              <FiUsers size={10} />
              <span>{job?.positionsAvailable || 1} position(s)</span>
            </div>
          </div>

          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 px-2 py-0.5 bg-slate-50 rounded-lg">
                <FiAward className="text-amber-500" size={10} />
                <span className="text-[9px] font-bold text-slate-600">{job?.experience || 'Flexible'}</span>
              </div>
            </div>
            <div className="flex items-center gap-1 text-amber-600 font-bold text-[9px] uppercase tracking-wider">
              Apply Now
              <FiArrowRight size={10} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// Modern Job Detail Modal (Amber/Orange Theme)
// ============================================================
const ModernJobDetailModal = ({ job, onClose, onApply }) => {
  if (!job) return null;

  const handleWhatsAppShare = () => {
    const text = `Check out this job opportunity at Kinyui Boys Senior School: ${job.jobTitle} - ${job.department || 'Various Departments'}`;
    const url = window.location.href;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`;
    window.open(whatsappUrl, '_blank');
  };

  const getJobTypeStyle = (type) => {
    const styles = {
      'full-time': { gradient: 'from-emerald-500 to-green-500' },
      'part-time': { gradient: 'from-blue-500 to-cyan-500' },
      'contract': { gradient: 'from-purple-500 to-pink-500' },
      'internship': { gradient: 'from-amber-500 to-orange-500' }
    };
    return styles[type] || { gradient: 'from-slate-500 to-slate-600' };
  };

  const formatFullDate = (dateString) => {
    if (!dateString) return 'Open until filled';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const theme = getJobTypeStyle(job.jobType);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 sm:p-4 bg-slate-900/90 backdrop-blur-sm">
      <div className="relative w-full h-full sm:h-auto sm:max-h-[90vh] sm:max-w-3xl bg-white sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-50 p-2 bg-black/20 backdrop-blur-md text-white rounded-full border border-white/20 transition-all active:scale-90"
        >
          <IoClose size={20}/>
        </button>

        <div className={`relative h-1.5 sm:h-2 bg-gradient-to-r ${theme.gradient}`} />

        <div className="flex-1 overflow-y-auto p-5 sm:p-8">
          <div className="max-w-2xl mx-auto space-y-6">
            
            <section className="space-y-3">
              <div className="flex items-start gap-3">
                <div className={`p-2.5 rounded-xl bg-gradient-to-r ${theme.gradient}`}>
                  <FiBriefcase className="text-white text-xl" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight tracking-tight">
                    {job.jobTitle}
                  </h2>
                  <p className="text-slate-500 text-sm">{job.department || 'School Department'}</p>
                </div>
              </div>

              <button
                onClick={handleWhatsAppShare}
                className="flex items-center gap-2 px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white rounded-lg text-xs"
              >
                <FaWhatsapp size={14} />
                <span>Share on WhatsApp</span>
              </button>

              <div className="flex flex-wrap gap-4 text-xs font-semibold text-slate-500 pt-2">
                <div className="flex items-center gap-1.5">
                  <IoCalendarClearOutline className="text-amber-500" />
                  {formatFullDate(job.applicationDeadline)}
                </div>
                <div className="flex items-center gap-1.5">
                  <IoBusinessOutline className="text-orange-500" />
                  {job.jobType?.replace('-', ' ') || 'Full-time'}
                </div>
              </div>
            </section>

            <section className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-100">
                <FiUsers className="text-amber-600 mb-1 w-4 h-4" />
                <p className="text-[8px] uppercase font-bold text-slate-400">Positions</p>
                <p className="font-bold text-slate-900 text-sm">{job.positionsAvailable || 1}</p>
              </div>
              <div className="p-3 bg-orange-50 rounded-xl border border-orange-100">
                <FiAward className="text-orange-600 mb-1 w-4 h-4" />
                <p className="text-[8px] uppercase font-bold text-slate-400">Experience</p>
                <p className="font-bold text-slate-900 text-sm truncate">{job.experience || 'Flexible'}</p>
              </div>
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                <FiClock className="text-emerald-600 mb-1 w-4 h-4" />
                <p className="text-[8px] uppercase font-bold text-slate-400">Type</p>
                <p className="font-bold text-slate-900 text-sm capitalize">{job.jobType?.replace('-', ' ') || 'Full-time'}</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-xl border border-purple-100">
                <FaGraduationCap className="text-purple-600 mb-1 w-4 h-4" />
                <p className="text-[8px] uppercase font-bold text-slate-400">Category</p>
                <p className="font-bold text-slate-900 text-sm">{job.category || 'General'}</p>
              </div>
            </section>

            <section className="space-y-2">
              <h3 className="text-[10px] font-black uppercase tracking-wider text-slate-400">Job Description</h3>
              <div className="text-slate-600 text-sm leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
                {job.jobDescription || 'Join our dedicated team at Kinyui Boys Senior School.'}
              </div>
            </section>

            {job.requirements && (
              <section className="space-y-2">
                <h3 className="text-[10px] font-black uppercase tracking-wider text-slate-400">Requirements</h3>
                <div className="text-slate-600 text-sm leading-relaxed bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                  {job.requirements}
                </div>
              </section>
            )}

            {job.qualifications && (
              <section className="space-y-2">
                <h3 className="text-[10px] font-black uppercase tracking-wider text-slate-400">Qualifications</h3>
                <div className="text-slate-600 text-sm leading-relaxed bg-purple-50 p-4 rounded-xl border border-purple-100">
                  {job.qualifications}
                </div>
              </section>
            )}

            <section className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-5 border border-amber-200">
              <div className="flex items-start gap-3 mb-3">
                <div className="p-2 bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl">
                  <FiSend className="text-white" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">How to Apply</h3>
                  <p className="text-slate-500 text-sm">Submit your application through any method below</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 bg-white rounded-xl border border-slate-200">
                    <div className="flex items-center gap-2 mb-1">
                      <FiMail className="text-amber-500 w-4 h-4" />
                      <h4 className="font-bold text-slate-900 text-sm">Email Application</h4>
                    </div>
                    <p className="text-xs text-slate-500 mb-2">Send your CV and certificates to:</p>
                    <a href={`mailto:${job.contactEmail || 'kinyuiboys2015@gmail.com'}`} className="text-amber-600 font-medium text-sm break-all">
                      {job.contactEmail || 'kinyuiboys2015@gmail.com'}
                    </a>
                  </div>
                  
                  <div className="p-3 bg-white rounded-xl border border-slate-200">
                    <div className="flex items-center gap-2 mb-1">
                      <FiPhone className="text-orange-500 w-4 h-4" />
                      <h4 className="font-bold text-slate-900 text-sm">Phone Inquiry</h4>
                    </div>
                    <p className="text-xs text-slate-500 mb-2">Contact our HR department:</p>
                    <a href={`tel:${job.contactPhone || '+254710894145'}`} className="text-orange-600 font-medium text-sm">
                      {job.contactPhone || '+254 710 894 145'}
                    </a>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>

        <div className="shrink-0 p-4 bg-slate-50/80 border-t border-slate-100">
          <div className="max-w-2xl mx-auto flex justify-center">
            <button
              onClick={onClose}
              className="px-8 py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl font-bold text-sm flex items-center gap-2 active:scale-95 transition-all"
            >
              <IoClose size={16} />
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// Modern Empty State Component
// ============================================================
const ModernEmptyState = ({ onClearFilters }) => {
  return (
    <div className="group bg-white rounded-2xl border-2 border-dashed border-slate-200 py-12 px-6 text-center transition-all hover:border-amber-200">
      <div className="w-16 h-16 bg-gradient-to-br from-amber-50 to-orange-50 rounded-full flex items-center justify-center mx-auto mb-4">
        <FiBriefcase className="text-amber-400 text-2xl" />
      </div>
      <h3 className="text-lg font-black text-slate-900 mb-2">No Openings</h3>
      <p className="text-slate-500 text-sm mb-6 max-w-md mx-auto">
        Currently no opportunities available at <span className="text-slate-900 font-bold">Kinyui Boys Senior School</span>.
      </p>
      <button 
        onClick={onClearFilters}
        className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl font-black text-[10px] uppercase tracking-wider shadow-lg active:scale-95 transition-all"
      >
        Reset Filters
      </button>
    </div>
  );
};

// ============================================================
// Main Careers Page Component (Redesigned with About Page Theme)
// ============================================================
export default function CareersPage() {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedJob, setSelectedJob] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [bookmarkedJobs, setBookmarkedJobs] = useState(new Set());
  const [activeTab, setActiveTab] = useState('all');
  const [refreshing, setRefreshing] = useState(false);

  // Categories for filtering
  const categories = [
    { id: 'all', name: 'All Positions', icon: FiBriefcase },
    { id: 'teaching', name: 'Teaching', icon: FaGraduationCap },
    { id: 'administrative', name: 'Administrative', icon: FiBriefcase },
    { id: 'support', name: 'Support Staff', icon: FiUsers },
    { id: 'technical', name: 'Technical', icon: FiZap }
  ];

  // Fetch jobs from API
  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/career');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        if (data.success && Array.isArray(data.jobs)) {
          setJobs(data.jobs);
          setFilteredJobs(data.jobs);
        } else {
          setJobs([]);
          setFilteredJobs([]);
        }
      } catch (error) {
        console.error('Error fetching jobs:', error);
        setJobs([]);
        setFilteredJobs([]);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  // Filter jobs
  useEffect(() => {
    let filtered = [...jobs];
    if (activeTab !== 'all') {
      filtered = filtered.filter(job => job?.category?.toLowerCase() === activeTab.toLowerCase());
    }
    if (search) {
      filtered = filtered.filter(job => 
        job?.jobTitle?.toLowerCase().includes(search.toLowerCase()) ||
        job?.department?.toLowerCase().includes(search.toLowerCase())
      );
    }
    setFilteredJobs(filtered);
  }, [jobs, search, activeTab]);

  const handleBookmark = (job) => {
    const newBookmarked = new Set(bookmarkedJobs);
    if (newBookmarked.has(job.id)) {
      newBookmarked.delete(job.id);
      toast.success('Removed from bookmarks');
    } else {
      newBookmarked.add(job.id);
      toast.success('Job saved to bookmarks');
    }
    setBookmarkedJobs(newBookmarked);
  };

  const clearFilters = () => {
    setSearch('');
    setActiveTab('all');
  };

  const handleShareAllJobs = () => {
    const text = `Check out current job openings at Kinyui Boys Senior School! ${filteredJobs.length} positions available.`;
    const url = window.location.href;
    window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4 bg-slate-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600 font-medium">Loading opportunities...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Toaster position="top-right" richColors />

      {/* Hero Section - Matching About Page Style */}
      <section className="relative py-16 sm:py-24 bg-gradient-to-br from-amber-900 via-orange-900 to-red-900 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/hero/katz8.jpeg"
            alt="Careers at Kinyui Boys"
            fill
            className="object-cover opacity-20"
          />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
            </span>
            <span className="text-[10px] sm:text-xs font-black tracking-[0.25em] text-amber-200 uppercase">
              Join Our Team
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4 tracking-tight">
            Build Your Career <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">
              With Us
            </span>
          </h1>
          <p className="text-slate-200 text-base sm:text-lg max-w-2xl mx-auto">
            Join a team dedicated to educational excellence and shaping the future leaders of tomorrow.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        
        {/* Stats Row - Animated Counters */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-8 sm:mb-12">
          <AnimatedCounter value={jobs.length.toString()} label="Open Positions" icon={FiBriefcase} />
          <AnimatedCounter value="15" label="Departments" icon={Building2} suffix="+" />
          <AnimatedCounter value="50" label="Staff Members" icon={Users} suffix="+" />
          <AnimatedCounter value="24/7" label="Support Available" icon={Clock} />
        </div>

        {/* Header with View Toggle */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">Current Openings</h2>
            <p className="text-slate-500 text-sm">{filteredJobs.length} positions available</p>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={handleShareAllJobs}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl text-sm font-bold hover:bg-green-700 transition-colors"
            >
              <FaWhatsapp size={16} />
              Share All Jobs
            </button>
            
            <div className="flex bg-white rounded-xl border border-slate-200 overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-amber-50 text-amber-600' : 'text-slate-400'}`}
              >
                <FiGrid size={18} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-amber-50 text-amber-600' : 'text-slate-400'}`}
              >
                <FiList size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-6 shadow-sm">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                placeholder="Search positions..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
              />
            </div>
            
            <div className="flex gap-3">
              <select 
                value={activeTab}
                onChange={(e) => setActiveTab(e.target.value)}
                className="px-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-sm font-medium text-slate-700 focus:outline-none focus:border-amber-400"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
              
              <button
                onClick={clearFilters}
                className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl text-sm font-bold hover:shadow-lg transition-all"
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                activeTab === cat.id
                  ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-md'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-amber-300'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Job Listings */}
        {filteredJobs.length === 0 ? (
          <ModernEmptyState onClearFilters={clearFilters} />
        ) : (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-3'}>
            {filteredJobs.map((job, index) => (
              <ModernJobCard 
                key={job.id || index}
                job={job}
                onView={setSelectedJob}
                onBookmark={handleBookmark}
                onShare={() => {}}
                viewMode={viewMode}
              />
            ))}
          </div>
        )}

        {/* CTA Banner */}
        <div className="mt-12 bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl p-6 sm:p-8 text-center text-white">
          <h3 className="text-xl sm:text-2xl font-black mb-2">Don't see the right fit?</h3>
          <p className="text-amber-100 mb-4">Submit your CV for future opportunities</p>
          <button className="px-6 py-2.5 bg-white text-amber-600 rounded-xl font-bold text-sm hover:shadow-lg transition-all">
            Send Application
          </button>
        </div>
      </div>

      {/* Job Detail Modal */}
      {selectedJob && (
        <ModernJobDetailModal
          job={selectedJob}
          onClose={() => setSelectedJob(null)}
          onApply={() => {}}
        />
      )}
    </div>
  );
}

// Missing imports
