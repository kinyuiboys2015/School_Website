// app/pages/gallery/page.jsx - This is a SERVER COMPONENT (no 'use client')
import ClientGallery from '../../components/gg/page';
import { Metadata } from 'next';

export const metadata = {
  title: 'S.A kinyui boys Senior School Gallery',
  description: 'Explore the official gallery of kinyui boys Senior School in Matungulu, Machakos County. View photos of classrooms, laboratories, sports day, graduation ceremonies, teaching moments, and school events.',
  keywords: [
    "kinyui boys Senior School photos",
    "kinyui boys High School pictures",
    "SA kinyui boys images",
    "kinyui High School gallery",
    "kinyui boys school grounds photos",
    "kinyui boys classrooms photos",
    "kinyui boys teaching moments",
    "kinyui boys laboratories pictures",
    "kinyui boys sports day images",
    "kinyui boys graduation ceremony photos",
    "kinyui boys general school activities",
    "Schools in Matungulu East photos",
    "Machakos County school pictures",
    "Kenya secondary school images",
    "Eastern province education photos",
    "kinyui boys prize giving day photos",
    "kinyui boys academic day pictures",
    "kinyui boys music festival images",
    "kinyui boys drama festival photos",
    "kinyui boys school compound images",
    "kinyui boys dormitories photos",
    "kinyui boys dining hall pictures",
    "kinyui boys library images",
    "kinyui boys computer lab photos",
    "kinyui boys teachers photos",
    "kinyui boys students pictures",
    "kinyui boys alumni images",
    "kinyui boys staff gallery",
    "kinyui boys class of 2024 photos",
    "kinyui boys old school photos",
    "kinyui boys historical images",
    "kinyui boys school pictures",
    "kinyui boys high school images",
    "kinyui boys school gallery",
    "SA kinyui boys photos"
  ].join(', '),
  
  openGraph: {
    title: 'SA kinyui boys Senior School - Photo Gallery',
    description: 'Browse through our collection of school photos, events, and memorable moments.',
    url: 'https://kinyui-senior.vercel.app/pages/gallery',
    siteName: 'SA kinyui boys Senior School',
    images: [
      {
        url: '/seo/kinyui.jpeg',
        width: 1200,
        height: 630,
        alt: 'S.A kinyui boys Senior School Gallery',
      },
    ],
    locale: 'en_KE',
    type: 'website',
  },
  
  twitter: {
    card: 'summary_large_image',
    title: 'S.A kinyui boys Senior School Gallery',
    description: 'Browse through our collection of school photos, events, and memorable moments.',
    images: ['/seo/kinyui.jpeg'],
  },
  
  alternates: {
    canonical: 'https://kinyui-senior.vercel.app/pages/gallery',
  },
  
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function GalleryPage() {
  return <ClientGallery />;
}