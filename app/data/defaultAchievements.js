export const ACHIEVEMENT_CATEGORIES = [
  "Academic",
  "Sports",
  "Arts",
  "Leadership",
  "Cultural",
  "Debate",
  "Other",
];

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
        url: "/worship.jpg",
        public_id: "kinyui-default-kenya-music-festivals",
        caption: "Kinyui Boys performing arts and music festival participation",
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
        url: "/academics.jpg",
        public_id: "kinyui-default-kenya-science-fair",
        caption: "Kinyui Boys STEM learning and science fair innovation",
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
        url: "/hero/sports.jpeg",
        public_id: "kinyui-default-national-sports-eagles",
        caption: "The Eagles sports excellence at Kinyui Boys Senior School",
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
        url: "/hero/env.jpeg",
        public_id: "kinyui-default-clubs-tree-planting",
        caption: "Kinyui Boys clubs supporting conservation and tree planting",
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
