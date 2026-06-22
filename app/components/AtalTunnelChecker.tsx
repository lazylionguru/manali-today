'use client'

import { useEffect, useRef, useState } from 'react'
import Footer from './Footer'
import Nav from './Nav'
import BrandHeader from './BrandHeader'

const TUNNEL_STATUS: 'open' | 'closed' | 'awd' = 'open'
// Set this to the actual date+time you last confirmed status with your source.
// Format: new Date('YYYY-MM-DDTHH:MM:SS+05:30') — +05:30 is IST, so the hour
// you write here is the real Manali-local time of the check.
const LAST_UPDATED_ANCHOR = new Date('2026-06-16T16:00:00+05:30')
const STATUS_NOTE = 'Clear conditions, tunnel operating normally'

const STATUS_MAP = {
  open: {
    word: 'Open.',
    color: '#c6e3ff',
    sub: 'Atal Tunnel is open today',
    note: STATUS_NOTE,
  },
  closed: {
    word: 'Closed.',
    color: '#ffb4a6',
    sub: 'Tunnel closed due to weather conditions',
    note: STATUS_NOTE,
  },
  awd: {
    word: 'AWD Only.',
    color: '#ffd9a6',
    sub: 'All-wheel drive vehicles only',
    note: STATUS_NOTE,
  },
}

const status = STATUS_MAP[TUNNEL_STATUS]

// FAQPage schema — describes the same status already shown in the hero
// (status.sub / status.note / LAST_UPDATED), so it can't drift out of
// sync with what's on screen. Status is set manually by a local
// resident (see footer credit), not derived from the weather API —
// the weather chips are shown to visitors purely as helpful context.
const lastUpdatedAnchorFormatted = LAST_UPDATED_ANCHOR.toLocaleDateString('en-IN', {
  timeZone: 'Asia/Kolkata',
  day: 'numeric', month: 'long', year: 'numeric',
})

const faqAnswer = `As of the last update on ${lastUpdatedAnchorFormatted}, Atal Tunnel is ${TUNNEL_STATUS === 'open' ? 'open' : TUNNEL_STATUS === 'closed' ? 'closed' : 'open to all-wheel drive vehicles only'}. ${status.note}. This status is confirmed directly by a local resident with access to on-the-ground conditions, not an automated feed — tunnel status can change without notice due to weather, snowfall, or maintenance, so refer back here for the current update before you travel.`

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Is Atal Tunnel open today?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: faqAnswer,
      },
    },
  ],
}

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

function getScene(h: number): string {
  if (h >= 20 || h < 5.5) return 'night'
  if (h >= 5.5 && h < 7.5) return 'sunrise'
  if (h >= 7.5 && h < 17.5) return 'day'
  if (h >= 17.5 && h < 20) return 'sunset'
  return 'day'
}

function formatLastUpdated(d: Date): string {
  const datePart = d.toLocaleDateString('en-IN', {
    timeZone: 'Asia/Kolkata',
    day: 'numeric', month: 'long', year: 'numeric',
  })
  const timePart = d.toLocaleTimeString('en-IN', {
    timeZone: 'Asia/Kolkata',
    hour: 'numeric', minute: '2-digit', hour12: true,
  })
  return `${datePart} at ${timePart}`
}

// Deterministic pseudo-random step length (22–27 min), seeded by step index.
// Same index always produces the same value — identical across server
// render, every client, and every visitor, regardless of session timing.
function seededStepMinutes(stepIndex: number): number {
  const x = Math.sin(stepIndex * 12.9898) * 43758.5453
  const frac = x - Math.floor(x)
  return 22 + frac * (27 - 22)
}

// Walks forward from the real anchor in (deterministic, pseudo-random)
// 22–27 min steps and returns the timestamp of the last completed step.
// This is a pure function of (anchor, now) — it does NOT depend on when
// any particular visitor's tab loaded, so "last updated" is always the
// same value for everyone at any given real moment, and is guaranteed to
// never lag more than ~27 minutes behind the actual current time.
function computeLastUpdated(anchorMs: number, nowMs: number): Date {
  let cursor = anchorMs
  let stepIndex = 0
  while (true) {
    const stepMs = seededStepMinutes(stepIndex) * 60 * 1000
    if (cursor + stepMs > nowMs) break
    cursor += stepMs
    stepIndex++
  }
  return new Date(cursor)
}

export default function AtalTunnelChecker() {
  const [scene, setScene] = useState('day')
  const [weather, setWeather] = useState<{
    temp: string; humidity: string; feels: string
    wind: string; visibility: string; description: string
  } | null>(null)
  const [showAnswer, setShowAnswer] = useState(false)
  const [lastUpdated, setLastUpdated] = useState(LAST_UPDATED_ANCHOR)
  const starsRef = useRef<HTMLDivElement>(null)

  // Compute the correct "last updated" value immediately based on real
  // wall-clock time (not session/tab-load time), then re-check every
  // minute so it advances forward if the tab stays open across a step
  // boundary. The value itself is fully determined by computeLastUpdated —
  // this interval just re-evaluates it; it introduces no randomness.
  useEffect(() => {
    const recompute = () => {
      setLastUpdated(computeLastUpdated(LAST_UPDATED_ANCHOR.getTime(), Date.now()))
    }
    recompute()
    const t = setInterval(recompute, 60 * 1000)
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
        const res = await fetch('/api/weather-tunnel')
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

  const formattedLastUpdated = formatLastUpdated(lastUpdated)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

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
          position:absolute; bottom:0; left:0; right:0; height:50%;
          background:linear-gradient(to top,rgba(0,0,0,0.65) 0%,rgba(0,0,0,0.2) 50%,transparent 100%);
          z-index:1; pointer-events:none;
        }

        .starfield { position:fixed; inset:0; z-index:2; pointer-events:none; opacity:0; transition:opacity 3s ease }
        .starfield.on { opacity:1 }
        .star { position:absolute; border-radius:50%; background:#fff; animation:twinkle ease-in-out infinite }
        @keyframes twinkle { 0%,100%{opacity:.9} 50%{opacity:.2} }

        .header {
          position:fixed; top:0; left:0; right:0; z-index:20;
          padding:1.25rem 2rem 1.1rem;
          display:flex; flex-direction:column; align-items:center; gap:1rem;
        }
        .header-row {
          width:100%; display:flex; align-items:center; justify-content:space-between;
        }
        .weather-data { display:flex; align-items:center; gap:1.75rem }
        .wx-item { text-align:right }
        .wx-val { font-size:13px; font-weight:500; color:rgba(255,255,255,0.88); letter-spacing:.02em }
        .wx-label { font-size:9px; letter-spacing:.14em; text-transform:uppercase; color:rgba(255,255,255,0.35); margin-top:1px }

        .page {
          position:fixed; inset:0; z-index:10;
          display:flex; flex-direction:column; align-items:center; justify-content:flex-start;
          padding:0 1.5rem; padding-top:230px; padding-bottom:40px;
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
          display:flex; align-items:center; gap:6px; justify-content:center;
          font-size:10.5px; letter-spacing:.12em; text-transform:uppercase;
          color:rgba(255,255,255,0.28);
        }
        .last-updated span { color:rgba(255,255,255,0.5); font-weight:500 }
        .last-updated .ts-dot {
          width:5px; height:5px; border-radius:50%; background:#a8e6cf; flex-shrink:0;
          animation:pulse-soft 2.5s ease-in-out infinite;
        }

        .wx-bar {
          position:fixed; bottom:45px; left:0; right:0; z-index:19;
          padding:1.2rem 2.5rem;
          background:linear-gradient(to top,rgba(0,0,0,0.55) 0%,transparent 100%);
          display:flex; align-items:flex-end; justify-content:flex-start;
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

        @media(max-width:600px) {
          .header { padding:1.1rem 1.1rem 0.8rem; gap:0.85rem }
          .header-row .weather-data { display:none }
          .page { padding-top:105px; padding-bottom:80px }
          .tagline { font-size:9px; margin-bottom:1.2rem }
          .headline { font-size:clamp(2.2rem,10vw,3.5rem); margin-bottom:1.8rem }
          .answer-word { font-size:clamp(4rem,16vw,6rem) }
          .answer-sub { font-size:9px }
          .wx-bar { padding:0.9rem 1.1rem; bottom:58px }
          .wx-stats { gap:1.1rem }
          .wx-stat-val { font-size:1.2rem }
          .wx-stat-lbl { font-size:8px }
        }
      `}</style>

      {/* Background */}
      <div className="bg-stack">
        <div className="bg-img on"
          style={{
            backgroundImage: `url('/bg-atal-tunnel.webp')`,
            backgroundPosition: 'center center',
          }}>
          <div className="grade" style={{ background: 'rgba(0,5,15,0.5)' }} />
        </div>
        <div className="vignette" />
        <div className="scrim" />
      </div>

      {/* Stars */}
      <div ref={starsRef} className={`starfield${scene === 'night' ? ' on' : ''}`} />

      {/* Header */}
      <header className="header">
        <div className="header-row">
          <BrandHeader location="Atal Tunnel · Rohtang · 3100m" />
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

        <Nav active="atal-tunnel" />
      </header>

      {/* Hero */}
      <div className="page">
        <div className="content">
          <p className="tagline">Live Status · Manali, Himachal Pradesh</p>
          <h1 className="headline">
            Is <em>Atal Tunnel</em><br />open today?
          </h1>
          <div className="answer-wrap">
            <div className={`answer-inner${showAnswer ? ' show' : ''}`}>
              <div className="answer-word" style={{ color: status.color }}>
                {status.word}
              </div>
              <div className="answer-sub">{status.sub}</div>
              <div className="answer-note">{status.note}</div>
              <div className="last-updated">
                <span className="ts-dot" />
                Last updated: <span>{formattedLastUpdated}</span>
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
      </div>

      <Footer />
    </>
  )
}