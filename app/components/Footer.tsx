'use client'

import Link from 'next/link'

interface FooterProps {
  wind?: string
  visibility?: string
  description?: string
}

export default function Footer({ wind, visibility, description }: FooterProps) {
  return (
    <>
      <style>{`
        .footer {
  position:fixed; bottom:0; left:0; right:0; z-index:20;
  width:100%;
  padding:1.25rem 2.5rem 1rem;
  box-sizing:border-box;
  color:#fff;

  background:rgba(255,255,255,0.03);
  backdrop-filter:blur(20px);
  -webkit-backdrop-filter:blur(20px);

  border-top:1px solid rgba(255,255,255,0.25);
  border-left:1px solid rgba(255,255,255,0.03);
  border-right:1px solid rgba(255,255,255,0.03);
  border-bottom:none;

  box-shadow:
    inset 0 1px 1px rgba(255,255,255,0.15),
    0 -12px 30px rgba(0,0,0,0.25);
}

        .footer-top {
          display:grid;
          grid-template-columns:1.5fr 1fr 1fr;
          gap:2rem;
          margin-bottom:1rem;
          padding-bottom:1rem;
          border-bottom:1px solid rgba(255,255,255,0.07);
        }

        .footer-brand {
          font-family:var(--font-cormorant), serif;
          font-size:15px; font-weight:300; font-style:italic;
          color:rgba(255,255,255,0.75);
          margin-bottom:0.6rem;
        }

        .footer-wx {
          display:flex; gap:1.5rem; margin-top:0.5rem;
        }
        .footer-wx-item {}
        .footer-wx-val {
          font-family:var(--font-cormorant), serif;
          font-size:1.1rem; font-weight:300;
          color:rgba(255,255,255,0.75);
        }
        .footer-wx-unit { font-size:0.7rem; color:rgba(255,255,255,0.4) }
        .footer-wx-lbl {
          font-size:8px; letter-spacing:.14em; text-transform:uppercase;
          color:rgba(255,255,255,0.28); margin-top:1px;
        }

        .footer-col-title {
          font-size:8.5px; font-weight:500; letter-spacing:.18em; text-transform:uppercase;
          color:rgba(255,255,255,0.25); margin-bottom:0.6rem;
        }
        .footer-col-links {
          display:flex; flex-direction:column; gap:5px;
        }
        .footer-col-links a {
          font-size:12px; color:rgba(255,255,255,0.45);
          text-decoration:none; transition:color .15s ease;
        }
        .footer-col-links a:hover { color:rgba(255,255,255,0.85) }
        .footer-col-links a.soon {
          color:rgba(255,255,255,0.2);
          pointer-events:none;
        }
        .footer-col-links a.soon::after {
          content:' —';
          font-size:9px; letter-spacing:.08em;
          color:rgba(255,255,255,0.15);
        }

        .footer-bottom {
          display:flex; align-items:center; justify-content:space-between;
        }
        .footer-credit {
          font-family:var(--font-cormorant), serif;
          font-size:12px; font-weight:300; font-style:italic;
          color:rgba(255,255,255,0.28); line-height:1.4;
        }
        .footer-credit a {
          color:rgba(255,255,255,0.45);
          text-decoration:none;
          border-bottom:1px solid rgba(255,255,255,0.18);
          transition:color .15s ease, border-color .15s ease;
        }
        .footer-credit a:hover {
          color:rgba(255,255,255,0.8);
          border-color:rgba(255,255,255,0.4);
        }
        .footer-love {
          font-family:var(--font-cormorant), serif;
          font-size:12px; font-weight:300; font-style:italic;
          color:rgba(255,255,255,0.22);
        }

        @media(max-width:600px) {
          .footer {
            padding:1rem 1.1rem 0.85rem;
          }
          .footer-top {
            grid-template-columns:1fr 1fr;
            gap:1.25rem;
            margin-bottom:0.75rem;
            padding-bottom:0.75rem;
          }
          .footer-brand { font-size:13px }
          .footer-wx { gap:1rem }
          .footer-wx-val { font-size:1rem }
          .footer-col-links a { font-size:11px }
          .footer-bottom { flex-direction:column; align-items:flex-start; gap:4px }
          .footer-love { display:none }
        }
      `}</style>

      <footer className="footer">
        <div className="footer-top">
          {/* Col 1 — brand + weather */}
          <div>
            <div className="footer-brand">Manali.today</div>
            <div className="footer-wx">
              <div className="footer-wx-item">
                <div><span className="footer-wx-val">{wind ?? '—'}</span><span className="footer-wx-unit"> km/h</span></div>
                <div className="footer-wx-lbl">Wind</div>
              </div>
              <div className="footer-wx-item">
                <div><span className="footer-wx-val">{visibility ?? '—'}</span><span className="footer-wx-unit"> km</span></div>
                <div className="footer-wx-lbl">Visibility</div>
              </div>
              <div className="footer-wx-item">
                <div><span className="footer-wx-val">{description ?? '—'}</span></div>
                <div className="footer-wx-lbl">Conditions</div>
              </div>
            </div>
          </div>

          {/* Col 2 — checkers */}
          <div>
            <div className="footer-col-title">Checkers</div>
            <div className="footer-col-links">
              <Link href="/">❄ Snow</Link>
              <Link href="/atal-tunnel">Atal Tunnel</Link>
              <Link href="/rohtang-pass">Rohtang Pass</Link>
            </div>
          </div>

          {/* Col 3 — explore */}
          <div>
            <div className="footer-col-title">Explore</div>
            <div className="footer-col-links">
              <a href="/guide" className="soon">Local Guide</a>
              <a href="/places" className="soon">Places we love</a>
              <a href="/blog" className="soon">Blog</a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-credit">
            Updated in real-time by{' '}
            <a href="https://narender.xyz" target="_blank" rel="noopener noreferrer">someone</a>
            {' '}who lives here
          </div>
          <div className="footer-love">Built with 🩶 in Manali</div>
        </div>
      </footer>
    </>
  )
}