import PublicSchoolHubPage from "../../../components/schoolhub/public-page";

export const metadata = {
  title: "Clubs | Kinyui Boys Senior School",
  description: "Explore student clubs and co-curricular groups at Kinyui Boys Senior School.",
};

export default function ClubsPage() {
  return <PublicSchoolHubPage title="Clubs" singleType="CLUB" emptyText="No clubs have been published yet." />;
}
