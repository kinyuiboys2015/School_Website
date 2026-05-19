require("dotenv").config();

const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient({ log: ["error"] });

const schoolData = {
  name: "S.A. Kinyui Boys Senior School",
  description:
    "A C3 public boys boarding senior school in Matungulu, Machakos County, serving learners through academic discipline, character formation, mentorship, and strong values.",
  motto: "Soaring To Excellence",
  vision:
    "To be a leading centre of excellence in academic performance and holistic development of the boy child.",
  mission:
    "To provide a conducive environment for quality teaching and learning through teamwork, discipline, mentorship, and effective use of resources.",
  studentCount: 400,
  staffCount: 20,
  openDate: new Date("2026-01-06T00:00:00.000Z"),
  closeDate: new Date("2026-11-20T00:00:00.000Z"),
  subjects: [
    "English",
    "Kiswahili",
    "Mathematics",
    "Biology",
    "Chemistry",
    "Physics",
    "Business Studies",
    "Geography",
    "History and Government",
    "Christian Religious Education",
    "Agriculture",
    "Computer Studies"
  ],
  departments: [
    "Languages",
    "Mathematics",
    "Sciences",
    "Humanities",
    "Technical and Applied",
    "Guidance and Counselling",
    "Boarding and Student Welfare"
  ],
  videoTour: "https://www.youtube.com/watch?v=88g4r7sZjpQ&list=RD88g4r7sZjpQ&start_radio=1",
  videoType: "youtube",
  videoThumbnail: null,
  feesDay: null,
  feesBoarding: null,
  admissionFee: null,
  admissionOpenDate: new Date("2026-01-06T00:00:00.000Z"),
  admissionCloseDate: new Date("2026-03-31T00:00:00.000Z"),
  admissionRequirements:
    "Admission is open to qualified boys joining senior school. Required documents include assessment results or transfer documents, birth certificate, parent/guardian ID details, medical information, passport photos, and previous school report where applicable.",
  admissionCapacity: 120,
  admissionContactEmail: "kinyuiboys2015@gmail.com",
  admissionContactPhone: "0790789847",
  admissionWebsite: null,
  admissionLocation: "Matungulu Sub-County, Machakos County",
  admissionOfficeHours: "Monday - Friday: 8:00 AM - 5:00 PM",
  admissionDocumentsRequired: [
    "Birth certificate copy",
    "Assessment results or previous school report",
    "Transfer letter where applicable",
    "Parent or guardian ID copy",
    "Medical information",
    "Passport photos"
  ]
};

const statsData = {
  meanScore: null,
  lastYearMean: null,
  targetMean: null,
  slogan: "Compose Yourself To Be Great",
  sloganDescription:
    "A Kinyui Boys reminder that greatness begins with self-discipline, personal responsibility, and daily effort.",
  sloganAuthor: "Kinyui Boys Senior School"
};

const withTimeout = (promise, ms) =>
  Promise.race([
    promise,
    new Promise((_, reject) => {
      setTimeout(() => reject(new Error(`Timed out after ${ms / 1000}s while connecting to the database`)), ms);
    })
  ]);

async function main() {
  const existingSchool = await prisma.schoolInfo.findFirst();

  const school = existingSchool
    ? await prisma.schoolInfo.update({
        where: { id: existingSchool.id },
        data: schoolData
      })
    : await prisma.schoolInfo.create({
        data: schoolData
      });

  const existingStats = await prisma.schoolStats.findFirst();

  const stats = existingStats
    ? await prisma.schoolStats.update({
        where: { id: existingStats.id },
        data: statsData
      })
    : await prisma.schoolStats.create({
        data: statsData
      });

  console.log(`Seeded school info: ${school.name}`);
  console.log(`Seeded school slogan: ${stats.slogan}`);
}

withTimeout(main(), 25000)
  .catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect().catch(() => {});
  });
