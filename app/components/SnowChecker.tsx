'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

// ─── CONFIG ───────────────────────────────────────────────────────────
const IS_SNOWING = false
const LAST_SNOWED = '12 June 2026'

// ─── TYPES ───────────────────────────────────────────────────────────
interface WeatherData {
  temp: string
  humidity: string
  feels: string
  wind: string
  visibility: string
  description: string
  wxCode: number
}

// ─── HELPERS ─────────────────────────────────────────────────────────
function getISTHour(): number {
  const now = new Date()
  const ist = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }))
  return ist.getHours() + ist.getMinutes() / 60
}

function getISTTime(): string {
  const now = new Date()
  const time = now.toLocaleTimeString('en-IN', {
    timeZone: 'Asia/Kolkata',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  })
  const date = now.toLocaleDateString('en-IN', {
    timeZone: 'Asia/Kolkata',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
  return `${date} · ${time}`
}

function getScene(h: number, wxCode: number): string {
  if (h >= 20 || h < 5.5) return 'night'
  if (h >= 5.5 && h < 7.5) return 'sunrise'
  if (h >= 7.5 && h < 17.5) {
    if (wxCode >= 700 && wxCode < 800) return 'day-cloudy'
    if (wxCode >= 800 && wxCode <= 802) return 'day-sunny'
    if (wxCode > 802) return 'day-cloudy'
    return 'day-clear'
  }
  if (h >= 17.5 && h < 20) return 'sunset'
  return 'night'
}

// ─── COMPONENT ───────────────────────────────────────────────────────
export default function SnowChecker() {
  const [time, setTime] = useState('')
  const [scene, setScene] = useState('day-cloudy')
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [showAnswer, setShowAnswer] = useState(false)
  const starsRef = useRef<HTMLDivElement>(null)
  const snowRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setTime(getISTTime())
    const t = setInterval(() => setTime(getISTTime()), 1000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    const update = () => {
      const wxCode = weather?.wxCode ?? 800
      setScene(getScene(getISTHour(), wxCode))
    }
    update()
    const t = setInterval(update, 60000)
    return () => clearInterval(t)
  }, [weather])

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const res = await fetch('/api/weather')
        const d = await res.json()
        setWeather({
          temp: Math.round(d.main.temp) + '°C',
          humidity: d.main.humidity + '%',
          feels: Math.round(d.main.feels_like) + '°C',
          wind: Math.round(d.wind.speed * 3.6) + '',
          visibility: d.visibility ? (d.visibility / 1000).toFixed(1) : '—',
          description: d.weather[0].description.charAt(0).toUpperCase() + d.weather[0].description.slice(1),
          wxCode: d.weather[0].id,
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

  useEffect(() => {
    const sf = snowRef.current
    if (!sf || sf.children.length > 0) return
    for (let i = 0; i < 80; i++) {
      const f = document.createElement('div')
      f.className = 'flake'
      const sz = Math.random() * 4 + 1.5
      f.style.cssText = `left:${Math.random()*100}%;width:${sz}px;height:${sz}px;animation-duration:${Math.random()*8+5}s;animation-delay:${Math.random()*12}s;opacity:${Math.random()*.5+.2}`
      sf.appendChild(f)
    }
  }, [])

  const answerSub = IS_SNOWING
    ? 'Snow is falling right now'
    : weather?.description
      ? `${weather.description} in Manali today`
      : 'No snow in Manali today'

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
        .grade { position:absolute; inset:0; transition:opacity 3s ease }
        .vignette {
          position:absolute; inset:0;
          background:radial-gradient(ellipse at 50% 40%, transparent 30%, rgba(0,0,0,0.55) 100%);
          z-index:1; pointer-events:none;
        }
        .scrim {
          position:absolute; bottom:0; left:0; right:0; height:65%;
          background:linear-gradient(to top,rgba(0,0,0,0.72) 0%,rgba(0,0,0,0.3) 50%,transparent 100%);
          z-index:1; pointer-events:none;
        }

        .starfield { position:fixed; inset:0; z-index:2; pointer-events:none; opacity:0; transition:opacity 3s ease }
        .starfield.on { opacity:1 }
        .star { position:absolute; border-radius:50%; background:#fff; animation:twinkle ease-in-out infinite }
        @keyframes twinkle { 0%,100%{opacity:.9} 50%{opacity:.2} }

        .snowfield { position:fixed; inset:0; z-index:3; pointer-events:none; opacity:0; transition:opacity 2s ease }
        .snowfield.on { opacity:1 }
        .flake { position:absolute; border-radius:50%; background:rgba(215,230,255,0.8); animation:snowfall linear infinite }
        @keyframes snowfall {
          0%{transform:translateY(-30px) translateX(0) rotate(0deg);opacity:0}
          5%{opacity:.9} 90%{opacity:.5}
          100%{transform:translateY(105vh) translateX(35px) rotate(360deg);opacity:0}
        }

        /* ─── TOP HEADER ─── */
        .header {
          position:fixed; top:0; left:0; right:0; z-index:20;
          padding:1.1rem 1.75rem 0.9rem;
          display:flex; flex-direction:column; align-items:center; gap:0.6rem;
          background:linear-gradient(to bottom,rgba(0,0,0,0.5) 0%,transparent 100%);
        }

        /* Row 1: location left, weather right */
        .header-row {
          width:100%; display:flex; align-items:center; justify-content:space-between;
        }
        .location-pill {
          display:flex; align-items:center; gap:6px;
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
        .weather-data { display:flex; align-items:center; gap:1.5rem }
        .wx-item { text-align:right }
        .wx-val { font-size:13px; font-weight:500; color:rgba(255,255,255,0.9); letter-spacing:.02em }
        .wx-label { font-size:9px; letter-spacing:.14em; text-transform:uppercase; color:rgba(255,255,255,0.38); margin-top:1px }

        /* Row 2: frosted glass nav pill */
        .nav-pill {
          display:flex; align-items:center; gap:0;
          background:rgba(255,255,255,0.08);
          backdrop-filter:blur(16px); -webkit-backdrop-filter:blur(16px);
          border:1px solid rgba(255,255,255,0.12);
          border-radius:100px;
          padding:0 4px;
          overflow:hidden;
        }
        .nav-link {
          font-size:10px; font-weight:500; letter-spacing:.14em; text-transform:uppercase;
          color:rgba(255,255,255,0.55);
          text-decoration:none;
          padding:6px 16px;
          border-radius:100px;
          transition:color .2s ease, background .2s ease;
          white-space:nowrap;
        }
        .nav-link:hover { color:rgba(255,255,255,0.9) }
        .nav-link.active {
          color:rgba(255,255,255,0.95);
          background:rgba(255,255,255,0.12);
        }
        .nav-divider {
          width:1px; height:12px;
          background:rgba(255,255,255,0.15);
          flex-shrink:0;
        }

        /* Row 3: live timestamp */
        .live-timestamp {
          display:flex; align-items:center; gap:7px;
        }
        .live-badge {
          display:flex; align-items:center; gap:4px;
        }
        .live-dot-small {
          width:5px; height:5px; border-radius:50%;
          background:#a8e6cf;
          animation:pulse-soft 2.5s ease-in-out infinite;
        }
        @keyframes pulse-soft {
          0%,100%{box-shadow:0 0 0 0 rgba(168,230,207,.5)}
          50%{box-shadow:0 0 0 4px rgba(168,230,207,0)}
        }
        .live-label {
          font-size:7.5px; font-weight:500; letter-spacing:.28em; text-transform:uppercase;
          color:rgba(168,230,207,0.8);
        }
        .live-sep {
          width:1px; height:10px; background:rgba(255,255,255,0.15);
        }
        .live-time {
          font-family:var(--font-cormorant), serif;
          font-size:13px; font-weight:300;
          color:rgba(255,255,255,0.7);
          letter-spacing:.06em; white-space:nowrap;
        }

        /* ─── PAGE ─── */
        .page {
          position:fixed; inset:0; z-index:10;
          display:flex; flex-direction:column; align-items:center; justify-content:center;
          padding:0 1.5rem; padding-top:110px; padding-bottom:90px;
        }

        .content { text-align:center; max-width:600px; width:100% }
        .tagline { font-size:10px; font-weight:500; letter-spacing:.22em; text-transform:uppercase; color:rgba(255,255,255,0.42); margin-bottom:1.6rem }
        .headline { font-family:var(--font-cormorant), serif; font-weight:300; font-size:clamp(3rem,8.5vw,6rem); line-height:1.02; letter-spacing:-.02em; color:rgba(255,255,255,0.96); text-shadow:0 4px 40px rgba(0,0,0,0.35); margin-bottom:2.5rem }
        .headline em { font-style:italic; color:#fff }

        .answer-wrap { min-height:100px; display:flex; align-items:center; justify-content:center; margin-bottom:1.8rem }
        .answer-inner { display:none; flex-direction:column; align-items:center; gap:8px; animation:rise .8s cubic-bezier(.22,1,.36,1) both }
        .answer-inner.show { display:flex }
        @keyframes rise { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }

        .answer-word { font-family:var(--font-cormorant), serif; font-size:clamp(7rem,22vw,11rem); font-weight:300; line-height:1; letter-spacing:-.04em; text-shadow:0 8px 60px rgba(0,0,0,0.28) }
        .answer-word.yes { color:#c6e3ff }
        .answer-word.no { color:#ffd9a6 }
        .answer-sub { font-size:10px; font-weight:500; letter-spacing:.2em; text-transform:uppercase; color:rgba(255,255,255,0.38) }
        .snow-history { font-size:11px; letter-spacing:.12em; text-transform:uppercase; color:rgba(255,255,255,0.32); margin-top:.6rem }
        .snow-history span { color:rgba(255,255,255,0.55); font-weight:500 }

        /* ─── BOTTOM BAR ─── */
        .wx-bar {
          position:fixed; bottom:0; left:0; right:0; z-index:20;
          padding:1.2rem 2.5rem;
          background:linear-gradient(to top,rgba(0,0,0,0.55) 0%,transparent 100%);
          display:flex; align-items:flex-end; justify-content:space-between;
        }
        .wx-stats { display:flex; gap:2rem; align-items:flex-end }
        .wx-stat { line-height:1.2 }
        .wx-stat-val { font-family:var(--font-cormorant), serif; font-size:1.5rem; font-weight:300; color:rgba(255,255,255,0.85) }
        .wx-stat-unit { font-size:.75rem; color:rgba(255,255,255,0.5) }
        .wx-stat-lbl { font-size:9px; letter-spacing:.15em; text-transform:uppercase; color:rgba(255,255,255,0.32); margin-top:2px }
        .footer-sig { font-family:var(--font-cormorant), serif; font-style:italic; font-size:13px; font-weight:300; color:rgba(255,255,255,0.28); letter-spacing:.04em; text-align:right; line-height:1.5 }
        .footer-sig strong { font-style:normal; font-weight:400; color:rgba(255,255,255,0.42) }

        /* ─── MOBILE ─── */
        @media(max-width:600px) {
          .header { padding:0.85rem 1.1rem 0.7rem; gap:0.5rem }
          .header-row .weather-data { display:none }
          .location-pill { font-size:9px; letter-spacing:.12em }

          .nav-link { font-size:9px; padding:5px 12px; letter-spacing:.1em }

          .live-time { font-size:11.5px }
          .live-label { font-size:7px }

          .page { padding-top:105px; padding-bottom:80px }
          .tagline { font-size:9px; margin-bottom:1rem }
          .headline { font-size:clamp(2.6rem,11vw,4rem); margin-bottom:1.4rem }
          .answer-word { font-size:clamp(5.5rem,22vw,7.5rem) }
          .answer-sub { font-size:9px; letter-spacing:.16em }
          .snow-history { font-size:10px }

          .wx-bar { padding:0.9rem 1.1rem }
          .wx-stats { gap:1.1rem }
          .wx-stat-val { font-size:1.2rem }
          .wx-stat-lbl { font-size:8px }
          .footer-sig { font-size:11px; line-height:1.35 }
          .footer-sig span { display:none }
        }
      `}</style>

      {/* Backgrounds */}
      <div className="bg-stack">
        {['night','sunrise','day-sunny','day-cloudy','day-clear','sunset'].map(id => (
          <div key={id} className={`bg-img${scene === id ? ' on' : ''}`}
            style={{ backgroundImage: `url('/bg-${id}.png')` }}>
            <div className="grade" style={{ background: ({
              'night':     'rgba(4,10,30,0.38)',
              'sunrise':   'rgba(15,5,0,0.28)',
              'day-sunny': 'rgba(0,10,25,0.18)',
              'day-cloudy':'rgba(8,15,20,0.32)',
              'day-clear': 'rgba(0,8,20,0.22)',
              'sunset':    'rgba(20,5,0,0.25)',
            } as Record<string,string>)[id] }} />
          </div>
        ))}
        <div className="vignette" />
        <div className="scrim" />
      </div>

      {/* Stars */}
      <div ref={starsRef} className={`starfield${scene === 'night' ? ' on' : ''}`} />

      {/* Snow particles */}
      <div ref={snowRef} className={`snowfield${IS_SNOWING ? ' on' : ''}`} />

      {/* Header */}
      <header className="header">
        {/* Row 1 — location + weather */}
        <div className="header-row">
          <div className="location-pill">
            <span className="live-dot" />
            Manali · Kullu Valley · 2050m
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

        {/* Row 2 — frosted glass nav */}
        <nav className="nav-pill">
          <Link href="/" className="nav-link active">❄ Snow</Link>
          <div className="nav-divider" />
          <Link href="/atal-tunnel" className="nav-link">Atal Tunnel</Link>
          <div className="nav-divider" />
          <Link href="/rohtang-pass" className="nav-link">Rohtang Pass</Link>
        </nav>

        {/* Row 3 — live timestamp */}
        <div className="live-timestamp">
          <div className="live-badge">
            <span className="live-dot-small" />
            <span className="live-label">Live</span>
          </div>
          <div className="live-sep" />
          <div className="live-time">{time}</div>
        </div>
      </header>

      {/* Hero */}
      <div className="page">
        <div className="content">
          <p className="tagline">Real-time · Manali, Himachal Pradesh</p>
          <h1 className="headline">
            Is it snowing<br />in <em>Manali</em><br />today?
          </h1>
          <div className="answer-wrap">
            <div className={`answer-inner${showAnswer ? ' show' : ''}`}>
              <div className={`answer-word ${IS_SNOWING ? 'yes' : 'no'}`}>
                {IS_SNOWING ? 'Yes.' : 'No.'}
              </div>
              <div className="answer-sub">{answerSub}</div>
              {!IS_SNOWING && (
                <div className="snow-history">
                  Last snowfall: <span>{LAST_SNOWED}</span>
                </div>
              )}
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