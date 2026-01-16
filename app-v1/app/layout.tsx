import "./globals.css";
import { LanguageProvider } from "./context/LanguageContext";
import { ToursProvider } from "./context/ToursContext";
import CursorFollower from "./components/CursorFollower";
import { getTours } from "./services/nevado-api";
import { Toaster } from 'sonner';

// Font setup with system fallbacks to prevent network-related build failures
const geistSans = { variable: '--font-geist-sans', className: 'font-sans' };
const geistMono = { variable: '--font-geist-mono', className: 'font-mono' };

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
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
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