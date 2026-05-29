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

const guidanceTeamMembers = [
  {
    name: "Mr. Muller",
    role: "teacher",
    title: "Guidance Counselor",
    phone: "0790 789847",
    email: "kinyuiboys2015@gmail.com",
    bio: "Senior guidance counselor dedicated to student wellbeing, mentorship, and career guidance.",
    image: "/male.png"
  },
  {
    name: "Mr. Kariuki",
    role: "teacher",
    title: "Guidance Teacher & Patron",
    phone: "0790 789847",
    email: "kinyuiboys2015@gmail.com",
    bio: "Guidance teacher and patron supporting student welfare, boarding mentorship, and counselling services.",
    image: "/male.png"
  },
  {
    name: "Mr. Mutua",
    role: "patron",
    title: "Guidance Patron",
    phone: "0790 789847",
    email: "kinyuiboys2015@gmail.com",
    bio: "School patron focused on pastoral care, leadership oversight, and guidance team support.",
    image: "/male.png"
  }
];

const schoolHubItems = [
  {
    type: "CLUB",
    title: "Academic and Sports Club",
    shortDescription: "A vibrant club that supports academics, fitness, teamwork, and competition for Kinyui Boys.",
    description:
      "The Academic and Sports Club brings together learners for debate, quizzes, athletics, and team-building activities that strengthen both mind and body.",
    contactName: "Kinyui Boys School Office",
    contactEmail: "kinyuiboys2015@gmail.com",
    contactPhone: "0790 789847",
    website: "https://kinyuiboyssenior.school/",
    socialMedia: { facebook: "https://web.facebook.com/KinyuiBoysHighSchool/?_rdc=1&_rdr#" },
    displayOrder: 1,
    location: "Main Sports Grounds",
    established: "2024",
    details: [
      { title: "Focus", content: "Debate, athletics, leadership, and academic clubs" },
      { title: "Participation", content: "Open to all senior school students" }
    ],
    image: "/hero/1.avif",
    images: [
      { url: "/hero/1.avif", altText: "Students training on the school field", displayOrder: 0 },
      { url: "/hero/2.avif", altText: "Kinyui Boys club activities", displayOrder: 1 }
    ]
  },
  {
    type: "SOCIETY",
    title: "Debate and Culture Society",
    shortDescription: "A student society focused on debating, public speaking and cultural exchange.",
    description:
      "The Debate and Culture Society builds confidence, critical thinking, and cultural appreciation through debates, drama, and student-led events.",
    contactName: "Kinyui Boys School Office",
    contactEmail: "kinyuiboys2015@gmail.com",
    contactPhone: "0790 789847",
    website: "https://kinyuiboyssenior.school/",
    socialMedia: { facebook: "https://web.facebook.com/KinyuiBoysHighSchool/?_rdc=1&_rdr#" },
    displayOrder: 2,
    location: "Culture Hall",
    established: "2023",
    details: [
      { title: "Activities", content: "Debates, public speaking, cultural shows" },
      { title: "Membership", content: "Open to all learners" }
    ],
    image: "/hero/3.avif",
    images: [
      { url: "/hero/3.avif", altText: "Students presenting at debate", displayOrder: 0 }
    ]
  },
  {
    type: "STUDENT_COUNCIL",
    title: "Student Council",
    shortDescription: "Student leaders who represent the school community and support school governance.",
    description:
      "The Student Council champions student voice, organizes school-wide initiatives, and partners with staff to improve campus life.",
    contactName: "Kinyui Boys School Office",
    contactEmail: "kinyuiboys2015@gmail.com",
    contactPhone: "0790 789847",
    website: "https://kinyuiboyssenior.school/",
    socialMedia: { facebook: "https://web.facebook.com/KinyuiBoysHighSchool/?_rdc=1&_rdr#" },
    displayOrder: 3,
    location: "School Administration Block",
    established: "2022",
    details: [
      { title: "Role", content: "Leadership, representation, mentoring, and student welfare" },
      { title: "Goals", content: "Strengthen student engagement and campus wellbeing" }
    ],
    image: "/hero/4.avif",
    images: [
      { url: "/hero/4.avif", altText: "Student council meeting", displayOrder: 0 }
    ]
  },
  {
    type: "COMPUTER_LAB",
    title: "ICT and Computer Lab",
    shortDescription: "A modern computer lab for ICT learning, digital skills and innovation at Kinyui Boys.",
    description:
      "The ICT and Computer Lab supports programming, multimedia, research, and digital literacy for senior school students.",
    contactName: "Kinyui Boys School Office",
    contactEmail: "kinyuiboys2015@gmail.com",
    contactPhone: "0790 789847",
    website: "https://kinyuiboyssenior.school/",
    socialMedia: { facebook: "https://web.facebook.com/KinyuiBoysHighSchool/?_rdc=1&_rdr#" },
    displayOrder: 4,
    location: "ICT Centre",
    established: "2024",
    details: [
      { title: "Resources", content: "Computers, projectors, Wi-Fi, and practical software labs" },
      { title: "Courses", content: "Computer Studies, ICT, Coding and digital citizenship" }
    ],
    image: "/hero/5.avif",
    images: [
      { url: "/hero/5.avif", altText: "Students using computers in lab", displayOrder: 0 }
    ]
  },
  {
    type: "FARM",
    title: "School Farm",
    shortDescription: "A practical farming space where students learn agriculture, conservation and sustainability.",
    description:
      "The School Farm provides hands-on agricultural education and supports food production, conservation and environmental stewardship.",
    contactName: "Kinyui Boys School Office",
    contactEmail: "kinyuiboys2015@gmail.com",
    contactPhone: "0790 789847",
    website: "https://kinyuiboyssenior.school/",
    socialMedia: { facebook: "https://web.facebook.com/KinyuiBoysHighSchool/?_rdc=1&_rdr#" },
    displayOrder: 5,
    location: "School Farm",
    established: "2023",
    details: [
      { title: "Learning", content: "Agriculture, horticulture, and conservation projects" },
      { title: "Impact", content: "Student-led farming and food security initiatives" }
    ],
    image: "/hero/6.avif",
    images: [
      { url: "/hero/6.avif", altText: "School farm crops and students", displayOrder: 0 }
    ]
  },
  {
    type: "BOARDING",
    title: "Boarding Life",
    shortDescription: "A structured boarding environment that supports study, discipline and character formation.",
    description:
      "Boarding Life offers safe accommodation, mentorship, extracurricular routines, and a supportive community for Kinyui boys.",
    contactName: "Kinyui Boys School Office",
    contactEmail: "kinyuiboys2015@gmail.com",
    contactPhone: "0790 789847",
    website: "https://kinyuiboyssenior.school/",
    socialMedia: { facebook: "https://web.facebook.com/KinyuiBoysHighSchool/?_rdc=1&_rdr#" },
    displayOrder: 6,
    location: "Dormitories and Dining Hall",
    established: "2015",
    details: [
      { title: "Facilities", content: "Dormitories, dining, study time and team mentorship" },
      { title: "Wellbeing", content: "Pastoral care, health support and student welfare" }
    ],
    image: "/hero/7.avif",
    images: [
      { url: "/hero/7.avif", altText: "Boarding house at Kinyui Boys", displayOrder: 0 }
    ]
  },
  {
    type: "SECURITY",
    title: "School Security",
    shortDescription: "Campus security and safety systems that protect learners and school property.",
    description:
      "School Security maintains a safe, disciplined environment through patrols, controlled access and a strong student welfare partnership.",
    contactName: "Kinyui Boys School Office",
    contactEmail: "kinyuiboys2015@gmail.com",
    contactPhone: "0790 789847",
    website: "https://kinyuiboyssenior.school/",
    socialMedia: { facebook: "https://web.facebook.com/KinyuiBoysHighSchool/?_rdc=1&_rdr#" },
    displayOrder: 7,
    location: "Campus Security Office",
    established: "2025",
    details: [
      { title: "Coverage", content: "24/7 campus patrols, access control and emergency response" },
      { title: "Commitment", content: "A secure learning environment for all school stakeholders" }
    ],
    image: "/hero/8.avif",
    images: [
      { url: "/hero/8.avif", altText: "School security and gates", displayOrder: 0 }
    ]
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

const createOrUpdateTeamMember = async (member) => {
  const existing = await prisma.teamMember.findFirst({
    where: { name: member.name, title: member.title },
  });

  const memberData = {
    role: member.role,
    title: member.title || null,
    phone: member.phone || null,
    email: member.email || null,
    bio: member.bio || null,
    image: member.image || null,
  };

  if (existing) {
    return prisma.teamMember.update({
      where: { id: existing.id },
      data: memberData,
    });
  }

  return prisma.teamMember.create({
    data: {
      name: member.name,
      ...memberData,
    },
  });
};

const createOrUpdateSchoolHubItem = async (item) => {
  const existing = await prisma.schoolHubItem.findFirst({
    where: { type: item.type, title: item.title },
    include: { images: true },
  });

  const itemData = {
    type: item.type,
    title: item.title,
    shortDescription: item.shortDescription || null,
    description: item.description || null,
    contactName: item.contactName || null,
    contactPhone: item.contactPhone || null,
    contactEmail: item.contactEmail || null,
    displayOrder: item.displayOrder || 0,
    isActive: true,
    image: item.image || null,
    details: item.details || [],
    location: item.location || null,
    established: item.established || null,
    website: item.website || null,
    socialMedia: item.socialMedia || {},
  };

  if (existing) {
    const updateData = { ...itemData };
    if (item.images && existing.images.length === 0) {
      updateData.images = {
        create: item.images.map((image) => ({
          url: image.url,
          altText: image.altText || `${item.title} image`,
          publicId: null,
          caption: image.caption || null,
          displayOrder: image.displayOrder || 0,
        })),
      };
    }

    return prisma.schoolHubItem.update({
      where: { id: existing.id },
      data: updateData,
      include: { images: true },
    });
  }

  return prisma.schoolHubItem.create({
    data: {
      ...itemData,
      images: item.images
        ? {
            create: item.images.map((image) => ({
              url: image.url,
              altText: image.altText || `${item.title} image`,
              publicId: null,
              caption: image.caption || null,
              displayOrder: image.displayOrder || 0,
            })),
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

const createOrUpdateTeamMember = async (member) => {
  const existing = await prisma.teamMember.findFirst({
    where: { name: member.name, title: member.title },
  });

  const teamMemberData = {
    role: member.role || 'teacher',
    title: member.title || null,
    phone: member.phone || null,
    email: member.email || null,
    bio: member.bio || null,
    image: member.image || null,
  };

  if (existing) {
    return prisma.teamMember.update({
      where: { id: existing.id },
      data: teamMemberData,
    });
  }

  return prisma.teamMember.create({
    data: {
      name: member.name,
      ...teamMemberData,
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

  for (const member of guidanceTeamMembers) {
    await createOrUpdateTeamMember(member);
  }

  for (const item of schoolHubItems) {
    await createOrUpdateSchoolHubItem(item);
  }

  console.log(`Seeded school info: ${school.name}`);
  console.log(`Seeded school slogan: ${stats.slogan}`);
  console.log(`Seeded ${staffDepartments.length} staff departments, ${staffData.length} staff profiles, ${guidanceTeamMembers.length} guidance team members, and ${schoolHubItems.length} school hub items.`);
}

console.log("Starting Kinyui school seed...");
withTimeout(main(), 300000)
  .catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect().catch(() => {});
  });
