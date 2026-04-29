export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/MainDashboard', '/pages/Sign In', '/api/', '/_next/'],
      },
      {
        userAgent: 'Googlebot',
        allow: ['/', '/pages/', '/images/'],
        disallow: ['/MainDashboard', '/pages/Sign In'],
      },
      {
        userAgent: 'Googlebot-Image',
        allow: ['/images/', '/*.jpg$', '/*.jpeg$', '/*.png$'],
      },
      {
        userAgent: 'Bingbot',
        disallow: ['/MainDashboard', '/pages/Sign In'],
      },
    ],
    sitemap: 'https://kinyui-senior.vercel.app/sitemap.xml',
    host: 'https://kinyui-senior.vercel.app',
  }
}