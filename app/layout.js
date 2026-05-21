import localFont from "next/font/local";
import "./globals.css";
import ClientLayoutWrapper from "./-app";
import { SessionProvider } from "./session/sessiowrapper";
import { publicSitePages } from "./seoConfig";

/* -------------------------------------------------------------------------- */
/* FONTS                                    */
/* -------------------------------------------------------------------------- */
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const SITE_URL = "https://kinyuiboyssenior.school";
const SEO_LOGO_PATH = "/seo/SchoolLogo.png";
const SEO_LOGO_URL = `${SITE_URL}${SEO_LOGO_PATH}`;
const SEO_LOGO_IMAGE = {
  "@type": "ImageObject",
  url: SEO_LOGO_URL,
  contentUrl: SEO_LOGO_URL,
  width: 1024,
  height: 1024,
  caption: "S.A. Kinyui Boys Senior School official logo",
};
const SCHOOL_DESCRIPTION =
  "Official website of S.A. Kinyui Boys Senior School, also known as Kinyui Boys High School and Kinyui Boys Secondary School, a public boys boarding school in Matungulu, Machakos County, Kenya.";
const SCHOOL_ALTERNATE_NAMES = [
  "Kinyui Boys Senior School",
  "Kinyui Boys High School",
  "Kinyui Boys Secondary School",
  "S.A. Kinyui Boys High School",
  "S.A. Kinyui Boys Secondary School",
];

/* -------------------------------------------------------------------------- */
/* VIEWPORT                                  */
/* -------------------------------------------------------------------------- */
export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ea580c", // Matches your orange-600 brand color
};

/* -------------------------------------------------------------------------- */
/* METADATA                                  */
/* -------------------------------------------------------------------------- */
export const metadata = {
  metadataBase: new URL("https://kinyuiboyssenior.school"),
  applicationName: "S.A. Kinyui Boys Senior School",

  title: {
    default: "Kinyui Boys School",
    template: "%s | Kinyui Boys Senior School",
  },

  description: SCHOOL_DESCRIPTION,
  
  keywords: [
    /* Primary Keywords */
    "Kinyui Boys Senior School",
    "Kinyui Boys Secondary School",
    "Kinyui Boys High School",
    "S.A. Kinyui Boys Senior School",
    "Kinyui Boys School",
    "Kinyui Boys",
    
    /* Search Engine Names & Variants */
    "Kinyui Boys Official Website",
    "Kinyui Boys School Kenya",
    "Kinyui Boys School Machakos",
    "Kinyui Boys School Machakos County",
    "Kinyui Boys Extra County School",
    
    /* Academic Performance */
    "Kinyui Boys KCSE Results",
    "Kinyui Boys KCSE Performance",
    "Kinyui Boys Mean Score",
    "Kinyui Boys University Placement",
    "Kinyui Boys Rankings",
    "Top Boys Schools Machakos",
    "Best Secondary Schools Machakos County",
    
    /* Admissions & Information */
    "Kinyui Boys Admission",
    "Kinyui Boys Admissions Letter",
    "Kinyui Boys Joining Instructions",
    "Kinyui Boys Form One Selection",
    "Kinyui Boys Fees Structure",
    "Kinyui Boys School Fees",
    "Kinyui Boys Uniform",
    
    /* Contact & Location */
    "Kinyui Boys Phone Number",
    "Kinyui Boys Email Address",
    "Kinyui Boys Direction",
    "Kinyui Boys Location",
    "Kinyui Boys Map",
    "Matungulu Town Machakos",
    
    /* School Information */
    "Kinyui Boys Principal",
    "Kinyui Boys History",
    "Kinyui Boys Achievements",
    "Kinyui Boys Curriculum",
    "Kinyui Boys Events",
    "Kinyui Boys News",
    "Kinyui Boys Alumni",
    "Kinyui Boys Old Boys Association",
    
    /* Related Keywords */
    "Boys Boarding Schools Machakos",
    "Public Schools Kenya",
    "KUCCPS Kinyui Boys",
    "Machakos County Schools",
    "Secondary School Portal Kenya",
    "KCSE Results Kenya",
    
    /* Brand Variations */
    "Kinyui Boys Senior",
    "Kinyui High School",
    "Kinyui Boys official website",
    "S.A. Kinyui Boys official website",
    "Kinyui Boys Senior High School",
    
    /* Additional from existing */
    "kinyui boys contact",
    "kinyui",
    "kinyui senior",
    "kinyuo",
  ],

  authors: [{ name: "S.A. Kinyui Boys Senior School" }],
  creator: "S.A. Kinyui Boys Senior School",
  publisher: "S.A. Kinyui Boys Senior School",
  
  alternates: {
    canonical: "/",
  },

  /* Open Graph (Social Media Sharing - WhatsApp, Facebook, etc.) */
  openGraph: {
    title: "Kinyui Boys School - Official Website",
    description: "Official Kinyui Boys Website.",
    url: "https://kinyuiboyssenior.school",
    siteName: "Kinyui Boys Senior School",
    locale: "en_KE",
    type: "website",
    images: [
      {
        url: "/seo/SchoolLogo.png",
        width: 1200,
        height: 630,
        alt: "Kinyui Boys School - Official Website",
        type: "image/png",
      },
      {
        url: "https://kinyuiboyssenior.school/seo/SchoolLogo.png",
        width: 1200,
        height: 630,
        alt: "Kinyui Boys School",
        type: "image/png",
      },
    ],
  },

  /* Twitter Card */
  twitter: {
    card: "summary_large_image",
    site: "@KinyuiBoys",
    title: "Kinyui Boys Senior School - Official Website",
    description: "Official Kinyui Boys Website - Premier Public Boys Secondary School in Machakos County, Kenya.",
    images: [
      {
        url: "https://kinyuiboyssenior.school/seo/SchoolLogo.png",
        alt: "Kinyui Boys School",
      },
    ],
    creator: "@KinyuiBoys",
  },

  /* Search Engine Bot Instructions */
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

  icons: {
    icon: [
      { url: SEO_LOGO_PATH, type: "image/png", sizes: "1024x1024" },
    ],
    apple: SEO_LOGO_PATH,
    shortcut: SEO_LOGO_PATH,
  },

  verification: {
    google: "googlecb1be919748a8612",
  },

  category: "Education",
  classification: "Public boys senior school, high school, secondary school, boarding school, CBC pathways, admissions, academics, student services",

  other: {
    "geo.region": "KE-22",
    "geo.placename": "Matungulu, Machakos County, Kenya",
    "school:alternate_names": SCHOOL_ALTERNATE_NAMES.join(", "),
    "school:type": "Public boys boarding senior high school and secondary school",
    "school:curriculum": "CBC, 8-4-4",
    "school:programs": "Admissions, CBC Pathways, STEM, Social Sciences, Arts and Sports, Guidance and Counselling, Student Portal, Fees, Gallery, Achievements",
  },
};

/* -------------------------------------------------------------------------- */
/* ROOT LAYOUT                                 */
/* -------------------------------------------------------------------------- */
export default function RootLayout({ children }) {
  // Structured Data (JSON-LD) for Local Business/School SEO
  const schoolJsonLd = {
    "@context": "https://schema.org",
    "@type": "School",
    "name": "S.A. Kinyui Boys Senior School",
    "alternateName": SCHOOL_ALTERNATE_NAMES,
    "url": SITE_URL,
    "logo": SEO_LOGO_IMAGE,
    "image": SEO_LOGO_IMAGE,
    "description": SCHOOL_DESCRIPTION,
    "slogan": "Soaring To Excellence",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Matungulu",
      "addressRegion": "Machakos County",
      "addressCountry": "KE"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "-1.20826",
      "longitude": "37.32415"
    },
    "hasMap": "https://maps.app.goo.gl/TEkuDUZZnXfaE1YC8", 
    "telephone": "0790 789847",
    "email": "kinyuiboys2015@gmail.com",
    "priceRange": "N/A",
    "areaServed": ["Matungulu", "Machakos County", "Kenya"],
    "educationalLevel": ["Senior School", "High School", "Secondary School"],
    "sameAs": [
      "https://www.facebook.com/KinyuiBoysHighSchool/"
    ],
    "department": [
      { "@type": "EducationalOrganization", "name": "Admissions Office", "url": "https://kinyuiboyssenior.school/pages/admissions" },
      { "@type": "EducationalOrganization", "name": "CBC Pathways", "url": "https://kinyuiboyssenior.school/pages/admissions" },
      { "@type": "EducationalOrganization", "name": "Guidance and Counselling", "url": "https://kinyuiboyssenior.school/pages/Guidance-and-Counselling" },
      { "@type": "EducationalOrganization", "name": "School Achievements", "url": "https://kinyuiboyssenior.school/pages/Achievements" },
      { "@type": "EducationalOrganization", "name": "Staff and Departments", "url": "https://kinyuiboyssenior.school/pages/staff" }
    ],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Kinyui Boys Senior School Key Areas",
      "itemListElement": [
        { "@type": "Offer", "name": "Admissions and Application", "url": "https://kinyuiboyssenior.school/pages/admissions" },
        { "@type": "Offer", "name": "CBC Pathways", "url": "https://kinyuiboyssenior.school/pages/admissions" },
        { "@type": "Offer", "name": "Academics and Student Resources", "url": "https://kinyuiboyssenior.school/pages/StudentPortal" },
        { "@type": "Offer", "name": "Fees Information", "url": "https://kinyuiboyssenior.school/pages/fees" },
        { "@type": "Offer", "name": "News and Events", "url": "https://kinyuiboyssenior.school/pages/eventsandnews" },
        { "@type": "Offer", "name": "Gallery and School Life", "url": "https://kinyuiboyssenior.school/pages/gallery" },
        { "@type": "Offer", "name": "Achievements and Awards", "url": "https://kinyuiboyssenior.school/pages/Achievements" }
      ]
    }
  };

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "S.A. Kinyui Boys Senior School",
    "alternateName": SCHOOL_ALTERNATE_NAMES,
    "url": SITE_URL,
    "description": metadata.description,
    "publisher": {
      "@type": "School",
      "name": "S.A. Kinyui Boys Senior School",
      "url": SITE_URL,
      "logo": SEO_LOGO_IMAGE
    }
  };

  const navigationJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Kinyui Boys Senior School official website navigation",
    "itemListElement": publicSitePages.map((page, index) => ({
      "@type": "SiteNavigationElement",
      "position": index + 1,
      "name": page.title,
      "description": page.description,
      "url": `${SITE_URL}${page.path}`
    }))
  };

  const jsonLd = [schoolJsonLd, websiteJsonLd, navigationJsonLd];

  return (
    <html lang="en">
      <head>
        {/* Injecting Structured Data into the Head */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gradient-to-br from-orange-50 via-white to-amber-50 text-gray-900`}
      >
        <SessionProvider>
          <ClientLayoutWrapper>
            {/* Semantic <main> tag should wrap content in page.jsx files for SEO */}
            {children}
          </ClientLayoutWrapper>
        </SessionProvider>
      </body>
    </html>
  );
}
