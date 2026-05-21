export const ACHIEVEMENT_CATEGORIES = [
  "Academic",
  "Sports",
  "Arts",
  "Leadership",
  "Cultural",
  "Debate",
  "Other",
];

export const ACHIEVEMENT_HOME_IMAGES = {
  Academic: "/home/student-leaders-library.jpg",
  Sports: "/home/campus-student-life.jpg",
  Arts: "/home/music-talent-canteen.jpg",
  Leadership: "/home/prefects-campus.jpg",
  Cultural: "/home/student-voice-campus.jpg",
  Debate: "/home/student-leaders-portrait.jpg",
  Other: "/home/students-campus-grounds.jpg",
};

export const getAchievementImageForCategory = (category = "Other") =>
  ACHIEVEMENT_HOME_IMAGES[category] || ACHIEVEMENT_HOME_IMAGES.Other;

export const KINYUI_DEFAULT_ACHIEVEMENTS = [
  {
    id: -101,
    title: "Kenya Music Festivals",
    description:
      "Kinyui Boys Senior School continues to grow a confident creative arts culture through music, choral performance, stage presentation, and disciplined teamwork at the Kenya Music Festivals.",
    category: "Arts",
    year: 2026,
    images: [
      {
        url: ACHIEVEMENT_HOME_IMAGES.Arts,
        public_id: "kinyui-default-kenya-music-festivals",
        caption: "Kinyui Boys music and talent team",
      },
    ],
    featured: true,
    displayOrder: 1,
    isActive: true,
    awardingBody: "Kenya Music Festivals",
    recipients: [
      "School choir",
      "Performing arts team",
      "Music patrons",
      "Student performers",
    ],
    achievedDate: "2026-05-01T00:00:00.000Z",
    createdAt: "2026-05-01T00:00:00.000Z",
    updatedAt: "2026-05-01T00:00:00.000Z",
  },
  {
    id: -102,
    title: "Kenya Science Fair",
    description:
      "Learners represented Kinyui Boys through research, innovation, presentation, and practical problem solving at the Kenya Science Fair, strengthening the school's STEM identity.",
    category: "Academic",
    year: 2026,
    images: [
      {
        url: ACHIEVEMENT_HOME_IMAGES.Academic,
        public_id: "kinyui-default-kenya-science-fair",
        caption: "Kinyui Boys learners representing academic excellence",
      },
    ],
    featured: true,
    displayOrder: 2,
    isActive: true,
    awardingBody: "Kenya Science Fair",
    recipients: [
      "Science club",
      "STEM learners",
      "Science department",
      "Project mentors",
    ],
    achievedDate: "2026-05-02T00:00:00.000Z",
    createdAt: "2026-05-02T00:00:00.000Z",
    updatedAt: "2026-05-02T00:00:00.000Z",
  },
  {
    id: -103,
    title: "Excellence in National Sports - Eagles Soar Higher",
    description:
      "The Eagles spirit continues to define Kinyui Boys in national sports, with discipline, endurance, teamwork, and school pride driving excellence across competitive games.",
    category: "Sports",
    year: 2026,
    images: [
      {
        url: ACHIEVEMENT_HOME_IMAGES.Sports,
        public_id: "kinyui-default-national-sports-eagles",
        caption: "Kinyui Boys student life and school pride",
      },
    ],
    featured: true,
    displayOrder: 3,
    isActive: true,
    awardingBody: "National School Sports Competitions",
    recipients: [
      "The Eagles teams",
      "Games department",
      "Team captains",
      "Student athletes",
    ],
    achievedDate: "2026-05-03T00:00:00.000Z",
    createdAt: "2026-05-03T00:00:00.000Z",
    updatedAt: "2026-05-03T00:00:00.000Z",
  },
  {
    id: -104,
    title: "Successful School Clubs and Environmental Conservation",
    description:
      "Active clubs at Kinyui Boys are building leadership and service through environmental conservation, tree planting, teamwork, mentorship, and practical care for the school compound.",
    category: "Leadership",
    year: 2026,
    images: [
      {
        url: ACHIEVEMENT_HOME_IMAGES.Leadership,
        public_id: "kinyui-default-clubs-tree-planting",
        caption: "Kinyui Boys prefects and student leadership",
      },
    ],
    featured: true,
    displayOrder: 4,
    isActive: true,
    awardingBody: "Kinyui Boys Senior School Clubs",
    recipients: [
      "Environmental club",
      "Student leaders",
      "Club patrons",
      "Tree planting teams",
    ],
    achievedDate: "2026-05-04T00:00:00.000Z",
    createdAt: "2026-05-04T00:00:00.000Z",
    updatedAt: "2026-05-04T00:00:00.000Z",
  },
];

export const DEFAULT_ACHIEVEMENT_TITLE_ORDER = KINYUI_DEFAULT_ACHIEVEMENTS.reduce(
  (orderMap, achievement, index) => ({
    ...orderMap,
    [achievement.title]: index + 1,
  }),
  {}
);

export const getDefaultAchievements = () =>
  KINYUI_DEFAULT_ACHIEVEMENTS.map((achievement) => ({
    ...achievement,
    images: achievement.images.map((image) => ({ ...image })),
    recipients: [...achievement.recipients],
  }));
