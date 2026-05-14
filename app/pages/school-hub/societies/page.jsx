import PublicSchoolHubPage from "../../../components/schoolhub/public-page";

export const metadata = {
  title: "Societies | Kinyui Boys Senior School",
  description: "Explore academic societies and student interest groups at Kinyui Boys Senior School.",
};

export default function SocietiesPage() {
  return <PublicSchoolHubPage title="Societies" singleType="SOCIETY" emptyText="No societies have been published yet." />;
}
