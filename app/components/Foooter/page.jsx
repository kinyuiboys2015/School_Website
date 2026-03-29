'use client';

import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import {
  FiMapPin, FiPhone, FiMail, FiClock, FiHome, FiBook, FiUsers, FiCalendar,
  FiImage, FiUserCheck, FiBookOpen, FiHelpCircle, FiGlobe, FiLock, FiShield,
  FiAward, FiGithub, FiTarget, FiBriefcase, FiActivity, FiUserPlus, FiBell,
  FiCheckCircle, FiDownload, FiEye, FiX, FiArrowRight, FiArrowUpRight,
} from 'react-icons/fi';
import { SiFacebook, SiYoutube, SiLinkedin, SiWhatsapp } from 'react-icons/si';
import { FaLinkedin } from 'react-icons/fa';

// ─── Data ──────────────────────────────────────────────────────────────────
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
  { name: 'Guidance & Counselling', href: '/pages/Guidance-and-Councelling', icon: FiHelpCircle },
  { name: 'Staff Directory', href: '/pages/staff', icon: FiUsers },
  { name: 'Admin Login', href: '/pages/adminLogin', icon: FiLock },
  { name: 'School Policies', href: '/pages/OurSchoolPolicies', icon: FiShield },
];

const SOCIAL_LINKS = [
  { icon: SiFacebook, href: 'https://web.facebook.com/groups/414008468611340', label: 'Facebook' },
  { icon: SiYoutube, href: 'https://www.youtube.com/@SA.-kinyui-boys-HIGH-SCHOOOL', label: 'YouTube' },
  { icon: FaLinkedin, href: 'https://www.linkedin.com/in/kinyui-boys-senior-school-8662113b7/', label: 'LinkedIn' },
  { icon: SiWhatsapp, href: 'https://wa.me/25471089415', label: 'WhatsApp' },
];

const ACHIEVEMENTS = [
  { label: '3rd Best', sub: 'Public School – Matungulu Sub-county 2019' },
  { label: 'Top Rising', sub: 'KCSE Improvement School 2024' },
  { label: 'KShs 6M', sub: 'ICT Donation – 50+ Laptops, 2023' },
  { label: '40% Cut', sub: 'Operational Cost Savings via LPG, 2022' },
  { label: '400+', sub: 'Boarding Students Enrolled' },
  { label: 'Consistent', sub: 'University Placement – Kenyan Universities' },
];

// ─── Styles (injected once) ────────────────────────────────────────────────
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=DM+Sans:wght@300;400;500&family=DM+Mono:wght@400;500&display=swap');

  .kbss-footer * { box-sizing: border-box; }
  .kbss-footer {
    --gold: #C8922A;
    --gold-light: #E8B44A;
    --gold-dim: rgba(200,146,42,0.18);
    --ink: #0E0A05;
    --ink2: #1A1108;
    --rule: rgba(200,146,42,0.25);
    --text-primary: #F5EDD8;
    --text-secondary: rgba(245,237,216,0.6);
    --text-muted: rgba(245,237,216,0.35);
    font-family: 'DM Sans', sans-serif;
    background: var(--ink);
    color: var(--text-primary);
    position: relative;
    overflow: hidden;
  }

  /* Subtle crosshatch background */
  .kbss-footer::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image:
      repeating-linear-gradient(0deg, transparent, transparent 39px, rgba(200,146,42,0.04) 40px),
      repeating-linear-gradient(90deg, transparent, transparent 39px, rgba(200,146,42,0.04) 40px);
    pointer-events: none;
    z-index: 0;
  }

  .kbss-footer > * { position: relative; z-index: 1; }

  /* Serif display */
  .kbss-serif { font-family: 'Playfair Display', serif; }
  .kbss-mono { font-family: 'DM Mono', monospace; }

  /* Top masthead rule */
  .kbss-masthead {
    border-bottom: 1px solid var(--rule);
    padding: 2.5rem 0 2rem;
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    gap: 1.5rem;
  }
  .kbss-masthead-center {
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
  }
  .kbss-masthead-rule {
    width: 100%;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--gold), transparent);
  }
  .kbss-school-name {
    font-size: clamp(1.4rem, 3vw, 2.2rem);
    font-weight: 900;
    letter-spacing: -0.01em;
    color: var(--text-primary);
    line-height: 1.15;
  }
  .kbss-school-motto {
    font-style: italic;
    font-size: 0.8rem;
    color: var(--gold-light);
    letter-spacing: 0.15em;
    text-transform: uppercase;
  }
  .kbss-est {
    font-size: 0.68rem;
    letter-spacing: 0.35em;
    text-transform: uppercase;
    color: var(--text-muted);
    font-family: 'DM Mono', monospace;
    text-align: right;
  }
  .kbss-tagline-left {
    font-size: 0.68rem;
    letter-spacing: 0.3em;
    text-transform: uppercase;
    color: var(--text-muted);
    font-family: 'DM Mono', monospace;
  }

  /* Main grid */
  .kbss-grid {
    display: grid;
    grid-template-columns: 1.4fr 1fr 1fr 1fr;
    gap: 0;
    border-bottom: 1px solid var(--rule);
  }
  @media (max-width: 900px) {
    .kbss-grid { grid-template-columns: 1fr 1fr; }
    .kbss-col:nth-child(1) { grid-column: 1 / -1; }
    .kbss-masthead { grid-template-columns: 1fr; text-align: center; }
    .kbss-est, .kbss-tagline-left { text-align: center; }
  }
  @media (max-width: 540px) {
    .kbss-grid { grid-template-columns: 1fr; }
    .kbss-nav-link {
      font-size: 0.95rem !important;
      font-weight: 700 !important;
      color: #FFFFFF !important;
      padding: 0.5rem 0 !important;
    }
  }

  .kbss-col {
    padding: 2.5rem 2rem;
    border-right: 1px solid var(--rule);
  }
  .kbss-col:last-child { border-right: none; }

  .kbss-col-label {
    font-size: 0.6rem;
    letter-spacing: 0.35em;
    text-transform: uppercase;
    color: var(--gold);
    font-family: 'DM Mono', monospace;
    margin-bottom: 1.4rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  .kbss-col-label::before {
    content: '';
    display: inline-block;
    width: 16px;
    height: 1px;
    background: var(--gold);
    flex-shrink: 0;
  }

  /* Contact items */
  .kbss-contact-item {
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
    margin-bottom: 1.2rem;
    text-decoration: none;
  }
  .kbss-contact-item:last-child { margin-bottom: 0; }
  .kbss-contact-detail {
    font-size: 0.6rem;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--text-muted);
    font-family: 'DM Mono', monospace;
  }
  .kbss-contact-value {
    font-size: 0.88rem;
    color: var(--text-primary);
    font-weight: 400;
    transition: color 0.2s;
    display: flex;
    align-items: center;
    gap: 0.4rem;
  }
  .kbss-contact-item:hover .kbss-contact-value { color: var(--gold-light); }

  /* Nav links */
  .kbss-nav-link {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.4rem 0;
    border-bottom: 1px solid rgba(200,146,42,0.08);
    text-decoration: none;
    color: #FFFFFF;
    font-size: 0.875rem;
    font-weight: 700;
    transition: all 0.2s;
    gap: 0.5rem;
  }
  .kbss-nav-link:last-child { border-bottom: none; }
  .kbss-nav-link:hover { color: var(--gold-light); padding-left: 0.35rem; }
  .kbss-nav-link:hover .kbss-nav-arrow { opacity: 1; transform: translate(2px, -2px); color: var(--gold); }
  .kbss-nav-arrow {
    opacity: 0;
    flex-shrink: 0;
    transition: all 0.2s;
    font-size: 0.75rem;
  }

  /* Achievements ticker */
  .kbss-achievement {
    display: flex;
    gap: 1rem;
    align-items: baseline;
    padding: 0.75rem 0;
    border-bottom: 1px solid rgba(200,146,42,0.08);
  }
  .kbss-achievement:last-child { border-bottom: none; }
  .kbss-achievement-num {
    font-family: 'Playfair Display', serif;
    font-size: 1.1rem;
    font-weight: 700;
    color: var(--gold-light);
    white-space: nowrap;
    min-width: 60px;
  }
  .kbss-achievement-text {
    font-size: 0.75rem;
    color: var(--text-secondary);
    font-weight: 300;
    line-height: 1.4;
  }

  /* Newsletter */
  .kbss-input {
    width: 100%;
    background: transparent;
    border: none;
    border-bottom: 1px solid var(--rule);
    padding: 0.6rem 0;
    color: var(--text-primary);
    font-family: 'DM Sans', sans-serif;
    font-size: 0.875rem;
    font-weight: 300;
    outline: none;
    transition: border-color 0.2s;
    margin-bottom: 1.25rem;
  }
  .kbss-input::placeholder { color: var(--text-muted); }
  .kbss-input:focus { border-bottom-color: var(--gold); }

  .kbss-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    background: transparent;
    border: 1px solid var(--gold);
    color: var(--gold-light);
    padding: 0.6rem 1.25rem;
    font-family: 'DM Mono', monospace;
    font-size: 0.65rem;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.2s;
    width: 100%;
    justify-content: center;
  }
  .kbss-btn:hover:not(:disabled) {
    background: var(--gold-dim);
    color: var(--text-primary);
  }
  .kbss-btn:disabled { opacity: 0.4; cursor: not-allowed; }

  /* Social strip */
  .kbss-social {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
    margin-top: 1.5rem;
    padding-top: 1.5rem;
    border-top: 1px solid var(--rule);
  }
  .kbss-social-link {
    width: 36px;
    height: 36px;
    border: 1px solid var(--rule);
    display: flex;
    align-items: center;
    justify-content: center;
    text-decoration: none;
    font-size: 1.1rem;
    transition: all 0.2s;
  }
  .kbss-social-link:hover {
    border-color: var(--gold);
    background: var(--gold-dim);
    transform: scale(1.1);
  }
  .kbss-social-link--facebook { color: #1877F2; }
  .kbss-social-link--youtube { color: #FF0000; }
  .kbss-social-link--linkedin { color: #0A66C2; }
  .kbss-social-link--whatsapp { color: #25D366; }

  /* Bottom bar */
  .kbss-bottom {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.5rem 0;
    gap: 1rem;
    flex-wrap: wrap;
  }
  .kbss-copyright {
    font-family: 'DM Mono', monospace;
    font-size: 0.65rem;
    letter-spacing: 0.1em;
    color: var(--text-muted);
  }
  .kbss-bottom-links {
    display: flex;
    gap: 1.5rem;
    flex-wrap: wrap;
  }
  .kbss-bottom-link {
    background: none;
    border: none;
    cursor: pointer;
    font-family: 'DM Mono', monospace;
    font-size: 0.65rem;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--text-muted);
    transition: color 0.2s;
    text-decoration: none;
    display: flex;
    align-items: center;
    gap: 0.35rem;
    padding: 0;
  }
  .kbss-bottom-link:hover { color: var(--gold-light); }

  .kbss-dev {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex-wrap: wrap;
  }
  .kbss-dev-dot {
    width: 5px; height: 5px; border-radius: 50%;
    background: #22c55e;
    animation: kbss-pulse 2s infinite;
  }
  @keyframes kbss-pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.3; }
  }
  .kbss-dev-text {
    font-family: 'DM Mono', monospace;
    font-size: 0.62rem;
    letter-spacing: 0.1em;
    color: var(--text-muted);
  }
  .kbss-dev-link {
    color: rgba(245,237,216,0.5);
    text-decoration: none;
    transition: color 0.2s;
  }
  .kbss-dev-link:hover { color: #22c55e; }

  /* Modal */
  .kbss-modal-backdrop {
    position: fixed; inset: 0; z-index: 50;
    background: rgba(14,10,5,0.88);
    display: flex; align-items: center; justify-content: center;
    padding: 1rem;
  }
  .kbss-modal {
    background: #14100A;
    border: 1px solid var(--rule);
    max-width: 580px; width: 100%;
    max-height: 88vh;
    overflow-y: auto;
    padding: 2.5rem;
    position: relative;
  }
  .kbss-modal-title {
    font-family: 'Playfair Display', serif;
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--text-primary);
    margin-bottom: 0.4rem;
  }
  .kbss-modal-sub {
    font-size: 0.7rem;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--gold);
    font-family: 'DM Mono', monospace;
    margin-bottom: 2rem;
  }
  .kbss-modal-close {
    position: absolute; top: 1.5rem; right: 1.5rem;
    background: none; border: 1px solid var(--rule);
    color: var(--text-secondary); cursor: pointer;
    width: 32px; height: 32px;
    display: flex; align-items: center; justify-content: center;
    transition: all 0.2s;
  }
  .kbss-modal-close:hover { border-color: var(--gold); color: var(--text-primary); }
  .kbss-modal-section {
    margin-bottom: 1.5rem;
    padding-bottom: 1.5rem;
    border-bottom: 1px solid rgba(200,146,42,0.1);
  }
  .kbss-modal-section:last-child { border-bottom: none; margin-bottom: 0; }
  .kbss-modal-section-label {
    font-size: 0.58rem;
    letter-spacing: 0.35em;
    text-transform: uppercase;
    font-family: 'DM Mono', monospace;
    color: var(--gold);
    margin-bottom: 0.75rem;
  }
  .kbss-modal-body {
    font-size: 0.875rem;
    color: var(--text-secondary);
    font-weight: 300;
    line-height: 1.75;
  }
  .kbss-modal-pills {
    display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 0.75rem;
  }
  .kbss-modal-pill {
    padding: 0.3rem 0.75rem;
    border: 1px solid var(--rule);
    font-family: 'DM Mono', monospace;
    font-size: 0.65rem;
    letter-spacing: 0.1em;
    color: var(--text-secondary);
  }
  .kbss-modal-sitemap {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 0.5rem;
  }
  .kbss-modal-site-link {
    display: flex; align-items: center; gap: 0.6rem;
    padding: 0.55rem 0.75rem;
    border: 1px solid rgba(200,146,42,0.08);
    text-decoration: none;
    color: var(--text-secondary);
    font-size: 0.8rem;
    transition: all 0.2s;
  }
  .kbss-modal-site-link:hover {
    border-color: var(--gold);
    color: var(--text-primary);
    background: var(--gold-dim);
  }
  .kbss-modal-footer-btns {
    display: flex; gap: 0.75rem; margin-top: 2rem;
  }
  .kbss-modal-btn-outline {
    flex: 1; background: none;
    border: 1px solid var(--rule);
    color: var(--text-secondary);
    padding: 0.75rem;
    font-family: 'DM Mono', monospace;
    font-size: 0.65rem;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.2s;
  }
  .kbss-modal-btn-outline:hover { border-color: var(--gold); color: var(--text-primary); }
  .kbss-modal-btn-gold {
    flex: 1; background: var(--gold);
    border: 1px solid var(--gold);
    color: var(--ink);
    padding: 0.75rem;
    font-family: 'DM Mono', monospace;
    font-size: 0.65rem;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.2s;
    text-decoration: none;
    display: flex; align-items: center; justify-content: center;
  }
  .kbss-modal-btn-gold:hover { background: var(--gold-light); }

  /* Logo placeholder */
  .kbss-logo {
    width: 52px; height: 52px;
    overflow: hidden;
    border: 1px solid var(--rule);
  }
  .kbss-logo img { width: 100%; height: 100%; object-fit: cover; }

  /* Success */
  .kbss-success {
    margin-top: 1rem;
    padding: 0.75rem 1rem;
    border: 1px solid rgba(34,197,94,0.3);
    background: rgba(34,197,94,0.06);
    font-size: 0.75rem;
    color: #86efac;
    font-family: 'DM Mono', monospace;
    letter-spacing: 0.05em;
    display: flex; align-items: center; gap: 0.5rem;
  }
`;

// ─── Modals ────────────────────────────────────────────────────────────────
const PrivacyModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="kbss-modal-backdrop" onClick={onClose}>
      <div className="kbss-modal" onClick={e => e.stopPropagation()}>
        <button className="kbss-modal-close" onClick={onClose}><FiX size={14} /></button>
        <p className="kbss-modal-sub">— Legal & Compliance</p>
        <h2 className="kbss-modal-title">Privacy & Terms</h2>
        <div className="kbss-modal-section">
          <p className="kbss-modal-section-label">Our Commitment</p>
          <p className="kbss-modal-body">
            We are committed to protecting the privacy and security of all personal information
            entrusted to us, in full compliance with the Data Protection Act of Kenya.
          </p>
        </div>
        <div className="kbss-modal-section">
          <p className="kbss-modal-section-label">Data We Collect</p>
          <div className="kbss-modal-pills">
            {['Academic Records','Parent Contacts','Medical Information','Financial Records','Disciplinary History'].map((t, i) => (
              <span key={i} className="kbss-modal-pill">{t}</span>
            ))}
          </div>
        </div>
        <div className="kbss-modal-section">
          <p className="kbss-modal-section-label">Protection Measures</p>
          <p className="kbss-modal-body">
            All data is encrypted at rest and in transit. We conduct regular security audits,
            maintain strict access controls, and provide ongoing staff training on data protection.
          </p>
        </div>
        <div className="kbss-modal-footer-btns">
          <button className="kbss-modal-btn-outline" onClick={onClose}>Dismiss</button>
          <button className="kbss-modal-btn-gold" onClick={onClose}>Accept All</button>
        </div>
      </div>
    </div>
  );
};

const SitemapModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  const allLinks = [...QUICK_LINKS, ...RESOURCES];
  return (
    <div className="kbss-modal-backdrop" onClick={onClose}>
      <div className="kbss-modal" onClick={e => e.stopPropagation()}>
        <button className="kbss-modal-close" onClick={onClose}><FiX size={14} /></button>
        <p className="kbss-modal-sub">— Site Navigation</p>
        <h2 className="kbss-modal-title">Full Sitemap</h2>
        <div className="kbss-modal-sitemap" style={{ marginBottom: '2rem' }}>
          {allLinks.map((link, idx) => {
            const Icon = link.icon;
            return (
              <a key={idx} href={link.href} className="kbss-modal-site-link" onClick={onClose}>
                <Icon size={13} style={{ flexShrink: 0, opacity: 0.6 }} />
                <span>{link.name}</span>
              </a>
            );
          })}
        </div>
        <div className="kbss-modal-footer-btns">
          <button className="kbss-modal-btn-outline" onClick={onClose}>Close</button>
          <a href="/pages/contact" className="kbss-modal-btn-gold" onClick={onClose}>Get in Touch</a>
        </div>
      </div>
    </div>
  );
};

// ─── Main Footer ───────────────────────────────────────────────────────────
export default function FooterAlt() {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showSitemap, setShowSitemap] = useState(false);
  const year = new Date().getFullYear();

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email || submitting) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/subscriber', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), subscribedAt: new Date().toISOString(), source: 'footer-alt' }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess(true); setEmail('');
        toast.success('Subscribed!'); setTimeout(() => setSuccess(false), 5000);
      } else throw new Error(data.error);
    } catch { toast.error('Failed — please retry.'); }
    finally { setSubmitting(false); }
  };

  return (
    <>
      <style>{STYLES}</style>
      <footer className="kbss-footer">
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 2rem' }}>

          {/* ── Masthead ── */}
          <div className="kbss-masthead">
            <span className="kbss-tagline-left">Est. 1976 · Matungulu, Machakos</span>
            <div className="kbss-masthead-center">
              <div className="kbss-masthead-rule" />
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem 0' }}>
                <div className="kbss-logo">
                  <img src="/kinyui.png" alt="Kinyui Boys" />
                </div>
                <div>
                  <h3 className="kbss-school-name kbss-serif">Kinyui Boys<br />Senior School</h3>
                  <p className="kbss-school-motto kbss-serif">Soaring to Excellence</p>
                </div>
              </div>
              <div className="kbss-masthead-rule" />
            </div>
            <span className="kbss-est">County Reg. School<br />Machakos, Kenya</span>
          </div>

          {/* ── 4-Column Grid ── */}
          <div className="kbss-grid">

            {/* Col 1 — Contact */}
            <div className="kbss-col">
              <p className="kbss-col-label">Reach Us</p>
              <a href="https://maps.app.goo.gl/CvZsLB55zaNhwbeG8" className="kbss-contact-item">
                <span className="kbss-contact-detail">Location</span>
                <span className="kbss-contact-value"><FiMapPin size={12} style={{ opacity: 0.5 }} />Matungulu, Machakos County</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 300 }}>Along Tala Kangudo Kanzalu Road</span>
              </a>
              <a href="tel:0710894145" className="kbss-contact-item">
                <span className="kbss-contact-detail">Main Office</span>
                <span className="kbss-contact-value"><FiPhone size={12} style={{ opacity: 0.5 }} />0710 894 145</span>
              </a>
              <a href="mailto:kinyuiboys2015@gmail.com" className="kbss-contact-item">
                <span className="kbss-contact-detail">General Enquiries</span>
                <span className="kbss-contact-value"><FiMail size={12} style={{ opacity: 0.5 }} />kinyuiboys2015@gmail.com</span>
              </a>
              <div className="kbss-contact-item" style={{ cursor: 'default' }}>
                <span className="kbss-contact-detail">Office Hours</span>
                <span className="kbss-contact-value"><FiClock size={12} style={{ opacity: 0.5 }} />Mon–Fri: 7:30 AM – 5:00 PM</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 300 }}>Sat: 8:00 AM – 1:00 PM</span>
              </div>

              {/* Social icons */}
              <div className="kbss-social">
                {SOCIAL_LINKS.map((s, i) => {
                  const Icon = s.icon;
                  return (
                    <a key={i} href={s.href} target="_blank" rel="noopener noreferrer"
                      className={`kbss-social-link kbss-social-link--${s.label.toLowerCase()}`} aria-label={s.label}>
                      <Icon />
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Col 2 — Quick Links */}
            <div className="kbss-col">
              <p className="kbss-col-label">Navigate</p>
              {QUICK_LINKS.map((link, i) => (
                <a key={i} href={link.href} className="kbss-nav-link">
                  <span>{link.name}</span>
                  <FiArrowUpRight size={11} className="kbss-nav-arrow" />
                </a>
              ))}
            </div>

            {/* Col 3 — Achievements */}
            <div className="kbss-col">
              <p className="kbss-col-label">Milestones</p>
              {ACHIEVEMENTS.map((a, i) => (
                <div key={i} className="kbss-achievement">
                  <span className="kbss-achievement-num">{a.label}</span>
                  <span className="kbss-achievement-text">{a.sub}</span>
                </div>
              ))}
              <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--rule)' }}>
                <p className="kbss-col-label" style={{ marginBottom: '0.5rem' }}>Resources</p>
                {RESOURCES.slice(0, 4).map((link, i) => (
                  <a key={i} href={link.href} className="kbss-nav-link">
                    <span>{link.name}</span>
                    <FiArrowUpRight size={11} className="kbss-nav-arrow" />
                  </a>
                ))}
              </div>
            </div>

            {/* Col 4 — Newsletter */}
            <div className="kbss-col">
              <p className="kbss-col-label">Stay Informed</p>
              <p className="kbss-serif" style={{ fontSize: '1.35rem', fontWeight: 700, lineHeight: 1.3, marginBottom: '0.75rem', color: 'var(--text-primary)' }}>
                School<br />Newsletter
              </p>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 300, lineHeight: 1.7, marginBottom: '1.75rem' }}>
                Receive academic calendars, exam notices, events, and school announcements directly in your inbox.
              </p>
              <form onSubmit={handleSubscribe}>
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="kbss-input"
                  required
                />
                <button type="submit" className="kbss-btn" disabled={submitting || !email}>
                  {submitting ? 'Subscribing…' : <><span>Subscribe</span><FiArrowRight size={12} /></>}
                </button>
              </form>
              {success && (
                <div className="kbss-success">
                  <FiCheckCircle size={13} /> Subscribed successfully — updates incoming.
                </div>
              )}

              {/* School description */}
              <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--rule)' }}>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 300, lineHeight: 1.8, fontStyle: 'italic' }}>
                  "A county learning institution in Matungulu Machakos, dedicated to academic excellence,
                  holistic development, and nurturing future leaders since 1976."
                </p>
              </div>
            </div>
          </div>

          {/* ── Bottom Bar ── */}
          <div className="kbss-bottom">
            <span className="kbss-copyright">
              © {year} Kinyui Boys Senior School. All rights reserved.
            </span>
            <div className="kbss-bottom-links">
              <button className="kbss-bottom-link" onClick={() => setShowSitemap(true)}>
                <FiGlobe size={11} /> Sitemap
              </button>
              <button className="kbss-bottom-link" onClick={() => setShowPrivacy(true)}>
                <FiShield size={11} /> Privacy & Terms
              </button>
              <a href="/pages/contact" className="kbss-bottom-link">
                <FiMail size={11} /> Contact
              </a>
            </div>
            <div className="kbss-dev">
              <div className="kbss-dev-dot" />
              <span className="kbss-dev-text">
                Built by{' '}
                <a href="https://www.linkedin.com/in/emmanuel-makau-40a12028b/" target="_blank" rel="noopener noreferrer" className="kbss-dev-link">
                  Emmanuel Makau
                </a>
              </span>
              <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
                <a href="https://github.com/Emmanuel10701" className="kbss-dev-link" title="GitHub"><FiGithub size={13} /></a>
                <a href="mailto:emmanuelmakau90@gmail.com" className="kbss-dev-link" title="Email"><FiMail size={13} /></a>
                <a href="tel:+254793472960" className="kbss-dev-link" title="Call"><FiPhone size={13} /></a>
                <span className="kbss-mono" style={{ fontSize: '0.58rem', color: 'var(--text-muted)', letterSpacing: '0.15em' }}>v2.0.26</span>
              </div>
            </div>
          </div>

          {/* ── Tagline ── */}
          <div style={{ textAlign: 'center', padding: '1rem 0 2rem', borderTop: '1px solid rgba(200,146,42,0.1)' }}>
            <p className="kbss-serif" style={{ fontSize: '0.9rem', fontStyle: 'italic', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
              Empowering future leaders with dedication since 1976
            </p>
          </div>
        </div>
      </footer>

      <PrivacyModal isOpen={showPrivacy} onClose={() => setShowPrivacy(false)} />
      <SitemapModal isOpen={showSitemap} onClose={() => setShowSitemap(false)} />
    </>
  );
}