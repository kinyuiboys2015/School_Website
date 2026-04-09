"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import dynamic from "next/dynamic";
import {
      <ScrollToTop />
    </div>
  );
}
              <div className="flex items-center gap-2">
                <BookOpen className="text-amber-900" size={18} />
                <span className="text-slate-700 font-bold">{totalIssues} Issues</span>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="text-amber-900" size={18} />
                <span className="text-slate-700 font-bold">{totalPages}+ Pages</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="text-amber-900" size={18} />
                <span className="text-slate-700 font-bold">{earliestYear} - {latestYear}</span>
              </div>
            </div>

            {/* Search & Filter */}
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  type="text"
                  placeholder="Search by year or keyword..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-100 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-amber-900 focus:ring-1 focus:ring-amber-900 transition-all"
                />
              </div>
              
              {/* Year Filter Dropdown */}
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="px-4 py-2 bg-slate-100 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-amber-900 cursor-pointer"
              >
                <option value="all">All Years</option>
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════ MAGAZINE GRID ═══════════════════════ */}
      <section className="py-16 px-4 sm:px-6 max-w-7xl mx-auto">
        {filteredMagazines.length === 0 ? (
          <div className="text-center py-20">
            <BookOpen className="mx-auto text-slate-300 mb-4" size={64} />
            <h3 className="text-xl font-bold text-slate-700 mb-2">No magazines found</h3>
            <p className="text-slate-500">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {filteredMagazines.map(issue => (
              <MagazineCard key={issue.id} issue={issue} onOpen={setSelectedIssue} />
            ))}
          </div>
        )}
      </section>

      {/* ═══════════════════════ FEATURE SECTION ═══════════════════════ */}
      <section className="py-16 px-4 sm:px-6 bg-gradient-to-br from-amber-50 to-orange-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900">Why Read Our Magazine?</h2>
            <p className="text-slate-600 mt-2">Every edition captures the essence of Kinyui Boys</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Trophy, title: "Achievements", desc: "Academic and sports excellence recognized" },
              { icon: Users, title: "Student Stories", desc: "Inspiring journeys of our young men" },
              { icon: Calendar, title: "Events Coverage", desc: "Memorable moments from school events" }
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="bg-white rounded-2xl p-6 text-center shadow-md">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-900 to-orange-600 flex items-center justify-center mx-auto mb-4">
                    <Icon className="text-white" size={24} />
                  </div>
                  <h3 className="font-black text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-slate-600 text-sm">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════ CTA SECTION ═══════════════════════ */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-br from-amber-600 to-orange-600 rounded-3xl p-10 shadow-2xl">
            <Sparkles className="text-white mx-auto mb-4" size={32} />
            <h2 className="text-2xl sm:text-3xl font-black text-white mb-3">
              Missing an Edition?
            </h2>
            <p className="text-amber-100 mb-6">
              Past magazines are being digitized. Check back soon for more issues!
            </p>
            <div className="inline-flex items-center gap-2 text-white/80 text-sm">
              <Clock size={14} />
              <span>New issues added annually after publication</span>
            </div>
          </div>
        </div>
      </section>

      {/* Book Reader Modal - Dynamically imported, only loads on client */}
      {selectedIssue && (
        <BookReader issue={selectedIssue} onClose={() => setSelectedIssue(null)} />
      )}

      {/* Scroll to Top */}
      <ScrollToTop />
    </div>
  );
}