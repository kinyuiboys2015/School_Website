export const metadata = {
  title: "School Achievements",
  alternates: {
    canonical: "/pages/Achievements",
  },
  robots: {
    index: false,
    follow: true,
    googleBot: {
      index: false,
      follow: true,
    },
  },
};

export default function SchoolAchievementsLayout({ children }) {
  return children;
}
