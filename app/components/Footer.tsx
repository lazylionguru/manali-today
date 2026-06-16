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
        /* 3D Glass Layer */
        .footer {
          position: fixed; 
          bottom: 0; 
          left: 0; 
          right: 0; 
          z-index: 20;
          width: 100%;
          padding: 1.5rem 2.5rem 1.25rem;
          box-sizing: border-box;
          color: #fff;
          
          /* Dark structural backing */
          background: linear-gradient(180deg, rgba(25, 25, 30, 0.15) 0%, rgba(15, 15, 20, 0.4) 100%);
          backdrop-filter: blur(35px);
          -webkit-backdrop-filter: blur(35px);
          
          /* Physical 3D Lean Perspective */
          transform: perspective(1000px) rotateX(2deg);
          transform-origin: bottom center;
          
          /* Multi-Layered Volumetric Shadows */
          box-shadow: 
            0 -1px 0px rgba(255, 255, 255, 0.2),                     /* Subtle outer rim */
            inset 0 1px 0px rgba(255, 255, 255, 0.15),                /* Glass edge thickness */
            inset 0 15px 30px rgba(255, 255, 255, 0.03),              /* Top surface sheen */
            0 -10px 30px rgba(0, 0, 0, 0.35),                         /* Ambient occlusion block */
            0 -30px 70px rgba(0, 0, 0, 0.5);                          /* Deep background drop shadow */
            
          border: none;
        }

        /* Continuous Dynamic Bevel Highlight */
        .footer::before {
          content: "";
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(
            90deg,
            rgba(255,255,255,0.02) 0%,
            rgba(255,255,255,0.4) 20%,
            rgba(255,255,255,0.6) 50%,
            rgba(255,255,255,0.4) 80%,
            rgba(255,255,255,0.02) 100%
          );
          pointer-events: none;
        }

        .footer-top {
          display: grid;
          grid-template-columns: 1.5fr 1fr 1fr;
          gap: 2rem;
          margin-bottom: 1.25rem;
          padding-bottom: 1.25rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .footer-brand {
          font-family: var(--font-cormorant), serif;
          font-size: 15px; font-weight: 300; font-style: italic;
          color: rgba(255, 255, 255, 0.85);
          margin-bottom: 0.6rem;
          text-shadow: 0 1px 4px rgba(0,0,0,0.5);
        }

        .footer-wx {
          display: flex; gap: 1.5rem; margin-top: 0.5rem;
        }
        .footer-wx-val {
          font-family: var(--font-cormorant), serif;
          font-size: 1.1rem; font-weight: 300;
          color: rgba(255, 255, 255, 0.85);
        }
        .footer-wx-unit { font-size: 0.7rem; color: rgba(255, 255, 255, 0.4) }
        .footer-wx-lbl {
          font-size: 8px; letter-spacing: .14em; text-transform: uppercase;
          color: rgba(255, 255, 255, 0.35); margin-top: 1px;
        }

        .footer-col-title {
          font-size: 8.5px; font-weight: 500; letter-spacing: .18em; text-transform: uppercase;
          color: rgba(255, 255, 255, 0.35); margin-bottom: 0.6rem;
        }
        .footer-col-links {
          display: flex; flex-direction: column; gap: 5px;
        }
        .footer-col-links a {
          font-size: 12px; color: rgba(255, 255, 255, 0.5);
          text-decoration: none; transition: all .2s ease;
        }
        .footer-col-links a:hover { 
          color: rgba(255, 255, 255, 1);
          transform: translateZ(5px); /* Lift links off the plane on hover */
        }
        .footer-col-links a.soon {
          color: rgba(255, 255, 255, 0.18);
          pointer-events: none;
        }
        .footer-col-links a.soon::after {
          content: ' —';
          font-size: 9px; letter-spacing: .08em;
          color: rgba(255, 255, 255, 0.12);
        }

        .footer-bottom {
          display: flex; align-items: center; justify-content: space-between;
        }
        .footer-credit {
          font-family: var(--font-cormorant), serif;
          font-size: 12px; font-weight: 300; font-style: italic;
          color: rgba(255, 255, 255, 0.35); line-height: 1.4;
        }
        .footer-credit a {
          color: rgba(255, 255, 255, 0.5);
          text-decoration: none;
          border-bottom: 1px solid rgba(255, 255, 255, 0.18);
          transition: color .15s ease, border-color .15s ease;
        }
        .footer-credit a:hover {
          color: rgba(255, 255, 255, 0.9);
          border-color: rgba(255, 255, 255, 0.5);
        }
        .footer-love {
          font-family: var(--font-cormorant), serif;
          font-size: 12px; font-weight: 300; font-style: italic;
          color: rgba(255, 255, 255, 0.3);
        }

        @media(max-width: 600px) {
          .footer {
            padding: 1.25rem 1.1rem 1rem;
            transform: none; /* Strip perspective on tiny mobile screens for crisp rendering */
          }
          .footer-top {
            grid-template-columns: 1fr 1fr;
            gap: 1.25rem;
            margin-bottom: 0.75rem;
            padding-bottom: 0.75rem;
          }
          .footer-brand { font-size: 13px }
          .footer-wx { gap: 1rem }
          .footer-wx-val { font-size: 1rem }
          .footer-col-links a { font-size: 11px }
          .footer-bottom { flex-direction: column; align-items: flex-start; gap: 4px }
          .footer-love { display: none }
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
