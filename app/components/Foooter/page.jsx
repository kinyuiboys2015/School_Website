'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import {
  FiMapPin,
  FiPhone,
  FiMail,
  FiClock,
  FiHome,
  FiBook,
  FiUsers,
  FiCalendar,
  FiImage,
  FiUserCheck,
  FiBookOpen,
  FiHelpCircle,
  FiGlobe,
  FiLock,
  FiShield,
  FiGithub,
  FiTarget,
  FiBriefcase,
  FiActivity,
  FiUserPlus,
  FiBell,
  FiCheckCircle,
  FiDownload,
  FiEye,
  FiX,
  FiTrendingUp,
  FiStar,
  FiHeart,
  FiArrowUp,
  FiCompass,
  FiAward,
  FiExternalLink,
} from 'react-icons/fi';
import {
  SiFacebook,
  SiYoutube,
  SiLinkedin,
  SiWhatsapp,
  SiInstagram,
  SiTwitter,
} from 'react-icons/si';
import { FaLinkedin, FaTiktok } from 'react-icons/fa';

// ----------------------------------------------------------------------
// Data Layer - RESTRUCTURED for better organization
// ----------------------------------------------------------------------

// Main Navigation Links
const MAIN_NAVIGATION = [
  { name: 'Home', href: '/', icon: FiHome, color: 'emerald' },
  { name: 'About Us', href: '/pages/AboutUs', icon: FiUsers, color: 'blue' },
  { name: 'Admissions', href: '/pages/admissions', icon: FiUserCheck, color: 'purple' },
  { name: 'Academics', href: '/pages/academics', icon: FiBook, color: 'amber' },
  { name: 'Student Life', href: '/pages/student-life', icon: FiHeart, color: 'rose' },
  { name: 'News & Events', href: '/pages/eventsandnews', icon: FiCalendar, color: 'cyan' },
];

// Quick Resources
const QUICK_RESOURCES = [
  { name: 'Student Portal', href: '/pages/StudentPortal', icon: FiBookOpen, badge: 'Login' },
  { name: 'Staff Directory', href: '/pages/staff', icon: FiUsers, badge: 'Contact' },
  { name: 'Fees Structure', href: '/pages/fees', icon: FiCompass, badge: '2025' },
  { name: 'School Calendar', href: '/pages/calendar', icon: FiCalendar, badge: 'Term 2' },
  { name: 'Apply Now', href: '/pages/apply-for-admissions', icon: FiUserPlus, badge: 'Open' },
  { name: 'Exam Results', href: '/pages/results', icon: FiTrendingUp, badge: 'KCSE' },
];

// Support & Policies
const SUPPORT_LINKS = [
  { name: 'Guidance & Counselling', href: '/pages/Guidance-and-Councelling', icon: FiHelpCircle },
  { name: 'School Policies', href: '/pages/OurSchoolPolicies', icon: FiShield },
  { name: 'Career Services', href: '/pages/careers', icon: FiBriefcase },
  { name: 'Gallery', href: '/pages/gallery', icon: FiImage },
  { name: 'Admin Login', href: '/pages/adminLogin', icon: FiLock },
  { name: 'Contact Us', href: '/pages/contact', icon: FiMail },
];

// Social Media Links - Updated with correct info
const SOCIAL_LINKS = [
  { icon: SiFacebook, href: 'https://www.facebook.com/KinyuiBoysHighSchool/', label: 'Facebook', color: '#1877F2', bgClass: 'bg-[#1877F2]' },
  { icon: FaLinkedin, href: 'https://www.linkedin.com/company/kinyui-boys-senior-school/', label: 'LinkedIn', color: '#0A66C2', bgClass: 'bg-[#0A66C2]' },
  { icon: SiYoutube, href: 'https://www.youtube.com/channel/UCybL9mGxlEKqIAVnwOaFQ2w', label: 'YouTube', color: '#FF0000', bgClass: 'bg-[#FF0000]' },
  { icon: FaTiktok, href: 'https://www.tiktok.com/@kinyui.boys.high', label: 'TikTok', color: '#010101', bgClass: 'bg-[#010101]' },
  { icon: SiInstagram, href: 'https://www.instagram.com/kinyuiboys/', label: 'Instagram', color: '#E4405F', bgClass: 'bg-[#E4405F]' },
];

// Contact Information - Grouped by type
const CONTACT_INFO = {
  physical: [
    { icon: FiMapPin, text: 'Matungulu, Machakos County', detail: 'Along Tala Kangudo Kanzalu Road', href: 'https://maps.app.goo.gl/CvZsLB55zaNhwbeG8' }
  ],
  phone: [
    { icon: FiPhone, text: '+254 733 587223', detail: 'Main Office', href: 'tel:0733587223' },
    { icon: FiPhone, text: '+254 710 894150', detail: 'Admissions', href: 'tel:0710894150' }
  ],
  email: [
    { icon: FiMail, text: 'kinyuiboys2015@gmail.com', detail: 'General Inquiries', href: 'mailto:kinyuiboys2015@gmail.com' },
    { icon: FiMail, text: 'admissions@kinyuiboys.ac.ke', detail: 'Admissions Office', href: 'mailto:admissions@kinyuiboys.ac.ke' }
  ],
  hours: [
    { icon: FiClock, text: 'Mon - Fri: 7:30 AM - 5:00 PM', detail: 'Saturday: 8:00 AM - 1:00 PM', href: '#' }
  ]
};

// School Stats
const SCHOOL_STATS = [
  { value: 45, label: 'Qualified Teachers', icon: FiUsers, trend: '+5' },
  { value: 1200, label: 'Enrolled Students', icon: FiBookOpen, trend: '+12%' },
  { value: 98, label: 'Pass Rate', icon: FiTrendingUp, trend: '+3%' },
  { value: 48, label: 'Years of Excellence', icon: FiAward, trend: 'Since 1976' },
];

// ----------------------------------------------------------------------
// Components
// ----------------------------------------------------------------------

// Modern Stat Card
const StatCard = ({ value, label, icon: Icon, trend }) => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      if (count < value) {
        setCount(prev => Math.min(prev + Math.ceil(value / 40), value));
      }
    }, 20);
    return () => clearTimeout(timer);
  }, [count, value]);

  return (
    <div className="group relative bg-white/5 backdrop-blur-sm rounded-2xl p-4 text-center hover:bg-white/10 transition-all duration-300 border border-white/10 hover:border-emerald-500/50">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 to-emerald-500/0 group-hover:from-emerald-500/5 group-hover:to-emerald-500/10 rounded-2xl transition-all duration-500" />
      <div className="relative z-10">
        <div className="flex justify-center mb-3">
          <div className="p-2.5 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
            <Icon className="text-white text-xl" />
          </div>
        </div>
        <p className="text-3xl font-black text-white">{count}+</p>
        <p className="text-xs text-emerald-400 font-bold uppercase tracking-wide mt-1">{label}</p>
        {trend && (
          <p className="text-[9px] text-white/40 mt-1 font-mono">{trend}</p>
        )}
      </div>
    </div>
  );
};

// Brand Section - Redesigned
const BrandSection = () => (
  <div className="space-y-6">
    <div className="flex flex-col items-start gap-4">
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-amber-500 rounded-2xl blur-xl opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-gradient-to-br from-emerald-600 to-teal-700 p-0.5">
          <div className="w-full h-full rounded-2xl overflow-hidden bg-gray-900 flex items-center justify-center">
            <img
              src="/kinyui.png"
              alt="Kinyui Boys Senior School Logo"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-gray-900" />
      </div>
      
      <div>
        <h3 className="text-2xl font-black text-white tracking-tight">
          Kinyui Boys <span className="text-emerald-400">Senior School</span>
        </h3>
        <p className="text-white/50 text-xs font-bold uppercase tracking-wider mt-1">
          Excellence in Education • Discipline • Integrity
        </p>
      </div>
    </div>
    
    {/* Stats Grid */}
    <div className="grid grid-cols-2 gap-3">
      {SCHOOL_STATS.map((stat, idx) => (
        <StatCard key={idx} {...stat} />
      ))}
    </div>
    
    <p className="text-white/60 text-sm leading-relaxed border-l-2 border-emerald-500 pl-4 italic">
      "An Extra County learning institution dedicated to academic excellence, 
      holistic development, and nurturing future leaders since 1976."
    </p>
  </div>
);

// Contact Info Section - Modern Grid Layout
const ContactSection = () => (
  <div className="space-y-4">
    <div className="flex items-center gap-2 pb-3 border-b border-white/10">
      <div className="p-1.5 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg">
        <FiMapPin className="text-white text-sm" />
      </div>
      <h4 className="text-base font-bold text-white uppercase tracking-wide">Get in Touch</h4>
    </div>
    
    <div className="space-y-4">
      {/* Physical Address */}
      <div className="space-y-2">
        {CONTACT_INFO.physical.map((item, idx) => {
          const Icon = item.icon;
          return (
            <a key={idx} href={item.href} target="_blank" rel="noopener noreferrer" className="flex items-start gap-3 p-2 rounded-xl hover:bg-white/5 transition-all group">
              <div className="p-2 bg-emerald-500/20 rounded-lg group-hover:bg-emerald-500/30 transition-colors">
                <Icon className="text-emerald-400 text-sm" />
              </div>
              <div>
                <p className="text-white font-medium text-sm">{item.text}</p>
                <p className="text-white/40 text-[10px]">{item.detail}</p>
              </div>
            </a>
          );
        })}
      </div>
      
      {/* Phone Numbers - Mapped properly */}
      <div className="space-y-2">
        {CONTACT_INFO.phone.map((item, idx) => {
          const Icon = item.icon;
          return (
            <a key={idx} href={item.href} className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-all group">
              <div className="p-2 bg-blue-500/20 rounded-lg group-hover:bg-blue-500/30 transition-colors">
                <Icon className="text-blue-400 text-sm" />
              </div>
              <div>
                <p className="text-white font-medium text-sm">{item.text}</p>
                <p className="text-white/40 text-[10px]">{item.detail}</p>
              </div>
            </a>
          );
        })}
      </div>
      
      {/* Emails */}
      <div className="space-y-2">
        {CONTACT_INFO.email.map((item, idx) => {
          const Icon = item.icon;
          return (
            <a key={idx} href={item.href} className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-all group">
              <div className="p-2 bg-purple-500/20 rounded-lg group-hover:bg-purple-500/30 transition-colors">
                <Icon className="text-purple-400 text-sm" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium text-sm truncate">{item.text}</p>
                <p className="text-white/40 text-[10px]">{item.detail}</p>
              </div>
            </a>
          );
        })}
      </div>
      
      {/* Hours */}
      {CONTACT_INFO.hours.map((item, idx) => {
        const Icon = item.icon;
        return (
          <div key={idx} className="flex items-start gap-3 p-2 rounded-xl bg-amber-500/10 border border-amber-500/20">
            <div className="p-2 bg-amber-500/20 rounded-lg">
              <Icon className="text-amber-400 text-sm" />
            </div>
            <div>
              <p className="text-white font-medium text-sm">{item.text}</p>
              <p className="text-white/60 text-[10px] font-bold">{item.detail}</p>
            </div>
          </div>
        );
      })}
    </div>
  </div>
);

// Modern Link Group Component
const LinkGroup = ({ title, icon: Icon, links, gradient = 'from-emerald-500 to-teal-600' }) => (
  <div className="space-y-4">
    <div className="flex items-center gap-2 pb-3 border-b border-white/10">
      <div className={`p-1.5 bg-gradient-to-r ${gradient} rounded-lg`}>
        <Icon className="text-white text-sm" />
      </div>
      <h4 className="text-base font-bold text-white uppercase tracking-wide">{title}</h4>
    </div>
    <div className="space-y-2">
      {links.map((link, idx) => {
        const LinkIcon = link.icon;
        return (
          <a
            key={idx}
            href={link.href}
            className="group flex items-center justify-between p-2 rounded-xl hover:bg-white/5 transition-all duration-300"
          >
            <div className="flex items-center gap-3">
              <LinkIcon className="text-white/40 text-sm group-hover:text-emerald-400 transition-colors" />
              <span className="text-white/70 text-sm font-medium group-hover:text-white transition-colors">
                {link.name}
              </span>
            </div>
            {link.badge && (
              <span className="text-[9px] font-black bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full">
                {link.badge}
              </span>
            )}
          </a>
        );
      })}
    </div>
  </div>
);

// Social Links - Modern Grid
const SocialLinksGroup = () => (
  <div className="space-y-4">
    <div className="flex items-center gap-2 pb-3 border-b border-white/10">
      <div className="p-1.5 bg-gradient-to-r from-pink-500 to-rose-500 rounded-lg">
        <FiHeart className="text-white text-sm" />
      </div>
      <h4 className="text-base font-bold text-white uppercase tracking-wide">Follow Us</h4>
    </div>
    <div className="grid grid-cols-3 gap-3">
      {SOCIAL_LINKS.map((social, idx) => {
        const SocialIcon = social.icon;
        return (
          <a
            key={idx}
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`${social.bgClass} group relative overflow-hidden rounded-xl p-3 flex flex-col items-center gap-2 transition-all duration-300 hover:scale-105 hover:shadow-xl`}
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            <SocialIcon className="text-white text-xl relative z-10" />
            <span className="text-white text-[9px] font-bold uppercase tracking-wider relative z-10">
              {social.label}
            </span>
          </a>
        );
      })}
    </div>
  </div>
);

// Newsletter Section - Redesigned
const NewsletterSection = ({ email, setEmail, isSubmitting, showSuccess, errorMsg, handleSubscribe }) => (
  <div className="relative bg-gradient-to-br from-emerald-900/50 via-gray-900 to-teal-900/50 rounded-2xl p-6 border border-emerald-500/20 overflow-hidden">
    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl" />
    <div className="absolute bottom-0 left-0 w-32 h-32 bg-teal-500/10 rounded-full blur-3xl" />
    
    <div className="relative z-10 text-center mb-4">
      <div className="inline-flex p-2 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl mb-3 shadow-lg">
        <FiBell className="text-white text-lg" />
      </div>
      <h4 className="text-lg font-black text-white">Stay Updated</h4>
      <p className="text-white/60 text-xs mt-1 max-w-xs mx-auto">
        Subscribe to receive academic events, news, and announcements
      </p>
    </div>
    
    <form onSubmit={handleSubscribe} className="space-y-3 relative z-10">
      <div className="relative">
        <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 text-sm" />
        <input
          type="email"
          placeholder="Your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full pl-10 pr-3 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all text-sm"
        />
      </div>
      <button
        type="submit"
        disabled={isSubmitting || !email}
        className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 disabled:opacity-50 text-white py-3 rounded-xl font-bold text-sm hover:shadow-lg transition-all active:scale-95"
      >
        {isSubmitting ? (
          <div className="flex items-center justify-center gap-2">
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <span>Subscribing...</span>
          </div>
        ) : (
          <span>Subscribe Now</span>
        )}
      </button>
    </form>
    
    {(showSuccess || errorMsg) && (
      <div className="mt-3 relative z-10">
        {showSuccess && (
          <div className="p-2 bg-emerald-500/20 border border-emerald-500 rounded-lg">
            <p className="text-emerald-300 text-xs text-center flex items-center justify-center gap-1">
              <FiCheckCircle className="text-emerald-400 text-xs" />
              Successfully subscribed!
            </p>
          </div>
        )}
        {errorMsg && (
          <div className="p-2 bg-red-500/20 border border-red-500 rounded-lg">
            <p className="text-red-300 text-xs text-center">{errorMsg}</p>
          </div>
        )}
      </div>
    )}
  </div>
);

// Scroll to Top Button
const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.pageYOffset > 300);
    };
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-6 right-6 p-3 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full shadow-lg z-50 hover:scale-110 transition-all duration-300 group"
    >
      <FiArrowUp className="text-white text-xl group-hover:-translate-y-1 transition-transform" />
    </button>
  );
};

// Footer Bottom Bar
const FooterBottom = ({ currentYear, onShowSitemap, onShowPrivacy }) => (
  <div className="mt-8 pt-6 border-t border-white/10">
    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
          © {currentYear} Kinyui Boys Senior School
        </p>
      </div>
      
      <div className="flex flex-wrap items-center justify-center gap-4">
        <button
          onClick={onShowSitemap}
          className="text-white/50 hover:text-white text-xs font-medium transition-colors flex items-center gap-1"
        >
          <FiCompass size={10} />
          Sitemap
        </button>
        <button
          onClick={onShowPrivacy}
          className="text-white/50 hover:text-white text-xs font-medium transition-colors flex items-center gap-1"
        >
          <FiShield size={10} />
          Privacy Policy
        </button>
        <a
          href="https://www.linkedin.com/in/emmanuel-makau-40a12028b/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white/50 hover:text-emerald-400 text-xs font-medium transition-colors flex items-center gap-1"
        >
          <FiExternalLink size={10} />
          Developed by Emmanuel Makau
        </a>
      </div>
      
      <div className="flex items-center gap-2">
        <a href="https://github.com/Emmanuel10701" className="text-white/30 hover:text-white transition-all">
          <FiGithub size={14} />
        </a>
        <div className="w-px h-3 bg-white/20" />
        <span className="text-[9px] font-mono text-white/30">v3.0.0</span>
      </div>
    </div>
  </div>
);

// Modals
const PrivacyModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 text-white rounded-2xl max-w-md w-full p-6 animate-in zoom-in-95 duration-300">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <FiShield className="text-emerald-400" />
            Privacy Policy
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-full transition-colors">
            <FiX className="text-white" />
          </button>
        </div>
        <div className="space-y-3 text-sm text-gray-300 max-h-96 overflow-y-auto">
          <p>Kinyui Boys Senior School is committed to protecting your privacy and personal information.</p>
          <p>All data is collected and processed in compliance with the Kenyan Data Protection Act (DPA) of 2019.</p>
          <p>We do not share your personal information with third parties without your consent.</p>
          <div className="mt-4 p-3 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
            <p className="text-emerald-400 text-xs font-bold">Contact DPO:</p>
            <p className="text-white/60 text-xs">dpo@kinyuiboys.ac.ke</p>
          </div>
        </div>
        <button onClick={onClose} className="mt-4 w-full bg-emerald-600 hover:bg-emerald-700 py-2 rounded-lg font-bold transition-colors">
          Close
        </button>
      </div>
    </div>
  );
};

const SitemapModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 text-white rounded-2xl max-w-md w-full p-6 animate-in zoom-in-95 duration-300">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <FiCompass className="text-emerald-400" />
            Site Map
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-full transition-colors">
            <FiX className="text-white" />
          </button>
        </div>
        <div className="grid grid-cols-2 gap-4 max-h-96 overflow-y-auto">
          <div>
            <h3 className="text-emerald-400 text-xs font-bold uppercase mb-2">Main</h3>
            {MAIN_NAVIGATION.map((link, idx) => (
              <a key={idx} href={link.href} onClick={onClose} className="block text-gray-300 hover:text-emerald-400 py-1 text-sm transition-colors">
                {link.name}
              </a>
            ))}
          </div>
          <div>
            <h3 className="text-emerald-400 text-xs font-bold uppercase mb-2">Resources</h3>
            {QUICK_RESOURCES.slice(0, 5).map((link, idx) => (
              <a key={idx} href={link.href} onClick={onClose} className="block text-gray-300 hover:text-emerald-400 py-1 text-sm transition-colors">
                {link.name}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ----------------------------------------------------------------------
// MAIN FOOTER COMPONENT
// ----------------------------------------------------------------------
export default function ModernFooter() {
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showSitemap, setShowSitemap] = useState(false);
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubscribe = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');
    try {
      const response = await fetch('/api/subscriber', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await response.json();
      if (data.success) {
        setShowSuccess(true);
        setEmail('');
        setTimeout(() => setShowSuccess(false), 5000);
        toast.success('Successfully subscribed to newsletter!', { icon: '✅' });
      } else {
        setErrorMsg(data.error || 'Subscription failed');
      }
    } catch (error) {
      setErrorMsg('Failed to subscribe. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <footer className="relative bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 -left-4 w-72 h-72 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
          <div className="absolute bottom-0 -right-4 w-72 h-72 bg-teal-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-1000" />
        </div>
        
        <div className="relative z-10">
          <div className="w-full px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
            <div className="max-w-7xl mx-auto">
              {/* Main Grid - 4 Columns */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
                
                {/* Column 1: Brand & Stats */}
                <BrandSection />
                
                {/* Column 2: Main Navigation */}
                <LinkGroup 
                  title="Quick Navigation" 
                  icon={FiCompass} 
                  links={MAIN_NAVIGATION}
                  gradient="from-emerald-500 to-teal-600"
                />
                
                {/* Column 3: Resources & Social */}
                <div className="space-y-8">
                  <LinkGroup 
                    title="Resources" 
                    icon={FiBookOpen} 
                    links={QUICK_RESOURCES.slice(0, 4)}
                    gradient="from-blue-500 to-cyan-600"
                  />
                  <LinkGroup 
                    title="Support" 
                    icon={FiHelpCircle} 
                    links={SUPPORT_LINKS.slice(0, 4)}
                    gradient="from-purple-500 to-pink-600"
                  />
                </div>
                
                {/* Column 4: Contact & Newsletter */}
                <div className="space-y-6">
                  <ContactSection />
                  <SocialLinksGroup />
                </div>
              </div>
              
              {/* Newsletter Bar - Full Width */}
              <div className="mt-10">
                <NewsletterSection 
                  email={email}
                  setEmail={setEmail}
                  isSubmitting={isSubmitting}
                  showSuccess={showSuccess}
                  errorMsg={errorMsg}
                  handleSubscribe={handleSubscribe}
                />
              </div>
              
              {/* Bottom Bar */}
              <FooterBottom 
                currentYear={currentYear}
                onShowSitemap={() => setShowSitemap(true)}
                onShowPrivacy={() => setShowPrivacy(true)}
              />
            </div>
          </div>
        </div>
      </footer>
      
      {/* Modals & Scroll Button */}
      <PrivacyModal isOpen={showPrivacy} onClose={() => setShowPrivacy(false)} />
      <SitemapModal isOpen={showSitemap} onClose={() => setShowSitemap(false)} />
      <ScrollToTop />
    </>
  );
}