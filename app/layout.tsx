import type { Metadata } from "next";
import { Inter, DM_Serif_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const dmSerifDisplay = DM_Serif_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Picdrop — Private photo sharing that disappears",
  description: "Create a custom photo page in seconds. Share it privately with the right people. It disappears automatically.",
  openGraph: {
    title: "Picdrop — Private photo sharing that disappears",
    description: "Create a custom photo page in seconds. Share it privately with the right people. It disappears automatically.",
    url: "https://picdrop.live",
    siteName: "Picdrop",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${dmSerifDisplay.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}