// Modern Loading Screen with Kinyui School Colors (Dark Maroon & Amber)
export default function LoadingScreen() {
  const [textIndex, setTextIndex] = useState(0);
  const [glowIntensity, setGlowIntensity] = useState(0);
  const [progress, setProgress] = useState(0);
  
  const motto = "Soaring to Excellence";
  const schoolName = "KINYUI BOYS' SENIOR SCHOOL";
  const loadingMessages = [
    "Preparing an exceptional learning experience",
    "Loading Admin Dashboard",
    "Securing your session",
    "Almost ready..."
  ];

  // Animated text effect
  useEffect(() => {
    const interval = setInterval(() => {
      setTextIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Pulsing glow effect
  useEffect(() => {
    const glowInterval = setInterval(() => {
      setGlowIntensity((prev) => (prev + 1) % 100);
    }, 50);
    return () => clearInterval(glowInterval);
  }, []);

  // Progress animation
  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 2;
      });
    }, 80);
    return () => clearInterval(progressInterval);
  }, []);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-maroon-950 via-maroon-900 to-amber-900 z-50 flex flex-col items-center justify-center overflow-hidden">
      
      {/* Dynamic Background Effect */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Animated Gradient Orbs - Maroon & Amber Colors */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-maroon-600/20 to-amber-500/20 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-maroon-700/20 to-amber-600/20 rounded-full blur-3xl animate-pulse-slow animation-delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-maroon-500/10 to-amber-500/10 rounded-full blur-3xl animate-spin-slow"></div>
        
        {/* Moving Light Beams - Maroon & Amber */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-amber-500 to-transparent animate-beam"></div>
          <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-maroon-500 to-transparent animate-beam animation-delay-500"></div>
          <div className="absolute left-0 top-0 w-px h-full bg-gradient-to-b from-transparent via-amber-600 to-transparent animate-beam-vertical"></div>
          <div className="absolute right-0 top-0 w-px h-full bg-gradient-to-b from-transparent via-maroon-600 to-transparent animate-beam-vertical animation-delay-300"></div>
        </div>

        {/* Subtle Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
        
        {/* Floating Particles - Amber & Gold */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-amber-400/40 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.2}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-2xl px-6">
        
        {/* Logo Container - Enhanced with Maroon & Amber */}
        <div className="relative mb-8 md:mb-10">
          {/* Glowing Background - School Colors */}
          <div 
            className="absolute inset-0 bg-gradient-to-r from-maroon-600 via-amber-500 to-maroon-700 rounded-full blur-2xl transition-all duration-300"
            style={{ 
              opacity: 0.3 + (glowIntensity / 100) * 0.3,
              transform: `scale(${1 + (glowIntensity / 100) * 0.1})`
            }}
          ></div>
          
          {/* Outer Ring Animation - Maroon & Amber */}
          <div className="absolute inset-0 rounded-full border-2 border-amber-500/30 animate-ping-slow"></div>
          <div className="absolute inset-2 rounded-full border-2 border-maroon-500/20 animate-spin-slow"></div>
          
          {/* Logo Container with Maroon/Amber Gradient */}
          <div className="relative w-28 h-28 md:w-36 md:h-36 rounded-full bg-gradient-to-br from-maroon-800 to-amber-700 p-1 shadow-2xl">
            <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-transparent to-white/10 pointer-events-none"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
              
              <img 
                src="/kinyui.png" 
                alt="Kinyui Boys Senior School Logo" 
                className="w-20 h-20 md:w-28 md:h-28 object-contain p-2 relative z-10"
              />
            </div>
          </div>
        </div>

        {/* School Name - Kinyui Branding */}
        <div className="text-center mb-5 md:mb-6">
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-black tracking-wider text-white drop-shadow-lg">
            {schoolName.split("'").map((part, i) => (
              <span key={i}>
                {part}
                {i === 0 && "'"}
              </span>
            ))}
          </h1>
          
          {/* Animated Gradient Underline - Amber */}
          <div className="relative mt-2">
            <div className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent animate-underline"></div>
          </div>
          
          <p className="text-amber-200 text-xs md:text-sm mt-3 tracking-wider font-semibold">
            EST. 1976 | CENTRE OF EXCELLENCE
          </p>
        </div>

        {/* Motto - School Motto */}
        <div className="text-center mb-8 md:mb-10">
          <p className="text-lg md:text-2xl lg:text-3xl font-bold italic tracking-wide text-amber-100">
            "{motto}"
          </p>
        </div>

        {/* Loading Indicators - Professional */}
        <div className="flex flex-col items-center gap-4 w-full max-w-md">
          
          {/* Progress Bar - Maroon & Amber Gradient */}
          <div className="w-full">
            <div className="relative h-1.5 bg-maroon-950/50 rounded-full overflow-hidden">
              <div 
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-maroon-600 via-amber-500 to-maroon-700 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
              </div>
            </div>
            <p className="text-right text-xs text-amber-300 mt-1 font-mono">
              {progress}%
            </p>
          </div>

          {/* Loading Message */}
          <div className="flex items-center gap-2 text-amber-100 text-sm md:text-base font-medium">
            <span>{loadingMessages[textIndex]}</span>
            <span className="flex gap-0.5">
              <span className="animate-bounce-dot" style={{ animationDelay: '0s' }}>.</span>
              <span className="animate-bounce-dot" style={{ animationDelay: '0.2s' }}>.</span>
              <span className="animate-bounce-dot" style={{ animationDelay: '0.4s' }}>.</span>
            </span>
          </div>

          {/* Loading Spinner Ring - Maroon & Amber */}
          <div className="relative w-8 h-8 md:w-10 md:h-10 mt-2">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="50%"
                cy="50%"
                r="45%"
                fill="none"
                stroke="#5C0010"
                strokeWidth="2"
                className="opacity-30"
              />
              <circle
                cx="50%"
                cy="50%"
                r="45%"
                fill="none"
                stroke="url(#gradient)"
                strokeWidth="2"
                strokeLinecap="round"
                className="animate-progress-ring"
                style={{
                  strokeDasharray: 283,
                  strokeDashoffset: `calc(283 - (283 * ${(Date.now() % 3000) / 3000}))`
                }}
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#800020" />
                  <stop offset="50%" stopColor="#D4AF37" />
                  <stop offset="100%" stopColor="#5C0010" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        {/* Decorative Bottom Bar - Maroon & Amber */}
        <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="w-1 h-1 rounded-full bg-gradient-to-r from-amber-500 to-maroon-600 animate-pulse"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>

      {/* Custom Animations */}
      <style jsx global>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.1); }
        }
        
        @keyframes beam {
          0% { transform: translateX(-100%); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateX(100%); opacity: 0; }
        }
        
        @keyframes beam-vertical {
          0% { transform: translateY(-100%); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(100%); opacity: 0; }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) translateX(0px); opacity: 0; }
          25% { transform: translateY(-20px) translateX(10px); opacity: 0.5; }
          50% { transform: translateY(-40px) translateX(-10px); opacity: 0.3; }
          75% { transform: translateY(-20px) translateX(5px); opacity: 0.2; }
        }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        @keyframes underline {
          0% { width: 0%; opacity: 0; left: 50%; }
          50% { width: 100%; opacity: 1; left: 0%; }
          100% { width: 0%; opacity: 0; left: 50%; }
        }
        
        @keyframes progress-ring {
          0% { stroke-dashoffset: 283; }
          100% { stroke-dashoffset: 0; }
        }
        
        @keyframes bounce-dot {
          0%, 100% { transform: translateY(0); opacity: 0.5; }
          50% { transform: translateY(-4px); opacity: 1; }
        }
        
        @keyframes ping-slow {
          0% { transform: scale(1); opacity: 0.3; }
          50% { transform: scale(1.1); opacity: 0.1; }
          100% { transform: scale(1); opacity: 0.3; }
        }
        
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
        
        .animate-ping-slow {
          animation: ping-slow 2s ease-in-out infinite;
        }
        
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
        
        .animation-delay-1000 {
          animation-delay: 1s;
        }
        
        .animation-delay-300 {
          animation-delay: 0.3s;
        }
        
        .animation-delay-500 {
          animation-delay: 0.5s;
        }
        
        .animate-beam {
          animation: beam 3s ease-in-out infinite;
        }
        
        .animate-beam-vertical {
          animation: beam-vertical 3s ease-in-out infinite;
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
        
        .animate-underline {
          animation: underline 2s ease-in-out infinite;
        }
        
        .animate-progress-ring {
          animation: progress-ring 2s linear infinite;
        }
        
        .animate-bounce-dot {
          animation: bounce-dot 0.6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}