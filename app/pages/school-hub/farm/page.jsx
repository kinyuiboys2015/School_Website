import PublicSchoolHubPage from "../../../components/schoolhub/public-page";

export const metadata = {
  title: "School Farm | Kinyui Boys Senior School",
  description: "Explore agriculture, farm learning, and conservation programs at Kinyui Boys Senior School.",
};

export default function FarmPage() {
  return <PublicSchoolHubPage title="School Farm" singleType="FARM" emptyText="School farm records are being prepared." />;
}
