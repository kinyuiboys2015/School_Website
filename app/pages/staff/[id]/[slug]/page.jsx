// app/staff/[id]/page.jsx
import StaffProfilePage from '../../../../components/staffseo.jsx';

// Import static data or use empty array as fallback
let STAFF_DATA = [];

// Try to import local data if it exists
try {
  // Option 1: Import from a local JSON file in your project
  // STAFF_DATA = require('@/data/staff.json');
  
  // Option 2: Use hardcoded data as fallback
  STAFF_DATA = [
    // Add some sample staff data here if needed
    // { id: '1', name: 'John Doe', position: 'Teacher', department: 'Mathematics', bio: '...', image: '/male.png' }
  ];
} catch (error) {
  console.log('No local staff data found, using empty array');
  STAFF_DATA = [];
}

export async function generateMetadata({ params }) {
  const { id } = params;
  
  // Find staff from local data - this works at build time
  const staff = STAFF_DATA.find(s => s.id === id);
  
  if (!staff) {
    // Return generic metadata that works for all staff pages
    return {
      title: "Staff Profile | Kinyui Boys Senior School",
      description: "Meet the leadership staff of S.A. Kinyui Boys Senior School in Matungulu, Machakos County.",
      openGraph: {
        title: "Staff Profile | Kinyui Boys Senior School",
        description: "Leadership profiles from S.A. Kinyui Boys Senior School.",
        images: [
          {
            url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://kinyuiboyssenior.school'}/seo/kinyui.jpeg`,
            width: 1200,
            height: 630,
            alt: 'kinyui boys Senior School Staff'
          }
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: "Staff Profile | Kinyui Boys Senior School",
        description: "Leadership profiles from S.A. Kinyui Boys Senior School.",
      }
    };
  }

  const title = `${staff.name} | ${staff.position} | Kinyui Boys Senior School`;
  const description = staff.bio || `Meet ${staff.name}, a dedicated ${staff.position} at S.A. Kinyui Boys Senior School specializing in ${staff.department}.`;
  
  // Fix the image URL
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kinyuiboyssenior.school';
  const imageUrl = staff.image 
    ? staff.image.startsWith('http') 
      ? staff.image 
      : staff.image.startsWith('/')
        ? `${baseUrl}${staff.image}`
        : `${baseUrl}/images/staff/${staff.image}`
    : `${baseUrl}/seo/kinyui.jpeg`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `Professional portrait of ${staff.name}`
        }
      ],
      type: 'profile',
      profile: {
        firstName: staff.name.split(' ')[0],
        lastName: staff.name.split(' ').slice(1).join(' '),
        username: staff.email || undefined,
      }
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical: `${baseUrl}/pages/staff/${id}/${params.slug}`,
    }
  };
}

// FIXED: Remove the fetch from generateStaticParams to avoid build errors
export async function generateStaticParams() {
  // If you have local data, use it
  if (STAFF_DATA.length > 0) {
    return STAFF_DATA.map((staff) => ({
      id: staff.id.toString(),
    }));
  }
  
  // Otherwise return empty array (dynamic rendering)
  // Or comment this out completely if you don't have static data
  return [];
  
  // ALTERNATIVE: If you want to fetch from API but avoid build errors:
  // try {
  //   const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kinyuiboyssenior.school';
  //   const res = await fetch(`${baseUrl}/api/staff`, { next: { revalidate: 3600 } });
  //   
  //   if (res.ok) {
  //     const data = await res.json();
  //     return data.staff?.map((staff) => ({ id: staff.id.toString() })) || [];
  //   }
  // } catch (error) {
  //   console.log('Failed to fetch staff for static generation:', error);
  //   return [];
  // }
}

// IMPORTANT: For dynamic data fetching on the client
export const dynamic = 'force-dynamic'; // Force dynamic rendering
// OR use revalidation if you want ISR:
// export const revalidate = 3600; // Revalidate every hour

export default function Page({ params }) {
  return <StaffProfilePage id={params.id} />;
}
