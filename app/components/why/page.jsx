'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  FiAward, FiHeart, FiMapPin, FiUsers, FiCalendar,
  FiStar, FiMail, FiPhone, FiArrowRight, FiMonitor,
  FiCpu, FiChevronLeft, FiChevronRight, FiChevronDown,
  FiTarget, FiEye, FiBookOpen, FiLoader
} from 'react-icons/fi';

const ModernSchoolLayout = () => {
  const router = useRouter();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [expandedCards, setExpandedCards] = useState({});
  const [schoolData, setSchoolData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uniImages, setUniImages] = useState([]);
  const [imagesLoading, setImagesLoading] = useState(true);

  const schoolImages = [
    { src: "/bg/14.jpeg", alt: "Kinyui Boys Senior School - Main Building" },
    { src: "/bg/9.jpeg", alt: "Kinyui Boys Senior School - Students" },
    { src: "/hero/st.jpeg", alt: "Kinyui Boys Senior School - Classroom" },
    { src: "/hero/student.jpeg", alt: "Kinyui Boys Senior School - ICT Lab" },
    { src: "/hero/env.jpeg", alt: "Kinyui Boys Senior School - Environment" },
    { src: "/hero/sports.jpeg", alt: "Kinyui Boys Senior School - Sports" },
    { src: "/hero/katz8.jpeg", alt: "Kinyui Boys Senior School - Campus" },
  ];

  // Fetch real school data
  useEffect(() => {
    fetch('/api/school')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.school) setSchoolData(data.school);
      })
      .catch(err => console.error('Error fetching school data:', err))
      .finally(() => setLoading(false));
  }, []);

  // Fetch university logo images from API (reads public/unis directory server-side)
  useEffect(() => {
    fetch('/api/unis')
      .then(res => res.json())
      .then(data => {
        const imgs = data.images || [];
        // Shuffle for random order
        for (let i = imgs.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [imgs[i], imgs[j]] = [imgs[j], imgs[i]];
        }
        setUniImages(imgs);
      })
      .catch(() => setUniImages([]))
      .finally(() => setImagesLoading(false));
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex(prev => (prev + 1) % schoolImages.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [schoolImages.length]);

  const nextImage = () => setCurrentImageIndex(prev => (prev + 1) % schoolImages.length);
  const prevImage = () => setCurrentImageIndex(prev => (prev - 1 + schoolImages.length) % schoolImages.length);

  const toggleReadMore = (id) => {
    setExpandedCards(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const schoolName = schoolData?.name || 'Kinyui Boys Senior School';
  const motto = schoolData?.motto || 'Soaring to Excellence';
  const vision = schoolData?.vision;
  const mission = schoolData?.mission;
  const description = schoolData?.description;
  const studentCount = schoolData?.studentCount || 400;
  const staffCount = schoolData?.staffCount || 20;
  const contactEmail = schoolData?.admissionContactEmail || 'kinyuiboys2015@gmail.com';
  const contactPhone = schoolData?.admissionContactPhone || '0733 587223';

  const whyChooseUs = [
    {
      id: 1,
      title: "3rd Best School in Matungulu",
      description: "Ranked third-best public school in Matungulu Sub-county (2019) after Matungulu Girls and Tala High, producing an A- candidate. This achievement marked a significant milestone in our academic journey, demonstrating our commitment to excellence in education and student development.",
      shortDescription: "Ranked third-best public school in Matungulu Sub-county (2019) after Matungulu Girls and Tala High, producing an A- candidate.",
      metrics: "Top Performer 2019",
      icon: <FiAward className="w-5 h-5" />,
      image: { src: "/hero/st.jpeg", alt: "Academic Excellence" },
      color: "blue"
    },
    {
      id: 2,
      title: "KShs 7.2M Infrastructure Boost",
      description: "KShs 6M ICT donation (50+ laptops from Angaza Centre, 2023) + KShs 1.2M KCB LPG funding (2022) transforming learning and kitchen operations. This investment has revolutionized our digital learning capabilities and improved our kitchen efficiency, reducing costs and environmental impact.",
      shortDescription: "KShs 6M ICT donation (50+ laptops from Angaza Centre, 2023) + KShs 1.2M KCB LPG funding (2022) transforming learning and kitchen operations.",
      metrics: "KShs 7.2M Total",
      icon: <FiCpu className="w-5 h-5" />,
      image: { src: "/hero/student.jpeg", alt: "Infrastructure Development" },
      color: "indigo"
    },
    {
      id: 3,
      title: "Athletic Excellence & Coaching",
      description: "A powerhouse in Machakos County sports: Featuring our championship-winning Rugby 7s program led by Mr. Simiyu, and our elite Basketball squad under the tactical leadership of Mr. Kioko (Mr. Kim). Both programs are consistent KSSSA regional contenders recognized for discipline and technical skill.",
      shortDescription: "Championship Rugby 7s led by Mr. Simiyu and elite Basketball under Mr. Kioko (Mr. Kim) — consistent KSSSA regional contenders.",
      metrics: "Multi-Sport Champions",
      icon: <FiStar className="w-5 h-5" />,
      image: { src: "/hero/sports.jpeg", alt: "Athletic Excellence" },
      color: "amber"
    },
    {
      id: 4,
      title: "Environmental Conservation",
      description: "LPG adoption reduced kitchen expenses by 40% (KShs 700K to KShs 420K per term) and firewood consumption, conserving local trees. This initiative has not only saved costs but also contributed significantly to environmental sustainability, reducing our carbon footprint and promoting eco-friendly practices.",
      shortDescription: "LPG adoption reduced kitchen expenses by 40% (KShs 700K to KShs 420K per term) and firewood consumption, conserving local trees.",
      metrics: "40% Cost Saved",
      icon: <FiHeart className="w-5 h-5" />,
      image: { src: "/hero/env.jpeg", alt: "Environmental Conservation" },
      color: "emerald"
    }
  ];

  const colorMap = {
    blue: { bg: 'bg-blue-500', light: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200', ring: 'ring-blue-100' },
    indigo: { bg: 'bg-indigo-500', light: 'bg-indigo-50', text: 'text-indigo-600', border: 'border-indigo-200', ring: 'ring-indigo-100' },
    amber: { bg: 'bg-amber-500', light: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-200', ring: 'ring-amber-100' },
    emerald: { bg: 'bg-emerald-500', light: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-200', ring: 'ring-emerald-100' },
  };

  const schoolFeatures = [
    {
      title: "Academic Excellence Recognition",
      description: "Named among top improving schools in Matungulu Sub-county (2024) with commendable KCSE results. Produced A- candidate in 2019.",
      highlight: "3rd Best 2019",
      tags: ["A- Candidate", "Top Improver 2024", "University Placement"],
      icon: <FiAward className="w-5 h-5" />,
      span: "md:col-span-2"
    },
    {
      title: `${studentCount}+ Eagles Enrolled`,
      description: `Currently serving ${studentCount}+ students as a boarding school in Matungulu, Machakos County with consistent enrollment growth.`,
      highlight: "Growing Enrollment",
      tags: ["Boarding", "Co-curricular", "Guidance"],
      icon: <FiUsers className="w-5 h-5" />,
      span: "md:col-span-1"
    },
    {
      title: "ICT Integration Leadership",
      description: "Received 50+ laptop donation (2023) from Angaza ICT Literacy Centre — the only school in Machakos County selected for this KShs 6M program.",
      highlight: "KShs 6M Donation",
      tags: ["50+ Laptops", "Digital Literacy", "ICT Labs"],
      icon: <FiMonitor className="w-5 h-5" />,
      span: "md:col-span-1"
    },
    {
      title: "Spiritual & Moral Formation",
      description: "Christian values education with weekly worship, annual retreats, and Thursday devotions. Building character through faith with our school chaplain, Pastor Samuel Mutie.",
      highlight: "Values Education",
      tags: ["Weekly Worship", "Character Building", "Retreats"],
      icon: <FiHeart className="w-5 h-5" />,
      span: "md:col-span-1"
    },
    {
      title: "University & Career Pathways",
      description: "Comprehensive career guidance and university preparation. Consistent placement of Eagles to Kenyan universities with alumni success stories.",
      highlight: "University Bound",
      tags: ["Career Counseling", "University Placement", "Alumni Network"],
      icon: <FiCalendar className="w-5 h-5" />,
      span: "md:col-span-1",
      featured: true
    }
  ];

  // Create the scrolling images by duplicating the list for seamless loop
  const scrollImages = [...uniImages, ...uniImages, ...uniImages];

  return (
    <div className="bg-gray-50 font-sans overflow-hidden">

      {/* === HERO INTRO === */}
      <section className="relative bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">

            {/* Left — Text Content */}
            <div className="lg:col-span-5 space-y-5 sm:space-y-6">
              <div className="inline-flex items-center gap-2.5 px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-full border border-blue-100">
                <span className="text-lg">🦅</span>
                <span className="text-[10px] sm:text-xs font-bold tracking-[0.15em] text-blue-700 uppercase">
                  Home of The Eagles
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 leading-[1.08] tracking-tight">
                {loading ? (
                  <span className="inline-flex items-center gap-2">
                    <FiLoader className="w-5 h-5 animate-spin text-blue-500" /> Loading...
                  </span>
                ) : (
                  <>
                    {schoolName.split(' ').slice(0, -2).join(' ')}{' '}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                      {schoolName.split(' ').slice(-2).join(' ')}
                    </span>
                  </>
                )}
              </h1>

              <p className="text-gray-500 text-sm sm:text-base lg:text-lg leading-relaxed max-w-lg">
                {description || 'Located in the heart of Matungulu, Machakos County, The Eagles are dedicated to nurturing students into confident, compassionate, and accomplished leaders.'}
              </p>

              <div className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-3">
                <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg text-xs text-gray-600">
                  <FiMapPin className="text-blue-500 flex-shrink-0" size={14} /> Matungulu, Machakos County
                </span>
                <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg text-xs text-gray-600">
                  <FiPhone className="text-blue-500 flex-shrink-0" size={14} /> {contactPhone}
                </span>
                <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg text-xs text-gray-600">
                  <FiMail className="text-blue-500 flex-shrink-0" size={14} /> {contactEmail}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 pt-2">
                {[
                  { label: 'Eagles', value: `${studentCount}+`, icon: '🦅' },
                  { label: 'Staff', value: `${staffCount}+`, icon: '👨‍🏫' },
                  { label: 'KCSE Target', value: '6.0', icon: '🎯' },
                  { label: 'Motto', value: motto?.split(' ').slice(0, 2).join(' ') || 'Soaring', icon: '🏆' }
                ].map((stat, idx) => (
                  <div key={idx} className="relative p-3 sm:p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                    <span className="absolute top-2 right-2 text-sm opacity-40">{stat.icon}</span>
                    <p className="text-xl sm:text-2xl font-black text-blue-600 leading-none">{stat.value}</p>
                    <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-gray-400 mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={() => router.push('/pages/admissions')}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm transition-all active:scale-[0.98] shadow-lg shadow-blue-600/20"
                >
                  Join The Eagles <FiArrowRight size={16} />
                </button>
                <button
                  onClick={() => router.push('/pages/AboutUs')}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white hover:bg-gray-50 text-gray-700 rounded-xl font-bold text-sm transition-all border border-gray-200"
                >
                  Learn More
                </button>
              </div>
            </div>

            {/* Right — Image Carousel */}
            <div className="lg:col-span-7">
              <div className="relative aspect-[4/3] sm:aspect-[16/10] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl group">
                {schoolImages.map((image, idx) => (
                  <div
                    key={idx}
                    className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                      idx === currentImageIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
                    }`}
                  >
                    <Image src={image.src} alt={image.alt} fill className="object-cover" priority={idx === 0} />
                  </div>
                ))}

                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                <button onClick={prevImage} className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-white/30 z-10" aria-label="Previous">
                  <FiChevronLeft size={20} />
                </button>
                <button onClick={nextImage} className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-white/30 z-10" aria-label="Next">
                  <FiChevronRight size={20} />
                </button>

                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                  {schoolImages.map((_, idx) => (
                    <button key={idx} onClick={() => setCurrentImageIndex(idx)}
                      className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentImageIndex ? 'w-6 bg-white' : 'w-1.5 bg-white/40 hover:bg-white/70'}`} />
                  ))}
                </div>

                <div className="absolute bottom-12 left-4 right-4 sm:left-5 sm:right-auto z-10">
                  <div className="backdrop-blur-xl bg-white/10 border border-white/20 px-4 py-3 rounded-xl max-w-xs">
                    <p className="text-white font-black text-sm sm:text-base tracking-tight leading-snug">🦅 {schoolName}</p>
                    <p className="text-white/60 text-[10px] sm:text-xs font-semibold uppercase tracking-wider mt-0.5">{motto}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* === VISION / MISSION / MOTTO STRIP === */}
      {(vision || mission || motto) && (
        <section className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
              {[
                { label: 'Our Motto', value: motto, icon: <FiTarget className="w-5 h-5" /> },
                { label: 'Our Vision', value: vision, icon: <FiEye className="w-5 h-5" /> },
                { label: 'Our Mission', value: mission, icon: <FiBookOpen className="w-5 h-5" /> },
              ].filter(item => item.value).map((item, idx) => (
                <div key={idx} className="flex gap-3 items-start">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white flex-shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-blue-200 text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-1">{item.label}</p>
                    <p className="text-white text-sm sm:text-base font-medium leading-relaxed">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* === WHY CHOOSE THE EAGLES === */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-18 lg:py-22">
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
            <span className="inline-block text-xs font-bold uppercase tracking-[0.2em] text-blue-600 mb-3">Why Choose Us</span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900 tracking-tight mb-3">
              The Eagles&apos; Achievements
            </h2>
            <p className="text-gray-500 text-sm sm:text-base">
              Real accomplishments from 2019&ndash;{new Date().getFullYear()} at {schoolName}, Matungulu
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
            {whyChooseUs.map((item) => {
              const c = colorMap[item.color];
              return (
                <div key={item.id} className="group relative bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
                  {item.image && (
                    <div className="relative h-40 sm:h-48 overflow-hidden">
                      <Image src={item.image.src} alt={item.image.alt} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      <span className={`absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full ${c.bg} text-white`}>
                        {item.metrics}
                      </span>
                    </div>
                  )}

                  <div className="p-5 sm:p-6">
                    <div className="flex items-start gap-3 mb-3">
                      <div className={`w-10 h-10 rounded-xl ${c.light} ${c.text} flex items-center justify-center flex-shrink-0`}>
                        {item.icon}
                      </div>
                      <h4 className="font-bold text-gray-900 text-base sm:text-lg leading-snug pt-1">{item.title}</h4>
                    </div>

                    <p className="text-gray-500 text-sm leading-relaxed mb-3">
                      {expandedCards[item.id] ? item.description : item.shortDescription}
                    </p>

                    {item.description !== item.shortDescription && (
                      <button onClick={() => toggleReadMore(item.id)}
                        className={`inline-flex items-center gap-1.5 ${c.text} text-xs font-semibold hover:underline transition-colors`}>
                        {expandedCards[item.id] ? 'Read Less' : 'Read More'}
                        <FiChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${expandedCards[item.id] ? 'rotate-180' : ''}`} />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* === EDUCATIONAL PILLARS — BENTO GRID === */}
      <section className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-18 lg:py-22">
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
            <span className="inline-block text-xs font-bold uppercase tracking-[0.2em] text-blue-600 mb-3">Our Pillars</span>
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900 tracking-tight mb-3">
              What Makes The Eagles Soar
            </h3>
            <p className="text-gray-500 text-sm sm:text-base">
              Building on real achievements at {schoolName}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
            {schoolFeatures.map((feature, index) => (
              <div
                key={index}
                className={`${feature.span} relative overflow-hidden rounded-2xl p-5 sm:p-6 transition-all duration-300 hover:shadow-lg ${
                  feature.featured
                    ? 'bg-gradient-to-br from-blue-600 to-indigo-700 text-white'
                    : 'bg-white text-gray-900 border border-gray-100 shadow-sm'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${
                  feature.featured ? 'bg-white/15 text-white' : 'bg-blue-50 text-blue-600'
                }`}>
                  {feature.icon}
                </div>

                <span className={`text-[10px] font-bold uppercase tracking-[0.15em] block mb-1.5 ${
                  feature.featured ? 'text-blue-200' : 'text-blue-500'
                }`}>
                  {feature.highlight}
                </span>

                <h4 className="text-base sm:text-lg font-bold tracking-tight leading-snug mb-2">{feature.title}</h4>
                <p className={`text-sm leading-relaxed mb-4 ${feature.featured ? 'text-blue-100' : 'text-gray-500'}`}>
                  {feature.description}
                </p>

                <div className="flex flex-wrap gap-1.5">
                  {feature.tags.map((tag, tIdx) => (
                    <span key={tIdx} className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold ${
                      feature.featured ? 'bg-white/10 text-white border border-white/10' : 'bg-gray-50 text-gray-600 border border-gray-100'
                    }`}>
                      {tag}
                    </span>
                  ))}
                </div>

                {feature.featured && (
                  <div className="mt-5 pt-4 border-t border-white/15 flex items-center justify-between">
                    <button onClick={() => router.push('/pages/apply-for-admissions')}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-white text-blue-700 rounded-lg text-xs font-bold hover:bg-blue-50 transition-colors active:scale-[0.97]">
                      Apply Now <FiArrowRight size={14} />
                    </button>
                    <span className="text-blue-200 text-xs font-semibold">Form 1 {new Date().getFullYear()}</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <button onClick={() => router.push('/pages/admissions')}
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-blue-600 text-white rounded-xl font-bold text-sm uppercase tracking-wider shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all active:scale-[0.98]">
              Apply for Admissions <FiArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* === ACHIEVEMENTS SUMMARY === */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-18">
          <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-50 p-6 sm:p-8 rounded-2xl border border-blue-100/60">
            <div className="flex items-center gap-2 mb-5">
              <span className="text-xl">🦅</span>
              <h4 className="text-sm sm:text-base font-black text-blue-800">Eagles&apos; Achievements (2019&ndash;Present)</h4>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                '3rd Best Public School in Matungulu Sub-county (2019) — A- candidate',
                'KShs 6M ICT Donation — 50+ laptops from Angaza Centre (2023) — Only school in Machakos',
                'KShs 1.2M KCB LPG Funding (2022) — 40% cost reduction (700K → 420K per term)',
                `${studentCount}+ Eagles enrolled — boarding`,
                'Environmental Conservation — Reduced firewood usage, staff from 6 to 4 cooks',
                'Top Improving School in KCSE (2024) — Matungulu Sub-county'
              ].map((text, idx) => (
                <div key={idx} className="bg-white p-4 rounded-xl border border-blue-100/60 shadow-sm">
                  <p className="text-xs sm:text-sm text-gray-700 font-medium leading-relaxed">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* === UNIVERSITY LOGOS SCROLLER === */}
      <section className="bg-gray-50 border-t border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto px-4">
            {/* Header Section */}
            <div className="text-center mb-12">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600 block mb-2">
                Our Partners
              </span>
              <h3 className="text-3xl font-black text-gray-900">
                University Collaborations
              </h3>
              <p className="max-w-5xl mx-auto text-gray-500 text-base mt-4 leading-relaxed">
                We bridge the gap between secondary education and the professional world through 
                strong alliances with top-tier universities. These partnerships foster 
                innovation, academic excellence, and career readiness for our young men.
              </p>
            </div>
          </div>

          {imagesLoading ? (
            <div className="text-center text-gray-400 py-8">
              <FiLoader className="w-8 h-8 animate-spin mx-auto mb-2" />
              Loading university partners...
            </div>
          ) : uniImages.length > 0 ? (
            <div className="relative overflow-hidden">
              <div
                className="flex gap-8 animate-marquee"
                style={{
                  animation: 'marquee 80s linear infinite',
                  width: 'max-content',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.animationPlayState = 'paused')}
                onMouseLeave={(e) => (e.currentTarget.style.animationPlayState = 'running')}
              >
                {scrollImages.map((img, idx) => (
                  <div key={idx} className="relative w-32 h-20 flex-shrink-0 bg-white rounded-xl shadow-sm p-2 hover:shadow-md transition-shadow">
                    <Image
                      src={img}
                      alt={`University logo ${idx}`}
                      fill
                      className="object-contain p-1"
                      sizes="(max-width: 128px) 100vw, 128px"
                      onError={(e) => {
                        // Safely hide broken images
                        const parent = e.currentTarget.parentElement;
                        if (parent) {
                          parent.style.display = 'none';
                        }
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-400 py-8">
              No university logos found in /public/unis folder
            </div>
          )}
<style>{`
  @keyframes marquee {
    0% {
      transform: translateX(0);
    }
    100% {
      transform: translateX(-50%);
    }
  }
`}</style>
        </div>
      </section>

      {/* === FOOTER STRIP === */}
      <section className="bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="text-lg">🦅</span>
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">The Eagles</span>
            </div>
            <span className="text-xs font-bold uppercase text-blue-600 bg-blue-50 px-4 py-1.5 rounded-full border border-blue-100">
              {motto}
            </span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ModernSchoolLayout;