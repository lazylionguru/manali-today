'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

// ─── CONFIG ───────────────────────────────────────────────────────────
const ROHTANG_STATUS: 'open' | 'closed' = 'open'
const LAST_UPDATED = '16 June 2026'
const STATUS_NOTE = 'Clear conditions, pass accessible'

// ─── STATUS CONFIG ────────────────────────────────────────────────────
const STATUS_MAP = {
  open: {
    word: 'Open.',
    color: '#c6e3ff',
    sub: 'Rohtang Pass is open today',
    note: STATUS_NOTE,
  },
  closed: {
    word: 'Closed.',
    color: '#ffb4a6',
    sub: 'Rohtang Pass is closed today',
    note: STATUS_NOTE,
  },
}

// ─── HELPERS ─────────────────────────────────────────────────────────
function getISTHour(): number {
  const now = new Date()
  const ist = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }))
  return ist.getHours() + ist.getMinutes() / 60
}

function getISTDateTime(): { date: string; time: string } {
  const now = new Date()
  const date = now.toLocaleDateString('en-IN', {
    timeZone: 'Asia/Kolkata',
    day: 'numeric', month: 'short', year: 'numeric',
  })
  const time = now.toLocaleTimeString('en-IN', {
    timeZone: 'Asia/Kolkata',
    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true,
  })
  return { date, time }
}

function isTuesdayIST(): boolean {
  const now = new Date()
  const ist = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }))
  return ist.getDay() === 2 // 2 = Tuesday
}

function getScene(h: number): string {
  if (h >= 20 || h < 5.5) return 'night'
  if (h >= 5.5 && h < 7.5) return 'sunrise'
  if (h >= 7.5 && h < 17.5) return 'day'
  if (h >= 17.5 && h < 20) return 'sunset'
  return 'day'
}

// ─── COMPONENT ───────────────────────────────────────────────────────
export default function RohtangChecker() {
  const [dateTime, setDateTime] = useState({ date: '', time: '' })
  const [scene, setScene] = useState('day')
  const [weather, setWeather] = useState<{
    temp: string; humidity: string; feels: string
    wind: string; visibility: string; description: string
  } | null>(null)
  const [showAnswer, setShowAnswer] = useState(false)
  const starsRef = useRef<HTMLDivElement>(null)

  // Auto-close on Tuesdays
  const isTuesday = isTuesdayIST()
  const effectiveStatus = isTuesday ? 'closed' : ROHTANG_STATUS
  const effectiveNote = isTuesday
    ? 'Rohtang Pass is closed every Tuesday for maintenance'
    : STATUS_MAP[ROHTANG_STATUS].note
  const status = {
    ...STATUS_MAP[effectiveStatus],
    note: effectiveNote,
  }

  useEffect(() => {
    setDateTime(getISTDateTime())
    const t = setInterval(() => setDateTime(getISTDateTime()), 1000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    const update = () => setScene(getScene(getISTHour()))
    update()
    const t = setInterval(update, 60000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const res = await fetch('/api/weather-rohtang')
        const d = await res.json()
        setWeather({
          temp: Math.round(d.main.temp) + '°C',
          humidity: d.main.humidity + '%',
          feels: Math.round(d.main.feels_like) + '°C',
          wind: Math.round(d.wind.speed * 3.6) + '',
          visibility: d.visibility ? (d.visibility / 1000).toFixed(1) : '—',
          description: d.weather[0].description.charAt(0).toUpperCase() + d.weather[0].description.slice(1),
        })
      } catch (e) {
        console.warn('Weather fetch failed', e)
      }
    }
    fetchWeather()
    const t = setInterval(fetchWeather, 600000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    const t = setTimeout(() => setShowAnswer(true), 300)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    const sf = starsRef.current
    if (!sf || sf.children.length > 0) return
    for (let i = 0; i < 110; i++) {
      const s = document.createElement('div')
      s.className = 'star'
      const sz = Math.random() * 1.8 + 0.4
      s.style.cssText = `left:${Math.random()*100}%;top:${Math.random()*70}%;width:${sz}px;height:${sz}px;animation-duration:${Math.random()*3+2}s;animation-delay:${Math.random()*5}s;opacity:${Math.random()*.7+.15}`
      sf.appendChild(s)
    }
  }, [])

  return (
    <>
      <style>{`
        *, *::before, *::after { margin:0; padding:0; box-sizing:border-box }
        html, body { height:100%; overflow:hidden; font-family:var(--font-inter), sans-serif }

        .bg-stack { position:fixed; inset:0; z-index:0 }
        .bg-img {
          position:absolute; inset:0;
          background-size:cover; background-position:center center;
          opacity:0; transition:opacity 3s cubic-bezier(0.4,0,0.2,1);
        }
        .bg-img.on { opacity:1 }
        .grade { position:absolute; inset:0 }
        .vignette {
          position:absolute; inset:0;
          background:radial-gradient(ellipse at 50% 40%, transparent 30%, rgba(0,0,0,0.6) 100%);
          z-index:1; pointer-events:none;
        }
        .scrim {
          position:absolute; bottom:0; left:0; right:0; height:60%;
          background:linear-gradient(to top,rgba(0,0,0,0.72) 0%,rgba(0,0,0,0.2) 50%,transparent 100%);
          z-index:1; pointer-events:none;
        }

        .starfield { position:fixed; inset:0; z-index:2; pointer-events:none; opacity:0; transition:opacity 3s ease }
        .starfield.on { opacity:1 }
        .star { position:absolute; border-radius:50%; background:#fff; animation:twinkle ease-in-out infinite }
        @keyframes twinkle { 0%,100%{opacity:.9} 50%{opacity:.2} }

        /* ─── HEADER ─── */
        .header {
          position:fixed; top:0; left:0; right:0; z-index:20;
          padding:1.25rem 2rem 1.1rem;
          display:flex; flex-direction:column; align-items:center; gap:1rem;
        }
        .header-row {
          width:100%; display:flex; align-items:center; justify-content:space-between;
        }
        .location-pill {
          display:flex; align-items:center; gap:7px;
          font-size:10px; font-weight:500; letter-spacing:.16em; text-transform:uppercase;
          color:rgba(255,255,255,0.6); white-space:nowrap;
        }
        .live-dot {
          width:6px; height:6px; border-radius:50%; background:#48d9c0; flex-shrink:0;
          animation:pulse 2.5s ease-in-out infinite;
        }
        @keyframes pulse {
          0%,100%{box-shadow:0 0 0 0 rgba(72,217,192,.5)}
          50%{box-shadow:0 0 0 5px rgba(72,217,192,0)}
        }
        .weather-data { display:flex; align-items:center; gap:1.75rem }
        .wx-item { text-align:right }
        .wx-val { font-size:13px; font-weight:500; color:rgba(255,255,255,0.88); letter-spacing:.02em }
        .wx-label { font-size:9px; letter-spacing:.14em; text-transform:uppercase; color:rgba(255,255,255,0.35); margin-top:1px }

        /* ─── NAV ─── */
        .nav-pill {
          display:flex; align-items:center;
          background:rgba(255,255,255,0.02);
          backdrop-filter:blur(80px) saturate(250%) brightness(1.15);
          -webkit-backdrop-filter:blur(80px) saturate(250%) brightness(1.15);
          border-radius:100px; padding:3px;
          border:1px solid rgba(255,255,255,0.28);
          box-shadow:0 2px 20px rgba(0,0,0,0.12), inset 0 0.5px 0 rgba(255,255,255,0.35);
          position:relative; overflow:hidden;
        }
        .nav-pill::before {
          content:''; position:absolute;
          top:0; left:5%; right:5%; height:1px;
          background:linear-gradient(to right, transparent, rgba(255,255,255,0.7) 25%, rgba(255,255,255,0.7) 75%, transparent);
        }
        .nav-pill::after {
          content:''; position:absolute;
          top:0; left:0; right:0; height:50%;
          background:linear-gradient(to bottom, rgba(255,255,255,0.06), transparent);
          border-radius:100px 100px 0 0; pointer-events:none;
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

        /* ─── PAGE ─── */
        .page {
          position:fixed; inset:0; z-index:10;
          display:flex; flex-direction:column; align-items:center; justify-content:center;
          padding:0 1.5rem; padding-top:180px; padding-bottom:40px;
        }
        .content { text-align:center; max-width:640px; width:100% }

        .tagline {
          font-size:10px; font-weight:500; letter-spacing:.22em; text-transform:uppercase;
          color:rgba(255,255,255,0.38); margin-bottom:2rem;
        }
        .headline {
          font-family:var(--font-cormorant), serif; font-weight:300;
          font-size:clamp(2.8rem,8vw,5.5rem);
          line-height:1.05; letter-spacing:-.02em;
          color:rgba(255,255,255,0.96);
          text-shadow:0 4px 40px rgba(0,0,0,0.35);
          margin-bottom:2.5rem;
        }
        .headline em { font-style:italic; color:#fff }

        /* ─── ANSWER ─── */
        .answer-wrap {
          display:flex; align-items:center; justify-content:center;
          margin-bottom:1rem;
        }
        .answer-inner {
          display:none; flex-direction:column; align-items:center; gap:14px;
          animation:rise .8s cubic-bezier(.22,1,.36,1) both;
        }
        .answer-inner.show { display:flex }
        @keyframes rise { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }

        .answer-word {
          font-family:var(--font-cormorant), serif;
          font-size:clamp(5rem,18vw,9rem);
          font-weight:300; line-height:1; letter-spacing:-.03em;
          text-shadow:0 8px 60px rgba(0,0,0,0.28);
        }
        .answer-sub {
          font-size:10px; font-weight:500; letter-spacing:.2em; text-transform:uppercase;
          color:rgba(255,255,255,0.38);
        }
        .answer-note {
          font-family:var(--font-cormorant), serif;
          font-size:15px; font-weight:300; font-style:italic;
          color:rgba(255,255,255,0.45);
        }

        /* ─── PERMIT NOTICE ─── */
        .permit-notice {
          display:flex; align-items:center; gap:8px;
          background:rgba(255,255,255,0.06);
          border:1px solid rgba(255,255,255,0.12);
          border-radius:100px;
          padding:7px 16px;
        }
        .permit-icon { font-size:12px }
        .permit-text {
          font-size:10px; font-weight:500; letter-spacing:.1em; text-transform:uppercase;
          color:rgba(255,255,255,0.5);
        }
        .permit-link {
          font-size:10px; font-weight:500; letter-spacing:.1em; text-transform:uppercase;
          color:#a8e6cf; text-decoration:none;
          border-bottom:1px solid rgba(168,230,207,0.3);
          transition:color .2s ease;
        }
        .permit-link:hover { color:#fff }

        /* ─── TIMESTAMP ─── */
        .answer-timestamp {
          display:flex; align-items:center; gap:8px;
        }
        .ts-badge { display:flex; align-items:center; gap:4px }
        .ts-dot {
          width:5px; height:5px; border-radius:50%; background:#a8e6cf;
          animation:pulse-soft 2.5s ease-in-out infinite;
        }
        @keyframes pulse-soft {
          0%,100%{box-shadow:0 0 0 0 rgba(168,230,207,.6)}
          50%{box-shadow:0 0 0 4px rgba(168,230,207,0)}
        }
        .ts-live {
          font-size:7.5px; font-weight:500; letter-spacing:.28em; text-transform:uppercase;
          color:rgba(168,230,207,0.85);
        }
        .ts-sep { width:1px; height:10px; background:rgba(255,255,255,0.18) }
        .ts-date {
          font-family:var(--font-cormorant), serif;
          font-size:14px; font-weight:300; color:rgba(255,255,255,0.55);
          letter-spacing:.05em; white-space:nowrap;
        }
        .ts-dot-mid { color:rgba(255,255,255,0.25); font-size:12px }
        .ts-time {
          font-family:var(--font-cormorant), serif;
          font-size:14px; font-weight:300; color:rgba(255,255,255,0.75);
          letter-spacing:.05em; white-space:nowrap;
        }

        .last-updated {
          font-size:10.5px; letter-spacing:.12em; text-transform:uppercase;
          color:rgba(255,255,255,0.28);
        }
        .last-updated span { color:rgba(255,255,255,0.5); font-weight:500 }

        /* ─── BOTTOM BAR ─── */
        .wx-bar {
          position:fixed; bottom:0; left:0; right:0; z-index:20;
          padding:1.2rem 2.5rem;
          background:linear-gradient(to top,rgba(0,0,0,0.55) 0%,transparent 100%);
          display:flex; align-items:flex-end; justify-content:space-between;
        }
        .wx-stats { display:flex; gap:2rem; align-items:flex-end }
        .wx-stat { line-height:1.2 }
        .wx-stat-val {
          font-family:var(--font-cormorant), serif;
          font-size:1.5rem; font-weight:300; color:rgba(255,255,255,0.85);
        }
        .wx-stat-unit { font-size:.75rem; color:rgba(255,255,255,0.5) }
        .wx-stat-lbl {
          font-size:9px; letter-spacing:.15em; text-transform:uppercase;
          color:rgba(255,255,255,0.32); margin-top:2px;
        }
        .footer-sig {
          font-family:var(--font-cormorant), serif;
          font-style:italic; font-size:13px; font-weight:300;
          color:rgba(255,255,255,0.28); letter-spacing:.04em;
          text-align:right; line-height:1.5;
        }
        .footer-sig strong { font-style:normal; font-weight:400; color:rgba(255,255,255,0.42) }

        /* ─── MOBILE ─── */
        @media(max-width:600px) {
          .header { padding:0.9rem 1.1rem 0.8rem; gap:0.75rem }
          .header-row .weather-data { display:none }
          .location-pill { font-size:9px; letter-spacing:.12em }
          .nav-pill { padding:3px }
          .nav-link { font-size:9.5px; padding:7px 14px; letter-spacing:.09em }
          .page { padding-top:140px; padding-bottom:40px }
          .tagline { font-size:9px; margin-bottom:1.2rem }
          .headline { font-size:clamp(2.2rem,10vw,3.5rem); margin-bottom:1.8rem }
          .answer-word { font-size:clamp(4rem,16vw,6rem) }
          .answer-sub { font-size:9px }
          .permit-notice { padding:6px 12px }
          .permit-text, .permit-link { font-size:9px }
          .wx-bar { padding:0.9rem 1.1rem }
          .wx-stats { gap:1.1rem }
          .wx-stat-val { font-size:1.2rem }
          .wx-stat-lbl { font-size:8px }
          .footer-sig { font-size:11px; line-height:1.35 }
          .footer-sig span { display:none }
        }
      `}</style>

      {/* Background */}
      <div className="bg-stack">
        <div className="bg-img on"
          style={{
            backgroundImage: `url('/bg-rohtang.jpg')`,
            backgroundPosition: 'center center',
          }}>
          <div className="grade" style={{ background: 'rgba(0,5,15,0.3)' }} />
        </div>
        <div className="vignette" />
        <div className="scrim" />
      </div>

      {/* Stars */}
      <div ref={starsRef} className={`starfield${scene === 'night' ? ' on' : ''}`} />

      {/* Header */}
      <header className="header">
        <div className="header-row">
          <div className="location-pill">
            <span className="live-dot" />
            Rohtang Pass · 3978m
          </div>
          <div className="weather-data">
            <div className="wx-item">
              <div className="wx-val">{weather?.temp ?? '—'}</div>
              <div className="wx-label">Temp</div>
            </div>
            <div className="wx-item">
              <div className="wx-val">{weather?.humidity ?? '—'}</div>
              <div className="wx-label">Humidity</div>
            </div>
            <div className="wx-item">
              <div className="wx-val">{weather?.feels ?? '—'}</div>
              <div className="wx-label">Feels like</div>
            </div>
          </div>
        </div>

        <nav className="nav-pill">
          <Link href="/" className="nav-link">❄ Snow</Link>
          <div className="nav-divider" />
          <Link href="/atal-tunnel" className="nav-link">Atal Tunnel</Link>
          <div className="nav-divider" />
          <Link href="/rohtang-pass" className="nav-link active">Rohtang Pass</Link>
        </nav>
      </header>

      {/* Hero */}
      <div className="page">
        <div className="content">
          <p className="tagline">Live Status · Manali, Himachal Pradesh</p>
          <h1 className="headline">
            Is <em>Rohtang Pass</em><br />open today?
          </h1>
          <div className="answer-wrap">
            <div className={`answer-inner${showAnswer ? ' show' : ''}`}>
              <div className="answer-word" style={{ color: status.color }}>
                {status.word}
              </div>
              <div className="answer-sub">{status.sub}</div>
              <div className="answer-note">{status.note}</div>

              {/* Permit notice — always show when open */}
              
                <div className="permit-notice">
                  <span className="permit-icon">📋</span>
                  <span className="permit-text">Permit required —</span>
                  
                    href="https://rohtangpermits.hp.gov.in"
                    target="_blank"
                    rel="noopener noreferrer"
                </div>
              

              <div className="answer-timestamp">
                <div className="ts-badge">
                  <span className="ts-dot" />
                  <span className="ts-live">Live</span>
                </div>
                <div className="ts-sep" />
                <span className="ts-date">{dateTime.date}</span>
                <span className="ts-dot-mid">·</span>
                <span className="ts-time">{dateTime.time}</span>
              </div>

              <div className="last-updated">
                Last updated: <span>{LAST_UPDATED}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="wx-bar">
        <div className="wx-stats">
          <div className="wx-stat">
            <div><span className="wx-stat-val">{weather?.wind ?? '—'}</span><span className="wx-stat-unit"> km/h</span></div>
            <div className="wx-stat-lbl">Wind</div>
          </div>
          <div className="wx-stat">
            <div><span className="wx-stat-val">{weather?.visibility ?? '—'}</span><span className="wx-stat-unit"> km</span></div>
            <div className="wx-stat-lbl">Visibility</div>
          </div>
          <div className="wx-stat">
            <div><span className="wx-stat-val">{weather?.description ?? '—'}</span></div>
            <div className="wx-stat-lbl">Conditions</div>
          </div>
        </div>
        <div className="footer-sig">
          Updated by someone<br />who <strong>lives here</strong><br />
          <span style={{ fontSize:'11px', color:'rgba(255,255,255,0.18)', letterSpacing:'.1em', fontStyle:'normal' }}>
            Built with love in Manali ♥
          </span>
        </div>
      </div>
    </>
  )
}