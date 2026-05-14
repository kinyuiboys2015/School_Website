const SITE_URL = "https://kinyuiboyssenior.school";
const SITE_NAME = "S.A. Kinyui Boys Senior School";
const DEFAULT_IMAGE = `${SITE_URL}/seo/kinyui.png`;
const SITE_SEARCH_DESCRIPTION =
  "Official website of S.A. Kinyui Boys Senior School, also known as Kinyui Boys High School and Kinyui Boys Secondary School, a public boys boarding school in Matungulu, Machakos County.";

export const publicSitePages = [
  {
    path: "/",
    title: "S.A. Kinyui Boys Senior School",
    description: SITE_SEARCH_DESCRIPTION,
  },
  {
    path: "/pages/AboutUs",
    title: "About Kinyui Boys Senior School",
    description:
      "Learn about S.A. Kinyui Boys Senior School, historically searched as Kinyui Boys High School and Kinyui Boys Secondary School, in Matungulu, Machakos County.",
  },
  {
    path: "/pages/admissions",
    title: "Admissions and CBC Pathways",
    description:
      "Explore admissions, CBC pathways, joining requirements, documents, transfers, and academic routes at Kinyui Boys Senior School, Kinyui Boys High School.",
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
    path: "/pages/school-hub",
    title: "School Hub",
    description:
      "Explore Kinyui Boys Senior School clubs, societies, student council, boarding life, ICT, farm, security, and departments.",
  },
  {
    path: "/pages/school-hub/clubs",
    title: "Clubs",
    description:
      "Explore student clubs and co-curricular groups at Kinyui Boys Senior School.",
  },
  {
    path: "/pages/school-hub/societies",
    title: "Societies",
    description:
      "Explore academic societies and student groups at Kinyui Boys Senior School.",
  },
  {
    path: "/pages/school-hub/student-council",
    title: "Student Council",
    description:
      "Explore student leadership, governance, and learner voice at Kinyui Boys Senior School.",
  },
  {
    path: "/pages/school-hub/computer-lab",
    title: "Computer Lab",
    description:
      "Explore ICT and computer lab facilities at Kinyui Boys Senior School.",
  },
  {
    path: "/pages/school-hub/farm",
    title: "School Farm",
    description:
      "Explore agriculture, conservation, and practical farm learning at Kinyui Boys Senior School.",
  },
  {
    path: "/pages/school-hub/boarding",
    title: "Boarding",
    description:
      "Explore boarding life, student welfare, and residential support at Kinyui Boys Senior School.",
  },
  {
    path: "/pages/school-hub/security",
    title: "Security",
    description:
      "Explore campus safety and security services at Kinyui Boys Senior School.",
  },
  {
    path: "/pages/school-hub/departments",
    title: "Departments Hub",
    description:
      "Explore academic and support departments at Kinyui Boys Senior School.",
  },
  {
    path: "/pages/StudentPortal",
    title: "Student Portal",
    description:
      "Access the Kinyui Boys Senior School student portal for assignments, resources, results, fee balances, guidance sessions, and student services.",
  },
  {
    path: "/pages/Guidance-and-Counselling",
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
      "Contact S.A. Kinyui Boys Senior School, also known as Kinyui Boys High School and Kinyui Boys Secondary School, for admissions, fees, directions, phone, and email.",
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
          width: 1024,
          height: 1024,
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
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export { SITE_URL, SITE_NAME, DEFAULT_IMAGE };
