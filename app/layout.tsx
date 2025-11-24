import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '한글코 - 중학생을 위한 코딩 체험',
  description: '한글로 배우는 재미있는 웹 코딩',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko">
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
