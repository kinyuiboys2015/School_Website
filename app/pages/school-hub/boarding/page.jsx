import PublicSchoolHubPage from "../../../components/schoolhub/public-page";

export const metadata = {
  title: "Boarding | Kinyui Boys Senior School",
  description: "Explore boarding life, student welfare, and residential support at Kinyui Boys Senior School.",
};

export default function BoardingPage() {
  return <PublicSchoolHubPage title="Boarding" singleType="BOARDING" emptyText="Boarding records are being prepared." />;
}
