import PublicSchoolHubPage from "../../../components/schoolhub/public-page";

export const metadata = {
  title: "Student Council | Kinyui Boys Senior School",
  description: "Meet student leadership and governance programs at Kinyui Boys Senior School.",
};

export default function StudentCouncilPage() {
  return <PublicSchoolHubPage title="Student Council" singleType="STUDENT_COUNCIL" emptyText="Student council records are being prepared." />;
}
