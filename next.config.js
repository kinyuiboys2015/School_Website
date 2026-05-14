/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  async redirects() {
    return [
      {
        source: '/pages/Guidance-and-Councelling',
        destination: '/pages/Guidance-and-Counselling',
        permanent: true,
      },
      {
        source: '/pages/about',
        destination: '/pages/AboutUs',
        permanent: true,
      },
      {
        source: '/pages/academics',
        destination: '/pages/StudentPortal',
        permanent: true,
      },
      {
        source: '/pages/student-life',
        destination: '/pages/eventsandnews',
        permanent: true,
      },
      {
        source: '/pages/career',
        destination: '/pages/careers',
        permanent: true,
      },
      {
        source: '/pages/events',
        destination: '/pages/eventsandnews',
        permanent: true,
      },
      {
        source: '/pages/achievements',
        destination: '/pages/Achievements',
        permanent: true,
      },
      {
        source: '/pages/School%20Achievements',
        destination: '/pages/Achievements',
        permanent: true,
      },
      {
        source: '/pages/adminLogin',
        destination: '/pages/Sign%20In',
        permanent: false,
      },
      {
        source: '/pages/Sign-In',
        destination: '/pages/Sign%20In',
        permanent: false,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*', // allows any external domain
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3001',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000', 
        pathname: '/**',
      },
    ],
    domains: ['localhost'], // fallback for older Next.js versions
  },
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    return config;
  },
};

module.exports = nextConfig;
