'use client';
import { FiRefreshCw, FiArrowRight, FiTrendingUp, FiFileText, FiCheckCircle } from 'react-icons/fi';

const PortalHeader = ({
  stats = { today: 10 },
  refreshing = false,
  fetchEvents = () => {},
  handleNewEvent = () => {},
}) => {
  const handleRefresh = () => {
    if (refreshing) return;
    fetchEvents(true);
    window.location.reload();
  };

  return (
    <header className="w-full font-sans">
      <div className="relative bg-white border-b border-gray-100">
        {/* Left accent stripe */}
        <div className="absolute left-0 top-0 bottom-0 w-1.5 sm:w-2 bg-gradient-to-b from-blue-600 via-indigo-600 to-blue-700" />

        <div className="max-w-7xl mx-auto pl-6 sm:pl-8 lg:pl-10 pr-4 sm:pr-6 lg:pr-8 py-5 sm:py-7 lg:py-9">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5 lg:gap-8">

            {/* ── Left ── */}
            <div className="flex-1 min-w-0">
              {/* Tag row */}
              <div className="flex flex-wrap items-center gap-2 mb-3 sm:mb-4">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 border border-blue-100 rounded-md">
                  <FiFileText className="w-3 h-3 text-blue-600" />
                  <span className="text-[10px] sm:text-xs font-bold text-blue-700 uppercase tracking-[0.12em]">
                    Admissions Portal
                  </span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 border border-emerald-100 rounded-md">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] sm:text-xs font-bold text-emerald-700">Open</span>
                </span>
              </div>

              {/* Title block */}
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 tracking-tight leading-[1.08]">
                Kinyui Boys
                <br className="hidden sm:block" />{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                  Senior School
                </span>
              </h1>

              <p className="mt-2.5 sm:mt-3 text-sm sm:text-base text-gray-500 max-w-md leading-relaxed">
                Secure digital gateway for student applications &amp; admission coordination.
                Shaping leaders since 1976.
              </p>

              {/* Motto + social proof — horizontal strip */}
              <div className="mt-4 sm:mt-5 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5">
                {/* Motto */}
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-50 border border-gray-100 rounded-lg w-fit">
                  <span className="text-sm">🦅</span>
                  <span className="text-xs font-bold text-gray-600 tracking-wide">
                    Soaring to Excellence
                  </span>
                </div>

                {/* Divider (desktop only) */}
                <div className="hidden sm:block w-px h-6 bg-gray-200" />

                {/* Social proof */}
                <div className="flex items-center gap-2.5">
                  <div className="flex -space-x-1.5">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <div
                        key={n}
                        className="w-6 h-6 sm:w-7 sm:h-7 rounded-full border-[1.5px] border-white bg-gray-200 overflow-hidden shadow-sm hover:-translate-y-0.5 transition-transform"
                      >
                        <img
                          src={`/demo/${n}.jpg`}
                          alt={`Student ${n}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                    <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full border-[1.5px] border-white bg-blue-600 flex items-center justify-center shadow-sm">
                      <span className="text-[8px] sm:text-[9px] font-black text-white">400+</span>
                    </div>
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] sm:text-xs font-bold text-gray-700 flex items-center gap-1 truncate">
                      400+ Students Enrolled
                      <FiTrendingUp className="w-3 h-3 text-emerald-500 flex-shrink-0" />
                    </p>
                  </div>
                </div>
              </div>
            </div>

      {/* ── Right ── */}
<div className="flex flex-col sm:flex-col lg:flex-col gap-3 w-full lg:w-auto flex-shrink-0">
  
  {/* Stats card */}
  <div className="w-full bg-gray-50 border border-gray-100 rounded-xl p-3 sm:p-4 flex items-center gap-3">
    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
      <FiCheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
    </div>

    <div className="min-w-0">
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide truncate">
        Today&apos;s Applications
      </p>
      <p className="text-lg sm:text-xl font-black text-gray-900 leading-none mt-0.5">
        {stats.today || 0}
      </p>
    </div>
  </div>

  {/* Action row */}
  <div className="flex flex-col sm:flex-row gap-2 w-full">
    
    {/* Refresh */}
    <button
      onClick={handleRefresh}
      disabled={refreshing}
      title="Refresh Portal"
      className="w-full sm:w-auto flex items-center justify-center p-2.5 sm:p-3 rounded-xl border border-gray-200 text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50 transition active:scale-95 disabled:opacity-30"
    >
      <FiRefreshCw
        className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`}
      />
    </button>

    {/* CTA */}
    <button
      onClick={handleNewEvent}
      className="w-full sm:flex-1 flex items-center justify-center gap-2 px-4 py-2.5 sm:py-3 bg-gray-900 text-white rounded-xl font-semibold text-xs sm:text-sm hover:bg-black transition active:scale-[0.97]"
    >
      <span className="sm:hidden">APPLY NOW</span>
      <span className="hidden sm:inline">START APPLICATION</span>
      <FiArrowRight className="w-3.5 h-3.5" />
    </button>

  </div>
</div>

          </div>
        </div>
      </div>
    </header>
  );
};

export default PortalHeader;