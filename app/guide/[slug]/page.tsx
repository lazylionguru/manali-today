import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'
import ContentShell from '../../components/ContentShell'
import { mdxComponents } from '../../components/mdx-components'
import { getGuideBySlug, getAllGuideSlugs } from '../../../lib/mdx'

interface PageProps {
  params: { slug: string }
}

export function generateStaticParams() {
  return getAllGuideSlugs().map((slug) => ({ slug }))
}

export function generateMetadata({ params }: PageProps): Metadata {
  const guide = getGuideBySlug(params.slug)
  if (!guide) return {}

  const { title, description, ogImage } = guide.frontmatter
  const url = `https://manali.today/guide/${params.slug}`

  return {
    title: `${title} | manali.today`,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: 'article',
      images: ogImage ? [{ url: ogImage }] : undefined,
    },
  }
}

export default function GuidePage({ params }: PageProps) {
  const guide = getGuideBySlug(params.slug)
  if (!guide) notFound()

  const { frontmatter, content } = guide

  const faqSchema = frontmatter.faqs?.length
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: frontmatter.faqs.map((f) => ({
          '@type': 'Question',
          name: f.question,
          acceptedAnswer: { '@type': 'Answer', text: f.answer },
        })),
      }
    : null

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: frontmatter.title,
    description: frontmatter.description,
    datePublished: frontmatter.publishedAt,
    dateModified: frontmatter.updatedAt,
    author: {
      '@type': 'Person',
      name: 'A Manali resident',
      url: 'https://narender.xyz',
    },
  }

  return (
    <ContentShell>
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <style>{`
        .gp-wrap { max-width:720px; margin:0 auto; padding:0 1.75rem 3rem }
        .gp-tag {
          display:inline-block; font-size:9px; font-weight:600; letter-spacing:.14em; text-transform:uppercase;
          color:#c6e3ff; background:rgba(198,227,255,0.1);
          padding:4px 10px; border-radius:100px; margin-bottom:1.25rem;
        }
        .gp-h1 {
          font-family:var(--font-cormorant), serif; font-weight:300;
          font-size:clamp(2.2rem,5.5vw,3.2rem); line-height:1.08; letter-spacing:-.01em;
          color:rgba(255,255,255,0.96); margin-bottom:0.75rem;
        }
        .gp-meta {
          font-size:12px; color:rgba(255,255,255,0.4);
          margin-bottom:2.5rem;
        }
        @media(max-width:600px) {
          .gp-h1 { font-size:clamp(1.9rem,8vw,2.4rem) }
        }
      `}</style>

      <div className="gp-wrap">
        <span className="gp-tag">{frontmatter.tag}</span>
        <h1 className="gp-h1">{frontmatter.title}</h1>
        <p className="gp-meta">Updated {frontmatter.updatedAt}</p>

        <MDXRemote source={content} components={mdxComponents} />
      </div>
    </ContentShell>
  )
}