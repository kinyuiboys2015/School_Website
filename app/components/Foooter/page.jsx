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
} from 'react-icons/fi';
import {
  SiFacebook,
  SiYoutube,
  SiLinkedin,
  SiWhatsapp,
} from 'react-icons/si';
import { FaLinkedin } from 'react-icons/fa';

// ----------------------------------------------------------------------
// Data Layer
// ----------------------------------------------------------------------

const QUICK_LINKS = [
  { name: 'Home', href: '/', icon: FiHome },
  { name: 'About Us', href: '/pages/AboutUs', icon: FiUsers },
  { name: 'Fees', href: '/pages/fees', icon: FiBook },
  { name: 'Admissions', href: '/pages/admissions', icon: FiUserCheck },
  { name: 'Gallery', href: '/pages/gallery', icon: FiImage },
  { name: 'News & Events', href: '/pages/eventsandnews', icon: FiCalendar },
  { name: 'Contact', href: '/pages/contact', icon: FiPhone },
  { name: 'Careers', href: '/pages/careers', icon: FiBriefcase },
];

const RESOURCES = [
  { name: 'Student Portal', href: '/pages/StudentPortal', icon: FiBookOpen },
  { name: 'Apply Now', href: '/pages/apply-for-admissions', icon: FiUserPlus },
  {
    name: 'Guidance & Counselling',
    href: '/pages/Guidance-and-Councelling',
    icon: FiHelpCircle,
  },
  { name: 'Staff Directory', href: '/pages/staff', icon: FiUsers },
  { name: 'Admin Login', href: '/pages/adminLogin', icon: FiLock },
  { name: 'School Policies', href: '/pages/OurSchoolPolicies', icon: FiShield },
];

// Only 4 social media buttons - Facebook, YouTube, LinkedIn, WhatsApp
const SOCIAL_LINKS = [
  {
    icon: SiFacebook,
    href: 'https://web.facebook.com/groups/414008468611340',
    label: 'Facebook',
    color: '#1877F2',
  },
  {
    icon: SiYoutube,
    href: 'https://www.youtube.com/@SA.-kinyui boys-HIGH-SCHOOOL',
    label: 'YouTube',
    color: '#FF0000',
  },
  {
    icon: FaLinkedin,
    href: 'https://www.linkedin.com/in/kinyui boys-senior-school-8662113b7/',
    label: 'LinkedIn',
    color: '#0A66C2',
  },
  {
    icon: SiWhatsapp,
    href: 'https://wa.me/25471089415',
    label: 'WhatsApp',
    color: '#25D366',
  },
];

const CONTACT_INFO = [
  {
    icon: FiMapPin,
    text: 'Matungulu Machakos County, Kenya',
    href: 'https://maps.app.goo.gl/CvZsLB55zaNhwbeG8',
    detail: 'Along Tala Kangudo kanzalu road',
  },
  {
    icon: FiPhone,
    text: '0710 894 145',
    href: 'tel:0710894145',
    detail: 'Main Office Line',
  },
  {
    icon: FiPhone,
    text: '0710 894 145',
    href: 'tel:0710894145',
    detail: 'Admissions Office',
  },
  {
    icon: FiMail,
    text: 'kinyuiboys2015@gmail.com',
    href: 'mailto:kinyuiboys2015@gmail.com',
    detail: 'General Inquiries',
  },
  {
    icon: FiMail,
    text: 'admissions@kinyuiboys.ac.ke',
    href: 'mailto:kinyuiboys2015@gmail.com',
    detail: 'Admissions',
  },
  {
    icon: FiClock,
    text: 'Mon - Fri: 7:30 AM - 5:00 PM',
    href: '#',
    detail: 'Sat: 8:00 AM - 1:00 PM',
  },
];

// ----------------------------------------------------------------------
// Components
// ----------------------------------------------------------------------

// Stats Counter Component (simplified, no hover effects)
const StatCounter = ({ value, label, icon: Icon }) => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      if (count < value) {
        setCount(prev => Math.min(prev + Math.ceil(value / 50), value));
      }
    }, 30);
    return () => clearTimeout(timer);
  }, [count, value]);

  return (
    <div className="text-center">
      <div className="flex justify-center mb-2">
        <div className="p-2 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full">
          <Icon className="text-white text-xl" />
        </div>
      </div>
      <div className="text-2xl font-bold text-white">{count}+</div>
      <div className="text-xs text-gray-300 uppercase tracking-wide">{label}</div>
    </div>
  );
};

// Brand Section
const BrandSection = () => (
  <div className="space-y-6">
    <div className="flex flex-col items-center md:items-start gap-4 text-center md:text-left">
      <div className="relative">
        <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-amber-500 bg-white/10">
          <img
            src="/kinyui.png"
            alt="Kinyui Boys Senior School Logo"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
      <div>
        <h3 className="text-xl font-bold text-amber-400">
          Kinyui Boys
        </h3>
        <p className="text-white/80 text-sm">Senior School</p>
      </div>
    </div>
    
    <div className="grid grid-cols-3 gap-3">
      <StatCounter value={45} label="Teachers" icon={FiUsers} />
      <StatCounter value={400} label="Students" icon={FiBookOpen} />
      <StatCounter value={98} label="Pass Rate" icon={FiTrendingUp} />
    </div>
    
    <p className="text-gray-200 text-sm leading-relaxed">
      A County learning institution in Matungulu Machakos, dedicated to academic
      excellence, holistic development, and nurturing future leaders since 1976.
    </p>
  </div>
);

// Contact Info - boldened items
const ContactList = () => (
  <div className="space-y-3">
    {CONTACT_INFO.slice(0, 4).map((item, index) => {
      const Icon = item.icon;
      return (
        <a
          key={index}
          href={item.href}
          className="flex items-center gap-3 p-2 rounded-lg"
        >
          <div className="p-2 bg-amber-500/20 rounded-lg">
            <Icon className="text-amber-400 text-sm" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-bold text-sm truncate">{item.text}</p>
            {item.detail && (
              <p className="text-gray-400 text-xs">{item.detail}</p>
            )}
          </div>
        </a>
      );
    })}
  </div>
);

// Link Group - boldened items, no hover effects
const LinkGroup = ({ title, icon: Icon, links }) => (
  <div className="space-y-4">
    <div className="flex items-center gap-2 pb-2 border-b border-white/10">
      <Icon className="text-amber-400 text-lg" />
      <h4 className="text-lg font-semibold text-white">{title}</h4>
    </div>
    <div className="space-y-2">
      {links.map((link, idx) => {
        const LinkIcon = link.icon;
        return (
          <a
            key={idx}
            href={link.href}
            className="flex items-center gap-2 text-gray-300 font-medium text-sm"
          >
            <LinkIcon className="text-xs" />
            <span>{link.name}</span>
          </a>
        );
      })}
    </div>
  </div>
);

// Social Links - large (twice the size), no hover effects, only 4 buttons
const SocialLinksGroup = () => (
  <div className="space-y-4">
    <div className="flex items-center gap-2 pb-2 border-b border-white/10">
      <FiHeart className="text-amber-400 text-lg" />
      <h4 className="text-lg font-semibold text-white">Connect With Us</h4>
    </div>
    <div className="flex gap-4">
      {SOCIAL_LINKS.map((social, idx) => {
        const SocialIcon = social.icon;
        return (
          <a
            key={idx}
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            className="w-14 h-14 rounded-full flex items-center justify-center"
            style={{ backgroundColor: social.color }}
          >
            <SocialIcon className="text-white text-3xl" />
          </a>
        );
      })}
    </div>
  </div>
);

// Newsletter Form - no glow effects
const NewsletterForm = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/subscriber', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          subscribedAt: new Date().toISOString(),
          source: 'footer-newsletter',
        }),
      });
      const data = await response.json();
      if (data.success) {
        setShowSuccess(true);
        setEmail('');
        setTimeout(() => setShowSuccess(false), 5000);
        toast.success('Successfully subscribed to newsletter!', { icon: '✅' });
      } else {
        throw new Error(data.error || 'Subscription failed');
      }
    } catch (error) {
      console.error('Subscription error:', error);
      toast.error('Failed to subscribe. Please try again.', { icon: '❌' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-5 bg-white/5 rounded-xl">
      <div className="text-center mb-4">
        <div className="inline-flex p-2 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full mb-3">
          <FiBell className="text-white text-lg" />
        </div>
        <h4 className="text-lg font-semibold text-white">Newsletter</h4>
        <p className="text-gray-300 text-xs mt-1">Get academic events & announcements</p>
      </div>
      
      <form onSubmit={handleSubscribe} className="space-y-3">
        <div className="relative">
          <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
          <input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full pl-9 pr-3 py-2 bg-black/30 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-amber-500 transition-colors text-sm"
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting || !email}
          className="w-full bg-gradient-to-r from-amber-500 to-orange-600 disabled:opacity-50 text-white py-2 rounded-lg font-medium text-sm"
        >
          {isSubmitting ? 'Subscribing...' : 'Subscribe'}
        </button>
      </form>
      
      {showSuccess && (
        <div className="mt-3 p-2 bg-emerald-500/20 border border-emerald-500 rounded-lg">
          <p className="text-emerald-300 text-xs text-center">Successfully subscribed!</p>
        </div>
      )}
    </div>
  );
};

// Scroll to Top Button - positioned left from where it is (moved from right-6 to left-6)
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
      className="fixed bottom-6 left-6 p-3 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full shadow-lg z-50"
    >
      <FiArrowUp className="text-white text-xl" />
    </button>
  );
};

// Modals
const PrivacyModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-gradient-to-b from-gray-900 to-gray-800 text-white rounded-2xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Privacy Policy</h2>
          <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-full">
            <FiX className="text-white" />
          </button>
        </div>
        <div className="space-y-3 text-sm text-gray-300">
          <p>We are committed to protecting your privacy and personal information.</p>
          <p>All data is collected and processed in compliance with the Data Protection Act.</p>
        </div>
        <button onClick={onClose} className="mt-4 w-full bg-amber-600 hover:bg-amber-700 py-2 rounded-lg">
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
      <div className="relative bg-gradient-to-b from-gray-900 to-gray-800 text-white rounded-2xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Sitemap</h2>
          <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-full">
            <FiX className="text-white" />
          </button>
        </div>
        <div className="space-y-3">
          {[...QUICK_LINKS.slice(0, 6), ...RESOURCES.slice(0, 4)].map((link, idx) => (
            <a key={idx} href={link.href} onClick={onClose} className="block text-gray-300 hover:text-amber-400 py-1">
              {link.name}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

// Developer Credits - boldened
const DevCredits = () => (
  <div className="mt-8 pt-6 border-t border-white/10 text-center">
    <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
      <div className="flex items-center gap-2">
        <div className="w-1 h-1 rounded-full bg-emerald-500"></div>
        <span className="text-gray-400 font-medium">System Architecture</span>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-gray-400 font-medium">Developed by</span>
        <a
          href="https://www.linkedin.com/in/emmanuel-makau-40a12028b/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-amber-400 font-bold"
        >
          Emmanuel Makau
        </a>
        <div className="w-px h-3 bg-white/20"></div>
        <a href="https://github.com/Emmanuel10701" className="text-gray-300">
          <FiGithub />
        </a>
        <span className="text-gray-500 font-medium">v3.0</span>
      </div>
    </div>
  </div>
);

// ----------------------------------------------------------------------
// Main Footer Component
// ----------------------------------------------------------------------
export default function ModernFooter() {
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showSitemap, setShowSitemap] = useState(false);
  const currentYear = new Date().getFullYear();

  return (
    <>
      <footer className="relative bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white">
        {/* Main Content */}
        <div className="relative z-10">

          {/* Footer with Main Items */}
          <div className="w-full px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
            <div className="max-w-7xl mx-auto">
              {/* Grid Layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
                {/* Column 1 */}
                <BrandSection />
                
                {/* Column 2 */}
                <div className="space-y-8">
                  <LinkGroup title="Quick Links" icon={FiGlobe} links={QUICK_LINKS.slice(0, 4)} />
                </div>
                
                {/* Column 3 */}
                <div className="space-y-8">
                  <LinkGroup title="Resources" icon={FiActivity} links={RESOURCES} />
                  <SocialLinksGroup />
                </div>
                
                {/* Column 4 */}
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 pb-2 border-b border-white/10">
                      <FiMapPin className="text-amber-400 text-lg" />
                      <h4 className="text-lg font-semibold text-white">Contact Info</h4>
                    </div>
                    <ContactList />
                  </div>
                </div>
              </div>
   {/* Subscriber Bar - Rounded, Elevated, Spaced */}
<div className="relative -mt-10 px-4 sm:px-6 lg:px-8 z-10">
  <div className="max-w-6xl mx-auto bg-gradient-to-br from-gray-700 via-gray-700 to-gray-900 text-white rounded-2xl shadow-xl p-6 md:p-8">
    
    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
      
      {/* Text Section */}
      <div className="text-center md:text-left space-y-2">
        <h3 className="text-xl md:text-2xl font-bold leading-tight">
          Subscribe to Our School Newsletter
        </h3>
        <p className="text-white/80 text-sm md:text-base max-w-md">
          Get the latest updates and news from Kinyui Boys Senior School
        </p>
      </div>

      {/* Input Section */}
      <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
        <input
          type="email"
          placeholder="Enter your email address"
          className="flex-1 sm:w-72 px-4 py-3 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-400"
        />
        <button className="bg-white text-amber-600 font-bold px-6 py-3 rounded-xl hover:bg-gray-100 transition-all duration-300 shadow-md hover:shadow-lg">
          Subscribe
        </button>
      </div>

    </div>
  </div>
</div>
              {/* Footer Bottom */}
              <div className="mt-12 pt-8 border-t border-white/10">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
                  <p className="text-gray-400 font-medium text-center md:text-left">
                    © {currentYear} Kinyui Boys Senior School. All rights reserved.
                  </p>
                  <div className="flex gap-6">
                    <button
                      onClick={() => setShowSitemap(true)}
                      className="text-gray-400 font-medium flex items-center gap-1"
                    >
                      <FiGlobe className="text-sm" />
                      <span>Sitemap</span>
                    </button>
                    <button
                      onClick={() => setShowPrivacy(true)}
                      className="text-gray-400 font-medium flex items-center gap-1"
                    >
                      <FiShield className="text-sm" />
                      <span>Privacy</span>
                    </button>
                  </div>
                </div>
                <DevCredits />
              </div>
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