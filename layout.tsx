import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AngolaLab — Discover Verified Restaurants in Angola',
  description: 'Bilingual platform for verified restaurants across Angola',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
