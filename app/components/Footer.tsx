'use client'

export default function Footer() {
  return (
    <>
      <style>{`
        .footer {
          position: fixed; 
          bottom: 0; 
          left: 0; 
          right: 0; 
          z-index: 20;
          width: 100%;
          padding: 1rem 2.5rem;
          box-sizing: border-box;
          color: #fff;
          background: linear-gradient(180deg, rgba(25, 25, 30, 0.15) 0%, rgba(15, 15, 20, 0.4) 100%);
          backdrop-filter: blur(35px);
          -webkit-backdrop-filter: blur(35px);
          box-shadow: 
            0 -1px 0px rgba(255, 255, 255, 0.2),
            inset 0 1px 0px rgba(255, 255, 255, 0.15),
            0 -10px 30px rgba(0, 0, 0, 0.35),
            0 -30px 70px rgba(0, 0, 0, 0.5);
        }

        

        .footer-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .footer-credit {
          font-family: var(--font-cormorant), serif;
          font-size: 12px; font-weight: 300; font-style: italic;
          color: rgba(255, 255, 255, 0.35);
          white-space: nowrap;
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

        .footer-explore {
          display: flex;
          align-items: center;
          gap: 2.5rem;
        }
        .footer-explore a {
          font-size: 11px; font-weight: 500; letter-spacing: .12em; text-transform: uppercase;
          color: rgba(255, 255, 255, 0.45);
          text-decoration: none;
          transition: color .2s ease;
          white-space: nowrap;
        }
        .footer-explore a:hover { color: rgba(255, 255, 255, 0.8) }
        .footer-explore a.soon {
          color: rgba(255, 255, 255, 0.2);
          pointer-events: none;
        }
        .footer-explore a.soon::after {
          content: ' —';
          color: rgba(255, 255, 255, 0.12);
        }

        .footer-love {
          font-family: var(--font-cormorant), serif;
          font-size: 12px; font-weight: 300; font-style: italic;
          color: rgba(255, 255, 255, 0.3);
          white-space: nowrap;
        }

        @media(max-width: 600px) {
          .footer { padding: 0.85rem 1.1rem }
          .footer-row { flex-direction: column; gap: 0.6rem }
          .footer-explore { gap: 1.25rem; order: -1 }
          .footer-explore a { font-size: 9.5px }
          .footer-credit { font-size: 10.5px }
          .footer-love { display: none }
        }
      `}</style>

      <footer className="footer">
        <div className="footer-row">
          <div className="footer-credit">
            Updated in real-time by{' '}
            <a href="https://narender.xyz" target="_blank" rel="noopener noreferrer">someone</a>
            {' '}who lives here
          </div>

          <div className="footer-explore">
            <a href="/guide">Local Guide</a>
            <a href="/places" className="soon">Places we love</a>
            <a href="/blog" className="soon">Blog</a>
          </div>

          <div className="footer-love">Built with 🩶 in Manali</div>
        </div>
      </footer>
    </>
  )
}