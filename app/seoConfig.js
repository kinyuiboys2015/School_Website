const SITE_URL = "https://kinyuiboyssenior.school";
const SITE_NAME = "S.A. Kinyui Boys Senior School";
const DEFAULT_IMAGE = `${SITE_URL}/seo/kinyui.jpeg`;

export const publicSitePages = [
  {
    path: "/",
    title: "S.A. Kinyui Boys Senior School",
    description:
      "Official website of S.A. Kinyui Boys Senior School in Matungulu, Machakos County, with admissions, academics, CBC pathways, news, achievements, fees, gallery, staff, and student services.",
  },
  {
    path: "/pages/AboutUs",
    title: "About Kinyui Boys Senior School",
    description:
      "Learn about S.A. Kinyui Boys Senior School, its history, mission, vision, values, location, and commitment to academic excellence and character formation.",
  },
  {
    path: "/pages/admissions",
    title: "Admissions and CBC Pathways",
    description:
      "Explore admissions, CBC pathways, joining requirements, application guidance, documents, transfers, and academic routes at Kinyui Boys Senior School.",
  },
  {
    path: "/pages/Apply%20Now",
    title: "Apply Now",
    description:
      "Submit an application to join S.A. Kinyui Boys Senior School and begin the admissions process through the official school website.",
  },
  {
    path: "/pages/Achievements",
    title: "Achievements and Awards",
    description:
      "View academic, co-curricular, institutional, and student achievements from S.A. Kinyui Boys Senior School.",
  },
  {
    path: "/pages/School%20Achievements",
    title: "School Achievements",
    description:
      "Browse official school achievement records, milestones, awards, and progress updates from Kinyui Boys Senior School.",
  },
  {
    path: "/pages/eventsandnews",
    title: "Events and News",
    description:
      "Read the latest school news, announcements, events, updates, and community stories from Kinyui Boys Senior School.",
  },
  {
    path: "/pages/gallery",
    title: "Gallery",
    description:
      "Explore photos and visual highlights from school life, activities, events, facilities, and student programs at Kinyui Boys Senior School.",
  },
  {
    path: "/pages/staff",
    title: "Staff and Departments",
    description:
      "Meet the teaching staff, departments, administration, and support teams serving students at S.A. Kinyui Boys Senior School.",
  },
  {
    path: "/pages/StudentPortal",
    title: "Student Portal",
    description:
      "Access the Kinyui Boys Senior School student portal for assignments, resources, results, fee balances, guidance sessions, and student services.",
  },
  {
    path: "/pages/Guidance-and-Councelling",
    title: "Guidance and Counselling",
    description:
      "Find guidance and counselling services, mentorship, student welfare support, sessions, and personal development resources.",
  },
  {
    path: "/pages/OurSchoolPolicies",
    title: "School Policies",
    description:
      "Read official school policies, student rules, expectations, conduct guidance, and institutional standards at Kinyui Boys Senior School.",
  },
  {
    path: "/pages/fees",
    title: "Fees and Payment Information",
    description:
      "View Kinyui Boys Senior School fee structures, boarding fees, admission fees, downloadable documents, and payment information.",
  },
  {
    path: "/pages/Magazine",
    title: "School Magazine",
    description:
      "Read the official Kinyui Boys Senior School magazine, features, stories, updates, and school community highlights.",
  },
  {
    path: "/pages/careers",
    title: "Careers and Career Guidance",
    description:
      "Explore career pathways, subject guidance, departments, future opportunities, and career planning support for students.",
  },
  {
    path: "/pages/contact",
    title: "Contact Kinyui Boys Senior School",
    description:
      "Contact S.A. Kinyui Boys Senior School for admissions, fees, academic inquiries, location, directions, phone, email, and office hours.",
  },
];

export function createPageMetadata(path) {
  const page = publicSitePages.find((item) => item.path === path);
  const title = page?.title || SITE_NAME;
  const description = page?.description || publicSitePages[0].description;

  return {
    title,
    description,
    alternates: {
      canonical: path,
    },
    openGraph: {
      title: `${title} | Kinyui Boys Senior School`,
      description,
      url: `${SITE_URL}${path}`,
      siteName: "Kinyui Boys Senior School",
      type: "website",
      images: [
        {
          url: DEFAULT_IMAGE,
          width: 1200,
          height: 630,
          alt: `${title} - Kinyui Boys Senior School`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | Kinyui Boys Senior School`,
      description,
      images: [DEFAULT_IMAGE],
    },
  };
}

export { SITE_URL, SITE_NAME, DEFAULT_IMAGE };
