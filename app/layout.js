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
  metadataBase: new URL("https://kinyui-senior.vercel.app"),

  title: {
    default: "S.A kinyui boys Senior School",
    template: "%s | kinyui boys Senior School",
  },

  description:
    "The official website of S.A kinyui boys Senior School",
  
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

  authors: [{ name: "S.A kinyui boys Senior School" }],
  
  alternates: {
    canonical: "/",
  },

  /* Open Graph (Social Media Sharing) */
  openGraph: {
    title: "S.A kinyui boys School",
    description: "Official school website.",
    url: "https://kinyui-senior.vercel.app",
    siteName: "kinyui boys Senior School",
    locale: "en_KE",
    type: "website",
    images: [
      {
        url: "/seo/kinyui.png",
        width: 1200,
        height: 630,
        alt: "S.A kinyui boys Senior School",
      },
    ],
  },

  /* Twitter Card */
  twitter: {
    card: "summary_large_image",
    title: "S.A kinyui boys Senior School",
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
    "name": "S.A kinyui boys Senior School",
    "alternateName": "kinyui boys Senior School",
    "url": "https://kinyui-senior.vercel.app",
    "logo": "https://kinyui-senior.vercel.app/seo/kinyui.png",
    "image": "https://kinyui-senior.vercel.app/seo/kinyui.png",
    "description": "A public Senior school in Matungulu, Machakos County, Kenya.",
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