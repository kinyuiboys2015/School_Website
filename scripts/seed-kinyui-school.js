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
  admissionContactPhone: "0790 789847",
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

const staffDepartments = [
  {
    name: "Guidance and Counselling",
    category: "SUPPORT",
    description:
      "A caring team focused on student wellbeing, mentorship, and pastoral support across the school.",
    headName: "Mr. Muller",
    assistantHeadName: "Mr. Kariuki",
    staffCount: 3,
    displayOrder: 1,
    image: "/male.png",
    extra: {
      focusAreas: ["Mentorship", "Career guidance", "Counselling"],
      subjects: ["Guidance and Counselling"],
      location: "Guidance Office",
      notes: "This department supports student wellbeing and counselling services."
    }
  },
  {
    name: "Mathematics",
    category: "TEACHING",
    description:
      "Mathematics department leading the school in strong numeracy, problem solving, and exam preparation.",
    headName: "Stephen Mutinda",
    assistantHeadName: "",
    staffCount: 1,
    displayOrder: 2,
    image: "/male.png",
    extra: {
      focusAreas: ["Mathematics mastery", "Examination readiness", "STEM support"],
      subjects: ["Mathematics"],
      location: "Maths Block",
      notes: "Headed by the Mathematics HOD responsible for curriculum and student progress."
    }
  },
  {
    name: "Humanities",
    category: "TEACHING",
    description:
      "Humanities department supporting history, geography, CRE and related subjects with strong leadership.",
    headName: "BK Maingi",
    assistantHeadName: "",
    staffCount: 1,
    displayOrder: 3,
    image: "/male.png",
    extra: {
      focusAreas: ["Humanities education", "Social studies", "Character formation"],
      subjects: ["History", "Geography", "CRE"],
      location: "Humanities Wing",
      notes: "The HOD leads a team of humanities teachers and promotes broad-based learning."
    }
  },
  {
    name: "Applied Sciences",
    category: "TEACHING",
    description:
      "Applied Sciences department guiding students in science, technical studies, and laboratory-based learning.",
    headName: "Madam Mutuku",
    assistantHeadName: "",
    staffCount: 1,
    displayOrder: 4,
    image: "/male.png",
    extra: {
      focusAreas: ["Applied sciences", "Laboratory skills", "Practical learning"],
      subjects: ["Physics", "Chemistry", "Biology"],
      location: "Science Block",
      notes: "Responsible for applied science teaching and practical learner support."
    }
  },
  {
    name: "Languages",
    category: "TEACHING",
    description:
      "Languages department delivering strong English and Kiswahili instruction and communication skills.",
    headName: "Kilonzo",
    assistantHeadName: "",
    staffCount: 1,
    displayOrder: 5,
    image: "/male.png",
    extra: {
      focusAreas: ["Language skills", "Literacy", "Communication"],
      subjects: ["English", "Kiswahili"],
      location: "Languages Wing",
      notes: "This department looks after language teaching and school communication support."
    }
  }
];

const staffData = [
  {
    name: "Mr. Muller",
    role: "Guidance Counselor",
    position: "Guidance Counselor",
    department: "Guidance and Counselling",
    staffType: "Teacher",
    subjectOffered: "Guidance and Counselling",
    experience: "Over 8 years of experience supporting student wellbeing, career guidance, and mentorship.",
    bio: "Mr. Muller is a senior guidance counselor dedicated to mentoring students and supporting their personal development.",
    gender: "male",
    email: "muller@kinyui.ac.ke",
    phone: "0712 345678",
    joinDate: "2019",
    image: "/male.png"
  },
  {
    name: "Mr. Kariuki",
    role: "Teacher",
    position: "Guidance Teacher & Patron",
    department: "Guidance and Counselling",
    staffType: "Teacher",
    subjectOffered: "Guidance and Counselling",
    experience: "Guidance teacher with a strong pastoral care record and patronage responsibilities.",
    bio: "Mr. Kariuki supports student counselling and serves as a patron for boarding and student welfare.",
    gender: "male",
    email: "kariuki@kinyui.ac.ke",
    phone: "0712 234567",
    joinDate: "2020",
    image: "/male.png"
  },
  {
    name: "Mr. Mutua",
    role: "Patron",
    position: "Patron",
    department: "Guidance and Counselling",
    staffType: "Teacher",
    subjectOffered: "Guidance and Counselling",
    experience: "Member of the guidance team and school patron focused on student support and leadership oversight.",
    bio: "Mr. Mutua provides pastoral care and patron oversight while working with the guidance team.",
    gender: "male",
    email: "mutua@kinyui.ac.ke",
    phone: "0712 456789",
    joinDate: "2021",
    image: "/male.png"
  },
  {
    name: "Stephen Mutinda",
    role: "Teacher",
    position: "Head of Mathematics Department",
    department: "Mathematics",
    staffType: "Leadership",
    subjectOffered: "Mathematics",
    experience: "Experienced mathematics educator leading departmental curriculum, revisions, and examination preparation.",
    bio: "Stephen Mutinda is the Mathematics HOD overseeing teaching quality and student performance in the department.",
    gender: "male",
    email: "mutinda@kinyui.ac.ke",
    phone: "0712 567890",
    joinDate: "2018",
    image: "/male.png"
  },
  {
    name: "BK Maingi",
    role: "Teacher",
    position: "Head of Humanities Department",
    department: "Humanities",
    staffType: "Leadership",
    subjectOffered: "Humanities",
    experience: "Senior humanities teacher with strong expertise in history, geography, and CRE curriculum delivery.",
    bio: "BK Maingi leads the Humanities department and promotes excellent student engagement across social sciences.",
    gender: "male",
    email: "maingi@kinyui.ac.ke",
    phone: "0712 678901",
    joinDate: "2017",
    image: "/male.png"
  },
  {
    name: "Madam Mutuku",
    role: "Teacher",
    position: "Head of Applied Sciences Department",
    department: "Applied Sciences",
    staffType: "Leadership",
    subjectOffered: "Applied Sciences",
    experience: "Science department leader with a strong track record in laboratory teaching and applied learning.",
    bio: "Madam Mutuku leads the Applied Sciences department with focus on practical science and student success.",
    gender: "female",
    email: "mutuku@kinyui.ac.ke",
    phone: "0712 789012",
    joinDate: "2016",
    image: "/female.png"
  },
  {
    name: "Kilonzo",
    role: "Teacher",
    position: "Head of Languages Department",
    department: "Languages",
    staffType: "Leadership",
    subjectOffered: "Languages",
    experience: "Language specialist leading English and Kiswahili curriculum with strong communication focus.",
    bio: "Kilonzo leads the Languages department and supports student literacy, reading, and expression.",
    gender: "male",
    email: "kilonzo@kinyui.ac.ke",
    phone: "0712 890123",
    joinDate: "2015",
    image: "/male.png"
  }
];

const createOrUpdateDepartment = async (department) => {
  const existing = await prisma.staffDepartment.findFirst({
    where: { name: department.name }
  });

  const departmentData = {
    category: department.category,
    description: department.description || null,
    headName: department.headName || null,
    assistantHeadName: department.assistantHeadName || null,
    staffCount: department.staffCount || 0,
    displayOrder: department.displayOrder || 0,
    isActive: true,
    image: department.image || null,
    extra: department.extra || null,
  };

  if (existing) {
    return prisma.staffDepartment.update({
      where: { id: existing.id },
      data: departmentData,
      include: { images: true },
    });
  }

  return prisma.staffDepartment.create({
    data: {
      name: department.name,
      ...departmentData,
      images: department.image
        ? {
            create: [
              {
                url: department.image,
                publicId: null,
                altText: `${department.name} department image`,
                displayOrder: 0,
              },
            ],
          }
        : undefined,
    },
    include: { images: true },
  });
};

const createOrUpdateStaff = async (staff, departmentIds) => {
  const departmentId = departmentIds[staff.department] || null;
  const existing = await prisma.staff.findFirst({
    where: {
      name: staff.name,
      position: staff.position,
    },
  });

  const staffData = {
    role: staff.role,
    position: staff.position,
    department: staff.department,
    departmentId,
    staffType: staff.staffType,
    subjectOffered: staff.subjectOffered,
    experience: staff.experience || null,
    bio: staff.bio || null,
    gender: staff.gender || 'male',
    email: staff.email || null,
    phone: staff.phone || null,
    joinDate: staff.joinDate || null,
    image: staff.image || null,
    status: 'active',
  };

  if (existing) {
    return prisma.staff.update({
      where: { id: existing.id },
      data: staffData,
    });
  }

  return prisma.staff.create({
    data: {
      name: staff.name,
      ...staffData,
    },
  });
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

  const departmentIds = {};
  for (const department of staffDepartments) {
    const dept = await createOrUpdateDepartment(department);
    departmentIds[department.name] = dept.id;
  }

  for (const staff of staffData) {
    await createOrUpdateStaff(staff, departmentIds);
  }

  console.log(`Seeded school info: ${school.name}`);
  console.log(`Seeded school slogan: ${stats.slogan}`);
  console.log(`Seeded ${staffDepartments.length} staff departments and ${staffData.length} staff profiles.`);
}

withTimeout(main(), 120000)
  .catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect().catch(() => {});
  });
