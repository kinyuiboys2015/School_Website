const SITE_URL = 'https://kinyuiboyssenior.school'

const publicPages = [
  '/',
  '/pages/',
  '/pages/AboutUs',
  '/pages/admissions',
  '/pages/Apply%20Now',
  '/pages/Achievements',
  '/pages/School%20Achievements',
  '/pages/eventsandnews',
  '/pages/gallery',
  '/pages/staff',
  '/pages/StudentPortal',
  '/pages/Guidance-and-Councelling',
  '/pages/OurSchoolPolicies',
  '/pages/fees',
  '/pages/Magazine',
  '/pages/careers',
  '/pages/contact',
]

const publicAssets = [
  '/seo/',
  '/seo/kinyui.jpeg',
  '/seo/kinyui.png',
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
