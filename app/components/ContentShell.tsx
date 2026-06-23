'use client'

import BrandHeader from './BrandHeader'

interface ContentShellProps {
  location?: string
  children: React.ReactNode
}

/**
 * Shared layout for scrollable content pages (guide index, guide articles,
 * and future /places and /blog pages).
 *
 * Unlike the checker pages, this shell does NOT lock html/body scroll and
 * does NOT pin the footer with position:fixed — content here can run
 * longer than one viewport, so the footer sits in normal flow at the true
 * end of the page. The header is just the BrandHeader wordmark (now a link
 * back to "/") — content pages intentionally do NOT show the checker Nav
 * pill, since Snow/Atal Tunnel/Rohtang Pass aren't relevant navigation
 * targets from a guide article. The wordmark is the way back home.
 *
 * Visual language (glass blur, gradient, bevel shadow, fonts, colors) is
 * copied 1:1 from Nav.tsx / Footer.tsx so content pages feel native to the
 * rest of the site.
 */
export default function ContentShell({ location = 'Manali · Kullu Valley · 2050m', children }: ContentShellProps) {
  return (
    <>
      <style>{`
        *, *::before, *::after { margin:0; padding:0; box-sizing:border-box }
        html, body { font-family:var(--font-inter), sans-serif }

        .cs-root {
          min-height:100vh;
          background:#0b0d10;
          background-image:
            radial-gradient(ellipse 80% 50% at 50% -10%, rgba(40,55,75,0.55) 0%, transparent 60%),
            linear-gradient(180deg, #0c0f13 0%, #0a0b0d 100%);
          position:relative;
        }

        .cs-header {
          position:fixed; top:0; left:0; right:0; z-index:20;
          padding:1.25rem 2rem 1.1rem;
          display:flex; align-items:center; justify-content:flex-start;
          background:linear-gradient(to bottom, rgba(8,9,11,0.85) 0%, rgba(8,9,11,0) 100%);
        }

        .cs-main {
          padding-top:115px;
          padding-bottom:4rem;
        }

        .cs-footer {
          width:100%;
          padding:1rem 2.5rem;
          box-sizing:border-box;
          color:#fff;
          background:linear-gradient(180deg, rgba(25,25,30,0.15) 0%, rgba(15,15,20,0.4) 100%);
          backdrop-filter:blur(35px);
          -webkit-backdrop-filter:blur(35px);
          box-shadow:
            0 -1px 0px rgba(255,255,255,0.2),
            inset 0 1px 0px rgba(255,255,255,0.15);
        }
        .cs-footer-row { display:flex; align-items:center; justify-content:space-between }
        .cs-footer-credit {
          font-family:var(--font-cormorant), serif;
          font-size:12px; font-weight:300; font-style:italic;
          color:rgba(255,255,255,0.35); white-space:nowrap;
        }
        .cs-footer-credit a {
          color:rgba(255,255,255,0.5); text-decoration:none;
          border-bottom:1px solid rgba(255,255,255,0.18);
          transition:color .15s ease, border-color .15s ease;
        }
        .cs-footer-credit a:hover { color:rgba(255,255,255,0.9); border-color:rgba(255,255,255,0.5) }
        .cs-footer-explore { display:flex; align-items:center; gap:2.5rem }
        .cs-footer-explore a {
          font-size:11px; font-weight:500; letter-spacing:.12em; text-transform:uppercase;
          color:rgba(255,255,255,0.45); text-decoration:none; transition:color .2s ease; white-space:nowrap;
        }
        .cs-footer-explore a:hover { color:rgba(255,255,255,0.8) }
        .cs-footer-explore a.soon { color:rgba(255,255,255,0.2); pointer-events:none }
        .cs-footer-explore a.soon::after { content:' —'; color:rgba(255,255,255,0.12) }
        .cs-footer-love {
          font-family:var(--font-cormorant), serif;
          font-size:12px; font-weight:300; font-style:italic;
          color:rgba(255,255,255,0.3); white-space:nowrap;
        }

        @media(max-width:600px) {
          .cs-header { padding:1.1rem 1.1rem 0.8rem }
          .cs-main { padding-top:95px }
          .cs-footer { padding:0.85rem 1.1rem }
          .cs-footer-row { flex-direction:column; gap:0.6rem }
          .cs-footer-explore { gap:1.25rem; order:-1 }
          .cs-footer-explore a { font-size:9.5px }
          .cs-footer-credit { font-size:10.5px }
          .cs-footer-love { display:none }
        }
      `}</style>

      <div className="cs-root">
        <header className="cs-header">
          <BrandHeader location={location} />
        </header>

        <main className="cs-main">{children}</main>

        <footer className="cs-footer">
          <div className="cs-footer-row">
            <div className="cs-footer-credit">
              Updated in real-time by{' '}
              <a href="https://narender.xyz" target="_blank" rel="noopener noreferrer">someone</a>
              {' '}who lives here
            </div>
            <div className="cs-footer-explore">
              <a href="/guide">Local Guide</a>
              <a href="/places" className="soon">Places we love</a>
              <a href="/blog" className="soon">Blog</a>
            </div>
            <div className="cs-footer-love">Built with 🩶 in Manali</div>
          </div>
        </footer>
      </div>
    </>
  )
}