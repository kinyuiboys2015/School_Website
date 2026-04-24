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
  const [achievementModalOpen, setAchievementModalOpen] = useState(false);
  const [selectedAchievement, setSelectedAchievement] = useState(null);

  // State variables
const [achievementsData, setAchievementsData] = useState(null);
const [achievementsLoading, setAchievementsLoading] = useState(true);

// Fetch achievements data
useEffect(() => {
  const fetchAchievementsAndStats = async () => {
    try {
      // Fetch achievements
      const achievementsRes = await fetch('/api/achievements');
      const achievementsResult = await achievementsRes.json();
      
      if (achievementsResult.success) {
        setAchievementsData(achievementsResult);
      } else {
        console.warn('Failed to fetch achievements, using fallback');
        setAchievementsData(null);
      }
    } catch (error) {
      console.error('Error fetching achievements:', error);
      setAchievementsData(null);
    } finally {
      setAchievementsLoading(false);
    }
  };

  fetchAchievementsAndStats();
}, []);

  const schoolImages = [
    { src: "/bg/14.jpeg", alt: "Kinyui Boys Senior School - Main Building" },
    { src: "/bg/9.jpeg", alt: "Kinyui Boys Senior School - Students" },
    { src: "/hero/st.jpeg", alt: "Kinyui Boys Senior School - Classroom" },
    { src: "/hero/student.jpeg", alt: "Kinyui Boys Senior School - ICT Lab" },
    { src: "/hero/env.jpeg", alt: "Kinyui Boys Senior School - Environment" },
    { src: "/hero/sports.jpeg", alt: "Kinyui Boys Senior School - Sports" },
    { src: "/hero/kin.jpeg", alt: "Kinyui Boys Senior School - Campus" },
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
  const contactEmail = schoolData?.admissionContactEmail || 'kinyuiboys2015@gmail.com';
  const contactPhone = schoolData?.admissionContactPhone || '0733 587223';

const achievements = [
  {
    year: "2026",
    title: "School Growth & Recognition",
    shortDescription: "Continued growth in academic performance and regional recognition",
    description: "Kinyui Boys Secondary School has continued to grow steadily in academic excellence and discipline, gaining recognition within Machakos County for improved KCSE performance and holistic student development.",
    impact: "Improved academic reputation and increased student enrollment",
    stats: "Steady KCSE Improvement | Increased Enrollment",
    icon: <FiAward className="w-5 h-5" />,
    image: "/hero/MatG1.jpg",
    highlights: [
      "Improved KCSE performance over recent years",
      "Strengthened academic programs",
      "Increased student enrollment",
      "Recognition within Machakos County",
      "Focus on discipline and holistic education"
    ]
  },
  {
    year: "2025",
    title: "KCSE Performance Improvement",
    shortDescription: "Notable improvement in KCSE results compared to previous years",
    description: "The 2025 KCSE results showed a positive upward trend, reflecting the school's commitment to academic excellence, teacher dedication, and student discipline.",
    impact: "Higher university qualification rates and improved school ranking",
    stats: "Improved Mean Score | Higher University Transition",
    icon: <FiTrendingUp className="w-5 h-5" />,
    image: "/Matungulu/9.jpeg",
    highlights: [
      "Improved mean score compared to previous years",
      "More students qualifying for university entry",
      "Better subject performance across departments",
      "Enhanced academic support programs",
      "Strong teacher-student collaboration"
    ]
  },
  {
    year: "2025",
    title: "County Academic Recognition",
    shortDescription: "Recognized among improving schools in Machakos County",
    description: "Kinyui Boys has been acknowledged at the county level for its steady academic improvement and commitment to quality education.",
    impact: "Enhanced reputation and increased admissions",
    stats: "County Recognition | Academic Growth",
    icon: <FiStar className="w-5 h-5" />,
    image: "/Matungulu/29.jpeg",
    highlights: [
      "Recognized for academic improvement",
      "Improved ranking within the county",
      "Increased student applications",
      "Positive feedback from education stakeholders",
      "Stronger community support"
    ]
  },
  {
    year: "2024",
    title: "Co-Curricular Excellence",
    shortDescription: "Strong participation in sports and academic competitions",
    description: "Students actively participated in various co-curricular activities including sports, drama, and academic contests, representing the school at sub-county and county levels.",
    impact: "Holistic student development and talent nurturing",
    stats: "County Participation | Multiple Disciplines",
    icon: <FiTrendingUp className="w-5 h-5" />,
    image: "/Matungulu/37.jpeg",
    highlights: [
      "Participation in county-level sports competitions",
      "Drama and music festival involvement",
      "Academic contest participation",
      "Talent development programs",
      "Improved teamwork and leadership skills"
    ]
  },
  {
    year: "2024",
    title: "STEM Development",
    shortDescription: "Strengthening science and technology education",
    description: "The school has continued to invest in science and technology education, encouraging students to engage in innovation and practical learning.",
    impact: "Improved performance in STEM subjects",
    stats: "Enhanced Science Programs | Innovation Focus",
    icon: <FiAward className="w-5 h-5" />,
    image: "/Matungulu/26.jpeg",
    highlights: [
      "Improved science laboratory usage",
      "Encouragement of student innovation",
      "Participation in science contests",
      "Support for STEM subjects",
      "Mentorship by science teachers"
    ]
  },
];


  // Helper function to get achievements (API data or fallback)
const getAchievements = () => {
  // Check if API returned achievements AND they exist (count > 0)
  if (achievementsData?.achievements) {
    // Flatten the grouped achievements into an array
    const allAchievements = [];
    const grouped = achievementsData.achievements;
    
    // Count total achievements across all categories
    let totalCount = 0;
    Object.keys(grouped).forEach(category => {
      if (Array.isArray(grouped[category])) {
        totalCount += grouped[category].length;
      }
    });
    
    // If there are NO achievements (count < 1), use fallback
    if (totalCount < 1) {
      console.log('No achievements found in API, using fallback data');
      return achievements; // Return the static fallback achievements array
    }
    
    // Otherwise, map API achievements to expected format
    Object.keys(grouped).forEach(category => {
      if (Array.isArray(grouped[category])) {
        grouped[category].forEach(achievement => {
          allAchievements.push({
            ...achievement,
            year: achievement.year?.toString() || '',
            title: achievement.title || '',
            shortDescription: achievement.description?.substring(0, 100) + '...' || '',
            description: achievement.description || '',
            impact: achievement.awardingBody || 'Achievement',
            stats: `${achievement.category} | ${achievement.year}`,
            icon: getCategoryIcon(achievement.category),
            image: achievement.images && achievement.images.length > 0 
              ? achievement.images[0].url 
              : "/hero/MatG1.jpg",
            highlights: achievement.recipients || []
          });
        });
      }
    });
    
    // Sort by year (newest first)
    const sortedAchievements = allAchievements.sort((a, b) => (b.year || 0) - (a.year || 0)).slice(0, 5);
    
    // If after mapping we still have no achievements, use fallback
    if (sortedAchievements.length < 1) {
      return achievements;
    }
    
    return sortedAchievements;
  }
  
  // Fallback to static achievements array (defined in the component)
  return achievements;
};


const openAchievementModal = (achievement) => {
  setSelectedAchievement(achievement);
  setAchievementModalOpen(true);
  document.body.style.overflow = "hidden";
};

const closeAchievementModal = () => {
  setAchievementModalOpen(false);
  setSelectedAchievement(null);
  document.body.style.overflow = "auto";
};

// Helper to get category icon
const getCategoryIcon = (category) => {
  const icons = {
    'Academic': <FiAward className="w-5 h-5" />,
    'Sports': <FiAward className="w-5 h-5" />,
    'Arts': <FiAward className="w-5 h-5" />,
    'Leadership': <FiStar className="w-5 h-5" />,
    'Other': <FiAward className="w-5 h-5" />
  };
  return icons[category] || <FiAward className="w-5 h-5" />;
};


const whyChooseUs = [
  {
    id: 1,
    title: "Robust Academic Performance",
    description:
      "In recent KCSE (2024), Kinyui Boys Senior School showcased outstanding academic results with a wide range of high grades, reflecting a consistent commitment to excellence and comprehensive preparation of students for higher education. Our dedicated teaching staff ensures that every student receives personalized support, mentorship, and academic guidance, fostering both individual growth and collective success. The school’s culture encourages curiosity, discipline, and critical thinking, ensuring students are not only academically competent but also prepared for the challenges of the modern world.",
    shortDescription:
      "Strong KCSE academic performance and student preparation, emphasizing individual growth and readiness for higher education.",
    metrics: "Strong KCSE Results",
    icon: <FiAward className="w-5 h-5" />,
    image: { src: "/hero/st.jpeg", alt: "Academic Excellence" },
    color: "blue"
  },
  {
    id: 2,
    title: "Comprehensive CBC Pathways",
    description:
      "Kinyui Boys Senior School offers a diverse and comprehensive Competency-Based Curriculum (CBC) that covers STEM, Social Sciences, Arts, and Sports. These pathways provide students with the opportunity to discover and pursue their individual strengths while developing essential life skills. Through project-based learning, collaborative activities, and practical experiences, students gain both theoretical knowledge and hands-on skills. The school’s modern teaching approach ensures that learners are equipped to thrive in higher education and in their future professional careers, while also nurturing creativity, innovation, and problem-solving abilities.",
    shortDescription:
      "Diverse CBC pathways including STEM, Social Sciences, Arts, and Sports, fostering creativity, innovation, and life skills development.",
    metrics: "Diverse Curriculum",
    icon: <FiCpu className="w-5 h-5" />,
    image: { src: "/hero/student.jpeg", alt: "Infrastructure Development" },
    color: "indigo"
  },
  {
    id: 3,
    title: "Vibrant Student Life",
    description:
      "Beyond academics, Kinyui Boys Senior School offers a rich and engaging student life that includes clubs, mentorship programs, sports competitions, and leadership opportunities. These activities are designed to develop confidence, teamwork, discipline, and resilience. Students are encouraged to take initiative, participate in community service, and pursue extracurricular passions, creating a balanced and holistic development experience. Our strong sports programs, including football, athletics, and inter-school competitions, are celebrated achievements that promote school spirit, collaboration, and excellence across all areas of student life.",
    shortDescription:
      "Engaging student life with clubs, mentorship programs, and sports fostering confidence, leadership, and teamwork.",
    metrics: "Holistic Development",
    icon: <FiStar className="w-5 h-5" />,
    image: { src: "/hero/sports.jpeg", alt: "Athletic Excellence" },
    color: "amber"
  },
  {
    id: 4,
    title: "Caring School Community",
    description:
      "Kinyui Boys Senior School is built on a foundation of care, support, and community involvement. Teachers, parents, and school leaders work collaboratively to nurture students’ growth academically, socially, and emotionally. The school fosters a welcoming and inclusive environment where every student feels valued, supported, and empowered to reach their full potential. Through regular mentorship, counseling, and community engagement initiatives, students develop strong character, integrity, and social responsibility, ensuring they are prepared to be responsible leaders and active contributors to society.",
    shortDescription:
      "Supportive and inclusive school community promoting student growth, mentorship, and character development.",
    metrics: "Supportive Environment",
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
      title: `${studentCount}+ Students Enrolled`,
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
      description: "Comprehensive career guidance and university preparation. Consistent placement of Students to Kenyan universities with alumni success stories.",
      highlight: "University Bound",
      tags: ["Career Counseling", "University Placement", "Alumni Network"],
      icon: <FiCalendar className="w-5 h-5" />,
      span: "md:col-span-1",
      featured: true
    }
  ];

  // Create the scrolling images by duplicating the list for seamless loop
  // Tripled the images to make the restart less noticeable
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
                {description || 'Located in the heart of Matungulu, Machakos County, The Students are dedicated to nurturing students into confident, compassionate, and accomplished leaders.'}
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
    { label: 'Students', value: `${studentCount}+`, icon: '🧑🏾‍🎓' },
    { label: 'KCSE Target', value: '5.0', icon: '🎯' },
    { label: 'Motto', value: motto, icon: '🏆' }
  ].map((stat, idx) => (
    <div 
      key={idx} 
      className="relative p-3 sm:p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-center min-h-[80px] sm:min-h-[100px]"
    >
      <span className="absolute top-2 right-2 text-sm opacity-40">{stat.icon}</span>
      
      <p className={`font-black text-blue-600 leading-tight 
        ${stat.label === 'Motto' ? 'text-xs sm:text-sm' : 'text-xl sm:text-2xl'}`}
      >
        {stat.value}
      </p>
      
      <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-gray-400 mt-1">
        {stat.label}
      </p>
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
<img src={image.src} alt={image.alt} className="object-cover w-full h-full" />
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

{/* ===== KINYUI BOYS: HORIZONTAL BENTO CHRONICLE ===== */}
<section className="bg-white py-24 overflow-hidden">
  <div className="max-w-7xl mx-auto px-6 lg:px-8">
    
    {/* Minimalist Branded Header */}
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-20">
      <div className="space-y-4">
        <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-slate-900 shadow-xl shadow-slate-900/10">
          <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse"></span>
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white">The Kinyui Chronicle</span>
        </div>
        <h2 className="text-5xl md:text-7xl font-serif font-medium text-slate-900 tracking-tighter">
          Legacy <span className="italic text-slate-300">in Motion</span>
        </h2>
      </div>
      <p className="max-w-xs text-slate-400 text-xs font-bold uppercase tracking-widest leading-loose border-l-2 border-slate-100 pl-6">
        Mapping the evolution of excellence from our foundation to the current frontier.
      </p>
    </div>

    {achievementsLoading ? (
      <div className="flex flex-col items-center justify-center py-24">
        <FiLoader className="w-12 h-12 animate-spin text-maroon-700 mb-6" />
        <p className="text-slate-400 font-black uppercase tracking-[0.4em] text-[10px]">Accessing Archives...</p>
      </div>
    ) : (
      /* The Scrollable Canvas */
      <div className="relative overflow-x-auto pb-12 no-scrollbar">
        <div className="flex gap-8 min-w-max px-4">
          {getAchievements().map((item, idx) => (
            <div 
              key={idx} 
              className="w-[350px] md:w-[450px] flex flex-col gap-6"
            >
              {/* Year Indicator / Connector */}
              <div className="flex items-center gap-4">
                <span className="text-5xl font-serif font-bold italic text-slate-100 tracking-tighter group-hover:text-amber-500 transition-colors">
                  {item.year}
                </span>
                <div className="h-px flex-1 bg-slate-100" />
                <div className="w-3 h-3 rounded-full border-2 border-slate-200" />
              </div>

              {/* The Bento Card */}
              <div className="bg-slate-50 rounded-[2.5rem] p-8 md:p-10 border border-slate-100 flex flex-col justify-between min-h-[400px] shadow-sm transition-all duration-500 hover:bg-white hover:shadow-2xl hover:shadow-slate-200/50 hover:-translate-y-2">
                
                <div className="space-y-6">
                  {/* Category & Icon */}
                  <div className="flex items-center justify-between">
                    <div className="w-14 h-14 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center text-maroon-700 text-2xl">
                      {item.icon || <FiAward />}
                    </div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Record #{idx + 1}
                    </span>
                  </div>

                  {/* Text Content */}
                  <div className="space-y-3">
                    <h3 className="text-2xl font-serif font-bold text-slate-900 leading-tight">
                      {item.title}
                    </h3>
                    <p className="text-slate-500 text-sm font-medium leading-relaxed line-clamp-4">
                      {item.shortDescription || item.description}
                    </p>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="pt-8 border-t border-slate-100 mt-auto flex items-center justify-between">
                   <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Verified Achievement</span>
                   </div>
                   <button
                    onClick={() => openAchievementModal(item)}
                    className="p-4 bg-slate-900 text-white rounded-2xl hover:bg-maroon-700 transition-all active:scale-90"
                  >
                    <FiArrowRight />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* End of Line Cap */}
          <div className="w-[200px] flex items-center justify-center">
             <div className="flex flex-col items-center gap-4 text-slate-300">
                <FiPlusCircle size={40} className="opacity-20" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em]">Future Chapter</span>
             </div>
          </div>
        </div>
      </div>
    )}
  </div>
</section>

      {/* === UNIVERSITY LOGOS SCROLLER - FIXED FOR MOBILE === */}
      <section className="bg-gray-50 border-t border-gray-200 py-12">
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto">
            {/* Header Section - Fixed for mobile */}
            <div className="text-center mb-12">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600 block mb-2">
                Our Partners
              </span>
              {/* Title - No flex wrap on mobile, full width */}
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 whitespace-normal break-words">
                University{" "}
                <span className="bg-gradient-to-r from-red-800 to-rose-500 bg-clip-text text-transparent whitespace-normal break-words">
                  Collaborations
                </span>
              </h3>
              {/* Description - Full width on mobile */}
              <p className="mt-4 text-black text-sm sm:text-base md:text-lg leading-relaxed w-full md:w-[70%] px-2 sm:px-0">
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
                  animation: 'marquee 120s linear infinite',
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




      {/* ===== KINYUI BOYS ACHIEVEMENT DETAIL MODAL ===== */}
{achievementModalOpen && selectedAchievement && (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md transition-all duration-300"
    onClick={closeAchievementModal}
  >
    <div
      className="relative bg-white rounded-[2.5rem] max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] animate-in fade-in zoom-in duration-500 flex flex-col border border-white/10"
      onClick={(e) => e.stopPropagation()}
    >
      {/* 1. ARCHITECTURAL HEADER */}
      <div className="bg-slate-900 p-6 sm:p-10 text-white shrink-0 relative overflow-hidden">
        {/* Subtle Branding Accent */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-maroon-600/20 to-transparent skew-x-12 translate-x-20 pointer-events-none" />
        
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 bg-gradient-to-br from-maroon-700 to-amber-600 rounded-2xl flex items-center justify-center shadow-xl border border-white/20">
              <div className="text-white text-3xl">
                {selectedAchievement.icon}
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-black bg-amber-500 text-slate-900 px-3 py-1 rounded-full uppercase tracking-widest">
                  Class of {selectedAchievement.year}
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                  <FiAward className="text-amber-500" /> Kinyui Excellence
                </span>
              </div>
              <h3 className="text-2xl sm:text-4xl font-serif font-bold tracking-tight">
                {selectedAchievement.title}
              </h3>
            </div>
          </div>
          
          <button
            onClick={closeAchievementModal}
            className="w-12 h-12 rounded-2xl bg-white/5 hover:bg-red-500/20 hover:text-red-400 flex items-center justify-center transition-all border border-white/10 group"
          >
            <FiX className="w-6 h-6 group-active:scale-90" />
          </button>
        </div>
      </div>

      {/* 2. MODAL CONTENT (Bento Style) */}
      <div className="overflow-y-auto flex-1 bg-slate-50/50">
        <div className="grid grid-cols-1 lg:grid-cols-12">
          
          {/* Left Side: Media & Context (7 Cols) */}
          <div className="lg:col-span-7 p-6 sm:p-10 space-y-8">
            {selectedAchievement.image && (
              <div className="relative h-64 sm:h-80 w-full rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white">
                <Image
                  src={selectedAchievement.image}
                  alt={selectedAchievement.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent" />
              </div>
            )}

            <div className="space-y-4">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-2">
                <FiBookOpen className="text-maroon-600" />
                The Achievement Narrative
              </h4>
              <p className="text-lg text-slate-700 leading-relaxed font-medium italic">
                "{selectedAchievement.description}"
              </p>
            </div>
          </div>

          {/* Right Side: Stats & Highlights (5 Cols) */}
          <div className="lg:col-span-5 p-6 sm:p-10 bg-white border-l border-slate-100 flex flex-col gap-6">
            
            {/* Impact Cards */}
            <div className="grid grid-cols-1 gap-4">
              <div className="p-5 bg-maroon-50 rounded-[1.5rem] border border-maroon-100">
                <p className="text-[10px] font-black text-maroon-700 uppercase tracking-widest mb-2">Metric Impact</p>
                <p className="text-xl font-serif font-bold text-slate-900">{selectedAchievement.stats}</p>
              </div>
              <div className="p-5 bg-blue-50 rounded-[1.5rem] border border-blue-100">
                <p className="text-[10px] font-black text-blue-700 uppercase tracking-widest mb-2">Social Reach</p>
                <p className="text-xl font-serif font-bold text-slate-900">{selectedAchievement.impact}</p>
              </div>
            </div>

            {/* Highlights List */}
            {selectedAchievement.highlights && (
              <div className="flex-1 space-y-4">
                <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Key Milestones</h5>
                <div className="space-y-3">
                  {selectedAchievement.highlights.map((highlight, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <div className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                      <span className="text-sm font-bold text-slate-700 leading-tight">{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3. THE "SA KINYUI" FOOTER */}
      <div className="px-10 py-6 border-t border-slate-100 bg-white flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-maroon-900 flex items-center justify-center text-[10px] font-black text-white">SA</div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
            Kinyui Boys Senior School <span className="mx-2 text-slate-200">|</span> Knowledge is Power
          </p>
        </div>
        <button 
          onClick={closeAchievementModal}
          className="px-8 py-3 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-maroon-700 transition-all shadow-lg"
        >
          Close Record
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default ModernSchoolLayout;