// app/pages/School Achievements/page.jsx - SERVER COMPONENT (alias to Achievements)
import ClientAchievements from '../../components/ach/page';

export const metadata = {
  title: 'S.A Kinyui Boys Senior School Achievements',
  description:
    'Explore the official achievements of Kinyui Boys Senior School in Matungulu, Machakos County — academics, sports, arts, leadership, and more.',
  alternates: {
    canonical: 'https://kinyui-senior.vercel.app/pages/Achievements',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function SchoolAchievementsPage() {
  return <ClientAchievements />;
}

