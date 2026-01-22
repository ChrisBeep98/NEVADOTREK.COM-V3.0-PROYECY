import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "./context/LanguageContext";
import { ToursProvider } from "./context/ToursContext";
import CursorFollower from "./components/CursorFollower";
import { getTours } from "./services/nevado-api";
import { Toaster } from 'sonner';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  style: ['normal', 'italic'],
});

export const metadata = {
  title: 'Nevado Trek',
  description: 'Expertos en expediciones de montaña',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch initial tours for the provider
  const initialTours = await getTours();

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} ${playfairDisplay.variable} antialiased`}>
        <LanguageProvider>
          <ToursProvider initialTours={initialTours}>
            <CursorFollower />
            <Toaster position="top-right" theme="dark" richColors closeButton />
            {children}
          </ToursProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}