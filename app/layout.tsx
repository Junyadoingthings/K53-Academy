import type { Metadata, Viewport } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import { GeistSans } from "geist/font/sans";
import { LoadingScreen } from "@/components/loading-screen";
import { AppBoot } from "@/components/auth/guard";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "K53 Academy — Master the Road",
  description:
    "Gamified Learner's & Driver's License prep for South Africa. Rooms, paths, XP, streaks and mock tests for Code 1, 2 and 3.",
  manifest: "/manifest.json",
  applicationName: "K53 Academy",
  appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: "K53 Academy" },
  keywords: ["K53", "learners licence", "drivers licence", "South Africa", "road signs", "RTMC"],
};

export const viewport: Viewport = {
  themeColor: "#E4002B",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

// Runs before paint to apply the saved theme (default dark) — no flash.
const themeScript = `(function(){try{var t=localStorage.getItem('k53-theme')||'dark';var e=document.documentElement;e.classList.remove('dark','light');e.classList.add(t);e.style.colorScheme=t;}catch(e){document.documentElement.classList.add('dark');}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <LoadingScreen />
        <AppBoot />
        {children}
      </body>
    </html>
  );
}
