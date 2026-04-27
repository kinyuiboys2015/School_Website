"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  FiAward,
  FiBook,
  FiHeart,
  FiMapPin,
  FiUsers,
  FiCalendar,
  FiShield,
  FiStar,
  FiTrendingUp,
  FiGlobe,
  FiMail,
  FiPhone,
  FiArrowRight,
  FiChevronRight,
  FiChevronLeft,
  FiTarget,
  FiEye,
  FiBookOpen,
  FiLoader,
  FiCheckCircle,
  FiExternalLink,
  FiLayers,
  FiCpu,
  FiActivity,
  FiPenTool,
  FiDroplet,
  FiX,
  FiZap,
  FiTrendingDown,
  FiChevronDown,
} from "react-icons/fi";
import {
  IoSparkles,
  IoFlaskOutline,
  IoAccessibilityOutline,
  IoNewspaperOutline,
  IoRibbonSharp,
  IoRadarOutline,
  IoAtomOutline,
} from "react-icons/io5";
import { HiOutlineSparkles, HiArrowSmallRight } from "react-icons/hi2";

const ModernSchoolLayout = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [schoolData, setSchoolData] = useState(null);
  const [uniImages, setUniImages] = useState([]);
  const [imagesLoading, setImagesLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [expandedCards, setExpandedCards] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPathway, setSelectedPathway] = useState(null);
  const [selectedAchievement, setSelectedAchievement] = useState(null);
  const [achievementModalOpen, setAchievementModalOpen] = useState(false);

  // Add these state variables
const [achievementsData, setAchievementsData] = useState(null);
const [schoolStatsData, setSchoolStatsData] = useState(null);
const [achievementsLoading, setAchievementsLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(false);
  // School images for carousel
  const schoolImages = [
    { src: "/cumpus.jpg", alt: "Campus life" },
    { src: "/academics.jpg", alt: "Academic focus" },
    { src: "/student.jpg", alt: "Students learning" },
    { src: "/view.jpg", alt: "School environment" },
    { src: "/worship.jpg", alt: "Community moment" },
    { src: "/displine.jpg", alt: "Student leadership" },
  ];

  // Fetch school data
  useEffect(() => {
    fetch("/api/school")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.school) setSchoolData(data.school);
      })
      .catch((err) => console.error("Error fetching school data:", err))
      .finally(() => setLoading(false));
  }, []);

  // Fetch university logos
  useEffect(() => {
    fetch("/api/unis")
      .then((res) => res.json())
      .then((data) => {
        const imgs = data.images || [];
        for (let i = imgs.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [imgs[i], imgs[j]] = [imgs[j], imgs[i]];
        }
        setUniImages(imgs);
      })
      .catch(() => setUniImages([]))
      .finally(() => setImagesLoading(false));
  }, []);

  // Auto-advance carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % schoolImages.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [schoolImages.length]);

  const nextImage = () =>
    setCurrentImageIndex((prev) => (prev + 1) % schoolImages.length);
  const prevImage = () =>
    setCurrentImageIndex(
      (prev) => (prev - 1 + schoolImages.length) % schoolImages.length
    );

  const toggleReadMore = (id) => {
    setExpandedCards((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleExplorePathways = () => {
    router.push("/pages/admissions");
  };

  const openModal = (pathway) => {
    setSelectedPathway(pathway);
    setModalOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedPathway(null);
    document.body.style.overflow = "auto";
  };

  const schoolName = schoolData?.name || "Senior School";
  const motto = schoolData?.motto || "Excellence With Integrity";
  const vision =
    schoolData?.vision ||
    "To nurture curious, capable learners prepared for leadership and service.";
  const mission =
    schoolData?.mission ||
    "To provide a supportive, future-ready education that builds knowledge, character, and skill.";
  const description = schoolData?.description;
  const studentCount = schoolData?.studentCount || 400;
  const contactEmail = schoolData?.admissionContactEmail || "";
  const contactPhone = schoolData?.admissionContactPhone || "";

  // Double images for seamless scrolling
  const scrollImages = [...uniImages, ...uniImages];




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




// Fetch achievements and school stats
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

    try {
      // Fetch school stats
      const statsRes = await fetch('/api/school-stats');
      const statsResult = await statsRes.json();
      
      if (statsResult.success && statsResult.stats) {
        setSchoolStatsData(statsResult.stats);
      } else {
        console.warn('No school stats found, using fallback');
        setSchoolStatsData(null);
      }
    } catch (error) {
      console.error('Error fetching school stats:', error);
      setSchoolStatsData(null);
    } finally {
      setStatsLoading(false);
    }
  };

  fetchAchievementsAndStats();
}, []);





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
              : "/hero/env.jpeg",
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

// Helper function to get school stats (API data or fallback)
const getSchoolStats = () => {
  if (schoolStatsData) {
    return {
      meanScore: schoolStatsData.meanScore || 8.14,
      lastYearMean: schoolStatsData.lastYearMean || 7.85,
      targetMean: schoolStatsData.targetMean || 8.50,
      slogan: schoolStatsData.slogan || motto,
      sloganDescription: schoolStatsData.sloganDescription || '',
      sloganAuthor: schoolStatsData.sloganAuthor || ''
    };
  }
  
  // Fallback stats
  return {
    meanScore: 8.14,
    lastYearMean: 7.85,
    targetMean: 8.50,
    slogan: motto,
    sloganDescription: '',
    sloganAuthor: ''
  };
};




  const colorMap = {
    emerald: {
      bg: "bg-emerald-600",
      light: "bg-emerald-50",
      text: "text-emerald-600",
      border: "border-emerald-200",
    },
    blue: {
      bg: "bg-blue-600",
      light: "bg-blue-50",
      text: "text-blue-600",
      border: "border-blue-200",
    },
  };

  const whyChooseUs = [
    {
      id: 1,
      color: "emerald",
      title: "Academic Excellence",
      shortDescription:
        "A rigorous learning culture supported by mentorship and clear standards.",
      description:
        "A rigorous learning culture supported by mentorship, structured revision programs, and a focus on mastery. Learners are guided to set goals, track progress, and build strong academic habits.",
      metrics: "High Achievement",
      icon: <FiAward size={20} />,
      image: "/academics.jpg",
    },
    {
      id: 2,
      color: "emerald",
      title: "Holistic Development",
      shortDescription:
        "Clubs, sports, arts, and leadership alongside strong academics.",
      description:
        "Clubs, sports, arts, and leadership programs complement classroom learning. Students grow confidence, teamwork, and communication through structured co-curricular experiences.",
      metrics: "Beyond Classroom",
      icon: <FiUsers size={20} />,
      image: "/hero/sports.jpeg",
    },
    {
      id: 3,
      color: "emerald",
      title: "Student Support",
      shortDescription:
        "Guidance, mentorship, and a culture that helps learners thrive.",
      description:
        "Guidance, mentorship, and a culture of care help students thrive academically and personally. We prioritize wellbeing, discipline, and student leadership development.",
      metrics: "Mentorship",
      icon: <FiShield size={20} />,
      image: "/student.jpg",
    },
    {
      id: 4,
      color: "emerald",
      title: "Modern Facilities",
      shortDescription: "Practical spaces for science, tech, arts, and independent study.",
      description:
        "Practical spaces for science, tech, arts, and independent study. Facilities are designed to support hands-on learning, research, and collaboration.",
      metrics: "Learning Spaces",
      icon: <FiGlobe size={20} />,
      image: "/cumpus.jpg",
    },
  ];

  const schoolFeatures = [
  {
  title: "Academic Excellence",
  gradient: "from-indigo-600 to-sky-500",
  description:
    "A culture of high expectations supported by mentorship, structure, and a strong learning community.",
  highlight: "Excellence in Learning",
  details: ["Holistic Education", "Critical Thinking", "Student Growth", "Strong Academic Culture"],
  metrics: ["8.0+ Mean", "80%+ Uni", "90% Pass"],
  icon: <FiAward />,
  isPremium: false,
},
    {
      title: "Experienced Faculty",
      gradient: "from-emerald-600 to-teal-500",
      description:
        "Qualified educators focused on clarity, consistency, and personalized support for every learner.",
      highlight: "Qualified Educators",
      details: ["TSC Certified", "Subject Specialists", "Mentorship", "Training"],
      metrics: ["45 Teachers", "18+ Years", "100% TSC"],
      icon: <FiUsers />,
      isPremium: false,
    },
    {
      title: "Modern Learning Environment",
      gradient: "from-violet-600 to-fuchsia-500",
      description:
        "Learning spaces built for practical work, collaboration, and technology-enabled instruction.",
      highlight: "Advanced Facilities",
      details: ["3 Science Labs", "2 Computer Labs", "Library", "Sports Fields"],
      metrics: ["3 Labs", "2 Comp Labs", "8,000 Books"],
      icon: <FiMapPin />,
      isPremium: false,
    },
    {
      title: "Co-curricular Activities",
      gradient: "from-amber-600 to-orange-500",
      description:
        "We offer diverse extracurricular activities including sports, music, drama, clubs, and leadership programs.",
      highlight: "15+ Activities",
      details: ["Athletics", "Ball Games", "Music & Drama", "Journalism"],
      metrics: ["8 Sports", "15 Clubs", "Events"],
      icon: <FiStar />,
      isPremium: false,
    },
    {
      title: "Values & Character",
      gradient: "from-slate-800 to-slate-600",
      description:
        "We emphasize integrity, discipline, and service—building character and leadership alongside academic growth.",
      highlight: "Character Building",
      details: ["Integrity", "Discipline", "Service", "Leadership"],
      metrics: ["Leadership", "Service", "Discipline"],
      icon: <FiHeart />,
      isPremium: false,
    },
    {
      title: "University & Career Preparation",
      gradient: "from-emerald-700 to-teal-600",
      description:
        "We provide comprehensive career guidance and university linkage programs for smooth transition to higher education.",
      highlight: "University Pathways",
      details: ["Career Counseling", "University Tours", "Alumni Network", "Scholarships"],
      metrics: ["15+ Partners", "Career Fairs", "Success"],
      icon: <FiTrendingUp />,
      isPremium: true,
    },
  ];

  const achievements = [
  {
    year: "2026",
    title: "National Recognition",
    shortDescription:
      "Recognized for excellence in learning outcomes and student support.",
    description: `In April 2026, ${schoolName} was recognized for sustained improvement across academics, co-curricular performance, and student support systems. The recognition followed a comprehensive review of learning outcomes, infrastructure, and leadership structures—marking a new chapter in our journey toward excellence.`,
    impact: "Higher standards, stronger partnerships, broader opportunities",
    stats: "Recognition | April 2026",
    icon: <FiAward className="w-5 h-5" />,
    image: "/hero/env.jpeg",
    highlights: [
      "Comprehensive review of outcomes and systems",
      "Improved learning resources and support programs",
      "Stronger partnerships and community engagement",
      "A new chapter focused on excellence and impact"
    ]
  },
  {
    year: "2025",
    title: "Record Academic Performance",
    shortDescription:
      "Strong results and improved university and career readiness outcomes.",
    description: `The 2025 results reflected steady growth in performance, consistency, and learner confidence. Through structured revision, mentoring, and targeted support, ${schoolName} strengthened outcomes across the grade distribution and improved transitions to the next level.`,
    impact: "Improved results, stronger consistency, better transitions",
    stats: "Academic Milestone | 2025",
    icon: <FiTrendingUp className="w-5 h-5" />,
    image: "/academics.jpg",
    highlights: [
      "Structured revision and mentorship programs",
      "Improved performance consistency across subjects",
      "Stronger learner confidence and exam readiness",
      "Better transitions to the next level"
    ]
  },
  {
    year: "2025",
    title: "Top County Ranking",
    shortDescription:
      "Recognized among the top-performing public schools in the county.",
    description: `Beyond individual performance, ${schoolName} was recognized among leading public schools based on learning outcomes, consistency, retention, and co-curricular achievement. The recognition affirmed our commitment to high standards and continuous improvement.`,
    impact: "Higher visibility, stronger confidence, community trust",
    stats: "County Ranking | 2025",
    icon: <FiStar className="w-5 h-5" />,
    image: "/view.jpg",
    highlights: [
      "Recognition for consistent learning outcomes",
      "Strong student retention and wellbeing support",
      "Balanced performance in academics and activities",
      "Increased community trust and applications"
    ]
  },
  {
    year: "2024",
    title: "Most Improved School",
    shortDescription:
      "Recognized for measurable improvement in outcomes and systems.",
    description:
      "A sustained improvement journey led to recognition for measurable gains in learning outcomes, student support systems, and school-wide culture. Strategic interventions and strong home–school collaboration helped accelerate progress.",
    impact: "Demonstrated growth, stronger systems, higher confidence",
    stats: "Improvement Award | 2024",
    icon: <FiTrendingUp className="w-5 h-5" />,
    image: "/cumpus.jpg",
    highlights: [
      "Measurable gains over multiple years",
      "Stronger support programs and learning routines",
      "Improved infrastructure and learning resources",
      "Enhanced community engagement"
    ]
  },
  {
    year: "2024",
    title: "National Science Fair",
    shortDescription: "Awarded for innovation and problem-solving in STEM.",
    description:
      "Students delivered an award-winning innovation project that showcased practical problem-solving and teamwork. The experience strengthened research skills, presentation confidence, and real-world application of STEM learning.",
    impact: "Innovation culture, stronger STEM visibility, mentorship wins",
    stats: "STEM Innovation | 2024",
    icon: <FiAward className="w-5 h-5" />,
    image: "/hero/env.jpeg",
    highlights: [
      "Award-winning innovation project",
      "Strong mentorship and teamwork",
      "Improved research and presentation skills",
      "Real-world application of STEM learning"
    ]
  },
];




  // CBC Pathways Data
  const pathways = [
 {
  id: "stem",
  name: "STEM Pathway",
  icon: IoFlaskOutline,
  color: "from-blue-600 to-cyan-500",
  description: "Science, Technology, Engineering & Mathematics",
  subjects: ["Maths", "Integrated Science", "Computer Science", "Pre-Tech", "Health Ed"],
  careers: [
    "Medical Doctor",
    "Surgeon",
    "Pediatrician",
    "Cardiologist",
    "Neurologist",
    "Pharmacist",
    "Clinical Pharmacologist",
    "Nursing Officer",
    "Registered Nurse (RN)",
    "Nurse Anesthetist",
    "Dentist",
    "Orthodontist",
    "Veterinarian",
    "Radiologist",
    "Medical Lab Scientist",
    "Laboratory Technician",
    "Public Health Officer",
    "Epidemiologist",
    "Physiotherapist",
    "Occupational Therapist",
    "Speech Therapist",
    "Nutritionist / Dietitian",
    "Optometrist",
    "Audiologist",

    // Engineering
    "Civil Engineer",
    "Structural Engineer",
    "Mechanical Engineer",
    "Electrical Engineer",
    "Electronic Engineer",
    "Chemical Engineer",
    "Biomedical Engineer",
    "Aerospace Engineer",
    "Automotive Engineer",
    "Petroleum Engineer",
    "Mining Engineer",
    "Geotechnical Engineer",
    "Environmental Engineer",
    "Agricultural Engineer",
    "Food Process Engineer",
    "Textile Engineer",
    "Marine Engineer",
    "Robotics Engineer",
    "Mechatronics Engineer",
    "Instrumentation Engineer",

    // Technology & Computing
    "Software Engineer",
    "Web Developer",
    "Mobile App Developer",
    "Game Developer",
    "Data Scientist",
    "Data Analyst",
    "Database Administrator",
    "Cybersecurity Expert",
    "Network Engineer",
    "Cloud Architect",
    "DevOps Engineer",
    "AI / Machine Learning Engineer",
    "IT Project Manager",
    "Systems Analyst",
    "IT Support Specialist",
    "Embedded Systems Engineer",
    "UI/UX Designer (Tech-focused)",
    "Blockchain Developer",

    // Physical & Natural Sciences
    "Physicist",
    "Astronomer",
    "Astrophysicist",
    "Chemist",
    "Analytical Chemist",
    "Industrial Chemist",
    "Biochemist",
    "Molecular Biologist",
    "Microbiologist",
    "Geneticist",
    "Biotechnologist",
    "Geologist",
    "Seismologist",
    "Volcanologist",
    "Meteorologist",
    "Oceanographer",
    "Environmental Scientist",
    "Forensic Scientist",
    "Materials Scientist",
    "Nanotechnologist",

    // Mathematics & Data
    "Mathematician",
    "Statistician",
    "Actuary",
    "Quantitative Analyst",
    "Operations Researcher",
    "Econometrician",
    "Cryptographer",
    "Data Engineer",

    // Architecture & Design
    "Architect",
    "Landscape Architect",
    "Urban Planner",
    "Interior Designer (Tech/Arch background)",
    "Quantity Surveyor",
    "Construction Manager",

    // Agriculture & Environment
    "Agricultural Scientist",
    "Agronomist",
    "Crop Scientist",
    "Soil Scientist",
    "Horticulturist",
    "Fisheries Scientist",
    "Forestry Scientist",
    "Wildlife Biologist",
    "Conservation Scientist",
    "Climate Change Analyst",

    // Transport & Aviation
    "Pilot (Commercial/Aviation)",
    "Aircraft Maintenance Engineer",
    "Air Traffic Controller",
    "Drone Operator / Engineer",
    "Locomotive Engineer",
    "Marine Navigator",

    // Emerging & Interdisciplinary STEM
    "Bioinformatician",
    "Clinical Research Associate",
    "Genomic Counselor",
    "Renewable Energy Engineer",
    "Solar Energy Technician",
    "Wind Energy Engineer",
    "Nuclear Engineer",
    "Space Scientist",
    "Remote Sensing Specialist",
    "GIS Analyst",
    "Patent Examiner (STEM field)",
    "Science Communicator / Writer",
    "STEM Educator / Teacher"
  ],
},
 {
  id: "arts",
  name: "Arts & Sports",
  icon: IoAccessibilityOutline,
  color: "from-purple-600 to-pink-500",
  description: "Creative Arts, Performing Arts & Athletic Excellence",
  subjects: ["Visual Arts", "Music", "PE", "Creative Design", "Performing Arts"],
  careers: [
    // Visual Arts & Design
    "Graphic Designer",
    "Fashion Designer",
    "Interior Designer",
    "Fine Artist",
    "Sculptor",
    "UI/UX Designer",
    "Industrial Designer",
    "Architectural Illustrator",
    "Art Director",
    "Concept Artist",
    "Illustrator",
    "Calligrapher",
    "Textile Designer",
    "Jewelry Designer",
    "Curator",
    "Art Gallery Manager",
    "Art Restorer",
    "Ceramist",
    "Landscape Designer",
    "Exhibition Designer",

    // Performing Arts & Music
    "Music Producer",
    "Film Director",
    "Actor",
    "Dancer",
    "Choreographer",
    "Voice Actor",
    "Singer / Vocalist",
    "Orchestra Conductor",
    "Composer",
    "Sound Engineer",
    "Music Therapist",
    "Theatre Manager",
    "Scriptwriter",
    "Stage Manager",
    "Lighting Designer",
    "Costume Designer",
    "Makeup Artist (Film/Theatre)",
    "Talent Agent",
    "Cinematographer",
    "Film Editor",

    // Sports, Fitness & Athletics
    "Professional Athlete",
    "Sports Coach",
    "Fitness Trainer",
    "Sports Psychologist",
    "Athletic Trainer",
    "Sports Physiotherapist",
    "Referee / Umpire",
    "Sports Statistician",
    "Gym Manager",
    "Sports Scout",
    "Kinesiologist",
    "Sports Nutritionist",
    "Yoga Instructor",
    "Personal Trainer",
    "Physical Education Teacher",
    "Outdoor Education Guide",
    "Sports Agent",
    "Recreation Director",
    "Stunt Coordinator",

    // Media, Journalism & Digital Arts
    "Sports Journalist",
    "Photojournalist",
    "Animator",
    "Game Designer",
    "VFX Artist",
    "Digital Content Creator",
    "Video Editor",
    "Creative Director",
    "Advertising Manager",
    "Event Manager",
    "Public Relations Specialist",
    "Social Media Manager",
    "Podcast Producer",
    "Multimedia Artist",
    "Brand Identity Developer",
    "Copywriter",
    "Arts Administrator",
    "Broadcasting Presenter",
    "Sports Commentator",
    "Tourism & Cultural Officer"
  ],
},
 {
  id: "social",
  name: "Social Sciences",
  icon: IoNewspaperOutline,
  color: "from-amber-600 to-orange-500",
  description: "Humanities, Languages & Civic Education",
  subjects: ["Social Studies", "Religious Ed", "Business", "Languages", "Life Skills"],
  careers: [
    // ========== LAW & GOVERNANCE ==========
    "Advocate / Lawyer",
    "Judge / Magistrate",
    "Prosecutor",
    "Legal Researcher",
    "Paralegal",
    "Legal Secretary",
    "Diplomat",
    "Foreign Service Officer",
    "Intelligence Officer",
    "Immigration Officer",
    "Customs Officer",
    "Probation Officer",
    "Correctional Officer",
    "Parliamentary Clerk",
    "Legislative Aide",
    "Policy Analyst",
    "Government Administrator",
    "Cabinet Secretary (Advisor role)",
    "Ombudsman",
    "Election Officer",

    // ========== BUSINESS & FINANCE ==========
    "Accountant (CPA)",
    "Auditor",
    "Financial Analyst",
    "Investment Banker",
    "Stockbroker",
    "Credit Analyst",
    "Loan Officer",
    "Insurance Underwriter",
    "Actuary (Business side)",
    "Tax Consultant",
    "Payroll Manager",
    "Budget Analyst",
    "Treasury Manager",
    "Risk Manager",
    "Compliance Officer",
    "Forensic Accountant",
    "Business Development Manager",
    "Entrepreneur",
    "Small Business Owner",
    "Franchise Manager",
    "Retail Manager",
    "Supply Chain Manager",
    "Logistics Coordinator",
    "Procurement Officer",
    "Warehouse Manager",
    "E-commerce Manager",
    "Digital Marketer",
    "SEO Specialist",
    "Brand Manager",
    "Advertising Executive",
    "Marketing Research Analyst",
    "Sales Manager",
    "Real Estate Agent",
    "Property Manager",
    "Valuer",

    // ========== HUMAN RESOURCES ==========
    "HR Manager",
    "Recruitment Specialist",
    "Talent Acquisition Officer",
    "Training & Development Officer",
    "Performance Manager",
    "Compensation Analyst",
    "Employee Relations Specialist",
    "HR Generalist",
    "Payroll Administrator",
    "Organizational Psychologist",
    "Labor Relations Officer",
    "Union Representative",
    "Career Counselor",

    // ========== PSYCHOLOGY & COUNSELING ==========
    "Psychologist (Clinical)",
    "Counseling Psychologist",
    "Educational Psychologist",
    "Industrial Psychologist",
    "Sports Psychologist",
    "Forensic Psychologist",
    "Child Psychologist",
    "School Counselor",
    "Guidance Counselor",
    "Marriage & Family Therapist",
    "Addiction Counselor",
    "Trauma Counselor",
    "Rehabilitation Counselor",
    "Crisis Hotline Operator",
    "Mental Health Technician",

    // ========== SOCIOLOGY & SOCIAL WORK ==========
    "Sociologist",
    "Social Worker",
    "Community Development Officer",
    "NGO Program Officer",
    "Humanitarian Aid Worker",
    "Case Manager",
    "Child Protection Officer",
    "Gender Equality Officer",
    "Disability Rights Advocate",
    "Elderly Care Coordinator",
    "Homeless Shelter Manager",
    "Refugee Resettlement Officer",
    "Poverty Alleviation Specialist",
    "Rural Development Officer",
    "Urban Community Organizer",

    // ========== CRIMINOLOGY & SECURITY ==========
    "Criminologist",
    "Police Officer",
    "Detective / Investigator",
    "Crime Scene Analyst",
    "Forensic Psychologist (Criminal)",
    "Correctional Counselor",
    "Juvenile Justice Officer",
    "Private Investigator",
    "Security Manager",
    "Loss Prevention Officer",
    "Cybercrime Analyst (Policy side)",
    "Victim Advocate",
    "Court Liaison",

    // ========== ECONOMICS & DEVELOPMENT ==========
    "Economist",
    "Development Economist",
    "Agricultural Economist",
    "Environmental Economist",
    "Health Economist",
    "Labor Economist",
    "Monetary Policy Analyst",
    "Central Bank Officer",
    "Trade Analyst",
    "International Trade Specialist",
    "WTO Affairs Officer",
    "Economic Researcher",
    "Statistician (Social stats)",
    "Demographer",
    "Population Analyst",
    "Project Planner",
    "Monitoring & Evaluation Officer",
    "Impact Assessment Specialist",

    // ========== JOURNALISM & MEDIA ==========
    "Journalist",
    "News Reporter",
    "Investigative Journalist",
    "Broadcast Journalist",
    "News Anchor",
    "Radio Presenter",
    "TV Producer",
    "Editor",
    "Copywriter",
    "Content Creator",
    "Social Media Manager",
    "Digital Content Strategist",
    "Public Relations Officer (PRO)",
    "Corporate Communications Manager",
    "Press Secretary",
    "Media Relations Specialist",
    "Communications Officer",
    "Blogger",
    "Podcaster",
    "Documentary Filmmaker",

    // ========== LANGUAGES & TRANSLATION ==========
    "Translator",
    "Interpreter (Simultaneous)",
    "Court Interpreter",
    "Medical Interpreter",
    "Localization Specialist",
    "Language Teacher",
    "Linguist",
    "Lexicographer (Dictionary maker)",
    "Proofreader",
    "Editor (Publications)",
    "Technical Writer",
    "Grant Writer",
    "Speechwriter",
    "Copy Editor",

    // ========== ARCHIVES & LIBRARY ==========
    "Archivist",
    "Librarian",
    "Digital Archivist",
    "Records Manager",
    "Museum Curator",
    "Heritage Manager",
    "Conservator",
    "Documentation Officer",
    "Information Officer",
    "Knowledge Manager",

    // ========== EDUCATION & TRAINING ==========
    "Teacher (Primary/Secondary)",
    "Lecturer (University)",
    "Curriculum Developer",
    "Education Officer",
    "School Administrator",
    "Principal",
    "Education Inspector",
    "Special Needs Educator",
    "Adult Education Trainer",
    "Vocational Trainer",
    "E-learning Designer",
    "Educational Consultant",
    "Tuition Center Owner",

    // ========== POLITICAL SCIENCE & PUBLIC POLICY ==========
    "Political Scientist",
    "Public Policy Analyst",
    "Legislative Analyst",
    "Campaign Manager",
    "Political Consultant",
    "Lobbyist",
    "Public Affairs Officer",
    "City Planner",
    "Regional Planner",
    "Transportation Planner",
    "Environmental Policy Advisor",
    "Health Policy Analyst",
    "Education Policy Researcher",
    "Housing Policy Specialist",

    // ========== GEOGRAPHY & URBAN PLANNING ==========
    "Urban Planner",
    "Regional Planner",
    "Transportation Planner",
    "Land Use Planner",
    "Geographer (Human)",
    "Cartographer (Social mapping)",
    "GIS Analyst (Social applications)",
    "Community Planner",
    "Housing Officer",
    "Zoning Inspector",
    "Real Estate Developer (Planning side)",

    // ========== RELIGIOUS & ETHICAL STUDIES ==========
    "Religious Leader (Pastor/Imam/Priest/Rabbi)",
    "Theologian",
    "Ethicist",
    "Chaplain (Hospital/Military/Prison)",
    "Religious Education Teacher",
    "Missionary",
    "Interfaith Coordinator",
    "Nonprofit Director (Faith-based)",
    "Ethics Committee Member",

    // ========== TOURISM & HOSPITALITY (Social side) ==========
    "Tour Guide",
    "Travel Agent",
    "Tour Operator",
    "Hotel Manager",
    "Event Planner",
    "Conference Organizer",
    "Cultural Officer",
    "Ecotourism Coordinator",
    "Heritage Site Manager",
    "Museum Guide",
    "Guest Relations Officer",

    // ========== INTERNATIONAL RELATIONS ==========
    "International Relations Officer",
    "UN Program Officer",
    "NGO Country Director",
    "Peace Corps Volunteer (Coordinator)",
    "Conflict Resolution Specialist",
    "Mediation Expert",
    "Human Rights Officer",
    "Refugee Protection Officer",
    "International Development Consultant",
    "Global Health Policy Advisor",
  ],
},
  ];

  return (
    <div className="min-h-screen bg-[#f6f7fb] text-slate-900 overflow-x-hidden">
      {/* ===== HERO (Bento Modern) ===== */}
      <section className="relative py-16 sm:py-20 lg:py-24">
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 left-1/2 h-[30rem] w-[30rem] -translate-x-1/2 rounded-full bg-gradient-to-br from-indigo-200/70 via-sky-200/40 to-emerald-200/30 blur-3xl" />
          <div className="absolute -bottom-28 left-10 h-[22rem] w-[22rem] rounded-full bg-gradient-to-br from-violet-200/40 to-fuchsia-200/20 blur-3xl" />
          <div className="absolute top-24 right-10 h-[20rem] w-[20rem] rounded-full bg-gradient-to-br from-sky-200/35 to-indigo-200/20 blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
            
            {/* Left Card */}
            <div className="order-2 lg:order-1 lg:col-span-5">
              <div className="h-full rounded-3xl border border-slate-200/70 bg-white/70 backdrop-blur p-6 sm:p-8 shadow-[0_20px_50px_rgba(2,6,23,0.08)]">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-slate-200 text-[10px] font-black uppercase tracking-[0.25em] text-slate-700">
                <IoSparkles className="w-4 h-4 text-indigo-600" />
                Why this school
              </div>

              {/* Heading */}
              <div className="mt-5 space-y-4">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 leading-[1.05] tracking-tight">
                  {loading ? (
                    <span className="inline-flex items-center gap-2">
                      <FiLoader className="w-6 h-6 animate-spin text-indigo-600" />{" "}
                      Loading...
                    </span>
                  ) : (
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-sky-600 to-emerald-600">
                      Why {schoolName}
                    </span>
                  )}
                </h1>
                <p className="text-slate-600 text-base sm:text-lg leading-relaxed font-medium max-w-xl">
                  {description ||
                    "A future-ready learning community focused on academic growth, character, and real-world skills."}
                </p>
              </div>

              {/* Key Metrics */}
              <div className="mt-6 grid grid-cols-3 gap-3">
                {(() => {
                  const stats = getSchoolStats();
                  const items = [
                    {
                      label: "Students",
                      value: `${studentCount}+`,
                      icon: FiUsers,
                      tone: "from-sky-500 to-indigo-600",
                    },
                    {
                      label: "Mean",
                      value: stats.meanScore?.toFixed(2) || "—",
                      icon: FiTrendingUp,
                      tone: "from-emerald-500 to-teal-600",
                    },
                    {
                      label: "Target",
                      value: stats.targetMean?.toFixed(2) || "—",
                      icon: FiTarget,
                      tone: "from-amber-500 to-orange-600",
                    },
                  ];

                  return items.map((stat, idx) => {
                    const Icon = stat.icon;
                    return (
                      <div
                        key={idx}
                        className="rounded-2xl border border-slate-200 bg-white/70 px-3 py-3 shadow-sm"
                      >
                        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">
                          {stat.label}
                        </p>
                        <div className="mt-2 flex items-center gap-2">
                          <span
                            className={`inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br ${stat.tone} text-white shadow-sm`}
                          >
                            <Icon className="w-4 h-4" />
                          </span>
                          <p className="text-lg sm:text-xl font-black text-slate-900">
                            {stat.value}
                          </p>
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>

              {/* CTA Buttons */}
              <div className="mt-7 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleExplorePathways}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 via-sky-600 to-emerald-600 hover:from-indigo-700 hover:via-sky-700 hover:to-emerald-700 text-white font-black text-sm tracking-tight transition-all shadow-lg shadow-indigo-600/20 active:scale-[0.99]"
                >
                  Admissions <FiArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => router.push("/pages/AboutUs")}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-white hover:bg-slate-50 text-slate-900 font-black text-sm tracking-tight transition-all border border-slate-200 shadow-sm"
                >
                  About Us
                </button>
              </div>
              </div>
            </div>

            {/* Right Column - Dynamic Carousel with New Style */}
            <div className="order-1 lg:order-2 lg:col-span-7">
              <div className="relative w-full aspect-[4/3] sm:aspect-square rounded-3xl overflow-hidden border border-slate-200 bg-white shadow-[0_25px_70px_rgba(2,6,23,0.12)] group">
                {schoolImages.map((image, idx) => (
                  <div
                    key={idx}
                    className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                      idx === currentImageIndex
                        ? "opacity-100 scale-100"
                        : "opacity-0 scale-105"
                    }`}
                  >
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      className="object-cover"
                      priority={idx === 0}
                    />
                  </div>
                ))}

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/45 via-transparent to-slate-950/10" />

                {/* Navigation Buttons - Redesigned */}
                <button
                  onClick={prevImage}
                  className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-white/30 z-10 shadow-lg border border-white/20"
                  aria-label="Previous"
                >
                  <FiChevronLeft size={22} className="strokeWidth={1}" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-white/30 z-10 shadow-lg border border-white/20"
                  aria-label="Next"
                >
                  <FiChevronRight size={22} className="strokeWidth={1}" />
                </button>

                {/* Dots Indicator - New Style */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-10 backdrop-blur-sm px-4 py-2 rounded-full bg-white/15 border border-white/20">
                  {schoolImages.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`transition-all duration-300 rounded-full ${
                        idx === currentImageIndex
                          ? "w-3 h-3 bg-white shadow-lg"
                          : "w-2 h-2 bg-white/50 hover:bg-white/70"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== WHY CHOOSE US - REDESIGNED SECTION ===== */}
      <section className="relative py-16 sm:py-20 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-44 right-10 w-[28rem] h-[28rem] bg-indigo-200/35 rounded-full blur-3xl" />
          <div className="absolute -bottom-44 left-16 w-[26rem] h-[26rem] bg-emerald-200/25 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Section Header */}
          <div className="text-center mb-14 sm:mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/70 border border-slate-200 text-[10px] font-black uppercase tracking-[0.25em] text-slate-700 mb-5">
              <FiStar className="text-indigo-600 w-4 h-4" />
              Why Choose Us
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 leading-tight mb-4 tracking-tight">
              A bolder way to{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-sky-600 to-emerald-600">
                learn and grow
              </span>
            </h2>
            <p className="text-slate-600 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed font-medium">
              Distinctive advantages that shape learning, character, and future readiness.
            </p>
          </div>

          {/* Cards Grid - New Flowing Design */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 mb-10">
            {whyChooseUs.map((item) => (
              <div
                key={item.id}
                className="group relative rounded-3xl p-[1px] bg-gradient-to-br from-slate-200 via-white to-slate-200 hover:from-indigo-200 hover:via-white hover:to-emerald-200 transition-colors duration-300"
              >
                <div className="relative h-full rounded-[calc(1.5rem-1px)] bg-white/80 backdrop-blur border border-white/60 p-6 shadow-sm hover:shadow-xl transition-shadow">
                  <div className="flex items-start justify-between gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-600 to-sky-500 text-white flex items-center justify-center shadow-md">
                      {item.icon}
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-black tracking-[0.2em] uppercase bg-slate-50 border border-slate-200 text-slate-600">
                      {item.metrics}
                    </span>
                  </div>

                  <h3 className="mt-4 text-lg font-black text-slate-900 tracking-tight">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-sm text-slate-600 font-medium leading-relaxed">
                    {expandedCards[item.id] ? item.description : item.shortDescription}
                  </p>

                  <button
                    onClick={() => toggleReadMore(item.id)}
                    className="mt-4 inline-flex items-center gap-1 text-xs font-black tracking-widest uppercase text-indigo-600 hover:text-indigo-700 transition-colors"
                  >
                    {expandedCards[item.id] ? "Show Less" : "Read More"}
                    <FiChevronDown
                      className={`w-4 h-4 transition-transform ${
                        expandedCards[item.id] ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* CTA Row */}
          <div className="text-center">
            <button
              onClick={handleExplorePathways}
              className="inline-flex items-center gap-2 px-8 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 via-sky-600 to-emerald-600 hover:from-indigo-700 hover:via-sky-700 hover:to-emerald-700 text-white font-black text-sm tracking-tight transition-all shadow-lg shadow-indigo-600/20 active:scale-[0.99]"
            >
              Explore Our Pathways <FiArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* ===== SNAPSHOT SECTION (Wrapper Fix) ===== */}
      <section className="relative py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl border border-slate-200/70 bg-white/70 backdrop-blur p-6 sm:p-8 shadow-[0_20px_50px_rgba(2,6,23,0.08)]">
            <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-indigo-200/35 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-emerald-200/25 blur-3xl" />

          <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7 space-y-6">
              {/* Snapshot Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-slate-200 text-[10px] font-black uppercase tracking-[0.25em] text-slate-700 w-fit">
                <FiZap className="w-4 h-4 text-indigo-600" />
                Snapshot
              </div>

              {/* Heading */}
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 leading-tight tracking-tight">
                {loading ? (
                  <span className="inline-flex items-center gap-2">
                    <FiLoader className="w-5 h-5 animate-spin text-indigo-600" />{" "}
                    Loading...
                  </span>
                ) : (
                  <>
                    Admissions &amp; Enquiries at{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-sky-600 to-emerald-600">
                      {schoolName}
                    </span>
                  </>
                )}
              </h2>

              {/* Description (FIXED DARKER TEXT ✅) */}
              <p className="text-slate-600 text-sm sm:text-base md:text-lg leading-relaxed max-w-xl font-medium">
                {description ||
                  "A future-ready learning community focused on academic growth, character, and real-world skills."}
              </p>

              {/* Contact Pills */}
{/* Stats Grid (MORE RESPONSIVE ✅) */}
<div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-2">
  {(() => {
    const stats = getSchoolStats();
    const statItems = [
      {
        label: "Students",
        value: `${studentCount}+`,
        icon: <FiUsers className="w-4 h-4" />,
        color: "text-indigo-700",
        bgColor: "bg-indigo-50",
      },
      {
        label: "Mean Score",
        value: stats.meanScore?.toFixed(2) || "—",
        icon: <FiBookOpen className="w-4 h-4" />,
        color: "text-emerald-700",
        bgColor: "bg-emerald-50",
        trend: stats.lastYearMean ? (
          <span className={`text-[10px] font-bold ml-1 ${
            (stats.meanScore || 0) > (stats.lastYearMean || 0) 
              ? 'text-green-600' 
              : 'text-red-600'
          }`}>
            {(stats.meanScore || 0) > (stats.lastYearMean || 0) ? '↑' : '↓'}
          </span>
        ) : null,
      },
      {
        label: "Target Mean",
        value: stats.targetMean?.toFixed(2) || "—",
        icon: <FiTarget className="w-4 h-4" />,
        color: "text-amber-700",
        bgColor: "bg-amber-50",
        progress: stats.meanScore && stats.targetMean ? (
          <span className="text-[10px] font-bold ml-1 text-amber-600">
            {((stats.meanScore / stats.targetMean) * 100).toFixed(0)}%
          </span>
        ) : null,
      },
      {
        label: "Slogan",
        value: stats.slogan || motto,
        icon: <FiStar className="w-4 h-4" />,
        color: "text-violet-700",
        bgColor: "bg-violet-50",
      },
    ];

    return statItems.map((stat, idx) => (
      <div
        key={idx}
        className="relative p-4 bg-white/70 rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-shadow duration-300 flex flex-col justify-between min-h-[90px] group overflow-hidden"
      >
        {/* Background Accent */}
        <div className={`absolute top-0 right-0 w-16 h-16 ${stat.bgColor} rounded-bl-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-0`} />
        
        {/* Icon */}
        <span className={`absolute top-2 right-2 text-sm opacity-30 group-hover:opacity-100 transition-opacity duration-300 ${stat.color}`}>
          {stat.icon}
        </span>

        {/* Value with optional trend/progress */}
        <div className="relative z-10">
          <p
            className={`font-bold ${stat.color} leading-tight flex items-center ${
              stat.label === "Slogan"
                ? "text-xs sm:text-sm"
                : "text-lg sm:text-xl md:text-2xl"
            }`}
          >
            {stat.value}
            {stat.trend}
            {stat.progress}
          </p>
        </div>

        {/* Label */}
        <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-wide text-gray-500 mt-1 relative z-10">
          {stat.label}
        </p>

        {/* Hover Indicator */}
        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-indigo-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
    ));
  })()}
</div>

            
<div className="flex flex-col md:flex-row gap-3">
  {/* Phone Card */}
  <div className="bg-white/70 border border-slate-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow flex items-center gap-3">
    <div className="w-10 h-10 flex items-center justify-center rounded-2xl bg-sky-50 border border-sky-100 shrink-0">
      <FiPhone className="text-sky-700 w-4 h-4" />
    </div>
    <div className="min-w-0">
      <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-500">
        Phone
      </p>
      <p className="text-sm font-bold text-slate-900 truncate">
        {contactPhone || "Add phone number"}
      </p>
    </div>
  </div>

  {/* Email Card */}
  <div className="bg-white/70 border border-slate-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow flex items-center gap-3">
    <div className="w-10 h-10 flex items-center justify-center rounded-2xl bg-violet-50 border border-violet-100 shrink-0">
      <FiMail className="text-violet-700 w-4 h-4" />
    </div>
    <div className="min-w-0">
      <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-500">
        Email
      </p>
      <p className="text-sm font-bold text-slate-900 break-all">
        {contactEmail || "Add email"}
      </p>
    </div>
  </div>
</div>
                {/* Phone Card */}
              

              {/* CTA Buttons */}
              <div className="flex flex-nowrap gap-3 pt-2 w-full">
                <button
                  onClick={handleExplorePathways}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 via-sky-600 to-emerald-600 hover:from-indigo-700 hover:via-sky-700 hover:to-emerald-700 text-white font-black text-sm tracking-tight transition-all shadow-lg shadow-indigo-600/20 active:scale-[0.99]"
                >
                  Admissions <FiArrowRight size={16} />
                </button>

                <button
                  onClick={() => router.push("/pages/AboutUs")}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-white hover:bg-slate-50 text-slate-900 font-black text-sm tracking-tight transition-all border border-slate-200 shadow-sm"
                >
                  Discover More
                </button>
              </div>
            </div>
          </div>
          </div>
        </div>
      </section>
      

{/* ===== VISION / MISSION / MOTTO SECTION (Compact Institutional Layout) ===== */}
<section className="relative py-16 sm:py-20 overflow-hidden">
  {/* Decorative Background Element */}
  <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-96 h-96 bg-indigo-200/35 rounded-full blur-3xl opacity-60" />
  <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-96 h-96 bg-emerald-200/20 rounded-full blur-3xl opacity-60" />
  
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
      
      {/* Left Side: Section Header */}
      <div className="lg:col-span-4 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/70 border border-slate-200">
          <IoSparkles className="text-indigo-600 w-3.5 h-3.5" />
          <span className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-700">Core Foundations</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight tracking-tight">
          Foundations that guide{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-sky-600 to-emerald-600">
            how we learn
          </span>
        </h2>
        <p className="text-slate-600 text-sm leading-relaxed max-w-sm font-medium">
          Guiding principles for the {new Date().getFullYear()} academic year—what we believe, and how we build learners.
        </p>
      </div>

      {/* Right Side: Interactive Cards (Reduced Height) */}
      <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          {
            label: "Our Motto",
            value: motto,
            icon: <FiTarget />,
            gradient: "from-indigo-600 to-sky-500",
            shadow: "shadow-indigo-200/50",
            bg: "bg-indigo-50",
            border: "border-indigo-100",
            text: "text-indigo-700"
          },
          {
            label: "Our Vision",
            value: vision,
            icon: <FiEye />,
            gradient: "from-emerald-600 to-teal-500",
            shadow: "shadow-emerald-200/50",
            bg: "bg-emerald-50",
            border: "border-emerald-100",
            text: "text-emerald-700"
          },
          {
            label: "Our Mission",
            value: mission,
            icon: <FiBookOpen />,
            gradient: "from-violet-600 to-fuchsia-500",
            shadow: "shadow-violet-200/50",
            bg: "bg-violet-50",
            border: "border-violet-100",
            text: "text-violet-700",
            span: "md:col-span-2" 
          },
        ].map((item, idx) => (
          <div 
            key={idx} 
            className={`group relative p-[1px] rounded-[1.5rem] bg-gradient-to-b from-slate-200 to-white shadow-lg transition-all duration-200 ${item.span || ""}`}
          >
            <div className="relative h-full bg-white/80 backdrop-blur rounded-[1.45rem] p-5 border border-slate-200/60 overflow-hidden">
              {/* Corner Accent - Scaled Down */}
              <div className={`absolute -top-8 -right-8 w-16 h-16 bg-gradient-to-br ${item.gradient} opacity-5 group-hover:opacity-15 transition-opacity rounded-full`} />
              
              <div className="flex items-start gap-4">
                {/* Scaled Down Icon Container */}
                <div className={`flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center text-white shadow-md ${item.shadow} group-hover:scale-110 transition-transform duration-300`}>
                  {React.cloneElement(item.icon, { size: 18 })}
                </div>

                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 group-hover:text-indigo-600 transition-colors">
                      {item.label}
                    </h3>
                    <div className={`px-2 py-0.5 rounded-full ${item.bg} ${item.border} ${item.text} text-[8px] font-bold uppercase`}>
                      Official
                    </div>
                  </div>
                  <p className="text-slate-800 text-md font-bold leading-snug tracking-tight italic">
                    "{item.value}"
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
</section>



{/* ===== PERFORMANCE METRICS SECTION ===== */}
{!statsLoading && schoolStatsData && (
  <section className="relative py-16 sm:py-20 overflow-hidden">
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <div className="absolute -top-44 left-1/2 h-[26rem] w-[26rem] -translate-x-1/2 rounded-full bg-gradient-to-br from-sky-200/45 via-indigo-200/30 to-emerald-200/20 blur-3xl" />
      <div className="absolute -bottom-48 right-6 h-[24rem] w-[24rem] rounded-full bg-gradient-to-br from-violet-200/30 to-fuchsia-200/15 blur-3xl" />
    </div>

    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="relative rounded-3xl p-[1px] bg-gradient-to-br from-slate-200 via-white to-slate-200">
        <div className="rounded-[calc(1.5rem-1px)] bg-white/80 backdrop-blur border border-white/60 p-6 sm:p-8 shadow-[0_20px_50px_rgba(2,6,23,0.06)]">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-slate-200 text-[10px] font-black uppercase tracking-[0.25em] text-slate-700">
                <FiActivity className="w-4 h-4 text-indigo-600" />
                Performance
              </div>
              <h3 className="mt-4 text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
                Academic metrics, at a glance
              </h3>
              <p className="mt-2 text-sm sm:text-base text-slate-600 font-medium max-w-2xl leading-relaxed">
                Live statistics from our academic dashboard and targets for the current cycle.
              </p>
            </div>

            <div className="w-fit inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-gradient-to-r from-indigo-600 via-sky-600 to-emerald-600 text-white shadow-lg shadow-indigo-600/15">
              <FiTrendingUp className="w-4 h-4" />
              <span className="text-xs font-black uppercase tracking-[0.2em]">
                Live Metrics
              </span>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6">
            {/* Current Mean (Primary) */}
            {schoolStatsData.meanScore && (
              <div className="md:col-span-5">
                <div className="relative h-full rounded-3xl border border-slate-200 overflow-hidden p-6 text-white bg-slate-950">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/40 via-sky-600/25 to-emerald-600/25" />
                  <div className="relative">
                    <p className="text-[10px] font-black uppercase tracking-[0.25em] text-white/70">
                      Current Mean
                    </p>

                    <div className="mt-3 flex flex-wrap items-end gap-3">
                      <p className="text-5xl sm:text-6xl font-black tracking-tight">
                        {schoolStatsData.meanScore.toFixed(2)}
                      </p>

                      {schoolStatsData.lastYearMean && (
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-black ${
                            schoolStatsData.meanScore > schoolStatsData.lastYearMean
                              ? "bg-emerald-500/20 text-emerald-100 border border-emerald-400/30"
                              : "bg-rose-500/20 text-rose-100 border border-rose-400/30"
                          }`}
                        >
                          {schoolStatsData.meanScore > schoolStatsData.lastYearMean ? (
                            <FiTrendingUp className="w-4 h-4" />
                          ) : (
                            <FiTrendingDown className="w-4 h-4" />
                          )}
                          {Math.abs(
                            schoolStatsData.meanScore - schoolStatsData.lastYearMean
                          ).toFixed(2)}
                        </span>
                      )}
                    </div>

                    <p className="mt-2 text-sm text-white/75 font-medium leading-relaxed">
                      A snapshot of current academic performance, updated as data is published.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Secondary Tiles */}
            <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {schoolStatsData.lastYearMean && (
                <div className="rounded-3xl border border-slate-200 bg-white/70 p-6 shadow-sm hover:shadow-lg transition-shadow">
                  <p className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-500">
                    Previous Year
                  </p>
                  <p className="mt-3 text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                    {schoolStatsData.lastYearMean.toFixed(2)}
                  </p>
                  <p className="mt-1 text-sm text-slate-600 font-medium">
                    Baseline reference for trend comparisons.
                  </p>
                </div>
              )}

              {schoolStatsData.targetMean && (
                <div className="rounded-3xl border border-slate-200 bg-white/70 p-6 shadow-sm hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-500">
                        Target Mean
                      </p>
                      <p className="mt-3 text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                        {schoolStatsData.targetMean.toFixed(2)}
                      </p>
                    </div>

                    {schoolStatsData.meanScore && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-[11px] font-black">
                        {Math.min(
                          100,
                          (schoolStatsData.meanScore / schoolStatsData.targetMean) * 100
                        ).toFixed(0)}
                        %
                      </span>
                    )}
                  </div>

                  {schoolStatsData.meanScore && (
                    <div className="mt-4">
                      <div className="h-2 w-full rounded-full bg-slate-200 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-1000 ease-out"
                          style={{
                            width: `${Math.min(
                              100,
                              (schoolStatsData.meanScore / schoolStatsData.targetMean) * 100
                            )}%`,
                          }}
                        />
                      </div>
                      <p className="mt-2 text-sm text-slate-600 font-medium">
                        Progress toward the target mean.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {(schoolStatsData.slogan ||
                schoolStatsData.sloganDescription ||
                schoolStatsData.sloganAuthor) && (
                <div className="sm:col-span-2 rounded-3xl border border-slate-200 bg-white/70 p-6 shadow-sm hover:shadow-lg transition-shadow">
                  <div className="flex items-start gap-3">
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-sm shrink-0">
                      <FiStar className="w-5 h-5" />
                    </span>

                    <div className="min-w-0">
                      <p className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-500">
                        Slogan
                      </p>
                      <p className="mt-2 text-lg font-black text-slate-900 leading-tight">
                        {schoolStatsData.slogan || motto}
                      </p>

                      {schoolStatsData.sloganDescription && (
                        <p className="mt-2 text-sm text-slate-600 font-medium leading-relaxed">
                          {schoolStatsData.sloganDescription}
                        </p>
                      )}

                      {schoolStatsData.sloganAuthor && (
                        <p className="mt-2 text-xs text-slate-500 font-semibold">
                          — {schoolStatsData.sloganAuthor}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
)}

{/* ===== ACHIEVEMENTS TIMELINE: MODERNIZED ===== */}
<section className="relative py-16 sm:py-20 overflow-hidden">
  <div className="absolute inset-0 pointer-events-none overflow-hidden">
    <div className="absolute -top-40 left-10 h-[22rem] w-[22rem] rounded-full bg-gradient-to-br from-indigo-200/35 to-sky-200/25 blur-3xl" />
    <div className="absolute -bottom-44 right-12 h-[26rem] w-[26rem] rounded-full bg-gradient-to-br from-emerald-200/25 to-indigo-200/15 blur-3xl" />
  </div>

  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
    <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-16">
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/70 border border-slate-200 text-[10px] font-black uppercase tracking-[0.25em] text-slate-700 mb-5">
        <FiAward className="w-4 h-4 text-indigo-600" />
        Achievements
      </div>
      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight mb-4">
        Milestones worth{" "}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-sky-600 to-emerald-600">
          celebrating
        </span>
      </h2>
      <p className="text-slate-600 text-base sm:text-lg font-medium leading-relaxed">
        A timeline of wins and moments that reflect our learning culture.
      </p>
    </div>

    {achievementsLoading ? (
      <div className="flex flex-col items-center justify-center py-16">
        <FiLoader className="w-10 h-10 animate-spin text-indigo-600 mb-4" />
        <p className="text-slate-500 font-black uppercase tracking-[0.2em] text-xs">
          Loading achievements...
        </p>
      </div>
    ) : (
      <div className="relative">
        <div className="absolute left-4 sm:left-1/2 sm:-translate-x-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-slate-200 via-slate-200 to-transparent" />

        <div className="space-y-10 sm:space-y-12">
          {getAchievements().map((item, idx) => {
            const isRight = idx % 2 === 0;
            return (
              <div
                key={idx}
                className={`relative flex items-start justify-between w-full ${
                  isRight ? "sm:flex-row-reverse" : "sm:flex-row"
                }`}
              >
                <div className="hidden sm:block w-[45%]" />

                <div className="absolute left-4 sm:left-1/2 -translate-x-1/2 z-20">
                  <div className="w-10 h-10 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center">
                    <div className="w-3 h-3 rounded-full bg-gradient-to-br from-indigo-600 via-sky-600 to-emerald-600" />
                  </div>
                </div>

                <div className="w-full sm:w-[45%] pl-12 sm:pl-0">
                  <div className="group relative rounded-3xl p-[1px] bg-gradient-to-br from-slate-200 via-white to-slate-200 hover:from-indigo-200 hover:via-white hover:to-emerald-200 transition-colors duration-300">
                    <div className="relative rounded-[calc(1.5rem-1px)] bg-white/80 backdrop-blur border border-white/60 p-6 sm:p-8 shadow-sm hover:shadow-xl transition-shadow">
                      {item.year && (
                        <div
                          className={`absolute -top-3 ${
                            isRight ? "sm:right-8" : "sm:left-8"
                          } left-6 sm:left-auto`}
                        >
                          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.25em] shadow-lg">
                            <FiCalendar className="w-3.5 h-3.5 text-white/80" />
                            {item.year}
                          </span>
                        </div>
                      )}

                      <div
                        className={`flex flex-col ${
                          isRight
                            ? "sm:items-start sm:text-left"
                            : "sm:items-end sm:text-right"
                        } text-left`}
                      >
                        <div className="inline-flex items-center gap-3 flex-wrap">
                          <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 via-sky-600 to-emerald-600 text-white shadow-md">
                            {item.icon || <FiAward className="w-5 h-5" />}
                          </span>

                          {item.stats && (
                            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] bg-slate-50 border border-slate-200 text-slate-600">
                              {item.stats}
                            </span>
                          )}
                        </div>

                        <h4 className="mt-4 text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                          {item.title}
                        </h4>

                        <p className="mt-2 text-slate-600 text-sm sm:text-base font-medium leading-relaxed line-clamp-3">
                          {item.shortDescription ||
                            (item.description &&
                              item.description.substring(0, 120) + "...")}
                        </p>

                        <div
                          className={`mt-5 flex items-center justify-start ${
                            isRight ? "sm:justify-start" : "sm:justify-end"
                          }`}
                        >
                          <button
                            onClick={() => openAchievementModal(item)}
                            className="group/btn inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-slate-900 text-white text-xs font-black uppercase tracking-[0.2em] hover:bg-slate-800 transition-colors"
                          >
                            View details
                            <FiArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                          </button>
                        </div>
                      </div>

                      {item.image && (
                        <div className="mt-6 relative h-40 sm:h-44 w-full overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
                          <Image
                            src={item.image}
                            alt={item.title}
                            fill
                            className="object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    )}
  </div>
</section>

   {/* ===== WHY CHOOSE US - SHUFFLED MOSAIC ===== */}
<section className="relative py-24 bg-[#fafbfc] overflow-hidden">
  {/* Abstract Background Elements */}
  <div className="absolute top-0 left-0 w-full h-full">
    <div className="absolute top-[-10%] right-[-5%] w-[40rem] h-[40rem] bg-indigo-50/50 rounded-full blur-[120px]" />
    <div className="absolute bottom-[-10%] left-[-5%] w-[35rem] h-[35rem] bg-emerald-50/40 rounded-full blur-[100px]" />
  </div>

  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
    
    {/* 1. HERO SIGNATURE CARD (Full Width Header) */}
    <div className="relative mb-12 rounded-[3rem] border border-slate-200 bg-white/40 backdrop-blur-xl p-8 md:p-12 shadow-2xl shadow-slate-200/50 overflow-hidden">
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-indigo-50/30 to-transparent pointer-events-none" />
      
      <div className="max-w-3xl relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-600 text-[10px] font-black uppercase tracking-[0.2em] text-white mb-6">
          <HiOutlineSparkles className="w-4 h-4" />
          The Signature Experience
        </div>

        <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-[1.1] mb-6">
          What defines the journey at <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-sky-600 to-emerald-600">
            {schoolName}?
          </span>
        </h2>

        <div className="flex flex-col md:flex-row md:items-center gap-6">
          <p className="text-lg text-slate-600 font-medium leading-relaxed flex-1">
            We’ve engineered an environment where structured support meets academic rigor, 
            ensuring every learner is ready for the world beyond our gates.
          </p>
          
          <div className="flex items-center gap-3 shrink-0">
             <button onClick={handleExplorePathways} className="px-6 py-4 rounded-2xl bg-slate-900 text-white font-bold text-sm hover:bg-indigo-600 transition-all active:scale-95 shadow-xl shadow-slate-200">
                Start Admission
             </button>
             <button onClick={() => router.push("/pages/AboutUs")} className="p-4 rounded-2xl bg-white border border-slate-200 text-slate-900 font-bold text-sm hover:bg-slate-50 transition-all">
                Our Story
             </button>
          </div>
        </div>
      </div>
    </div>

    {/* 2. REASONS GRID (Shuffled Staggered Layout) */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      
      {/* MOTTO CARD - Integrated as a Mosaic Piece */}
      <div className="lg:col-span-1 bg-gradient-to-br from-indigo-600 to-violet-700 rounded-[2.5rem] p-8 text-white flex flex-col justify-between shadow-xl shadow-indigo-200 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <FiStar className="w-32 h-32" />
        </div>
        <div className="relative">
          <span className="text-[10px] font-black uppercase tracking-widest text-indigo-200">Our Guiding Star</span>
          <h3 className="mt-4 text-2xl font-black italic leading-tight">"{motto}"</h3>
        </div>
        <div className="mt-12 space-y-4 relative">
          <div className="h-[1px] bg-white/20 w-full" />
          <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-indigo-100">
            <span>Support</span>
            <span>Focus</span>
            <span>Progress</span>
          </div>
        </div>
      </div>

      {/* DYNAMIC FEATURE CARDS */}
      {whyChooseUs.map((item, idx) => {
        const c = colorMap[item.color] || colorMap.emerald;
        // Logic to make the second card taller or span more rows if needed
        const isSpanned = idx === 1; 

        return (
          <div 
            key={item.id}
            className={`group bg-white border border-slate-100 rounded-[2.5rem] p-8 hover:shadow-2xl hover:shadow-slate-200/60 transition-all duration-500 ${isSpanned ? 'lg:row-span-1' : ''}`}
          >
            <div className={`w-14 h-14 rounded-2xl ${c.light} ${c.text} flex items-center justify-center mb-8 group-hover:scale-110 transition-transform`}>
              {item.icon}
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  {item.metrics}
                </span>
                <span className="w-2 h-2 rounded-full bg-slate-200" />
              </div>
              
              <h4 className="text-2xl font-black text-slate-900 tracking-tight">
                {item.title}
              </h4>

              <p className="text-sm text-slate-500 font-medium leading-relaxed">
                {item.shortDescription}
              </p>

              <button 
                onClick={() => openAchievementModal(item)}
                className="pt-4 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-indigo-600 group-hover:gap-3 transition-all"
              >
                Deep Dive <FiArrowRight />
              </button>
            </div>

            {item.image && (
              <div className="mt-8 relative h-32 w-full rounded-2xl overflow-hidden border border-slate-100 grayscale hover:grayscale-0 transition-all duration-700">
                <Image src={item.image} alt={item.title} fill className="object-cover" />
              </div>
            )}
          </div>
        );
      })}
    </div>

  </div>
</section>

{/* CBC Framework - Structural Shuffle */}
<section className="relative py-16 sm:py-24 text-[#0a0a0b] overflow-hidden bg-slate-200">
  {/* Ambient background glow */}
  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_-20%,#312e81_0%,transparent_50%)] opacity-40" />

  <div className="w-full md:w-4/5 lg:w-3/5 mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
    
    {/* 1. THE PILLARS (Pathways First) */}
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-16">
      {/* Dynamic Title Card - Integrated into the Grid */}
      <div className="lg:col-span-1 bg-gradient-to-br from-indigo-600 to-violet-700 rounded-[2rem] p-8 flex flex-col justify-between shadow-2xl shadow-indigo-500/20">
        <div>
          <FiBookOpen className="text-4xl text-white/90 mb-6" />
          <h3 className="text-3xl font-black text-white leading-tight">
            CBC <br /> 
            <span className="text-indigo-200">Learning</span> <br /> 
            Pathways
          </h3>
        </div>
        <p className="text-indigo-100 text-sm font-medium leading-relaxed opacity-80">
          Tailored tracks designed for specific student strengths at {schoolName}.
        </p>
      </div>

      {/* Pathway Cards Mapping */}
      {pathways.map((path, idx) => {
        const PathIcon = path.icon;
        return (
          <div key={idx} className="lg:col-span-1 bg-slate-900/40 backdrop-blur-md border border-white/5 rounded-[2rem] p-7 hover:bg-slate-800/60 transition-all group">
            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-r ${path.color} flex items-center justify-center mb-6 shadow-lg shadow-black/20`}>
              <PathIcon className="text-white text-xl" />
            </div>
            
            <h4 className="text-xl font-bold text-white mb-2">{path.name}</h4>
            <p className="text-slate-400 text-xs leading-relaxed mb-6 line-clamp-3">
              {path.description}
            </p>

            <div className="space-y-2 mt-auto">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Key Careers</p>
              <div className="flex flex-wrap gap-2">
                {path.careers.slice(0, 2).map((career, i) => (
                  <span key={i} className="text-[11px] text-indigo-400 font-bold"># {career}</span>
                ))}
              </div>
              <button 
                onClick={() => openModal(path)}
                className="pt-4 flex items-center gap-2 text-xs font-bold text-white group-hover:text-indigo-400 transition-colors"
              >
                Explore Track <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        );
      })}
    </div>

    {/* 2. CORE COMPETENCIES (The "Foundation" Bar) */}
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
      
      {/* Core Subjects Grid - Compact Bento */}
      <div className="lg:col-span-8 bg-white/[0.02] border border-white/10 rounded-[2.5rem] p-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-amber-500/10 rounded-lg">
            <IoSparkles className="text-amber-500" />
          </div>
          <h4 className="font-bold text-white uppercase tracking-widest text-sm">Mandatory Core Subjects</h4>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {[
            { name: "Math", icon: FiCpu },
            { name: "English", icon: FiBook },
            { name: "Kiswahili", icon: FiGlobe },
            { name: "Science", icon: FiActivity },
            { name: "Social", icon: FiUsers },
            { name: "Religion", icon: FiHeart },
            { name: "Arts", icon: FiPenTool },
            { name: "Agri", icon: FiDroplet },
            { name: "Life Skills", icon: FiStar },
            { name: "P.E.", icon: FiTarget },
          ].map((subj, i) => {
            const SubjIcon = subj.icon;
            return (
              <div key={i} className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/20 transition-all">
                <SubjIcon className="text-slate-400 mb-2" />
                <span className="text-[10px] font-bold text-center text-slate-300">{subj.name}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. CONTEXTUAL OVERVIEW (The "Why" - Moved to Side/Bottom) */}
      <div className="lg:col-span-4 flex flex-col justify-center p-8 bg-indigo-500/5 border border-indigo-500/10 rounded-[2.5rem] relative overflow-hidden">
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-indigo-500/10 blur-3xl rounded-full" />
        <h5 className="text-lg font-bold text-white mb-4">Framework Overview</h5>
        <p className="text-sm text-slate-400 leading-relaxed font-medium">
          The Competency Based Curriculum (CBC) shifts the focus from "what you know" to "what you can do." 
          Every student follows a core foundation before specializing in their chosen pathway.
        </p>
        <div className="mt-8 flex items-center gap-4">
          <div className="flex -space-x-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="w-8 h-8 rounded-full border-2 border-[#0a0a0b] bg-slate-800" />
            ))}
          </div>
          <span className="text-[10px] font-bold uppercase text-indigo-400">Join 500+ Students</span>
        </div>
      </div>

    </div>
  </div>
</section>
      {/* ===== EDUCATIONAL PILLARS - BENTO GRID ===== */}
{/* Educational Pillars - Shuffled Structural Design */}
<section className="relative py-24 bg-white overflow-hidden">
  {/* Modern Background Accents */}
  <div className="absolute top-0 right-0 w-1/3 h-full bg-slate-50/50" />
  <div className="absolute top-10 left-10 w-64 h-64 bg-indigo-50 blur-[100px] rounded-full" />

  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
      
      {/* LEFT COLUMN: The "Pillars" Lead (Sticky on Desktop) */}
      <div className="lg:col-span-5 lg:sticky lg:top-24">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-[10px] font-black uppercase tracking-widest text-indigo-600 mb-6">
          <FiLayers className="w-4 h-4" />
          The Foundation
        </div>
        
        <h2 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tighter leading-[0.9] mb-8">
          Educational <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-sky-600">
            Pillars
          </span>
        </h2>

        <p className="text-slate-600 text-lg font-medium leading-relaxed max-w-md mb-10">
          We don't just teach; we build. Our framework is designed to cultivate academic mastery and character resilience in every student.
        </p>

        {/* Global School Stat - Shuffled here for impact */}
        <div className="p-8 bg-slate-900 rounded-[2.5rem] text-white shadow-2xl shadow-indigo-200">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
              <FiStar className="text-amber-400 text-xl" />
            </div>
            <div>
              <p className="text-2xl font-black italic">Excellence</p>
              <p className="text-white/50 text-[10px] font-bold uppercase tracking-widest">As our Standard</p>
            </div>
          </div>
          <p className="text-sm text-white/70 leading-relaxed">
            Integrating modern technology with traditional values to create a holistic learning environment.
          </p>
        </div>
      </div>

      {/* RIGHT COLUMN: Shuffled Feature Cards */}
      <div className="lg:col-span-7 space-y-6">
        {schoolFeatures.map((feature, index) => {
          const isPremium = feature.isPremium;
          
          return (
            <div 
              key={index}
              className={`group relative overflow-hidden rounded-[2rem] border transition-all duration-500 ${
                isPremium 
                ? "bg-slate-950 border-white/10 p-10" 
                : "bg-white border-slate-100 p-8 hover:border-indigo-200 hover:shadow-xl"
              }`}
            >
              {/* Feature Gradient Glow */}
              <div className={`absolute -right-20 -top-20 w-64 h-64 bg-gradient-to-br ${feature.gradient} opacity-[0.08] blur-3xl`} />

              <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start">
                {/* Icon & Badge */}
                <div className="shrink-0">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-white shadow-lg`}>
                    {React.cloneElement(feature.icon, { className: "w-7 h-7" })}
                  </div>
                </div>

                {/* Content Area */}
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <span className={`text-[10px] font-black uppercase tracking-widest ${isPremium ? 'text-sky-300' : 'text-indigo-600'}`}>
                      {feature.highlight}
                    </span>
                    {isPremium && (
                      <span className="px-2 py-0.5 rounded-md bg-white/10 text-[9px] font-bold text-white/60 border border-white/10">
                        PREMIUM TRACK
                      </span>
                    )}
                  </div>

                  <h4 className={`text-2xl font-black mb-3 tracking-tight ${isPremium ? 'text-white' : 'text-slate-900'}`}>
                    {feature.title}
                  </h4>

                  <p className={`text-sm leading-relaxed mb-6 ${isPremium ? 'text-white/70' : 'text-slate-500'}`}>
                    {feature.description}
                  </p>

                  {/* Details Pills */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {feature.details.map((detail, dIdx) => (
                      <span key={dIdx} className={`px-3 py-1 rounded-lg text-[10px] font-bold border ${
                        isPremium 
                        ? 'bg-white/5 border-white/10 text-white/60' 
                        : 'bg-slate-50 border-slate-100 text-slate-600'
                      }`}>
                        {detail}
                      </span>
                    ))}
                  </div>

                  {/* Metrics Bar */}
                  <div className={`flex gap-8 pt-6 border-t ${isPremium ? 'border-white/10' : 'border-slate-100'}`}>
                    {feature.metrics.map((metric, mIdx) => (
                      <div key={mIdx}>
                        <p className={`text-xl font-black ${isPremium ? 'text-white' : 'text-slate-900'}`}>
                          {metric.split(" ")[0]}
                        </p>
                        <p className={`text-[10px] font-bold uppercase tracking-wider ${isPremium ? 'text-white/40' : 'text-slate-400'}`}>
                          {metric.split(" ").slice(1).join(" ")}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  </div>
</section>
{/* ===== UNIVERSITY PARTNERS ===== */}
<section className="relative py-16 sm:py-20 overflow-hidden">
  <div className="absolute inset-0 pointer-events-none overflow-hidden">
    <div className="absolute -top-44 right-10 h-[26rem] w-[26rem] rounded-full bg-gradient-to-br from-indigo-200/35 to-sky-200/25 blur-3xl" />
    <div className="absolute -bottom-52 left-10 h-[28rem] w-[28rem] rounded-full bg-gradient-to-br from-emerald-200/25 to-indigo-200/15 blur-3xl" />
  </div>

  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
    <div className="text-center mb-12">
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/70 border border-slate-200 text-[10px] font-black uppercase tracking-[0.25em] text-slate-700 mb-5">
        <FiExternalLink className="w-4 h-4 text-indigo-600" />
        University Pathways
      </div>

      <h3 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
        Partners for{" "}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-sky-600 to-emerald-600">
          next steps
        </span>
      </h3>

      <p className="mt-6 text-slate-600 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed font-medium">
        We collaborate with institutions and networks to support confident transitions to higher education and beyond.
      </p>
    </div>

    {imagesLoading ? (
      <div className="flex flex-col items-center justify-center py-12">
        <FiLoader className="w-10 h-10 animate-spin text-indigo-600 mb-4" />
        <span className="text-xs font-black text-slate-500 uppercase tracking-[0.2em]">
          Loading partners...
        </span>
      </div>
    ) : uniImages.length > 0 ? (
      <div className="relative rounded-3xl p-[1px] bg-gradient-to-br from-slate-200 via-white to-slate-200">
        <div className="relative rounded-[calc(1.5rem-1px)] bg-white/80 backdrop-blur border border-white/60 p-6 sm:p-8 overflow-hidden shadow-sm">
          <div className="flex items-center justify-between gap-4 mb-5">
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-600">
              Scroll to explore
            </p>
            <p className="hidden sm:block text-xs font-semibold text-slate-500">
              Hover to pause
            </p>
          </div>

          <div className="relative overflow-hidden py-4">
            <div className="absolute inset-y-0 left-0 w-16 sm:w-28 bg-gradient-to-r from-white/90 to-transparent z-10 pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-16 sm:w-28 bg-gradient-to-l from-white/90 to-transparent z-10 pointer-events-none" />

            <div
              className="flex gap-6 sm:gap-10 animate-marquee whitespace-nowrap"
              style={{
                animation: "marquee 120s linear infinite",
                width: "max-content",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.animationPlayState = "paused")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.animationPlayState = "running")
              }
            >
              {scrollImages.map((img, idx) => (
                <div
                  key={idx}
                  className="relative w-36 h-20 sm:w-44 sm:h-24 flex-shrink-0 bg-white/70 backdrop-blur rounded-2xl border border-slate-200 shadow-sm flex items-center justify-center p-4 group/logo transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:bg-white"
                >
                  <div className="relative w-full h-full">
                    <Image
                      src={img}
                      alt={`Partner logo ${idx + 1}`}
                      fill
                      className="object-contain"
                      sizes="(max-width: 640px) 144px, 176px"
                      onError={(e) => {
                        const parent =
                          e.currentTarget.parentElement?.parentElement;
                        if (parent) parent.style.display = "none";
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    ) : (
      <div className="text-center py-12 rounded-3xl border border-slate-200 bg-white/70">
        <p className="text-sm font-black text-slate-600 uppercase tracking-[0.2em]">
          No partners to display yet
        </p>
      </div>
    )}
  </div>
</section>

{/* ===== ACHIEVEMENT DETAIL MODAL ===== */}
{achievementModalOpen && selectedAchievement && (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-sm transition-all duration-300"
    onClick={closeAchievementModal}
  >
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="achievement-modal-title"
      className="relative bg-white/95 backdrop-blur rounded-3xl max-w-3xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300 flex flex-col border border-white/20"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className="relative p-4 sm:p-6 text-white shrink-0 bg-slate-950">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/40 via-sky-600/25 to-emerald-600/25" />
        <div className="relative flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/10 border border-white/15 rounded-2xl flex items-center justify-center shrink-0">
              <div className="scale-75 sm:scale-100">
                {selectedAchievement.icon || <FiAward className="w-5 h-5" />}
              </div>
            </div>

            <div className="min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                {selectedAchievement.year ? (
                  <span className="w-fit text-[10px] font-black bg-white/10 border border-white/15 px-2 py-0.5 rounded-full uppercase tracking-[0.2em] text-white/90">
                    {selectedAchievement.year}
                  </span>
                ) : null}

                <h3
                  id="achievement-modal-title"
                  className="text-lg sm:text-xl font-black truncate pr-2"
                >
                  {selectedAchievement.title || "Details"}
                </h3>
              </div>
            </div>
          </div>

          <button
            onClick={closeAchievementModal}
            aria-label="Close dialog"
            className="w-9 h-9 rounded-full bg-white/10 border border-white/15 hover:bg-white/15 flex items-center justify-center transition-colors shrink-0"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Modal Body with Scroll */}
      <div className="overflow-y-auto flex-1">
        {/* Hero Image - Responsive Height */}
        {selectedAchievement.image && (
          <div className="relative h-40 sm:h-56 w-full">
            <Image
              src={selectedAchievement.image}
              alt={selectedAchievement.title}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </div>
        )}

        <div className="p-4 sm:p-6">
          {/* Stats Badges - Improved Wrap/Overlap */}
          {(selectedAchievement.stats || selectedAchievement.impact) && (
            <div className="flex flex-wrap gap-2 sm:gap-3 mb-6">
              {selectedAchievement.stats ? (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-full border border-slate-200">
                  <FiAward className="text-indigo-600 w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span className="text-[10px] sm:text-xs font-black text-slate-700 uppercase tracking-[0.12em]">
                    {selectedAchievement.stats}
                  </span>
                </div>
              ) : null}

              {selectedAchievement.impact ? (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-sky-50 rounded-full border border-sky-200/60">
                  <FiTrendingUp className="text-sky-600 w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span className="text-[10px] sm:text-xs font-black text-slate-700 uppercase tracking-[0.12em]">
                    {selectedAchievement.impact}
                  </span>
                </div>
              ) : null}
            </div>
          )}

          {/* Deep Explanation */}
          <h4 className="text-base sm:text-lg font-black text-slate-900 mb-2 sm:mb-3 flex items-center gap-2">
            <FiBookOpen className="text-indigo-600 w-4 h-4 sm:w-5 sm:h-5" />
            Story
          </h4>
          <p className="text-sm sm:text-base text-slate-700 leading-relaxed mb-6">
            {selectedAchievement.description ||
              selectedAchievement.shortDescription ||
              "Details will appear here as the record is published."}
          </p>

          {/* Key Highlights Section */}
          {selectedAchievement.highlights && selectedAchievement.highlights.length > 0 && (
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
              <h5 className="font-black text-slate-900 text-xs sm:text-sm mb-3 flex items-center gap-2 uppercase tracking-[0.2em]">
                <FiCheckCircle className="w-4 h-4 text-emerald-600" />
                Highlights
              </h5>
              <ul className="space-y-2.5">
                {selectedAchievement.highlights.map((highlight, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700">
                    <FiCheckCircle className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Modal Footer */}
      <div className="p-3 sm:p-4 border-t border-slate-200 bg-slate-50 shrink-0">
        <p className="text-[10px] sm:text-xs text-slate-500 text-center italic">
         {schoolName} — Celebrating Excellence
        </p>
      </div>
    </div>
  </div>
)}

{/* ===== CAREERS MODAL ===== */}
{modalOpen && selectedPathway && (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-sm transition-all duration-300"
    onClick={closeModal}
  >
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="pathway-modal-title"
      className="relative bg-white/95 backdrop-blur rounded-3xl max-w-2xl w-full max-h-[95vh] sm:max-h-[85vh] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300 flex flex-col border border-white/20"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Modal Header */}
      <div className={`bg-gradient-to-r ${selectedPathway.color} p-4 sm:p-6 text-white shrink-0`}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/10 border border-white/15 rounded-2xl flex items-center justify-center shrink-0">
              {React.createElement(selectedPathway.icon, {
                className: "w-5 h-5 sm:w-6 sm:h-6",
              })}
            </div>
            <div className="min-w-0">
              <h3
                id="pathway-modal-title"
                className="text-lg sm:text-xl font-black truncate"
              >
                {selectedPathway.name}
              </h3>
              <p className="text-white/80 text-[11px] sm:text-sm line-clamp-1 sm:line-clamp-none">
                {selectedPathway.description}
              </p>
            </div>
          </div>
          <button
            onClick={closeModal}
            aria-label="Close dialog"
            className="w-9 h-9 rounded-full bg-white/10 border border-white/15 hover:bg-white/15 flex items-center justify-center transition-colors shrink-0"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Modal Body with Scroll */}
      <div className="p-4 sm:p-6 overflow-y-auto flex-1">
        {/* Subjects Section */}
        <div className="mb-6">
          <h4 className="font-black text-slate-900 text-base sm:text-lg mb-3 flex items-center gap-2">
            <FiBook className="text-indigo-600 w-4 h-4 sm:w-5 sm:h-5" />
            Core Subjects
          </h4>
          <div className="flex flex-wrap gap-2">
            {selectedPathway.subjects.map((subject, idx) => (
              <span
                key={idx}
                className="px-3 py-1 bg-slate-50 text-slate-700 rounded-full text-[11px] sm:text-sm font-semibold border border-slate-200"
              >
                {subject}
              </span>
            ))}
          </div>
        </div>

        {/* Careers Section */}
        <div>
          <h4 className="font-black text-slate-900 text-base sm:text-lg mb-3 flex items-center gap-2">
            <FiTrendingUp className="text-indigo-600 w-4 h-4 sm:w-5 sm:h-5" />
            Career Paths
          </h4>
          {/* Force 2 columns on small tablets, 1 column on tiny phones */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {selectedPathway.careers.map((career, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 p-2.5 rounded-2xl bg-white/70 transition-colors border border-slate-200 hover:bg-white hover:shadow-sm"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 shrink-0" />
                <span className="text-slate-700 text-[12px] sm:text-sm font-medium">
                  {career}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Fixed Modal Footer */}
      <div className="p-3 sm:p-4 border-t border-slate-200 bg-slate-50 shrink-0">
        <p className="text-[10px] sm:text-xs text-slate-500 text-center leading-tight">
          These career pathways are aligned with the {schoolName} curriculum and preparation programs.
        </p>
      </div>
    </div>
  </div>
)}

      {/* Marquee Animation Style */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 120s linear infinite;
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes zoom-in {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-in {
          animation-duration: 0.2s;
          animation-fill-mode: both;
        }
        .fade-in {
          animation-name: fade-in;
        }
        .zoom-in {
          animation-name: zoom-in;
        }
      `}</style>
    </div>
  );
};

export default ModernSchoolLayout;
