import type { Metadata } from 'next'
import RohtangChecker from '../components/RohtangChecker'

export const metadata: Metadata = {
  title: 'Is Rohtang Pass Open Today? Live Status | manali.today',
  description: 'Live status of Rohtang Pass: open or closed, permit info, Tuesday closure, and real-time conditions confirmed daily by someone who actually lives in Manali.',
  alternates: {
    canonical: 'https://manali.today/is-rohtang-pass-open-today',
  },
  openGraph: {
    title: 'Is Rohtang Pass Open Today? Live Status',
    description: 'Live status of Rohtang Pass. Confirmed daily by someone who actually lives in Manali.',
    url: 'https://manali.today/is-rohtang-pass-open-today',
    type: 'website',
    images: [{ url: '/og-rohtang.jpg', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Is Rohtang Pass Open Today? Live Status',
    description: 'Live status of Rohtang Pass. Confirmed daily by someone who actually lives in Manali.',
    images: ['/og-rohtang.jpg'],
  },
}

export default function RohtangPage() {
  return <RohtangChecker />
}