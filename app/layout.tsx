import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "상서중학교 - 나만의 채팅 만들기",
  description: "한글로 배우는 재미있는 채팅 만들기",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased">{children}</body>
    </html>
  );
}
