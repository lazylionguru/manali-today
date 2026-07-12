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
    default: 'Is it Snowing in Manali Today?',
    template: '%s | manali.today',
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
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: ['/favicon.ico'],
  },
  robots: {
    index: true,
    follow: true,
  },
}

// Organization + WebSite JSON-LD, rendered site-wide via the root layout so
// every page on manali.today carries this identity/trust context, not just
// the homepage. logo points at the 512x512 favicon since it's already a
// clean square image, matching Google's preferred format for this field,
// the 1200x630 OG banner is the wrong aspect ratio for a "logo".
// sameAs links to Narender's real personal profiles (not branded
// manali.today accounts, since none exist yet), which is an honest,
// deliberate choice: it reinforces "a real, findable person built and
// runs this" rather than implying an organization with its own social
// presence that doesn't exist.
const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Manali.today',
  url: 'https://manali.today',
  logo: 'https://manali.today/android-chrome-512x512.png',
  sameAs: [
    'https://x.com/0xnarender',
    'https://linkedin.com/in/lazylion',
    'https://narender.xyz',
  ],
}

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Manali.today',
  url: 'https://manali.today',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${cormorant.variable} ${inter.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
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