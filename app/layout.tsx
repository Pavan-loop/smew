import type { Metadata } from "next";
import { Noto_Sans_Kannada } from "next/font/google";
import "./globals.css";
import ChatWidget from "./components/ChatWidget";

export const metadata: Metadata = {
  title: "Shree Manjunatha Engineering Works | Mysore",
  description:
    "Quality steel fabrication in Mysore — gates, safety doors, rolling shutters, window grills, railings and more. 25+ years of trusted service.",
  keywords:
    "fabrication mysore, welding shop mysore, steel fabrication mysore, MS fabrication mysore, gates mysore, grills mysore, rolling shutters mysore, safety doors mysore, engineering works mysore, fabrication works mysore, iron works mysore, steel works mysore, shree manjunatha engineering, SMEW fabrications",
};

// Kannada fallback: Syne and DM Sans have no Kannada glyphs, which showed as empty boxes on some devices.
const kannada = Noto_Sans_Kannada({
  subsets: ["kannada"],
  variable: "--font-kannada",
  display: "swap",
});
const chatApi = process.env.NEXT_PUBLIC_CHAT_API?.replace(/\/$/, "");

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={kannada.variable}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        {/* Open the connection to the chat API early so the first chat request is faster. */}
        {chatApi && (
          <link rel="preconnect" href={chatApi} crossOrigin="anonymous" />
        )}
        <link
          href="https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {children}
        <ChatWidget />
      </body>
    </html>
  );
}
