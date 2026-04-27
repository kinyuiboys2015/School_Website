'use client';

import { useState, useEffect } from 'react';
import { toast, Toaster } from 'sonner';
import {
  FiCalendar,
  FiAward,
  FiStar,
  FiTrendingUp,
  FiTarget,
  FiBookOpen,
  FiUsers,
  FiGlobe,
  FiMapPin,
  FiArrowRight,
  FiSearch,
  FiFilter,
  FiRotateCw,
  FiGrid,
  FiList,
  FiX,
  FiEye,
  FiChevronRight,
  FiChevronLeft,
  FiBookmark,
  FiShare2,
  FiDownload,
  FiExternalLink,
  FiZap,
  FiHeart,
  FiShield,
  FiClock,
  FiCopy,
  FiUpload,
  FiBarChart2,
  FiActivity
} from 'react-icons/fi';
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
  IoSchoolOutline,
  IoTrophyOutline,
  IoNewspaperOutline,
  IoMedalOutline,
  IoFire,
  IoSwapVertical
} from 'react-icons/io5';
import { CircularProgress, Box, Typography, Stack } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import { FaFacebookF, FaTwitter, FaWhatsapp, FaTelegram, FaEnvelope } from 'react-icons/fa';

// Modern Modal Component
const ModernModal = ({ children, open, onClose, maxWidth = '800px', blur = true }) => {
  if (!open) return null;
  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${blur ? 'backdrop-blur-md' : 'bg-black/50'}`}>
      <div
        className="relative bg-white/95 rounded-3xl shadow-2xl animate-in zoom-in-95 duration-300 overflow-hidden border border-white/40"
        style={{
          width: '90%',
          maxWidth: maxWidth,
          maxHeight: '90vh',
          background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.95) 100%)'
        }}
      >
        <div className="absolute top-4 right-4 z-10">
          <button
            onClick={onClose}
            className="p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white cursor-pointer border border-gray-200 shadow-sm"
          >
            <FiX className="text-gray-600 w-5 h-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

// Glass Card Component
const GlassCard = ({ children, className = '' }) => (
  <div className={`bg-white/80 backdrop-blur-sm rounded-2xl border border-white/60 shadow-lg shadow-black/5 ${className}`}>
    {children}
  </div>
);

// Modern Achievement Card - Like Events & News
const ModernAchievementCard = ({ achievement, onView, viewMode = 'grid' }) => {
  const [isBookmarked, setIsBookmarked] = useState(false);

  const getCategoryStyle = (category) => {
    const styles = {
      Academic: { gradient: 'from-blue-600 to-indigo-600', shadow: 'shadow-blue-500/20', text: 'text-blue-700', bg: 'bg-blue-50' },
      Sports: { gradient: 'from-rose-600 to-red-600', shadow: 'shadow-rose-500/20', text: 'text-rose-700', bg: 'bg-rose-50' },
      Arts: { gradient: 'from-purple-600 to-pink-600', shadow: 'shadow-purple-500/20', text: 'text-purple-700', bg: 'bg-purple-50' },
      Leadership: { gradient: 'from-amber-600 to-orange-600', shadow: 'shadow-amber-500/20', text: 'text-amber-700', bg: 'bg-amber-50' },
      Cultural: { gradient: 'from-green-600 to-emerald-600', shadow: 'shadow-green-500/20', text: 'text-green-700', bg: 'bg-green-50' },
      Debate: { gradient: 'from-cyan-600 to-blue-600', shadow: 'shadow-cyan-500/20', text: 'text-cyan-700', bg: 'bg-cyan-50' },
      Other: { gradient: 'from-slate-600 to-slate-700', shadow: 'shadow-slate-500/20', text: 'text-slate-700', bg: 'bg-slate-50' }
    };
    return styles[category] || styles.Other;
  };

  const theme = getCategoryStyle(achievement.category);

  if (viewMode === 'grid') {
    return (
      <div
        onClick={() => onView(achievement)}
        className="group relative bg-white rounded-[2rem] border border-slate-100 p-4 pb-6 transition-all duration-200 cursor-pointer hover:shadow-xl"
      >
        {/* Image with Floating Date */}
        <div className="relative h-56 w-full rounded-[1.5rem] overflow-hidden mb-6">
          <img
            src={achievement.images?.[0]?.url || '/default-achievement.jpg'}
            alt={achievement.title}
            className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
          />

          {/* Floating Year Badge */}
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md rounded-2xl p-2 min-w-[60px] flex flex-col items-center shadow-xl border border-white/20">
            <span className="text-[10px] font-black uppercase tracking-tighter text-slate-400">
              Year
            </span>
            <span className="text-xl font-black text-slate-900 leading-none">
              {achievement.year}
            </span>
          </div>

          {/* Bookmark Button */}
          <div className="absolute top-4 right-4">
            <button
              onClick={(e) => { e.stopPropagation(); setIsBookmarked(!isBookmarked); }}
              className={`p-3 rounded-2xl backdrop-blur-md transition-all ${isBookmarked ? 'bg-amber-500 text-white' : 'bg-black/20 text-white hover:bg-black/40'}`}
            >
              <FiBookmark className={isBookmarked ? 'fill-current' : ''} />
            </button>
          </div>

          {/* Category Badge */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-white bg-gradient-to-r ${theme.gradient} ${theme.shadow} shadow-lg`}>
              {achievement.category}
            </span>
          </div>
        </div>

        {/* Content Section */}
        <div className="px-2">
          <h3 className="text-lg font-black text-slate-900 mb-2 leading-tight line-clamp-2 group-hover:text-rose-900 transition-colors">
            {achievement.title}
          </h3>

          <p className="text-slate-500 text-sm mb-4 line-clamp-2">
            {achievement.description || 'Proud achievement by Kinyui Boys Senior School.'}
          </p>

          <div className="flex flex-wrap gap-3 mb-6">
            <div className="flex items-center gap-1.5 text-slate-600">
              <IoMedalOutline className="text-amber-500" size={16} />
              <span className="text-xs font-bold">{achievement.awardingBody || 'School Award'}</span>
            </div>
            {achievement.recipients?.length > 0 && (
              <div className="flex items-center gap-1.5 text-slate-600">
                <FiUsers className="text-blue-500" size={14} />
                <span className="text-xs font-bold">{achievement.recipients.length} Recipient(s)</span>
              </div>
            )}
          </div>

          <button className="w-full py-3 bg-slate-900 text-white rounded-[1.25rem] text-xs font-black uppercase tracking-widest hover:bg-black transition-colors active:scale-95">
            View Details
          </button>
        </div>
      </div>
    );
  }

  // List View
  return (
    <div
      onClick={() => onView(achievement)}
      className="group flex flex-col sm:flex-row items-center gap-6 bg-white p-5 rounded-[2rem] border border-slate-100 hover:shadow-xl transition-all cursor-pointer"
    >
      <div className="relative w-full sm:w-40 h-32 rounded-2xl overflow-hidden shrink-0">
        <img
          src={achievement.images?.[0]?.url || '/default-achievement.jpg'}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          alt={achievement.title}
        />
        <div className={`absolute top-2 left-2 px-3 py-1 rounded-lg text-[9px] font-black text-white bg-gradient-to-r ${theme.gradient}`}>
          {achievement.category}
        </div>
      </div>

      <div className="flex-1 w-full">
        <h3 className="text-lg font-black text-slate-900 mb-2">{achievement.title}</h3>
        <p className="text-sm text-slate-500 line-clamp-1 mb-4">{achievement.description}</p>

        <div className="flex items-center gap-4 flex-wrap">
          <div className={`px-3 py-1.5 rounded-xl ${theme.bg} ${theme.text} text-[10px] font-bold`}>
            {achievement.year}
          </div>
          <div className="flex items-center gap-1.5 text-slate-600 text-xs font-bold">
            <IoMedalOutline /> {achievement.awardingBody || 'Award'}
          </div>
        </div>
      </div>

      <div className="hidden md:block">
        <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-all">
          <FiArrowRight className="text-xl" />
        </div>
      </div>
    </div>
  );
};

// Left Sidebar Stats Panel
const KinyuiStatsPanel = ({ stats, achievements }) => {
  const totalAchievements = achievements?.length || 0;
  const featuredCount = achievements?.filter(a => a.featured)?.length || 0;

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <div className="relative overflow-hidden rounded-[2rem] border border-emerald-200 bg-gradient-to-br from-emerald-600 to-emerald-700 p-6 text-white shadow-lg">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl rounded-full -mr-16 -mt-16" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
              <IoTrophyOutline className="text-2xl text-amber-300" />
            </div>
            <div>
              <h3 className="text-lg font-black tracking-tight">Kinyui Boys</h3>
              <p className="text-[10px] text-emerald-100 font-bold">Senior School</p>
            </div>
          </div>
          <p className="text-[13px] leading-relaxed font-semibold text-white/80">
            Celebrating Excellence in All Endeavors
          </p>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-[1.5rem] border border-emerald-200 bg-emerald-50 p-4">
          <p className="text-[10px] font-black uppercase tracking-[0.15em] text-emerald-600 mb-2">Total</p>
          <p className="text-3xl font-black text-emerald-900">{totalAchievements}</p>
          <p className="text-[10px] text-emerald-700 mt-1 font-semibold">Achievements</p>
        </div>
        <div className="rounded-[1.5rem] border border-amber-200 bg-amber-50 p-4">
          <p className="text-[10px] font-black uppercase tracking-[0.15em] text-amber-600 mb-2">Featured</p>
          <p className="text-3xl font-black text-amber-900">{featuredCount}</p>
          <p className="text-[10px] text-amber-700 mt-1 font-semibold">Honors</p>
        </div>
      </div>

      {/* Performance Stats */}
      <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <h4 className="text-sm font-black text-slate-900 mb-4 flex items-center gap-2">
          <IoStatsChart className="text-blue-600" size={18} />
          School Performance
        </h4>
        <div className="space-y-3">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-600">Mean Score</span>
              <span className="text-sm font-black text-blue-700">{stats?.meanScore?.toFixed(2) || '—'}</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all"
                style={{ width: `${Math.min((stats?.meanScore || 0) / 5 * 100, 100)}%` }}
              />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-600">Target Mean</span>
              <span className="text-sm font-black text-emerald-700">{stats?.targetMean?.toFixed(2) || '—'}</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div
                className="bg-emerald-600 h-2 rounded-full"
                style={{ width: `${Math.min((stats?.targetMean || 0) / 5 * 100, 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* School Info Card */}
      <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <h4 className="text-sm font-black text-slate-900 mb-4 flex items-center gap-2">
          <IoSchoolOutline className="text-purple-600" size={18} />
          School Identity
        </h4>
        <div className="space-y-3">
          <div className="pb-3 border-b border-slate-100">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Motto</p>
            <p className="text-sm font-black text-slate-900 italic">
              {stats?.slogan || '"Excellence Through Integrity"'}
            </p>
          </div>
          <div className="pb-3 border-b border-slate-100">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Established</p>
            <p className="text-sm font-bold text-slate-700">{stats?.yearEstablished || '2010'}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Vision</p>
            <p className="text-xs text-slate-600 leading-relaxed">
              {stats?.vision || 'To develop holistic, self-reliant individuals with international standards'}
            </p>
          </div>
        </div>
      </div>

      {/* Upload Stats Section */}
      <div className="rounded-[2rem] border-2 border-dashed border-emerald-300 bg-emerald-50 p-6 text-center">
        <div className="w-12 h-12 rounded-xl bg-emerald-200 flex items-center justify-center mx-auto mb-3">
          <FiUpload className="text-emerald-700 text-xl" />
        </div>
        <h4 className="text-sm font-black text-emerald-900 mb-2">Add Achievements</h4>
        <p className="text-xs text-emerald-700 mb-4 leading-relaxed">
          Upload and manage school achievements, stats, and descriptions
        </p>
        <button className="w-full py-2.5 bg-emerald-600 text-white rounded-lg font-bold text-xs uppercase tracking-wider hover:bg-emerald-700 transition-colors active:scale-95">
          Upload Stats
        </button>
      </div>

      {/* Quick Description */}
      <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <h4 className="text-sm font-black text-slate-900 mb-3 flex items-center gap-2">
          <FiInfo className="text-slate-600" size={18} />
          About Us
        </h4>
        <p className="text-xs text-slate-600 leading-relaxed">
          Kinyui Boys Senior School is committed to fostering academic excellence, character development, and leadership skills in all our students. We celebrate every achievement as a testament to our collective dedication.
        </p>
      </div>
    </div>
  );
};

// Achievement Detail Modal
const AchievementDetailModal = ({ achievement, onClose }) => {
  if (!achievement) return null;

  const getCategoryStyle = (category) => {
    const styles = {
      Academic: { gradient: 'from-blue-500 to-indigo-600', icon: FiBookOpen },
      Sports: { gradient: 'from-rose-500 to-red-600', icon: FiAward },
      Arts: { gradient: 'from-purple-500 to-pink-600', icon: FiStar },
      Leadership: { gradient: 'from-amber-500 to-orange-600', icon: FiUsers },
      Cultural: { gradient: 'from-green-500 to-emerald-600', icon: IoSparkles },
      Debate: { gradient: 'from-cyan-500 to-blue-600', icon: FiAward },
      Other: { gradient: 'from-slate-500 to-slate-600', icon: FiAward }
    };
    return styles[achievement.category] || styles.Other;
  };

  const categoryStyle = getCategoryStyle(achievement.category);
  const CategoryIcon = categoryStyle.icon;

  return (
    <ModernModal open={true} onClose={onClose} maxWidth="700px">
      <div className="relative h-80 w-full">
        {achievement.images?.[0]?.url ? (
          <img
            src={achievement.images[0].url}
            alt={achievement.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${categoryStyle.gradient}`} />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute bottom-6 left-6 flex gap-2">
          <span className="px-4 py-2 bg-white text-slate-900 rounded-full text-sm font-black">
            {achievement.category}
          </span>
          {achievement.featured && (
            <span className="px-4 py-2 bg-amber-500 text-white rounded-full text-sm font-black flex items-center gap-2">
              <IoSparkles /> Featured
            </span>
          )}
        </div>
      </div>

      <div className="p-8 space-y-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900 mb-2">{achievement.title}</h2>
          <p className="text-slate-600 text-sm font-semibold">{achievement.awardingBody}</p>
        </div>

        <div className="flex flex-wrap gap-6">
          <div className="flex items-center gap-2">
            <FiCalendar className="text-blue-600" size={16} />
            <span className="text-sm font-bold text-slate-700">{achievement.year}</span>
          </div>
          {achievement.recipients?.length > 0 && (
            <div className="flex items-center gap-2">
              <FiUsers className="text-emerald-600" size={16} />
              <span className="text-sm font-bold text-slate-700">{achievement.recipients.length} Recipient(s)</span>
            </div>
          )}
        </div>

        <div>
          <h3 className="text-sm font-black text-slate-900 mb-3 uppercase tracking-wider">Description</h3>
          <p className="text-slate-600 leading-relaxed">
            {achievement.description || 'No description provided.'}
          </p>
        </div>

        {achievement.recipients?.length > 0 && (
          <div>
            <h3 className="text-sm font-black text-slate-900 mb-3 uppercase tracking-wider">Recipients</h3>
            <div className="flex flex-wrap gap-2">
              {achievement.recipients.map((rec, idx) => (
                <span key={idx} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-full text-xs font-bold">
                  {rec}
                </span>
              ))}
            </div>
          </div>
        )}

        {achievement.images && achievement.images.length > 1 && (
          <div>
            <h3 className="text-sm font-black text-slate-900 mb-3 uppercase tracking-wider">Gallery</h3>
            <div className="grid grid-cols-3 gap-3">
              {achievement.images.slice(1).map((img, idx) => (
                <img
                  key={idx}
                  src={img.url}
                  alt={img.caption || ''}
                  className="w-full h-24 object-cover rounded-xl border border-slate-200"
                />
              ))}
            </div>
          </div>
        )}

        <button
          onClick={onClose}
          className="w-full py-3 bg-slate-900 text-white rounded-xl font-black text-sm uppercase tracking-wider hover:bg-black transition-colors"
        >
          Close
        </button>
      </div>
    </ModernModal>
  );
};

// Missing FiInfo import fallback
const FiInfo = FiZap;

// Main Component
export default function KinyuiAchievements() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [schoolStats, setSchoolStats] = useState(null);
  const [achievementsByCategory, setAchievementsByCategory] = useState({
    Academic: [],
    Sports: [],
    Arts: [],
    Leadership: [],
    Cultural: [],
    Debate: [],
    Other: []
  });
  const [selectedAchievement, setSelectedAchievement] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = [
    { id: 'all', name: 'All Achievements', icon: FiAward },
    { id: 'Academic', name: 'Academic', icon: FiBookOpen },
    { id: 'Sports', name: 'Sports', icon: FiAward },
    { id: 'Arts', name: 'Arts', icon: FiStar },
    { id: 'Leadership', name: 'Leadership', icon: FiUsers },
    { id: 'Cultural', name: 'Cultural', icon: IoSparkles },
    { id: 'Debate', name: 'Debate', icon: FiTarget },
    { id: 'Other', name: 'Other', icon: FiAward }
  ];

  const loadData = async () => {
    try {
      const achRes = await fetch('/api/achievements');
      const achData = await achRes.json();
      let categorized = { Academic: [], Sports: [], Arts: [], Leadership: [], Cultural: [], Debate: [], Other: [] };
      if (achData.success && achData.achievements) {
        Object.entries(achData.achievements).forEach(([cat, items]) => {
          if (categorized.hasOwnProperty(cat)) {
            categorized[cat] = items;
          }
        });
      }
      setAchievementsByCategory(categorized);

      const statsRes = await fetch('/api/school-stats');
      const statsData = await statsRes.json();
      if (statsData.success && statsData.stats) {
        setSchoolStats(statsData.stats);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load achievements');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const refreshData = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
    toast.success('Data refreshed!');
  };

  const getAllAchievements = () => {
    return Object.values(achievementsByCategory).flat();
  };

  const filteredAchievements = getAllAchievements().filter(ach => {
    const matchesCat = activeCategory === 'all' || ach.category === activeCategory;
    const matchesSearch = searchTerm === '' ||
      ach.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ach.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ach.awardingBody?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const totalAchievements = getAllAchievements().length;
  const featuredCount = getAllAchievements().filter(a => a.featured).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <div className="relative w-16 h-16 mx-auto">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full blur opacity-75 animate-pulse" />
            <div className="relative w-full h-full bg-white rounded-full flex items-center justify-center">
              <IoTrophyOutline className="text-emerald-600 text-2xl animate-bounce" />
            </div>
          </div>
          <h2 className="text-xl font-black text-slate-900">Loading Achievements...</h2>
          <p className="text-sm text-slate-600">Fetching Kinyui Boys honors and stats</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-6">
      <Toaster position="top-right" richColors />

      <div className="max-w-7xl mx-auto space-y-6">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-[2.5rem] border border-emerald-200 bg-gradient-to-br from-emerald-600 to-emerald-800 p-8 md:p-12 text-white shadow-xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 blur-3xl rounded-full -mr-48 -mt-48" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/10 blur-3xl rounded-full -ml-48 -mb-48" />

          <div className="relative z-10 grid gap-8 lg:grid-cols-[1fr_0.8fr]">
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <IoTrophyOutline className="text-3xl text-amber-300" />
                  <div>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight">
                      Our Achievements
                    </h1>
                    <p className="text-emerald-100 text-sm font-bold mt-1">Kinyui Boys Senior School</p>
                  </div>
                </div>
                <p className="text-lg text-white/90 leading-relaxed max-w-xl mt-4">
                  Celebrating excellence across academics, sports, arts, leadership, and cultural endeavors. Every achievement represents our commitment to holistic excellence.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={refreshData}
                  disabled={refreshing}
                  className="flex items-center gap-2 px-6 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full text-white font-bold text-sm hover:bg-white/30 transition-all disabled:opacity-50"
                >
                  {refreshing ? (
                    <>
                      <svg className="animate-spin h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Refreshing...
                    </>
                  ) : (
                    <>
                      <FiRotateCw />
                      Refresh
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Right Stats */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-white/70 text-sm font-semibold mb-1">Total Achievements</p>
                  <p className="text-4xl font-black text-white">{totalAchievements}</p>
                </div>
                <IoMedalOutline className="text-amber-300 text-3xl" />
              </div>
              <div className="border-t border-white/20 pt-4">
                <p className="text-white/70 text-sm font-semibold mb-1">Featured Honors</p>
                <p className="text-3xl font-black text-amber-300">{featuredCount}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Layout - Sidebar + Content */}
        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-8">
          {/* Left Sidebar */}
          <div className="hidden lg:block">
            <KinyuiStatsPanel stats={schoolStats} achievements={getAllAchievements()} />
          </div>

          {/* Main Content */}
          <div className="space-y-6">
            {/* Search & Filter */}
            <div className="bg-white rounded-[2rem] border border-slate-200 p-4 shadow-sm">
              <div className="flex flex-col md:flex-row gap-3">
                <div className="flex-1 relative">
                  <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="text"
                    placeholder="Search achievements..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>

                <select
                  value={activeCategory}
                  onChange={(e) => setActiveCategory(e.target.value)}
                  className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-semibold text-sm"
                >
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>

                <button
                  onClick={() => { setSearchTerm(''); setActiveCategory('all'); }}
                  className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold text-sm hover:bg-emerald-700 transition-colors flex items-center gap-2 whitespace-nowrap"
                >
                  <FiFilter size={16} />
                  Reset
                </button>

                <button
                  onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                  className="p-3 bg-slate-100 border border-slate-200 rounded-xl hover:bg-slate-200 transition-colors"
                >
                  {viewMode === 'grid' ? <FiList size={18} /> : <FiGrid size={18} />}
                </button>
              </div>
            </div>

            {/* Achievements Grid */}
            {filteredAchievements.length === 0 ? (
              <div className="bg-white rounded-[2rem] border border-slate-200 p-12 text-center shadow-sm">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiAward className="text-slate-300 text-2xl" />
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-2">No achievements found</h3>
                <p className="text-slate-600 mb-6">Try adjusting your filters or search terms.</p>
                <button
                  onClick={() => { setSearchTerm(''); setActiveCategory('all'); }}
                  className="px-6 py-2.5 bg-emerald-600 text-white rounded-lg font-bold text-sm hover:bg-emerald-700 transition-colors"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-6' : 'space-y-4'}>
                {filteredAchievements.map(achievement => (
                  <ModernAchievementCard
                    key={achievement.id}
                    achievement={achievement}
                    onView={setSelectedAchievement}
                    viewMode={viewMode}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Mobile Sidebar - Below Content */}
        <div className="lg:hidden">
          <KinyuiStatsPanel stats={schoolStats} achievements={getAllAchievements()} />
        </div>
      </div>

      {/* Detail Modal */}
      {selectedAchievement && (
        <AchievementDetailModal achievement={selectedAchievement} onClose={() => setSelectedAchievement(null)} />
      )}

      <style jsx global>{`
        input, select, textarea { font-size: 16px !important; }
      `}</style>
    </div>
  );
}
