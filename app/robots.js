const SITE_URL = 'https://kinyuiboyssenior.school'

const publicPages = [
  '/',
  '/pages/AboutUs',
  '/pages/Achievements',
  '/pages/Apply%20Now',
  '/pages/Guidance-and-Counselling',
  '/pages/Magazine',
  '/pages/OurSchoolPolicies',
  '/pages/Sign%20In',
  '/pages/StudentPortal',
  '/pages/admissions',
  '/pages/careers',
  '/pages/contact',
  '/pages/eventsandnews',
  '/pages/fees',
  '/pages/gallery',
  '/pages/staff',
  '/alumini',
  '/assingments',
  '/resource-exams',
  '/pages/school-hub',
  '/pages/school-hub/clubs',
  '/pages/school-hub/societies',
  '/pages/school-hub/student-council',
  '/pages/school-hub/computer-lab',
  '/pages/school-hub/farm',
  '/pages/school-hub/boarding',
  '/pages/school-hub/security',
  '/pages/school-hub/departments',
]

const publicAssets = [
  '/seo/',
  '/seo/SchoolLogo.png',
  '/hero/',
  '/images/',
  '/_next/static/',
  '/_next/image',
  '/sitemap.xml',
  '/robots.txt',
  '/*.jpg$',
  '/*.jpeg$',
  '/*.png$',
  '/*.webp$',
  '/*.svg$',
]

const privateRoutes = [
  '/api/',
  '/MainDashboard',
  '/MainDashboard/',
  '/pages/Sign-In',
  '/pages/forgotpassword',
  '/pages/resetpassword',
  '/pages/staff/*/*',
  '/pages/adminLogin',
  '/admin',
  '/admin/',
  '/components/',
  '/generated/',
  '/private/',
  '/server/',
  '/dashboard/',
  '/temp/',
  '/preview/',
]

export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: [...publicPages, ...publicAssets],
        disallow: privateRoutes,
      },
      {
        userAgent: 'Googlebot',
        allow: [...publicPages, ...publicAssets],
        disallow: privateRoutes,
      },
      {
        userAgent: 'Googlebot-Image',
        allow: [
          '/',
          '/seo/',
          '/hero/',
          '/images/',
          '/_next/image',
          '/*.jpg$',
          '/*.jpeg$',
          '/*.png$',
          '/*.webp$',
          '/*.svg$',
        ],
        disallow: privateRoutes,
      },
      {
        userAgent: 'Bingbot',
        allow: [...publicPages, ...publicAssets],
        disallow: privateRoutes,
      },
      {
        userAgent: 'DuckDuckBot',
        allow: [...publicPages, ...publicAssets],
        disallow: privateRoutes,
      },
      {
        userAgent: 'Slurp',
        allow: [...publicPages, ...publicAssets],
        disallow: privateRoutes,
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
