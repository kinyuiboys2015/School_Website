"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  MapPin, Users, BookOpen, Mail, Trophy, Target, Globe, Clock,
  TrendingUp, Lightbulb, ExternalLink, ShieldCheck, ArrowRight,
  Phone, Heart, Zap, GraduationCap, Award, CheckCircle,
  Calendar, Star, Quote, Sparkles, Compass, Leaf, Brain,
  ChevronRight, BarChart3, School, UserCheck, Flame, ArrowUp
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// ============================================================
// Animated Counter Component
// ============================================================
const AnimatedCounter = ({ value, label, icon: Icon, suffix = "" }) => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      const numValue = parseInt(value) || 0;
      if (count < numValue) {
        setCount(prev => Math.min(prev + Math.ceil(numValue / 40), numValue));
      }
    }, 25);
    return () => clearTimeout(timer);
  }, [count, value]);

  return (
    <div className="bg-white rounded-2xl p-5 text-center shadow-lg shadow-slate-200/50 border border-slate-100 hover:shadow-xl transition-all hover:border-amber-200 group">
      <div className="flex justify-center mb-3">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
          <Icon className="text-white" size={22} />
        </div>
      </div>
      <div className="text-2xl sm:text-3xl font-black text-slate-900">{count}{suffix}</div>
      <div className="text-xs text-amber-600 font-bold uppercase tracking-wider mt-1">{label}</div>
    </div>
  );
};

// ============================================================
// Scroll to Top Button
// ============================================================
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
      className="fixed bottom-6 left-6 p-3 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full shadow-lg z-50 hover:shadow-xl transition-all active:scale-95"
    >
      <ArrowUp className="text-white text-xl" />
    </button>
  );
};

// ============================================================
// Main About Page Component - Fresh Alternative Design
// ============================================================
export default function AboutPage() {
  const topRef = useRef(null);

  return (
    <div ref={topRef} className="bg-slate-50 text-slate-900 min-h-screen">

      {/* ═══════════════════════ HERO SECTION - WELCOME BANNER ═══════════════════════ */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden">
        <Image
          src="/hero/katz8.jpeg"
          alt="Kinyui Boys Senior School Campus"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-slate-950/20" />
        
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-4xl">
            {/* Welcome Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/20 backdrop-blur-sm border border-amber-400/30 mb-6">
              <Sparkles className="text-amber-400" size={14} />
              <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">Welcome to Excellence</span>
            </div>

            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white leading-[1.05] tracking-tight mb-6">
              Where Boys 
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">
                Become Leaders
              </span>
            </h1>
            
            <p className="text-base sm:text-lg md:text-xl text-slate-300 max-w-2xl leading-relaxed mb-8">
              For over 45 years, Kinyui Boys Senior School has been the cornerstone of academic excellence, 
              character development, and leadership training in Machakos County.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link href="/pages/apply-for-admissions">
                <button className="px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-black rounded-xl shadow-lg shadow-orange-900/30 flex items-center gap-2 hover:shadow-xl transition-all active:scale-95">
                  Enroll Now <ArrowRight size={18} />
                </button>
              </Link>
              <Link href="#story">
                <button className="px-8 py-4 bg-white/10 backdrop-blur-md text-white font-black rounded-xl border border-white/20 flex items-center gap-2 hover:bg-white/20 transition-all">
                  Our Story <ChevronRight size={18} />
                </button>
              </Link>
            </div>
          </div>

          {/* Stats Row */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4">
            <AnimatedCounter value="45" label="Years of Excellence" icon={Award} />
            <AnimatedCounter value="2500" label="Alumni Network" icon={Users} suffix="+" />
            <AnimatedCounter value="98" label="KCSE Pass Rate" icon={TrendingUp} suffix="%" />
            <AnimatedCounter value="35" label="Qualified Staff" icon={School} suffix="+" />
          </div>
        </div>
      </section>

      {/* ═══════════════════════ OUR STORY SECTION ═══════════════════════ */}
      <section id="story" className="py-20 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left: Content */}
          <div>
            <div className="mb-6">
              <span className="inline-block px-3 py-1 text-[10px] font-black tracking-[0.2em] text-amber-600 uppercase bg-amber-50 rounded-full border border-amber-200 mb-4">
                Our Legacy
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 leading-[1.1] mb-4">
                A Legacy of 
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600"> Excellence Since 1976</span>
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed">
                Founded with a vision to provide quality education to the boys of Matungulu region, 
                Kinyui Boys has grown into a beacon of academic and moral excellence.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex gap-4 p-4 bg-white rounded-xl border border-slate-100 shadow-sm">
                <div className="shrink-0 w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                  <Compass className="text-amber-600" size={20} />
                </div>
                <div>
                  <h3 className="font-black text-slate-900">Our Beginning</h3>
                  <p className="text-slate-600 text-sm">Started as a small community school with 50 students and 5 teachers.</p>
                </div>
              </div>
              <div className="flex gap-4 p-4 bg-white rounded-xl border border-slate-100 shadow-sm">
                <div className="shrink-0 w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                  <TrendingUp className="text-amber-600" size={20} />
                </div>
                <div>
                  <h3 className="font-black text-slate-900">Our Growth</h3>
                  <p className="text-slate-600 text-sm">Today, we serve 400+ students with state-of-the-art facilities.</p>
                </div>
              </div>
              <div className="flex gap-4 p-4 bg-white rounded-xl border border-slate-100 shadow-sm">
                <div className="shrink-0 w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                  <Globe className="text-amber-600" size={20} />
                </div>
                <div>
                  <h3 className="font-black text-slate-900">Our Impact</h3>
                  <p className="text-slate-600 text-sm">Graduates excelling in universities and careers across Kenya and beyond.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Image with quote overlay */}
          <div className="relative group">
            <div className="absolute -inset-4 bg-gradient-to-r from-amber-100 to-orange-100 rounded-2xl blur-2xl opacity-60 -z-10"></div>
            <div className="relative overflow-hidden rounded-2xl shadow-2xl">
              <Image
                src="/bg/1.jpeg"
                alt="School History"
                width={600}
                height={500}
                className="object-cover w-full h-auto group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <div className="bg-white/95 backdrop-blur-sm p-5 rounded-xl border-l-4 border-amber-500 shadow-lg">
                  <Quote className="text-amber-500 mb-2" size={24} />
                  <p className="text-slate-800 text-sm italic font-medium">"Education is the most powerful weapon which you can use to change the world."</p>
                  <p className="text-amber-600 text-xs font-bold mt-2">— Nelson Mandela</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════ MISSION & VISION TWIN CARDS ═══════════════════════ */}
      <section className="py-16 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8">
          
          {/* Mission Card */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-8 border border-amber-100 shadow-lg hover:shadow-xl transition-all">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center mb-5 shadow-md">
              <Target className="text-white" size={28} />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-3">Our Mission</h3>
            <p className="text-slate-700 leading-relaxed mb-4">
              To provide holistic, quality education that nurtures disciplined, innovative, 
              and responsible young men who excel academically and contribute positively to society.
            </p>
            <div className="flex items-center gap-2 text-amber-600 text-sm font-bold">
              <CheckCircle size={16} />
              <span>Developing future leaders</span>
            </div>
          </div>

          {/* Vision Card */}
          <div className="bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl p-8 border border-slate-200 shadow-lg hover:shadow-xl transition-all">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center mb-5 shadow-md">
              <Eye className="text-white" size={28} />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-3">Our Vision</h3>
            <p className="text-slate-700 leading-relaxed mb-4">
              To be the premier boys' school in Machakos County, recognized for academic excellence, 
              character formation, and producing transformative leaders.
            </p>
            <div className="flex items-center gap-2 text-amber-600 text-sm font-bold">
              <Sparkles size={16} />
              <span>Excellence in all we do</span>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════ CORE VALUES - BADGE STYLE ═══════════════════════ */}
      <section className="py-16 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <span className="inline-block px-3 py-1 text-[10px] font-black tracking-[0.2em] text-amber-600 uppercase bg-amber-50 rounded-full border border-amber-200 mb-4">
            What We Stand For
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900">Our Core Values</h2>
          <p className="text-slate-600 max-w-2xl mx-auto mt-3">The principles that guide everything we do</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { name: "Integrity", icon: ShieldCheck, color: "amber" },
            { name: "Discipline", icon: Clock, color: "orange" },
            { name: "Respect", icon: Heart, color: "amber" },
            { name: "Excellence", icon: Award, color: "orange" },
            { name: "Innovation", icon: Lightbulb, color: "amber" },
            { name: "Service", icon: Users, color: "orange" }
          ].map((value, i) => {
            const Icon = value.icon;
            return (
              <div key={i} className="group text-center p-4 bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-md hover:border-amber-200 transition-all">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                  <Icon className="text-white" size={20} />
                </div>
                <span className="text-sm font-black text-slate-800">{value.name}</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* ═══════════════════════ WHY CHOOSE US - FEATURE GRID ═══════════════════════ */}
      <section className="py-16 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-8 md:p-12">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900">Why Choose Kinyui Boys?</h2>
            <p className="text-slate-600 mt-2">What makes us different from the rest</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: BookOpen, title: "Academic Excellence", desc: "Consistent top performance in KCSE with 98% pass rate" },
              { icon: Users, title: "Qualified Teachers", desc: "Dedicated, experienced educators committed to student success" },
              { icon: Building2, title: "Modern Facilities", desc: "Science labs, computer lab, library, and sports grounds" },
              { icon: Heart, title: "Moral Formation", desc: "Character development alongside academic growth" },
              { icon: Trophy, title: "Co-curricular Success", desc: "Champions in sports, drama, and science congress" },
              { icon: Globe, title: "Career Guidance", desc: "Comprehensive counseling and university placement support" }
            ].map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div key={i} className="bg-white rounded-xl p-6 border border-amber-100 shadow-sm hover:shadow-md transition-all">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center mb-4">
                    <Icon className="text-white" size={18} />
                  </div>
                  <h3 className="font-black text-slate-900 mb-2">{feature.title}</h3>
                  <p className="text-slate-600 text-sm">{feature.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════ PRINCIPAL'S MESSAGE ═══════════════════════ */}
      <section className="py-16 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          
          <div className="relative order-2 lg:order-1">
            <div className="absolute -inset-3 bg-gradient-to-r from-amber-100 to-orange-100 rounded-full blur-xl opacity-60"></div>
            <div className="relative overflow-hidden rounded-2xl shadow-xl">
              <Image
                src="/bg/14.jpeg"
                alt="Principal"
                width={500}
                height={500}
                className="object-cover w-full"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-950 to-transparent p-6">
                <p className="text-white font-bold">Mr. John Mwangi</p>
                <p className="text-amber-400 text-sm">Principal, Kinyui Boys Senior School</p>
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <div className="mb-4">
              <span className="inline-block px-3 py-1 text-[10px] font-black tracking-[0.2em] text-amber-600 uppercase bg-amber-50 rounded-full border border-amber-200">
                From the Principal's Desk
              </span>
            </div>
            <h2 className="text-3xl font-black text-slate-900 mb-4">A Word from Our Principal</h2>
            <div className="space-y-4 text-slate-600 leading-relaxed">
              <p>
                At Kinyui Boys, we believe every student has the potential for greatness. Our role is to unlock that potential 
                through quality education, mentorship, and a supportive environment.
              </p>
              <p>
                We are proud of our legacy and excited about our future. We invite you to join our community of learners 
                and leaders who are making a difference in Kenya and beyond.
              </p>
              <div className="pt-4">
                <div className="flex items-center gap-2">
                  <Signature className="text-amber-500" />
                  <p className="font-bold text-slate-800">— Mr. John Mwangi</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════ CAMPUS & CONTACT INFO ═══════════════════════ */}
      <section className="py-16 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8">
          
          {/* Campus Info */}
          <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                <School className="text-white" size={20} />
              </div>
              <h3 className="text-2xl font-black text-slate-900">Our Campus</h3>
            </div>
            <div className="space-y-4">
              <div className="flex gap-3">
                <MapPin className="text-amber-500 shrink-0 mt-1" size={18} />
                <p className="text-slate-600">Matungulu, Machakos County, Kenya</p>
              </div>
              <div className="flex gap-3">
                <Phone className="text-amber-500 shrink-0 mt-1" size={18} />
                <div>
                  <p className="text-slate-600">+254 710 894 145</p>
                  <p className="text-slate-500 text-sm">+254 710 894 145</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Mail className="text-amber-500 shrink-0 mt-1" size={18} />
                <p className="text-slate-600">kinyuiboys2015@gmail.com</p>
              </div>
              <div className="flex gap-3">
                <Clock className="text-amber-500 shrink-0 mt-1" size={18} />
                <div>
                  <p className="text-slate-600">Mon - Fri: 7:45 AM - 4:30 PM</p>
                  <p className="text-slate-500 text-sm">Saturday: 8:00 AM - 1:00 PM</p>
                </div>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-slate-100">
              <a 
                href="https://maps.google.com" 
                target="_blank"
                className="inline-flex items-center gap-2 text-amber-600 font-bold hover:gap-3 transition-all"
              >
                Get Directions <ExternalLink size={16} />
              </a>
            </div>
          </div>

          {/* Quick Facts */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-8 border border-amber-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                <BarChart3 className="text-white" size={20} />
              </div>
              <h3 className="text-2xl font-black text-slate-900">Quick Facts</h3>
            </div>
            <div className="space-y-4">
              {[
                { label: "Founded", value: "1976" },
                { label: "Category", value: "Public Boys' Boarding School" },
                { label: "Curriculum", value: "8-4-4 & Competency-Based Curriculum (CBC)" },
                { label: "Student Population", value: "400+" },
                { label: "Teaching Staff", value: "35+" },
                { label: "Student-to-Teacher Ratio", value: "12:1" }
              ].map((fact, i) => (
                <div key={i} className="flex justify-between items-center py-2 border-b border-amber-200/50 last:border-0">
                  <span className="text-slate-600 font-medium">{fact.label}</span>
                  <span className="text-slate-900 font-black">{fact.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════ CALL TO ACTION ═══════════════════════ */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto text-center">
          <div className="bg-gradient-to-br from-amber-600 to-orange-600 rounded-3xl p-12 shadow-2xl">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4">
              Ready to Join the Legacy?
            </h2>
            <p className="text-amber-100 text-lg mb-8 max-w-2xl mx-auto">
              Take the first step toward an exceptional educational journey at Kinyui Boys Senior School.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/pages/apply-for-admissions">
                <button className="px-8 py-4 bg-white text-amber-600 font-black rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2">
                  Apply for Admission <ArrowRight size={18} />
                </button>
              </Link>
              <Link href="/pages/contact">
                <button className="px-8 py-4 bg-amber-700/50 text-white font-black rounded-xl border border-white/30 hover:bg-amber-700/70 transition-all">
                  Contact Admissions
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Scroll to Top Button */}
      <ScrollToTop />
    </div>
  );
}

// ============================================================
// Additional Icons not imported
// ============================================================
const Eye = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

const Signature = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M3 12h4l2-5 2 5 2-5 2 5 2-5 2 5h4"/>
    <path d="M5 18h14"/>
  </svg>
);