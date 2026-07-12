import type { Metadata } from 'next'
import ContentShell from '../components/ContentShell'

export const metadata: Metadata = {
  title: 'About',
  description: 'Who runs manali.today, why it exists, and exactly how live status updates for snow, Atal Tunnel, and Rohtang Pass are actually verified.',
  alternates: {
    canonical: 'https://manali.today/about',
  },
  openGraph: {
    title: 'About | manali.today',
    description: 'Who runs manali.today, why it exists, and exactly how live status updates are actually verified.',
    url: 'https://manali.today/about',
    type: 'profile',
  },
}

// Person schema, distinct from the Organization/WebSite schema in the root
// layout. This is the page-specific identity claim: a real, named person,
// what he's known for, and links to his real, verifiable profiles. This is
// the single highest-leverage page on the site for AI-citation and
// journalist trust, per the credibility roadmap, since it answers "who is
// behind this and can I trust them" directly and explicitly.
const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Narender Charan',
  url: 'https://manali.today/about',
  image: 'https://manali.today/narender-photo.webp',
  jobTitle: 'Founder, manali.today',
  knowsAbout: [
    'Manali weather',
    'Road conditions',
    'Atal Tunnel',
    'Rohtang Pass',
  ],
  sameAs: [
    'https://x.com/0xnarender',
    'https://linkedin.com/in/lazylion',
    'https://narender.xyz',
    'https://remotestack.in',
  ],
}

export default function AboutPage() {
  return (
    <ContentShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />

      <style>{`
        .ab-wrap { max-width:720px; margin:0 auto; padding:0 1.75rem 3rem }
        .ab-header {
          display:flex; align-items:center; gap:1.5rem;
          margin-bottom:2.5rem;
        }
        .ab-photo {
          width:96px; height:96px; border-radius:50%;
          object-fit:cover; flex-shrink:0;
          border:1px solid rgba(255,255,255,0.12);
        }
        .ab-header-text { display:flex; flex-direction:column; gap:0.3rem }
        .ab-name {
          font-family:var(--font-cormorant), serif; font-weight:400;
          font-size:1.8rem; color:rgba(255,255,255,0.96);
        }
        .ab-tagline {
          font-size:13px; color:rgba(255,255,255,0.45);
        }

        .ab-h1 {
          font-family:var(--font-cormorant), serif; font-weight:300;
          font-size:clamp(2rem,5vw,2.8rem); line-height:1.1; letter-spacing:-.01em;
          color:rgba(255,255,255,0.96); margin-bottom:2rem;
        }

        .ab-h2 {
          font-family:var(--font-cormorant), serif; font-weight:400;
          font-size:1.5rem; line-height:1.25;
          color:rgba(255,255,255,0.93); margin:2.5rem 0 1rem;
        }
        .ab-p {
          font-size:15px; line-height:1.7; color:rgba(255,255,255,0.62);
          margin-bottom:1.1rem;
        }
        .ab-p strong { color:rgba(255,255,255,0.85); font-weight:600 }
        .ab-p a, .ab-list a {
          color:#c6e3ff; text-decoration:none;
          border-bottom:1px solid rgba(198,227,255,0.3);
        }
        .ab-p a:hover, .ab-list a:hover { border-color:rgba(198,227,255,0.8) }

        .ab-list { list-style:none; margin:0 0 1.1rem; padding:0 }
        .ab-list li {
          font-size:15px; line-height:1.7; color:rgba(255,255,255,0.62);
          margin-bottom:0.5rem;
        }
        .ab-list strong { color:rgba(255,255,255,0.85); font-weight:600 }

        @media(max-width:600px) {
          .ab-header { gap:1rem }
          .ab-photo { width:72px; height:72px }
          .ab-name { font-size:1.5rem }
          .ab-h1 { font-size:clamp(1.7rem,8vw,2.2rem) }
        }
      `}</style>

      <div className="ab-wrap">
        <div className="ab-header">
          <img src="/narender-photo.webp" alt="Narender Charan" className="ab-photo" />
          <div className="ab-header-text">
            <span className="ab-name">Narender Charan</span>
            <span className="ab-tagline">Founder, manali.today</span>
          </div>
        </div>

        <h1 className="ab-h1">About</h1>

        <p className="ab-p">
          My name is Narender Charan. I live in Old Manali, Himachal Pradesh, and I built and run manali.today.
        </p>

        <h2 className="ab-h2">Why This Site Exists</h2>
        <p className="ab-p">
          I moved to Old Manali in 2018. Within the first year, I noticed a pattern. Tourists, sometimes total strangers, would message local people on Instagram, in WhatsApp groups, on Google reviews, asking the same three questions over and over: is it snowing in Manali right now, is Atal Tunnel open today, is Rohtang Pass open today.
        </p>
        <p className="ab-p">
          There was no good single place to find the actual answer. Most of what existed online was either outdated, written by someone who had never been here, or scraped from a weather API that has no idea what&apos;s actually happening on the ground twenty minutes ago.
        </p>
        <p className="ab-p">
          So I started answering these questions myself, for free, because I already knew the answer most of the time anyway. manali.today is that habit turned into a website. Three questions, answered honestly, by someone who actually lives here and checks.
        </p>
        <p className="ab-p">
          It has since grown into more than that, guides and stories about the valley written from the same place, real local knowledge instead of recycled travel-blog filler, but the three live status pages are still the reason this site exists.
        </p>

        <h2 className="ab-h2">What I Do the Rest of the Time</h2>
        <p className="ab-p">
          manali.today isn&apos;t my only project. I&apos;m a marketer turned builder, and I built{' '}
          <a href="https://remotestack.in" target="_blank" rel="noopener noreferrer">RemoteStack</a>, a remote job board and AutoApply service, from right here in Manali. Remote work is what made it possible for me to actually live here and build things, instead of having to choose between the mountains and the work. manali.today comes from the same place, literally and otherwise: I live here, I notice what&apos;s actually useful for the people passing through, and I build it.
        </p>

        <h2 className="ab-h2">How I Actually Verify Status Updates</h2>
        <p className="ab-p">
          I want to be upfront about exactly how this works, since it matters more than most websites bother to explain.
        </p>
        <p className="ab-p">
          <strong>Sources: </strong> I confirm conditions through a combination of direct, personal access (I live here and I&apos;m out in town regularly, so I see conditions firsthand), and a small network of local contacts, drivers and residents near Atal Tunnel and Rohtang Pass who I can reach when I need ground-truth confirmation I can&apos;t get myself.
        </p>
        <p className="ab-p">
          <strong>This is not an automated feed: </strong> None of the three status pages pull live data from a government API or a weather service. The weather numbers shown alongside the status (temperature, wind, humidity) come from a weather API and are shown purely as helpful context, they are not what determines whether the page says open or closed. That determination is made by me, manually, based on what I&apos;ve actually confirmed.
        </p>
        <p className="ab-p">
          <strong>Update frequency: </strong> I aim to verify and update status within roughly 20 to 30 minutes of any real change. The &quot;last updated&quot; timestamp on each page reflects this directly.
        </p>
        <p className="ab-p">
          <strong>Limitations: </strong> I am one person. I do my best to verify quickly and accurately, but conditions in the mountains can change faster than any single source can track, especially during sudden weather events. If a status is wrong or goes stale, it is a mistake, not a feed failure, and I will correct it as soon as I know.
        </p>
        <p className="ab-p">
          <strong>Corrections: </strong> If I get something wrong, I fix it and I&apos;m not going to pretend it didn&apos;t happen.
        </p>

        <h2 className="ab-h2">Where Else to Find Me</h2>
        <ul className="ab-list">
          <li><strong>X / Twitter:</strong> <a href="https://x.com/0xnarender" target="_blank" rel="noopener noreferrer">@0xnarender</a></li>
          <li><strong>LinkedIn:</strong> <a href="https://linkedin.com/in/lazylion" target="_blank" rel="noopener noreferrer">linkedin.com/in/lazylion</a></li>
          <li><strong>Portfolio:</strong> <a href="https://narender.xyz" target="_blank" rel="noopener noreferrer">narender.xyz</a></li>
        </ul>
        <p className="ab-p">
          If you spot an error on any status page, or just want to say hello, reach out through any of the above.
        </p>
      </div>
    </ContentShell>
  )
}