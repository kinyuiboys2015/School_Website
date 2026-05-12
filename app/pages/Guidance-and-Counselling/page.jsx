'use client';
import { useState, useEffect } from 'react';
import { toast, Toaster } from 'sonner';
import { 
  FiCalendar, FiClock, FiUser, FiArrowRight, FiSearch, FiBookOpen,
  FiTarget, FiUsers, FiAward, FiStar, FiShield, FiMusic, FiHeart,
  FiAlertTriangle, FiPhone, FiMail, FiPhoneCall, FiMapPin, FiPlus,
  FiX, FiFilter, FiRotateCw, FiEdit3, FiTrash2, FiMessageCircle,
  FiSave, FiImage, FiUpload, FiEye, FiChevronRight, FiChevronLeft,
  FiGrid, FiList, FiBookmark, FiShare2, FiDownload, FiExternalLink,
  FiZap, FiTrendingUp, FiGlobe, FiCopy, FiBell, FiUserPlus 
} from 'react-icons/fi';
import {
  IoCalendarClearOutline, IoSparkles, IoRibbonOutline, IoPeopleCircle,
  IoStatsChart, IoShareSocialOutline, IoClose, IoLocationOutline,
  IoTimeOutline, IoPersonOutline, IoShareOutline, IoNewspaperOutline
} from 'react-icons/io5';
import { CircularProgress, Box, Stack } from '@mui/material';
import { FaWhatsapp, FaFacebookF, FaTwitter, FaTelegram, FaEnvelope } from 'react-icons/fa';

// ==================== MODERN MODAL (Glass Morphism) ====================
const ModernModal = ({ children, open, onClose, maxWidth = '800px', blur = true }) => {
  if (!open) return null;
  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${blur ? 'backdrop-blur-md' : 'bg-black/50'}`}>
      <div 
        className="relative bg-white/95 rounded-3xl shadow-2xl animate-in zoom-in-95 duration-300 overflow-hidden border border-white/40"
        style={{ width: '90%', maxWidth, maxHeight: '90vh', background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.95) 100%)' }}
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

// ==================== MODERN SHARE MODAL (Matches Events/News) ====================
const ModernShareModal = ({ session, onClose }) => {
  const [copied, setCopied] = useState(false);
  if (!session) return null;

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareText = `${session.title}\n\n${session.description?.substring(0, 100)}...\n\n${shareUrl}`;

  const socialPlatforms = [
    { name: 'WhatsApp', icon: FaWhatsapp, color: 'bg-[#25D366]', hoverColor: 'hover:bg-[#128C7E]', action: () => window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, '_blank') },
    { name: 'Facebook', icon: FaFacebookF, color: 'bg-[#1877F2]', hoverColor: 'hover:bg-[#0d65d9]', action: () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank') },
    { name: 'Twitter', icon: FaTwitter, color: 'bg-[#1DA1F2]', hoverColor: 'hover:bg-[#0c85d0]', action: () => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(session.title)}&url=${encodeURIComponent(shareUrl)}`, '_blank') },
    { name: 'Telegram', icon: FaTelegram, color: 'bg-[#0088cc]', hoverColor: 'hover:bg-[#0077b5]', action: () => window.open(`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(session.title)}`, '_blank') },
    { name: 'Email', icon: FaEnvelope, color: 'bg-slate-600', hoverColor: 'hover:bg-slate-700', action: () => window.location.href = `mailto:?subject=${encodeURIComponent(session.title)}&body=${encodeURIComponent(shareText)}` }
  ];

  const copyToClipboard = () => { navigator.clipboard.writeText(shareUrl); setCopied(true); setTimeout(() => setCopied(false), 2000); toast.success('Link copied!'); };

  return (
    <ModernModal open={true} onClose={onClose} maxWidth="480px">
      <div className="bg-[#2D1B14] p-6 sm:p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 sm:w-32 h-24 sm:h-32 bg-amber-500/10 blur-3xl rounded-full -mr-16 -mt-16" />
        <div className="absolute bottom-0 left-0 w-20 sm:w-24 h-20 sm:h-24 bg-rose-500/5 blur-2xl rounded-full -ml-12 -mb-12" />
        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="w-10 h-10 sm:w-14 sm:h-14 bg-white/5 backdrop-blur-xl rounded-xl sm:rounded-2xl flex items-center justify-center mb-3 sm:mb-4 border border-white/10 shadow-2xl">
            <IoShareSocialOutline className="text-xl sm:text-2xl text-amber-200" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight italic">Share Session</h2>
          <p className="text-amber-100/50 text-[10px] sm:text-xs mt-1 uppercase tracking-[0.15em] sm:tracking-[0.2em] font-medium">Spread the word</p>
        </div>
      </div>
      <div className="p-4 sm:p-6 md:p-8 bg-white">
        <div className="grid grid-cols-3 sm:flex sm:flex-wrap justify-center gap-4 sm:gap-5 md:gap-6 mb-6 sm:mb-8 md:mb-10">
          {socialPlatforms.map((platform, index) => {
            const Icon = platform.icon;
            return (
              <button key={index} onClick={platform.action} className="flex flex-col items-center gap-1.5 sm:gap-2 md:gap-2.5 group transition-transform active:scale-90">
                <div className={`w-12 h-12 sm:w-14 sm:h-14 md:w-14 md:h-14 rounded-2xl sm:rounded-[20px] flex items-center justify-center text-white shadow-lg transition-all duration-300 ${platform.color} ${platform.hoverColor} group-hover:shadow-xl group-hover:-translate-y-1`}>
                  <Icon className="text-xl sm:text-2xl" />
                </div>
                <span className="text-[9px] sm:text-[10px] font-bold text-slate-800">{platform.name}</span>
              </button>
            );
          })}
        </div>
        <div className="space-y-2 sm:space-y-3">
          <label className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-slate-800 ml-1">Page Link</label>
          <div className="relative flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-0">
            <div className="w-full p-3 sm:p-4 bg-slate-50 rounded-xl sm:rounded-2xl border border-slate-100 text-[10px] sm:text-xs font-medium text-slate-800 truncate sm:pr-28">{shareUrl}</div>
            <button onClick={copyToClipboard} className={`sm:absolute right-1.5 px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg sm:rounded-xl font-bold text-[11px] sm:text-xs transition-all flex items-center justify-center gap-1.5 sm:gap-2 ${copied ? 'bg-emerald-500 text-white shadow-emerald-200' : 'bg-[#2D1B14] text-white hover:bg-[#3d2a22] shadow-lg shadow-stone-200'}`}>
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
        <div className="flex flex-col"><p className="text-[10px] font-black uppercase tracking-widest text-slate-800">{stat.label}</p></div>
      </div>
      <div className="relative z-10"><p className="text-sm font-semibold text-slate-700 leading-snug">{stat.sublabel}</p></div>
      <div className={`absolute -bottom-6 -right-6 w-24 h-24 blur-3xl opacity-10 rounded-full bg-gradient-to-br ${stat.gradient}`} />
    </div>
  );
};

// ==================== MODERN COUNSELING CARD (Matches Event Card) ====================
const ModernCounselingCard = ({ session, onView, onBookmark, viewMode = 'grid' }) => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const getCategoryStyle = (category) => {
    const styles = {
      academic: { gradient: 'from-blue-600 to-indigo-600', bg: 'bg-blue-50', text: 'text-blue-700', iconBg: 'bg-blue-100', iconColor: 'text-blue-600' },
      emotional: { gradient: 'from-purple-600 to-pink-600', bg: 'bg-purple-50', text: 'text-purple-700', iconBg: 'bg-purple-100', iconColor: 'text-purple-600' },
      devotion: { gradient: 'from-indigo-600 to-purple-600', bg: 'bg-indigo-50', text: 'text-indigo-700', iconBg: 'bg-indigo-100', iconColor: 'text-indigo-600' },
      worship: { gradient: 'from-amber-600 to-orange-600', bg: 'bg-amber-50', text: 'text-amber-700', iconBg: 'bg-amber-100', iconColor: 'text-amber-600' },
      support: { gradient: 'from-emerald-600 to-teal-600', bg: 'bg-emerald-50', text: 'text-emerald-700', iconBg: 'bg-emerald-100', iconColor: 'text-emerald-600' },
      drugs: { gradient: 'from-red-600 to-rose-600', bg: 'bg-red-50', text: 'text-red-700', iconBg: 'bg-red-100', iconColor: 'text-red-600' }
    };
    return styles[category] || styles.academic;
  };

  const formatDate = (dateString) => {
    if (dateString === 'Always Available' || dateString === 'Monday - Friday') return dateString;
    try { return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }); } catch { return 'Available'; }
  };

  if (viewMode === 'grid') {
    const theme = getCategoryStyle(session.category);
    return (
      <div onClick={() => onView(session)} className="group relative bg-white rounded-[2.5rem] border border-slate-100 p-3 pb-6 transition-all duration-200 cursor-pointer">
        {/* Image Container with Floating Date */}
        <div className="relative h-56 w-full rounded-[2rem] overflow-hidden mb-6">
          {session.image ? (
            <img src={session.image} alt={session.title} className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-101" onLoad={() => setImageLoaded(true)} />
          ) : (
            <div className={`w-full h-full bg-gradient-to-br ${theme.gradient}`} />
          )}
          {/* Floating Date Leaf */}
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md rounded-2xl p-2 min-w-[55px] flex flex-col items-center shadow-xl border border-white/20">
            <span className="text-[10px] font-black uppercase tracking-tighter text-slate-800">
              {formatDate(session.date) !== 'Always Available' && formatDate(session.date) !== 'Monday - Friday' ? new Date(session.date).toLocaleDateString('en-US', { month: 'short' }) : 'Open'}
            </span>
            <span className="text-xl font-black text-slate-900 leading-none">
              {formatDate(session.date) !== 'Always Available' && formatDate(session.date) !== 'Monday - Friday' ? new Date(session.date).getDate() : '24/7'}
            </span>
          </div>
          {/* Action Buttons Overlay */}
          <div className="absolute top-4 right-4 flex flex-col gap-2">
            <button onClick={(e) => { e.stopPropagation(); onBookmark(session); setIsBookmarked(!isBookmarked); }} className={`p-3 rounded-2xl backdrop-blur-md transition-all ${isBookmarked ? 'bg-amber-500 text-white' : 'bg-black/20 text-white hover:bg-black/40'}`}>
              <FiBookmark className={isBookmarked ? 'fill-current' : ''} />
            </button>
          </div>
          {/* Bottom Gradient Overlay for Category */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-white bg-gradient-to-r ${theme.gradient} shadow-lg`}>
              {session.category || 'Counseling'}
            </span>
          </div>
        </div>
        {/* Content Section */}
        <div className="px-3">
          <div className="flex items-center gap-2 mb-3">
            <div className="flex -space-x-2">{/* counselor avatar placeholder */}</div>
            <span className="text-[10px] font-bold text-slate-800 uppercase tracking-tight">{session.counselor || 'Counselor'}</span>
          </div>
          <h3 className="text-xl font-black text-slate-900 mb-3 leading-tight group-hover:text-purple-900 transition-colors">{session.title}</h3>
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex items-center gap-1.5 text-slate-800"><FiClock className="text-purple-500" /><span className="text-xs font-bold">{session.time || 'Flexible'}</span></div>
            <div className="flex items-center gap-1.5 text-slate-800"><FiUser className="text-blue-500" /><span className="text-xs font-bold truncate max-w-[120px]">{session.type || 'Session'}</span></div>
          </div>
          <button className="w-full py-4 bg-slate-900 text-white rounded-[1.25rem] text-xs font-black uppercase tracking-widest hover:bg-purple-800 transition-colors active:scale-95">View Session</button>
        </div>
      </div>
    );
  }

  // List View (simplified, matches events list)
  const theme = getCategoryStyle(session.category);
  return (
    <div onClick={() => onView(session)} className="group flex flex-col sm:flex-row items-center gap-6 bg-white p-4 rounded-[2rem] border border-slate-100 hover:shadow-xl transition-all cursor-pointer">
      <div className="relative w-full sm:w-40 h-32 rounded-2xl overflow-hidden shrink-0">
        {session.image ? <img src={session.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" /> : <div className={`w-full h-full bg-gradient-to-br ${theme.gradient}`} />}
        <div className={`absolute top-2 left-2 px-3 py-1 rounded-lg text-[9px] font-black text-white bg-gradient-to-r ${theme.gradient}`}>{session.category}</div>
      </div>
      <div className="flex-1"><h3 className="text-lg font-black text-slate-900 mb-2">{session.title}</h3><p className="text-sm text-slate-800 line-clamp-1 mb-4">{session.description}</p>
        <div className="flex items-center gap-4"><div className={`px-3 py-1.5 rounded-xl ${theme.bg} ${theme.text} text-[10px] font-bold`}>{formatDate(session.date)}</div><div className="flex items-center gap-1.5 text-slate-800 text-xs font-bold"><FiUser /> {session.counselor}</div></div>
      </div>
      <div className="hidden md:block pr-4"><div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-all"><FiArrowRight className="text-xl" /></div></div>
    </div>
  );
};

// ==================== MODERN SUPPORT TEAM CARD ====================
const ModernSupportTeamCard = ({ member, onView, onContact, viewMode = 'grid' }) => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const getRoleStyle = (role) => {
    const styles = {
      teacher: { gradient: 'from-blue-500 to-cyan-500', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', label: 'Teacher' },
      matron: { gradient: 'from-purple-500 to-pink-500', bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', label: 'Matron' },
      patron: { gradient: 'from-emerald-500 to-green-500', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', label: 'Patron' }
    };
    return styles[role] || { gradient: 'from-slate-500 to-slate-600', bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-200', label: role || 'Member' };
  };
  const roleStyle = getRoleStyle(member.role);
  const isSupport = ['teacher', 'matron', 'patron'].includes(member.role);

  if (viewMode === 'grid') {
    return (
      <div onClick={() => onView(member)} className="group relative bg-white rounded-[2.5rem] border border-slate-100 p-3 pb-6 transition-all duration-200 cursor-pointer">
        <div className="relative h-56 w-full rounded-[2rem] overflow-hidden mb-6">
          <img src={member.image || '/default-avatar.jpg'} alt={member.name} className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-101" />
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm border ${roleStyle.bg} ${roleStyle.text} ${roleStyle.border}`}>{roleStyle.label}</span>
            {isSupport && <span className="px-3 py-1 bg-emerald-500/90 backdrop-blur-md text-white rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1 shadow-sm"><FiClock className="text-emerald-200" /> 24/7</span>}
          </div>
          <div className="absolute top-4 right-4">
            <button onClick={(e) => { e.stopPropagation(); setIsBookmarked(!isBookmarked); }} className={`p-3 rounded-2xl backdrop-blur-md transition-all ${isBookmarked ? 'bg-amber-500 text-white' : 'bg-black/20 text-white hover:bg-black/40'}`}>
              <FiUserPlus className={isBookmarked ? 'fill-current' : ''} />
            </button>
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
            <span className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-white bg-gradient-to-r from-purple-600 to-pink-600 shadow-lg">Available</span>
          </div>
        </div>
        <div className="px-3"><h3 className="text-xl font-black text-slate-900 mb-2 leading-tight">{member.name}</h3><p className="text-slate-800 text-sm mb-4 line-clamp-2">{member.bio || 'Dedicated professional providing guidance and support.'}</p>
          <div className="flex items-center gap-4 mb-6"><div className="flex items-center gap-1.5 text-slate-800"><FiMail className="text-purple-500" /><span className="text-xs font-bold truncate">{member.email || 'Contact'}</span></div></div>
          <button className="w-full py-4 bg-slate-900 text-white rounded-[1.25rem] text-xs font-black uppercase tracking-widest hover:bg-purple-800 transition-colors active:scale-95">View Profile</button>
        </div>
      </div>
    );
  }
  // List view (simplified)
  return (
    <div onClick={() => onView(member)} className="group flex items-center gap-6 bg-white p-4 rounded-[2rem] border border-slate-100 hover:shadow-xl transition-all cursor-pointer">
      <div className="relative w-20 h-20 rounded-2xl overflow-hidden shrink-0"><img src={member.image || '/default-avatar.jpg'} className="w-full h-full object-cover" /></div>
      <div className="flex-1"><h3 className="text-lg font-black text-slate-900">{member.name}</h3><p className="text-sm text-slate-800 line-clamp-1">{member.title || roleStyle.label}</p></div>
      <div className="hidden md:block"><FiArrowRight className="text-xl text-slate-300 group-hover:text-slate-900" /></div>
    </div>
  );
};

// ==================== MODERN DETAIL MODAL (Matches Events Modal) ====================
const ModernDetailModal = ({ session, onClose, onContact, onShare }) => {
  if (!session) return null;

  const getCategoryStyle = (category) => {
    const styles = {
      academic: { gradient: 'from-blue-500 to-cyan-500', icon: FiTarget },
      emotional: { gradient: 'from-purple-500 to-pink-500', icon: FiHeart },
      devotion: { gradient: 'from-indigo-500 to-purple-500', icon: FiHeart },
      worship: { gradient: 'from-amber-500 to-orange-500', icon: FiMusic },
      support: { gradient: 'from-emerald-500 to-green-500', icon: FiPhoneCall },
      drugs: { gradient: 'from-red-500 to-rose-500', icon: FiAlertTriangle }
    };
    return styles[category] || { gradient: 'from-slate-500 to-slate-600', icon: FiBookOpen };
  };
  const categoryStyle = getCategoryStyle(session.category);
  const CategoryIcon = categoryStyle.icon;

  const formatFullDate = (dateString) => {
    if (dateString === 'Always Available' || dateString === 'Monday - Friday') return dateString;
    try { return new Date(dateString).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }); } catch { return dateString; }
  };

  const addToCalendar = () => {
    if (session.date === 'Always Available' || session.date === 'Monday - Friday') {
      toast.info('This session is always available. Contact support directly.');
      return;
    }
    const start = new Date(session.date);
    const end = new Date(start.getTime() + 60 * 60 * 1000);
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(session.title)}&dates=${start.toISOString().replace(/[-:]/g, '').split('.')[0]}Z/${end.toISOString().replace(/[-:]/g, '').split('.')[0]}Z&details=${encodeURIComponent(session.description)}&location=${encodeURIComponent('Guidance Office')}`;
    window.open(url, '_blank');
    toast.success('Added to Google Calendar');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 sm:p-4 bg-slate-900/90 backdrop-blur-sm">
      <div className="relative w-full h-full sm:h-auto sm:max-h-[90vh] sm:max-w-3xl bg-white sm:rounded-[40px] shadow-2xl overflow-hidden flex flex-col">
        <button onClick={onClose} className="absolute top-4 right-4 sm:top-5 sm:right-5 z-50 p-2 bg-black/20 backdrop-blur-md text-white rounded-full border border-white/20 transition-all active:scale-90"><IoClose size={20} /></button>
        {/* Hero Image */}
        <div className="relative h-[30vh] sm:h-[350px] w-full shrink-0">
          {session.image ? <img src={session.image} alt={session.title} className="w-full h-full object-cover" /> : <div className={`w-full h-full bg-gradient-to-r ${categoryStyle.gradient}`} />}
          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-black/20" />
          <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 flex gap-2">
            <span className="px-3 py-1 sm:px-4 sm:py-1.5 bg-white shadow-xl rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-widest text-slate-900">{session.category || 'Counseling'}</span>
            {session.featured && <span className="px-3 py-1 sm:px-4 sm:py-1.5 bg-slate-900 text-white rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-widest flex items-center gap-1"><IoSparkles className="text-amber-400" /> Featured</span>}
          </div>
        </div>
        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-10 bg-white">
          <div className="max-w-2xl mx-auto space-y-6 sm:space-y-8">
            <section className="space-y-3 sm:space-y-4">
              <div className="flex items-center gap-2 sm:gap-3"><div className={`p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-gradient-to-r ${categoryStyle.gradient}`}><CategoryIcon className="text-white text-lg sm:text-2xl" /></div><div><h2 className="text-xl sm:text-2xl md:text-4xl font-black text-slate-900 tracking-tight">{session.title}</h2><p className="text-slate-600 text-sm sm:text-base md:text-lg">{session.type || 'Counseling Session'}</p></div></div>
              <div className="flex flex-wrap gap-y-2 gap-x-3 sm:gap-x-6 text-xs sm:text-sm font-semibold text-slate-800">
                <div className="flex items-center gap-1 sm:gap-2"><IoCalendarClearOutline className="text-blue-500" />{formatFullDate(session.date)}</div>
                <div className="flex items-center gap-1 sm:gap-2"><IoTimeOutline className="text-emerald-500" />{session.time || 'Flexible'}</div>
                <div className="flex items-center gap-1 sm:gap-2"><IoPersonOutline className="text-purple-500" />{session.counselor || 'Counselor'}</div>
              </div>
            </section>
            <section><h3 className="text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] text-slate-800">About this session</h3><div className="text-slate-700 leading-relaxed text-sm sm:text-base md:text-lg">{session.description || 'Professional counseling and support session.'}</div></section>
            <section className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 pt-4">
              <div className="p-3 sm:p-4 bg-slate-50 rounded-2xl sm:rounded-3xl border border-slate-100"><div className={`w-2 h-2 rounded-full ${session.priority === 'high' ? 'bg-red-500' : 'bg-green-500'} mb-1`} /><p className="text-[9px] sm:text-[10px] uppercase font-bold text-slate-800 mb-0.5">Priority</p><p className="font-bold text-slate-900 text-xs sm:text-sm capitalize">{session.priority || 'medium'}</p></div>
              <div className="p-3 sm:p-4 bg-slate-50 rounded-2xl sm:rounded-3xl border border-slate-100"><FiShield className="text-purple-600 mb-1" /><p className="text-[9px] sm:text-[10px] uppercase font-bold text-slate-800 mb-0.5">Confidential</p><p className="font-bold text-slate-900 text-xs sm:text-sm">100% Secure</p></div>
              <div className="p-3 sm:p-4 bg-slate-50 rounded-2xl sm:rounded-3xl border border-slate-100 col-span-2 sm:col-span-1"><FiStar className="text-amber-500 mb-1" /><p className="text-[9px] sm:text-[10px] uppercase font-bold text-slate-800 mb-0.5">Rating</p><p className="font-bold text-slate-900 text-xs sm:text-sm">4.9/5.0</p></div>
            </section>
          </div>
        </div>
        {/* Footer */}
        <div className="shrink-0 p-4 pb-6 sm:p-6 bg-white/80 backdrop-blur-xl border-t border-slate-100/50">
          <div className="max-w-2xl mx-auto flex items-center gap-3 sm:gap-4">
            <button onClick={session.isSupport ? onContact : addToCalendar} className="flex-[2.5] relative group h-12 sm:h-16 bg-[#2D1B14] overflow-hidden rounded-2xl sm:rounded-[24px] shadow-lg shadow-stone-200 active:scale-[0.98] transition-all duration-300">
              <div className="relative flex items-center justify-center gap-2 sm:gap-3 px-4 text-white"><div className="p-1.5 sm:p-2 bg-white/10 rounded-lg sm:rounded-xl">{session.isSupport ? <FiPhoneCall className="text-amber-300" /> : <FiCalendar className="text-amber-300" />}</div><span className="text-[10px] sm:text-sm font-black uppercase tracking-[0.15em] truncate">{session.isSupport ? 'Contact Support' : 'Add to Calendar'}</span></div>
            </button>
            <button onClick={() => onShare(session)} className="flex-1 h-12 sm:h-16 bg-amber-50 border-2 border-amber-100 text-[#2D1B14] rounded-2xl sm:rounded-[24px] font-black active:scale-95 transition-all duration-300 shadow-sm flex items-center justify-center gap-2 group hover:bg-amber-100"><IoShareOutline className="text-lg sm:text-xl group-hover:rotate-12 transition-transform" /><span className="hidden sm:inline text-xs uppercase tracking-widest font-black">Share</span></button>
            <button onClick={onClose} className="sm:hidden flex items-center justify-center w-12 h-12 bg-slate-100 rounded-2xl text-slate-800"><IoClose size={22} /></button>
          </div>
          <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto mt-4 sm:hidden opacity-50" />
        </div>
      </div>
    </div>
  );
};

// ==================== TEAM MEMBER MODAL (Simplified but matches style) ====================
const TeamMemberModal = ({ member, isOpen, onClose }) => {
  if (!isOpen || !member) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 sm:p-4 bg-slate-900/90 backdrop-blur-sm">
      <div className="relative w-full h-full sm:h-auto sm:max-h-[90vh] sm:max-w-3xl bg-white sm:rounded-[40px] shadow-2xl overflow-hidden flex flex-col">
        <button onClick={onClose} className="absolute top-4 right-4 z-50 p-2 bg-black/20 backdrop-blur-md text-white rounded-full"><IoClose size={20} /></button>
        <div className="relative h-[30vh] sm:h-[350px] w-full shrink-0">
          <img src={member.image || '/default-avatar.jpg'} alt={member.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-black/20" />
          <div className="absolute bottom-4 left-4 flex gap-2"><span className="px-3 py-1 bg-white shadow-xl rounded-full text-xs font-bold uppercase">{member.role}</span></div>
        </div>
        <div className="flex-1 overflow-y-auto p-6 sm:p-10 bg-white"><h2 className="text-2xl sm:text-4xl font-black text-slate-900">{member.name}</h2><p className="text-slate-600 mt-1">{member.title || member.role}</p><div className="mt-6 space-y-4"><h3 className="text-xs font-black uppercase tracking-widest text-slate-800">Bio</h3><p className="text-slate-700">{member.bio || 'Dedicated professional providing guidance and support.'}</p><div className="grid grid-cols-2 gap-4"><div className="p-4 bg-slate-50 rounded-2xl"><FiMail className="text-purple-600 mb-1" /><p className="text-xs font-bold text-slate-900">{member.email || 'Not provided'}</p></div><div className="p-4 bg-slate-50 rounded-2xl"><FiPhone className="text-emerald-600 mb-1" /><p className="text-xs font-bold text-slate-900">{member.phone || 'Contact office'}</p></div></div></div></div>
        <div className="shrink-0 p-4 bg-white/80 border-t border-slate-100"><button onClick={onClose} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest">Close</button></div>
      </div>
    </div>
  );
};

// ==================== HELPER FUNCTIONS (unchanged) ====================
function getNextThursday() { const today = new Date(); const daysUntilThursday = (4 - today.getDay() + 7) % 7 || 7; const next = new Date(today); next.setDate(today.getDate() + daysUntilThursday); return next.toISOString().split('T')[0]; }
function getNextSunday() { const today = new Date(); const daysUntilSunday = (0 - today.getDay() + 7) % 7 || 7; const next = new Date(today); next.setDate(today.getDate() + daysUntilSunday); return next.toISOString().split('T')[0]; }

const DEFAULT_SESSIONS = [
  { id: 'devotion-thursday', title: 'Thursday Devotion Session', counselor: 'School Chaplain', date: getNextThursday(), time: '10:00 AM - 11:00 AM', type: 'Spiritual Session', category: 'devotion', status: 'scheduled', description: 'Weekly devotion session to strengthen students in religious study and worship.', priority: 'high', image: 'https://images.unsplash.com/photo-1507692049790-de58290a4334?w=800&q=80', featured: true, location: 'Kinyui Boys', isSupport: false },
  { id: 'devotion-sunday', title: 'Sunday Youth Worship', counselor: 'Youth Leaders & CU', date: getNextSunday(), time: '2:00 PM - 4:00 PM', type: 'Youth Worship', category: 'worship', status: 'scheduled', description: 'Youth worship session with CU and YCS active worship groups.', priority: 'high', image: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=800&q=80', featured: true, location: 'Kinyui Boys', isSupport: false }
];

const fetchGuidanceSessions = async () => { try { const res = await fetch('/api/guidance'); if (!res.ok) throw new Error(); const data = await res.json(); return data.success && data.events ? data.events : []; } catch (error) { toast.error('Failed to load guidance sessions'); return []; } };
const fetchTeamMembers = async () => { try { const res = await fetch('/api/guidanceteam'); if (!res.ok) throw new Error(); const data = await res.json(); if (data.success && data.members) return data.members.map(m => ({ ...m, isSupport: ['teacher', 'matron', 'patron'].includes(m.role) })); return []; } catch (error) { toast.error('Failed to load team members'); return []; } };
const transformApiDataToSessions = (apiEvents) => apiEvents.map(event => ({ id: event.id, title: `${event.counselor} - ${event.category} Session`, counselor: event.counselor, date: event.date.split('T')[0], time: event.time || 'Flexible', type: event.type || 'Guidance Session', category: event.category?.toLowerCase() || 'academic', status: 'scheduled', description: event.description || 'Professional guidance and counseling session.', priority: event.priority?.toLowerCase() || 'medium', image: event.image || null, featured: false, location: 'Guidance Office', isSupport: false }));

// ==================== MAIN COMPONENT ====================
export default function StudentCounseling() {
  const [activeTab, setActiveTab] = useState('all');
  const [selectedSession, setSelectedSession] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [counselingSessions, setCounselingSessions] = useState([]);
  const [guidanceSessions, setGuidanceSessions] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [viewMode, setViewMode] = useState('grid');
  const [bookmarkedSessions, setBookmarkedSessions] = useState(new Set());
  const [selectedMember, setSelectedMember] = useState(null);
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [sessionToShare, setSessionToShare] = useState(null);

  const [stats, setStats] = useState([
    { icon: FiCalendar, number: '0', label: 'Active Sessions', sublabel: 'This month', gradient: 'from-blue-500 to-cyan-500' },
    { icon: FiPhoneCall, number: '24/7', label: 'Support', sublabel: 'Always available', gradient: 'from-emerald-500 to-green-500' },
    { icon: FiShield, number: '100%', label: 'Confidential', sublabel: 'All sessions', gradient: 'from-purple-500 to-pink-500' },
    { icon: FiUsers, number: '0', label: 'Categories', sublabel: 'Available support', gradient: 'from-amber-500 to-orange-500' }
  ]);

  const categoryOptions = [
    { id: 'all', name: 'All Sessions', icon: FiBookOpen, gradient: 'from-slate-500 to-slate-600' },
    { id: 'academic', name: 'Academic', icon: FiTarget, gradient: 'from-blue-500 to-cyan-500' },
    { id: 'emotional', name: 'Emotional', icon: FiHeart, gradient: 'from-purple-500 to-pink-500' },
    { id: 'devotion', name: 'Devotion', icon: FiHeart, gradient: 'from-indigo-500 to-purple-500' },
    { id: 'worship', name: 'Worship', icon: FiMusic, gradient: 'from-amber-500 to-orange-500' },
    { id: 'support', name: '24/7 Support', icon: FiPhoneCall, gradient: 'from-emerald-500 to-green-500' },
    { id: 'drugs', name: 'Drug Awareness', icon: FiAlertTriangle, gradient: 'from-red-500 to-rose-500' }
  ];

  const loadData = async () => {
    try {
      const apiSessions = await fetchGuidanceSessions();
      const transformed = transformApiDataToSessions(apiSessions);
      setGuidanceSessions(transformed);
      const allSessions = [...DEFAULT_SESSIONS, ...transformed];
      setCounselingSessions(allSessions);
      const teamData = await fetchTeamMembers();
      setTeamMembers(teamData);
      const teacherCount = teamData.filter(m => m.role === 'teacher').length;
      const matronCount = teamData.filter(m => m.role === 'matron').length;
      const patronCount = teamData.filter(m => m.role === 'patron').length;
      setStats([
        { icon: FiCalendar, number: allSessions.length.toString(), label: 'Total Sessions', sublabel: 'All categories', gradient: 'from-blue-500 to-cyan-500' },
        { icon: FiPhoneCall, number: (matronCount + patronCount).toString(), label: 'Support Staff', sublabel: 'Matrons & Patrons', gradient: 'from-emerald-500 to-green-500' },
        { icon: FiShield, number: teacherCount.toString(), label: 'Teachers', sublabel: 'Guidance Counselors', gradient: 'from-purple-500 to-pink-500' },
        { icon: FiUsers, number: teamData.length.toString(), label: 'Team Members', sublabel: 'Total support team', gradient: 'from-amber-500 to-orange-500' }
      ]);
    } catch (error) { console.error(error); toast.error('Failed to load some data'); }
  };

  useEffect(() => { const init = async () => { setLoading(true); await loadData(); setLoading(false); }; init(); }, []);

  const filteredSessions = counselingSessions.filter(s => (activeTab === 'all' || s.category === activeTab) && (searchTerm === '' || s.title.toLowerCase().includes(searchTerm.toLowerCase()) || s.counselor?.toLowerCase().includes(searchTerm.toLowerCase())));
  const handleBookmark = (s) => { const newSet = new Set(bookmarkedSessions); if (newSet.has(s.id)) newSet.delete(s.id); else newSet.add(s.id); setBookmarkedSessions(newSet); toast.success(newSet.has(s.id) ? 'Bookmarked' : 'Removed'); };
  const refreshData = async () => { setRefreshing(true); await loadData(); setRefreshing(false); toast.success('Data refreshed!'); };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4 bg-transparent">
        <Stack spacing={2} alignItems="center"><div className="relative flex items-center justify-center scale-90 sm:scale-110"><CircularProgress variant="determinate" value={100} size={48} thickness={4.5} sx={{ color: '#f1f5f9' }} /><CircularProgress variant="indeterminate" disableShrink size={48} thickness={4.5} sx={{ color: '#0f172a', animationDuration: '1000ms', position: 'absolute', '& .MuiCircularProgress-circle': { strokeLinecap: 'round' } }} /><div className="absolute"><IoSparkles className="text-purple-600 text-sm animate-pulse" /></div></div><div className="text-center"><p className="text-slate-900 font-medium text-sm tracking-tight italic">Loading counseling sessions...</p><p className="text-slate-800 text-[10px] uppercase tracking-widest mt-1 font-bold">Kinyui Boys Senior School</p></div></Stack>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20 p-4 md:p-6">
      <Toaster position="top-right" richColors />
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Hero Banner - Matches Events Page */}
        <div className="relative bg-slate-950 p-4 sm:p-8 overflow-hidden rounded-md md:rounded-lg">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="flex flex-col gap-4 mb-6 sm:mb-10">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-md border border-white/20"><IoSparkles className="text-amber-400 text-sm" /><span className="text-slate-200 font-normal text-xs uppercase tracking-wider">Student Support Services</span></div>
                <div className="flex flex-col gap-2"><div className="max-w-full"><h1 className="text-2xl sm:text-3xl font-bold text-white leading-tight">Kinyui Boys Senior School <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">Guidance & Counseling</span></h1><p className="text-slate-300 text-sm sm:text-base mt-2 font-normal leading-relaxed max-w-2xl">Professional support for academic, emotional, and spiritual well‑being. Providing a safe space for every student to grow and thrive.</p></div>
                <div className="flex items-center gap-3 w-full sm:w-auto mt-4">
                  <button onClick={refreshData} disabled={refreshing} className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-white hover:bg-slate-50 text-slate-900 font-medium text-sm transition-all active:scale-95 disabled:opacity-70 shadow-sm">{refreshing ? <div className="w-3.5 h-3.5 border-2 border-slate-900/20 border-t-slate-900 rounded-full animate-spin" /> : <FiRotateCw className="text-sm" />}<span>{refreshing ? 'Updating...' : 'Refresh Updates'}</span></button>
                  <div className="flex bg-white/10 backdrop-blur-md rounded-lg p-1 border border-white/10"><button onClick={() => setViewMode('grid')} className={`p-2 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-white text-slate-900' : 'text-slate-300 hover:text-white'}`}><FiGrid size={18} /></button><button onClick={() => setViewMode('list')} className={`p-2 rounded-md transition-colors ${viewMode === 'list' ? 'bg-white text-slate-900' : 'text-slate-300 hover:text-white'}`}><FiList size={18} /></button></div>
                </div></div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mb-10">{stats.map((stat, idx) => <ModernStatCard key={idx} stat={stat} />)}</div>

        {/* 24/7 Support Team Section */}
        <div className="bg-gradient-to-r from-amber-50 to-rose-50 rounded-3xl p-6 md:p-8 border border-emerald-100 shadow-sm mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8"><div className="flex items-center gap-4 mb-4 lg:mb-0"><div className="p-3 bg-emerald-500 rounded-2xl shadow-lg"><FiPhoneCall className="text-white text-2xl" /></div><div><h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">Guidance & Counseling Team</h2><p className="text-xs font-bold text-slate-800 uppercase tracking-widest">{teamMembers.length} Dedicated Professionals</p></div></div></div>
          {teamMembers.length === 0 ? <div className="bg-white rounded-2xl p-8 text-center border border-emerald-100"><FiUsers className="text-emerald-300 text-4xl mx-auto mb-4" /><h3 className="text-lg font-bold text-slate-900 mb-2">No Team Members Available</h3><p className="text-slate-800 text-sm">Team information will be loaded soon.</p></div> : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{teamMembers.map(member => <ModernSupportTeamCard key={member.id} member={member} onView={() => { setSelectedMember(member); setIsTeamModalOpen(true); }} onContact={() => toast.success('Contact info coming soon')} viewMode={viewMode} />)}</div>}
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 min-w-0 space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 px-1"><div className="flex items-center gap-4"><div className="p-3 bg-purple-900 rounded-2xl shadow-lg"><FiHeart className="text-white text-2xl" /></div><div><h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">Counseling Sessions</h2><p className="text-xs font-bold text-slate-800 uppercase tracking-widest">{filteredSessions.length} Sessions Available</p></div></div></div>

            {/* Search & Filter Bar - Glass Morphism */}
            <div className="bg-white/80 backdrop-blur-md border border-slate-200/60 p-2 sm:p-3 rounded-2xl sm:rounded-[28px] shadow-lg shadow-slate-200/40">
              <div className="flex flex-col md:flex-row items-center gap-2 sm:gap-3">
                <div className="relative w-full flex-1 group"><div className="relative flex items-center bg-white border border-slate-200 rounded-xl sm:rounded-2xl shadow-sm transition-all focus-within:border-slate-900 focus-within:ring-2 focus-within:ring-slate-900/5"><div className="pl-3 sm:pl-4 pr-2 sm:pr-3"><FiSearch className="text-slate-800" size={16} /></div><input type="text" placeholder="Search sessions, counselors, or topics..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full py-3 sm:py-4 bg-transparent text-slate-900 placeholder:text-slate-800 font-semibold text-sm focus:outline-none" />{searchTerm && <button onClick={() => setSearchTerm('')} className="pr-2"><div className="p-1.5 sm:p-2 bg-slate-100 rounded-lg"><FiX className="w-3.5 h-3.5" /></div></button>}</div></div>
                <div className="flex items-center w-full md:w-auto gap-2 sm:gap-3 border-t border-slate-100 md:border-t-0 md:border-l md:border-slate-100 pt-2 md:pt-0 md:pl-3">
                  <div className="relative flex-1 md:flex-none min-w-0"><select value={activeTab} onChange={(e) => setActiveTab(e.target.value)} className="w-full md:w-40 appearance-none px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-50 md:bg-transparent border-none rounded-xl sm:rounded-2xl md:rounded-full font-semibold text-slate-600 text-xs sm:text-sm cursor-pointer focus:ring-2 focus:ring-purple-500/20 transition-all">{categoryOptions.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}</select><div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-800"><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg></div></div>
                  <button onClick={() => { setSearchTerm(''); setActiveTab('all'); }} className="p-2.5 sm:p-3 md:px-6 md:py-3 bg-purple-600 text-white rounded-xl sm:rounded-2xl md:rounded-full font-bold text-xs sm:text-sm shadow-md shadow-purple-200 hover:bg-purple-700 active:scale-95 transition-all flex items-center justify-center gap-1.5"><FiFilter className="w-3.5 h-3.5" /><span className="hidden md:inline">Reset</span><span className="md:hidden text-[10px] font-bold">Clear</span></button>
                </div>
              </div>
            </div>

            {/* Category Pills */}
            <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar -mx-2 px-2">{categoryOptions.map(cat => { const Icon = cat.icon; const isActive = activeTab === cat.id; return (<button key={cat.id} onClick={() => setActiveTab(cat.id)} className={`flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-5 py-1.5 sm:py-2.5 rounded-full whitespace-nowrap text-[11px] sm:text-sm font-bold transition-all border ${isActive ? 'bg-purple-600 border-purple-600 text-white shadow-md shadow-purple-100' : 'bg-white border-slate-200 text-slate-600'}`}><Icon className={`${isActive ? 'text-white' : 'text-slate-800'} text-xs sm:text-base`} /><span>{cat.name}</span></button>);})}</div>

            {/* Sessions Grid/List */}
            <div className="relative">{filteredSessions.length === 0 ? <div className="bg-slate-50 rounded-[24px] sm:rounded-[32px] border-2 border-dashed border-slate-200 py-8 sm:py-16 text-center"><div className="w-12 h-12 sm:w-16 sm:h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm"><FiHeart className="text-slate-300 text-xl sm:text-2xl" /></div><h3 className="text-lg font-bold text-slate-900">No sessions found</h3><p className="text-slate-800 text-xs sm:text-sm mt-1 mb-4">Try adjusting your filters or search terms.</p><button onClick={() => { setSearchTerm(''); setActiveTab('all'); }} className="px-4 sm:px-6 py-2 sm:py-2.5 bg-white border border-slate-200 rounded-full font-bold text-slate-700 hover:bg-slate-50 transition-all text-xs sm:text-sm">Reset Filters</button></div> : <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6' : 'space-y-3 sm:space-y-4'}>{filteredSessions.map((s, idx) => <ModernCounselingCard key={s.id || idx} session={s} onView={setSelectedSession} onBookmark={handleBookmark} viewMode={viewMode} />)}</div>}</div>
          </div>

          {/* Right Column: Well-being Info */}
          <div className="lg:w-[380px] space-y-6"><div className="lg:sticky lg:top-24 space-y-6">
            {/* About Our Counseling */}
            <div className="bg-white rounded-[32px] p-6 border border-slate-100 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-purple-50 rounded-xl"><FiShield className="text-purple-600 text-lg" /></div>
                <h4 className="font-bold text-slate-900">Confidential & Safe</h4>
              </div>
              <p className="text-slate-800 text-sm leading-relaxed mb-3">
                All counseling sessions at Kinyui Boys Senior School are 100% confidential. Our trained professionals follow strict ethical guidelines to protect every student&apos;s privacy.
              </p>
              <p className="text-slate-800 text-sm leading-relaxed">
                Whether you need academic guidance, emotional support, or spiritual counsel, our team is here for you  no judgment, just care.
              </p>
            </div>
          </div></div>
        </div>

{/* Feature Banner */}
<div className="relative overflow-hidden bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-8 shadow-xl shadow-slate-200/40">
  
  {/* Background Blurs */}
  <div className="absolute top-0 right-0 w-32 sm:w-48 h-32 sm:h-48 bg-purple-50 blur-[70px] rounded-full -mr-16 -mt-16" />
  <div className="absolute bottom-0 left-0 w-32 sm:w-48 h-32 sm:h-48 bg-pink-50 blur-[70px] rounded-full -ml-16 -mb-16" />

  <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
    
    {/* Icon */}
    <div className="shrink-0">
      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-slate-50 flex items-center justify-center shadow-sm">
        <FiHeart className="text-xl sm:text-2xl text-slate-800" />
      </div>
    </div>

    {/* Content */}
    <div className="flex-1 text-center md:text-left">
      
      {/* Title */}
      <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 mb-2">
        Your Well-being Matters
      </h3>

      {/* Description */}
      <p className="text-slate-800 text-sm sm:text-base leading-relaxed max-w-xl mx-auto md:mx-0">
        We focus on the complete student  supporting mental, emotional, and personal growth beyond academics.
      </p>

      {/* Features */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 mt-5">
        {[
          { label: 'Confidential', icon: FiShield, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: '24/7 Support', icon: FiPhoneCall, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Professional', icon: FiUser, color: 'text-purple-600', bg: 'bg-purple-50' },
          { label: 'Holistic', icon: FiHeart, color: 'text-pink-600', bg: 'bg-pink-50' }
        ].map((f, idx) => (
          <div 
            key={idx} 
            className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-lg hover:bg-white hover:shadow-md transition"
          >
            <div className={`p-2 rounded-md ${f.bg} ${f.color}`}>
              <f.icon size={16} />
            </div>
            <span className="text-[11px] font-semibold text-slate-700">
              {f.label}
            </span>
          </div>
        ))}
      </div>

    </div>
  </div>
</div>
      </div>

      {/* Modals */}
      {selectedSession && !shareModalOpen && <ModernDetailModal session={selectedSession} onClose={() => setSelectedSession(null)} onContact={() => toast.success('Connecting to support...')} onShare={(s) => { setSessionToShare(s); setShareModalOpen(true); }} />}
      {shareModalOpen && sessionToShare && <ModernShareModal session={sessionToShare} onClose={() => { setShareModalOpen(false); setSessionToShare(null); }} />}
      {selectedMember && <TeamMemberModal member={selectedMember} isOpen={isTeamModalOpen} onClose={() => { setIsTeamModalOpen(false); setSelectedMember(null); }} />}
    </div>
  );
}