import type { Metadata } from 'next'
import ContentShell from '../components/ContentShell'
import BlogIndexClient from './BlogIndexClient'
import { getAllBlogPosts } from '../../lib/mdx'

export const metadata: Metadata = {
  title: 'Manali Blog, Written by a Local Resident',
  description:
    'Seasonal updates, hidden trails, and honest takes on Manali tourist spots, written by someone who actually lives here.',
  alternates: { canonical: 'https://manali.today/blog' },
  openGraph: {
    title: 'Manali Blog, Written by a Local Resident',
    description:
      'Seasonal updates, hidden trails, and honest takes on Manali tourist spots, written by someone who actually lives here.',
    url: 'https://manali.today/blog',
    type: 'website',
  },
}

export default function BlogIndexPage() {
  const posts = getAllBlogPosts()

  return (
    <ContentShell>
      <BlogIndexClient posts={posts} />
    </ContentShell>
  )
}