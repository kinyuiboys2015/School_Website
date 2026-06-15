import AcademicDowloadsPage from "../components/AcademicDowloadsPage";

export const metadata = {
  title: "Exam Resources",
  description:
    "Browse revision documents, examination resources, and learning materials for Kinyui Boys students.",
};

export default function ResourceExamsPage() {
  return <AcademicDowloadsPage contentType="resources" />;
}
