import type { Metadata } from "next";
import { Montserrat, Inter } from "next/font/google";
import AppProviders from "../components/providers/AppProviders";
import "../../styles/globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  weight: ["600", "700"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "The Aggie Map | Aggieland's One Stop Shop",
  description:
    "Find quiet study spots, short dining lines, and live campus events in one place.",
  openGraph: {
    title: "The Aggie Map | Aggieland's One Stop Shop",
    description:
      "Find quiet study spots, short dining lines, and live campus events in one place.",
    images: [{ url: "/og-image.png" }],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${montserrat.variable} ${inter.variable}`}
      suppressHydrationWarning
    >
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
