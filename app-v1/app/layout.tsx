import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "./context/LanguageContext";
import { ToursProvider } from "./context/ToursContext";
import { getTours } from "./services/nevado-api";
import CursorFollower from "./components/CursorFollower";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nevado Trek | Adventures in the Andes",
  description: "Guided trekking tours and technical ascents in the Colombian Andes.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialTours = await getTours();

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <LanguageProvider>
          <ToursProvider initialTours={initialTours}>
            <CursorFollower />
            {children}
          </ToursProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
