require("dotenv").config();

const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient({ log: ["error"] });

const alumniCollections = [
  {
    title: "Class of 2019 Leadership and Service",
    graduationYear: 2019,
    currentRole: "Leadership, Public Service and Community Mentorship",
    organization: "Kinyui Boys Alumni Network",
    location: "Machakos County and across Kenya",
    story:
      "This collection celebrates former student leaders whose school experience developed discipline, responsibility, teamwork, and a commitment to serving their communities.",
    achievement:
      "Members continue to support youth mentorship, community initiatives, professional networking, and leadership development.",
    image: "/home/prefects-campus.jpg",
    isActive: true,
    displayOrder: 1,
    images: [
      {
        url: "/home/prefects-campus.jpg",
        caption: "Student leaders on the Kinyui Boys campus",
        altText: "Kinyui Boys student leadership group",
      },
      {
        url: "/home/student-leaders-portrait.jpg",
        caption: "Leadership portrait",
        altText: "Kinyui Boys student leaders in school uniform",
      },
      {
        url: "/home/student-leaders-library.jpg",
        caption: "Leadership and learning community",
        altText: "Kinyui Boys students gathered near the school library",
      },
    ],
  },
  {
    title: "Class of 2020 Academic and Professional Network",
    graduationYear: 2020,
    currentRole: "Education, Business, Technology and Skilled Professions",
    organization: "Kinyui Boys Academic Alumni Circle",
    location: "Kenya and the wider East African region",
    story:
      "The academic alumni circle connects former students pursuing further education, entrepreneurship, technical training, and professional careers while maintaining strong links with their school community.",
    achievement:
      "The network promotes career guidance, academic encouragement, peer connections, and support for students preparing for life after school.",
    image: "/home/student-leaders-library.jpg",
    isActive: true,
    displayOrder: 2,
    images: [
      {
        url: "/home/student-leaders-library.jpg",
        caption: "Academic leadership community",
        altText: "Kinyui Boys students gathered outside the library",
      },
      {
        url: "/home/teacher-student-community.jpg",
        caption: "Students and mentors",
        altText: "Kinyui Boys students with a school mentor",
      },
      {
        url: "/home/campus-student-life.jpg",
        caption: "Student community on campus",
        altText: "Kinyui Boys student group on the school grounds",
      },
    ],
  },
  {
    title: "Class of 2021 Sports and Wellness Alumni",
    graduationYear: 2021,
    currentRole: "Sports, Fitness, Coaching and Youth Development",
    organization: "Kinyui Boys Sports Alumni",
    location: "Machakos, Nairobi and neighbouring counties",
    story:
      "This alumni collection recognizes former learners shaped by teamwork, resilience, healthy competition, and the discipline developed through school games and physical education.",
    achievement:
      "Members contribute to local teams, youth coaching, wellness activities, and school-community sports programmes.",
    image: "/hero/sports.jpeg",
    isActive: true,
    displayOrder: 3,
    images: [
      {
        url: "/hero/sports.jpeg",
        caption: "Kinyui Boys sports community",
        altText: "Kinyui Boys sports team and supporters",
      },
      {
        url: "/home/students-campus-grounds.jpg",
        caption: "Team spirit on campus",
        altText: "Kinyui Boys students gathered on the campus grounds",
      },
    ],
  },
  {
    title: "Class of 2022 Creative Arts and Music Alumni",
    graduationYear: 2022,
    currentRole: "Music, Creative Arts, Media and Event Production",
    organization: "Kinyui Boys Creative Alumni",
    location: "Kenya",
    story:
      "The creative alumni community brings together former students who developed confidence, expression, collaboration, and technical skills through music, performance, worship, and school events.",
    achievement:
      "Members continue to encourage student talent, participate in community events, and share creative and production skills with younger learners.",
    image: "/home/music-talent-canteen.jpg",
    isActive: true,
    displayOrder: 4,
    images: [
      {
        url: "/home/music-talent-canteen.jpg",
        caption: "Music and performance group",
        altText: "Kinyui Boys students with musical instruments and sound equipment",
      },
      {
        url: "/home/student-voice-campus.jpg",
        caption: "Student voice and performance",
        altText: "Kinyui Boys students participating in a campus activity",
      },
    ],
  },
  {
    title: "Class of 2023 STEM and Innovation Alumni",
    graduationYear: 2023,
    currentRole: "Science, Technology, Engineering and Applied Skills",
    organization: "Kinyui Boys STEM Alumni Circle",
    location: "Kenya",
    story:
      "This collection represents alumni building pathways in science, technology, engineering, agriculture, business, and practical technical fields.",
    achievement:
      "The group supports digital literacy, career talks, practical learning, innovation awareness, and mentorship for students interested in STEM pathways.",
    image: "/home/teacher-student-community.jpg",
    isActive: true,
    displayOrder: 5,
    images: [
      {
        url: "/home/teacher-student-community.jpg",
        caption: "Learning through mentorship",
        altText: "Kinyui Boys students with a teacher and mentor",
      },
      {
        url: "/home/campus-student-life.jpg",
        caption: "Collaborative student community",
        altText: "Kinyui Boys students and staff on campus",
      },
    ],
  },
  {
    title: "Class of 2024 Mentorship and Community",
    graduationYear: 2024,
    currentRole: "Mentorship, Community Service and Emerging Careers",
    organization: "Kinyui Boys Young Alumni Community",
    location: "Machakos County and beyond",
    story:
      "The young alumni community keeps recent graduates connected to the school through mentorship, career transition support, community service, and positive peer networks.",
    achievement:
      "Members provide relatable guidance on further studies, training opportunities, personal discipline, and the transition from school into adult responsibility.",
    image: "/home/student-voice-campus.jpg",
    isActive: true,
    displayOrder: 6,
    images: [
      {
        url: "/home/student-voice-campus.jpg",
        caption: "Young alumni and student voice",
        altText: "Kinyui Boys students participating in a school community activity",
      },
      {
        url: "/home/students-campus-grounds.jpg",
        caption: "Campus community",
        altText: "Kinyui Boys students together on the school grounds",
      },
      {
        url: "/home/student-leaders-portrait.jpg",
        caption: "Preparing young leaders",
        altText: "Kinyui Boys student leadership portrait",
      },
    ],
  },
];

const SECTION = "ALUMNI";

const toGovernanceRecord = (collection) => ({
  section: SECTION,
  name: collection.title,
  position: collection.currentRole,
  description: [
    `Graduating class of ${collection.graduationYear} — ${collection.organization} (${collection.location}).`,
    collection.story,
    `Achievement: ${collection.achievement}`,
  ].join("\n\n"),
  image: collection.image,
  images: collection.images,
  displayOrder: collection.displayOrder,
  isActive: collection.isActive,
});

const createOrUpdateAlumniRecord = async (collection) => {
  const data = toGovernanceRecord(collection);

  const existing = await prisma.alumniGovernanceRecord.findFirst({
    where: { section: SECTION, name: data.name },
  });

  if (existing) {
    return prisma.alumniGovernanceRecord.update({
      where: { id: existing.id },
      data,
    });
  }

  return prisma.alumniGovernanceRecord.create({ data });
};

const withTimeout = (promise, ms) =>
  new Promise((resolve, reject) => {
    const timeout = setTimeout(
      () => reject(new Error(`Timed out after ${ms / 1000}s while connecting to the database`)),
      ms
    );

    promise.then(
      (value) => {
        clearTimeout(timeout);
        resolve(value);
      },
      (error) => {
        clearTimeout(timeout);
        reject(error);
      }
    );
  });

async function main() {
  for (const collection of alumniCollections) {
    const record = await createOrUpdateAlumniRecord(collection);
    console.log(
      `Seeded alumni record: ${record.name} (${record.images.length} images)`
    );
  }

  console.log(`Seeded ${alumniCollections.length} alumni records.`);
}

console.log("Starting Kinyui alumni seed...");
withTimeout(main(), 120000)
  .catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect().catch(() => {});
  });
