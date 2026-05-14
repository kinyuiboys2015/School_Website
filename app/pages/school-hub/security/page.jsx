import PublicSchoolHubPage from "../../../components/schoolhub/public-page";

export const metadata = {
  title: "Security | Kinyui Boys Senior School",
  description: "Explore campus safety and security services at Kinyui Boys Senior School.",
};

export default function SecurityPage() {
  return <PublicSchoolHubPage title="Security" singleType="SECURITY" emptyText="Security records are being prepared." />;
}
