import type { Metadata } from 'next'
import AtalTunnelChecker from '../components/AtalTunnelChecker'

export const metadata: Metadata = {
  title: 'Is Atal Tunnel Open Today? Live Status | manali.today',
  description: 'Live status of Atal Tunnel, Rohtang: open, closed, or AWD only. Confirmed daily by someone who actually lives in Manali, not an automated feed.',
  alternates: {
    canonical: 'https://manali.today/is-atal-tunnel-open-today',
  },
  openGraph: {
    title: 'Is Atal Tunnel Open Today? Live Status',
    description: 'Live status of Atal Tunnel, Rohtang. Confirmed daily by someone who actually lives in Manali.',
    url: 'https://manali.today/is-atal-tunnel-open-today',
    type: 'website',
    images: [{ url: '/og-atal-tunnel.jpg', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Is Atal Tunnel Open Today? Live Status',
    description: 'Live status of Atal Tunnel, Rohtang. Confirmed daily by someone who actually lives in Manali.',
    images: ['/og-atal-tunnel.jpg'],
  },
}

export default function AtalTunnelPage() {
  return <AtalTunnelChecker />
}