import ClientAchievements from '../../components/ach/page';

export const metadata = {
  title: 'S.A Kinyui Boys Senior School Achievements',
  description:
    'Explore the official achievements of Kinyui Boys Senior School in Matungulu, Machakos County — academics, sports, arts, leadership, and more.',
  alternates: {
    canonical: 'https://kinyuiboyssenior.school/pages/Achievements',
    
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function SchoolAchievementsPage() {
  return <ClientAchievements />;
}
