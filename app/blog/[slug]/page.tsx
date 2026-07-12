import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'
import ContentShell from '../../components/ContentShell'
import { mdxComponents } from '../../components/mdx-components'
import { getBlogPostBySlug, getAllBlogSlugs } from '../../../lib/mdx'

interface PageProps {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return getAllBlogSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const post = getBlogPostBySlug(slug)
  if (!post) return {}

  const { title, description, coverImage } = post.frontmatter
  const url = `https://manali.today/blog/${slug}`

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: 'article',
      images: coverImage ? [{ url: `https://manali.today${coverImage}` }] : undefined,
    },
  }
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params
  const post = getBlogPostBySlug(slug)
  if (!post) notFound()

  const { frontmatter, content } = post

  const blogPostingSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: frontmatter.title,
    description: frontmatter.description,
    datePublished: frontmatter.publishedAt,
    image: frontmatter.coverImage ? `https://manali.today${frontmatter.coverImage}` : undefined,
    author: {
      '@type': 'Person',
      name: 'A Manali resident',
      url: 'https://narender.xyz',
    },
  }

  return (
    <ContentShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingSchema) }}
      />

      <style>{`
        .bp-wrap { max-width:720px; margin:0 auto; padding:0 1.75rem 3rem }
        .bp-cover {
          display:block; width:100%; aspect-ratio:16/9; border-radius:16px;
          object-fit:cover; object-position:center;
          margin-bottom:2rem;
        }
        .bp-tags { display:flex; flex-wrap:wrap; gap:0.5rem; margin-bottom:1.25rem }
        .bp-tag {
          font-size:9px; font-weight:600; letter-spacing:.12em; text-transform:uppercase;
          color:#c6e3ff; background:rgba(198,227,255,0.1);
          padding:4px 10px; border-radius:100px;
        }
        .bp-h1 {
          font-family:var(--font-cormorant), serif; font-weight:300;
          font-size:clamp(2.2rem,5.5vw,3.2rem); line-height:1.08; letter-spacing:-.01em;
          color:rgba(255,255,255,0.96); margin-bottom:0.75rem;
        }
        .bp-meta {
          font-size:12px; color:rgba(255,255,255,0.4);
          margin-bottom:2.5rem;
        }
        @media(max-width:600px) {
          .bp-h1 { font-size:clamp(1.9rem,8vw,2.4rem) }
        }
      `}</style>

      <div className="bp-wrap">
        {frontmatter.coverImage && (
          <img className="bp-cover" src={frontmatter.coverImage} alt={frontmatter.title} />
        )}
        <div className="bp-tags">
          {frontmatter.tags?.map((tag) => (
            <span key={tag} className="bp-tag">{tag}</span>
          ))}
        </div>
        <h1 className="bp-h1">{frontmatter.title}</h1>
        <p className="bp-meta">
          {new Date(frontmatter.publishedAt + 'T00:00:00Z').toLocaleDateString('en-IN', {
            day: 'numeric', month: 'short', year: 'numeric',
          })}
          {' · '}{frontmatter.readTimeInMinutes} min read
        </p>

        <MDXRemote source={content} components={mdxComponents} />
      </div>
    </ContentShell>
  )
}