import type { Metadata } from 'next'
import AtalTunnelChecker from '../components/AtalTunnelChecker'

export const metadata: Metadata = {
  title: 'Is Atal Tunnel Open Today?',
  description: 'Live status of Atal Tunnel Rohtang — open, closed, or AWD only. Updated daily by someone who lives in Manali.',
  alternates: {
    canonical: 'https://manali.today/atal-tunnel',
  },
  openGraph: {
    title: 'Is Atal Tunnel Open Today?',
    description: 'Live status of Atal Tunnel Rohtang. Updated daily by someone who lives in Manali.',
    url: 'https://manali.today/atal-tunnel',
    images: [{ url: '/og-atal-tunnel.jpg', width: 1200, height: 630 }],
  },
}

export default function AtalTunnelPage() {
  return <AtalTunnelChecker />
}