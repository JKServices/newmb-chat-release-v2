import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "뉴MB.chat",
  description: "Unofficial parody AI chat inspired by public football interviews and football culture.",
  metadataBase: new URL("https://newmb.chat"),
  openGraph: {
    title: "뉴MB.chat",
    description: "오늘도 질문 있습니까?",
    url: "https://newmb.chat",
    siteName: "뉴MB.chat",
    type: "website"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
