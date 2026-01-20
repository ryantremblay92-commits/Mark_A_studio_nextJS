import type { Metadata } from 'next'
import './global.css'

export const metadata: Metadata = {
  title: 'Mark A Studio',
  description: 'Marketing agency management platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="h-screen w-screen">
        {children}
      </body>
    </html>
  )
}