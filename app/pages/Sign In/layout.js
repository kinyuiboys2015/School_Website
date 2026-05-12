export const metadata = {
  title: "Admin Sign In",
  description: "Secure staff and administrator sign-in for Kinyui Boys Senior School.",
  alternates: {
    canonical: "/pages/Sign%20In",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      noarchive: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function SignInLayout({ children }) {
  return children;
}
