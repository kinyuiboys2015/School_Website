import ClientAchievements from '../../components/ach/page';
import { createPageMetadata } from '../../seoConfig';

export const metadata = createPageMetadata('/pages/Achievements');

export default function SchoolAchievementsPage() {
  return <ClientAchievements />;
}
