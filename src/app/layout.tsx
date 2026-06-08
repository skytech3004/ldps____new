import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

export const metadata: Metadata = {
  title: {
    default: "LPS Vidyawadi | Leeladevi Parasmal Sancheti English Medium School",
    template: "%s | LPS Vidyawadi"
  },
  description: "Leeladevi Parasmal Sancheti English Medium Sr. Sec. School at Vidyawadi, Khimel (Rani) is a premier CBSE-affiliated girls' residential institution in Rajasthan, offering quality education, premium boarding, and holistic development in a 65-acre campus.",
  keywords: [
    "LPS Vidyawadi",
    "Leeladevi Parasmal Sancheti School",
    "Girls Residential School Rajasthan",
    "Best CBSE Girls School Rajasthan",
    "Vidyawadi Khimel",
    "Marudhar Mahila Shikshan Sangh",
    "English Medium Boarding School Girls",
    "Khimel School",
    "Rani Pali Schools",
    "Girls boarding school CBSE"
  ],
  authors: [{ name: "Marudhar Mahila Shikshan Sangh" }],
  creator: "LPS Vidyawadi Development Team",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://www.lpsvidhyawadi.com/",
    title: "LPS Vidyawadi | Leeladevi Parasmal Sancheti English Medium School",
    description: "Premier CBSE-affiliated girls' residential school in Rajasthan. Explore our 65-acre campus, world-class hostels, qualified staff, and outstanding academic curriculum.",
    siteName: "LPS Vidyawadi"
  },
  twitter: {
    card: "summary_large_image",
    title: "LPS Vidyawadi | Premier Girls' Residential School",
    description: "Offering premium quality CBSE education, sports, and residential facilities for girls in Khimel, Rajasthan."
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${montserrat.variable} antialiased font-sans`}>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
