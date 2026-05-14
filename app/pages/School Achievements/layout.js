export const metadata = {
  title: "School Achievements",
  alternates: {
    canonical: "/pages/Achievements",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function SchoolAchievementsLayout({ children }) {
  return children;
}
