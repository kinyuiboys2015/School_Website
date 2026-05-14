import PublicSchoolHubPage from "../../../components/schoolhub/public-page";

export const metadata = {
  title: "Departments | Kinyui Boys Senior School",
  description: "Explore academic and support departments at Kinyui Boys Senior School.",
};

export default function DepartmentsHubPage() {
  return <PublicSchoolHubPage title="Departments" departments emptyText="Department records are being prepared." />;
}
