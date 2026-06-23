import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const GUIDES_DIR = path.join(process.cwd(), 'content', 'guides')
const BLOG_DIR = path.join(process.cwd(), 'content', 'blog')

export interface GuideFAQ {
  question: string
  answer: string
}

export interface GuideFrontmatter {
  title: string
  description: string
  tag: string
  category: string
  publishedAt: string
  updatedAt: string
  slug: string
  faqs?: GuideFAQ[]
  ogImage?: string
  draft?: boolean
}

export interface Guide {
  frontmatter: GuideFrontmatter
  content: string
}

/**
 * Reads and parses a single guide .mdx file by slug.
 * Returns null if the file doesn't exist or is marked draft.
 */
export function getGuideBySlug(slug: string): Guide | null {
  const filePath = path.join(GUIDES_DIR, `${slug}.mdx`)
  if (!fs.existsSync(filePath)) return null

  const raw = fs.readFileSync(filePath, 'utf8')
  const { data, content } = matter(raw)
  const frontmatter = data as GuideFrontmatter

  if (frontmatter.draft) return null
  if (frontmatter.slug !== slug) {
    console.warn(`Guide slug mismatch: file "${slug}.mdx" has frontmatter slug "${frontmatter.slug}"`)
  }

  return { frontmatter, content }
}

/**
 * Lists all published (non-draft) guides, sorted by publishedAt descending.
 * Used by the /guide index page to render live tiles automatically,
 * any new .mdx file dropped into content/guides/ shows up without code changes.
 */
export function getAllGuides(): Guide[] {
  if (!fs.existsSync(GUIDES_DIR)) return []

  const files = fs.readdirSync(GUIDES_DIR).filter((f) => f.endsWith('.mdx'))

  const guides = files
    .map((file) => {
      const raw = fs.readFileSync(path.join(GUIDES_DIR, file), 'utf8')
      const { data, content } = matter(raw)
      return { frontmatter: data as GuideFrontmatter, content }
    })
    .filter((g) => !g.frontmatter.draft)
    .sort((a, b) => (a.frontmatter.publishedAt < b.frontmatter.publishedAt ? 1 : -1))

  return guides
}

/**
 * Returns all valid slugs for generateStaticParams.
 */
export function getAllGuideSlugs(): string[] {
  if (!fs.existsSync(GUIDES_DIR)) return []
  return fs
    .readdirSync(GUIDES_DIR)
    .filter((f) => f.endsWith('.mdx'))
    .map((f) => f.replace(/\.mdx$/, ''))
}

/**
 * Blog post frontmatter shape, matches what blog.py's save_as_mdx() writes.
 * Deliberately leaner than GuideFrontmatter, no faqs/category, blog posts
 * are not hand-curated pillar content, they're the SEO-volume layer.
 */
export interface BlogFrontmatter {
  title: string
  slug: string
  publishedAt: string
  description: string
  tags: string[]
  readTimeInMinutes: number
  coverImage: string
  thumbImage: string
  draft?: boolean
}

export interface BlogPost {
  frontmatter: BlogFrontmatter
  content: string
}

/**
 * Reads and parses a single blog post .mdx file by slug.
 * Returns null if the file doesn't exist or is marked draft.
 */
export function getBlogPostBySlug(slug: string): BlogPost | null {
  const filePath = path.join(BLOG_DIR, `${slug}.mdx`)
  if (!fs.existsSync(filePath)) return null

  const raw = fs.readFileSync(filePath, 'utf8')
  const { data, content } = matter(raw)
  const frontmatter = data as BlogFrontmatter

  if (frontmatter.draft) return null

  return { frontmatter, content }
}

/**
 * Lists all published (non-draft) blog posts, sorted by publishedAt
 * descending (newest first). blog.py drops new .mdx files into
 * content/blog/, they show up here automatically, no code changes needed.
 */
export function getAllBlogPosts(): BlogPost[] {
  if (!fs.existsSync(BLOG_DIR)) return []

  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith('.mdx'))

  const posts = files
    .map((file) => {
      const raw = fs.readFileSync(path.join(BLOG_DIR, file), 'utf8')
      const { data, content } = matter(raw)
      return { frontmatter: data as BlogFrontmatter, content }
    })
    .filter((p) => !p.frontmatter.draft)
    .sort((a, b) => (a.frontmatter.publishedAt < b.frontmatter.publishedAt ? 1 : -1))

  return posts
}

/**
 * Returns all valid blog slugs for generateStaticParams.
 */
export function getAllBlogSlugs(): string[] {
  if (!fs.existsSync(BLOG_DIR)) return []
  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith('.mdx'))
    .map((f) => f.replace(/\.mdx$/, ''))
}