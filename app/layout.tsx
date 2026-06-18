import type { Metadata } from 'next'
import { Cormorant_Garamond, Inter } from 'next/font/google'
import Script from 'next/script'
import './globals.css'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://manali.today'),
  title: {
    default: 'Manali.today — Live Conditions & Local Guide',
    template: '%s | Manali.today',
  },
  description: 'Live snow, road & weather conditions in Manali, Himachal Pradesh. Updated by someone who lives here.',
  openGraph: {
    siteName: 'Manali.today',
    type: 'website',
    locale: 'en_IN',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'manali.today — real-time snow, Atal Tunnel, and Rohtang Pass status',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${cormorant.variable} ${inter.variable}`}>
      <head>
        <Script
          defer
          data-site="h75ht2do"
          src="https://piqo.app/piqo.js"
          strategy="afterInteractive"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}