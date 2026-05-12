'use client';

import { useState, useEffect, useMemo } from 'react';
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
  FiCamera,
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
  FiActivity,
  FiInfo,
  FiFolder
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
import Head from 'next/head';

// ==================== MODERN MODAL (Glass Morphism) ====================
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

// ==================== GLASS CARD COMPONENT ====================
const GlassCard = ({ children, className = '', hover = true }) => (
  <div className={`
    bg-white/80 backdrop-blur-sm rounded-2xl border border-white/60 
    shadow-lg shadow-black/5 transition-all duration-300
    ${hover ? 'hover:shadow-xl hover:shadow-black/10 hover:-translate-y-1' : ''}
    ${className}
  `}>
    {children}
  </div>
);

// ==================== MODERN SHARE MODAL ====================
const ModernShareModal = ({ achievement, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!achievement) return null;

  const shareUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/pages/Achievements`
    : '';

  const socialPlatforms = [
    {
      name: 'WhatsApp',
      icon: FaWhatsapp,
      color: 'bg-[#25D366]',
      hoverColor: 'hover:bg-[#128C7E]',
      action: () => {
        const text = `${achievement.title}\n\n🏆 Achievement:\n${achievement.description?.substring(0, 100)}...\n\n${shareUrl}`;
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
      }
    },
    {
      name: 'Facebook',
      icon: FaFacebookF,
      color: 'bg-[#1877F2]',
      hoverColor: 'hover:bg-[#0d65d9]',
      action: () => {
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
      }
    },
    {
      name: 'Twitter',
      icon: FaTwitter,
      color: 'bg-[#1DA1F2]',
      hoverColor: 'hover:bg-[#0c85d0]',
      action: () => {
        const text = `${achievement.title} - Check out this school achievement!`;
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`, '_blank');
      }
    },
    {
      name: 'Telegram',
      icon: FaTelegram,
      color: 'bg-[#0088cc]',
      hoverColor: 'hover:bg-[#0077b5]',
      action: () => {
        const text = `${achievement.title}\n\n${achievement.description?.substring(0, 100)}...`;
        window.open(`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(text)}`, '_blank');
      }
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
      }
    }
  ];

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      toast.success('Link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const getCategoryStyle = (category) => {
    const styles = {
      Academic: { gradient: 'from-blue-600 to-indigo-600', shadow: 'shadow-blue-500/20', text: 'text-blue-700', bg: 'bg-blue-50' },
      Sports: { gradient: 'from-rose-600 to-red-600', shadow: 'shadow-rose-500/20', text: 'text-rose-700', bg: 'bg-rose-50' },
      Arts: { gradient: 'from-purple-600 to-pink-600', shadow: 'shadow-purple-500/20', text: 'text-purple-700', bg: 'bg-purple-50' },
      Leadership: { gradient: 'from-amber-600 to-orange-600', shadow: 'shadow-amber-500/20', text: 'text-amber-700', bg: 'bg-amber-50' },
      Cultural: { gradient: 'from-amber-600 to-emerald-600', shadow: 'shadow-amber-500/20', text: 'text-amber-700', bg: 'bg-amber-50' },
      Debate: { gradient: 'from-cyan-600 to-blue-600', shadow: 'shadow-cyan-500/20', text: 'text-cyan-700', bg: 'bg-cyan-50' },
      Other: { gradient: 'from-slate-600 to-slate-700', shadow: 'shadow-slate-500/20', text: 'text-slate-700', bg: 'bg-slate-50' }
    };
    return styles[category] || styles.Other;
  };

  const theme = getCategoryStyle(achievement.category);

  return (
    <ModernModal open={true} onClose={onClose} maxWidth="480px">
      {/* Dark Header */}
      <div className="bg-[#2D1B14] p-6 sm:p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 sm:w-32 h-24 sm:h-32 bg-amber-500/10 blur-3xl rounded-full -mr-16 -mt-16" />
        <div className="absolute bottom-0 left-0 w-20 sm:w-24 h-20 sm:h-24 bg-rose-500/5 blur-2xl rounded-full -ml-12 -mb-12" />
        
        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="w-10 h-10 sm:w-14 sm:h-14 bg-white/5 backdrop-blur-xl rounded-xl sm:rounded-2xl flex items-center justify-center mb-3 sm:mb-4 border border-white/10 shadow-2xl">
            <IoShareSocialOutline className="text-xl sm:text-2xl text-amber-200" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight italic">
            Share Achievement
          </h2>
          <p className="text-amber-100/50 text-[10px] sm:text-xs mt-1 uppercase tracking-[0.15em] sm:tracking-[0.2em] font-medium">
            Celebrate excellence
          </p>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-4 sm:p-6 md:p-8 bg-white">
        {/* Achievement Preview */}
        <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-slate-50 rounded-xl sm:rounded-2xl border border-slate-100 mb-6 sm:mb-8">
          <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl overflow-hidden bg-gradient-to-r ${theme.gradient} shrink-0 flex items-center justify-center`}>
            <IoMedalOutline className="text-white text-xl" />
          </div>
          <div className="min-w-0">
            <h4 className="font-black text-slate-900 text-xs sm:text-sm truncate uppercase">{achievement.title}</h4>
            <p className="text-[8px] sm:text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              {achievement.category} • {achievement.year}
            </p>
          </div>
        </div>

        {/* Social Platforms Grid */}
        <div className="grid grid-cols-3 sm:flex sm:flex-wrap justify-center gap-4 sm:gap-5 md:gap-6 mb-6 sm:mb-8 md:mb-10">
          {socialPlatforms.map((platform, index) => {
            const Icon = platform.icon;
            return (
              <button
                key={index}
                onClick={platform.action}
                className="flex flex-col items-center gap-1.5 sm:gap-2 md:gap-2.5 group transition-transform active:scale-90"
              >
                <div className={`w-12 h-12 sm:w-14 sm:h-14 md:w-14 md:h-14 rounded-2xl sm:rounded-[20px] flex items-center justify-center text-white shadow-lg transition-all duration-300 ${platform.color} ${platform.hoverColor} group-hover:shadow-xl group-hover:-translate-y-1`}>
                  <Icon className="text-xl sm:text-2xl" />
                </div>
                <span className="text-[9px] sm:text-[10px] font-bold text-slate-500">
                  {platform.name}
                </span>
              </button>
            );
          })}
        </div>

        {/* Link Section */}
        <div className="space-y-2 sm:space-y-3">
          <label className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
            Page Link
          </label>
          
          <div className="relative flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-0">
            <div className="w-full p-3 sm:p-4 bg-slate-50 rounded-xl sm:rounded-2xl border border-slate-100 text-[10px] sm:text-xs font-medium text-slate-400 truncate sm:pr-28">
              {shareUrl}
            </div>
            
            <button
              onClick={copyToClipboard}
              className={`sm:absolute right-1.5 px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg sm:rounded-xl font-bold text-[11px] sm:text-xs transition-all flex items-center justify-center gap-1.5 sm:gap-2 ${
                copied 
                ? 'bg-emerald-500 text-white shadow-emerald-200' 
                : 'bg-[#2D1B14] text-white hover:bg-[#3d2a22] shadow-lg shadow-stone-200'
              }`}
            >
              {copied ? 'Copied!' : <><FiCopy className="text-xs sm:text-sm" /> Copy</>}
            </button>
          </div>
        </div>
      </div>
    </ModernModal>
  );
};

// ==================== MODERN STAT CARD ====================
const ModernStatCard = ({ stat }) => {
  const Icon = stat.icon;
  
  return (
    <div className="group relative overflow-hidden bg-white hover:bg-slate-50 transition-all duration-300 border border-slate-200/60 p-5 rounded-[2rem] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]">
      <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${stat.gradient} opacity-0 group-hover:opacity-100 transition-opacity`} />
      <div className="flex items-center gap-4 mb-4">
        <div className={`flex-shrink-0 p-3 rounded-2xl bg-gradient-to-br ${stat.gradient} text-white shadow-lg shadow-purple-500/20`}>
          <Icon className="text-xl" />
        </div>
        <div className="flex flex-col">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            {stat.label}
          </p>
        </div>
      </div>
      <div className="relative z-10">
        <p className="text-sm font-semibold text-slate-700 leading-snug">
          {stat.sublabel}
        </p>
      </div>
      <div className={`absolute -bottom-6 -right-6 w-24 h-24 blur-3xl opacity-10 rounded-full bg-gradient-to-br ${stat.gradient}`} />
    </div>
  );
};

// ==================== MODERN ACHIEVEMENT CARD ====================
const ModernAchievementCard = ({ achievement, onView, onFavorite, viewMode = 'grid', onShare }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const getCategoryStyle = (category) => {
    const styles = {
      Academic: { gradient: 'from-blue-600 to-indigo-600', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', iconBg: 'bg-blue-100', iconColor: 'text-blue-600' },
      Sports: { gradient: 'from-rose-600 to-red-600', bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200', iconBg: 'bg-rose-100', iconColor: 'text-rose-600' },
      Arts: { gradient: 'from-purple-600 to-pink-600', bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', iconBg: 'bg-purple-100', iconColor: 'text-purple-600' },
      Leadership: { gradient: 'from-amber-600 to-orange-600', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', iconBg: 'bg-amber-100', iconColor: 'text-amber-600' },
      Cultural: { gradient: 'from-amber-600 to-emerald-600', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', iconBg: 'bg-amber-100', iconColor: 'text-amber-600' },
      Debate: { gradient: 'from-cyan-600 to-blue-600', bg: 'bg-cyan-50', text: 'text-cyan-700', border: 'border-cyan-200', iconBg: 'bg-cyan-100', iconColor: 'text-cyan-600' },
      Other: { gradient: 'from-slate-600 to-slate-700', bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-200', iconBg: 'bg-slate-100', iconColor: 'text-slate-600' }
    };
    return styles[category] || styles.Other;
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch { return achievement.year || 'Recently added'; }
  };

  const getImageAltText = (achievement, index = 0) => {
    const schoolName = "Kinyui Boys Senior School";
    const category = achievement.category || 'Achievement';
    const year = achievement.year || new Date().getFullYear();
    const title = achievement.title || 'Achievement';
    return `${schoolName} - ${title} - ${category} Award - ${year} - Photo ${index + 1}`;
  };

  if (viewMode === 'grid') {
    const theme = getCategoryStyle(achievement.category);
    
    return (
      <div 
        onClick={() => onView(achievement)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative group cursor-pointer"
        itemScope
        itemType="https://schema.org/Achievement"
      >
        <div className="relative bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
          {/* Image Container */}
          <div className="relative h-52 w-full shrink-0 bg-gradient-to-br from-slate-100 to-slate-200">
            {achievement.images?.[0]?.url ? (
              <>
                <img
                  src={achievement.images[0].url}
                  alt={getImageAltText(achievement, 0)}
                  title={getImageAltText(achievement, 0)}
                  loading="lazy"
                  className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                  onLoad={() => setImageLoaded(true)}
                  onError={() => setImageError(true)}
                  itemProp="image"
                />
                <meta itemProp="caption" content={achievement.description || `${achievement.title} achievement at Kinyui Boys Senior School`} />
                <meta itemProp="datePublished" content={achievement.year} />
                <meta itemProp="contentLocation" content="Kinyui Boys Senior School, Matungulu, Machakos County, Kenya" />
              </>
            ) : (
              <div className={`w-full h-full bg-gradient-to-br ${theme.gradient} flex items-center justify-center`}>
                <IoMedalOutline className="text-white text-4xl opacity-50" />
              </div>
            )}
            
            {!imageLoaded && !imageError && (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-100">
                <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
              </div>
            )}
            
            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm border ${theme.bg} ${theme.text} ${theme.border}`}>
                {achievement.category}
              </span>
              {achievement.year && (
                <span className="px-3 py-1 bg-slate-900/90 backdrop-blur-md text-white rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1 shadow-sm">
                  <IoSparkles className="text-amber-400" /> {achievement.year}
                </span>
              )}
            </div>

            {/* Action Buttons */}
            <div className="absolute top-4 right-4 flex gap-2">
              <button
                onClick={(e) => { e.stopPropagation(); onShare(achievement); }}
                className="p-2.5 rounded-xl backdrop-blur-md border shadow-sm bg-white/90 border-white/10 text-slate-700 hover:bg-white"
                aria-label={`Share ${achievement.title} achievement`}
              >
                <FiShare2 size={16} />
              </button>
              
              <button
                onClick={(e) => { e.stopPropagation(); onFavorite(achievement); setIsFavorite(!isFavorite); }}
                className={`p-2.5 rounded-xl backdrop-blur-md border shadow-sm ${isFavorite ? 'bg-amber-500 border-amber-500 text-white' : 'bg-white/90 border-white/10 text-slate-700 hover:bg-white'}`}
                aria-label={`Favorite ${achievement.title} achievement`}
              >
                <FiBookmark className={`${isFavorite ? 'fill-current' : ''} w-3.5 h-3.5`} />
              </button>
            </div>

            {/* Awarding Body Overlay */}
            <div className="absolute bottom-0 inset-x-0 h-12 bg-gradient-to-t from-black/40 to-transparent flex items-end p-4">
              <span className="text-[10px] font-bold text-white uppercase tracking-widest">
                {achievement.awardingBody || 'School Award'}
              </span>
            </div>
          </div>

          {/* Content Area */}
          <div className="p-4 sm:p-6" itemProp="description">
            <h3 className="text-base sm:text-xl font-bold text-slate-900 mb-2 line-clamp-2 leading-tight" itemProp="name">
              {achievement.title}
            </h3>
            
            <p className="text-slate-500 text-xs sm:text-sm mb-4 sm:mb-6 line-clamp-2 leading-relaxed" itemProp="abstract">
              {achievement.description || `${achievement.title} - ${achievement.category} achievement at Kinyui Boys Senior School.`}
            </p>

            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-4 sm:mb-6">
              <div className="flex items-center gap-1.5 sm:gap-2.5 p-1.5 sm:p-2 rounded-xl sm:rounded-2xl bg-slate-50 border border-slate-100/50">
                <div className={`p-1 sm:p-1.5 rounded-lg ${theme.iconBg}`}>
                  <FiCalendar className={`${theme.iconColor}`} size={12} />
                </div>
                <span className="text-[9px] sm:text-[11px] font-bold text-slate-700 uppercase tracking-tight">
                  <time dateTime={achievement.year}>{achievement.year}</time>
                </span>
              </div>

              <div className="flex items-center gap-1.5 sm:gap-2.5 p-1.5 sm:p-2 rounded-xl sm:rounded-2xl bg-slate-50 border border-slate-100/50">
                <div className={`p-1 sm:p-1.5 rounded-lg ${theme.iconBg}`}>
                  <FiUsers className={`${theme.iconColor}`} size={12} />
                </div>
                <span className="text-[9px] sm:text-[11px] font-bold text-slate-700 uppercase tracking-tight truncate">
                  {achievement.recipients?.length || 0} Recipient(s)
                </span>
              </div>

              <div className="col-span-2 flex items-center gap-1.5 sm:gap-2.5 p-1.5 sm:p-2 rounded-xl sm:rounded-2xl bg-slate-50 border border-slate-100/50">
                <div className={`p-1 sm:p-1.5 rounded-lg ${theme.iconBg}`}>
                  <FiAward className={`${theme.iconColor}`} size={12} />
                </div>
                <span className="text-[9px] sm:text-[11px] font-bold text-slate-700 uppercase tracking-tight truncate">
                  {achievement.awardingBody || 'School Award'}
                </span>
              </div>
            </div>

            {/* Status Indicator */}
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-500 animate-pulse`} />
                <span className="text-[8px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <span itemProp="creativeWorkStatus">Official Recognition</span>
                </span>
              </div>
              
              <div className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[8px] sm:text-[10px] font-black uppercase tracking-widest border ${theme.bg} ${theme.text} ${theme.border}`}>
                {achievement.featured ? '🏆 Featured' : 'Achievement'}
              </div>
            </div>

            {/* Action Button */}
            <button className="w-full py-2.5 sm:py-3 bg-slate-900 text-white rounded-xl sm:rounded-2xl font-semibold text-xs sm:text-sm flex items-center justify-center gap-1.5 sm:gap-2 active:scale-[0.98] transition-transform hover:shadow-lg group-hover:bg-purple-600">
              <FiEye size={14} className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>View Details</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // List View
  const theme = getCategoryStyle(achievement.category);
  return (
    <div 
      onClick={() => onView(achievement)}
      className="relative bg-white rounded-[24px] border border-slate-100 p-4 shadow-sm cursor-pointer transition-colors active:bg-slate-50 group"
      itemScope
      itemType="https://schema.org/Achievement"
    >
      <div className="flex gap-3 sm:gap-5">
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl sm:rounded-2xl overflow-hidden shrink-0 shadow-sm">
          {achievement.images?.[0]?.url ? (
            <img src={achievement.images[0].url} alt={getImageAltText(achievement, 0)} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          ) : (
            <div className={`w-full h-full bg-gradient-to-br ${theme.gradient}`} />
          )}
        </div>

        <div className="flex-1 min-w-0 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1.5 sm:mb-2">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className={`px-1.5 sm:px-2.5 py-0.5 rounded-lg text-[8px] sm:text-[10px] font-black uppercase tracking-widest border ${theme.bg} ${theme.text} ${theme.border}`}>
                  {achievement.category}
                </span>
                <span className="text-[8px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                  {achievement.year}
                </span>
              </div>
              
              <div className="flex items-center gap-0.5 sm:gap-1">
                <button onClick={(e) => { e.stopPropagation(); onShare(achievement); }} className="p-1 sm:p-1.5 rounded-lg text-slate-300 hover:text-slate-500">
                  <FiShare2 size={12} />
                </button>
                <button onClick={(e) => { e.stopPropagation(); onFavorite(achievement); setIsFavorite(!isFavorite); }} className={`p-1 sm:p-1.5 rounded-lg ${isFavorite ? 'text-amber-500 bg-amber-50' : 'text-slate-300 hover:text-slate-500'}`}>
                  <FiBookmark className={isFavorite ? 'fill-current' : ''} size={12} />
                </button>
              </div>
            </div>

            <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug line-clamp-2 mb-1 sm:mb-2" itemProp="name">
              {achievement.title}
            </h3>
            <p className="text-slate-500 text-xs line-clamp-2 mb-2 sm:mb-3" itemProp="abstract">
              {achievement.description || 'School achievement.'}
            </p>
          </div>

          <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-100">
            <div className="flex items-center gap-2 sm:gap-4 text-xs text-slate-500">
              <div className="flex items-center gap-0.5 sm:gap-1">
                <IoMedalOutline className="text-slate-400 w-3 h-3" />
                <span className="font-semibold text-[10px] sm:text-xs">{achievement.awardingBody || 'School Award'}</span>
              </div>
              <div className="flex items-center gap-0.5 sm:gap-1">
                <FiUsers className="text-slate-400 w-3 h-3" />
                <span className="text-[10px] sm:text-xs">{achievement.recipients?.length || 0} Recipients</span>
              </div>
            </div>
            <div className="flex items-center gap-0.5 sm:gap-1 text-purple-600 font-bold text-[9px] sm:text-[11px] uppercase tracking-wider group-hover:translate-x-1 transition-transform">
              View <FiArrowRight size={12} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==================== MODERN ACHIEVEMENT DETAIL MODAL ====================
const AchievementDetailModal = ({ achievement, onClose, onShare }) => {
  if (!achievement) return null;

  const getCategoryStyle = (category) => {
    const styles = {
      Academic: { gradient: 'from-blue-500 to-indigo-600', icon: FiBookOpen },
      Sports: { gradient: 'from-rose-500 to-red-600', icon: FiAward },
      Arts: { gradient: 'from-purple-500 to-pink-600', icon: FiStar },
      Leadership: { gradient: 'from-amber-500 to-orange-600', icon: FiUsers },
      Cultural: { gradient: 'from-amber-500 to-emerald-600', icon: IoSparkles },
      Debate: { gradient: 'from-cyan-500 to-blue-600', icon: FiTarget },
      Other: { gradient: 'from-slate-500 to-slate-600', icon: FiAward }
    };
    return styles[achievement.category] || styles.Other;
  };

  const categoryStyle = getCategoryStyle(achievement.category);
  const CategoryIcon = categoryStyle.icon;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 sm:p-4 bg-slate-900/90 backdrop-blur-sm">
      <div className="relative w-full h-full sm:h-auto sm:max-h-[90vh] sm:max-w-3xl bg-white sm:rounded-[40px] shadow-2xl overflow-hidden flex flex-col">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-5 sm:right-5 z-50 p-2 bg-black/20 backdrop-blur-md text-white rounded-full border border-white/20 transition-all active:scale-90"
        >
          <IoClose size={20} />
        </button>

        {/* Hero Image */}
        <div className="relative h-[30vh] sm:h-[350px] w-full shrink-0">
          {achievement.images?.[0]?.url ? (
            <img
              src={achievement.images[0].url}
              alt={achievement.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className={`w-full h-full bg-gradient-to-r ${categoryStyle.gradient}`} />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-black/20" />
          
          {/* Badges */}
          <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 flex gap-2">
            <span className="px-3 py-1 sm:px-4 sm:py-1.5 bg-white shadow-xl rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-widest text-slate-900">
              {achievement.category}
            </span>
            <span className="px-3 py-1 sm:px-4 sm:py-1.5 bg-slate-900 text-white rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-widest flex items-center gap-1">
              <IoSparkles className="text-amber-400 text-xs sm:text-sm" /> {achievement.year}
            </span>
            {achievement.featured && (
              <span className="px-3 py-1 sm:px-4 sm:py-1.5 bg-amber-500 text-white rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-widest flex items-center gap-1">
                <IoSparkles className="text-white text-xs sm:text-sm" /> Featured
              </span>
            )}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-10 bg-white">
          <div className="max-w-2xl mx-auto space-y-5 sm:space-y-8">
            
            {/* Title Section */}
            <section className="space-y-3 sm:space-y-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className={`p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-gradient-to-r ${categoryStyle.gradient}`}>
                  <CategoryIcon className="text-white text-lg sm:text-2xl" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl md:text-4xl font-black text-slate-900 leading-tight tracking-tight">
                    {achievement.title}
                  </h2>
                  <p className="text-slate-600 text-sm sm:text-base md:text-lg">{achievement.awardingBody || 'School Award'}</p>
                </div>
              </div>

              {/* Quick Info */}
              <div className="flex flex-wrap gap-y-2 sm:gap-y-3 gap-x-3 sm:gap-x-6 text-xs sm:text-sm font-semibold text-slate-500">
                <div className="flex items-center gap-1 sm:gap-2">
                  <FiCalendar className="text-blue-500 text-sm sm:text-lg" />
                  {achievement.year}
                </div>
                {achievement.recipients?.length > 0 && (
                  <div className="flex items-center gap-1 sm:gap-2">
                    <IoPersonOutline className="text-emerald-500 text-sm sm:text-lg" />
                    {achievement.recipients.length} Recipient(s)
                  </div>
                )}
                <div className="flex items-center gap-1 sm:gap-2">
                  <IoLocationOutline className="text-rose-500 text-sm sm:text-lg" />
                  Kinyui Boys, Machakos
                </div>
              </div>
            </section>

            {/* Description */}
            <section className="space-y-3 sm:space-y-4">
              <h3 className="text-[10px] sm:text-xs font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] text-slate-400">Description</h3>
              <p className="text-slate-700 leading-snug sm:leading-relaxed text-sm sm:text-base md:text-lg break-words">
                {achievement.description || 'No description available.'}
              </p>
            </section>

            {/* Recipients */}
            {achievement.recipients?.length > 0 && (
              <section className="space-y-3 sm:space-y-4">
                <h3 className="text-[10px] sm:text-xs font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] text-slate-400">Recipients</h3>
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  {achievement.recipients.map((recipient, idx) => (
                    <span key={idx} className="px-3 sm:px-4 py-1.5 sm:py-2 bg-slate-100 text-slate-700 rounded-full text-[10px] sm:text-xs font-bold">
                      {recipient}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* Additional Images */}
            {achievement.images && achievement.images.length > 1 && (
              <section className="space-y-3 sm:space-y-4">
                <h3 className="text-[10px] sm:text-xs font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] text-slate-400">Gallery</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                  {achievement.images.slice(1).map((img, idx) => (
                    <div key={idx} className="aspect-square rounded-lg sm:rounded-xl overflow-hidden border border-slate-200">
                      <img src={img.url} alt={img.caption || ''} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>

        {/* Action Footer */}
        <div className="shrink-0 p-3 sm:p-4 md:p-6 bg-white/80 backdrop-blur-xl border-t border-slate-100/50">
          <div className="max-w-2xl mx-auto flex items-center gap-3 sm:gap-4">
            <button
              onClick={() => onShare(achievement)}
              className="flex-1 h-12 sm:h-16 bg-amber-50 border-2 border-amber-100 text-[#2D1B14] rounded-2xl sm:rounded-[24px] font-black active:scale-95 transition-all duration-300 shadow-sm flex items-center justify-center gap-2 group hover:bg-amber-100"
            >
              <IoShareOutline className="text-lg sm:text-xl group-hover:rotate-12 transition-transform" />
              <span className="hidden sm:inline text-xs uppercase tracking-widest font-black">Share Achievement</span>
              <span className="sm:hidden text-xs uppercase tracking-widest font-black">Share</span>
            </button>

            <button onClick={onClose} className="sm:hidden flex items-center justify-center w-12 h-12 bg-slate-100 rounded-2xl text-slate-500 active:bg-slate-200">
              <IoClose size={22} />
            </button>
          </div>
          <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto mt-4 sm:hidden opacity-50" />
        </div>
      </div>
    </div>
  );
};

// ==================== MAIN COMPONENT ====================
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
  const [selectedYear, setSelectedYear] = useState('all');
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [achievementToShare, setAchievementToShare] = useState(null);
  const [favorites, setFavorites] = useState(new Set());

  const categoryOptions = [
    { id: 'all', name: 'All Achievements', icon: FiAward, gradient: 'from-slate-500 to-slate-600' },
    { id: 'Academic', name: 'Academic', icon: FiBookOpen, gradient: 'from-blue-500 to-cyan-500' },
    { id: 'Sports', name: 'Sports', icon: FiAward, gradient: 'from-rose-500 to-red-500' },
    { id: 'Arts', name: 'Arts', icon: FiStar, gradient: 'from-purple-500 to-pink-500' },
    { id: 'Leadership', name: 'Leadership', icon: FiUsers, gradient: 'from-amber-500 to-orange-500' },
    { id: 'Cultural', name: 'Cultural', icon: IoSparkles, gradient: 'from-emerald-500 to-teal-500' },
    { id: 'Debate', name: 'Debate', icon: FiTarget, gradient: 'from-cyan-500 to-blue-500' },
    { id: 'Other', name: 'Other', icon: FiAward, gradient: 'from-slate-500 to-slate-600' }
  ];

  const [stats, setStats] = useState([
    { icon: IoMedalOutline, number: '0', label: 'Total Awards', sublabel: 'Achievements', gradient: 'from-blue-500 to-cyan-500' },
    { icon: IoTrophyOutline, number: '0', label: 'Featured', sublabel: 'Honors & Awards', gradient: 'from-amber-500 to-orange-500' },
    { icon: FiUsers, number: '0', label: 'Categories', sublabel: 'Achievement Types', gradient: 'from-purple-500 to-pink-500' },
    { icon: FiCalendar, number: new Date().getFullYear().toString(), label: 'Latest', sublabel: 'This year', gradient: 'from-emerald-500 to-green-500' }
  ]);

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

      const allAchievements = Object.values(categorized).flat();
      const uniqueCategories = Object.keys(categorized).filter(cat => categorized[cat].length > 0);
      const totalFeatured = allAchievements.filter(a => a.featured).length;
      
      setStats([
        { icon: IoMedalOutline, number: allAchievements.length.toString(), label: 'Total Awards', sublabel: 'Achievements', gradient: 'from-blue-500 to-cyan-500' },
        { icon: IoTrophyOutline, number: totalFeatured.toString(), label: 'Featured', sublabel: 'Honors & Awards', gradient: 'from-amber-500 to-orange-500' },
        { icon: FiUsers, number: uniqueCategories.length.toString(), label: 'Categories', sublabel: 'Achievement Types', gradient: 'from-purple-500 to-pink-500' },
        { icon: FiCalendar, number: new Date().getFullYear().toString(), label: 'Latest', sublabel: 'This year', gradient: 'from-emerald-500 to-green-500' }
      ]);

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
    toast.success('Achievements refreshed!');
  };

  const getAllAchievements = () => {
    return Object.values(achievementsByCategory).flat();
  };

  const transformedAchievements = useMemo(() => {
    return getAllAchievements().map(achievement => ({
      ...achievement,
      year: achievement.year || new Date().getFullYear().toString(),
      date: achievement.createdAt || new Date().toISOString()
    }));
  }, [achievementsByCategory]);

  const years = useMemo(() => {
    const yearSet = new Set();
    transformedAchievements.forEach(achievement => {
      if (achievement.year) yearSet.add(achievement.year.toString());
    });
    return Array.from(yearSet).sort((a, b) => b - a);
  }, [transformedAchievements]);

  const filteredAchievements = useMemo(() => {
    let filtered = transformedAchievements.filter(ach => {
      const matchesCat = activeCategory === 'all' || ach.category === activeCategory;
      const matchesYear = selectedYear === 'all' || ach.year.toString() === selectedYear;
      const matchesSearch = searchTerm === '' ||
        ach.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ach.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ach.awardingBody?.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCat && matchesYear && matchesSearch;
    });
    filtered.sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return new Date(b.date) - new Date(a.date);
    });
    return filtered;
  }, [activeCategory, searchTerm, selectedYear, transformedAchievements]);

  const handleFavorite = (achievement) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(achievement.id)) {
      newFavorites.delete(achievement.id);
      toast.success('Removed from favorites');
    } else {
      newFavorites.add(achievement.id);
      toast.success('Added to favorites');
    }
    setFavorites(newFavorites);
  };

  const handleShare = (achievement) => {
    setAchievementToShare(achievement);
    setShareModalOpen(true);
  };

  const achievementSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Kinyui Boys Senior School Achievements",
    "description": "Official achievements and awards of Kinyui Boys Senior School in Matungulu, Machakos County, Kenya",
    "url": "https://kinyuiboyssenior.school/pages/Achievements",
    "isPartOf": { "@type": "School", "name": "Kinyui Boys Senior School" },
    "about": { "@type": "EducationalOrganization", "name": "Kinyui Boys Senior School", "address": { "@type": "PostalAddress", "addressLocality": "Matungulu", "addressRegion": "Machakos County", "addressCountry": "KE" } }
  };

  if (loading) {
    return (
      <Box className="min-h-[70vh] flex items-center justify-center p-4 bg-transparent">
        <Stack spacing={2} alignItems="center" className="w-full transition-all duration-500">
          <Box className="relative flex items-center justify-center scale-90 sm:scale-110">
            <CircularProgress variant="determinate" value={100} size={48} thickness={4.5} sx={{ color: '#f1f5f9' }} />
            <CircularProgress variant="indeterminate" disableShrink size={48} thickness={4.5} sx={{ color: '#0f172a', animationDuration: '1000ms', position: 'absolute', '& .MuiCircularProgress-circle': { strokeLinecap: 'round' } }} />
            <Box className="absolute"><IoSparkles className="text-purple-600 text-sm animate-pulse" /></Box>
          </Box>
          <div className="text-center px-4">
            <p className="text-slate-900 font-medium text-sm sm:text-base tracking-tight italic">Loading school achievements...</p>
            <p className="text-slate-400 text-[10px] sm:text-xs uppercase tracking-widest mt-1 font-bold">Kinyui Boys Senior School</p>
          </div>
        </Stack>
      </Box>
    );
  }

  const totalAchievements = transformedAchievements.length;
  const featuredCount = transformedAchievements.filter(a => a.featured).length;

  return (
    <>
      <Head><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(achievementSchema) }} /></Head>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20 p-4 md:p-6">
        <Toaster position="top-right" richColors />
        <div className="max-w-7xl mx-auto space-y-6">

          {/* ========== HERO BANNER ========== */}
          <div className="relative bg-slate-950 p-4 sm:p-8 overflow-hidden rounded-md md:rounded-lg">
            <div className="absolute top-0 left-1/4 w-64 h-64 bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="max-w-7xl mx-auto relative z-10">
              <div className="flex flex-col gap-4 mb-6 sm:mb-10">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-md border border-white/20">
                    <IoSparkles className="text-amber-400 text-sm" />
                    <span className="text-slate-200 font-normal text-xs uppercase tracking-widest">Excellence Unveiled</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="max-w-full">
                      <h1 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
                        Our 
                        <span className="bg-gradient-to-r from-amber-400 to-rose-500 bg-clip-text text-transparent"> Achievements</span>
                      </h1>
                      <p className="text-slate-300 text-sm sm:text-base mt-2 font-normal leading-relaxed max-w-2xl">
                        Celebrating Kinyui Boys Senior School's commitment to holistic excellence across academics, sports, and cultural leadership.
                      </p>
                    </div>
                    <div className="flex items-center gap-3 w-full sm:w-auto mt-4">
                      <button onClick={refreshData} disabled={refreshing} className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-white hover:bg-slate-50 text-slate-900 font-medium text-sm transition-all active:scale-95 disabled:opacity-70 shadow-sm">
                        {refreshing ? <div className="w-3.5 h-3.5 border-2 border-slate-900/20 border-t-slate-900 rounded-full animate-spin" /> : <FiRotateCw className="text-sm" />}
                        <span>{refreshing ? "Updating..." : "Refresh Stats"}</span>
                      </button>
                      <div className="flex bg-white/10 backdrop-blur-md rounded-lg p-1 border border-white/10">
                        <button onClick={() => setViewMode('grid')} className={`p-2 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-white text-slate-900' : 'text-slate-300 hover:text-white'}`}><FiGrid size={18} /></button>
                        <button onClick={() => setViewMode('list')} className={`p-2 rounded-md transition-colors ${viewMode === 'list' ? 'bg-white text-slate-900' : 'text-slate-300 hover:text-white'}`}><FiList size={18} /></button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ========== STATS CARDS ========== */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mb-10">
            {stats.map((stat, index) => <ModernStatCard key={index} stat={stat} />)}
          </div>

          {/* ========== MAIN CONTENT LAYOUT ========== */}
          <div className="flex flex-col lg:flex-row gap-8">

            {/* Right Column: Sidebar */}
            <div className="lg:w-[380px] space-y-6">
              <div className="lg:sticky lg:top-24 space-y-6">

                {/* School Stats Panel */}
                <div className="bg-white rounded-[32px] p-6 border border-slate-100 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-emerald-50 rounded-xl"><IoSchoolOutline className="text-emerald-600" /></div>
                    <div>
                      <h4 className="font-bold text-slate-900">Kinyui Boys</h4>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Senior School</p>
                    </div>
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed mb-4">
                    Celebrating Excellence in All Endeavors — Official achievements and awards.
                  </p>
                  
                  <div className="space-y-3 pt-2">
                    <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                      <span className="text-sm font-bold text-slate-700">Mean Score</span>
                      <span className="text-lg font-black text-blue-600">{schoolStats?.meanScore?.toFixed(2) || '—'}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                      <span className="text-sm font-bold text-slate-700">Target Mean</span>
                      <span className="text-lg font-black text-emerald-600">{schoolStats?.targetMean?.toFixed(2) || '—'}</span>
                    </div>
                    <div className="p-3 bg-amber-50 rounded-xl">
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Our Slogan</p>
                      <p className="text-sm font-black text-slate-900 italic">"{schoolStats?.slogan || 'We are the Eagles'}"</p>
                    </div>
                  </div>
                </div>

                {/* Year Info Banner */}
                <div className="bg-white rounded-[32px] p-6 border border-slate-100 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-blue-50 rounded-xl"><FiCalendar className="text-blue-600" /></div>
                    <div>
                      <h4 className="font-bold text-slate-900">Achievement Years</h4>
                      <p className="text-xs text-slate-500">Browse by year</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                        <span className="text-sm font-medium text-slate-700">All Years</span>
                      </div>
                      <span className="text-xs font-bold text-blue-600">{transformedAchievements.length}</span>
                    </div>
                    {years.slice(0, 3).map(year => (
                      <div key={year} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                          <span className="text-sm font-medium text-slate-700">{year}</span>
                        </div>
                        <span className="text-xs font-bold text-blue-600">{transformedAchievements.filter(a => a.year === year).length}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* About Section */}
                <div className="bg-white rounded-[32px] p-6 border border-slate-100 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-slate-50 rounded-xl"><FiInfo className="text-slate-700 text-lg" /></div>
                    <h4 className="font-bold text-slate-900">About Achievements</h4>
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed mb-4">
                    Welcome to the official Kinyui Boys Senior School achievements page. A chronicle of excellence, discipline, and brotherhood in Matungulu, Machakos County.
                  </p>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    From triumphant sports victories to academic excellence awards, these honors represent our collective dedication to excellence and character formation.
                  </p>
                </div>
              </div>
            </div>

            {/* Left Column: Achievements Feed */}
            <div className="flex-1 min-w-0 space-y-4 sm:space-y-8">
              
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4 px-1">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="p-2 sm:p-3 bg-purple-900 rounded-xl sm:rounded-2xl shadow-lg shrink-0"><IoTrophyOutline className="text-white text-lg sm:text-2xl" /></div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">School Achievements</h2>
                    <p className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider">{filteredAchievements.length} Achievements • {featuredCount} Featured</p>
                  </div>
                </div>
              </div>

              {/* Search & Filter Bar */}
              <div className="bg-white/80 backdrop-blur-md border border-slate-200/60 p-2 sm:p-3 rounded-2xl sm:rounded-[28px] shadow-lg shadow-slate-200/40">
                <div className="flex flex-col md:flex-row items-center gap-2 sm:gap-3">
                  <div className="relative w-full flex-1 group">
                    <div className="relative flex items-center bg-white border border-slate-200 rounded-xl sm:rounded-2xl shadow-sm transition-all focus-within:border-slate-900 focus-within:ring-2 focus-within:ring-slate-900/5">
                      <div className="pl-3 sm:pl-4 pr-2 sm:pr-3 flex items-center justify-center pointer-events-none"><FiSearch className="text-slate-400 group-focus-within:text-slate-900 transition-colors" size={16} /></div>
                      <input type="text" placeholder="Search achievements by title, description, or awarding body..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full py-3 sm:py-4 bg-transparent text-slate-900 placeholder:text-slate-400 font-medium sm:font-semibold text-sm focus:outline-none" />
                      {searchTerm && (<button onClick={() => setSearchTerm('')} className="pr-2 flex items-center gap-1 sm:gap-2"><div className="p-1.5 sm:p-2 bg-slate-100 text-slate-900 rounded-lg sm:rounded-xl"><FiX className="w-3.5 h-3.5" /></div></button>)}
                    </div>
                  </div>
                  <div className="flex items-center w-full md:w-auto gap-2 sm:gap-3 border-t border-slate-100 md:border-t-0 md:border-l md:border-slate-100 pt-2 sm:pt-3 md:pt-0 md:pl-3">
                    <div className="relative flex-1 md:flex-none min-w-0">
                      <select value={activeCategory} onChange={(e) => setActiveCategory(e.target.value)} className="w-full md:w-40 appearance-none px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-50 md:bg-transparent border-none rounded-xl sm:rounded-2xl md:rounded-full font-medium text-slate-600 text-xs sm:text-sm cursor-pointer focus:ring-2 focus:ring-purple-500/20 transition-all">
                        {categoryOptions.map((cat) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                      </select>
                      <div className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400"><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg></div>
                    </div>
                    <div className="relative flex-1 md:flex-none min-w-0">
                      <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} className="w-full md:w-32 appearance-none px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-50 md:bg-transparent border-none rounded-xl sm:rounded-2xl md:rounded-full font-medium text-slate-600 text-xs sm:text-sm cursor-pointer focus:ring-2 focus:ring-purple-500/20 transition-all">
                        <option value="all">All Years</option>{years.map(year => <option key={year} value={year}>{year}</option>)}
                      </select>
                      <div className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400"><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg></div>
                    </div>
                    <button onClick={() => { setSearchTerm(''); setActiveCategory('all'); setSelectedYear('all'); }} className="p-2.5 sm:p-3 md:px-6 md:py-3 bg-purple-600 text-white rounded-xl sm:rounded-2xl md:rounded-full font-bold text-xs sm:text-sm shadow-md shadow-purple-200 hover:bg-purple-700 active:scale-95 transition-all flex items-center justify-center gap-1.5 flex-shrink-0"><FiFilter className="w-3.5 h-3.5" /><span className="hidden md:inline">Reset</span><span className="md:hidden text-[10px] font-bold">Clear</span></button>
                  </div>
                </div>
              </div>

              {/* Category Pills */}
              <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar -mx-2 px-2">
                {categoryOptions.map((category) => {
                  const Icon = category.icon;
                  const isActive = activeCategory === category.id;
                  return (
                    <button key={category.id} onClick={() => setActiveCategory(category.id)} className={`flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-5 py-1.5 sm:py-2.5 rounded-full whitespace-nowrap text-[11px] sm:text-sm font-bold transition-all border ${isActive ? "bg-purple-600 border-purple-600 text-white shadow-md shadow-purple-100" : "bg-white border-slate-200 text-slate-600"}`}>
                      <Icon className={`${isActive ? "text-white" : "text-slate-400"} text-xs sm:text-base`} />
                      <span>{category.name}</span>
                    </button>
                  );
                })}
              </div>

              {/* Achievements Grid/List */}
              <div className="relative">
                {filteredAchievements.length === 0 ? (
                  <div className="bg-slate-50 rounded-[24px] sm:rounded-[32px] border-2 border-dashed border-slate-200 py-8 sm:py-16 text-center">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm"><FiAward className="text-slate-300 text-xl sm:text-2xl" /></div>
                    <h3 className="text-lg font-bold text-slate-900">No achievements found</h3>
                    <p className="text-slate-500 text-xs sm:text-sm mt-1 mb-4">Try adjusting your filters or search terms.</p>
                    <button onClick={() => { setSearchTerm(''); setActiveCategory('all'); setSelectedYear('all'); }} className="px-4 sm:px-6 py-2 sm:py-2.5 bg-white border border-slate-200 rounded-full font-bold text-slate-700 hover:bg-slate-50 transition-all text-xs sm:text-sm">Reset Filters</button>
                  </div>
                ) : (
                  <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6' : 'space-y-3 sm:space-y-4'}>
                    {filteredAchievements.map((achievement, index) => (
                      <ModernAchievementCard
                        key={achievement.id || index}
                        achievement={achievement}
                        onView={setSelectedAchievement}
                        onFavorite={handleFavorite}
                        onShare={handleShare}
                        viewMode={viewMode}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Modals */}
        {selectedAchievement && !shareModalOpen && (
          <AchievementDetailModal 
            achievement={selectedAchievement} 
            onClose={() => setSelectedAchievement(null)} 
            onShare={handleShare}
          />
        )}
        {shareModalOpen && achievementToShare && (
          <ModernShareModal 
            achievement={achievementToShare} 
            onClose={() => { setShareModalOpen(false); setAchievementToShare(null); }} 
          />
        )}
      </div>
    </>
  );
}