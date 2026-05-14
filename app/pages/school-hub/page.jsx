import PublicSchoolHubPage from "../../components/schoolhub/public-page";

export const metadata = {
  title: "School Hub | Kinyui Boys Senior School",
  description:
    "Explore clubs, societies, student leadership, boarding, farm, ICT, security, and department life at Kinyui Boys Senior School.",
};

export default function SchoolHubPage() {
  return (
    <PublicSchoolHubPage
      title="School Hub"
      sections={[
        { title: "Clubs", type: "CLUB" },
        { title: "Societies", type: "SOCIETY" },
        { title: "Student Council", type: "STUDENT_COUNCIL" },
        { title: "Computer Lab", type: "COMPUTER_LAB" },
        { title: "School Farm", type: "FARM" },
        { title: "Boarding", type: "BOARDING" },
        { title: "Security", type: "SECURITY" },
      ]}
      emptyText="School Hub records are being prepared."
    />
  );
}
