import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Shree Manjunatha Engineering Works | Mysore",
  description:
    "Quality steel fabrication in Mysore — gates, safety doors, rolling shutters, window grills, railings and more. 25+ years of trusted service.",
  keywords:
    "fabrication mysore, gates mysore, steel doors mysore, rolling shutters mysore, window grills mysore",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
