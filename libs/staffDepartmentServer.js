import {
  MAIN_DEPARTMENT_TYPE,
  buildDepartmentHierarchy,
  isSubDepartment,
  normalizeDepartmentType,
} from "./staffDepartmentConfig";

export const publicDepartmentStaffSelect = {
  id: true,
  name: true,
  role: true,
  position: true,
  department: true,
  departmentId: true,
  mainDepartmentId: true,
  subDepartmentId: true,
  staffType: true,
  subjectOffered: true,
  bio: true,
  gender: true,
  status: true,
  image: true,
  joinDate: true,
  createdAt: true,
  updatedAt: true,
};

export const departmentInclude = {
  images: { orderBy: [{ displayOrder: "asc" }, { createdAt: "asc" }] },
  cbePathway: true,
  departmentHead: {
    select: {
      id: true,
      name: true,
      role: true,
      position: true,
      image: true,
    },
  },
  parentDepartment: {
    select: {
      id: true,
      name: true,
      departmentType: true,
      image: true,
    },
  },
};

const isVisibleStaff = (staff, includeInactive = false) =>
  includeInactive ||
  (staff?.status || "active").toString().trim().toLowerCase() !== "inactive";

const matchesDepartment = (staff, department) => {
  const departmentId = Number(department.id);

  if (isSubDepartment(department)) {
    return (
      Number(staff.subDepartmentId) === departmentId ||
      (!staff.subDepartmentId && Number(staff.departmentId) === departmentId)
    );
  }

  return (
    Number(staff.mainDepartmentId) === departmentId ||
    (!staff.mainDepartmentId &&
      !staff.subDepartmentId &&
      Number(staff.departmentId) === departmentId)
  );
};

const matchesMainDepartmentDirectly = (staff, department) => {
  const departmentId = Number(department.id);
  return (
    (Number(staff.mainDepartmentId) === departmentId && !staff.subDepartmentId) ||
    (!staff.mainDepartmentId &&
      !staff.subDepartmentId &&
      Number(staff.departmentId) === departmentId)
  );
};

export const loadDepartmentStaff = async (prisma, includeInactive = false) => {
  const staff = await prisma.staff.findMany({
    select: publicDepartmentStaffSelect,
    orderBy: [{ role: "asc" }, { name: "asc" }],
  });
  return staff.filter((member) => isVisibleStaff(member, includeInactive));
};

export const decorateDepartment = (
  department,
  allStaff = [],
  includeStaff = false
) => {
  const assignedStaff = allStaff.filter((member) =>
    matchesDepartment(member, department)
  );
  const directStaff = isSubDepartment(department)
    ? assignedStaff
    : allStaff.filter((member) => matchesMainDepartmentDirectly(member, department));

  return {
    ...department,
    departmentType: normalizeDepartmentType(department.departmentType),
    cbePathwayType: department.cbePathway?.type || null,
    pathwayName: department.cbePathway?.name || null,
    staffCount: assignedStaff.length,
    teacherCount: assignedStaff.length,
    directStaffCount: directStaff.length,
    staff: includeStaff ? assignedStaff : undefined,
    teachers: includeStaff ? assignedStaff : undefined,
  };
};

export const decorateDepartmentList = (
  departments,
  allStaff = [],
  includeStaff = false
) => {
  const decorated = departments.map((department) =>
    decorateDepartment(department, allStaff, includeStaff)
  );

  return {
    departments: decorated,
    departmentHierarchy: buildDepartmentHierarchy(decorated),
  };
};

export const resolveDepartmentAssignments = async (
  prisma,
  { mainDepartmentId, subDepartmentId, departmentId, departmentName = "" }
) => {
  const parseId = (value) => {
    if (value === null || value === undefined || value === "") return null;
    const numeric = Number(value);
    if (!Number.isFinite(numeric)) {
      throw new Error("Invalid department selected.");
    }
    return Math.floor(numeric);
  };

  let mainId = parseId(mainDepartmentId);
  let subId = parseId(subDepartmentId);
  const legacyId = parseId(departmentId);

  if (!mainId && !subId && legacyId) {
    const legacyDepartment = await prisma.staffDepartment.findFirst({
      where: { id: legacyId, isActive: true },
      select: {
        id: true,
        name: true,
        departmentType: true,
        parentDepartmentId: true,
      },
    });

    if (!legacyDepartment) {
      throw new Error("Selected department was not found or is inactive.");
    }

    if (isSubDepartment(legacyDepartment)) {
      subId = legacyDepartment.id;
      mainId = legacyDepartment.parentDepartmentId;
    } else {
      mainId = legacyDepartment.id;
    }
  }

  if (!mainId && !subId && departmentName?.toString().trim()) {
    const namedDepartment = await prisma.staffDepartment.findFirst({
      where: { name: departmentName.toString().trim(), isActive: true },
      select: {
        id: true,
        name: true,
        departmentType: true,
        parentDepartmentId: true,
      },
    });

    if (namedDepartment) {
      if (isSubDepartment(namedDepartment)) {
        subId = namedDepartment.id;
        mainId = namedDepartment.parentDepartmentId;
      } else {
        mainId = namedDepartment.id;
      }
    }
  }

  const selectedIds = [mainId, subId].filter(Boolean);
  const selectedDepartments = selectedIds.length
    ? await prisma.staffDepartment.findMany({
        where: { id: { in: selectedIds }, isActive: true },
        select: {
          id: true,
          name: true,
          departmentType: true,
          parentDepartmentId: true,
        },
      })
    : [];

  const mainDepartment = mainId
    ? selectedDepartments.find((department) => department.id === mainId)
    : null;
  const subDepartment = subId
    ? selectedDepartments.find((department) => department.id === subId)
    : null;

  if (mainId && (!mainDepartment || isSubDepartment(mainDepartment))) {
    throw new Error("Select a valid active main department.");
  }
  if (subId && (!subDepartment || !isSubDepartment(subDepartment))) {
    throw new Error("Select a valid active sub-department.");
  }
  if (subDepartment && !mainDepartment) {
    throw new Error("A main department is required when selecting a sub-department.");
  }
  if (
    subDepartment &&
    Number(subDepartment.parentDepartmentId) !== Number(mainDepartment.id)
  ) {
    throw new Error("The selected sub-department does not belong to the main department.");
  }

  const effectiveDepartment = subDepartment || mainDepartment;
  return {
    mainDepartment,
    subDepartment,
    departmentId: effectiveDepartment?.id || null,
    departmentName:
      effectiveDepartment?.name || departmentName?.toString().trim() || null,
  };
};

export const syncDepartmentStaffCounts = async (prisma, departmentIds = []) => {
  const ids = [...new Set(departmentIds.filter(Boolean).map(Number))];
  if (!ids.length) return;

  const departments = await prisma.staffDepartment.findMany({
    where: { id: { in: ids } },
    select: { id: true, departmentType: true },
  });
  const staff = await loadDepartmentStaff(prisma, true);

  await Promise.all(
    departments.map((department) => {
      const staffCount = staff.filter((member) =>
        matchesDepartment(member, department)
      ).length;
      return prisma.staffDepartment.update({
        where: { id: department.id },
        data: { staffCount },
      });
    })
  );
};

export const validateDepartmentHierarchyInput = async (
  prisma,
  { departmentType, parentDepartmentId, currentDepartmentId = null }
) => {
  const normalizedType = normalizeDepartmentType(departmentType);

  if (normalizedType === MAIN_DEPARTMENT_TYPE) {
    return { departmentType: normalizedType, parentDepartmentId: null };
  }

  const parentId = Number(parentDepartmentId);
  if (!Number.isFinite(parentId)) {
    throw new Error("Select a parent/main department.");
  }
  if (currentDepartmentId && Number(currentDepartmentId) === parentId) {
    throw new Error("A department cannot be its own parent.");
  }

  const parentDepartment = await prisma.staffDepartment.findFirst({
    where: {
      id: Math.floor(parentId),
      departmentType: MAIN_DEPARTMENT_TYPE,
    },
    select: { id: true, name: true, isActive: true },
  });

  if (!parentDepartment) {
    throw new Error("Selected parent department was not found.");
  }

  return {
    departmentType: SUB_DEPARTMENT_TYPE,
    parentDepartmentId: parentDepartment.id,
    parentDepartment,
  };
};
