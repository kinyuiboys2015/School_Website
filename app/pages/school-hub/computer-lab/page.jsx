import PublicSchoolHubPage from "../../../components/schoolhub/public-page";

export const metadata = {
  title: "Computer Lab | Kinyui Boys Senior School",
  description: "Explore ICT and computer lab facilities at Kinyui Boys Senior School.",
};

export default function ComputerLabPage() {
  return <PublicSchoolHubPage title="Computer Lab" singleType="COMPUTER_LAB" emptyText="Computer lab records are being prepared." />;
}
