'use client'

import Link from 'next/link'

interface NavProps {
  active: 'snow' | 'atal-tunnel' | 'rohtang-pass'
}

export default function Nav({ active }: NavProps) {
  return (
    <>
      <style>{`
        .nav-pill {
          display:flex; align-items:center;
          background: linear-gradient(180deg, rgba(25, 25, 30, 0.15) 0%, rgba(15, 15, 20, 0.4) 100%);
          backdrop-filter: blur(35px);
          -webkit-backdrop-filter: blur(35px);
          border-radius:100px; padding:3px;
          position:relative; overflow:hidden;
          box-shadow: 
            0 -1px 0px rgba(255, 255, 255, 0.2),
            inset 0 1px 0px rgba(255, 255, 255, 0.15),
            0 -10px 30px rgba(0, 0, 0, 0.35);
        }
        
        .nav-link {
          font-size:11px; font-weight:500; letter-spacing:.12em; text-transform:uppercase;
          color:rgba(255,255,255,0.45); text-decoration:none;
          padding:8px 22px; border-radius:100px;
          transition:color .2s ease, background .25s ease;
          white-space:nowrap; position:relative; z-index:1;
        }
        .nav-link:hover { color:rgba(255,255,255,0.8) }
        .nav-link.active {
          color:#fff; background:rgba(255,255,255,0.18);
          box-shadow:0 1px 8px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.2);
        }
        .nav-divider {
          width:1px; height:14px; background:rgba(255,255,255,0.2);
          flex-shrink:0; margin:0 1px;
        }

        @media(max-width:600px) {
          .nav-pill { padding:3px }
          .nav-link { font-size:9.5px; padding:7px 14px; letter-spacing:.09em }
        }
      `}</style>

      <nav className="nav-pill">
        <Link href="/" className={`nav-link${active === 'snow' ? ' active' : ''}`}>❄ Snow</Link>
        <div className="nav-divider" />
        <Link href="/is-atal-tunnel-open-today" className={`nav-link${active === 'atal-tunnel' ? ' active' : ''}`}>Atal Tunnel</Link>
        <div className="nav-divider" />
        <Link href="/is-rohtang-pass-open-today" className={`nav-link${active === 'rohtang-pass' ? ' active' : ''}`}>Rohtang Pass</Link>
      </nav>
    </>
  )
}