"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  BookOpen, X, ChevronLeft, ChevronRight,
  Download, Maximize, Minimize, ZoomIn, ZoomOut,
} from "lucide-react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { motion, AnimatePresence } from "framer-motion";

// Set worker source for PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const BookReader = ({ issue, onClose }) => {
  const [numPages, setNumPages] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [scale, setScale] = useState(1.0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [direction, setDirection] = useState(0);
  const [pageWidth, setPageWidth] = useState(600);
  const containerRef = useRef(null);

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        const w = containerRef.current.clientWidth;
        setPageWidth(Math.min(w - 40, 800));
      }
    };
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        goNext();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        goPrev();
      } else if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  });

  const onDocumentLoadSuccess = ({ numPages: total }) => {
    setNumPages(total);
  };

  const goNext = () => {
    if (numPages && currentPage < numPages) {
      setDirection(1);
      setCurrentPage((p) => p + 1);
    }
  };

  const goPrev = () => {
    if (currentPage > 1) {
      setDirection(-1);
      setCurrentPage((p) => p - 1);
    }
  };

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
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const pageVariants = {
    enter: (dir) => ({ x: dir > 0 ? 300 : -300, opacity: 0, rotateY: dir > 0 ? -15 : 15 }),
    center: { x: 0, opacity: 1, rotateY: 0 },
    exit: (dir) => ({ x: dir > 0 ? -300 : 300, opacity: 0, rotateY: dir > 0 ? 15 : -15 }),
  };

  const progress = numPages ? (currentPage / numPages) * 100 : 0;

  return (
    <div className="fixed inset-0 z-50 bg-[#1a1a2e] flex flex-col">
      <div className="bg-[#16213e]/90 backdrop-blur-lg border-b border-white/10 px-4 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={onClose} className="p-2 rounded-lg bg-white/10 transition-colors">
            <X className="text-white" size={20} />
          </button>
          <div className="h-6 w-px bg-white/20" />
          <BookOpen className="text-amber-400" size={18} />
          <span className="text-white font-bold text-sm sm:text-base truncate max-w-[200px] sm:max-w-none">
            {issue.title} — {issue.year}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1 bg-white/10 rounded-lg px-2 py-1">
            <button onClick={() => setScale((s) => Math.max(0.5, s - 0.15))} className="p-1 rounded transition-colors">
              <ZoomOut size={16} className="text-white/70" />
            </button>
            <span className="text-white/70 text-xs w-10 text-center">{Math.round(scale * 100)}%</span>
            <button onClick={() => setScale((s) => Math.min(2, s + 0.15))} className="p-1 rounded transition-colors">
              <ZoomIn size={16} className="text-white/70" />
            </button>
          </div>
          <a href={issue.pdfUrl} download className="px-3 py-1.5 bg-gradient-to-r from-amber-600 to-orange-600 text-white text-xs sm:text-sm font-bold rounded-lg flex items-center gap-2 transition-all">
            <Download size={14} />
            <span className="hidden sm:inline">Download</span>
          </a>
          <button onClick={toggleFullscreen} className="p-2 rounded-lg bg-white/10 transition-colors">
            {isFullscreen ? <Minimize size={18} className="text-white" /> : <Maximize size={18} className="text-white" />}
          </button>
        </div>
      </div>
      <div className="h-1 bg-white/5 shrink-0">
        <motion.div className="h-full bg-gradient-to-r from-amber-600 to-orange-600 rounded-r-full" animate={{ width: `${progress}%` }} transition={{ duration: 0.4, ease: "easeOut" }} />
      </div>
      <div ref={containerRef} className="flex-1 flex items-center justify-center relative overflow-hidden">
        <button onClick={goPrev} disabled={currentPage <= 1} className={`absolute left-2 sm:left-6 z-20 p-2 sm:p-3 rounded-full bg-white/10 backdrop-blur-sm transition-all ${currentPage <= 1 ? "opacity-20 cursor-not-allowed" : "opacity-70 active:scale-90"}`}>
          <ChevronLeft size={24} className="text-white" />
        </button>
        <div className="flex items-center justify-center" style={{ perspective: 1200 }}>
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div key={currentPage} custom={direction} variants={pageVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }} className="bg-white rounded-lg shadow-2xl shadow-black/50 overflow-hidden">
              <Document file={issue.pdfUrl} onLoadSuccess={onDocumentLoadSuccess} loading={<div className="flex flex-col items-center justify-center py-32 px-20"><div className="w-10 h-10 border-3 border-amber-600/30 border-t-amber-600 rounded-full animate-spin mb-4" /><p className="text-slate-500 text-sm">Loading magazine...</p></div>} error={<div className="flex flex-col items-center justify-center py-32 px-20"><p className="text-red-500 text-sm">Failed to load PDF</p></div>}>
                <Page pageNumber={currentPage} width={pageWidth * scale} renderTextLayer={true} renderAnnotationLayer={true} />
              </Document>
            </motion.div>
          </AnimatePresence>
        </div>
        <button onClick={goNext} disabled={!numPages || currentPage >= numPages} className={`absolute right-2 sm:right-6 z-20 p-2 sm:p-3 rounded-full bg-white/10 backdrop-blur-sm transition-all ${!numPages || currentPage >= numPages ? "opacity-20 cursor-not-allowed" : "opacity-70 active:scale-90"}`}>
          <ChevronRight size={24} className="text-white" />
        </button>
      </div>
      <div className="bg-[#16213e]/90 backdrop-blur-lg border-t border-white/10 px-4 py-3 flex items-center justify-center gap-4 shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-white/60 text-sm">Page</span>
          <input type="number" min={1} max={numPages || 1} value={currentPage} onChange={(e) => { const val = parseInt(e.target.value); if (val >= 1 && val <= (numPages || 1)) { setDirection(val > currentPage ? 1 : -1); setCurrentPage(val); } }} className="w-14 text-center bg-white/10 border border-white/20 rounded-lg text-white text-sm py-1 focus:outline-none focus:border-amber-600" />
          <span className="text-white/60 text-sm">of {numPages || "..."}</span>
        </div>
      </div>
    </div>
  );
};

export default BookReader;