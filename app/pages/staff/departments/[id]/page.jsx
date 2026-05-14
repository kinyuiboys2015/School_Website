import DepartmentDetailClient from "./DepartmentDetailClient";

export const metadata = {
  title: "Department Details | Kinyui Boys Senior School",
  description:
    "View department information and mapped teachers at Kinyui Boys Senior School.",
};

export default function StaffDepartmentDetailPage({ params }) {
  return <DepartmentDetailClient id={params.id} />;
}
