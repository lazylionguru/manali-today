'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { BlogPost } from '../../lib/mdx'

const PAGE_SIZE = 9

function formatDate(iso: string) {
  return new Date(iso + 'T00:00:00Z').toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export default function BlogIndexClient({ posts }: { posts: BlogPost[] }) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)

  if (posts.length === 0) {
    return (
      <div className="bi-wrap">
        <style>{blogIndexStyles}</style>
        <p className="bi-eyebrow">Blog · Manali, Himachal Pradesh</p>
        <h1 className="bi-h1">
          Stories from <em>the valley</em>
        </h1>
        <p className="bi-empty">First posts are on the way. Check back soon.</p>
      </div>
    )
  }

  const visiblePosts = posts.slice(0, visibleCount)
  const hasMore = visiblePosts.length < posts.length

  return (
    <div className="bi-wrap">
      <style>{blogIndexStyles}</style>

      <p className="bi-eyebrow">Blog · Manali, Himachal Pradesh</p>
      <h1 className="bi-h1">
        Stories from <em>the valley</em>
      </h1>
      <p className="bi-sub">
        Seasonal updates, hidden trails, and honest takes on the spots every
        tourist gets pointed toward, written by someone who actually lives here.
      </p>

      <div className="bi-grid">
        {visiblePosts.map((post) => (
          <Link key={post.frontmatter.slug} href={`/blog/${post.frontmatter.slug}`} className="bi-card">
            <div
              className="bi-card-img"
              style={{ backgroundImage: `url('${post.frontmatter.thumbImage}')` }}
            />
            <div className="bi-card-body">
              <h3 className="bi-card-title">{post.frontmatter.title}</h3>
              <p className="bi-card-desc">{post.frontmatter.description}</p>
              <div className="bi-meta">
                <span>{formatDate(post.frontmatter.publishedAt)}</span>
                <span className="bi-dot">·</span>
                <span>{post.frontmatter.readTimeInMinutes} min read</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {hasMore && (
        <button className="bi-load-more" onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}>
          Load more
        </button>
      )}
    </div>
  )
}

const blogIndexStyles = `
  .bi-wrap { max-width:1080px; margin:0 auto; padding:0 1.75rem }
  .bi-eyebrow {
    font-size:10px; font-weight:500; letter-spacing:.22em; text-transform:uppercase;
    color:rgba(255,255,255,0.42); text-align:center; margin-bottom:1.25rem;
  }
  .bi-h1 {
    font-family:var(--font-cormorant), serif; font-weight:300;
    font-size:clamp(2.5rem,6vw,4rem); line-height:1.05; letter-spacing:-.01em;
    color:rgba(255,255,255,0.96); text-align:center; margin-bottom:1rem;
  }
  .bi-h1 em { font-style:italic; color:#c6e3ff }
  .bi-sub {
    font-size:15px; line-height:1.6; color:rgba(255,255,255,0.5);
    text-align:center; max-width:560px; margin:0 auto 3rem;
  }
  .bi-empty { text-align:center; color:rgba(255,255,255,0.4); font-size:14px }

  .bi-grid {
    display:grid; grid-template-columns:repeat(3, 1fr); gap:1.25rem;
    margin-bottom:2.5rem;
  }
  .bi-card {
    display:block; text-decoration:none; border-radius:16px; overflow:hidden;
    background:linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%);
    border:1px solid rgba(255,255,255,0.08);
    transition:border-color .25s ease, transform .25s ease;
  }
  .bi-card:hover { border-color:rgba(198,227,255,0.3); transform:translateY(-2px) }
  .bi-card-img { background-size:cover; background-position:center; height:160px }
  .bi-card-body { padding:1.25rem 1.3rem 1.4rem }
  .bi-card-title {
    font-family:var(--font-cormorant), serif; font-weight:400;
    font-size:1.15rem; line-height:1.25; color:rgba(255,255,255,0.93);
    margin-bottom:0.5rem;
  }
  .bi-card-desc {
    font-size:12.5px; line-height:1.5; color:rgba(255,255,255,0.45);
    margin-bottom:0.8rem;
  }

  .bi-meta {
    font-size:11px; color:rgba(255,255,255,0.35);
    display:flex; align-items:center; gap:6px;
  }
  .bi-dot { color:rgba(255,255,255,0.2) }

  .bi-load-more {
    display:block; margin:0 auto 3rem; padding:0.7rem 2rem;
    font-size:11px; font-weight:500; letter-spacing:.12em; text-transform:uppercase;
    color:rgba(255,255,255,0.7); background:rgba(255,255,255,0.06);
    border:1px solid rgba(255,255,255,0.12); border-radius:100px;
    cursor:pointer; transition:background .2s ease, border-color .2s ease;
  }
  .bi-load-more:hover { background:rgba(255,255,255,0.1); border-color:rgba(198,227,255,0.35) }

  @media(max-width:900px) {
    .bi-grid { grid-template-columns:repeat(2, 1fr) }
  }
  @media(max-width:600px) {
    .bi-h1 { font-size:clamp(2.1rem,9vw,2.8rem) }
    .bi-sub { font-size:14px; margin-bottom:2.25rem }
    .bi-grid { grid-template-columns:1fr; gap:0.9rem }
  }
`