import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { AppBoot } from "@/components/auth/guard";
import "./globals.css";

const SITE_TITLE = "K53 Academy — Pass your learner's and driver's licence";
const SITE_DESCRIPTION =
  "Structured K53 preparation for South Africa: official SADC road signs, rules of the road, vehicle controls and timed mock tests for Code 1, 2 and 3.";

export const metadata: Metadata = {
  metadataBase: new URL("https://k53academy.netlify.app"),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  // Link previews (LinkedIn, WhatsApp, X, Slack…)
  openGraph: {
    type: "website",
    url: "/",
    siteName: "K53 Academy",
    locale: "en_ZA",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [{ url: "/og-image.jpg", width: 1200, height: 627, alt: "K53 Academy shown on a MacBook Pro" }],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: ["/og-image.jpg"],
  },
  manifest: "/manifest.json",
  applicationName: "K53 Academy",
  appleWebApp: { capable: true, statusBarStyle: "default", title: "K53 Academy" },
  keywords: ["K53", "learners licence", "drivers licence", "South Africa", "road signs", "SADC", "mock test"],
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F8F8F7" },
    { media: "(prefers-color-scheme: dark)", color: "#0B0C0E" },
  ],
  width: "device-width",
  initialScale: 1,
};

// Runs before paint: saved theme, else the OS preference — no flash.
const themeScript = `(function(){try{var t=localStorage.getItem('k53-theme');if(t!=='light'&&t!=='dark'){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}var e=document.documentElement;e.classList.remove('dark','light');e.classList.add(t);e.style.colorScheme=t;}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-ZA" className={`${GeistSans.variable} ${GeistMono.variable}`} suppressHydrationWarning>
      <body>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <AppBoot />
        {children}
      </body>
    </html>
  );
}
