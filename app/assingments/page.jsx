import AcademicDowloadsPage from "../components/AcademicDowloadsPage";

export const metadata = {
  title: "Assignments",
  description:
    "Download student assignments and supporting learning materials from Kinyui Boys Senior School.",
};

export default function AssignmentsPage() {
  return <AcademicDowloadsPage contentType="assignments" />;
}
