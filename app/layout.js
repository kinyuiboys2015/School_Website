import localFont from "next/font/local";
import "./globals.css";
import ClientLayoutWrapper from "./-app";
import { SessionProvider } from "./session/sessiowrapper";

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
  metadataBase: new URL("https://kinyui boyssenior.school"),

  title: {
    default: "A.I.C kinyui boys Senior School",
    template: "%s | kinyui boys Senior School",
  },

  description:
    "The official website of A.I.C kinyui boys Senior School.",
  
"keywords": [
    // Core Names & Official Identity
    "AIC kinyui boys sec School",
    "AIC katz High School",
    "AIC Katz High School",
    "kinyui boys High School",
    "kinyui boys boarding School",
    "AIC kinyui boys High School",
    "A.I.C kinyui boys High School",
    "AIC kinyui boys High School",
    "AIC kinyui boys High School",

    "kinyui boys Senior High School",
    "kinyui boys Secondary School",
    "AIC kinyui boys Secondary School",
    "AIC kinyui boys Senior High",
    "AIC Katz",
    "AIC kinyui boys",
    "A.I.C kinyui boys",
    "Katz High School",
    "Katz Senior High School",
    "kinyui boys School",
    "kinyui boys Senior School",
    "Katz School",
    "Katz",

    // Institutional Specifics (New & Essential)
    "kinyui boys Boarding School",
    "AIC Sponsored Schools Machakos",
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
    "kinyui boys High School Angaza Technology Literacy Center",
    "kinyui boys High School God-fearing Citizens",
    "kinyui boys High School Fully Empowered Learners",
    "kinyui boys High School Since 1976",

    // Technical & Partners (SEO & Verification)
    "Angaza Technology Literacy Center kinyui boys",
    "kinyui boys school computer lab",
    "kinyui boys digital learning portal",

    // SEO Misspellings & Slang
    "Katwanya school",
    "Katanyaa school",
    "Katz senior school",
    "Katwanya high",
    "kinyui boys sec",
    "kinyui boys boys and girls"
  ],

  authors: [{ name: "A.I.C kinyui boys Senior School" }],
  
  alternates: {
    canonical: "/",
  },

  /* Open Graph (Social Media Sharing) */
  openGraph: {
    title: "A.I.C kinyui boys School",
    description: "Official school website.",
    url: "https://kinyui boyssenior.school",
    siteName: "kinyui boys Senior School",
    locale: "en_KE",
    type: "website",
    images: [
      {
        url: "/seo/kinyui.png",
        width: 1200,
        height: 630,
        alt: "A.I.C kinyui boys Senior School",
      },
    ],
  },

  /* Twitter Card */
  twitter: {
    card: "summary_large_image",
    title: "A.I.C kinyui boys Senior School",
    description: "Empowering students through education and faith in Machakos County.",
    images: ["/seo/kinyui.png"],
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
    icon: "/seo/kinyui.png",
    apple: "/seo/kinyui.png",
  },

  verification: {
    google: "google16e979b115c09244",
    
  },
};

/* -------------------------------------------------------------------------- */
/* ROOT LAYOUT                                 */
/* -------------------------------------------------------------------------- */
export default function RootLayout({ children }) {
  // Structured Data (JSON-LD) for Local Business/School SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "School",
    "name": "A.I.C kinyui boys Senior School",
    "alternateName": "kinyui boys Senior School",
    "url": "https://kinyui boyssenior.school",
    "logo": "https://kinyui boyssenior.school/seo/kinyui.png",
    "image": "https://kinyui boyssenior.school/seo/kinyui.png",
    "description": "A public Senior school in Matungulu, Machakos County, Kenya.",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Matungulu",
      "addressRegion": "Machakos County",
      "addressCountry": "KE"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "-1.2825", // Optional: replace with your actual GPS coordinates
      "longitude": "37.2618"
    },
    "hasMap": "https://www.google.com/maps?q=kinyui boys+Secondary+School", 
    "telephone": "+254 710 894 145", // Update with official school phone
    "priceRange": "N/A"
  };

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