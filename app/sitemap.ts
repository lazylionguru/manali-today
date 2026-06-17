import type { MetadataRoute } from 'next'

const BASE_URL = 'https://manali.today'

export default function sitemap(): MetadataRoute.Sitemap {
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
    // Add entries below as /guide, /places, /blog go live.
    // For dynamic routes (e.g. blog/[slug], guide/[slug]), read the
    // MDX/content files at build time and spread their slugs in here,
    // e.g.:
    //
    // ...blogSlugs.map((slug) => ({
    //   url: `${BASE_URL}/blog/${slug}`,
    //   lastModified: new Date(),
    //   changeFrequency: 'weekly' as const,
    //   priority: 0.7,
    // })),
  ]
}