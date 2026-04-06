"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  BookOpen, Calendar, X, ChevronLeft, ChevronRight,
  Download, Eye, Search, TrendingUp, Users, Trophy,
  Sparkles, Clock, Maximize, Minimize, ArrowUp, Star, Newspaper, FileText, Compass, Target, Zap
} from "lucide-react";
import Image from "next/image";

// ============================================================
// 1. SCROLL TO TOP COMPONENT
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
      className="fixed bottom-6 right-6 p-3 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full shadow-lg z-[60] hover:shadow-xl transition-all active:scale-95"
    >
      <ArrowUp className="text-white" size={24} />
    </button>
  );
};

// ============================================================
// 2. MAGAZINE DATA (ANNUAL ARCHIVE)
// ============================================================
const magazineData = [
  {
    id: "2024-annual",
    title: "The Kinyui Echo",
    year: 2024,
    coverImage: "/magazine/kbss.png",
    description: "Celebrating a year of academic excellence, sports achievements, and infrastructural growth. This edition highlights the KCSE top performers, new science labs, and the school's journey toward greatness.",
    featured: true,
    pdfUrl: "/magazine/kinyui.pdf", // LOWERCASE PATH TO PREVENT 404
    pageCount: 48,
    highlights: ["KCSE Excellence", "New Lab Launch", "Sports Gala"]
  },
  {
    id: "2023-annual",
    title: "The Kinyui Echo",
    year: 2023,
    coverImage: "/magazine/kbss.png",
    description: "A look back at a transformative year featuring the inauguration of the new computer lab, cultural day celebrations, and student achievements in science congress competitions.",
    featured: false,
    pdfUrl: "/magazine/kinyui.pdf", // LOWERCASE PATH TO PREVENT 404
    pageCount: 44,
    highlights: ["Computer Lab", "Cultural Day", "Science Congress"]
  }
];

// ============================================================
// 3. PDF VIEWER MODAL COMPONENT
// ============================================================
const PDFViewer = ({ issue, onClose }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const iframeRef = useRef(null);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950 flex flex-col animate-in fade-in duration-300">
      {/* Header Bar */}
      <div className="bg-slate-900 border-b border-white/10 px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-white/10 rounded-full text-white transition-colors"
            title="Close Reader"
          >
            <X size={24} />
          </button>
          <div className="h-8 w-px bg-white/10" />
          <div>
            <h2 className="text-white font-black text-sm md:text-base leading-none">
              {issue.title} {issue.year}
            </h2>
            <p className="text-slate-400 text-[10px] uppercase tracking-widest mt-1">
              Annual Edition • {issue.pageCount} Pages
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a
            href={issue.pdfUrl}
            download
            className="hidden sm:flex items-center gap-2 px-5 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-black rounded-xl transition-all shadow-lg shadow-amber-500/20"
          >
            <Download size={14} /> DOWNLOAD PDF
          </a>
          <button 
            onClick={toggleFullscreen} 
            className="p-2 hover:bg-white/10 rounded-lg text-white transition-colors"
          >
            {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
          </button>
        </div>
      </div>

      {/* Actual Iframe Viewer */}
      <div className="flex-1 bg-slate-800 overflow-hidden relative">
        <iframe
          ref={iframeRef}
          src={`${issue.pdfUrl}#toolbar=1&navpanes=0`}
          className="w-full h-full border-none shadow-2xl"
          title={`${issue.title} ${issue.year}`}
        />
      </div>
      
      {/* Mobile Download Bar */}
      <div className="sm:hidden p-4 bg-slate-900 border-t border-white/10">
        <a
          href={issue.pdfUrl}
          download
          className="w-full flex items-center justify-center gap-2 py-3 bg-amber-500 text-white text-sm font-black rounded-xl"
        >
          <Download size={16} /> DOWNLOAD MAGAZINE
        </a>
      </div>
    </div>
  );
};

// ============================================================
// 4. MAGAZINE CARD COMPONENT
// ============================================================
const MagazineCard = ({ issue, onOpen }) => {
  return (
    <div className="group bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-slate-100 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2">
      {/* Cover Image Section */}
      <div className="relative aspect-[3/4] overflow-hidden">
        <Image
          src={issue.coverImage}
          alt={issue.title}
          fill
          className="object-cover transition-transform duration-1000 group-hover:scale-110"
        />
        
        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
        
        {/* Latest Badge */}
        {issue.featured && (
          <div className="absolute top-6 left-6">
            <span className="bg-amber-500 text-white text-[10px] font-black px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-xl">
              <Star size={10} fill="currentColor" /> LATEST ISSUE
            </span>
          </div>
        )}

        {/* Year Badge */}
        <div className="absolute top-6 right-6 bg-white/95 backdrop-blur-md px-4 py-2 rounded-2xl shadow-xl">
          <span className="text-slate-900 font-black text-xl">{issue.year}</span>
        </div>

        {/* Bottom Text */}
        <div className="absolute bottom-8 left-8 right-8">
          <p className="text-amber-400 text-[10px] font-black uppercase tracking-[0.3em] mb-2">The Kinyui Way</p>
          <h3 className="text-white font-black text-3xl leading-none tracking-tighter mb-2 italic">
            {issue.title}
          </h3>
          <div className="flex items-center gap-4 text-white/60 text-xs font-bold">
             <span className="flex items-center gap-1"><FileText size={12}/> {issue.pageCount} Pages</span>
             <span className="flex items-center gap-1"><Clock size={12}/> Annual Archive</span>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-8">
        <p className="text-slate-500 text-sm leading-relaxed mb-6 line-clamp-3 font-medium">
          {issue.description}
        </p>
        
        <div className="flex flex-wrap gap-2 mb-8">
          {issue.highlights.map((h, i) => (
            <span key={i} className="px-3 py-1 bg-slate-50 border border-slate-100 rounded-lg text-[10px] font-black text-slate-400 uppercase tracking-wider">
              {h}
            </span>
          ))}
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => onOpen(issue)}
            className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-amber-600 transition-all shadow-lg active:scale-95"
          >
            <Eye size={18} /> Read Online
          </button>
          <a
            href={issue.pdfUrl}
            download
            className="w-14 h-14 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center hover:bg-amber-50 hover:text-amber-600 transition-all border border-slate-100"
            title="Download PDF"
          >
            <Download size={20} />
          </a>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// 5. MAIN PAGE COMPONENT
// ============================================================
export default function MagazinePage() {
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredMagazines = magazineData.filter(issue => 
    issue.year.toString().includes(searchQuery) || 
    issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    issue.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white min-h-screen font-sans selection:bg-amber-100 selection:text-amber-900">
      
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden bg-slate-950">
        <Image 
          src="/hero/katz8.jpeg" 
          alt="School Archive" 
          fill 
          className="object-cover opacity-50 scale-105" 
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
        
        <div className="relative z-10 text-center px-4 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white text-[10px] font-black uppercase tracking-[0.4em] mb-8">
            <Newspaper size={14} className="text-amber-400" /> Kinyui Boys Archive
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter leading-[0.85] mb-6">
            THE <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">KINYUI ECHO</span>
          </h1>
          <p className="text-slate-300 font-medium text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Preserving our history, celebrating our growth, and documenting the journey of every student since inception.
          </p>
        </div>
      </section>

      {/* Control Bar (Search & Stats) */}
      <div className="max-w-7xl mx-auto px-4 -translate-y-12 relative z-30">
        <div className="bg-white p-6 md:p-8 rounded-[3rem] shadow-2xl border border-slate-100 flex flex-col md:flex-row gap-6 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
            <input 
              type="text"
              placeholder="Search archives (e.g., '2024' or 'sports')..."
              className="w-full pl-16 pr-8 py-5 bg-slate-50 rounded-[2rem] focus:outline-none focus:ring-4 focus:ring-amber-500/10 border-2 border-transparent focus:border-amber-500 transition-all font-medium text-slate-700"
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex gap-8 px-4 border-l border-slate-100 hidden lg:flex">
             <div className="text-center">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Issues</p>
                <p className="text-2xl font-black text-slate-900">{magazineData.length}</p>
             </div>
             <div className="text-center">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Pages</p>
                <p className="text-2xl font-black text-slate-900">92+</p>
             </div>
          </div>
        </div>
      </div>

      {/* Magazine Grid */}
      <section className="max-w-7xl mx-auto py-12 md:py-24 px-4 sm:px-6">
        {filteredMagazines.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {filteredMagazines.map(issue => (
              <MagazineCard key={issue.id} issue={issue} onOpen={setSelectedIssue} />
            ))}
          </div>
        ) : (
          <div className="text-center py-32 bg-slate-50 rounded-[4rem] border-2 border-dashed border-slate-200">
            <Compass size={64} className="mx-auto text-slate-200 mb-6 animate-spin-slow" />
            <h3 className="text-2xl font-black text-slate-900">Archive Not Found</h3>
            <p className="text-slate-500 mt-2 font-medium">We couldn't find an edition matching "{searchQuery}"</p>
            <button 
              onClick={() => setSearchQuery('')}
              className="mt-6 text-amber-600 font-bold underline"
            >
              Show all editions
            </button>
          </div>
        )}
      </section>

      {/* Features Info Section */}
      <section className="py-24 bg-slate-950 rounded-t-[4rem] md:rounded-t-[6rem] text-white overflow-hidden relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-amber-500 to-transparent opacity-30" />
        
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-16 text-center">
           {[
             { icon: Trophy, title: "Academic Glory", desc: "Recognizing the top minds and KCSE champions of every year." },
             { icon: Users, title: "Community", desc: "Stories from teachers, students, and our distinguished alumni." },
             { icon: Target, title: "Our Mission", desc: "How we continue to lead in Machakos County and beyond." }
           ].map((item, i) => (
             <div key={i} className="flex flex-col items-center">
               <div className="w-16 h-16 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center mb-8 text-amber-500">
                  <item.icon size={32} />
               </div>
               <h4 className="text-xl font-black mb-4 uppercase tracking-tighter">{item.title}</h4>
               <p className="text-slate-400 leading-relaxed font-medium">{item.desc}</p>
             </div>
           ))}
        </div>
      </section>

      {/* PDF Viewer Overlay */}
      {selectedIssue && (
        <PDFViewer 
          issue={selectedIssue} 
          onClose={() => setSelectedIssue(null)} 
        />
      )}

      {/* Utilities */}
      <ScrollToTop />
    </div>
  );
}