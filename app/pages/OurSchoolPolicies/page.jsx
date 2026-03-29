"use client";

import React, { useState, useRef } from "react";
import {
  FiSearch, FiChevronLeft, FiChevronRight,
  FiShield, FiBook, FiUsers, FiHome, FiClock, FiActivity, FiHeart,
  FiAlertTriangle, FiDollarSign, FiPhone, FiMail, FiMapPin, FiArrowUp,
  FiX, FiCheckCircle, FiBookOpen, FiAward, FiTarget, FiStar
} from "react-icons/fi";

const allTerms = [
  {
    id: 1,
    title: "Registration & Admission",
    icon: FiBookOpen,
    color: "from-blue-600 to-blue-800",
    intro: "Kinyui Boys High School maintains high admission standards to ensure quality education and student success.",
    subSections: [
      { subTitle: "Entry Requirements", content: "Admission to Form 1 requires a minimum KCPE score of 250 marks. Transfer students must present original leaving certificate and report from previous school." },
      { subTitle: "Registration Documents", content: "Original birth certificate, KCPE result slip, transfer letter, baptism card (optional), and 4 passport photos must be submitted on reporting day." },
      { subTitle: "Reporting Day", content: "Form 1 students report on the date specified in admission letter. Reporting time: 8:00 AM - 12:00 PM. Late reporting requires prior approval." }
    ]
  },
  {
    id: 2,
    title: "Academics & Attendance",
    icon: FiBook,
    color: "from-emerald-600 to-emerald-800",
    intro: "Academic excellence is the core mandate of Kinyui Boys High School, and students must demonstrate commitment to their studies.",
    subSections: [
      { subTitle: "Attendance", content: "Minimum class attendance: 90%. Any absence requires a written explanation from parent/guardian. Absence exceeding 3 days needs a doctor's note." },
      { subTitle: "Academic Performance", content: "Students must maintain a mean grade of C plain and above. Those scoring below D+ in two subjects attend mandatory holiday tuition." },
      { subTitle: "Study Hours", content: "Preps: Morning 5:30 AM - 6:30 AM, Evening 7:00 PM - 9:30 PM. No loitering during prep time. Silence must be observed in classrooms." }
    ]
  },
  {
    id: 3,
    title: "Fee Structure & Payments",
    icon: FiDollarSign,
    color: "from-amber-600 to-amber-800",
    intro: "School fees must be paid promptly to facilitate smooth school operations and resource availability. Below is the official fee structure for 2026.",
    subSections: [
      { subTitle: "Payment Methods", content: "Bank payments to SA Kinyui Boys HIGH SCHOOL, Cooperative Bank, Account No: 0112876543210. MPESA Paybill: 894145 (Account: Student Name + Admission No). Crossed bankers cheque payable to Kinyui Boys SECONDARY SCHOOL or Postal money order payable to Kinyui Boys SECONDARY SCHOOL." },
      { subTitle: "Payment Deadlines", content: "Fees payable in full by the second week of each term. Term 1: By 31st January, Term 2: By 30th April, Term 3: By 31st August." },
      { subTitle: "Penalties", content: "Late payment attracts a penalty of KES 500 per week. Students with fee balances will not receive end-term reports or be allowed to sit for exams." },
      { subTitle: "Official Contact", content: "For fee queries, contact Accounts Clerk at P.O.BOX 142-90131, TALA or call 0710 894 145. Email: kinyuiboysschool@yahoo.com" }
    ]
  },
  {
    id: 4,
    title: "Discipline & Conduct",
    icon: FiShield,
    color: "from-red-600 to-red-800",
    intro: "Kinyui Boys High School upholds strict discipline to create a conducive learning environment.",
    subSections: [
      { subTitle: "School Uniform", content: "Full school uniform must be worn at all times: blue checked shirt, navy blue sweater, grey shorts/trousers, white socks, and black shoes. School tie and badge compulsory." },
      { subTitle: "Prohibited Items", content: "STRICTLY PROHIBITED: Mobile phones, smartphones, smartwatches, alcohol, cigarettes, bhang, weapons, playing cards, and inappropriate magazines." },
      { subTitle: "Discipline Structure", content: "Minor offenses: Manual work/counseling. Serious offenses: Suspension. Gross offenses: Expulsion (drugs, fighting, theft, vandalism)." }
    ]
  },
  {
    id: 5,
    title: "Boarding & Accommodation",
    icon: FiHome,
    color: "from-indigo-600 to-indigo-800",
    intro: "As a fully boarding school, Kinyui Boys provides structured residential facilities with clear guidelines.",
    subSections: [
      { subTitle: "Daily Routine", content: "Wake up: 5:00 AM. Breakfast: 6:30 AM. Lunch: 1:00 PM. Supper: 6:30 PM. Lights out: 10:00 PM (Form 3-4), 9:30 PM (Form 1-2)." },
      { subTitle: "Dormitory Rules", content: "Beds made by 6:00 AM. Personal belongings locked in boxes. No food in dormitories. Cleaning roster strictly followed." },
      { subTitle: "Visiting Days", content: "Last Sunday of each term, 10:00 AM - 4:00 PM. Parents must sign visitor's book. No visiting on examination days." }
    ]
  },
  {
    id: 6,
    title: "Movement & Boundaries",
    icon: FiMapPin,
    color: "from-violet-600 to-violet-800",
    intro: "Student movement within and outside school is controlled for safety and accountability.",
    subSections: [
      { subTitle: "School Compound", content: "Students must remain within school bounds at all times. Leaving school requires written parental permission approved by Principal." },
      { subTitle: "Half-Term Breaks", content: "Half-term break: Thursday to Sunday. Students must sign out and indicate destination. Return by Sunday 5:00 PM." }
    ]
  },
  {
    id: 7,
    title: "Health & Medical Care",
    icon: FiHeart,
    color: "from-rose-600 to-rose-800",
    intro: "Student health and wellness are prioritized with comprehensive medical support systems.",
    subSections: [
      { subTitle: "School Dispensary", content: "School nurse on duty 24/7. Minor ailments treated at school dispensary. Serious cases referred to Kinyui Health Centre." },
      { subTitle: "Medical Checkups", content: "Routine medical checkups conducted every term. Parents must provide updated medical history and allergy information." },
      { subTitle: "Emergency Contacts", content: "Parents notified immediately of serious illness/accident. Emergency contacts must be kept updated: Principal: 0710 894 145." }
    ]
  },
  {
    id: 8,
    title: "Co-Curricular Activities",
    icon: FiActivity,
    color: "from-teal-600 to-teal-800",
    intro: "Participation in co-curricular activities is mandatory for holistic student development.",
    subSections: [
      { subTitle: "Sports", content: "Every student must join at least one sport: football, volleyball, rugby, athletics, or handball. Sports days: Tuesday and Thursday 4:00-6:00 PM." },
      { subTitle: "Clubs & Societies", content: "Students choose minimum one club: Debate, Journalism, Science, Drama, Red Cross, or Christian Union. Meetings: Wednesday 4:00-5:30 PM." },
      { subTitle: "Music & Drama", content: "Music and drama festivals participation encouraged. Practice sessions: Saturday 9:00 AM - 12:00 PM." }
    ]
  },
  {
    id: 9,
    title: "Examinations & Assessment",
    icon: FiTarget,
    color: "from-cyan-600 to-cyan-800",
    intro: "Regular assessment ensures academic progress and KCSE readiness.",
    subSections: [
      { subTitle: "Continuous Assessment", content: "2 CATs per term. End-term examinations in Week 14. Form 3 and 4 have monthly mock examinations starting Term 2." },
      { subTitle: "Examination Rules", content: "NO cheating. Latecomers not admitted. Mobile phones strictly forbidden in exam rooms. KCSE rules apply to all internal exams." },
      { subTitle: "KCSE Preparation", content: "Form 4: Saturday morning tuition 8:00 AM - 12:00 PM. Holiday coaching for candidates: April and August holidays." }
    ]
  },
  {
    id: 10,
    title: "Dress Code & Grooming",
    icon: FiUsers,
    color: "from-sky-600 to-sky-800",
    intro: "Proper grooming reflects the discipline and identity of Kinyui Boys High School.",
    subSections: [
      { subTitle: "Hair Rules", content: "Short, neat, above collar, no shaved lines. Dreadlocks not allowed. No coloring or styling." },
      { subTitle: "Personal Effects", content: "NO jewelry except simple watches. No makeup, nail polish, or cosmetics. No visible tattoos or piercings." },
      { subTitle: "General Grooming", content: "Nails short and clean. Uniforms clean and ironed. Shirts tucked in. Shoes polished daily." }
    ]
  },
  {
    id: 11,
    title: "Library & Resources",
    icon: FiBookOpen,
    color: "from-orange-600 to-orange-800",
    intro: "The school library provides essential resources to support academic work.",
    subSections: [
      { subTitle: "Library Hours", content: "Monday-Friday: 7:30 AM - 6:00 PM, Saturday: 8:00 AM - 1:00 PM. Closed on Sundays and public holidays." },
      { subTitle: "Borrowing Rules", content: "Maximum 2 books for 2 weeks. Late return fine: KES 20 per day. Lost books: Replace or pay full cost." },
      { subTitle: "Library Conduct", content: "Absolute silence. NO eating or drinking. Bags not allowed inside. Reference books NOT for borrowing." }
    ]
  },
  {
    id: 12,
    title: "Chapel & Religious Life",
    icon: FiStar,
    color: "from-fuchsia-600 to-fuchsia-800",
    intro: "Spiritual growth is encouraged through organized religious activities.",
    subSections: [
      { subTitle: "Chapel Services", content: "Sunday service: 8:00 AM - 10:00 AM (compulsory). Thursday Afternoon fellowship: 12:00 PM - 2:00 PM (compulsory)." },
      { subTitle: "Religious Groups", content: "Christian Union, Catholic Action, and Muslim students provided with facilities for worship. Respect for all faiths mandatory." },
      { subTitle: "Conduct in Chapel", content: "Proper attire required. Phones NOT allowed. Active participation encouraged. Offerings voluntary." }
    ]
  },
  {
    id: 13,
    title: "Dining Hall & Meals",
    icon: FiClock,
    color: "from-lime-600 to-lime-800",
    intro: "Proper conduct in the dining hall ensures orderly and hygienic meal times.",
    subSections: [
      { subTitle: "Meal Times", content: "Breakfast: 6:30 AM, Lunch: 1:00 PM, Supper: 6:30 PM. Students must be punctual. Grace said before meals." },
      { subTitle: "Dining Rules", content: "Queue orderly. NO food wastage. Use own plates and cutlery. Return utensils after meals. NO food out of dining hall." },
      { subTitle: "Special Diets", content: "Medical cases provided special diet upon doctor's recommendation. Written parental request required." }
    ]
  },
  {
    id: 14,
    title: "Communication & Parents",
    icon: FiPhone,
    color: "from-pink-600 to-pink-800",
    intro: "Strong communication between school and parents enhances student success.",
    subSections: [
      { subTitle: "Parent Meetings", content: "Annual general meeting: First Saturday of Term 1. PTA meetings: Second Saturday of Term 2 and 3. Class-specific meetings as called." },
      { subTitle: "Reporting", content: "Progress reports issued end of each term. Mid-term reports for students with performance issues. Principal's report in school newsletter." },
      { subTitle: "Parent Queries", content: "Contact class teacher for academic issues. Contact housemaster for boarding issues. Principal's office: katzihigh@gmail.com." }
    ]
  },
  {
    id: 15,
    title: "Environment & Property",
    icon: FiAward,
    color: "from-green-600 to-green-800",
    intro: "Students are responsible for maintaining a clean environment and caring for school property.",
    subSections: [
      { subTitle: "Cleanliness", content: "Daily cleaning of classes and compound. Friday general cleaning: 4:00-6:00 PM. NO littering - dustbins provided." },
      { subTitle: "Property Care", content: "Vandalism attracts heavy penalties (repair cost plus disciplinary action). Report any damage immediately." },
      { subTitle: "Environmental Projects", content: "Tree planting every term. School farm participation for Agriculture students. Water conservation practices." }
    ]
  }
];

const BOARDING_FEES = {
  term1: 22244,
  term2: 20268,
  term3: 12160,
  annual: 40535,
  breakdown: [
    { voteHead: "TUITION", term1: 4144, term2: 7615, term3: 5077, total: 25385 },
    { voteHead: "BOARDING", term1: 12693, term2: 7615, term3: 5077, total: 25385 },
    { voteHead: "M&I", term1: 5000, term2: 1000, term3: 600, total: 2000 },
    { voteHead: "LT&T, EWC, ADM, P,E", term1: 9400, term2: 6450, term3: 3870, total: 12900 },
    { voteHead: "ACTIVITY", term1: 1500, term2: 125, term3: 75, total: 250 },
    { voteHead: "MEDICAL & INSURANCE", term1: 2000, term2: 0, term3: 0, total: 2000 },
    { voteHead: "SMASSE", term1: 200, term2: 0, term3: 0, total: 200 }
  ]
};

const RULES_PER_PAGE = 5;

function RuleCard({ term, isOpen, onToggle }) {
  const Icon = term.icon;
  return (
    <div className={`rounded-2xl border transition-all duration-300 overflow-hidden ${isOpen ? "border-slate-300 shadow-xl bg-white" : "border-slate-200 shadow-sm bg-white hover:shadow-md hover:border-slate-300"}`}>
      <button onClick={onToggle} className="w-full text-left p-4 sm:p-5 md:p-6 flex items-center gap-3 sm:gap-4 focus:outline-none group">
        <div className={`flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br ${term.color} flex items-center justify-center shadow-lg`}>
          <Icon className="text-white" size={18} />
        </div>
        <div className="flex-1 min-w-0">
          <span className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest">Section {String(term.id).padStart(2, "0")}</span>
          <h3 className="text-sm sm:text-base md:text-lg font-extrabold text-slate-900 group-hover:text-blue-700 transition-colors truncate">{term.title}</h3>
        </div>
        <div className={`flex-shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-all ${isOpen ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-500"}`}>
          {isOpen ? <FiChevronUp size={18} /> : <FiChevronDown size={18} />}
        </div>
      </button>
      {isOpen && (
        <div className="border-t border-slate-100">
          <div className="px-4 sm:px-5 md:px-6 pt-4 pb-2">
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">{term.intro}</p>
          </div>
          <div className="px-4 sm:px-5 md:px-6 pb-5 space-y-3">
            {term.subSections.map((sub, idx) => (
              <div key={idx} className="flex gap-3 p-3 sm:p-4 rounded-xl bg-slate-50 border border-slate-100">
                <div className={`flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br ${term.color} flex items-center justify-center`}>
                  <span className="text-white text-[10px] sm:text-xs font-black">{idx + 1}</span>
                </div>
                <div className="min-w-0">
                  <h4 className="text-sm sm:text-base font-bold text-slate-900 mb-1">{sub.subTitle}</h4>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{sub.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function SchoolPolicies() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFees, setShowFees] = useState(false);
  const topRef = useRef(null);
  const year = new Date().getFullYear();

  const filtered = allTerms.filter((term) => {
    const q = searchTerm.toLowerCase();
    return (
      term.title.toLowerCase().includes(q) ||
      term.intro.toLowerCase().includes(q) ||
      term.subSections.some((s) => s.subTitle.toLowerCase().includes(q) || s.content.toLowerCase().includes(q))
    );
  });

  const totalPages = Math.ceil(filtered.length / RULES_PER_PAGE);
  const paged = filtered.slice((currentPage - 1) * RULES_PER_PAGE, currentPage * RULES_PER_PAGE);

  const goToPage = (p) => {
    setCurrentPage(p);
    topRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div ref={topRef} className="min-h-screen bg-slate-50">
      {/* Hero Banner */}
      <div className="relative bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.06]">
          <div className="absolute inset-0" style={{ backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.08) 35px, rgba(255,255,255,.08) 36px), repeating-linear-gradient(-45deg, transparent, transparent 35px, rgba(255,255,255,.08) 35px, rgba(255,255,255,.08) 36px)" }} />
        </div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-blue-500/20 rounded-full blur-[120px]" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-12 sm:pt-16 md:pt-20 pb-10 sm:pb-14 md:pb-16 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 border border-white/20 rounded-full backdrop-blur-sm mb-5 sm:mb-6">
            <FiShield className="text-blue-400" size={14} />
            <span className="text-[11px] sm:text-xs font-semibold text-blue-300 uppercase tracking-widest">SA Kinyui Boys Senior School — Est. 1976</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white leading-[1.1] mb-4 sm:mb-5">
            School Rules &<br className="hidden sm:block" /> Policies {year}
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-blue-200/80 max-w-xl mx-auto leading-relaxed mb-8">
            Official guidelines, regulations, and fee structure governing academic life at Kinyui Boys Senior School.
          </p>
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
            {[
              { num: allTerms.length, label: "Sections", icon: FiBook },
              { num: "400+", label: "Boarding Students", icon: FiUsers },
              { num: year, label: "Academic Year", icon: FiAward },
            ].map((s, i) => {
              const I = s.icon;
              return (
                <div key={i} className="flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/15 rounded-xl backdrop-blur-sm">
                  <I className="text-blue-400" size={15} />
                  <span className="text-white font-extrabold text-sm">{s.num}</span>
                  <span className="text-blue-300/70 text-[11px] font-medium">{s.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="relative h-12 sm:h-16">
          <svg viewBox="0 0 1440 60" className="absolute bottom-0 w-full h-full" preserveAspectRatio="none">
            <path fill="#f8fafc" d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z" />
          </svg>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 -mt-2 pb-16">
        {/* Fee Structure */}
        <div className="mb-8 sm:mb-12">
          <button onClick={() => setShowFees((v) => !v)} className="w-full text-left">
            <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 shadow-xl hover:shadow-2xl transition-shadow">
              <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "24px 24px" }} />
              <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 sm:p-6 md:p-8 gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center">
                    <FiDollarSign className="text-white" size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white">Boarding Fee Structure {year}</h2>
                    <p className="text-blue-200/80 text-xs sm:text-sm mt-0.5">Tap to {showFees ? "collapse" : "view"} the full breakdown</p>
                  </div>
                </div>
                <div className={`w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center transition-transform ${showFees ? "rotate-180" : ""}`}>
                  <FiChevronDown className="text-white" size={20} />
                </div>
              </div>
            </div>
          </button>

          {showFees && (
            <div className="bg-white rounded-b-2xl border border-t-0 border-slate-200 shadow-lg overflow-hidden">
              <div className="p-4 sm:p-6 md:p-8">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
                  {[
                    { label: "Term 1", amount: BOARDING_FEES.term1, tag: "Opening", gradient: "from-blue-500 to-blue-700", emoji: "📚" },
                    { label: "Term 2", amount: BOARDING_FEES.term2, tag: "Mid Year", gradient: "from-indigo-500 to-indigo-700", emoji: "✏️" },
                    { label: "Term 3", amount: BOARDING_FEES.term3, tag: "Final", gradient: "from-purple-500 to-purple-700", emoji: "🎓" },
                    { label: "Annual Total", amount: BOARDING_FEES.annual, tag: "Full Year", gradient: "from-emerald-500 to-emerald-700", emoji: "💰" },
                  ].map((c, i) => (
                    <div key={i} className={`relative rounded-xl bg-gradient-to-br ${c.gradient} p-4 sm:p-5 text-white overflow-hidden`}>
                      <div className="absolute top-1 right-1 text-3xl opacity-20">{c.emoji}</div>
                      <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-white/70">{c.label}</span>
                      <div className="mt-1 flex items-baseline gap-1">
                        <span className="text-[10px] sm:text-xs font-semibold opacity-80">KES</span>
                        <span className="text-lg sm:text-2xl md:text-3xl font-black">{c.amount.toLocaleString()}</span>
                      </div>
                      <span className="inline-block mt-2 text-[10px] px-2 py-0.5 bg-white/20 rounded-full font-medium">{c.tag}</span>
                    </div>
                  ))}
                </div>

                <h3 className="text-sm sm:text-base font-extrabold text-slate-900 mb-3">Detailed Breakdown (Boarding)</h3>
                <div className="overflow-x-auto -mx-4 sm:mx-0 rounded-xl border border-slate-200">
                  <table className="min-w-full text-left">
                    <thead>
                      <tr className="bg-slate-900 text-white text-xs sm:text-sm">
                        <th className="px-3 sm:px-4 py-3 font-bold">Vote Head</th>
                        <th className="px-3 sm:px-4 py-3 text-right font-bold">Term 1</th>
                        <th className="px-3 sm:px-4 py-3 text-right font-bold">Term 2</th>
                        <th className="px-3 sm:px-4 py-3 text-right font-bold">Term 3</th>
                        <th className="px-3 sm:px-4 py-3 text-right font-bold">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {BOARDING_FEES.breakdown.map((row, i) => (
                        <tr key={i} className="hover:bg-blue-50/40 transition-colors text-xs sm:text-sm">
                          <td className="px-3 sm:px-4 py-2.5 font-semibold text-slate-800">{row.voteHead}</td>
                          <td className="px-3 sm:px-4 py-2.5 text-right text-slate-600">{row.term1.toLocaleString()}</td>
                          <td className="px-3 sm:px-4 py-2.5 text-right text-slate-600">{row.term2.toLocaleString()}</td>
                          <td className="px-3 sm:px-4 py-2.5 text-right text-slate-600">{row.term3.toLocaleString()}</td>
                          <td className="px-3 sm:px-4 py-2.5 text-right font-bold text-slate-900">{row.total.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="bg-blue-600 text-white font-black text-xs sm:text-sm">
                        <td className="px-3 sm:px-4 py-3">TOTAL</td>
                        <td className="px-3 sm:px-4 py-3 text-right">{BOARDING_FEES.term1.toLocaleString()}</td>
                        <td className="px-3 sm:px-4 py-3 text-right">{BOARDING_FEES.term2.toLocaleString()}</td>
                        <td className="px-3 sm:px-4 py-3 text-right">{BOARDING_FEES.term3.toLocaleString()}</td>
                        <td className="px-3 sm:px-4 py-3 text-right">{BOARDING_FEES.annual.toLocaleString()}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <h4 className="text-xs sm:text-sm font-extrabold text-slate-800 mb-2 flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center text-xs">🏦</span>
                      Bank Transfer
                    </h4>
                    <ul className="space-y-1 text-xs sm:text-sm text-slate-600">
                      <li><span className="font-semibold text-slate-700">Account:</span> SA Kinyui Boys HIGH SCHOOL</li>
                      <li><span className="font-semibold text-slate-700">Bank:</span> Cooperative Bank</li>
                      <li><span className="font-semibold text-slate-700">Acc No:</span> 0112876543210</li>
                    </ul>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <h4 className="text-xs sm:text-sm font-extrabold text-slate-800 mb-2 flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-green-100 text-green-600 flex items-center justify-center text-xs">📱</span>
                      MPESA Payment
                    </h4>
                    <ul className="space-y-1 text-xs sm:text-sm text-slate-600">
                      <li><span className="font-semibold text-slate-700">Paybill:</span> <span className="text-blue-600 font-bold">894145</span></li>
                      <li><span className="font-semibold text-slate-700">Account:</span> Student Name + Admission No</li>
                    </ul>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl">
                  <p className="text-amber-800 text-xs sm:text-sm flex items-start gap-2">
                    <FiAlertTriangle className="flex-shrink-0 mt-0.5" size={14} />
                    <span><strong>Late payment penalty:</strong> KES 500 per week. Students with fee balances will not receive end-term reports or sit for exams.</span>
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Search + Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              placeholder="Search rules, policies..."
              className="w-full pl-10 pr-9 py-3 text-sm border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 bg-white"
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                <FiX size={16} />
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 mb-4 text-xs text-slate-500 font-medium">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            Showing {paged.length} of {filtered.length} sections
            {searchTerm && <span className="ml-1 px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">&quot;{searchTerm}&quot;</span>}
          </span>
          <span>Page {currentPage} of {totalPages || 1}</span>
        </div>

        {/* Rule Cards */}
        <div className="space-y-3 sm:space-y-4 mb-10">
          {paged.length > 0 ? (
            paged.map((term) => (
              <RuleCard key={term.id} term={term} />
            ))
          ) : (
            <div className="bg-white rounded-2xl border-2 border-dashed border-slate-300 p-10 sm:p-16 text-center">
              <FiSearch className="mx-auto text-slate-300 mb-4" size={40} />
              <h3 className="text-lg font-bold text-slate-800 mb-1">No results found</h3>
              <p className="text-sm text-slate-500 mb-4">Try a different keyword</p>
              <button onClick={() => setSearchTerm("")} className="px-5 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-colors">Show All Rules</button>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="sticky bottom-3 z-10">
            <div className="bg-white/95 backdrop-blur-lg rounded-2xl border border-slate-200 shadow-xl p-3 sm:p-4 max-w-lg mx-auto flex items-center justify-between gap-2">
              <button onClick={() => goToPage(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="p-2 rounded-xl border border-slate-200 disabled:opacity-40 hover:bg-slate-50 transition-colors">
                <FiChevronLeft size={18} />
              </button>
              <div className="flex items-center gap-1.5">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let num;
                  if (totalPages <= 5) num = i + 1;
                  else if (currentPage <= 3) num = i + 1;
                  else if (currentPage >= totalPages - 2) num = totalPages - 4 + i;
                  else num = currentPage - 2 + i;
                  return (
                    <button key={num} onClick={() => goToPage(num)} className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl font-bold text-sm transition-all ${currentPage === num ? "bg-blue-600 text-white shadow-lg" : "text-slate-600 hover:bg-slate-100"}`}>{num}</button>
                  );
                })}
              </div>
              <button onClick={() => goToPage(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="p-2 rounded-xl border border-slate-200 disabled:opacity-40 hover:bg-slate-50 transition-colors">
                <FiChevronRight size={18} />
              </button>
            </div>
          </div>
        )}

        {/* Bottom Info Cards */}
        <div className="mt-10 sm:mt-14 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: FiAlertTriangle, title: "Important Notice", text: "These rules are binding for all students. Parents/guardians must ensure students understand and comply.", bg: "bg-amber-50 border-amber-200", iconBg: "bg-amber-100 text-amber-700", titleColor: "text-amber-900" },
            { icon: FiDollarSign, title: "Fee Payment", text: "Fees must be paid in full by the second week of each term. Late payment attracts KES 500/week penalty.", bg: "bg-emerald-50 border-emerald-200", iconBg: "bg-emerald-100 text-emerald-700", titleColor: "text-emerald-900" },
            { icon: FiShield, title: "Enforcement", text: "Rules enforced by school administration. Appeals to be made in writing to the Principal's office.", bg: "bg-blue-50 border-blue-200", iconBg: "bg-blue-100 text-blue-700", titleColor: "text-blue-900" },
          ].map((c, i) => {
            const I = c.icon;
            return (
              <div key={i} className={`rounded-xl ${c.bg} border p-4 sm:p-5`}>
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-7 h-7 rounded-lg ${c.iconBg} flex items-center justify-center`}><I size={14} /></div>
                  <h4 className={`text-sm font-extrabold ${c.titleColor}`}>{c.title}</h4>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{c.text}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-8 text-center">
          <p className="text-[11px] sm:text-xs text-slate-400">&copy; {year} SA Kinyui Boys Senior School &middot; Matungulu, Machakos County &middot; All rights reserved</p>
          <p className="text-[10px] sm:text-[11px] text-slate-400 mt-1">Tel: 0710 894 145 &middot; Email: kinyuiboysschool@yahoo.com &middot; P.O.BOX 142-90131, TALA</p>
        </div>
      </div>

      <button onClick={() => topRef.current?.scrollIntoView({ behavior: "smooth" })} className="fixed bottom-6 right-6 w-10 h-10 sm:w-12 sm:h-12 bg-blue-600 text-white rounded-full shadow-xl flex items-center justify-center hover:bg-blue-700 transition-colors z-20" aria-label="Back to top">
        <FiArrowUp size={18} />
      </button>
    </div>
  );
}
