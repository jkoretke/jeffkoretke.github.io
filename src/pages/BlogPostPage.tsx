import { useParams, Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Calendar, Tag, ArrowLeft } from 'lucide-react'
import { useBlogPost } from '@/api/hooks/useBlog'

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

export function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>()
  const { data: post, isLoading, isError } = useBlogPost(slug ?? '')

  return (
    <main className="flex-grow py-20 md:py-32">
      <div className="container mx-auto px-4 max-w-3xl">
        <Link
          to="/#blog"
          className="inline-flex items-center gap-1.5 text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors mb-10"
        >
          <ArrowLeft size={16} />
          All posts
        </Link>

        {isLoading && (
          <div className="space-y-4 animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-dark-border rounded w-3/4" />
            <div className="h-4 bg-gray-200 dark:bg-dark-border rounded w-32" />
            <div className="space-y-3 mt-8">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="h-4 bg-gray-200 dark:bg-dark-border rounded" style={{ width: `${80 + (i % 4) * 5}%` }} />
              ))}
            </div>
          </div>
        )}

        {isError && (
          <p className="text-gray-500 dark:text-gray-400">Post not found.</p>
        )}

        {post && (
          <article>
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.map(tag => (
                <span key={tag} className="flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400">
                  <Tag size={10} />
                  {tag}
                </span>
              ))}
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3 leading-tight">
              {post.title}
            </h1>

            <div className="flex items-center gap-1.5 text-sm text-gray-400 dark:text-gray-500 mb-10">
              <Calendar size={13} />
              {formatDate(post.publishedAt)}
            </div>

            <div className="prose-content">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({ children }) => <h1 className="text-2xl font-bold mt-8 mb-4 text-gray-900 dark:text-white">{children}</h1>,
                  h2: ({ children }) => <h2 className="text-xl font-semibold mt-8 mb-3 text-gray-900 dark:text-white">{children}</h2>,
                  h3: ({ children }) => <h3 className="text-lg font-semibold mt-6 mb-2 text-gray-900 dark:text-white">{children}</h3>,
                  p: ({ children }) => <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">{children}</p>,
                  ul: ({ children }) => <ul className="list-disc list-inside space-y-1 mb-4 text-gray-600 dark:text-gray-300">{children}</ul>,
                  ol: ({ children }) => <ol className="list-decimal list-inside space-y-1 mb-4 text-gray-600 dark:text-gray-300">{children}</ol>,
                  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
                  strong: ({ children }) => <strong className="font-semibold text-gray-900 dark:text-white">{children}</strong>,
                  code: ({ children, className }) => {
                    const isBlock = className?.includes('language-')
                    return isBlock
                      ? <code className="block bg-gray-100 dark:bg-dark-card rounded-lg p-4 mb-4 text-sm font-mono text-gray-800 dark:text-gray-200 overflow-x-auto whitespace-pre">{children}</code>
                      : <code className="bg-gray-100 dark:bg-dark-card px-1.5 py-0.5 rounded text-sm font-mono text-gray-800 dark:text-gray-200">{children}</code>
                  },
                  pre: ({ children }) => <>{children}</>,
                  blockquote: ({ children }) => <blockquote className="border-l-4 border-primary-600 pl-4 italic text-gray-500 dark:text-gray-400 mb-4">{children}</blockquote>,
                  hr: () => <hr className="border-gray-200 dark:border-dark-border my-6" />,
                  table: ({ children }) => (
                    <div className="overflow-x-auto mb-4">
                      <table className="w-full text-sm text-left border-collapse">{children}</table>
                    </div>
                  ),
                  th: ({ children }) => <th className="border border-gray-200 dark:border-dark-border px-3 py-2 bg-gray-50 dark:bg-dark-card font-semibold text-gray-900 dark:text-white">{children}</th>,
                  td: ({ children }) => <td className="border border-gray-200 dark:border-dark-border px-3 py-2 text-gray-600 dark:text-gray-300">{children}</td>,
                  a: ({ children, href }) => <a href={href} className="text-primary-600 dark:text-primary-400 hover:underline" target="_blank" rel="noopener noreferrer">{children}</a>,
                }}
              >
                {post.content ?? ''}
              </ReactMarkdown>
            </div>
          </article>
        )}
      </div>
    </main>
  )
}
