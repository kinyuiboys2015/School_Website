import StaffDirectoryClient from './StaffDirectoryClient';

const logoImage = '/seo/SchoolLogo.png';
const logoPng = '/seo/SchoolLogo.png';

export const metadata = {
  title: 'Staff Leadership & Departments',
  description:
    'Meet the leadership team and department collections at S.A. Kinyui Boys Senior School in Matungulu, Machakos County. Principal, deputies, senior teacher, HODs, CBC departments, teaching teams, and support departments.',
  keywords: [
    'Kinyui Boys Senior School staff',
    'Kinyui Boys Senior School departments',
    'Kinyui Boys Senior School principal',
    'Kinyui Boys Senior School deputy principal academics',
    'Kinyui Boys Senior School deputy principal administration',
    'Kinyui Boys Senior School senior teacher',
    'Kinyui Boys Senior School HOD',
    'Kinyui Boys Senior School teachers',
    'Kinyui Boys Senior School CBC departments',
    'Kinyui Boys staff directory',
  ],
  alternates: {
    canonical: '/pages/staff',
  },
  openGraph: {
    title: 'Staff Leadership & Departments | Kinyui Boys Senior School',
    description:
      'Explore Kinyui Boys Senior School leadership profiles and department collections, with privacy-first staff presentation.',
    url: 'https://kinyuiboyssenior.school/pages/staff',
    siteName: 'Kinyui Boys Senior School',
    images: [
      {
        url: logoImage,
        width: 1200,
        height: 630,
        alt: 'S.A. Kinyui Boys Senior School logo',
      },
      {
        url: logoPng,
        width: 1200,
        height: 1200,
        alt: 'Kinyui Boys Senior School official logo',
      },
    ],
    locale: 'en_KE',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Staff Leadership & Departments | Kinyui Boys Senior School',
    description:
      'Leadership profiles and department collections from S.A. Kinyui Boys Senior School.',
    images: [logoImage],
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

export default function StaffPage() {
  return <StaffDirectoryClient />;
}
