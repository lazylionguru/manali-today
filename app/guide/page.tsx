import type { Metadata } from 'next'
import Link from 'next/link'
import ContentShell from '../components/ContentShell'

export const metadata: Metadata = {
  title: 'Manali Travel Guide, Written by a Local Resident | manali.today',
  description:
    'In-depth Manali travel guides written by someone who actually lives here: best time to visit, Rohtang permits, Solang Valley, Old Manali, weather by month, and more.',
  alternates: { canonical: 'https://manali.today/guide' },
  openGraph: {
    title: 'Manali Travel Guide, Written by a Local Resident',
    description:
      'In-depth Manali travel guides written by someone who actually lives here.',
    url: 'https://manali.today/guide',
    type: 'website',
  },
}

interface GuideTile {
  slug: string
  title: string
  description: string
  tag: string
  live: boolean
}

const guides: GuideTile[] = [
  {
    slug: 'manali',
    title: 'Complete Manali Travel Guide',
    description:
      'Everything to plan a trip: when to go, where to stay, what to do, and how the town actually works, from someone who lives here year-round.',
    tag: 'Pillar Guide',
    live: true,
  },
  {
    slug: 'best-time-to-visit-manali',
    title: 'Best Time to Visit Manali',
    description:
      'A month-by-month breakdown of weather, crowds, snow, and what each season is actually good for.',
    tag: 'Planning',
    live: false,
  },
  {
    slug: 'manali-to-rohtang-permit',
    title: 'Rohtang Pass Permit Guide',
    description:
      'How to actually get a Rohtang permit: online process, fees, documents, and the rules nobody explains clearly.',
    tag: 'Permits',
    live: false,
  },
  {
    slug: 'solang-valley',
    title: 'Solang Valley Guide',
    description:
      'Paragliding, snow activities, ropeway, and the best time of day to go before the tour buses arrive.',
    tag: 'Day Trip',
    live: false,
  },
  {
    slug: 'old-manali',
    title: 'Old Manali Guide',
    description:
      'Cafes, the river walk, where to stay, and how Old Manali differs from the Mall Road side of town.',
    tag: 'Neighbourhood',
    live: false,
  },
  {
    slug: 'manali-weather',
    title: 'Manali Weather, Explained',
    description:
      'How weather actually behaves here by season, why forecasts are often wrong in the mountains, and what to pack.',
    tag: 'Weather',
    live: false,
  },
]

export default function GuideIndexPage() {
  return (
    <ContentShell>
      <style>{`
        .gi-wrap { max-width:1080px; margin:0 auto; padding:0 1.75rem }
        .gi-eyebrow {
          font-size:10px; font-weight:500; letter-spacing:.22em; text-transform:uppercase;
          color:rgba(255,255,255,0.42); text-align:center; margin-bottom:1.25rem;
        }
        .gi-h1 {
          font-family:var(--font-cormorant), serif; font-weight:300;
          font-size:clamp(2.5rem,6vw,4rem); line-height:1.05; letter-spacing:-.01em;
          color:rgba(255,255,255,0.96); text-align:center; margin-bottom:1rem;
        }
        .gi-h1 em { font-style:italic; color:#c6e3ff }
        .gi-sub {
          font-size:15px; line-height:1.6; color:rgba(255,255,255,0.5);
          text-align:center; max-width:560px; margin:0 auto 3.5rem;
        }

        .gi-grid {
          display:grid; grid-template-columns:repeat(3, 1fr); gap:1.25rem;
        }

        .gi-card {
          position:relative; display:block; text-decoration:none;
          padding:1.6rem 1.5rem 1.75rem;
          border-radius:20px;
          background:linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%);
          border:1px solid rgba(255,255,255,0.08);
          transition:border-color .25s ease, background .25s ease, transform .25s ease;
        }
        .gi-card.live:hover {
          border-color:rgba(198,227,255,0.35);
          background:linear-gradient(180deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.03) 100%);
          transform:translateY(-2px);
        }
        .gi-card.soon { opacity:0.55; cursor:default }

        .gi-tag {
          display:inline-block; font-size:9px; font-weight:600; letter-spacing:.14em; text-transform:uppercase;
          color:#c6e3ff; background:rgba(198,227,255,0.1);
          padding:4px 10px; border-radius:100px; margin-bottom:0.9rem;
        }
        .gi-card.soon .gi-tag { color:rgba(255,255,255,0.4); background:rgba(255,255,255,0.06) }

        .gi-card-title {
          font-family:var(--font-cormorant), serif; font-weight:400;
          font-size:1.4rem; line-height:1.2; color:rgba(255,255,255,0.94);
          margin-bottom:0.6rem;
        }
        .gi-card-desc {
          font-size:13px; line-height:1.55; color:rgba(255,255,255,0.45);
        }
        .gi-card-soon-label {
          position:absolute; top:1.6rem; right:1.5rem;
          font-size:9px; font-weight:600; letter-spacing:.12em; text-transform:uppercase;
          color:rgba(255,255,255,0.3);
        }
        .gi-card-arrow {
          position:absolute; top:1.7rem; right:1.5rem;
          font-size:14px; color:rgba(198,227,255,0.5);
        }

        @media(max-width:900px) {
          .gi-grid { grid-template-columns:repeat(2, 1fr) }
        }
        @media(max-width:600px) {
          .gi-grid { grid-template-columns:1fr; gap:0.9rem }
          .gi-h1 { font-size:clamp(2.1rem,9vw,2.8rem) }
          .gi-sub { font-size:14px; margin-bottom:2.5rem }
          .gi-card { padding:1.4rem 1.25rem 1.5rem }
        }
      `}</style>

      <div className="gi-wrap">
        <p className="gi-eyebrow">Local Guide · Manali, Himachal Pradesh</p>
        <h1 className="gi-h1">
          Manali, written by<br /><em>someone who lives here</em>
        </h1>
        <p className="gi-sub">
          No stock travel-blog filler. These guides come from someone who has
          actually spent years in Old Manali: what's true, what's overrated,
          and what tourists never get told.
        </p>

        <div className="gi-grid">
          {guides.map((g) =>
            g.live ? (
              <Link key={g.slug} href={`/guide/${g.slug}`} className="gi-card live">
                <span className="gi-tag">{g.tag}</span>
                <span className="gi-card-arrow">→</span>
                <h2 className="gi-card-title">{g.title}</h2>
                <p className="gi-card-desc">{g.description}</p>
              </Link>
            ) : (
              <div key={g.slug} className="gi-card soon">
                <span className="gi-tag">{g.tag}</span>
                <span className="gi-card-soon-label">Soon</span>
                <h2 className="gi-card-title">{g.title}</h2>
                <p className="gi-card-desc">{g.description}</p>
              </div>
            )
          )}
        </div>
      </div>
    </ContentShell>
  )
}