import type { MetadataRoute } from 'next'
import { getAllGuides, getAllBlogPosts } from '../lib/mdx'

const BASE_URL = 'https://manali.today'

export default function sitemap(): MetadataRoute.Sitemap {
  const guides = getAllGuides()
  const blogPosts = getAllBlogPosts()

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'always',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/is-atal-tunnel-open-today`,
      lastModified: new Date(),
      changeFrequency: 'always',
      priority: 0.95,
    },
    {
      url: `${BASE_URL}/is-rohtang-pass-open-today`,
      lastModified: new Date(),
      changeFrequency: 'always',
      priority: 0.95,
    },

    // Guide index + every published guide. Pillar/deep-research content,
    // rarely edited once live, but the index itself grows as new guides
    // are added, hence the higher changeFrequency on /guide itself.
    {
      url: `${BASE_URL}/guide`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    ...guides.map((guide) => ({
      url: `${BASE_URL}/guide/${guide.frontmatter.slug}`,
      lastModified: new Date(guide.frontmatter.updatedAt),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),

    // Blog index + every published post. Posts are point-in-time and
    // essentially static once published, monthly is generous already.
    // The index changes whenever a new post drops, so weekly there too.
    {
      url: `${BASE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    ...blogPosts.map((post) => ({
      url: `${BASE_URL}/blog/${post.frontmatter.slug}`,
      lastModified: new Date(post.frontmatter.publishedAt),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
  ]
}