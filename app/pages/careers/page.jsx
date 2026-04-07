'use client';
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
  FiSend,
  FiRefreshCw
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
import { CircularProgress, Box, Typography, Stack } from '@mui/material';

// CV Submission Modal Component
const CVSubmissionModal = ({ open, onClose }) => {
  if (!open) return null;

  const handleEmailClick = () => {
    const subject = encodeURIComponent('Job Application / CV Submission');
    const body = encodeURIComponent(
      'Dear Hiring Manager,\n\n' +
      'I am writing to submit my application for any suitable position at Kinyui Boys Senior School.\n\n' +
      'Please find attached my CV and relevant documents.\n\n' +
      'Thank you for your consideration.\n\n' +
      'Sincerely,\n' +
      '[Your Full Name]'
    );
    window.location.href = `mailto:kinyuiboys2015@gmail.com?subject=${subject}&body=${body}`;
  };

  return (
    /* 1. Overlay: added overflow-y-auto to allow scrolling when zoomed */
    <div className="fixed inset-0 z-[200] flex justify-center sm:items-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      
      {/* 2. Modal: increased width to max-w-2xl and added max-h constraint */}
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl my-auto overflow-hidden border border-slate-100">
        
        {/* Accent Header */}
        <div className="h-2.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600" />
        
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 bg-slate-50 hover:bg-slate-100 text-slate-500 rounded-full transition-all z-10"
        >
          <IoClose size={20} />
        </button>

        {/* 3. Scrollable Content Area */}
        <div className="p-6 sm:p-10 max-h-[calc(100vh-100px)] overflow-y-auto">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4 rotate-3">
              <FiFileText className="text-blue-600 text-3xl -rotate-3" />
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Join Our Team</h2>
            <p className="text-slate-500 text-base max-w-md mx-auto">
              Ready to make an impact? Choose your preferred method to submit your credentials.
            </p>
          </div>

          {/* 4. Responsive Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="space-y-4">
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 hover:border-blue-200 transition-colors">
                <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <FiMail className="text-blue-600" />
                  Email Submission
                </h3>
                <p className="text-slate-600 text-sm mb-4">
                  Digital applications are processed within 3-5 business days.
                </p>
                <button
                  onClick={handleEmailClick}
                  className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-200 transition-all flex items-center justify-center gap-2 text-sm"
                >
                  <FiMail size={16} />
                  Send to kinyuiboys2015
                </button>
              </div>

              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5">
                <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <FiPhone className="text-green-600" />
                  Physical Submission
                </h3>
                <address className="text-slate-600 not-italic text-sm leading-relaxed">
                  <span className="font-semibold text-slate-800">Kinyui Boys Senior School</span><br />
                  Matungulu Sub County<br />
                  Machakos, Kenya
                </address>
              </div>
            </div>

            <div className="bg-indigo-50/50 border border-indigo-100 rounded-2xl p-5">
              <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                <FiInfo className="text-indigo-600" />
                Required Documents
              </h3>
              <ul className="space-y-3">
                {[
                  "Updated CV/Resume",
                  "Detailed Cover Letter",
                  "Academic Certificates",
                  "Professional Certs",
                  "Recommendation Letters"
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-sm text-slate-700">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-6 p-3 bg-white/60 rounded-lg border border-indigo-100 text-[11px] text-indigo-600 font-medium">
                Note: All digital documents should be in PDF format for better compatibility.
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full py-3 text-slate-500 font-semibold hover:text-slate-800 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};
// Modern Modal Component with Glass Morphism
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

// Modern Job Card Component - Redesigned with a more minimal, card-based approach
const ModernJobCard = ({ job, onView, onBookmark, onShare, viewMode = 'grid' }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const handleWhatsAppShare = (e) => {
    e.stopPropagation();
    const text = `Job Opening: ${job?.jobTitle} at kinyui boys Senior School. ${job?.jobType} position in ${job?.department || 'various departments'}.`;
    const url = window.location.href;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleCopyLink = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard!');
  };

  const getJobTypeStyle = (type) => {
    const styles = {
      'full-time': {
        gradient: 'from-emerald-500 to-green-500',
        bg: 'bg-emerald-50',
        text: 'text-emerald-700',
        border: 'border-emerald-200'
      },
      'part-time': {
        gradient: 'from-blue-500 to-cyan-500',
        bg: 'bg-blue-50',
        text: 'text-blue-700',
        border: 'border-blue-200'
      },
      'contract': {
        gradient: 'from-purple-500 to-pink-500',
        bg: 'bg-purple-50',
        text: 'text-purple-700',
        border: 'border-purple-200'
      },
      'internship': {
        gradient: 'from-amber-500 to-orange-500',
        bg: 'bg-amber-50',
        text: 'text-amber-700',
        border: 'border-amber-200'
      }
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

      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return 'Open';
    }
  };

  const CategoryIcon = getCategoryIcon(job?.category);

  // Modern Grid View - Redesigned
  if (viewMode === 'grid') {
    const theme = getJobTypeStyle(job?.jobType);
    const daysLeft = formatDate(job?.applicationDeadline);
    const isUrgent = daysLeft === 'Today' || daysLeft === 'Tomorrow';

    return (
      <div
        onClick={() => onView(job)}
        className="group relative bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer overflow-hidden"
      >
        {/* Subtle top accent line */}
        <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${theme.gradient}`} />

        <div className="p-6">
          {/* Header: Category and Actions */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className={`p-2 rounded-lg ${theme.bg} ${theme.text}`}>
                <CategoryIcon size={16} />
              </div>
              <span className={`text-xs font-medium ${theme.text}`}>
                {job?.category || 'General'}
              </span>
            </div>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={handleWhatsAppShare}
                className="p-1.5 rounded-lg text-green-500 hover:text-green-600 hover:bg-green-50"
                title="Share on WhatsApp"
              >
                <FaWhatsapp size={14} />
              </button>
              <button
                onClick={handleCopyLink}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50"
                title="Copy link"
              >
                <FiCopy size={14} />
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

          {/* Job Title */}
          <h3 className="text-xl font-bold text-slate-900 mb-2 line-clamp-2 leading-tight">
            {job?.jobTitle || 'Position Available'}
          </h3>

          {/* Department */}
          <div className="flex items-center gap-2 mb-4">
            <FiBuilding className="text-slate-400" size={14} />
            <span className="text-sm text-slate-600">
              {job?.department || 'School Department'}
            </span>
          </div>

          {/* Description */}
          <p className="text-slate-500 text-sm mb-6 line-clamp-2">
            {job?.jobDescription || 'Join our dedicated team at kinyui boys Senior School. We are looking for passionate individuals to contribute to our educational mission.'}
          </p>

          {/* Info Row - Compact */}
          <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-slate-500">
            <div className="flex items-center gap-1.5">
              <FiCalendar className={theme.text} size={14} />
              <span>{daysLeft}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <FiUsers className={theme.text} size={14} />
              <span>{job?.positionsAvailable || 1} position(s)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <FiClock className={theme.text} size={14} />
              <span className="capitalize">{job?.jobType?.replace('-', ' ') || 'Full-time'}</span>
            </div>
          </div>

          {/* Experience Badge */}
          <div className="mb-6 inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-50 rounded-lg text-xs text-slate-600">
            <FiAward size={12} className="text-amber-500" />
            <span>{job?.experience || 'Not specified'}</span>
          </div>

          {/* Action Button */}
          <button className="w-full py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl font-medium text-sm flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors group-hover:border-slate-300">
            View Details
            <FiArrowRight size={14} />
          </button>
        </div>
      </div>
    );
  }

  // List View - Redesigned
  return (
    <div
      onClick={() => onView(job)}
      className="group bg-white rounded-xl border border-slate-100 p-4 shadow-sm hover:shadow-md transition-all cursor-pointer"
    >
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Icon */}
        <div className={`w-12 h-12 rounded-xl ${getJobTypeStyle(job?.jobType).bg} flex items-center justify-center shrink-0`}>
          <CategoryIcon className={`${getJobTypeStyle(job?.jobType).text} text-xl`} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
            <div>
              <h3 className="text-lg font-bold text-slate-900 line-clamp-1">
                {job?.jobTitle || 'Position Available'}
              </h3>
              <p className="text-sm text-slate-500">{job?.department || 'Department'}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className={`px-2 py-0.5 rounded-md text-xs font-medium ${getJobTypeStyle(job?.jobType).bg} ${getJobTypeStyle(job?.jobType).text}`}>
                {job?.jobType?.replace('-', ' ') || 'Full-time'}
              </span>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={handleWhatsAppShare}
                  className="p-1.5 rounded-lg text-green-500 hover:text-green-600 hover:bg-green-50"
                  title="Share on WhatsApp"
                >
                  <FaWhatsapp size={14} />
                </button>
                <button
                  onClick={handleCopyLink}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50"
                  title="Copy link"
                >
                  <FiCopy size={14} />
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
          </div>

          <p className="text-slate-500 text-sm line-clamp-2 mb-3">
            {job?.jobDescription || 'Join our dedicated team at kinyui boys Senior School.'}
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
            <div className="flex items-center gap-1.5">
              <FiCalendar size={12} />
              <span>{formatDate(job?.applicationDeadline)}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <FiUsers size={12} />
              <span>{job?.positionsAvailable || 1} position(s)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <FiAward size={12} className="text-amber-500" />
              <span>{job?.experience || 'Flexible'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Modern Stats Card Component - Redesigned
const ModernStatCard = ({ stat }) => {
  const Icon = stat.icon;

  return (
    <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm">
      <div className="flex items-center gap-3 mb-3">
        <div className={`p-2 rounded-lg bg-gradient-to-br ${stat.gradient} bg-opacity-10`}>
          <Icon className="text-slate-700 text-xl" />
        </div>
        <h3 className="text-2xl font-bold text-slate-900">{stat.number}</h3>
      </div>
      <p className="text-sm font-semibold text-slate-800">{stat.label}</p>
      <p className="text-xs text-slate-500 mt-0.5">{stat.sublabel}</p>
    </div>
  );
};

// Modern Job Detail Modal - Redesigned
const ModernJobDetailModal = ({ job, onClose, onApply }) => {
  if (!job) return null;

  const handleWhatsAppShare = () => {
    const text = `Check out this job opportunity at kinyui boys Senior School: ${job.jobTitle} - ${job.department || 'Various Departments'}`;
    const url = window.location.href;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard!');
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

  const daysLeft = (dateString) => {
    if (!dateString) return 'Open';
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diff = Math.ceil((date - now) / (1000 * 60 * 60 * 24));

      if (diff === 0) return 'Ends today';
      if (diff === 1) return 'Ends tomorrow';
      if (diff < 0) return 'Closed';
      return `${diff} days left`;
    } catch {
      return 'Open';
    }
  };

  const theme = getJobTypeStyle(job.jobType);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header with Gradient */}
        <div className={`h-2 bg-gradient-to-r ${theme.gradient}`} />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md hover:bg-slate-50 transition-colors z-10"
        >
          <IoClose size={18} />
        </button>

        {/* Content */}
        <div className="p-6 max-h-[85vh] overflow-y-auto">
          <div className="space-y-6">
            {/* Title & Basic Info */}
            <div>
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-xl bg-gradient-to-r ${theme.gradient}`}>
                    <FiBriefcase className="text-white text-xl" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">{job.jobTitle}</h2>
                    <p className="text-slate-600">{job.department || 'School Department'}</p>
                  </div>
                </div>
                {/* Share buttons in modal */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleWhatsAppShare}
                    className="p-2 rounded-lg text-green-500 hover:text-green-600 hover:bg-green-50"
                    title="Share on WhatsApp"
                  >
                    <FaWhatsapp size={18} />
                  </button>
                  <button
                    onClick={handleCopyLink}
                    className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50"
                    title="Copy link"
                  >
                    <FiCopy size={18} />
                  </button>
                </div>
              </div>

              {/* Quick Info */}
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2 text-slate-600">
                  <IoCalendarClearOutline className="text-blue-500" />
                  <span>{formatFullDate(job.applicationDeadline)}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <IoTimeOutline className="text-emerald-500" />
                  <span>{daysLeft(job.applicationDeadline)}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <IoBusinessOutline className="text-purple-500" />
                  <span className="capitalize">{job.jobType?.replace('-', ' ') || 'Full-time'}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <FiUsers className="text-blue-500" />
                  <span>{job.positionsAvailable || 1} position(s)</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-sm font-semibold text-slate-900 mb-2">Job Description</h3>
              <div className="text-slate-600 text-sm leading-relaxed bg-slate-50 p-4 rounded-xl">
                {job.jobDescription || 'Join our dedicated team at kinyui boys Senior School. We are looking for passionate individuals to contribute to our educational mission.'}
              </div>
            </div>

            {/* Requirements */}
            {job.requirements && (
              <div>
                <h3 className="text-sm font-semibold text-slate-900 mb-2">Requirements</h3>
                <div className="text-slate-600 text-sm bg-emerald-50 p-4 rounded-xl">
                  {job.requirements}
                </div>
              </div>
            )}

            {/* Qualifications */}
            {job.qualifications && (
              <div>
                <h3 className="text-sm font-semibold text-slate-900 mb-2">Qualifications</h3>
                <div className="text-slate-600 text-sm bg-purple-50 p-4 rounded-xl">
                  {job.qualifications}
                </div>
              </div>
            )}

            {/* How to Apply */}
            <div className="bg-blue-50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <FiSend className="text-blue-600" />
                <h3 className="font-semibold text-slate-900">How to Apply</h3>
              </div>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-slate-600 mb-1">Send your application to:</p>
                  <a href={`mailto:${job.contactEmail || 'kinyuiboys2015@gmail.com'}`} className="text-blue-600 font-medium">
                    {job.contactEmail || 'kinyuiboys2015@gmail.com'}
                  </a>
                </div>
                <div>
                  <p className="text-slate-600 mb-1">Or call for inquiries:</p>
                  <a href={`tel:${job.contactPhone || '+254712345678'}`} className="text-green-600 font-medium">
                    {job.contactPhone || '+254 712 345 678'}
                  </a>
                </div>
                <p className="text-xs text-slate-500 mt-2">Please include your CV, certificates, and cover letter.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50">
          <div className="flex justify-center">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Modern Empty State Component - Redesigned
const ModernEmptyState = ({ onClearFilters }) => {
  return (
    <div className="bg-white rounded-2xl border border-dashed border-slate-200 py-12 px-6 text-center">
      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <FiBriefcase className="text-slate-400 text-2xl" />
      </div>
      <h3 className="text-xl font-semibold text-slate-900 mb-2">No Openings</h3>
      <p className="text-slate-500 mb-6 max-w-sm mx-auto">
        Currently no opportunities available at kinyui boys Senior School.
      </p>
      <button
        onClick={onClearFilters}
        className="px-5 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors"
      >
        Reset Filters
      </button>
    </div>
  );
};

// Main Component
export default function ModernCareersPage() {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedJob, setSelectedJob] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [bookmarkedJobs, setBookmarkedJobs] = useState(new Set());
  const [activeTab, setActiveTab] = useState('all');
  const [refreshing, setRefreshing] = useState(false);
  const [showCVModal, setShowCVModal] = useState(false);

  // Stats data
  const stats = [
    {
      icon: FiBriefcase,
      number: '0',
      label: 'Open Positions',
      sublabel: 'Currently available',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: FiUsers,
      number: '50+',
      label: 'Staff Members',
      sublabel: 'Our current team',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      icon: FaGraduationCap,
      number: '8',
      label: 'Departments',
      sublabel: 'Academic & support',
      gradient: 'from-emerald-500 to-green-500'
    },
    {
      icon: FiAward,
      number: '25+',
      label: 'Years Excellence',
      sublabel: 'Educational experience',
      gradient: 'from-amber-500 to-orange-500'
    }
  ];

  // Categories for filtering
  const categories = [
    { id: 'all', name: 'All Positions', icon: FiBriefcase },
    { id: 'teaching', name: 'Teaching', icon: FaGraduationCap },
    { id: 'administrative', name: 'Administrative', icon: FiBriefcase },
    { id: 'support', name: 'Support Staff', icon: FiUsers },
    { id: 'technical', name: 'Technical', icon: FiZap },
    { id: 'medical', name: 'Medical', icon: FiShield }
  ];

  // Fetch jobs from API
  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/career');

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.success && Array.isArray(data.jobs)) {
          setJobs(data.jobs);
          setFilteredJobs(data.jobs);

          if (stats[0]) {
            stats[0].number = data.jobs.length.toString();
          }
        } else {
          console.error('Invalid API response format:', data);
          toast.error('Invalid data format received from server');
          setJobs([]);
          setFilteredJobs([]);
        }
      } catch (error) {
        console.error('Error fetching jobs:', error);
        toast.error('Failed to load job listings. Please try again.');
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
      filtered = filtered.filter(job =>
        job?.category?.toLowerCase() === activeTab.toLowerCase()
      );
    }

    if (search) {
      filtered = filtered.filter(job =>
        job?.jobTitle?.toLowerCase().includes(search.toLowerCase()) ||
        job?.department?.toLowerCase().includes(search.toLowerCase()) ||
        job?.jobDescription?.toLowerCase().includes(search.toLowerCase())
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

  const handleShare = (job) => {
    if (navigator.share) {
      navigator.share({
        title: `${job.jobTitle} - kinyui boys Senior School`,
        text: `Check out this job opportunity at kinyui boys Senior School: ${job.jobTitle}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  const handleShareAllJobs = () => {
    const text = `Check out current job openings at kinyui boys Senior School! ${filteredJobs.length} positions available.`;
    const url = window.location.href;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleCopyAllJobsLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard!');
  };

  const handleApply = (job) => {
    toast.success(`Application process for ${job.jobTitle} will open soon!`);
  };

  const refreshData = async () => {
    setRefreshing(true);
    try {
      const response = await fetch('/api/career');
      const data = await response.json();

      if (data.success && Array.isArray(data.jobs)) {
        setJobs(data.jobs);
        setFilteredJobs(data.jobs);
        toast.success(`Refreshed! ${data.jobs.length} positions loaded`);
      }
    } catch (error) {
      console.error('Error refreshing jobs:', error);
      toast.error('Failed to refresh job listings');
    } finally {
      setRefreshing(false);
    }
  };

  const clearFilters = () => {
    setSearch('');
    setActiveTab('all');
  };


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
Loading for Opportunities at Kinyui Senior School       
   </p>
          <p className="text-slate-400 text-[10px] sm:text-xs uppercase tracking-widest mt-1 font-bold">
            kinyui boys Senior School
          </p>
        </div>
      </Stack>
    </Box>
  );
}


  return (
    <div className="min-h-screen bg-white">
      {/* Background Logo - Low Opacity */}
     <div
  className="fixed inset-0 pointer-events-none z-0 bg-no-repeat bg-center bg-contain opacity-[0.30] "
  style={{
    backgroundImage: "url('/kinyui.png')",
    backgroundSize: 'min(80%, 600px)',
  }}
/>

      <Toaster position="top-right" richColors />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Header Section */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-full mb-4">
            <IoSparkles className="text-blue-500 w-3.5 h-3.5" />
            <span className="text-xs font-medium text-slate-700">Career Opportunities</span>
          </div>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 mb-6 leading-tight">
  Join Our <span className="block sm:inline">Academic Team</span> 
  <span className="block mt-2 text-2xl sm:text-3xl md:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-[#5D4037] via-[#880E4F] to-[#FFB300] animate-gradient-x">
    at Kinyui Boys Senior School
  </span>
</h1>
     <p className="text-slate-900 text-md leading-relaxed max-w-4xl mx-auto">
  At <span className="font-semibold text-amber-900">Kinyui Boys Senior School</span>, we believe that educators are the architects of the future. Join a community dedicated to academic excellence, where your passion for teaching inspires the next generation of Kenyan leaders, innovators, and thinkers.
</p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {stats.map((stat, index) => {
            const updatedStat = { ...stat };
            if (index === 0) {
              updatedStat.number = jobs.length.toString();
            }
            return <ModernStatCard key={index} stat={updatedStat} />;
          })}
        </div>

        {/* Main Layout: Sidebar + Content */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-1/4 space-y-6">
            {/* School Info Card */}
            <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                  <IoSchoolOutline className="text-slate-700 text-xl" />
                </div>
                <h2 className="text-lg font-semibold text-slate-900">kinyui boys</h2>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-2 text-sm">
                  <FiMapPin className="text-slate-400 mt-0.5" />
                  <span className="text-slate-600">Matungulu Sub County, Machakos, Kenya</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <FiMail className="text-slate-400" />
                  <a href="mailto:kinyuiboys2015@gmail.com" className="text-blue-600 hover:underline">
                    kinyuiboys2015@gmail.com
                  </a>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <FiPhone className="text-slate-400" />
                  <a href="tel:+254710894145" className="text-green-600 hover:underline">
                    +254 710 894 145
                  </a>
                </div>
              </div>

            <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col items-center">
  <div className="flex items-center gap-3 mb-2">
    <div className="h-[1px] w-8 bg-gradient-to-r from-transparent to-slate-300" />
    <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-400">School Motto</span>
    <div className="h-[1px] w-8 bg-gradient-to-l from-transparent to-slate-300" />
  </div>
  <p className="text-sm md:text-base font-serif italic text-slate-800 tracking-wide text-center">
    "Soaring To <span className="text-rose-900 font-semibold">Excellence</span>... We Believe in <span className="text-amber-600 font-semibold">Prayer</span>"
  </p>
</div>
            </div>

            {/* Career Info Card */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-5 text-white">
              <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center mb-3">
                <FiBriefcase className="text-white text-xl" />
              </div>
              <h3 className="text-lg font-semibold mb-1">Build Your Career</h3>
              <p className="text-sm text-slate-300 mb-3">
                {jobs.length} positions currently available
              </p>
              <button
                onClick={() => toast.info('Contact HR for general inquiries')}
                className="w-full py-2 bg-white/10 rounded-lg text-sm font-medium hover:bg-white/20 transition-colors"
              >
                Contact HR
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative">
                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type="text"
                  placeholder="🔍 Search for positions by title, department, or description..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 border border-slate-200 rounded-xl text-base font-semibold placeholder:font-normal focus:outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100 transition-all"
                />
              </div>
            </div>

            {/* Action Buttons Row - Full width with text */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
              <button
                onClick={refreshData}
                disabled={refreshing}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-all disabled:opacity-50"
              >
                <FiRefreshCw size={18} className={refreshing ? 'animate-spin' : ''} />
                <span>Refresh Jobs</span>
              </button>

              <button
                onClick={handleShareAllJobs}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-green-50 border border-green-200 rounded-xl text-green-900 font-semibold text-sm hover:bg-green-100 transition-all"
              >
                <FaWhatsapp size={18} />
                <span>WhatsApp Share</span>
              </button>

              <button
                onClick={handleCopyAllJobsLink}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold text-sm hover:bg-slate-100 transition-all"
              >
                <FiCopy size={18} />
                <span>Copy Link</span>
              </button>

              <button
                onClick={clearFilters}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 font-semibold text-sm hover:bg-amber-100 transition-all"
              >
                <FiFilter size={18} />
                <span>Reset Filters</span>
              </button>

              <button
                onClick={() => setShowCVModal(true)}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-xl font-semibold text-sm hover:bg-blue-900 transition-all shadow-md"
              >
                <FiFileText size={18} />
                <span>Submit CV</span>
              </button>
            </div>

            {/* Category Select and View Toggle Row */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              {/* Category Select */}
              <select
                value={activeTab}
                onChange={(e) => setActiveTab(e.target.value)}
                className="px-4 py-2.5 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:border-slate-400 font-medium"
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>

              {/* View Toggle */}
              <div className="flex border border-slate-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`flex items-center gap-2 px-4 py-2 ${viewMode === 'grid' ? 'bg-slate-900 text-white' : 'bg-white text-slate-600'}`}
                >
                  <FiTrendingUp size={16} />
                  <span className="text-sm font-medium">Grid View</span>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`flex items-center gap-2 px-4 py-2 ${viewMode === 'list' ? 'bg-slate-900 text-white' : 'bg-white text-slate-600'}`}
                >
                  <FiList size={16} />
                  <span className="text-sm font-medium">List View</span>
                </button>
              </div>
            </div>

    {/* Category Pills */}
<div className="flex flex-wrap gap-2 mb-8 w-full">
  {categories.map(cat => {
    const Icon = cat.icon;
    const isActive = activeTab === cat.id;
    return (
      <button
        key={cat.id}
        onClick={() => setActiveTab(cat.id)}
        /* Added 'flex-1' and 'sm:flex-none' 
           This makes them fill the width on mobile but stay compact on desktop 
        */
        className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex-1 sm:flex-none min-w-[calc(50%-8px)] sm:min-w-0 border ${
          isActive
            ? 'bg-slate-900 text-white border-slate-900 shadow-md shadow-slate-200 scale-[1.02]'
            : 'bg-white text-slate-600 border-slate-100 hover:bg-slate-50 hover:border-slate-200'
        }`}
      >
        <Icon size={14} className={isActive ? "text-blue-400" : "text-slate-400"} />
        <span className="whitespace-nowrap">{cat.name}</span>
      </button>
    );
  })}
</div>

            {/* Job Listings */}
            {filteredJobs.length === 0 ? (
              <ModernEmptyState onClearFilters={clearFilters} />
            ) : (
              <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-5' : 'space-y-4'}>
                {filteredJobs.map((job, index) => (
                  <ModernJobCard
                    key={job.id || index}
                    job={job}
                    onView={setSelectedJob}
                    onBookmark={handleBookmark}
                    onShare={handleShare}
                    viewMode={viewMode}
                  />
                ))}
              </div>
            )}

            {/* CTA Banner */}
            <div className="mt-10 bg-gradient-to-r from-slate-100 to-slate-50 rounded-xl p-6 text-center border border-slate-200">
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Don't see the right fit?</h3>
              <p className="text-slate-600 mb-4">Submit your CV for future opportunities.</p>
              <button
                onClick={() => setShowCVModal(true)}
                className="px-6 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-md"
              >
                Submit Your CV
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Job Detail Modal */}
      {selectedJob && (
        <ModernJobDetailModal
          job={selectedJob}
          onClose={() => setSelectedJob(null)}
          onApply={handleApply}
        />
      )}

      {/* CV Submission Modal */}
      <CVSubmissionModal open={showCVModal} onClose={() => setShowCVModal(false)} />
    </div>
  );
}