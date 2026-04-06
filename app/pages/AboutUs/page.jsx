"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  MapPin, Users, BookOpen, Mail, Trophy, Target, Globe, Clock,
  TrendingUp, Lightbulb, ExternalLink, ShieldCheck, ArrowRight,
  Phone, Sparkles, Heart, Zap, GraduationCap, Building2, Award,
  ChevronRight, Star, Check, ArrowUp
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// ============================================================
// Animated Stat Counter Component
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
    <div className="bg-white rounded-2xl p-4 sm:p-5 flex items-center gap-3 shadow-lg shadow-slate-200/50 border border-slate-100 hover:shadow-xl transition-all hover:border-amber-200">
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center flex-shrink-0 shadow-md">
        <Icon className="text-white" size={18} />
      </div>
      <div>
        <div className="text-xl sm:text-2xl font-black text-slate-900 leading-none">{count}{suffix}</div>
        <div className="text-[10px] sm:text-xs text-amber-600 font-bold uppercase tracking-wider mt-0.5">{label}</div>
      </div>
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
// Main About Page Component
// ============================================================
export default function AboutPage() {
  const topRef = useRef(null);

  return (
    <div ref={topRef} className="bg-slate-50 text-slate-900 min-h-screen">

      {/* ═══════════════════════ HERO SECTION ═══════════════════════ */}
      <section className="relative min-h-[90vh] flex items-end overflow-hidden">
        <Image
          src="/hero/katz8.jpeg"
          alt="Kinyui Boys Senior School campus"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/30" />
        
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16 md:pb-24">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
              </span>
              <span className="text-[10px] sm:text-xs font-black tracking-[0.25em] text-amber-200 uppercase">
                Est. 1976 • Matungulu, Machakos County
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white leading-[1.05] tracking-tight mb-5">
              Kinyui Boys{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">
                Senior School
              </span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-slate-300 max-w-2xl leading-relaxed mb-8 font-medium">
              Forging disciplined leaders through academic excellence, moral integrity, and holistic development for nearly five decades.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link href="/pages/apply-for-admissions">
                <button className="px-6 sm:px-8 py-3 sm:py-3.5 bg-gradient-to-r from-amber-500 to-orange-600 text-white text-xs sm:text-sm font-black rounded-xl shadow-lg shadow-orange-900/30 flex items-center gap-2 hover:shadow-xl transition-all active:scale-95">
                  Apply Now <ArrowRight size={16} />
                </button>
              </Link>
              <Link href="/pages/admissions">
                <button className="px-6 sm:px-8 py-3 sm:py-3.5 bg-white/10 backdrop-blur-md text-white text-xs sm:text-sm font-black rounded-xl border border-white/20 flex items-center gap-2 hover:bg-white/20 transition-all active:scale-95">
                  View Curriculum
                </button>
              </Link>
            </div>
          </div>

          {/* Stats Bar - Modern Cards on Light BG */}
          <div className="mt-10 sm:mt-14 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            <AnimatedCounter value="400" label="Students" icon={Users} />
            <AnimatedCounter value="88" label="Completion Rate" icon={TrendingUp} suffix="%" />
            <AnimatedCounter value="45" label="Awards Won" icon={Trophy} />
            <AnimatedCounter value="12" label="Curriculums" icon={BookOpen} />
          </div>
        </div>
      </section>

      {/* ═══════════════════════ VISION SECTION ═══════════════════════ */}
      <section className="py-12 sm:py-24 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-10 sm:gap-16 items-center">
          
          {/* Left Side: Content */}
          <div className="order-2 lg:order-1 text-center lg:text-left">
            <div className="mb-8 sm:mb-10">
              <span className="inline-block px-3 py-1 sm:px-4 sm:py-1.5 mb-4 text-[9px] sm:text-[10px] font-black tracking-[0.2em] text-amber-600 uppercase bg-amber-50 rounded-full border border-amber-200">
                Future Outlook
              </span>
              <h3 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 mb-4 sm:mb-6 leading-[1.1]">
                Empowering Minds, <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600">Enriching Lives.</span>
              </h3>
              <p className="text-sm sm:text-lg text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
                Our vision is to bridge traditional education with 21st-century needs through holistic development.
              </p>
            </div>

            {/* Vision Cards - Redesigned */}
            <div className="grid gap-3 sm:gap-4 text-left">
              {[
                { title: "Elite Faculty", icon: <Target size={18} />, desc: "Mentors from world-class institutions." },
                { title: "Holistic Growth", icon: <Zap size={18} />, desc: "Emotional intelligence and academic mastery." },
                { title: "Infrastructure", icon: <Globe size={18} />, desc: "Smart classrooms and collaborative labs." }
              ].map((item, i) => (
                <div key={i} className="group flex gap-4 p-4 sm:p-6 rounded-2xl bg-white border border-slate-100 shadow-md transition-all hover:shadow-xl hover:border-amber-200">
                  <div className="shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="font-black text-slate-900 text-sm sm:text-lg mb-0.5">{item.title}</h4>
                    <p className="text-slate-500 text-xs sm:text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side: Image with Modern Overlay */}
          <div className="relative order-1 lg:order-2 group">
            <div className="absolute -inset-6 bg-gradient-to-tr from-amber-100 to-orange-100 rounded-full opacity-60 blur-3xl -z-10"></div>
            <div className="relative">
              <div className="absolute -inset-2 bg-gradient-to-br from-amber-200 to-orange-200 rounded-[2rem] -rotate-1 -z-10 transition-transform group-hover:rotate-1 duration-500"></div>
              <div className="relative overflow-hidden aspect-square sm:aspect-video lg:aspect-square rounded-2xl shadow-2xl border border-amber-100">
                <Image
                  src="/hero/katz8.jpeg"
                  alt="School Vision"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 z-20">
                  <div className="bg-white/90 backdrop-blur-md px-3 py-2 rounded-xl shadow-lg border border-white/50">
                    <p className="text-xs font-bold text-amber-600">Soaring to Excellence</p>
                  </div>
                </div>
                <div className="absolute top-3 right-3 z-20">
                  <div className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-md flex items-center gap-1.5">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-200 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                    </span>
                    Featured
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════ MISSION SECTION ═══════════════════════ */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-16 border border-amber-100 shadow-xl">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-20 items-center">
            
            {/* Left Side: Image */}
            <div className="relative group">
              <div className="absolute -inset-2 bg-gradient-to-br from-amber-200 to-orange-200 rounded-[2rem] -rotate-1 -z-10 transition-transform group-hover:rotate-1 duration-500"></div>
              <div className="relative overflow-hidden aspect-square sm:aspect-video lg:aspect-square rounded-2xl shadow-2xl border border-amber-100">
                <Image
                  src="/bg/1.jpeg"
                  alt="School Mission"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute bottom-3 left-3 right-3 z-20">
                  <div className="bg-white/90 backdrop-blur-md px-3 py-2 rounded-xl shadow-lg border border-white/50 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                        <BookOpen className="text-white" size={16} />
                      </div>
                      <div>
                        <p className="text-[10px] font-medium text-amber-600">Our Focus</p>
                        <p className="text-xs font-bold text-slate-800">Education Excellence</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                      </span>
                      <span className="text-[10px] font-medium text-green-600">400+ students</span>
                    </div>
                  </div>
                </div>
                <div className="absolute top-3 right-3 z-20">
                  <div className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-2 py-1 rounded-full text-[10px] font-bold shadow-md">
                    New
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side: Content */}
            <div className="flex flex-col text-center lg:text-left items-center lg:items-start">
              <h2 className="text-amber-600 font-black uppercase text-[9px] sm:text-xs tracking-[0.2em] mb-4 bg-white/80 border border-amber-200 w-fit px-3 py-1 rounded-full shadow-sm">
                Our Mission
              </h2>
              <h3 className="text-2xl sm:text-4xl md:text-5xl font-black text-slate-900 mb-4 sm:mb-6 leading-[1.2]">
                Fostering Excellence <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600">Through Innovation.</span>
              </h3>
              <p className="text-slate-600 text-sm sm:text-lg mb-8 sm:mb-10 leading-relaxed font-medium">
                We provide a supportive environment where students lead with integrity.
              </p>

              <div className="grid gap-3 w-full text-left">
                {[
                  { title: "Global Perspective", icon: <Globe size={20} />, text: "Preparing for a borderless future." },
                  { title: "Agile Learning", icon: <Zap size={20} />, text: "Adapting to new technologies." }
                ].map((item, i) => (
                  <div key={i} className="group flex gap-4 p-4 rounded-xl sm:rounded-2xl transition-all bg-white border border-slate-100 shadow-md hover:shadow-xl hover:border-amber-200">
                    <div className="shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="font-black text-slate-900 text-sm sm:text-lg">{item.title}</h4>
                      <p className="text-slate-500 text-xs sm:text-sm">{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════ VALUES SECTION ═══════════════════════ */}
      <section className="py-12 sm:py-24 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-10 sm:gap-16 items-center">
          
          {/* Left Side: Content */}
          <div className="order-2 lg:order-1">
            <div className="mb-8 sm:mb-10 text-center lg:text-left">
              <span className="inline-block px-3 py-1 sm:px-4 sm:py-1.5 mb-4 text-[9px] sm:text-[10px] font-black tracking-[0.2em] text-amber-600 uppercase bg-amber-50 rounded-full border border-amber-200">
                Our Foundation
              </span>
              <h3 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 mb-4 sm:mb-6 leading-[1.1]">
                Character Over <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600 italic">Everything.</span>
              </h3>
              <p className="text-sm sm:text-lg text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
                Integrity, Discipline, and Resilience aren't just words here—they are the pillars of our community's DNA.
              </p>
            </div>

            {/* Values Grid - Modern Cards */}
            <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 sm:gap-4">
              {[
                { title: "Integrity", icon: <ShieldCheck size={18} />, desc: "Doing right always." },
                { title: "Discipline", icon: <Clock size={18} />, desc: "Consistency in effort." },
                { title: "Resilience", icon: <TrendingUp size={18} />, desc: "Bouncing back stronger." },
                { title: "Empathy", icon: <Heart size={18} />, desc: "Understanding others." },
                { title: "Innovation", icon: <Lightbulb size={18} />, desc: "Thinking beyond limits." },
                { title: "Leadership", icon: <Users size={18} />, desc: "Inspiring the collective." }
              ].map((val, i) => (
                <div 
                  key={i} 
                  className="group flex flex-col p-3 sm:p-4 bg-white border border-slate-100 rounded-xl sm:rounded-2xl shadow-md transition-all duration-300 hover:shadow-xl hover:border-amber-200 hover:-translate-y-1"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 text-white group-hover:scale-110 transition-transform shadow-md">
                      {val.icon}
                    </div>
                    <span className="font-black text-xs sm:text-sm text-slate-800 tracking-tight">{val.title}</span>
                  </div>
                  <p className="hidden xs:block text-[10px] sm:text-xs text-slate-500 mt-2 ml-11 leading-tight">{val.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side: Image */}
          <div className="relative order-1 lg:order-2 group">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100%] h-[100%] bg-amber-100 rounded-full blur-3xl opacity-50 -z-10"></div>
            <div className="relative">
              <div className="absolute -inset-2 bg-gradient-to-br from-amber-200 to-orange-200 rounded-[2rem] -rotate-1 -z-10 transition-transform group-hover:rotate-1 duration-500"></div>
              <div className="relative overflow-hidden aspect-square sm:aspect-video lg:aspect-square rounded-2xl shadow-2xl border border-amber-100">
                <Image
                  src="/bg/14.jpeg"
                  alt="School Values"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                <div className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3 right-2 sm:right-3 z-20">
                  <div className="bg-white/90 backdrop-blur-md px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg sm:rounded-xl shadow-lg border border-white/50 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-md sm:rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                        <Star className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                      </div>
                      <div>
                        <p className="text-[8px] sm:text-[10px] font-medium text-amber-600">Event Status</p>
                        <p className="text-[10px] sm:text-xs font-bold text-slate-800">Registration Open</p>
                      </div>
                    </div>
                    <div className="text-[8px] sm:text-[10px] font-bold bg-emerald-100 text-emerald-700 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full">
                      Join Now
                    </div>
                  </div>
                </div>
                <div className="absolute top-2 sm:top-3 right-2 sm:right-3 z-20">
                  <div className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-bold shadow-md flex items-center gap-1 sm:gap-1.5">
                    <span className="relative flex h-1.5 w-1.5 sm:h-2 sm:w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-200 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-full w-full bg-white"></span>
                    </span>
                    <span className="hidden xs:inline">Featured</span>
                    <span className="xs:hidden">⭐</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════ LOCATION & SCHOOL INFO SECTION ═══════════════════════ */}
      <section className="py-12 sm:py-24 px-4 sm:px-6 bg-gradient-to-br from-amber-50 to-orange-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-12 gap-6 sm:gap-8 items-stretch">
            
            {/* Contact Card - Gradient but keeping light theme */}
            <div className="lg:col-span-4 group relative overflow-hidden bg-gradient-to-br from-amber-600 to-orange-600 p-6 sm:p-10 rounded-[2rem] sm:rounded-[2.5rem] shadow-2xl shadow-amber-200/50 flex flex-col justify-between transition-all duration-500 hover:-translate-y-2">
              <div className="absolute -top-10 -right-10 w-40 h-40 sm:w-64 sm:h-64 bg-amber-500 rounded-full opacity-40 transition-transform duration-700 group-hover:scale-110"></div>
              
              <div className="relative z-10">
                <span className="inline-block px-3 py-1 mb-4 sm:mb-6 text-[9px] sm:text-[10px] font-black tracking-widest text-amber-100 uppercase bg-amber-700/50 rounded-full border border-amber-400/30">
                  Find Us
                </span>
                <h4 className="text-2xl sm:text-3xl font-black text-white mb-6 sm:mb-10 tracking-tight leading-tight">
                  Get in <br className="hidden sm:block" /> Touch
                </h4>
                
                <div className="space-y-6 sm:space-y-8">
                  <div className="flex gap-4 sm:gap-5 group/item items-start">
                    <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-amber-500/50 flex items-center justify-center text-white border border-amber-400/30 group-hover/item:bg-white group-hover/item:text-amber-600 transition-all shadow-lg">
                      <MapPin size={20} className="sm:w-[24px] sm:h-[24px]" />
                    </div>
                    <div>
                      <p className="text-amber-100 text-[9px] sm:text-xs uppercase font-black tracking-tighter mb-0.5 sm:mb-1 opacity-80">School Address</p>
                      <p className="text-white text-sm sm:text-base font-bold leading-snug sm:leading-relaxed">
                        Kinyui Boys Senior School, Matungulu, Machakos County
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 sm:gap-5 group/item items-start">
                    <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-amber-500/50 flex items-center justify-center text-white border border-amber-400/30 group-hover/item:bg-white group-hover/item:text-amber-600 transition-all shadow-lg">
                      <Phone size={20} className="sm:w-[24px] sm:h-[24px]" />
                    </div>
                    <div>
                      <p className="text-amber-100 text-[9px] sm:text-xs uppercase font-black tracking-tighter mb-0.5 sm:mb-1 opacity-80">Direct Line</p>
                      <p className="text-white text-sm sm:text-base font-bold">+254 710 894 145</p>
                      <p className="text-white/80 text-xs mt-1">+254 710 894 145</p>
                    </div>
                  </div>

                  <div className="flex gap-4 sm:gap-5 group/item items-start">
                    <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-amber-500/50 flex items-center justify-center text-white border border-amber-400/30 group-hover/item:bg-white group-hover/item:text-amber-600 transition-all shadow-lg">
                      <Mail size={20} className="sm:w-[24px] sm:h-[24px]" />
                    </div>
                    <div>
                      <p className="text-amber-100 text-[9px] sm:text-xs uppercase font-black tracking-tighter mb-0.5 sm:mb-1 opacity-80">Email</p>
                      <p className="text-white text-sm sm:text-base font-bold">kinyuiboys2015@gmail.com</p>
                      <p className="text-white/80 text-xs">kinyuiboys2015@gmail.com</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="relative z-10 mt-8 sm:mt-12">
                <a 
                  href="https://www.google.com/maps/search/?api=1&query=kinyui+boys+High+School" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full py-3 sm:py-4 bg-white text-amber-600 font-black text-xs sm:text-sm rounded-xl sm:rounded-2xl shadow-xl transition-all hover:bg-amber-50 hover:scale-105 flex items-center justify-center gap-2 uppercase tracking-wider"
                >
                  Google Maps
                  <ExternalLink size={16} />
                </a>
              </div>
            </div>

            {/* School Information Panel - Light theme card */}
            <div className="lg:col-span-8 group relative bg-white rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-8 border border-slate-200 shadow-xl shadow-slate-200/40 transition-all duration-500 hover:border-amber-200">
              
              <div className="flex items-center justify-between mb-6 sm:mb-8">
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 flex items-center gap-3 tracking-tight">
                  <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div>
                  About Kinyui Boys Senior School
                </h3>
              </div>
              
              <div className="space-y-6 sm:space-y-8">
                {/* Overview */}
                <div className="bg-amber-50/50 rounded-2xl p-5 sm:p-6 border border-amber-100">
                  <h4 className="text-sm sm:text-base font-black text-amber-600 uppercase tracking-wider mb-3">Overview</h4>
                  <p className="text-slate-700 text-sm sm:text-base leading-relaxed">
                    Kinyui Boys Senior School is a reputable public secondary school located in Matungulu Sub-county, Machakos County. The institution is committed to academic excellence and holistic student development in a conducive learning environment.
                  </p>
                </div>

                {/* Key Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-slate-50 rounded-xl p-4 sm:p-5 border border-slate-200">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                        <span className="text-white font-bold text-sm">📚</span>
                      </div>
                      <h5 className="font-black text-slate-900 text-sm uppercase">Category</h5>
                    </div>
                    <p className="text-slate-700 font-medium text-sm sm:text-base">Boarding</p>
                    <p className="text-xs text-slate-500 mt-1">Public Secondary School</p>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-4 sm:p-5 border border-slate-200">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                        <span className="text-white font-bold text-sm">🎓</span>
                      </div>
                      <h5 className="font-black text-slate-900 text-sm uppercase">Curriculum</h5>
                    </div>
                    <p className="text-slate-700 font-medium text-sm sm:text-base">8-4-4 & CBC</p>
                    <p className="text-xs text-slate-500 mt-1">Form 1-4</p>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-4 sm:p-5 border border-slate-200">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                        <span className="text-white font-bold text-sm">⏰</span>
                      </div>
                      <h5 className="font-black text-slate-900 text-sm uppercase">School Hours</h5>
                    </div>
                    <p className="text-slate-700 font-medium text-sm sm:text-base">Mon - Fri: 7:45 AM - 4:30 PM</p>
                    <p className="text-xs text-slate-500 mt-1">Weekend: Closed</p>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-4 sm:p-5 border border-slate-200">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                        <span className="text-white font-bold text-sm">📅</span>
                      </div>
                      <h5 className="font-black text-slate-900 text-sm uppercase">Founded</h5>
                    </div>
                    <p className="text-slate-700 font-medium text-sm sm:text-base">Est. 1976</p>
                    <p className="text-xs text-slate-500 mt-1">35+ Years of Excellence</p>
                  </div>
                </div>

                {/* Facilities & Achievements */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-5 border border-amber-200">
                    <h5 className="font-black text-slate-900 text-sm uppercase mb-3 flex items-center gap-2">
                      <span className="w-1 h-4 bg-amber-500 rounded-full"></span>
                      Key Facilities
                    </h5>
                    <ul className="space-y-2">
                      {['Modern Science Labs', 'Computer Lab', 'Library', 'Sports Fields'].map((item, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-slate-700">
                          <span className="text-amber-500">✓</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-5 border border-amber-200">
                    <h5 className="font-black text-slate-900 text-sm uppercase mb-3 flex items-center gap-2">
                      <span className="w-1 h-4 bg-amber-500 rounded-full"></span>
                      Achievements
                    </h5>
                    <ul className="space-y-2">
                      {['Good KCSE Performance', 'Sports Champions', 'Science And Mathematics Congress Winners'].map((item, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-slate-700">
                          <span className="text-amber-500">★</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Admission Notice */}
                <div className="bg-amber-600/5 rounded-xl p-4 border border-amber-200/50">
                  <p className="text-xs sm:text-sm text-slate-600 italic">
                    For admission inquiries and school fees structure, please contact the school administration during office hours or visit during scheduled open days.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════ INSTITUTIONAL SECTION ═══════════════════════ */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto relative bg-white rounded-[2rem] md:rounded-[3.5rem] p-8 sm:p-6 md:p-16 text-center border border-slate-200 shadow-xl">
          
          <div className="flex justify-center mb-6 md:mb-8">
            <div className="relative p-4 bg-amber-50 border border-amber-200 rounded-2xl">
              <ShieldCheck className="text-amber-600 w-6 h-6 md:w-7 md:h-7" />
            </div>
          </div>

          <div className="relative z-10 w-full">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-3xl font-black text-slate-900 mb-6 md:mb-10 tracking-tighter leading-[1.1] md:leading-[0.95] max-w-4xl mx-auto">
              Integrity & <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600">Wellbeing.</span>
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 mb-10 md:mb-16 max-w-5xl mx-auto text-left items-start border-t border-slate-100 pt-8 md:pt-12">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-4 bg-amber-500 rounded-full" />
                  <h4 className="text-amber-600 font-black text-[10px] uppercase tracking-[0.2em]">Institutional Policy</h4>
                </div>
                <p className="text-slate-800 text-base md:text-lg leading-tight font-bold">
                  Standardizing excellence through discipline.
                </p>
                <p className="text-slate-500 text-xs sm:text-sm leading-relaxed font-light">
                  Our institutional policies ensure a focused environment. We uphold a strict code of conduct that prioritizes academic integrity and mutual respect as the bedrock of our School culture.
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-4 bg-amber-500 rounded-full" />
                  <h4 className="text-amber-600 font-black text-[10px] uppercase tracking-[0.2em]">Guidance & Counselling</h4>
                </div>
                <p className="text-slate-800 text-base md:text-lg leading-tight font-bold">
                  Nurturing the mind beyond the classroom.
                </p>
                <p className="text-slate-500 text-xs sm:text-sm leading-relaxed font-light">
                  Through professional Guidance and Counselling, we provide students with the emotional tools and support necessary to navigate the challenges of global leadership and personal growth.
                </p>
              </div>
            </div>

            <div className="flex flex-row gap-3 sm:gap-6 justify-center items-center w-full px-4 mt-6">
              <Link href="/pages/OurSchoolPolicies" className="w-auto">
                <button className="px-5 sm:px-10 py-3.5 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-black text-[9px] sm:text-[11px] uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-amber-500/25 active:scale-95 flex items-center justify-center gap-2 transition-all hover:shadow-lg whitespace-nowrap">
                  Policies <ArrowRight size={14} className="shrink-0" />
                </button>
              </Link>
              <Link href="/pages/Guidance-and-Councelling" className="w-auto">
                <button className="px-5 sm:px-10 py-3.5 bg-slate-100 text-slate-800 font-black text-[9px] sm:text-[11px] uppercase tracking-[0.2em] rounded-2xl border border-slate-200 active:scale-95 transition-all hover:bg-slate-200 whitespace-nowrap">
                  Guidance
                </button>
              </Link>
            </div>

            <div className="pt-8 border-t border-slate-100 grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto mt-8">
              {[
                { label: 'Safety Rating', val: '100%' },
                { label: 'Student Support', val: '24/7' },
                { label: 'Certified Mentors', val: '15+' },
                { label: 'Ethics Standard', val: 'Gold' }
              ].map((stat, i) => (
                <div key={i} className="flex flex-col items-center lg:items-start text-center lg:text-left">
                  <span className="text-xl md:text-3xl font-black text-slate-900 tracking-tighter">{stat.val}</span>
                  <span className="text-[9px] uppercase tracking-[0.2em] text-amber-600 font-bold mt-1">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Scroll to Top Button */}
      <ScrollToTop />
    </div>
  );
}