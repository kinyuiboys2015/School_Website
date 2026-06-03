require("dotenv").config();

const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient({ log: ["error"] });

const departments = [
  {
    name: "Mathematics Department",
    category: "TEACHING",
    displayOrder: 1,
    description:
      "Coordinates Mathematics teaching, numeracy support, assessment preparation, and performance tracking across the school.",
    extra: {
      focusAreas: ["Mathematics", "Numeracy", "Assessment preparation"],
      subjects: ["Mathematics"],
      location: "Academic block",
      notes: "Seeded from the 2025 Kinyui Boys teacher list.",
    },
  },
  {
    name: "Applied Sciences Department",
    category: "TEACHING",
    displayOrder: 2,
    description:
      "Brings together Agriculture, Computer Studies, Home Science, biology-based practicals, and applied skills learning.",
    extra: {
      focusAreas: ["Agriculture", "Computer Studies", "Home Science", "Applied learning"],
      subjects: ["Biology", "Agriculture", "Computer Studies", "Home Science"],
      location: "Applied sciences and practical learning areas",
      notes: "Seeded from the 2025 Kinyui Boys teacher list.",
    },
  },
  {
    name: "Languages Department",
    category: "TEACHING",
    displayOrder: 3,
    description:
      "Supports Kiswahili, English, Literature, communication skills, reading culture, and language performance.",
    extra: {
      focusAreas: ["Languages", "Communication", "Reading culture", "Writing skills"],
      subjects: ["English", "Kiswahili", "Literature"],
      location: "Academic block",
      notes: "Seeded from the 2025 Kinyui Boys teacher list.",
    },
  },
  {
    name: "Humanities Department",
    category: "TEACHING",
    displayOrder: 4,
    description:
      "Coordinates humanities teaching including Geography, History, CRE, social awareness, and values-based learning.",
    extra: {
      focusAreas: ["Humanities", "Social sciences", "Religious education", "Citizenship"],
      subjects: ["Geography", "History", "CRE"],
      location: "Academic block",
      notes: "Seeded from the 2025 Kinyui Boys teacher list.",
    },
  },
];

const LEGACY_COMBINED_DEPARTMENT_NAME = "Humanities and Languages";

const teachers = [
  {
    name: "Philip K. Masila",
    tscNumber: "389431",
    phone: "0722944286",
    subjects: "Maths / Chemistry",
    teachingLoad: 5,
    departmentName: "Mathematics Department",
    gender: "male",
  },
  {
    name: "Kyalo J. Mutungi",
    tscNumber: "348510",
    phone: "0722664659",
    subjects: "Kiswahili / Geography",
    teachingLoad: 12,
    departmentName: "Languages Department",
    gender: "male",
  },
  {
    name: "Titus M. Maweu",
    tscNumber: "413704",
    phone: "0722925051",
    subjects: "Maths / Geography",
    teachingLoad: 15,
    departmentName: "Mathematics Department",
    gender: "male",
  },
  {
    name: "S.N. Ngoleni",
    tscNumber: "515200",
    phone: "0713642170",
    subjects: "Maths / Chemistry",
    teachingLoad: 22,
    departmentName: "Mathematics Department",
    gender: "male",
  },
  {
    name: "Stephen M. Mutinda",
    tscNumber: "678589",
    phone: "0725221682",
    subjects: "Maths / B/Studies",
    teachingLoad: 24,
    departmentName: "Mathematics Department",
    gender: "male",
  },
  {
    name: "Erasmus M. Ireri",
    tscNumber: "377234",
    phone: "0727448035",
    subjects: "Woodwork / PE",
    teachingLoad: 14,
    departmentName: "Applied Sciences Department",
    gender: "male",
  },
  {
    name: "S.K. Musyimi",
    tscNumber: "451923",
    phone: "0727973618",
    subjects: "Kiswahili / History",
    teachingLoad: 27,
    departmentName: "Languages Department",
    gender: "male",
  },
  {
    name: "S.M. Mutuku",
    tscNumber: "514528",
    phone: "0723260877",
    subjects: "Maths / Chemistry",
    teachingLoad: 23,
    departmentName: "Mathematics Department",
    gender: "male",
  },
  {
    name: "I. Mwende Kilonzo",
    tscNumber: "511691",
    phone: "0729374403",
    subjects: "English / Literature",
    teachingLoad: 23,
    departmentName: "Languages Department",
    gender: "female",
  },
  {
    name: "Betty W. Kung'u",
    tscNumber: "656766",
    phone: "0700722399",
    subjects: "Geography / Biology",
    teachingLoad: 21,
    departmentName: "Humanities Department",
    gender: "female",
  },
  {
    name: "B.K. Maingi",
    tscNumber: "590133",
    phone: "0720831471",
    subjects: "Kiswahili / CRE",
    teachingLoad: 19,
    departmentName: "Languages Department",
    gender: "male",
  },
  {
    name: "Leonard K. Waweru",
    tscNumber: "821646",
    phone: "0700108683",
    subjects: "Physics / Chemistry",
    teachingLoad: 23,
    departmentName: "Applied Sciences Department",
    gender: "male",
  },
  {
    name: "B.E. Otieno",
    tscNumber: "532174",
    phone: "0722645933",
    subjects: "Computer / PE",
    teachingLoad: 12,
    departmentName: "Applied Sciences Department",
    gender: "male",
  },
  {
    name: "David Ndambuki",
    tscNumber: "589954",
    phone: "0726576940",
    subjects: "Maths / Physics",
    teachingLoad: 21,
    departmentName: "Mathematics Department",
    gender: "male",
  },
  {
    name: "Edwin Mula",
    tscNumber: "787853",
    phone: "0706607994",
    subjects: "Geography / History",
    teachingLoad: 21,
    departmentName: "Humanities Department",
    gender: "male",
  },
  {
    name: "Sarah N. Sukya",
    tscNumber: "420174",
    phone: "0726557439",
    subjects: "Agriculture / Biology",
    teachingLoad: 23,
    departmentName: "Applied Sciences Department",
    gender: "female",
  },
  {
    name: "Elias Nyango",
    tscNumber: "754560",
    phone: "0720240614",
    subjects: "History / CRE",
    teachingLoad: 22,
    departmentName: "Humanities Department",
    gender: "male",
  },
  {
    name: "Belinda Opudo",
    tscNumber: "799884",
    phone: "0711802518",
    subjects: "English / Literature",
    teachingLoad: 22,
    departmentName: "Languages Department",
    gender: "female",
  },
  {
    name: "Boniface Kyalo",
    tscNumber: "BOM Teacher",
    phone: "0793658332",
    subjects: "Kiswahili / Geography",
    teachingLoad: 23,
    departmentName: "Languages Department",
    gender: "male",
  },
];

const removedTeachers = [
  {
    name: "Janet M. Mwenga",
    phone: "0704643343",
  },
];

const splitSubjects = (subjects) =>
  subjects
    .split("/")
    .map((subject) => subject.trim())
    .filter(Boolean);

const getExistingDepartment = async (name) =>
  prisma.staffDepartment.findFirst({
    where: { name },
  });

const migrateLegacyCombinedDepartment = async () => {
  const legacy = await prisma.staffDepartment.findFirst({
    where: { name: LEGACY_COMBINED_DEPARTMENT_NAME },
  });
  if (!legacy) return;

  const humanities = await getExistingDepartment("Humanities Department");
  if (!humanities) {
    await prisma.staffDepartment.update({
      where: { id: legacy.id },
      data: { name: "Humanities Department" },
    });
    return;
  }

  const legacyTeacherCount = await prisma.staff.count({
    where: { departmentId: legacy.id },
  });

  if (legacyTeacherCount === 0) {
    await prisma.staffDepartment.delete({ where: { id: legacy.id } });
  } else {
    await prisma.staffDepartment.update({
      where: { id: legacy.id },
      data: { isActive: false, staffCount: legacyTeacherCount },
    });
  }
};

const ensureDepartment = async (department) => {
  const existing = await getExistingDepartment(department.name);
  const data = {
    category: department.category,
    description: department.description,
    displayOrder: department.displayOrder,
    isActive: true,
    extra: department.extra,
  };

  if (existing) {
    return prisma.staffDepartment.update({
      where: { id: existing.id },
      data,
    });
  }

  return prisma.staffDepartment.create({
    data: {
      name: department.name,
      staffCount: 0,
      ...data,
    },
  });
};

const ensureSchoolInfoDepartment = async () => {
  const schoolInfo = await prisma.schoolInfo.findFirst();
  if (!schoolInfo) return;

  const existingDepartments = Array.isArray(schoolInfo.departments)
    ? schoolInfo.departments
    : [];
  const nextDepartments = Array.from(new Set(
    existingDepartments
      .filter((department) => department !== LEGACY_COMBINED_DEPARTMENT_NAME)
      .concat(["Languages", "Humanities"])
  ));

  if (nextDepartments.length === existingDepartments.length) return;

  await prisma.schoolInfo.update({
    where: { id: schoolInfo.id },
    data: { departments: nextDepartments },
  });
};

const removeExcludedTeachers = async () => {
  for (const teacher of removedTeachers) {
    await prisma.staff.deleteMany({
      where: {
        role: "Teacher",
        OR: [{ name: teacher.name }, { phone: teacher.phone }],
      },
    });
  }
};

const upsertTeacher = async (teacher, department) => {
  const subjects = splitSubjects(teacher.subjects);
  const isBomTeacher = teacher.tscNumber.toLowerCase().includes("bom");
  const existing = await prisma.staff.findFirst({
    where: {
      OR: [{ name: teacher.name }, { phone: teacher.phone }],
    },
  });

  const data = {
    name: teacher.name,
    role: "Teacher",
    position: isBomTeacher ? "BOM Teacher" : "Teacher",
    department: department.name,
    departmentId: department.id,
    staffType: "Teacher",
    subjectOffered: teacher.subjects,
    education: isBomTeacher ? "BOM Teacher" : `TSC Number: ${teacher.tscNumber}`,
    experience: `Teaching load: ${teacher.teachingLoad}`,
    email: null,
    phone: teacher.phone,
    bio: `${isBomTeacher ? "BOM Teacher" : `TSC Number: ${teacher.tscNumber}`}. Teaching load: ${teacher.teachingLoad}.`,
    quote: null,
    gender: teacher.gender,
    status: "active",
    joinDate: "2025",
    responsibilities: [`Teaching load: ${teacher.teachingLoad}`],
    expertise: subjects,
    achievements: [],
  };

  if (existing) {
    return prisma.staff.update({
      where: { id: existing.id },
      data,
    });
  }

  return prisma.staff.create({ data });
};

const syncDepartmentCounts = async (departmentIds) => {
  for (const departmentId of departmentIds) {
    const staffCount = await prisma.staff.count({
      where: {
        departmentId,
        role: "Teacher",
        status: { not: "inactive" },
      },
    });

    await prisma.staffDepartment.update({
      where: { id: departmentId },
      data: { staffCount },
    });
  }
};

const main = async () => {
  const departmentMap = new Map();

  await migrateLegacyCombinedDepartment();

  for (const department of departments) {
    const saved = await ensureDepartment(department);
    departmentMap.set(saved.name, saved);
  }

  await ensureSchoolInfoDepartment();
  await removeExcludedTeachers();

  for (const teacher of teachers) {
    const department = departmentMap.get(teacher.departmentName);
    if (!department) {
      throw new Error(`Missing department mapping for ${teacher.departmentName}`);
    }
    await upsertTeacher(teacher, department);
  }

  await syncDepartmentCounts([...departmentMap.values()].map((department) => department.id));

  const grouped = await prisma.staffDepartment.findMany({
    where: { id: { in: [...departmentMap.values()].map((department) => department.id) } },
    orderBy: [{ displayOrder: "asc" }, { name: "asc" }],
    select: {
      name: true,
      staffCount: true,
      teachers: {
        where: {
          role: "Teacher",
          status: { not: "inactive" },
        },
        orderBy: [{ subjectOffered: "asc" }, { name: "asc" }],
        select: {
          name: true,
          phone: true,
          subjectOffered: true,
          education: true,
          experience: true,
        },
      },
    },
  });

  console.log("Seeded Kinyui Boys teaching departments and teachers.");
  console.log(JSON.stringify(grouped, null, 2));
};

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect().catch(() => {});
  });
