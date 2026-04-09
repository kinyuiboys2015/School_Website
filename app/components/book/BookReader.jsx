"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  BookOpen, X, ChevronLeft, ChevronRight, Download, Maximize, Minimize,
  ZoomIn, ZoomOut, Heart, Share2, Bookmark, BookmarkCheck, Eye,
  ChevronDown, ChevronUp, Loader2, AlertCircle, Info
} from "lucide-react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { motion, AnimatePresence } from "framer-motion";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const BookReader = ({ issue, onClose }) => {
  const [numPages, setNumPages] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [scale, setScale] = useState(1.0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [direction, setDirection] = useState(0);
  const [pageWidth, setPageWidth] = useState(600);
  const [isFlipping, setIsFlipping] = useState(false);
  const [showScrollHint, setShowScrollHint] = useState(true);
  const [showThumbnails, setShowThumbnails] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [likesCount, setLikesCount] = useState(issue.likes || 0);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [showPageJump, setShowPageJump] = useState(false);
  const [jumpPage, setJumpPage] = useState("");
  
  const containerRef = useRef(null);
  const touchStartY = useRef(0);
  const thumbnailsRef = useRef(null);

  // Load saved interactions
  useEffect(() => {
    const savedBookmarks = JSON.parse(localStorage.getItem('bookmarked_magazines') || '[]');
    setIsBookmarked(savedBookmarks.includes(issue.id));
    
    const likedMagazines = JSON.parse(localStorage.getItem('liked_magazines') || '[]');
    setIsLiked(likedMagazines.includes(issue.id));
  }, [issue.id]);

  // Update page width on resize
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        const w = containerRef.current.clientWidth;
        setPageWidth(Math.min(w - 40, 900));
      }
    };
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKey = (e) => {
      switch(e.key) {
        case "ArrowRight":
        case " ":
          e.preventDefault();
          goNext();
          break;
        case "ArrowLeft":
          e.preventDefault();
          goPrev();
          break;
        case "Escape":
          onClose();
          break;
        case "f":
          toggleFullscreen();
          break;
        case "Home":
          e.preventDefault();
          jumpToPage(1);
          break;
        case "End":
          e.preventDefault();
          if (numPages) jumpToPage(numPages);
          break;
        default:
          break;
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [numPages, currentPage]);

  // Hide scroll hint after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowScrollHint(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  // Fullscreen handler
  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  // Lock body scroll and add wheel/touch listeners
  useEffect(() => {
    document.body.style.overflow = "hidden";
    const container = containerRef.current?.closest('.scroll-container');
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
      container.addEventListener('touchstart', handleTouchStart);
      container.addEventListener('touchend', handleTouchEnd);
    }
    return () => { 
      document.body.style.overflow = "";
      if (container) {
        container.removeEventListener('wheel', handleWheel);
        container.removeEventListener('touchstart', handleTouchStart);
        container.removeEventListener('touchend', handleTouchEnd);
      }
    };
  }, [currentPage, numPages, isFlipping]);

  const onDocumentLoadSuccess = ({ numPages: total }) => {
    setNumPages(total);
    setLoadingProgress(100);
  };

  const onDocumentLoadProgress = ({ loaded, total }) => {
    setLoadingProgress(Math.round((loaded / total) * 100));
  };

  const goNext = () => {
    if (numPages && currentPage < numPages && !isFlipping) {
      setIsFlipping(true);
      setDirection(1);
      setCurrentPage(p => p + 1);
      setTimeout(() => setIsFlipping(false), 500);
    }
  };

  const goPrev = () => {
    if (currentPage > 1 && !isFlipping) {
      setIsFlipping(true);
      setDirection(-1);
      setCurrentPage(p => p - 1);
      setTimeout(() => setIsFlipping(false), 500);
    }
  };

  const handleWheel = (e) => {
    if (isFlipping) return;
    const delta = e.deltaY;
    if (delta > 50 && currentPage < numPages) {
      e.preventDefault();
      goNext();
    } else if (delta < -50 && currentPage > 1) {
      e.preventDefault();
      goPrev();
    }
  };

  const handleTouchStart = (e) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e) => {
    if (isFlipping) return;
    const diff = touchStartY.current - e.changedTouches[0].clientY;
    if (diff > 50 && currentPage < numPages) goNext();
    else if (diff < -50 && currentPage > 1) goPrev();
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const handleLike = () => {
    const newLiked = !isLiked;
    setIsLiked(newLiked);
    setLikesCount(prev => newLiked ? prev + 1 : prev - 1);
    
    const likedMagazines = JSON.parse(localStorage.getItem('liked_magazines') || '[]');
    if (newLiked) {
      likedMagazines.push(issue.id);
    } else {
      const index = likedMagazines.indexOf(issue.id);
      if (index > -1) likedMagazines.splice(index, 1);
    }
    localStorage.setItem('liked_magazines', JSON.stringify(likedMagazines));
  };

  const handleBookmark = () => {
    const newBookmarked = !isBookmarked;
    setIsBookmarked(newBookmarked);
    
    const saved = JSON.parse(localStorage.getItem('bookmarked_magazines') || '[]');
    if (newBookmarked) {
      saved.push(issue.id);
    } else {
      const index = saved.indexOf(issue.id);
      if (index > -1) saved.splice(index, 1);
    }
    localStorage.setItem('bookmarked_magazines', JSON.stringify(saved));
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: issue.title,
          text: `Reading ${issue.title} magazine from Kinyui Boys!`,
          url: window.location.href
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const jumpToPage = (pageNum) => {
    if (pageNum >= 1 && pageNum <= (numPages || 1) && !isFlipping) {
      setIsFlipping(true);
      setDirection(pageNum > currentPage ? 1 : -1);
      setCurrentPage(pageNum);
      setTimeout(() => setIsFlipping(false), 500);
      setShowPageJump(false);
      setJumpPage("");
    }
  };

  const handleJumpSubmit = (e) => {
    e.preventDefault();
    const pageNum = parseInt(jumpPage);
    if (!isNaN(pageNum)) jumpToPage(pageNum);
  };

  const progress = numPages ? (currentPage / numPages) * 100 : 0;

  const pageVariants = {
    enter: (dir) => ({ 
      x: dir > 0 ? "100%" : "-100%", 
      opacity: 0, 
      rotateY: dir > 0 ? -30 : 30,
      scale: 0.95
    }),
    center: { 
      x: 0, 
      opacity: 1, 
      rotateY: 0,
      scale: 1,
      transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] }
    },
    exit: (dir) => ({ 
      x: dir > 0 ? "-100%" : "100%", 
      opacity: 0, 
      rotateY: dir > 0 ? 30 : -30,
      scale: 0.95,
      transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] }
    }),
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#1a1a2e] flex flex-col">
      {/* Header */}
      <div className="bg-[#16213e]/95 backdrop-blur-lg border-b border-white/10 px-3 sm:px-4 py-2 sm:py-3 flex items-center justify-between shrink-0 z-30">
        <div className="flex items-center gap-2 sm:gap-3">
          <button 
            onClick={onClose} 
            className="p-1.5 sm:p-2 rounded-lg bg-white/10 transition-colors hover:bg-white/20 active:scale-95"
          >
            <X className="text-white" size={18} />
          </button>
          <div className="h-5 w-px bg-white/20" />
          <BookOpen className="text-amber-400" size={16} />
          <span className="text-white font-bold text-xs sm:text-sm truncate max-w-[120px] sm:max-w-md">
            {issue.title} — {issue.year}
          </span>
        </div>
        
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Like Button */}
          <button
            onClick={handleLike}
            className={`p-1.5 sm:p-2 rounded-lg transition-all ${isLiked ? 'text-red-500 bg-red-500/20' : 'text-white/70 hover:text-red-500 hover:bg-white/10'}`}
          >
            <Heart size={16} fill={isLiked ? "currentColor" : "none"} />
          </button>
          
          {/* Bookmark Button */}
          <button
            onClick={handleBookmark}
            className={`p-1.5 sm:p-2 rounded-lg transition-all ${isBookmarked ? 'text-amber-400 bg-amber-400/20' : 'text-white/70 hover:text-amber-400 hover:bg-white/10'}`}
          >
            {isBookmarked ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
          </button>
          
          {/* Share Button */}
          <button
            onClick={handleShare}
            className="p-1.5 sm:p-2 rounded-lg text-white/70 hover:text-blue-400 hover:bg-white/10 transition-all"
          >
            <Share2 size={16} />
          </button>

          {/* Zoom Controls */}
          <div className="hidden sm:flex items-center gap-1 bg-white/10 rounded-lg px-1 py-0.5">
            <button onClick={() => setScale(s => Math.max(0.5, s - 0.1))} className="p-1 rounded transition-colors hover:bg-white/20">
              <ZoomOut size={14} className="text-white/70" />
            </button>
            <span className="text-white/70 text-xs w-10 text-center">{Math.round(scale * 100)}%</span>
            <button onClick={() => setScale(s => Math.min(2, s + 0.1))} className="p-1 rounded transition-colors hover:bg-white/20">
              <ZoomIn size={14} className="text-white/70" />
            </button>
          </div>

          {/* Download Button */}
          <a 
            href={issue.pdfUrl} 
            download 
            className="px-2 sm:px-3 py-1 sm:py-1.5 bg-gradient-to-r from-amber-600 to-orange-600 text-white text-xs sm:text-sm font-bold rounded-lg flex items-center gap-1 sm:gap-2 transition-all hover:shadow-lg active:scale-95"
          >
            <Download size={12} />
            <span className="hidden sm:inline">Download</span>
          </a>

          {/* Fullscreen Toggle */}
          <button 
            onClick={toggleFullscreen} 
            className="p-1.5 sm:p-2 rounded-lg bg-white/10 transition-colors hover:bg-white/20 active:scale-95"
          >
            {isFullscreen ? <Minimize size={16} className="text-white" /> : <Maximize size={16} className="text-white" />}
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="h-0.5 bg-white/5 shrink-0">
        <motion.div 
          className="h-full bg-gradient-to-r from-amber-600 to-orange-600 rounded-r-full" 
          animate={{ width: `${progress}%` }} 
          transition={{ duration: 0.4, ease: "easeOut" }} 
        />
      </div>

      {/* Main Content */}
      <div className="scroll-container flex-1 relative overflow-hidden">
        {/* Navigation Buttons */}
        <button 
          onClick={goPrev} 
          disabled={currentPage <= 1 || isFlipping} 
          className={`absolute left-1 sm:left-4 top-1/2 -translate-y-1/2 z-20 p-2 sm:p-3 rounded-full bg-black/50 backdrop-blur-sm transition-all hover:bg-black/70 active:scale-95 ${
            currentPage <= 1 || isFlipping ? "opacity-30 cursor-not-allowed" : "opacity-80 hover:opacity-100"
          }`}
        >
          <ChevronLeft size={18} className="sm:w-5 sm:h-5 text-white" />
        </button>

        <button 
          onClick={goNext} 
          disabled={!numPages || currentPage >= numPages || isFlipping} 
          className={`absolute right-1 sm:right-4 top-1/2 -translate-y-1/2 z-20 p-2 sm:p-3 rounded-full bg-black/50 backdrop-blur-sm transition-all hover:bg-black/70 active:scale-95 ${
            !numPages || currentPage >= numPages || isFlipping ? "opacity-30 cursor-not-allowed" : "opacity-80 hover:opacity-100"
          }`}
        >
          <ChevronRight size={18} className="sm:w-5 sm:h-5 text-white" />
        </button>

        {/* Scroll Hint */}
        <AnimatePresence>
          {showScrollHint && (
            <motion.div 
              className="absolute bottom-20 left-1/2 -translate-x-1/2 z-30 pointer-events-none"
              initial={{ opacity: 1, y: 0 }}
              animate={{ opacity: 0.8, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.5 }}
            >
              <div className="bg-black/60 backdrop-blur-sm rounded-full px-3 sm:px-4 py-1.5 sm:py-2 flex flex-col items-center gap-1 text-white/90 text-[10px] sm:text-xs">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
                <span className="whitespace-nowrap">Scroll to flip page</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Page Info */}
        <div className="absolute top-4 right-4 z-20 bg-black/50 backdrop-blur-sm rounded-full px-2 sm:px-3 py-0.5 sm:py-1">
          <button onClick={() => setShowPageJump(true)} className="flex items-center gap-1">
            <span className="text-white text-xs sm:text-sm font-medium">
              {currentPage} / {numPages || "..."}
            </span>
            <ChevronDown size={12} className="text-white/60" />
          </button>
        </div>

        {/* Page Jump Modal */}
        <AnimatePresence>
          {showPageJump && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center"
              onClick={() => setShowPageJump(false)}
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                className="bg-white rounded-xl p-5 w-80"
                onClick={e => e.stopPropagation()}
              >
                <h3 className="font-bold text-slate-800 mb-3">Jump to Page</h3>
                <form onSubmit={handleJumpSubmit}>
                  <input
                    type="number"
                    min={1}
                    max={numPages}
                    value={jumpPage}
                    onChange={e => setJumpPage(e.target.value)}
                    placeholder={`Enter page number (1-${numPages})`}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg mb-3 focus:outline-none focus:border-amber-500"
                    autoFocus
                  />
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setShowPageJump(false)}
                      className="flex-1 px-3 py-2 bg-slate-100 text-slate-700 rounded-lg font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-3 py-2 bg-amber-600 text-white rounded-lg font-medium"
                    >
                      Go
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* PDF Viewer */}
        <div 
          ref={containerRef}
          className="w-full h-full flex items-center justify-center p-2 sm:p-4"
          style={{ perspective: 1500 }}
        >
          <div className="relative w-full max-w-5xl mx-auto">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div 
                key={currentPage} 
                custom={direction} 
                variants={pageVariants} 
                initial="enter" 
                animate="center" 
                exit="exit" 
                className="bg-white rounded-lg shadow-2xl shadow-black/50 overflow-hidden mx-auto"
                style={{ transformStyle: "preserve-3d", maxWidth: "100%", width: "fit-content" }}
              >
                <Document 
                  file={issue.pdfUrl} 
                  onLoadSuccess={onDocumentLoadSuccess} 
                  onLoadProgress={onDocumentLoadProgress}
                  loading={
                    <div className="flex flex-col items-center justify-center py-32 px-8 sm:px-16">
                      <Loader2 className="w-8 h-8 sm:w-10 sm:h-10 text-amber-600 animate-spin mb-3" />
                      <p className="text-slate-500 text-xs sm:text-sm">Loading magazine... {loadingProgress}%</p>
                    </div>
                  } 
                  error={
                    <div className="flex flex-col items-center justify-center py-32 px-8 sm:px-16">
                      <AlertCircle className="w-10 h-10 text-red-500 mb-3" />
                      <p className="text-red-500 text-xs sm:text-sm font-medium">Failed to load PDF</p>
                      <p className="text-slate-400 text-xs mt-1">Please try again or contact support</p>
                    </div>
                  }
                >
                  <Page 
                    pageNumber={currentPage} 
                    width={Math.min(pageWidth * scale, window.innerWidth - 30)} 
                    renderTextLayer={true} 
                    renderAnnotationLayer={true}
                  />
                </Document>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-[#16213e]/95 backdrop-blur-lg border-t border-white/10 px-3 sm:px-4 py-2 sm:py-3 flex items-center justify-between shrink-0 z-30">
        <button
          onClick={goPrev}
          disabled={currentPage <= 1 || isFlipping}
          className={`px-2 sm:px-4 py-1 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all active:scale-95 ${
            currentPage <= 1 || isFlipping 
              ? "bg-white/5 text-white/30 cursor-not-allowed" 
              : "bg-white/10 text-white hover:bg-white/20"
          }`}
        >
          ← Prev
        </button>

        <div className="flex items-center gap-2 sm:gap-4">
          <span className="text-white/50 text-[10px] sm:text-sm">Page</span>
          <div className="flex items-center gap-1">
            <input 
              type="number" 
              min={1} 
              max={numPages || 1} 
              value={currentPage} 
              onChange={(e) => jumpToPage(parseInt(e.target.value))} 
              className="w-12 sm:w-16 text-center bg-white/10 border border-white/20 rounded-lg text-white text-xs sm:text-sm py-1 focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600"
              disabled={isFlipping}
            />
            <span className="text-white/50 text-[10px] sm:text-sm">of {numPages || "..."}</span>
          </div>
        </div>

        <button
          onClick={goNext}
          disabled={!numPages || currentPage >= numPages || isFlipping}
          className={`px-2 sm:px-4 py-1 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all active:scale-95 ${
            !numPages || currentPage >= numPages || isFlipping
              ? "bg-white/5 text-white/30 cursor-not-allowed" 
              : "bg-white/10 text-white hover:bg-white/20"
          }`}
        >
          Next →
        </button>
      </div>

      {/* Page Flip Effect Overlay */}
      {isFlipping && (
        <div className="absolute inset-0 pointer-events-none z-50">
          <div className={`absolute inset-0 bg-gradient-to-r ${direction > 0 ? 'from-white/20 to-transparent' : 'to-white/20 from-transparent'} animate-pulse`} />
        </div>
      )}
    </div>
  );
};

export default BookReader;