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
import {
  DEFAULT_ACHIEVEMENT_TITLE_ORDER,
  getAchievementImageForCategory,
  getDefaultAchievements,
} from "../../data/defaultAchievements";

const DEFAULT_SUBJECTS = [
  "Mathematics",
  "English",
  "Kiswahili",
  "Integrated Science",
  "Social Studies",
  "Religious Education",
  "Agriculture",
  "Computer Science",
  "Business Studies",
  "Physical Education",
];

const DEFAULT_DEPARTMENTS = [
  "Sciences",
  "Mathematics",
  "Languages",
  "Humanities",
  "Technical & Applied Learning",
  "Guidance & Counselling",
];

const DEFAULT_ADMISSION_REQUIREMENTS = [
  "Completed junior school or equivalent approved transition level.",
  "Official assessment results and previous school records.",
  "Birth certificate or approved identification document.",
  "Parent or guardian contact details.",
  "Medical information and any special learning support notes.",
];

const DEFAULT_ADMISSION_DOCUMENTS = [
  "Assessment results",
  "Birth certificate",
  "Previous school report",
  "Medical record",
];

const normalizeList = (value, fallback = []) => {
  const source = Array.isArray(value)
    ? value
    : typeof value === "string"
      ? value.split(/[\n,;]+/)
      : [];

  const cleaned = source
    .map((item) => {
      if (typeof item === "string") return item.trim();
      if (item?.name) return item.name.toString().trim();
      if (item?.title) return item.title.toString().trim();
      return "";
    })
    .filter(Boolean);

  return cleaned.length ? cleaned : fallback;
};

const normalizeRequirementLines = (value) => {
  if (!value || typeof value !== "string") return DEFAULT_ADMISSION_REQUIREMENTS;

  const lines = value
    .split(/\r?\n|•/)
    .map((line) => line.replace(/^[-*]\s*/, "").trim())
    .filter(Boolean);

  return lines.length ? lines : DEFAULT_ADMISSION_REQUIREMENTS;
};

const formatSchoolDate = (value, fallback = "To be announced") => {
  if (!value) return fallback;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return fallback;
  return date.toLocaleDateString("en-KE", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const ModernSchoolLayout = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [schoolData, setSchoolData] = useState(null);
  const [uniImages, setUniImages] = useState([]);
  const [imagesLoading, setImagesLoading] = useState(true);
  const [expandedCards, setExpandedCards] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPathway, setSelectedPathway] = useState(null);
  const [selectedAchievement, setSelectedAchievement] = useState(null);
  const [achievementModalOpen, setAchievementModalOpen] = useState(false);
  const [achievementsData, setAchievementsData] = useState(null);
  const [schoolStatsData, setSchoolStatsData] = useState(null);
  const [achievementsLoading, setAchievementsLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(false);

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

  const schoolName = schoolData?.name || "Kinyui Senior School";
  const motto = schoolData?.motto || "Soaring To Excellence";
  const vision =
    schoolData?.vision ||
    "To nurture curious, capable learners prepared for leadership and service.";
  const mission =
    schoolData?.mission ||
    "To provide a supportive, future-ready education that builds knowledge, character, and skill.";
  const description = schoolData?.description;
  const studentCount = schoolData?.studentCount || 400;
  const staffCount = schoolData?.staffCount || 35;
  const contactEmail = schoolData?.admissionContactEmail || "";
  const contactPhone = schoolData?.admissionContactPhone || "";
  const subjects = normalizeList(schoolData?.subjects, DEFAULT_SUBJECTS);
  const departments = normalizeList(schoolData?.departments, DEFAULT_DEPARTMENTS);
  const admissionRequirements = normalizeRequirementLines(
    schoolData?.admissionRequirements
  );
  const admissionDocuments = normalizeList(
    schoolData?.admissionDocumentsRequired,
    DEFAULT_ADMISSION_DOCUMENTS
  );
  const admissionMeta = {
    capacity: schoolData?.admissionCapacity || "Open",
    opens: formatSchoolDate(schoolData?.admissionOpenDate),
    closes: formatSchoolDate(schoolData?.admissionCloseDate),
    location: schoolData?.admissionLocation || "Admissions Office",
    hours: schoolData?.admissionOfficeHours || "Weekdays during school hours",
  };

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
        const achievementsRes = await fetch("/api/achievements");
        const achievementsResult = await achievementsRes.json();
        if (achievementsResult.success) {
          setAchievementsData(achievementsResult);
        } else {
          console.warn("Failed to fetch achievements, using fallback");
          setAchievementsData(null);
        }
      } catch (error) {
        console.error("Error fetching achievements:", error);
        setAchievementsData(null);
      } finally {
        setAchievementsLoading(false);
      }

      try {
        const statsRes = await fetch("/api/school-stats");
        const statsResult = await statsRes.json();
        if (statsResult.success && statsResult.stats) {
          setSchoolStatsData(statsResult.stats);
        } else {
          console.warn("No school stats found, using fallback");
          setSchoolStatsData(null);
        }
      } catch (error) {
        console.error("Error fetching school stats:", error);
        setSchoolStatsData(null);
      } finally {
        setStatsLoading(false);
      }
    };

    fetchAchievementsAndStats();
  }, []);

  const getCategoryIcon = (category) => {
    const icons = {
      Academic: <FiAward className="w-5 h-5" />,
      Sports: <FiAward className="w-5 h-5" />,
      Arts: <FiAward className="w-5 h-5" />,
      Leadership: <FiStar className="w-5 h-5" />,
      Other: <FiAward className="w-5 h-5" />,
    };
    return icons[category] || <FiAward className="w-5 h-5" />;
  };

  const defaultMilestones = getDefaultAchievements().map((achievement) => ({
    ...achievement,
    year: achievement.year?.toString() || "",
    shortDescription: achievement.description || "",
    impact: achievement.awardingBody || "Achievement",
    stats: `${achievement.category} | ${achievement.year}`,
    icon: getCategoryIcon(achievement.category),
    image: achievement.images?.[0]?.url || getAchievementImageForCategory(achievement.category),
    highlights: achievement.recipients || [],
  }));

  const getAchievementPriority = (achievement) =>
    DEFAULT_ACHIEVEMENT_TITLE_ORDER[achievement.title] || 999;

  // Helper function to get achievements (API data or fallback)
  const getAchievements = () => {
    if (achievementsData?.achievements) {
      const allAchievements = [];
      const grouped = achievementsData.achievements;
      let totalCount = 0;
      Object.keys(grouped).forEach((category) => {
        if (Array.isArray(grouped[category])) {
          totalCount += grouped[category].length;
        }
      });
      if (totalCount < 1) return defaultMilestones;

      Object.keys(grouped).forEach((category) => {
        if (Array.isArray(grouped[category])) {
          grouped[category].forEach((achievement) => {
            const fallback = defaultMilestones.find(
              (item) => item.title === achievement.title
            );
            allAchievements.push({
              ...achievement,
              year: achievement.year?.toString() || "",
              title: achievement.title || "",
              shortDescription:
                achievement.description
                  ? `${achievement.description.substring(0, 120)}...`
                  : "",
              description: achievement.description || "",
              impact: achievement.awardingBody || "Achievement",
              stats: `${achievement.category} | ${achievement.year}`,
              icon: getCategoryIcon(achievement.category),
              image:
                achievement.images && achievement.images.length > 0
                  ? achievement.images[0].url
                  : fallback?.image || getAchievementImageForCategory("Leadership"),
              highlights: achievement.recipients || [],
            });
          });
        }
      });
      const sorted = allAchievements
        .sort((a, b) => {
          const priorityDiff = getAchievementPriority(a) - getAchievementPriority(b);
          if (priorityDiff !== 0) return priorityDiff;
          if ((a.displayOrder ?? 999) !== (b.displayOrder ?? 999)) {
            return (a.displayOrder ?? 999) - (b.displayOrder ?? 999);
          }
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return (parseInt(b.year, 10) || 0) - (parseInt(a.year, 10) || 0);
        })
        .slice(0, 4);
      return sorted.length > 0 ? sorted : defaultMilestones;
    }
    return defaultMilestones.slice(0, 4);
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
      image: getAchievementImageForCategory("Academic"),
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
      image: getAchievementImageForCategory("Sports"),
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
      title: "Learning Facilities",
      shortDescription:
        "Practical spaces for science, tech, arts, and independent study.",
      description:
        "Practical learning facilities for science, tech, arts, and independent study support hands-on learning, research, and collaboration.",
      metrics: "Learning Spaces",
      icon: <FiGlobe size={20} />,
      image: "/school.jpg",
    },
  ];

  const pathways = [
    {
      id: "stem",
      name: "STEM Pathway",
      icon: IoFlaskOutline,
      color: "from-blue-600 to-cyan-500",
      description: "Science, Technology, Engineering & Mathematics",
      subjects: [
        "Maths",
        "Integrated Science",
        "Computer Science",
        "Pre-Tech",
        "Health Ed",
      ],
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
        "Mathematician",
        "Statistician",
        "Actuary",
        "Quantitative Analyst",
        "Operations Researcher",
        "Econometrician",
        "Cryptographer",
        "Data Engineer",
        "Architect",
        "Landscape Architect",
        "Urban Planner",
        "Interior Designer (Tech/Arch background)",
        "Quantity Surveyor",
        "Construction Manager",
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
        "Pilot (Commercial/Aviation)",
        "Aircraft Maintenance Engineer",
        "Air Traffic Controller",
        "Drone Operator / Engineer",
        "Locomotive Engineer",
        "Marine Navigator",
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
        "STEM Educator / Teacher",
      ],
    },
    {
      id: "arts",
      name: "Arts & Sports",
      icon: IoAccessibilityOutline,
      color: "from-purple-600 to-pink-500",
      description: "Creative Arts, Performing Arts & Athletic Excellence",
      subjects: [
        "Visual Arts",
        "Music",
        "PE",
        "Creative Design",
        "Performing Arts",
      ],
      careers: [
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
        "Tourism & Cultural Officer",
      ],
    },
    {
      id: "social",
      name: "Social Sciences",
      icon: IoNewspaperOutline,
      color: "from-amber-600 to-orange-500",
      description: "Humanities, Languages & Civic Education",
      subjects: [
        "Social Studies",
        "Religious Ed",
        "Business",
        "Languages",
        "Life Skills",
      ],
      careers: [
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
        "Religious Leader (Pastor/Imam/Priest/Rabbi)",
        "Theologian",
        "Ethicist",
        "Chaplain (Hospital/Military/Prison)",
        "Religious Education Teacher",
        "Missionary",
        "Interfaith Coordinator",
        "Nonprofit Director (Faith-based)",
        "Ethics Committee Member",
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

  const subjectIconPool = [
    FiCpu,
    FiBook,
    FiGlobe,
    FiActivity,
    FiUsers,
    FiHeart,
    FiPenTool,
    FiDroplet,
    FiStar,
    FiTarget,
  ];

  const coreSubjectCards = subjects.slice(0, 10).map((subject, index) => ({
    name: subject,
    icon: subjectIconPool[index % subjectIconPool.length],
  }));

  return (
    <div className="min-h-screen bg-[#f6f7fb] text-slate-900 overflow-x-hidden">
      {/* HERO (Bento Modern) */}
      <section className="relative py-16 sm:py-20 lg:py-24">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 left-1/2 h-[30rem] w-[30rem] -translate-x-1/2 rounded-full sm:bg-gradient-to-br sm:from-indigo-200/70 sm:via-sky-200/40 sm:to-emerald-200/30 bg-gradient-to-br from-amber-200/60 via-amber-100/30 to-rose-200/25 blur-3xl" />
          <div className="absolute -bottom-28 left-10 h-[22rem] w-[22rem] rounded-full sm:bg-gradient-to-br sm:from-amber-200/40 sm:to-orange-200/20 bg-gradient-to-br from-rose-200/30 to-rose-100/15 blur-3xl" />
          <div className="absolute top-24 right-10 h-[20rem] w-[20rem] rounded-full sm:bg-gradient-to-br sm:from-sky-200/35 sm:to-indigo-200/20 bg-gradient-to-br from-amber-100/35 to-amber-50/15 blur-3xl" />
        </div>

        <div className="w-full md:w-[85%] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
            {/* Left Card */}
            <div className="order-2 lg:order-1 lg:col-span-5">
              <div className="h-full rounded-3xl border border-slate-200/70 bg-white/70 backdrop-blur p-6 sm:p-8 shadow-[0_20px_50px_rgba(2,6,23,0.08)]">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-slate-200 text-[10px] font-black uppercase tracking-[0.25em] sm:text-slate-700 text-amber-900">
                  <IoSparkles className="w-4 h-4 sm:text-orange-800 text-amber-800" />
                  Why this school
                </div>

                {/* Heading */}
                <div className="mt-5 space-y-4">
                  <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 leading-[1.05] tracking-tight">
                    {loading ? (
                      <span className="inline-flex items-center gap-2">
                        <FiLoader className="w-6 h-6 animate-spin text-orange-800" />{" "}
                        Loading...
                      </span>
                    ) : (
                      <span className="text-transparent bg-clip-text bg-gradient-to-r  from-amber-900 via-amber-800 to-rose-900">
                        Why {schoolName}
                      </span>
                    )}
                  </h1>
                  <p className="text-slate-600 text-sm sm:text-base md:text-lg leading-relaxed font-medium max-w-xl">
                    {description ||
                      "A future-ready learning community focused on academic growth, character, and real-world skills."}
                  </p>
                </div>

                <div className="mt-6 max-w-xs">
                  <div className="rounded-2xl border border-slate-200 bg-white/70 p-4 shadow-sm w-full">
                    <p className="text-[9px] font-black uppercase tracking-[0.15em] text-slate-500 mb-3">
                      Students
                    </p>
                    <div className="flex items-center gap-3">
                      <span className="shrink-0 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br sm:from-sky-500 sm:to-indigo-600 from-amber-800 to-amber-700 text-white shadow-md">
                        <FiUsers className="w-5 h-5" />
                      </span>
                      <p className="text-xl font-black text-slate-900 tracking-tight truncate">
                        {studentCount}+
                      </p>
                    </div>
                  </div>
                </div>

            {/* CTA Buttons - Flex No-Wrap & Solid Tones */}
<div className="mt-5 sm:mt-7 flex flex-wrap items-center gap-2 sm:gap-3">
  <button
    onClick={handleExplorePathways}
    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-2xl bg-slate-900 text-white font-black text-xs sm:text-sm tracking-tight shadow-xl shadow-slate-200 transition-transform active:scale-95"
  >
    Admissions <FiArrowRight className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-indigo-400" />
  </button>
  
  <button
    onClick={() => router.push("/pages/AboutUs")}
    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-2xl bg-white text-slate-900 font-black text-xs sm:text-sm tracking-tight border border-slate-200 shadow-sm transition-transform active:scale-95"
  >
    About Us
  </button>
</div>
              </div>
            </div>

            {/* Right Column - API-backed school information */}
            <div className="order-1 lg:order-2 lg:col-span-7">
              <div className="h-full rounded-2xl sm:rounded-3xl border border-slate-200 bg-white/85 p-3 sm:p-4 md:p-5 shadow-[0_25px_70px_rgba(2,6,23,0.08)] backdrop-blur">
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-3 sm:gap-4 h-full">
                  <div className="xl:col-span-7 rounded-lg sm:rounded-[1.35rem] bg-slate-950 p-4 sm:p-5 md:p-6 text-white overflow-hidden relative">
                    <div className="absolute -top-24 -right-24 h-60 w-60 rounded-full bg-amber-500/20 blur-3xl" />
                    <div className="absolute -bottom-24 -left-16 h-56 w-56 rounded-full bg-sky-500/15 blur-3xl" />

                    <div className="relative">
                      <div className="inline-flex items-center gap-1.5 sm:gap-2 rounded-full border border-white/10 bg-white/10 px-2.5 sm:px-3 py-1 sm:py-1.5 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.20em] text-white/70">
                        <FiLayers className="h-3 sm:h-3.5 w-3 sm:w-3.5 text-amber-300" />
                        School Info
                      </div>

                      <h2 className="mt-3 sm:mt-5 text-lg sm:text-2xl md:text-3xl font-black leading-tight tracking-tight">
                        Academics, admissions, and learner support in one place.
                      </h2>

                      <p className="mt-2 sm:mt-3 text-xs sm:text-sm font-medium leading-relaxed text-white/70">
                        Live school information from the school profile API, with sensible defaults when records are still being updated.
                      </p>

                      <div className="mt-4 sm:mt-6 grid grid-cols-2 gap-2 sm:gap-3">
                        {[
                          {
                            label: "Subjects",
                            value: subjects.length,
                            icon: FiBookOpen,
                          },
                          {
                            label: "Departments",
                            value: departments.length,
                            icon: FiLayers,
                          },
                          {
                            label: "Staff",
                            value: `${staffCount}+`,
                            icon: FiUsers,
                          },
                          {
                            label: "Capacity",
                            value: admissionMeta.capacity,
                            icon: FiTarget,
                          },
                        ].map((item) => {
                          const Icon = item.icon;
                          return (
                            <div
                              key={item.label}
                              className="rounded-lg sm:rounded-2xl border border-white/10 bg-white/10 p-2.5 sm:p-4"
                            >
                              <Icon className="h-3 sm:h-4 w-3 sm:w-4 text-amber-300" />
                              <p className="mt-2 sm:mt-3 text-base sm:text-xl font-black text-white">
                                {item.value}
                              </p>
                              <p className="mt-0.5 sm:mt-1 text-[8px] sm:text-[9px] font-black uppercase tracking-[0.15em] text-white/45">
                                {item.label}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="xl:col-span-5 grid grid-cols-1 gap-3 sm:gap-4">
                    <div className="rounded-lg sm:rounded-[1.35rem] border border-slate-200 bg-white p-3 sm:p-5">
                      <div className="flex items-center justify-between gap-2 sm:gap-3">
                        <div>
                          <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">
                            Admission Window
                          </p>
                          <h3 className="mt-1 sm:mt-1.5 text-sm sm:text-lg font-black text-slate-900">
                            Requirements & dates
                          </h3>
                        </div>
                        <span className="inline-flex h-9 sm:h-11 w-9 sm:w-11 items-center justify-center rounded-lg sm:rounded-2xl bg-amber-50 text-amber-900 shrink-0">
                          <FiCheckCircle className="h-4 sm:h-5 w-4 sm:w-5" />
                        </span>
                      </div>

                      <div className="mt-3 sm:mt-5 grid grid-cols-2 gap-2 sm:gap-3">
                        {[
                          ["Opens", admissionMeta.opens],
                          ["Closes", admissionMeta.closes],
                          ["Location", admissionMeta.location],
                          ["Office Hours", admissionMeta.hours],
                        ].map(([label, value]) => (
                          <div
                            key={label}
                            className="rounded-lg sm:rounded-2xl border border-slate-100 bg-slate-50 p-2 sm:p-3"
                          >
                            <p className="text-[8px] sm:text-[9px] font-black uppercase tracking-[0.12em] text-slate-400">
                              {label}
                            </p>
                            <p className="mt-0.5 sm:mt-1 text-[10px] sm:text-xs font-black leading-snug text-slate-800">
                              {value}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-lg sm:rounded-[1.35rem] border border-slate-200 bg-white p-3 sm:p-5">
                      <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">
                        Quick Admission Requirements
                      </p>
                      <div className="mt-2.5 sm:mt-4 space-y-1.5 sm:space-y-2.5">
                        {admissionRequirements.slice(0, 4).map((item) => (
                          <div key={item} className="flex gap-1.5 sm:gap-2">
                            <FiCheckCircle className="mt-0.5 h-3.5 sm:h-4 w-3.5 sm:w-4 shrink-0 text-emerald-600" />
                            <p className="text-[10px] sm:text-xs font-semibold leading-relaxed text-slate-700">
                              {item}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="xl:col-span-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                    <div className="rounded-lg sm:rounded-[1.35rem] border border-slate-200 bg-white p-3 sm:p-5 md:col-span-1">
                      <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">
                        Departments
                      </p>
                      <div className="mt-3 sm:mt-4 flex flex-wrap gap-1.5 sm:gap-2">
                        {departments.slice(0, 8).map((department) => (
                          <span
                            key={department}
                            className="rounded-full border border-amber-100 bg-amber-50 px-2 sm:px-3 py-1 text-[9px] sm:text-[11px] font-black text-amber-900"
                          >
                            {department}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-lg sm:rounded-[1.35rem] border border-slate-200 bg-white p-3 sm:p-5 md:col-span-1">
                      <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">
                        Subjects
                      </p>
                      <div className="mt-3 sm:mt-4 flex flex-wrap gap-1.5 sm:gap-2">
                        {subjects.slice(0, 10).map((subject) => (
                          <span
                            key={subject}
                            className="rounded-full border border-slate-200 bg-slate-50 px-2 sm:px-3 py-1 text-[9px] sm:text-[11px] font-black text-slate-800"
                          >
                            {subject}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-lg sm:rounded-[1.35rem] border border-slate-200 bg-white p-3 sm:p-5 md:col-span-1">
                      <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">
                        Documents
                      </p>
                      <div className="mt-3 sm:mt-4 space-y-1.5 sm:space-y-2">
                        {admissionDocuments.slice(0, 4).map((document) => (
                          <div
                            key={document}
                            className="flex items-center gap-1.5 sm:gap-2 rounded-lg sm:rounded-xl bg-slate-50 px-2 sm:px-3 py-1.5 sm:py-2"
                          >
                            <FiShield className="h-3.5 sm:h-4 w-3.5 sm:w-4 text-slate-500 shrink-0" />
                            <span className="text-[10px] sm:text-xs font-bold text-slate-700">
                              {document}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    

      {/* WHY CHOOSE US - REDESIGNED */}
      <section className="relative py-16 sm:py-20 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-44 right-10 w-[28rem] h-[28rem] sm:bg-indigo-200/35 bg-amber-200/30 rounded-full blur-3xl" />
          <div className="absolute -bottom-44 left-16 w-[26rem] h-[26rem] sm:bg-emerald-200/25 bg-rose-200/20 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Section Header */}
          <div className="text-center mb-14 sm:mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/70 border border-slate-200 text-[10px] font-black uppercase tracking-[0.25em] sm:text-slate-700 text-amber-900 mb-5">
              <FiStar className="sm:text-orange-800 text-amber-800 w-4 h-4" />
              Why Choose Us
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 leading-tight mb-3 sm:mb-4 tracking-tight">
              A bolder way to{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r  from-amber-900 via-orange-800 to-rose-900">
                learn and grow
              </span>
            </h2>
            <p className="text-slate-600 text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed font-medium">
              Distinctive advantages that shape learning, character, and future readiness.
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 md:gap-6 mb-8 sm:mb-10">
            {whyChooseUs.map((item) => (
              <div
                key={item.id}
                className="relative rounded-2xl sm:rounded-3xl p-[1px] bg-gradient-to-br from-slate-200 via-white to-slate- sm:from-slate-200 sm:via-white sm:to-slate-200 from-amber-200 via-white to-rose-200"
              >
                <div className="relative h-full rounded-[calc(1.5rem-1px)] bg-white/80 backdrop-blur border border-white/60 p-4 sm:p-5 md:p-6 shadow-sm">
                  <div className="flex items-start justify-between gap-2 sm:gap-3">
                    <div className="w-10 sm:w-11 h-10 sm:h-11 rounded-lg sm:rounded-2xl bg-gradient-to-br sm:from-indigo-600 sm:to-sky-500 from-amber-700 to-amber-600 text-white flex items-center justify-center shadow-md shrink-0">
                      <div className="text-sm sm:text-base">{item.icon}</div>
                    </div>
                    <span className="px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[9px] sm:text-[10px] font-black tracking-[0.2em] uppercase bg-slate-50 border border-slate-200 text-slate-600 shrink-0">
                      {item.metrics}
                    </span>
                  </div>

                  <h3 className="mt-3 sm:mt-4 text-sm sm:text-lg font-black text-slate-900 tracking-tight">
                    {item.title}
                  </h3>

                  <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
                    {expandedCards[item.id]
                      ? item.description
                      : item.shortDescription}
                  </p>

                  <button
                    onClick={() => toggleReadMore(item.id)}
                    className="mt-2.5 sm:mt-4 inline-flex items-center gap-0.5 sm:gap-1 text-[10px] sm:text-xs font-black tracking-widest uppercase text-orange-800"
                  >
                    {expandedCards[item.id] ? "Show Less" : "Read More"}
                    <FiChevronDown
                      className={`w-3 sm:w-4 h-3 sm:h-4  ${
                        expandedCards[item.id] ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                </div>
              </div>
            ))}
          </div>

   {/* CTA Narrative Header - Framed by Typography */}
<div className="mt-16 sm:mt-24 max-w-3xl mx-auto px-4 text-center sm:text-left">
  
  {/* Modern Framed Title */}
  <div className="relative inline-block mb-6">
    <div className="absolute -top-4 -left-4 w-8 h-8 border-t-2 border-l-2 border-indigo-500/30" />
    <h3 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tighter uppercase italic">
      The <span className="text-orange-800">Pathway</span> Strategy
    </h3>
    <div className="absolute -bottom-4 -right-4 w-8 h-8 border-b-2 border-r-2 border-indigo-500/30" />
  </div>

  {/* Framed Description without visible div borders */}
  <div className="relative mt-8 cursor-default">
    {/* Subtle Vertical Accent Line */}
    <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-indigo-500 via-sky-500 to-transparent opacity-40" />
    
    <div className="pl-6 sm:pl-10">
      <p className="text-base sm:text-lg text-slate-600 font-medium leading-relaxed">
        Our curriculum is meticulously structured to move beyond rote learning. 
        By aligning academic rigor with individual talent discovery, we ensure 
        that every student finds their unique trajectory toward excellence and 
        purpose-driven leadership.
      </p>
      
      {/* Ghost-style Action Link (Optional but keeps the logic) */}
      <div 
        onClick={handleExplorePathways}
        className="mt-6 inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] text-orange-800 cursor-pointer"
      >
        Initiate Discovery <FiArrowRight className="w-4 h-4 translate-y-[-1px]" />
      </div>
    </div>
  </div>
</div>
        </div>
      </section>

      {/* VISION / MISSION / MOTTO */}
      <section className="relative py-16 sm:py-20 overflow-hidden">
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-96 h-96 sm:bg-indigo-200/35 bg-amber-200/25 rounded-full blur-3xl opacity-60" />
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-96 h-96 sm:bg-emerald-200/20 bg-rose-200/15 rounded-full blur-3xl opacity-60" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-4 space-y-2 sm:space-y-3">
              <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 rounded-full bg-white/70 border border-slate-200">
                <IoSparkles className="sm:text-orange-800 text-amber-700 w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.20em] sm:text-slate-700 text-amber-900">
                  Core Foundations
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight tracking-tight">
                Foundations that guide{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r  from-amber-900 via-amber-800 to-rose-900">
                  how we learn
                </span>
              </h2>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed max-w-sm font-medium">
                Guiding principles for the {new Date().getFullYear()} academic year—what we believe, and how we build learners.
              </p>
            </div>

            <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  label: "Our Motto",
                  value: motto,
                  icon: FiTarget,
                  gradient: "from-indigo-600 to-sky-500",
                  bg: "bg-indigo-50",
                  text: "text-indigo-700",
                  border: "border-indigo-100",
                },
                {
                  label: "Our Vision",
                  value: vision,
                  icon: FiEye,
                  gradient: "from-emerald-600 to-teal-500",
                  bg: "bg-emerald-50",
                  text: "text-emerald-700",
                  border: "border-emerald-100",
                },
                {
                  label: "Our Mission",
                  value: mission,
                  icon: FiBookOpen,
                  gradient: "from-amber-600 to-orange-500",
                  bg: "bg-amber-50",
                  text: "text-amber-700",
                  border: "border-amber-100",
                  span: "md:col-span-2",
                },
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div
                    key={idx}
                    className={`relative p-[1px] rounded-[1.5rem] bg-gradient-to-b from-slate-200 to-white shadow-lg ${
                      item.span || ""
                    }`}
                  >
                    <div className="relative h-full bg-white/80 backdrop-blur rounded-[1.45rem] p-5 border border-slate-200/60 overflow-hidden">
                      <div
                        className={`absolute -top-8 -right-8 w-16 h-16 bg-gradient-to-br ${item.gradient} opacity-5 rounded-full`}
                      />
                      <div className="flex items-start gap-4">
                        <div
                          className={`flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center text-white shadow-md`}
                        >
                          <Icon size={18} />
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                              {item.label}
                            </h3>
                            <div
                              className={`px-2 py-0.5 rounded-full ${item.bg} border ${item.border} ${item.text} text-[8px] font-bold uppercase`}
                            >
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
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* PERFORMANCE METRICS (only if stats data exists) */}
      {!statsLoading && schoolStatsData && (
        <section className="relative py-16 sm:py-20 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute -top-44 left-1/2 h-[26rem] w-[26rem] -translate-x-1/2 rounded-full bg-gradient-to-br from-sky-200/45 via-indigo-200/30 to-emerald-200/20 blur-3xl" />
            <div className="absolute -bottom-48 right-6 h-[24rem] w-[24rem] rounded-full bg-gradient-to-br from-amber-200/30 to-orange-200/15 blur-3xl" />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="relative rounded-3xl p-[1px] bg-gradient-to-br from-slate-200 via-white to-slate-200">
              <div className="rounded-[calc(1.5rem-1px)] bg-white/80 backdrop-blur border border-white/60 p-6 sm:p-8 shadow-[0_20px_50px_rgba(2,6,23,0.06)]">
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                  <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-slate-200 text-[10px] font-black uppercase tracking-[0.25em] text-slate-700">
                      <FiActivity className="w-4 h-4 text-orange-800" />
                      Performance
                    </div>
                    <h3 className="mt-4 text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
                      Academic metrics, at a glance
                    </h3>
                    <p className="mt-2 text-sm sm:text-base text-slate-600 font-medium max-w-2xl leading-relaxed">
                      Live statistics from our academic dashboard and targets for the current cycle.
                    </p>
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
                                  schoolStatsData.meanScore >
                                  schoolStatsData.lastYearMean
                                    ? "bg-emerald-500/20 text-emerald-100 border border-emerald-400/30"
                                    : "bg-rose-500/20 text-rose-100 border border-rose-400/30"
                                }`}
                              >
                                {schoolStatsData.meanScore >
                                schoolStatsData.lastYearMean ? (
                                  <FiTrendingUp className="w-4 h-4" />
                                ) : (
                                  <FiTrendingDown className="w-4 h-4" />
                                )}
                                {Math.abs(
                                  schoolStatsData.meanScore -
                                    schoolStatsData.lastYearMean
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
                      <div className="rounded-3xl border border-slate-200 bg-white/70 p-6 shadow-sm">
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
                      <div className="rounded-3xl border border-slate-200 bg-white/70 p-6 shadow-sm">
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
                                (schoolStatsData.meanScore /
                                  schoolStatsData.targetMean) *
                                  100
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
                                    (schoolStatsData.meanScore /
                                      schoolStatsData.targetMean) *
                                      100
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
                      <div className="sm:col-span-2 rounded-3xl border border-slate-200 bg-white/70 p-6 shadow-sm">
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

<section className="relative py-16 sm:py-24 bg-slate-950 overflow-hidden text-white">
  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,#92400e_0%,transparent_35%),radial-gradient(circle_at_bottom_right,#0f172a_0%,transparent_45%)] opacity-70" />

  <div className="w-full md:w-[85%] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
    <div className="mb-10 sm:mb-14 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
      <div className="max-w-2xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.24em] text-amber-200">
          <FiAward className="h-4 w-4" />
          School Milestones
        </div>
        <h2 className="mt-5 text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
          Recent wins, visible progress, and moments worth remembering.
        </h2>
        <p className="mt-4 text-sm sm:text-base font-medium leading-relaxed text-white/60">
          Four official Kinyui milestones from music, science, national sport, and conservation clubs, synced from the live achievements API.
        </p>
      </div>

      <button
        onClick={() => router.push("/pages/Achievements")}
        className="inline-flex w-fit items-center gap-2 rounded-2xl border border-white/10 bg-white px-5 py-3 text-sm font-black text-slate-950 shadow-xl shadow-black/20"
      >
        Explore Archive <FiArrowRight className="h-4 w-4" />
      </button>
    </div>

    {achievementsLoading ? (
      <div className="py-20 text-center animate-pulse font-black uppercase text-[10px] tracking-widest text-white/40">
        Synchronizing Data...
      </div>
    ) : (
      (() => {
        const milestoneItems = getAchievements().slice(0, 4);
        const [featuredItem, ...supportItems] = milestoneItems;

        if (!featuredItem) return null;

        return (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
            <div className="lg:col-span-6">
              <div className="relative h-full overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.05]">
                <div className="relative aspect-[16/11] w-full overflow-hidden">
                  {featuredItem.image ? (
                    <Image
                      src={featuredItem.image}
                      alt={featuredItem.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-slate-900">
                      <FiAward className="text-5xl text-white/20" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/35 to-transparent" />
                  <div className="absolute bottom-5 left-5 right-5">
                    <span className="rounded-full bg-amber-300 px-3 py-1 text-[10px] font-black text-slate-950">
                      Featured Milestone
                    </span>
                    <h3 className="mt-4 text-2xl sm:text-4xl font-black tracking-tight text-white">
                      {featuredItem.title}
                    </h3>
                  </div>
                </div>

                <div className="p-6 sm:p-8">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-white/70">
                      {featuredItem.year || "Now"}
                    </span>
                    <span className="rounded-full border border-amber-300/20 bg-amber-300/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-amber-200">
                      {featuredItem.stats || featuredItem.impact || "Achievement"}
                    </span>
                  </div>
                  <p className="mt-4 text-sm sm:text-base font-medium leading-relaxed text-white/65">
                    {featuredItem.shortDescription || featuredItem.description || "A milestone from our academic and co-curricular journey, reflecting steady progress, stronger systems, and student confidence."}
                  </p>
                  <button
                    onClick={() => openAchievementModal(featuredItem)}
                    className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-xs font-black uppercase tracking-[0.16em] text-slate-950"
                  >
                    View Details <FiArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 grid grid-cols-2 gap-3 sm:gap-4">
              {supportItems.map((item, idx) => (
                <div
                  key={`${item.title}-${idx}`}
                  className="grid grid-cols-1 lg:grid-cols-[11rem_1fr] overflow-hidden rounded-[1.25rem] sm:rounded-[1.5rem] border border-white/10 bg-white/[0.04]"
                >
                  <div className="relative aspect-[4/3] lg:aspect-auto lg:min-h-full overflow-hidden">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-slate-900">
                        <FiAward className="text-3xl text-white/20" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 to-transparent" />
                  </div>

                  <div className="p-3 sm:p-5 lg:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3">
                      <p className="text-[9px] font-black uppercase tracking-[0.22em] text-amber-300">
                        {item.year || `0${idx + 2}`}
                      </p>
                      <span className="rounded-full bg-white/10 px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.16em] text-white/50">
                        {item.stats || "Milestone"}
                      </span>
                    </div>
                    <h3 className="mt-2 sm:mt-3 text-sm sm:text-lg lg:text-xl font-black tracking-tight text-white">
                      {item.title}
                    </h3>
                    <p className="mt-2 line-clamp-3 text-[11px] sm:text-sm font-medium leading-relaxed text-white/60">
                      {item.shortDescription || item.description || "A milestone from our school journey."}
                    </p>
                    <button
                      onClick={() => openAchievementModal(item)}
                      className="mt-3 sm:mt-4 inline-flex items-center gap-2 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.18em] text-white"
                    >
                      Details <FiArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })()
    )}
  </div>
</section>


      {/* SIGNATURE EXPERIENCE */}
      <section className="relative py-20 sm:py-24 bg-[#fafbfc] overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-[-10%] right-[-5%] w-[40rem] h-[40rem] bg-indigo-50/50 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] left-[-5%] w-[35rem] h-[35rem] bg-emerald-50/40 rounded-full blur-[100px]" />
        </div>

        <div className="w-full md:w-[85%] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="relative mb-10 overflow-hidden rounded-[2rem] bg-slate-950 p-6 sm:p-8 md:p-10 text-white shadow-2xl shadow-slate-200">
            <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-amber-500/20 blur-3xl" />
            <div className="absolute -bottom-28 left-1/3 h-80 w-80 rounded-full bg-sky-500/10 blur-3xl" />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
              <div className="lg:col-span-7">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.22em] text-amber-200">
                  <HiOutlineSparkles className="w-4 h-4" />
                  The Signature Experience
                </div>

                <h2 className="mt-6 text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-[1.05]">
                  A school journey built around clarity, care, and direction.
                </h2>

                <p className="mt-5 max-w-2xl text-sm sm:text-base text-white/65 font-medium leading-relaxed">
                  At {schoolName}, students are not only taught subjects; they are guided through habits, mentorship, pathways, and values that make learning feel purposeful.
                </p>
              </div>

              <div className="lg:col-span-5">
                <div className="grid grid-cols-2 gap-3">
                  {[
                    ["Subjects", subjects.length],
                    ["Departments", departments.length],
                    ["Students", `${studentCount}+`],
                    ["Staff", `${staffCount}+`],
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-2xl border border-white/10 bg-white/10 p-4">
                      <p className="text-2xl font-black text-white">{value}</p>
                      <p className="mt-1 text-[9px] font-black uppercase tracking-[0.18em] text-white/45">{label}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleExplorePathways}
                    className="flex-1 rounded-2xl bg-white px-4 py-3 text-xs font-black text-slate-950"
                  >
                    Start Admission
                  </button>
                  <button
                    onClick={() => router.push("/pages/AboutUs")}
                    className="flex-1 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-xs font-black text-white"
                  >
                    Our Story
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {whyChooseUs.map((item) => (
              <div
                key={item.id}
                className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-900">
                    {item.icon}
                  </span>
                  <span className="rounded-full bg-slate-50 px-3 py-1 text-[9px] font-black uppercase tracking-[0.16em] text-slate-400">
                    {item.metrics}
                  </span>
                </div>
                <h3 className="mt-5 text-xl font-black tracking-tight text-slate-950">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm font-medium leading-relaxed text-slate-600">
                  {item.shortDescription}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CBC Framework */}
      <section className="relative py-16 sm:py-24 text-gray-900 overflow-hidden bg-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,#f59e0b_0%,transparent_45%)] opacity-[0.08]" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="mb-10 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-100 bg-amber-50 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.24em] text-amber-900">
                <FiBookOpen className="h-4 w-4" />
                CBC Pathways
              </div>
              <h2 className="mt-5 text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-950">
                Pathway planning that connects{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-900 to-rose-900">
                  subjects, strengths, and careers
                </span>
              </h2>
              <p className="mt-4 text-sm sm:text-base font-medium leading-relaxed text-slate-600">
                Students keep a strong core while exploring specialized routes in STEM, Arts & Sports, and Social Sciences.
              </p>
            </div>

            <button
              onClick={handleExplorePathways}
              className="inline-flex w-fit items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-black text-white shadow-lg shadow-slate-200"
            >
              Admissions Pathways <FiArrowRight className="h-4 w-4 text-amber-300" />
            </button>
          </div>

          {/* THE PILLARS (Pathways First) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6 mb-16">

            {/* Pathway Cards Mapping */}
            {pathways.map((path, idx) => {
              const PathIcon = path.icon;
              return (
                <div
                  key={idx}
                  className="relative overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm"
                >
                  <div className={`absolute -right-20 -top-20 h-48 w-48 rounded-full bg-gradient-to-br ${path.color} opacity-10 blur-3xl`} />
                  <div
                    className={`relative w-12 h-12 rounded-2xl bg-gradient-to-r ${path.color} flex items-center justify-center mb-6 shadow-lg shadow-black/10`}
                  >
                    <PathIcon className="text-white text-xl" />
                  </div>

                  <h4 className="relative text-xl font-black text-slate-950 mb-2">
                    {path.name}
                  </h4>
                  <p className="relative text-slate-600 text-sm font-medium leading-relaxed mb-5">
                    {path.description}
                  </p>

                  <div className="relative mb-5">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                      Subject Focus
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {path.subjects.slice(0, 5).map((subject) => (
                        <span key={subject} className="rounded-full bg-slate-50 border border-slate-200 px-3 py-1 text-[11px] font-black text-slate-700">
                          {subject}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="relative flex items-center justify-between gap-4 border-t border-slate-100 pt-4">
                    <div>
                      <p className="text-2xl font-black text-slate-950">
                        {path.careers.length}+
                      </p>
                      <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">
                        career routes
                      </p>
                    </div>
                    <button
                      onClick={() => openModal(path)}
                      className="inline-flex items-center gap-2 rounded-xl border border-amber-100 bg-amber-50 px-3 py-2 text-xs font-black text-amber-900"
                    >
                      Explore <FiArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

{/* CORE COMPETENCIES - MOBILE OPTIMIZED (STILL) */}
<div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-stretch">
  {/* Core Subjects Grid */}
  <div className="lg:col-span-8 bg-white border border-slate-200 rounded-[2rem] p-6 sm:p-8 shadow-sm">
 <div className="flex items-center gap-4 mb-8">
  {/* Substantially increased for mobile: w-12 h-12 with text-2xl */}
  <div className="w-12 h-12 sm:w-10 sm:h-10 shrink-0 bg-amber-100 rounded-2xl sm:rounded-xl flex items-center justify-center shadow-sm">
    <IoSparkles className="text-2xl sm:text-xl text-amber-600" />
  </div>
  
  <div className="flex flex-col">
    <h4 className="font-black text-slate-900 uppercase tracking-[0.22em] text-[12px] sm:text-xs leading-none mb-1">
      Subjects Offered
    </h4>
    <span className="font-black text-slate-500 uppercase tracking-[0.15em] text-[10px] sm:text-[9px]">
      From school info
    </span>
  </div>
</div>

    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
      {coreSubjectCards.map((subj, i) => {
        const SubjIcon = subj.icon;
        return (
          <div
            key={i}
            className="flex flex-col items-center justify-center p-4 sm:p-5 rounded-[1.5rem] bg-rose-100 border border-slate-100 transition-none"
          >
            <SubjIcon className="text-xl sm:text-2xl text-rose-800 mb-2 sm:mb-3" />
            <span className="text-[10px] sm:text-[11px] font-black text-center text-slate-900 uppercase tracking-tight">
              {subj.name}
            </span>
          </div>
        );
      })}
    </div>
  </div>

  {/* CONTEXTUAL OVERVIEW */}
  <div className="lg:col-span-4 flex flex-col justify-center p-8 sm:p-10 bg-amber-900 border border-rose-500 rounded-[2rem] relative overflow-hidden text-white shadow-xl shadow-indigo-100">
    <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 blur-3xl rounded-full" />
    <div className="absolute -top-10 -left-10 w-32 h-32 bg-indigo-400/20 blur-2xl rounded-full" />
    
    <h5 className="text-xl font-black mb-4 tracking-tight uppercase italic">
      Department <span className="text-amber-200">Map</span>
    </h5>
    <p className="text-sm text-amber-50 leading-relaxed font-medium mb-6">
      Departments guide subject delivery, mentorship, practical learning, and pathway selection across the school.
    </p>

    <div className="flex flex-wrap gap-2">
      {departments.slice(0, 6).map((department) => (
        <span
          key={department}
          className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[10px] font-black text-white/85"
        >
          {department}
        </span>
      ))}
    </div>

    <div className="mt-7 flex items-center gap-4">
      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10">
        <FiUsers className="h-5 w-5 text-amber-200" />
      </div>
      <span className="text-[9px] font-black uppercase tracking-widest text-amber-100">
        Join {studentCount}+ Students
      </span>
    </div>
  </div>
</div>
        </div>
      </section>

      {/* UNIVERSITY PARTNERS */}
      <section className="relative py-16 sm:py-20 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-44 right-10 h-[26rem] w-[26rem] rounded-full bg-gradient-to-br from-indigo-200/35 to-sky-200/25 blur-3xl" />
          <div className="absolute -bottom-52 left-10 h-[28rem] w-[28rem] rounded-full bg-gradient-to-br from-emerald-200/25 to-indigo-200/15 blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/70 border border-slate-200 text-[10px] font-black uppercase tracking-[0.25em] text-slate-700 mb-5">
              <FiExternalLink className="w-4 h-4 text-orange-800" />
              University Pathways
            </div>

            <h3 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
              Partners for{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-800 via-amber-600 to-orange-900">
                next steps (Universities)
              </span>
            </h3>

            <p className="mt-5 text-slate-600 text-sm sm:text-base md:w-[62%] w-full mx-auto leading-relaxed font-medium">
              Career guidance at Kinyui connects CBC pathways with universities, mentors, and real opportunities after senior school.
            </p>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-4xl mx-auto text-left">
              {[
                {
                  label: "Pathway Matching",
                  text: "Students connect subject strengths to realistic university and career routes.",
                  icon: FiTarget,
                },
                {
                  label: "Mentorship",
                  text: "Teachers, alumni, and partners help learners make informed decisions.",
                  icon: FiUsers,
                },
                {
                  label: "Next Step Readiness",
                  text: "Application confidence, exposure, and planning are built before transition.",
                  icon: FiArrowRight,
                },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.label}
                    className="rounded-2xl border border-slate-200 bg-white/75 p-4 shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-orange-900">
                        <Icon className="w-4 h-4" />
                      </span>
                      <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-900">
                        {item.label}
                      </p>
                    </div>
                    <p className="mt-3 text-sm font-medium leading-relaxed text-slate-600">
                      {item.text}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {imagesLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <FiLoader className="w-10 h-10 animate-spin text-orange-800 mb-4" />
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
                  >
                    {scrollImages.map((img, idx) => (
                      <div
                        key={idx}
                        className="relative w-36 h-20 sm:w-44 sm:h-24 flex-shrink-0 bg-white/70 backdrop-blur rounded-2xl border border-slate-200 shadow-sm flex items-center justify-center p-4"
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

      {/* ACHIEVEMENT DETAIL MODAL */}
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
                      {selectedAchievement.icon || (
                        <FiAward className="w-5 h-5" />
                      )}
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
                  className="w-9 h-9 rounded-full bg-white/10 border border-white/15 flex items-center justify-center shrink-0"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="overflow-y-auto flex-1">
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
                {(selectedAchievement.stats || selectedAchievement.impact) && (
                  <div className="flex flex-wrap gap-2 sm:gap-3 mb-6">
                    {selectedAchievement.stats ? (
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-full border border-slate-200">
                        <FiAward className="text-orange-800 w-3.5 h-3.5 sm:w-4 sm:h-4" />
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

                <h4 className="text-base sm:text-lg font-black text-slate-900 mb-2 sm:mb-3 flex items-center gap-2">
                  <FiBookOpen className="text-orange-800 w-4 h-4 sm:w-5 sm:h-5" />
                  Story
                </h4>
                <p className="text-sm sm:text-base text-slate-700 leading-relaxed mb-6">
                  {selectedAchievement.description ||
                    selectedAchievement.shortDescription ||
                    "Details will appear here as the record is published."}
                </p>

                {selectedAchievement.highlights &&
                  selectedAchievement.highlights.length > 0 && (
                    <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
                      <h5 className="font-black text-slate-900 text-xs sm:text-sm mb-3 flex items-center gap-2 uppercase tracking-[0.2em]">
                        <FiCheckCircle className="w-4 h-4 text-emerald-600" />
                        Highlights
                      </h5>
                      <ul className="space-y-2.5">
                        {selectedAchievement.highlights.map(
                          (highlight, idx) => (
                            <li
                              key={idx}
                              className="flex items-start gap-2 text-xs sm:text-sm text-slate-700"
                            >
                              <FiCheckCircle className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                              <span>{highlight}</span>
                            </li>
                          )
                        )}
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

      {/* CAREERS MODAL */}
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
            <div
              className={`bg-gradient-to-r ${selectedPathway.color} p-4 sm:p-6 text-white shrink-0`}
            >
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
                  className="w-9 h-9 rounded-full bg-white/10 border border-white/15 flex items-center justify-center shrink-0"
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
                  <FiBook className="text-orange-800 w-4 h-4 sm:w-5 sm:h-5" />
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
                  <FiTrendingUp className="text-orange-800 w-4 h-4 sm:w-5 sm:h-5" />
                  Career Paths
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedPathway.careers.map((career, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 p-2.5 rounded-2xl bg-white/70 border border-slate-200"
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

            {/* Modal Footer */}
            <div className="p-3 sm:p-4 border-t border-slate-200 bg-slate-50 shrink-0">
              <p className="text-[10px] sm:text-xs text-slate-500 text-center leading-tight">
                These career pathways are aligned with the {schoolName}{" "}
                curriculum and preparation programs.
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
