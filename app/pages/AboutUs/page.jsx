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

{/* ═══════════════════════ MISSION, VISION & MOTTO SECTION ═══════════════════════ */}
<section className="py-16 sm:py-28 px-4 sm:px-6 bg-white overflow-hidden">
  <div className="max-w-7xl mx-auto">
    
    {/* MOTTO: The Top Statement */}
    <div className="text-center mb-16 md:mb-24 relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-32 bg-amber-50/50 blur-3xl -z-10" />
      <span className="text-amber-600 font-black text-[10px] uppercase tracking-[0.4em] mb-4 block">Our School Motto</span>
      <h2 className="text-5xl md:text-8xl font-black text-slate-900 tracking-tighter leading-none italic uppercase">
        Non Sibi Sed <br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600">Omnibus</span>
      </h2>
      <p className="mt-6 text-slate-400 font-bold text-sm md:text-base tracking-[0.2em] uppercase">
        "Not for self, but for all"
      </p>
    </div>

    <div className="grid lg:grid-cols-12 gap-8 items-stretch">
      
      {/* LEFT: Vision & Mission Content */}
      <div className="lg:col-span-7 flex flex-col gap-6">
        
        {/* Vision Card */}
        <div className="group bg-slate-50 p-8 md:p-12 rounded-[2.5rem] border border-slate-100 transition-all hover:bg-white hover:shadow-2xl hover:shadow-slate-200/50">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-all">
              <Eye size={24} strokeWidth={2.5} />
            </div>
            <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Our Vision</h3>
          </div>
          <p className="text-slate-600 text-lg md:text-xl font-medium leading-relaxed italic">
            "To be a leading center of excellence in academic performance and holistic development of a boy child."
          </p>
        </div>

        {/* Mission Card */}
        <div className="group bg-slate-50 p-8 md:p-12 rounded-[2.5rem] border border-slate-100 transition-all hover:bg-white hover:shadow-2xl hover:shadow-slate-200/50">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-all">
              <Target size={24} strokeWidth={2.5} />
            </div>
            <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Our Mission</h3>
          </div>
          <p className="text-slate-600 text-lg md:text-xl font-medium leading-relaxed">
            "To provide a conducive environment for quality teaching and learning through teamwork and effective utilization of resources to produce upright and dependable citizens."
          </p>
        </div>
      </div>

      {/* RIGHT: Visual Anchor (Image) */}
      <div className="lg:col-span-5 relative group min-h-[400px]">
        <div className="absolute inset-0 bg-amber-100 rounded-[2.5rem] rotate-3 transition-transform group-hover:rotate-0" />
        <div className="relative h-full w-full overflow-hidden rounded-[2.5rem] border-4 border-white shadow-xl">
          <Image
            src="/bg/1.jpeg"
            alt="Kinyui Boys Campus"
            fill
            className="object-cover transition-transform duration-1000 group-hover:scale-110"
          />
          
          {/* Stats Overlay */}
          <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-md p-6 rounded-2xl border border-white/50 shadow-lg">
             <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-black text-amber-600 uppercase tracking-widest">Enrollment</span>
                <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">Active</span>
             </div>
             <div className="flex items-end gap-2">
                <span className="text-4xl font-black text-slate-900">400+</span>
                <span className="text-sm font-medium text-slate-500 mb-1.5">Future Leaders</span>
             </div>
          </div>
        </div>
      </div>

    </div>

    {/* Bottom Key Pillars Tag Cloud */}
    <div className="mt-12 flex flex-wrap justify-center gap-3">
       {['Quality Teaching', 'Teamwork', 'Holistic Growth', 'Dependable Citizens'].map((tag, i) => (
         <span key={i} className="px-5 py-2 rounded-full border border-slate-100 bg-white text-[10px] font-black uppercase tracking-widest text-slate-400">
           {tag}
         </span>
       ))}
    </div>
  </div>
</section>

{/* ═══════════════════════ VALUES SECTION (ALTERNATIVE DESIGN) ═══════════════════════ */}
<section className="py-16 sm:py-28 px-4 sm:px-6 bg-white overflow-hidden">
  <div className="max-w-7xl mx-auto">
    <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-center">
      
      {/* LEFT SIDE: The Visual Foundation */}
      <div className="lg:col-span-5 relative order-2 lg:order-1">
        <div className="relative z-10 group">
          {/* Decorative Backing */}
          <div className="absolute -inset-4 bg-slate-50 rounded-[3rem] rotate-2 -z-10 group-hover:rotate-0 transition-transform duration-700" />
          
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem] border-[12px] border-white shadow-2xl">
            <Image
              src="/bg/14.jpeg"
              alt="Kinyui Boys Excellence"
              fill
              className="object-cover transition-transform duration-1000 group-hover:scale-110"
            />
            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
            
            {/* Floating Achievement Tag */}
            <div className="absolute bottom-6 left-6 right-6">
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-4 rounded-2xl flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-amber-500 flex items-center justify-center shadow-lg">
                  <Star className="text-white w-6 h-6 fill-current" />
                </div>
                <div>
                  <p className="text-white font-black text-sm uppercase tracking-wider">The Kinyui Way</p>
                  <p className="text-white/80 text-xs">Forging leaders since 1976</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Abstract shapes for flair */}
        <div className="absolute -top-10 -left-10 w-32 h-32 bg-amber-200/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-orange-200/30 rounded-full blur-3xl" />
      </div>

      {/* RIGHT SIDE: The Pillars (Vertical Layout) */}
      <div className="lg:col-span-7 order-1 lg:order-2">
        <div className="mb-12">
          <h4 className="text-amber-600 font-black text-xs uppercase tracking-[0.3em] mb-4">Our Foundation</h4>
          <h2 className="text-4xl md:text-6xl font-black text-slate-900 leading-[0.9] tracking-tighter mb-6">
            Character Over <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600">Everything.</span>
          </h2>
          <p className="text-slate-500 text-lg font-medium max-w-xl">
            Integrity, Discipline, and Resilience aren't just words here—they are the pillars of our community's DNA.
          </p>
        </div>

        {/* Vertical Values Path */}
        <div className="relative space-y-8 before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-100">
          {[
            { title: "Integrity", icon: <ShieldCheck size={20} />, desc: "Doing right, even when no one is watching." },
            { title: "Discipline", icon: <Clock size={20} />, desc: "Mastery over self is the first step to leadership." },
            { title: "Resilience", icon: <TrendingUp size={20} />, desc: "We don't break; we bounce back stronger." },
            { title: "Leadership", icon: <Users size={20} />, desc: "To lead others, one must first serve the collective." }
          ].map((val, i) => (
            <div key={i} className="relative pl-12 group">
              {/* Icon Marker */}
              <div className="absolute left-0 top-0 w-10 h-10 bg-white border-2 border-slate-100 rounded-xl flex items-center justify-center text-slate-400 group-hover:border-amber-500 group-hover:text-amber-600 transition-all duration-300 shadow-sm z-10">
                {val.icon}
              </div>
              
              <div className="pb-2">
                <h5 className="font-black text-slate-900 text-lg uppercase tracking-tight group-hover:text-amber-600 transition-colors">
                  {val.title}
                </h5>
                <p className="text-slate-500 text-sm leading-relaxed mt-1">
                  {val.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 flex items-center gap-6">
            <div className="h-[1px] flex-1 bg-slate-100" />
            <span className="text-[10px] font-black uppercase text-slate-300 tracking-[0.4em]">Non Sibi Sed Omnibus</span>
        </div>
      </div>

    </div>
  </div>
</section>
   {/* ═══════════════════════ LOCATION & SCHOOL INFO SECTION ═══════════════════════ */}
<section className="py-16 sm:py-24 px-4 sm:px-6 bg-slate-50/50">
  <div className="max-w-7xl mx-auto">
    <div className="grid lg:grid-cols-12 gap-8 items-stretch">
      
      {/* LEFT COLUMN: School Information & Contacts */}
      <div className="lg:col-span-7 space-y-8">
        
        {/* Main Info Card */}
        <div className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-slate-200 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-2 h-8 bg-amber-500 rounded-full" />
            <h3 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight">
              Kinyui Boys Senior School
            </h3>
          </div>

          <div className="prose prose-slate max-w-none mb-10">
            <p className="text-slate-600 text-base md:text-lg leading-relaxed font-medium">
              A premier public boarding institution in Matungulu, Machakos County. We are dedicated to forging the next generation of leaders through academic rigor and character development.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { icon: '📚', label: 'Category', val: 'Public Boarding' },
              { icon: '🎓', label: 'Curriculum', val: '8-4-4 & CBC' },
              { icon: '⏰', label: 'Hours', val: '7:45 AM - 4:30 PM' },
              { icon: '📅', label: 'Legacy', val: 'Est. 1976' }
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4 p-4 rounded-2xl border border-slate-100 bg-slate-50/30">
                <span className="text-2xl">{item.icon}</span>
                <div>
                  <p className="text-[10px] uppercase font-black text-amber-600 tracking-widest">{item.label}</p>
                  <p className="text-slate-900 font-bold text-sm">{item.val}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Strip */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 flex flex-col gap-2">
            <Phone className="text-amber-600 w-5 h-5" />
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-tighter">Call Us</p>
            <p className="text-slate-900 font-bold text-sm">+254 710 894 145</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 flex flex-col gap-2">
            <Mail className="text-amber-600 w-5 h-5" />
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-tighter">Email</p>
            <p className="text-slate-900 font-bold text-sm truncate">kinyuiboys2015@gmail.com</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 flex flex-col gap-2">
            <MapPin className="text-amber-600 w-5 h-5" />
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-tighter">Location</p>
            <p className="text-slate-900 font-bold text-sm leading-tight">Matungulu, Machakos</p>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: The Map (White background style) */}
      <div className="lg:col-span-5 relative group">
        <div className="sticky top-8 h-full min-h-[450px] bg-white rounded-[2.5rem] border border-slate-200 p-3 shadow-xl overflow-hidden transition-all duration-500 hover:border-amber-400/50">
          
          {/* Map Header Overlay */}
          <div className="absolute top-8 left-8 right-8 z-10 flex items-center justify-between">
             <div className="bg-white/90 backdrop-blur px-4 py-2 rounded-full border border-slate-100 shadow-sm">
                <p className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
Our school Location
                </p>
             </div>
             <a 
               href="https://maps.google.com" 
               target="_blank" 
               className="p-2 bg-slate-900 text-white rounded-full hover:bg-amber-600 transition-colors shadow-lg"
             >
               <ExternalLink size={18} />
             </a>
          </div>

          {/* Placeholder for Google Map Embed */}
          <div className="w-full h-full bg-slate-100 rounded-[1.8rem] overflow-hidden">
             {/* Replace with <iframe src="..."> */}
             <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 opacity-50">
                <Map size={48} strokeWidth={1} className="mb-2" />
                <p className="text-xs font-medium">Google Maps Integration</p>
             </div>
          </div>

          {/* Bottom Floating Card */}
          <div className="absolute bottom-8 left-8 right-8 bg-white p-5 rounded-2xl border border-slate-100 shadow-2xl">
             <p className="text-xs text-slate-500 italic mb-0">
               "Providing a conducive learning environment for 35+ years."
             </p>
          </div>
        </div>
      </div>

    </div>
  </div>
</section>

    {/* ═══════════════════════ KINYUI BOYS INSTITUTIONAL SECTION ═══════════════════════ */}
<section className="py-16 sm:py-24 px-4 sm:px-6">
  <div className="max-w-7xl mx-auto bg-white rounded-[2.5rem] md:rounded-[4rem] border border-slate-100 shadow-2xl shadow-slate-200/50 overflow-hidden">
    <div className="flex flex-col lg:flex-row">
      
      {/* Sidebar: The Brand/Identity */}
      <div className="lg:w-1/3 bg-slate-50 p-10 md:p-16 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-100">
        <div>
          <div className="inline-flex p-3 bg-white shadow-sm border border-amber-100 rounded-2xl mb-8">
            <ShieldCheck className="text-amber-600 w-8 h-8" />
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-[0.9] mb-6">
            The <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-br from-amber-500 to-orange-700">Kinyui</span> <br />
            Standard.
          </h2>
          <p className="text-slate-500 font-medium leading-relaxed">
            Building men of integrity through structured discipline and mental resilience.
          </p>
        </div>

        <div className="mt-12 space-y-6">
          {[
            { label: 'Safety Rating', val: '100%' },
            { label: 'Ethics Standard', val: 'Gold' }
          ].map((stat, i) => (
            <div key={i} className="flex flex-col">
              <span className="text-3xl font-black text-slate-900">{stat.val}</span>
              <span className="text-[10px] uppercase tracking-widest text-amber-600 font-bold">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content: The Details */}
      <div className="lg:w-2/3 p-10 md:p-16 flex flex-col justify-center">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
          
          {/* Policy */}
          <div className="group">
            <div className="w-12 h-1 bg-amber-500 mb-6 transition-all group-hover:w-20" />
            <h4 className="text-amber-600 font-black text-xs uppercase tracking-[0.2em] mb-3">Code of Conduct</h4>
            <h3 className="text-xl font-bold text-slate-900 mb-4 leading-tight">
              Standardizing Excellence through Discipline.
            </h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              Our policies are designed to sharpen character. We uphold a strict code that transforms boys into responsible gentlemen, prioritizing academic focus and mutual respect.
            </p>
          </div>

          {/* Counselling */}
          <div className="group">
            <div className="w-12 h-1 bg-orange-500 mb-6 transition-all group-hover:w-20" />
            <h4 className="text-orange-600 font-black text-xs uppercase tracking-[0.2em] mb-3">Brotherhood Support</h4>
            <h3 className="text-xl font-bold text-slate-900 mb-4 leading-tight">
              Nurturing Minds for Global Leadership.
            </h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              Beyond the books, we offer professional Guidance and Counselling to help every student navigate personal growth and emotional strength.
            </p>
          </div>
        </div>

        {/* Actions & Secondary Stats */}
        <div className="flex flex-col sm:flex-row items-center gap-4 pt-10 border-t border-slate-100">
          <Link href="/pages/OurSchoolPolicies" className="w-full sm:w-auto">
            <button className="w-full px-8 py-4 bg-slate-900 text-white font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-amber-600 transition-colors flex items-center justify-center gap-3">
              View School Rules <ArrowRight size={16} />
            </button>
          </Link>
          
          <Link href="/pages/Guidance-and-Councelling" className="w-full sm:w-auto">
            <button className="w-full px-8 py-4 bg-white text-slate-900 border border-slate-200 font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-slate-50 transition-colors">
             Sessions
            </button>
          </Link>

          <div className="flex gap-8 ml-auto hidden xl:flex">
             <div className="text-right">
                <p className="text-2xl font-black text-slate-900">24/7</p>
                <p className="text-[9px] uppercase font-bold text-slate-400">Support</p>
             </div>
             <div className="text-right">
                <p className="text-2xl font-black text-slate-900">15+</p>
                <p className="text-[9px] uppercase font-bold text-slate-400">Mentors</p>
             </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</section>

      {/* Scroll to Top Button */}
      <ScrollToTop />
    </div>
  );
}