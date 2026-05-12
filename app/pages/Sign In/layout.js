export const metadata = {
  title: "Admin Sign In",
  description: "Secure staff and administrator sign-in for Kinyui Boys Senior School.",
  alternates: {
    canonical: "/pages/Sign%20In",
  },
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
      noarchive: true,
    },
  },
};

export default function SignInLayout({ children }) {
  return children;
}
