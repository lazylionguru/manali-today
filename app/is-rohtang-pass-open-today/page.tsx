import type { Metadata } from 'next'
import RohtangChecker from '../components/RohtangChecker'

export const metadata: Metadata = {
  title: 'Is Rohtang Pass Open Today?',
  description: 'Live status of Rohtang Pass — open or closed. Permit info, Tuesday closure, and real-time conditions updated by someone who lives in Manali.',
  alternates: {
    canonical: 'https://manali.today/rohtang-pass',
  },
  openGraph: {
    title: 'Is Rohtang Pass Open Today?',
    description: 'Live status of Rohtang Pass. Updated daily by someone who lives in Manali.',
    url: 'https://manali.today/rohtang-pass',
    images: [{ url: '/og-rohtang.jpg', width: 1200, height: 630 }],
  },
}

export default function RohtangPage() {
  return <RohtangChecker />
}