export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/MainDashboard', '/pages/Sign%20In', '/api/'],
      },
      {
        userAgent: 'Googlebot',
        allow: ['/', '/pages/', '/images/', '/public/', '/seo/'],
        disallow: ['/MainDashboard', '/pages/Sign%20In', '/api/'],
      },
      {
        userAgent: 'Googlebot-Image',
        allow: ['/', '/images/', '/seo/', '/*.jpg$', '/*.jpeg$', '/*.png$', '/*.webp$'],
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: ['/MainDashboard', '/pages/Sign%20In', '/api/'],
      },
    ],
    sitemap: 'https://kinyuiboyssenior.school/sitemap.xml',
    host: 'https://kinyuiboyssenior.school',
  }
}
