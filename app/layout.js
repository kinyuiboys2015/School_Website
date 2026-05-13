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
const SEO_LOGO_JPEG = `${SITE_URL}/seo/SchoolLogo.png`;
const SEO_LOGO_PNG = `${SITE_URL}/seo/SchoolLogo.png`;
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
    default: "S.A. Kinyui Boys Senior School | High School & Secondary School",
    template: "%s | Kinyui Boys Senior School",
  },

  description: SCHOOL_DESCRIPTION,
  
  keywords: [
    "S.A. Kinyui Boys Senior School",
    "Kinyui Boys Senior School",
    "Kinyui Boys High School",
    "Kinyui Boys Secondary School",
    "S.A. Kinyui Boys High School",
    "S.A. Kinyui Boys Secondary School",
    "Kinyui Boys boarding school",
    "Kinyui Boys public boys school",
    "Kinyui Boys Matungulu",
    "Kinyui Boys Machakos County",
    "secondary schools in Matungulu",
    "high schools in Machakos County",
    "boys boarding secondary school Kenya",
    "Kinyui Boys admissions",
    "Kinyui Boys CBC pathways",
    "Kinyui Boys fees",
    "Kinyui Boys student portal",
    "Kinyui Boys achievements",
    "Kinyui Boys staff",
    "Kinyui Boys contact"
  ],

  authors: [{ name: "S.A. Kinyui Boys Senior School" }],
  creator: "S.A. Kinyui Boys Senior School",
  publisher: "S.A. Kinyui Boys Senior School",
  
  alternates: {
    canonical: "/",
  },

/* Open Graph (Social Media Sharing) */
openGraph: {
  title: "S.A. Kinyui Boys Senior School",
  description: SCHOOL_DESCRIPTION,
  url: "https://kinyuiboyssenior.school",
  siteName: "Kinyui Boys Senior School",
  locale: "en_KE",
  type: "website",
  images: [
    {
      url: "/seo/SchoolLogo.png",
      width: 1200,
      height: 630,
      alt: "S.A. Kinyui Boys Senior School logo",
    },
    {
      url: "/seo/SchoolLogo.png",
      width: 1200,
      height: 1200,
      alt: "Kinyui Boys Senior School official logo",
    },
  ],
},

/* Twitter Card */
twitter: {
  card: "summary_large_image",
  title: "S.A. Kinyui Boys Senior School | Kinyui Boys High School",
  description: SCHOOL_DESCRIPTION,
  images: ["/seo/SchoolLogo.png"],
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
      { url: "/seo/SchoolLogo.png", type: "image/jpeg" },
      { url: "/seo/SchoolLogo.png", type: "image/png" },
    ],
    apple: "/seo/SchoolLogo.png",
    shortcut: "/seo/SchoolLogo.png",
  },

  verification: {
    google: "google16e979b115c09244",
    
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
    "logo": SEO_LOGO_PNG,
    "image": [SEO_LOGO_JPEG, SEO_LOGO_PNG],
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
      "latitude": "-1.20826", // Optional: replace with your actual GPS coordinates
      "longitude": "37.32415"
    },
    "hasMap": "https://maps.app.goo.gl/TEkuDUZZnXfaE1YC8", 
    "telephone": "+254 733 587223", // Update with official school phone
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
      "logo": SEO_LOGO_PNG
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
