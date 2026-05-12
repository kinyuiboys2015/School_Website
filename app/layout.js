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
    default: "S.A. Kinyui Boys School",
    template: "%s | Kinyui Boys Senior School",
  },

  description:
    "Official website of S.A. Kinyui Boys",
  
"keywords": [
    // Core Names & Official Identity
    "SA kinyui boys sec School",
    "SA  High School",
    "SA Kinyui High School",
    "kinyui boys High School",
    "kinyui boys boarding School",
    "SA kinyui boys High School",
    "S.A kinyui boys High School",
    "SA kinyui boys High School",
    "SA kinyui boys High School",

    "kinyui boys Senior High School",
    "kinyui boys Secondary School",
    "SA kinyui boys Secondary School",
    "SA kinyui boys Senior High",
    "SA Kinyui",
    "SA kinyui boys",
    "S.A kinyui boys",
    "Kinyui High School",
    "Kinyui Senior High School",
    "kinyui boys School",
    "kinyui boys Senior School",
    "Kinyui School",
    "Kinyui",
    "Kinyui Boys Senior School official website",
    "Kinyui Boys Senior School admissions",
    "Kinyui Boys Senior School CBC pathways",
    "Kinyui Boys Senior School STEM pathway",
    "Kinyui Boys Senior School social sciences pathway",
    "Kinyui Boys Senior School arts and sports pathway",
    "Kinyui Boys Senior School academics",
    "Kinyui Boys Senior School fee structure",
    "Kinyui Boys Senior School student portal",
    "Kinyui Boys Senior School gallery",
    "Kinyui Boys Senior School news and events",
    "Kinyui Boys Senior School achievements and awards",
    "Kinyui Boys Senior School staff and departments",
    "Kinyui Boys Senior School guidance and counselling",
    "Kinyui Boys Senior School policies",
    "Kinyui Boys Senior School magazine",
    "Kinyui Boys Senior School careers",
    "Kinyui Boys Senior School contact",

    // Institutional Specifics (New & Essential)
    "kinyui boys Boarding School",
    "SA Sponsored Schools Machakos",
    "kinyui boys County Secondary School",
    "kinyui boys 6-stream enrollment school",
    "God-fearing citizens kinyui boys", // From school mission
    "Empowered students kinyui boys",

    // Location-Specific & Regional
    "kinyui boys Senior School Matungulu",
    "Secondary schools in Matungulu East",
    "High schools in Machakos County",
    "Best secondary schools in Machakos",
    "Public schools in Kenya",
    "Schools near Matungulu",
    "Best day schools in Matungulu",
    "kinyui boys school location",
    "kinyui boys school map",
    "Kangundo sub-region schools",
    "Tala-Matungulu area schools",

    // Functional & API Specific (For your integration)
    "kinyui boys high school results",
    "kinyui boys high school admissions",
    "kinyui boys high school events",
    "kinyui boys high  school news",
    "kinyui boys school contact",
    "kinyui boys school history",
    "kinyui boys school achievements",
    "kinyui boys school curriculum",
    "kinyui boys school fees",
    "kinyui boys school uniform",
    "kinyui boys school alumni",
    "kinyui boys school principal",
    "kinyui boys school staff",
    "kinyui boys student portal",
    "kinyui boys assignment uploads",
    "kinyui boys exam schedule",
    "kinyui boys video tour",
    "kinyui boys resources and downloads",

    // kinyui boys High School + Official Extensions
    "kinyui boys High School KCSE Results",
    "kinyui boys High School KNEC Code 12345507",
    "kinyui boys High School County Boarding",
    "kinyui boys High School Matungulu Sub-county",
    "kinyui boys High School Machakos Area",
    "kinyui boys High School Technology Literacy Center",
    "kinyui boys High School God-fearing Citizens",
    "kinyui boys High School Fully Empowered Learners",
    "kinyui boys High School Since 1976",

    // Technical & Partners (SEO & Verification)
    "kinyui boys school computer lab",
    "kinyui boys digital learning portal",

    // SEO Misspellings & Slang
    "kunyui sec school",
    "kinui school",
    "Kinyui senior school",
    "kiyui high",
    "kinyui boys sec",
    "kinyui boys boys and girls"
  ],

  authors: [{ name: "S.A. Kinyui Boys Senior School" }],
  creator: "S.A. Kinyui Boys Senior School",
  publisher: "S.A. Kinyui Boys Senior School",
  
  alternates: {
    canonical: "/",
  },

/* Open Graph (Social Media Sharing) */
openGraph: {
  title: "S.A. Kinyui Boys School",
  description: "Official school website of S.A. Kinyui Boys Senior School.",
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
  title: "S.A. Kinyui Boys Senior School",
  description: "Official school website of S.A. Kinyui Boys Senior School.",
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
  classification: "Public boys senior school, secondary education, CBC pathways, admissions, academics, student services",

  other: {
    "geo.region": "KE-22",
    "geo.placename": "Matungulu, Machakos County, Kenya",
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
    "alternateName": "Kinyui Boys Senior School",
    "url": SITE_URL,
    "logo": SEO_LOGO_PNG,
    "image": [SEO_LOGO_JPEG, SEO_LOGO_PNG],
    "description": "A public boys senior school in Matungulu, Machakos County, Kenya offering admissions, CBC pathways, academics, guidance, co-curricular activities, achievements, school news, student resources, and community updates.",
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
    "alternateName": "Kinyui Boys Senior School",
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
