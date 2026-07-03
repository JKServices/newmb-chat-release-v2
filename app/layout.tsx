import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const siteUrl = "https://newmb.chat";
const siteName = "뉴MB.chat";
const description =
  "뉴MB.chat is an unofficial parody AI inspired by public football interviews and football culture.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteName,
    template: `%s | ${siteName}`
  },
  description,
  applicationName: siteName,
  keywords: [
    "뉴MB.chat",
    "newmb.chat",
    "parody AI",
    "football parody",
    "Korean football meme",
    "AI chat"
  ],
  authors: [{ name: siteName }],
  creator: siteName,
  publisher: siteName,
  alternates: {
    canonical: "/"
  },
  openGraph: {
    title: siteName,
    description,
    url: siteUrl,
    siteName,
    type: "website",
    locale: "ko_KR",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "뉴MB.chat"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: siteName,
    description,
    images: ["/twitter-image"]
  },
  icons: {
    icon: "/icon",
    shortcut: "/icon",
    apple: "/apple-icon"
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#000000"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
