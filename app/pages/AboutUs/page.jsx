"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  MapPin, Users, BookOpen, Mail, Trophy, Target, Globe, Clock,
  TrendingUp, Lightbulb, ExternalLink, ShieldCheck, ArrowRight,
  Phone, Sparkles, Heart, Zap, GraduationCap, Building2, Award,
  ChevronRight, Star, Check, ArrowUp, Eye, Compass, Map
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
    <div className="bg-white rounded-2xl p-4 sm:p-5 flex items-center gap-3 shadow-lg shadow-slate-200/50 border border-slate-200 hover:shadow-xl transition-all hover:border-amber-200">
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center flex-shrink-0 shadow-md">
        <Icon className="text-white" size={18} />
      </div>
      <div>
        <div className="text-xl sm:text-2xl font-black text-slate-900 leading-none">{count}{suffix}</div>
        <div className="text-[10px] sm:text-xs text-amber-700 font-bold uppercase tracking-wider mt-0.5">{label}</div>
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

            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white leading-[1.05] tracking-tight mb-5">
              Kinyui Boys{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-700 to-orange-700">
                Senior School
              </span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-slate-200 max-w-2xl leading-relaxed mb-8 font-medium">
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

          {/* Stats Bar */}
         <div className="mt-10 sm:mt-14 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
  <AnimatedCounter value="400" label="Students" icon={Users} suffix="+" />
  <AnimatedCounter value="88" label="Completion Rate" icon={TrendingUp} suffix="%" />
  <AnimatedCounter value="45" label="Awards Won" icon={Trophy} />
  <AnimatedCounter value="12" label="Curriculums" icon={BookOpen} />
</div>
        </div>
      </section>

    {/* ═══════════════════════ VISION & FUTURE OUTLOOK SECTION ═══════════════════════ */}
<section className="py-16 sm:py-32 px-4 sm:px-6 bg-white overflow-hidden relative">
  <div className="absolute top-0 right-0 w-1/3 h-full bg-slate-50/50 skew-x-12 translate-x-20 -z-10 hidden lg:block" />

  <div className="max-w-7xl mx-auto">
    <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
      
      {/* IMAGE SIDE */}
      <div className="lg:col-span-6 relative group order-1 lg:order-1">
        <div className="relative">
          <div className="relative z-10 aspect-[4/5] sm:aspect-video lg:aspect-[4/5] overflow-hidden rounded-[3rem] border-[16px] border-white shadow-2xl transition-transform duration-700 group-hover:-translate-y-2">
            <Image
              src="/hero/katz8.jpeg"
              alt="School Vision"
              fill
              className="object-cover transition-transform duration-1000 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />
          </div>

          {/* Floating Glass Card */}
          <div className="absolute -bottom-6 -right-6 lg:right-12 z-20 bg-white/80 backdrop-blur-xl p-6 rounded-[2rem] border border-white shadow-2xl max-w-[240px]">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/40">
                <Compass className="text-white w-5 h-5" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">Our Compass</span>
            </div>
            <p className="text-slate-800 font-bold text-sm leading-tight">
              Directing every student toward global competence and local integrity.
            </p>
          </div>
        </div>

        <div className="absolute -top-20 -left-20 w-64 h-64 bg-amber-200/20 rounded-full blur-[100px] -z-10" />
      </div>

      {/* CONTENT SIDE */}
      <div className="lg:col-span-6 order-2">
        <div className="mb-12">
          <span className="inline-flex items-center gap-2 px-4 py-2 mb-6 text-[10px] font-black tracking-[0.3em] text-amber-700 uppercase bg-amber-50 rounded-full border border-amber-200">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            The Horizon
          </span>
          
          <h3 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 leading-[0.95] tracking-tighter">
            Empowering Minds,<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600">Enriching Lives.</span>
          </h3>
          
          <p className="text-lg text-slate-700 font-medium leading-relaxed max-w-xl">
            Our vision is to bridge traditional values with 21st-century requirements, ensuring every Kinyui boy graduates as a balanced leader ready for the global stage.
          </p>
        </div>

        {/* Vision Pillars */}
        <div className="space-y-4">
          {([
            { 
              title: "Holistic Mastery", 
              icon: <Zap className="w-5 h-5" />, 
              desc: "Balancing academic excellence with high emotional intelligence." 
            },
            { 
              title: "Elite Mentorship", 
              icon: <Target className="w-5 h-5" />, 
              desc: "Learning from a faculty dedicated to individual student success." 
            },
            { 
              title: "Next-Gen Infrastructure", 
              icon: <Globe className="w-5 h-5" />, 
              desc: "Smart environments that foster collaboration and digital literacy." 
            }
          ]).map((item, i) => (
            <div key={i} className="group flex items-start gap-6 p-5 rounded-3xl transition-all duration-300 hover:bg-slate-50 border border-transparent hover:border-slate-200">
              <div className="shrink-0 w-12 h-12 rounded-2xl bg-white shadow-sm border border-slate-200 flex items-center justify-center text-slate-600 group-hover:text-amber-600 group-hover:scale-110 transition-all">
                {item.icon}
              </div>
              <div>
                <h4 className="font-black text-slate-900 text-base uppercase tracking-tight mb-1">{item.title}</h4>
                <p className="text-slate-600 text-sm leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
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
      <span className="text-amber-700 font-black text-[10px] uppercase tracking-[0.4em] mb-4 block">Our School Motto</span>
      <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter leading-none uppercase">
        Soaring for{" "}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600">Excellence</span>
      </h2>
      <p className="mt-6 text-slate-600 font-bold text-sm md:text-base tracking-[0.2em] uppercase">
        "Reaching greater heights together"
      </p>
    </div>

    <div className="grid lg:grid-cols-12 gap-8 items-stretch">
      
      {/* LEFT: Vision & Mission Content */}
      <div className="lg:col-span-7 flex flex-col gap-6">
        
        {/* Vision Card */}
        <div className="group bg-slate-50 p-8 md:p-12 rounded-[2.5rem] border border-slate-200 transition-all hover:bg-white hover:shadow-2xl hover:shadow-slate-200/50">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-slate-200 flex items-center justify-center text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-all">
              <Eye size={24} strokeWidth={2.5} />
            </div>
            <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Our Vision</h3>
          </div>
          <p className="text-slate-700 text-lg md:text-xl font-medium leading-relaxed italic">
            "To be a leading center of excellence in academic performance and holistic development of a boy child."
          </p>
        </div>

        {/* Mission Card */}
        <div className="group bg-slate-50 p-8 md:p-12 rounded-[2.5rem] border border-slate-200 transition-all hover:bg-white hover:shadow-2xl hover:shadow-slate-200/50">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-slate-200 flex items-center justify-center text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-all">
              <Target size={24} strokeWidth={2.5} />
            </div>
            <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Our Mission</h3>
          </div>
          <p className="text-slate-700 text-lg md:text-xl font-medium leading-relaxed">
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
                <span className="text-xs font-black text-amber-700 uppercase tracking-widest">Enrollment</span>
                <span className="text-xs font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded-full">Active</span>
             </div>
             <div className="flex items-end gap-2">
                <span className="text-4xl font-black text-slate-900">400+</span>
                <span className="text-sm font-medium text-slate-700 mb-1.5">Future Leaders</span>
             </div>
          </div>
        </div>
      </div>

    </div>

    {/* Bottom Key Pillars Tag Cloud */}
    <div className="mt-12 flex flex-wrap justify-center gap-3">
       {['Quality Teaching', 'Teamwork', 'Holistic Growth', 'Dependable Citizens'].map((tag, i) => (
         <span key={i} className="px-5 py-2 rounded-full border border-slate-200 bg-white text-[10px] font-black uppercase tracking-widest text-slate-600">
           {tag}
         </span>
       ))}
    </div>
  </div>
</section>

{/* ═══════════════════════ VALUES SECTION ═══════════════════════ */}
<section className="py-16 sm:py-28 px-4 sm:px-6 bg-white overflow-hidden">
  <div className="max-w-7xl mx-auto">
    <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-center">
      
      {/* LEFT SIDE: The Visual Foundation */}
      <div className="lg:col-span-5 relative order-2 lg:order-1">
        <div className="relative z-10 group">
          <div className="absolute -inset-4 bg-slate-100 rounded-[3rem] rotate-2 -z-10 group-hover:rotate-0 transition-transform duration-700" />
          
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem] border-[12px] border-white shadow-2xl">
            <Image
              src="/bg/14.jpeg"
              alt="Kinyui Boys Excellence"
              fill
              className="object-cover transition-transform duration-1000 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
            
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

        <div className="absolute -top-10 -left-10 w-32 h-32 bg-amber-200/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-orange-200/30 rounded-full blur-3xl" />
      </div>

      {/* RIGHT SIDE: The Pillars */}
      <div className="lg:col-span-7 order-1 lg:order-2">
        <div className="mb-12">
          <h4 className="text-amber-700 font-black text-xs uppercase tracking-[0.3em] mb-4">Our Foundation</h4>
          <h2 className="text-4xl md:text-6xl font-black text-slate-900 leading-[0.9] tracking-tighter mb-6">
            Character Over <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600">Everything.</span>
          </h2>
          <p className="text-slate-700 text-lg font-medium max-w-xl">
            Integrity, Discipline, and Resilience aren't just words here—they are the pillars of our community's DNA.
          </p>
        </div>

        {/* Vertical Values Path */}
        <div className="relative space-y-8 before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-200">
          {([
            { title: "Integrity", icon: <ShieldCheck size={20} />, desc: "Doing right, even when no one is watching." },
            { title: "Discipline", icon: <Clock size={20} />, desc: "Mastery over self is the first step to leadership." },
            { title: "Resilience", icon: <TrendingUp size={20} />, desc: "We don't break; we bounce back stronger." },
            { title: "Leadership", icon: <Users size={20} />, desc: "To lead others, one must first serve the collective." }
          ]).map((val, i) => (
            <div key={i} className="relative pl-12 group">
              <div className="absolute left-0 top-0 w-10 h-10 bg-white border-2 border-slate-200 rounded-xl flex items-center justify-center text-slate-600 group-hover:border-amber-500 group-hover:text-amber-600 transition-all duration-300 shadow-sm z-10">
                {val.icon}
              </div>
              
              <div className="pb-2">
                <h5 className="font-black text-slate-900 text-lg uppercase tracking-tight group-hover:text-amber-600 transition-colors">
                  {val.title}
                </h5>
                <p className="text-slate-700 text-sm leading-relaxed mt-1">
                  {val.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 flex items-center gap-6">
            <div className="h-[1px] flex-1 bg-slate-200" />
            <span className="text-[10px] font-black uppercase text-slate-500 tracking-[0.4em]">Soaring for Excellence</span>
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
            <p className="text-slate-700 text-base md:text-lg leading-relaxed font-medium">
              A premier public boarding institution in Matungulu, Machakos County. We are dedicated to forging the next generation of leaders through academic rigor and character development.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {([
              { icon: '📚', label: 'Category', val: 'Public Boarding' },
              { icon: '🎓', label: 'Curriculum', val: '8-4-4 & CBC' },
              { icon: '⏰', label: 'Hours', val: '7:45 AM - 4:30 PM' },
              { icon: '📅', label: 'Legacy', val: 'Est. 1976' }
            ]).map((item, i) => (
              <div key={i} className="flex items-center gap-4 p-4 rounded-2xl border border-slate-200 bg-slate-50/50">
                <span className="text-2xl">{item.icon}</span>
                <div>
                  <p className="text-[10px] uppercase font-black text-amber-700 tracking-widest">{item.label}</p>
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
            <p className="text-[10px] font-black uppercase text-slate-600 tracking-tighter">Call Us</p>
            <p className="text-slate-900 font-bold text-sm">+254 710 894 145</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 flex flex-col gap-2">
            <Mail className="text-amber-600 w-5 h-5" />
            <p className="text-[10px] font-black uppercase text-slate-600 tracking-tighter">Email</p>
            <p className="text-slate-900 font-bold text-sm truncate">kinyuiboys2015@gmail.com</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 flex flex-col gap-2">
            <MapPin className="text-amber-600 w-5 h-5" />
            <p className="text-[10px] font-black uppercase text-slate-600 tracking-tighter">Location</p>
            <p className="text-slate-900 font-bold text-sm leading-tight">Matungulu, Machakos</p>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: The Map */}
      <div className="lg:col-span-5 relative group">
        <div className="sticky top-8 h-full min-h-[450px] bg-white rounded-[2.5rem] border border-slate-200 p-3 shadow-xl overflow-hidden transition-all duration-500 hover:border-amber-400/50">
          
          {/* Map Header Overlay */}
          <div className="absolute top-8 left-8 right-8 z-10 flex items-center justify-between">
             <div className="bg-white/90 backdrop-blur px-4 py-2 rounded-full border border-slate-200 shadow-sm">
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

              <div className="relative w-full h-[300px] sm:h-[400px] lg:h-[450px] rounded-2xl overflow-hidden shadow-lg border border-slate-200">
       <iframe
  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.123456!2d37.2618!3d-1.2921!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMcKwMTcnMzEuNiJTIDM3wrAxNSc0Mi41IkU!5e0!3m2!1sen!2ske!4v1234567890"
  width="100%"
  height="100%"
  style="border:0; position:absolute; top:0; left:0; width:100%; height:100%;"
  allowFullScreen
  loading="lazy"
  referrerPolicy="no-referrer-when-downgrade"
  title="Kinyui Boys Senior School Location"
></iframe>
          </div>

          {/* Map Footer with directions button */}
          <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-slate-600 flex items-center gap-2">
              <Navigation className="w-4 h-4 text-orange-600" />
              S.A Kinyui Boys Senior school, Matungulu, Machakos County
            </p>
            <a
              href="https://maps.app.goo.gl/Xg4WbwRWuEvhYR8b9"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-orange-600 text-white font-bold rounded-xl hover:bg-orange-700 transition-colors shadow-lg shadow-orange-600/20 text-sm"
            >
              <MapPin className="w-4 h-4" />
              Get Directions
              <ExternalLink className="w-3.5 h-3.5 ml-1" />
            </a>
          </div>

          {/* Bottom Floating Card */}
          <div className="absolute bottom-8 left-8 right-8 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xl">
             <p className="text-xs text-slate-700 italic mb-0">
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
  <div className="max-w-7xl mx-auto bg-white rounded-[2.5rem] md:rounded-[4rem] border border-slate-200 shadow-2xl shadow-slate-200/50 overflow-hidden">
    <div className="flex flex-col lg:flex-row">
      
      {/* Sidebar: The Brand/Identity */}
      <div className="lg:w-1/3 bg-slate-50 p-10 md:p-16 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-200">
        <div>
          <div className="inline-flex p-3 bg-white shadow-sm border border-amber-200 rounded-2xl mb-8">
            <ShieldCheck className="text-amber-600 w-8 h-8" />
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-[0.9] mb-6">
            The <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-br from-amber-500 to-orange-700">Kinyui             Standard.
 </span> <br />
          </h2>
          <p className="text-slate-700 font-medium leading-relaxed">
            Building men of integrity through structured discipline and mental resilience.
          </p>
        </div>

        <div className="mt-12 space-y-6">
          {([
            { label: 'Safety Rating', val: '100%' },
            { label: 'Ethics Standard', val: 'Best' }
          ]).map((stat, i) => (
            <div key={i} className="flex flex-col">
              <span className="text-3xl font-black text-slate-900">{stat.val}</span>
              <span className="text-[10px] uppercase tracking-widest text-amber-700 font-bold">{stat.label}</span>
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
            <h4 className="text-amber-700 font-black text-xs uppercase tracking-[0.2em] mb-3">Code of Conduct</h4>
            <h3 className="text-xl font-bold text-slate-900 mb-4 leading-tight">
              Standardizing Excellence through Discipline.
            </h3>
            <p className="text-slate-700 text-sm leading-relaxed">
              Our policies are designed to sharpen character. We uphold a strict code that transforms boys into responsible gentlemen, prioritizing academic focus and mutual respect.
            </p>
          </div>

          {/* Counselling */}
          <div className="group">
            <div className="w-12 h-1 bg-orange-500 mb-6 transition-all group-hover:w-20" />
            <h4 className="text-orange-700 font-black text-xs uppercase tracking-[0.2em] mb-3">Brotherhood Support</h4>
            <h3 className="text-xl font-bold text-slate-900 mb-4 leading-tight">
              Nurturing Minds for Global Leadership.
            </h3>
            <p className="text-slate-700 text-sm leading-relaxed">
              Beyond the books, we offer professional Guidance and Counselling to help every student navigate personal growth and emotional strength.
            </p>
          </div>
        </div>

        {/* Actions & Secondary Stats */}
        <div className="flex flex-col sm:flex-row items-center gap-4 pt-10 border-t border-slate-200">
          <Link href="/pages/OurSchoolPolicies" className="w-full sm:w-auto">
            <button className="w-full px-8 py-4 bg-slate-900 text-white font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-amber-600 transition-colors flex items-center justify-center gap-3">
              View School Rules <ArrowRight size={16} />
            </button>
          </Link>
          
          <Link href="/pages/Guidance-and-Councelling" className="w-full sm:w-auto">
            <button className="w-full px-8 py-4 bg-white text-slate-900 border border-slate-300 font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-slate-50 transition-colors">
             Sessions
            </button>
          </Link>

          <div className="flex gap-8 ml-auto xl:flex">
             <div className="text-right">
                <p className="text-2xl font-black text-slate-900">24/7</p>
                <p className="text-[9px] uppercase font-bold text-slate-600">Support</p>
             </div>
             <div className="text-right">
                <p className="text-2xl font-black text-slate-900">15+</p>
                <p className="text-[9px] uppercase font-bold text-slate-600">Mentors</p>
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