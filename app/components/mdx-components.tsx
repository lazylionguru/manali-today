import Link from 'next/link'
import type { MDXComponents } from 'mdx/types'

/**
 * Maps raw markdown/MDX elements to styled components matching the site's
 * glass aesthetic. Shared by every guide (and later, blog) page so content
 * authors (human or deepseek) just write plain markdown and it renders
 * correctly without any per-file styling.
 *
 * Internal links (starting with "/") use next/link for client-side nav.
 * External links open in a new tab with rel="noopener noreferrer".
 */
export const mdxComponents: MDXComponents = {
  h2: (props) => <h2 className="mdx-h2" {...props} />,
  h3: (props) => <h3 className="mdx-h3" {...props} />,
  p: (props) => <p className="mdx-p" {...props} />,
  ul: (props) => <ul className="mdx-ul" {...props} />,
  ol: (props) => <ol className="mdx-ol" {...props} />,
  li: (props) => <li className="mdx-li" {...props} />,
  strong: (props) => <strong className="mdx-strong" {...props} />,
  table: (props) => (
    <div className="mdx-table-wrap">
      <table className="mdx-table" {...props} />
    </div>
  ),
  thead: (props) => <thead className="mdx-thead" {...props} />,
  th: (props) => <th className="mdx-th" {...props} />,
  td: (props) => <td className="mdx-td" {...props} />,
  tr: (props) => <tr className="mdx-tr" {...props} />,
  a: ({ href = '', ...rest }) => {
    const isInternal = href.startsWith('/')
    if (isInternal) {
      return <Link href={href} className="mdx-link" {...rest} />
    }
    return <a href={href} target="_blank" rel="noopener noreferrer" className="mdx-link mdx-link-external" {...rest} />
  },
  blockquote: (props) => <blockquote className="mdx-blockquote" {...props} />,
  hr: (props) => <hr className="mdx-hr" {...props} />,
}