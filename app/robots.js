const SITE_URL = 'https://kinyuiboyssenior.school'

const publicPages = [
  '/',
  '/pages/AboutUs',
  '/pages/Achievements',
  '/pages/Apply%20Now',
  '/pages/Guidance-and-Councelling',
  '/pages/Magazine',
  '/pages/OurSchoolPolicies',
  '/pages/School%20Achievements',
  '/pages/StudentPortal',
  '/pages/admissions',
  '/pages/careers',
  '/pages/contact',
  '/pages/eventsandnews',
  '/pages/fees',
  '/pages/gallery',
  '/pages/staff',
]

const publicAssets = [
  '/seo/',
  '/seo/SchoolLogo.png',
  '/seo/SchoolLogo.png',
  '/hero/',
  '/images/',
  '/_next/static/',
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
  '/pages/Sign%20In',
  '/pages/forgotpassword',
  '/pages/resetpassword',
  '/pages/staff/*/*',
  '/admin',
  '/admin/',
  '/components/',
  '/generated/',
  '/private/',
  '/server/',
  '/dashboard/',
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
    host: SITE_URL,
  }
}
