import type { Metadata } from "next";
import { Montserrat, Inter } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
  variable: "--rideflow-font-montserrat",
  weight: ["500", "600", "700"]
});

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--rideflow-font-inter"
});

export const metadata: Metadata = {
  title: "RideFlow",
  description: "Collaborative trip planning for focused group itineraries"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      className={`${montserrat.variable} ${inter.variable}`}
      lang="en"
    >
      <body className={`${inter.className} font-inter`}>{children}</body>
    </html>
  );
}
