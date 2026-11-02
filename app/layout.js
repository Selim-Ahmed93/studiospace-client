import Providers from "@/providers/providers";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/providers/theme-provider";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  ),
  title: {
    default: "StudioSpace — Book creative studios by the hour",
    template: "%s | StudioSpace",
  },
  description:
    "Discover and book photography studios, sound stages, podcast rooms, music suites, and art workshops across Bangladesh.",
  keywords: [
    "studio booking",
    "photography studio",
    "sound stage",
    "podcast room",
    "music studio",
    "art workshop",
    "Bangladesh",
  ],
  openGraph: {
    title: "StudioSpace — Book creative studios by the hour",
    description:
      "Find the right space for your next shoot, recording, or workshop.",
    type: "website",
    siteName: "StudioSpace",
  },
  twitter: {
    card: "summary_large_image",
    title: "StudioSpace — Book creative studios by the hour",
    description:
      "Find the right space for your next shoot, recording, or workshop.",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <ThemeProvider>
          <Providers>
            <Header />
            <div className="flex-1">{children}</div>
            <Footer />
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
