export const CBC_CATEGORY = "CBC";

export const STAFF_DEPARTMENT_CATEGORIES = [
  { value: CBC_CATEGORY, label: "CBC Department" },
  { value: "EIGHT_FOUR_FOUR", label: "8-4-4 Department" },
  { value: "TEACHING", label: "Teaching Department" },
  { value: "SUPPORT", label: "Support / Non-Teaching" },
];

export const VALID_STAFF_DEPARTMENT_CATEGORIES = new Set(
  STAFF_DEPARTMENT_CATEGORIES.map((category) => category.value)
);

export const CBC_PATHWAYS = [
  {
    type: "STEM",
    name: "STEM",
    description: "Science, Technology, Engineering and Mathematics pathway.",
  },
  {
    type: "SOCIAL_SCIENCES",
    name: "Social Sciences",
    description: "Languages, humanities and business-focused pathway.",
  },
  {
    type: "ARTS_SPORT_SCIENCE",
    name: "Arts & Sports Science",
    description: "Creative arts, performance and sports science pathway.",
  },
];

export const VALID_CBC_PATHWAY_TYPES = new Set(
  CBC_PATHWAYS.map((pathway) => pathway.type)
);

export const DEPARTMENT_IMAGE_LIBRARY = [
  {
    url: "/departments/sciences.JPG",
    label: "Sciences Department",
  },
  {
    url: "/departments/languages.JPG",
    label: "Languages Department",
  },
  {
    url: "/departments/languages 2.JPG",
    label: "Languages Department Group",
  },
  {
    url: "/departments/humanities.JPG",
    label: "Humanities Department",
  },
  {
    url: "/departments/hunamities2.JPG",
    label: "Humanities Department Group",
  },
];

export const normalizeDepartmentCategory = (category = "") =>
  category.toString().trim().toUpperCase() === "CBE"
    ? CBC_CATEGORY
    : category.toString().trim().toUpperCase();

export const isCbcDepartment = (departmentOrCategory) => {
  const category =
    typeof departmentOrCategory === "string"
      ? departmentOrCategory
      : departmentOrCategory?.category;
  return normalizeDepartmentCategory(category) === CBC_CATEGORY;
};

export const getDepartmentPathway = (department) => {
  if (!department) return null;
  if (department.cbePathway) return department.cbePathway;

  const type = department.cbePathwayType || department.pathwayType;
  return CBC_PATHWAYS.find((pathway) => pathway.type === type) || null;
};

export const getDepartmentLeader = (department) => {
  const cbc = isCbcDepartment(department);
  return {
    label: cbc ? "Pathway Head" : "Head of Department",
    shortLabel: cbc ? "Pathway Head" : "HOD",
    name: cbc ? department?.pathwayHeadName : department?.headName,
  };
};

export const isDepartmentLibraryImage = (url = "") =>
  DEPARTMENT_IMAGE_LIBRARY.some((image) => image.url === url);
