import type { Metadata } from 'next'
import SnowChecker from './components/SnowChecker'

export const metadata: Metadata = {
  title: 'Is it Snowing in Manali Today?',
  description: 'Live snow conditions in Manali, Himachal Pradesh. Updated daily by someone who lives here. Check before you travel.',
  alternates: {
    canonical: 'https://manali.today',
  },
  openGraph: {
    title: 'Is it Snowing in Manali Today?',
    description: 'Live snow conditions in Manali, updated by a local. Check before you travel.',
    url: 'https://manali.today',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
  },
}

export default function Home() {
  return <SnowChecker />
}