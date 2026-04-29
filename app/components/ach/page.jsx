// app/components/ach/page.jsx - Client component for /pages/Achievements
'use client';

import { useState, useEffect } from 'react';
import { toast, Toaster } from 'sonner';
import {
  FiAward,
  FiArrowRight,
  FiSearch,
  FiFilter,
  FiRotateCw,
  FiGrid,
  FiList,
  FiX,
  FiChevronRight,
  FiChevronLeft,
  FiBookmark,
  FiCopy,
  FiStar,
  FiBookOpen,
  FiTrendingUp,
} from 'react-icons/fi';
import { IoSparkles, IoTrophyOutline } from 'react-icons/io5';
import { CircularProgress, Box, Stack } from '@mui/material';
import { FaFacebookF, FaTwitter, FaWhatsapp, FaTelegram, FaEnvelope } from 'react-icons/fa';

const ModernModal = ({ children, open, onClose, maxWidth = '800px', blur = true }) => {
  if (!open) return null;
  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${blur ? 'backdrop-blur-md' : 'bg-black/50'}`}>
      <div
        className="relative bg-white/95 rounded-3xl shadow-2xl animate-in zoom-in-95 duration-300 overflow-hidden border border-white/40"
        style={{
          width: '90%',
          maxWidth,
          maxHeight: '90vh',
          background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.95) 100%)',
        }}
      >
        <div className="absolute top-4 right-4 z-10">
          <button onClick={onClose} className="p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white cursor-pointer border border-gray-200 shadow-sm">
            <FiX className="text-gray-600 w-5 h-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

const GlassCard = ({ children, className = '' }) => (
  <div className={`bg-white/80 backdrop-blur-sm rounded-2xl border border-white/60 shadow-lg shadow-black/5 ${className}`}>{children}</div>
);

const ModernAchievementCard = ({ achievement, onView, viewMode = 'grid' }) => {
  const [isBookmarked, setIsBookmarked] = useState(false);

  const getCategoryStyle = (category) => {
    const styles = {
      Academic: { gradient: 'from-blue-600 to-indigo-600', text: 'text-blue-700', bg: 'bg-blue-50' },
      Sports: { gradient: 'from-rose-600 to-red-600', text: 'text-rose-700', bg: 'bg-rose-50' },
      Arts: { gradient: 'from-purple-600 to-pink-600', text: 'text-purple-700', bg: 'bg-purple-50' },
      Leadership: { gradient: 'from-amber-600 to-orange-600', text: 'text-amber-700', bg: 'bg-amber-50' },
      Cultural: { gradient: 'from-amber-600 to-emerald-600', text: 'text-amber-700', bg: 'bg-amber-50' },
      Debate: { gradient: 'from-cyan-600 to-blue-600', text: 'text-cyan-700', bg: 'bg-cyan-50' },
      Other: { gradient: 'from-slate-600 to-slate-700', text: 'text-slate-700', bg: 'bg-slate-50' },
    };
    return styles[category] || styles.Other;
  };

  const theme = getCategoryStyle(achievement.category);

  if (viewMode === 'grid') {
    return (
      <div onClick={() => onView(achievement)} className="group relative bg-white rounded-[2rem] border border-slate-100 p-4 pb-6 transition-all duration-200 cursor-pointer hover:shadow-xl">
        <div className="relative h-56 w-full rounded-[1.5rem] overflow-hidden mb-6">
          <img src={achievement.images?.[0]?.url || '/default-achievement.jpg'} alt={achievement.title} className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105" />

          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md rounded-2xl p-2 min-w-[60px] flex flex-col items-center shadow-xl border border-white/20">
            <span className="text-[10px] font-black uppercase tracking-tighter text-slate-400">Year</span>
            <span className="text-xl font-black text-slate-900 leading-none">{achievement.year}</span>
          </div>

          <div className="absolute top-4 right-4">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsBookmarked(!isBookmarked);
                toast.success(isBookmarked ? 'Removed bookmark' : 'Bookmarked!');
              }}
              className="w-10 h-10 bg-white/90 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-xl border border-white/20 hover:bg-white transition-colors"
            >
              <FiBookmark className={`w-5 h-5 ${isBookmarked ? 'text-emerald-600 fill-current' : 'text-slate-600'}`} />
            </button>
          </div>

          <div className="absolute bottom-4 left-4">
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${theme.bg} ${theme.text}`}>{achievement.category}</span>
          </div>
        </div>

        <h3 className="text-xl font-black text-slate-900 mb-2 line-clamp-2">{achievement.title}</h3>
        <p className="text-slate-600 text-sm line-clamp-2 mb-4">{achievement.description}</p>

        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center">
              <FiAward className="text-slate-500 text-sm" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Award</p>
              <p className="text-sm font-bold text-slate-700">{achievement.awardingBody || 'Kinyui Boys'}</p>
            </div>
          </div>
          <div className="flex items-center gap-1 text-emerald-600 font-bold text-sm">
            View <FiArrowRight className="text-sm" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div onClick={() => onView(achievement)} className="group bg-white rounded-[2rem] border border-slate-100 p-5 transition-all duration-200 cursor-pointer hover:shadow-xl flex gap-5">
      <div className="relative w-28 h-28 rounded-[1.5rem] overflow-hidden flex-shrink-0">
        <img src={achievement.images?.[0]?.url || '/default-achievement.jpg'} alt={achievement.title} className="w-full h-full object-cover" />
        <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-md rounded-xl px-2 py-1 text-xs font-black text-slate-900">{achievement.year}</div>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h3 className="text-lg font-black text-slate-900 mb-1 line-clamp-1">{achievement.title}</h3>
            <p className="text-slate-600 text-sm line-clamp-2">{achievement.description}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-bold ${theme.bg} ${theme.text} flex-shrink-0`}>{achievement.category}</span>
        </div>
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm font-bold text-slate-700">{achievement.awardingBody || 'Kinyui Boys'}</p>
          <div className="flex items-center gap-1 text-emerald-600 font-bold text-sm">
            Details <FiArrowRight className="text-sm" />
          </div>
        </div>
      </div>
    </div>
  );
};

const AchievementDetailModal = ({ achievement, onClose }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  if (!achievement) return null;

  const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/pages/Achievements` : '';

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success('Link copied!');
    } catch {
      toast.error('Failed to copy link');
    }
  };

  const socialPlatforms = [
    {
      name: 'WhatsApp',
      icon: FaWhatsapp,
      color: 'bg-[#25D366]',
      hoverColor: 'hover:bg-[#128C7E]',
      action: () => {
        const text = `${achievement.title}\n\n🏆 Achievement:\n${achievement.description?.substring(0, 120)}...\n\n${shareUrl}`;
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
      },
    },
    { name: 'Facebook', icon: FaFacebookF, color: 'bg-[#1877F2]', hoverColor: 'hover:bg-[#0d65d9]', action: () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank') },
    {
      name: 'Twitter',
      icon: FaTwitter,
      color: 'bg-[#1DA1F2]',
      hoverColor: 'hover:bg-[#0c85d0]',
      action: () => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(`${achievement.title} - School achievement`)}&url=${encodeURIComponent(shareUrl)}`, '_blank'),
    },
    {
      name: 'Telegram',
      icon: FaTelegram,
      color: 'bg-[#0088cc]',
      hoverColor: 'hover:bg-[#0077b5]',
      action: () => window.open(`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(`${achievement.title}\n\n${achievement.description?.substring(0, 120)}...`)}`, '_blank'),
    },
    {
      name: 'Email',
      icon: FaEnvelope,
      color: 'bg-slate-600',
      hoverColor: 'hover:bg-slate-700',
      action: () => {
        const subject = `${achievement.title} - School Achievement`;
        const body = `${achievement.description}\n\n${shareUrl}`;
        window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      },
    },
  ];

  return (
    <ModernModal open={!!achievement} onClose={onClose} maxWidth="1000px">
      <div className="p-6 sm:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="relative w-full h-72 rounded-3xl overflow-hidden bg-slate-100">
              <img src={achievement.images?.[currentImageIndex]?.url || '/default-achievement.jpg'} alt={achievement.title} className="w-full h-full object-cover" />
              {achievement.images?.length > 1 && (
                <>
                  <button onClick={() => setCurrentImageIndex((prev) => (prev === 0 ? achievement.images.length - 1 : prev - 1))} className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
                    <FiChevronLeft />
                  </button>
                  <button onClick={() => setCurrentImageIndex((prev) => (prev === achievement.images.length - 1 ? 0 : prev + 1))} className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
                    <FiChevronRight />
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold">{achievement.category}</span>
                <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-bold">{achievement.year}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">{achievement.title}</h2>
              <p className="text-slate-600 mt-3 leading-relaxed">{achievement.description}</p>
            </div>

            <GlassCard className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Share</p>
                  <p className="text-sm font-black text-slate-900">Tell others</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={handleCopyLink} className="w-11 h-11 bg-slate-100 rounded-2xl flex items-center justify-center hover:bg-slate-200 transition-colors" title="Copy link">
                    <FiCopy />
                  </button>
                  {socialPlatforms.slice(0, 3).map((platform) => {
                    const Icon = platform.icon;
                    return (
                      <button key={platform.name} onClick={platform.action} className={`w-11 h-11 ${platform.color} ${platform.hoverColor} text-white rounded-2xl flex items-center justify-center transition-colors`} title={platform.name}>
                        <Icon />
                      </button>
                    );
                  })}
                </div>
              </div>
            </GlassCard>

            <button onClick={onClose} className="w-full px-6 py-3 bg-emerald-600 text-white rounded-2xl font-black hover:bg-emerald-700 transition-colors">
              Close
            </button>
          </div>
        </div>
      </div>
    </ModernModal>
  );
};

const KinyuiStatsPanel = ({ achievements }) => {
  const allAchievements = achievements || [];
  const totalAchievements = allAchievements.length;
  const latestYear = allAchievements.length > 0 ? Math.max(...allAchievements.map((a) => Number(a.year) || 0)) : 'N/A';
  const featuredCount = allAchievements.filter((a) => a.featured).length;

  return (
    <div className="space-y-4 sticky top-6">
      <div className="bg-slate-950 rounded-[2rem] p-6 text-white overflow-hidden relative">
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-500/20 rounded-full blur-3xl" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
              <IoTrophyOutline className="text-2xl text-amber-400" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-300">Kinyui Boys</p>
              <h3 className="text-lg font-black">Achievements</h3>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total</p>
              <p className="text-3xl font-black">{totalAchievements}</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Latest</p>
              <p className="text-3xl font-black">{latestYear}</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Featured</p>
              <p className="text-3xl font-black">{featuredCount}</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Scope</p>
              <p className="text-sm font-black text-amber-300 mt-2">All categories</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function AchievementsClientPage() {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedAchievement, setSelectedAchievement] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [viewMode, setViewMode] = useState('grid');

  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'Academic', name: 'Academic' },
    { id: 'Sports', name: 'Sports' },
    { id: 'Arts', name: 'Arts' },
    { id: 'Leadership', name: 'Leadership' },
    { id: 'Cultural', name: 'Cultural' },
    { id: 'Debate', name: 'Debate' },
    { id: 'Other', name: 'Other' },
  ];

  const fetchData = async () => {
    try {
      const response = await fetch('/api/achievements');
      if (!response.ok) throw new Error('Failed to fetch achievements');
      const data = await response.json();
      setAchievements(data.achievements || data || []);
    } catch {
      toast.error('Failed to load achievements');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const refreshData = () => {
    setRefreshing(true);
    fetchData();
  };

  const filteredAchievements = (achievements || []).filter((achievement) => {
    const title = (achievement.title || '').toLowerCase();
    const description = (achievement.description || '').toLowerCase();
    const q = searchTerm.toLowerCase();
    const matchesSearch = title.includes(q) || description.includes(q);
    const matchesCategory = activeCategory === 'all' || achievement.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <Box className="min-h-[70vh] flex items-center justify-center p-4 bg-transparent">
        <Stack spacing={2} alignItems="center" className="w-full transition-all duration-500">
          <Box className="relative flex items-center justify-center scale-90 sm:scale-110">
            <CircularProgress variant="determinate" value={100} size={48} thickness={4.5} sx={{ color: '#f1f5f9' }} />
            <CircularProgress variant="indeterminate" disableShrink size={48} thickness={4.5} sx={{ color: '#0f172a', animationDuration: '1000ms', position: 'absolute', '& .MuiCircularProgress-circle': { strokeLinecap: 'round' } }} />
            <Box className="absolute">
              <IoSparkles className="text-emerald-600 text-sm animate-pulse" />
            </Box>
          </Box>
          <div className="text-center px-4">
            <p className="text-slate-900 font-medium text-sm sm:text-base tracking-tight italic">Loading school achievements...</p>
            <p className="text-slate-400 text-[10px] sm:text-xs uppercase tracking-widest mt-1 font-bold">Kinyui Boys Senior School</p>
          </div>
        </Stack>
      </Box>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-emerald-50/20 to-amber-50/10 p-4 md:p-6">
      <Toaster position="top-right" richColors />
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="relative bg-slate-950 p-4 sm:p-8 overflow-hidden rounded-md md:rounded-lg">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-emerald-600/20 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-amber-600/10 rounded-full blur-[120px] pointer-events-none" />
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="flex flex-col gap-4 mb-6 sm:mb-10">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-md border border-white/20">
                  <IoSparkles className="text-amber-400 text-sm" />
                  <span className="text-slate-200 font-normal text-xs uppercase tracking-widest">Honors & Awards</span>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="max-w-full">
                    <h1 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
                      Kinyui Boys Senior School <span className="bg-gradient-to-r from-emerald-400 to-amber-400 bg-clip-text text-transparent">Achievements</span>
                    </h1>
                    <p className="text-slate-300 text-sm sm:text-base mt-2 font-normal leading-relaxed max-w-2xl">
                      Celebrate our milestones across academics, sports, arts, leadership, and community impact.
                    </p>
                  </div>
                  <div className="flex items-center gap-3 w-full sm:w-auto mt-4">
                    <button onClick={refreshData} disabled={refreshing} className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-white hover:bg-slate-50 text-slate-900 font-medium text-sm transition-all active:scale-95 disabled:opacity-70 shadow-sm">
                      {refreshing ? <div className="w-3.5 h-3.5 border-2 border-slate-900/20 border-t-slate-900 rounded-full animate-spin" /> : <FiRotateCw className="text-sm" />}
                      <span>{refreshing ? 'Updating...' : 'Refresh Achievements'}</span>
                    </button>
                    <div className="flex bg-white/10 backdrop-blur-md rounded-lg p-1 border border-white/10">
                      <button onClick={() => setViewMode('grid')} className={`p-2 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-white text-slate-900' : 'text-slate-300 hover:text-white'}`}>
                        <FiGrid size={18} />
                      </button>
                      <button onClick={() => setViewMode('list')} className={`p-2 rounded-md transition-colors ${viewMode === 'list' ? 'bg-white text-slate-900' : 'text-slate-300 hover:text-white'}`}>
                        <FiList size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mb-10">
          {[
            { label: 'Total', value: achievements.length, gradient: 'from-emerald-600 to-teal-600', icon: FiAward },
            { label: 'Featured', value: achievements.filter((a) => a.featured).length, gradient: 'from-amber-600 to-orange-600', icon: FiStar },
            { label: 'Academic', value: achievements.filter((a) => a.category === 'Academic').length, gradient: 'from-blue-600 to-indigo-600', icon: FiBookOpen },
            { label: 'Sports', value: achievements.filter((a) => a.category === 'Sports').length, gradient: 'from-rose-600 to-red-600', icon: FiTrendingUp },
          ].map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className="group relative bg-white rounded-[2rem] border border-slate-100 p-4 transition-all duration-200 hover:shadow-xl">
                <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${stat.gradient} opacity-0 group-hover:opacity-100 transition-opacity`} />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-black uppercase tracking-wider text-slate-400 mb-1">{stat.label}</p>
                    <p className="text-2xl sm:text-3xl font-black text-slate-900">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-2xl bg-gradient-to-br ${stat.gradient} text-white shadow-lg shadow-emerald-500/20`}>
                    <Icon className="text-xl" />
                  </div>
                </div>
                <div className={`absolute -bottom-6 -right-6 w-24 h-24 blur-3xl opacity-10 rounded-full bg-gradient-to-br ${stat.gradient}`} />
              </div>
            );
          })}
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="hidden lg:block w-full lg:w-[320px] flex-shrink-0">
            <KinyuiStatsPanel achievements={achievements} />
          </div>

          <div className="flex-1 space-y-6">
            <div className="bg-white rounded-[24px] sm:rounded-[32px] border border-slate-200 p-4 sm:p-6 shadow-sm">
              <div className="flex flex-col md:flex-row gap-3 md:items-center">
                <div className="relative flex-1">
                  <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="text"
                    placeholder="Search achievements..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm font-medium"
                  />
                </div>

                <div className="relative flex-1 md:flex-none min-w-0">
                  <select
                    value={activeCategory}
                    onChange={(e) => setActiveCategory(e.target.value)}
                    className="w-full md:w-52 appearance-none px-4 py-3 bg-slate-50 md:bg-transparent border border-slate-200 md:border-none rounded-2xl md:rounded-full font-medium text-slate-600 text-sm cursor-pointer focus:ring-2 focus:ring-emerald-500/20 transition-all"
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSearchTerm('');
                    setActiveCategory('all');
                  }}
                  className="p-3 md:px-6 md:py-3 bg-emerald-600 text-white rounded-2xl md:rounded-full font-bold text-sm shadow-md shadow-emerald-200 hover:bg-emerald-700 active:scale-95 transition-all flex items-center justify-center gap-2 flex-shrink-0"
                >
                  <FiFilter className="w-4 h-4" />
                  <span className="hidden md:inline">Reset</span>
                  <span className="md:hidden text-[10px] font-bold">Clear</span>
                </button>
              </div>
            </div>

            {/* Category Pills (match Gallery structure) */}
            <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar -mx-2 px-2">
              {categories.map((category) => {
                const isActive = activeCategory === category.id;
                return (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`px-3.5 sm:px-5 py-1.5 sm:py-2.5 rounded-full whitespace-nowrap text-[11px] sm:text-sm font-bold transition-all border ${
                      isActive ? 'bg-emerald-600 border-emerald-600 text-white shadow-md shadow-emerald-100' : 'bg-white border-slate-200 text-slate-600'
                    }`}
                  >
                    {category.name}
                  </button>
                );
              })}
            </div>

            <div className="relative">
              {filteredAchievements.length === 0 ? (
                <div className="bg-slate-50 rounded-[24px] sm:rounded-[32px] border-2 border-dashed border-slate-200 py-8 sm:py-16 text-center">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm">
                    <FiAward className="text-slate-300 text-xl sm:text-2xl" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">No achievements found</h3>
                  <p className="text-slate-500 text-xs sm:text-sm mt-1 mb-4">Try adjusting your filters or search terms.</p>
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setActiveCategory('all');
                    }}
                    className="px-4 sm:px-6 py-2 sm:py-2.5 bg-white border border-slate-200 rounded-full font-bold text-slate-700 hover:bg-slate-50 transition-all text-xs sm:text-sm"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6' : 'space-y-3 sm:space-y-4'}>
                  {filteredAchievements.map((achievement) => (
                    <ModernAchievementCard key={achievement.id} achievement={achievement} onView={setSelectedAchievement} viewMode={viewMode} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="lg:hidden">
          <KinyuiStatsPanel achievements={achievements} />
        </div>
      </div>

      {selectedAchievement && <AchievementDetailModal achievement={selectedAchievement} onClose={() => setSelectedAchievement(null)} />}

      <style jsx global>{`
        input,
        select,
        textarea {
          font-size: 16px !important;
        }
      `}</style>
    </div>
  );
}
