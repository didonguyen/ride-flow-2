import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
