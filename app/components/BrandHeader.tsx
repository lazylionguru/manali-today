'use client'

import Link from 'next/link'

interface BrandHeaderProps {
  location: string
}

export default function BrandHeader({ location }: BrandHeaderProps) {
  return (
    <>
      <style>{`
        .brand-block {
          display:flex; flex-direction:column; gap:2px;
        }
        .brand-wordmark {
          font-family:var(--font-cormorant), serif;
          font-weight:400; font-size:40px; line-height:1;
          color:rgba(255,255,255,0.95);
          text-decoration:none; display:inline-block;
          transition:opacity .2s ease;
        }
        .brand-wordmark:hover { opacity:0.85 }
        .brand-wordmark em {
          font-style:italic; color:#c6e3ff;
        }
        .brand-location {
          display:flex; align-items:center; gap:7px;
          font-size:10px; font-weight:500; letter-spacing:.16em; text-transform:uppercase;
          color:rgba(255,255,255,0.6); white-space:nowrap;
        }
        .brand-live-dot {
          width:6px; height:6px; border-radius:50%; background:#48d9c0; flex-shrink:0;
          animation:brand-pulse 2.5s ease-in-out infinite;
        }
        @keyframes brand-pulse {
          0%,100%{box-shadow:0 0 0 0 rgba(72,217,192,.5)}
          50%{box-shadow:0 0 0 5px rgba(72,217,192,0)}
        }

        @media(max-width:600px) {
          .brand-wordmark { font-size:30px }
          .brand-location { font-size:9px; letter-spacing:.12em }
        }
      `}</style>

      <div className="brand-block">
        <Link href="/" className="brand-wordmark">manali<em>.today</em></Link>
        <div className="brand-location">
          <span className="brand-live-dot" />
          {location}
        </div>
      </div>
    </>
  )
}