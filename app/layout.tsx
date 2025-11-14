import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Stock Analyzer & Recommendations',
  description: 'Real-time indicators and trade insights for US and Indian markets',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <div className="container-base py-6">
          {children}
        </div>
      </body>
    </html>
  )
}
