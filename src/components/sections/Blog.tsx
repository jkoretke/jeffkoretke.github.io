import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, ChevronUp, Calendar, Tag } from 'lucide-react'
import { useBlogs, useBlogPost } from '@/api/hooks/useBlog'
import { FadeInSection } from '../animations/FadeInSection'

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

function MarkdownContent({ slug }: { slug: string }) {
  const { data: post, isLoading } = useBlogPost(slug)

  if (isLoading) {
    return (
      <div className="space-y-3 mt-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-4 bg-gray-200 dark:bg-dark-border rounded animate-pulse" style={{ width: `${85 + (i % 3) * 5}%` }} />
        ))}
      </div>
    )
  }

  if (!post?.content) return null

  return (
    <div className="mt-6 pt-6 border-t border-gray-200 dark:border-dark-border">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => <h1 className="text-2xl font-bold mt-8 mb-4 text-gray-900 dark:text-white">{children}</h1>,
          h2: ({ children }) => <h2 className="text-xl font-semibold mt-6 mb-3 text-gray-900 dark:text-white">{children}</h2>,
          h3: ({ children }) => <h3 className="text-lg font-semibold mt-4 mb-2 text-gray-900 dark:text-white">{children}</h3>,
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
        {post.content}
      </ReactMarkdown>
    </div>
  )
}

export function Blog() {
  const { data: posts, isLoading } = useBlogs()
  const [expandedSlug, setExpandedSlug] = useState<string | null>(null)

  return (
    <section id="blog" className="py-20 md:py-32">
      <div className="container mx-auto px-4 max-w-3xl">
        <FadeInSection>
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Blog</h2>
          <div className="w-20 h-1 bg-primary-600 mx-auto mb-8 rounded-full" />
          <p className="text-gray-600 dark:text-gray-400 text-center mb-12 max-w-2xl mx-auto">
            Thoughts on Android development, AI workflows, and building things efficiently
          </p>
        </FadeInSection>

        {isLoading ? (
          <BlogSkeleton />
        ) : (
          <div className="space-y-6">
            {posts?.map((post, index) => (
              <FadeInSection key={post._id} delay={index * 0.1}>
                <div className="bg-white dark:bg-dark-card rounded-2xl shadow-sm border border-gray-100 dark:border-dark-border overflow-hidden">
                  <div className="p-6 md:p-8">
                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      {post.tags.map(tag => (
                        <span key={tag} className="flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400">
                          <Tag size={10} />
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 leading-snug">
                      {post.title}
                    </h3>

                    {/* Date */}
                    <div className="flex items-center gap-1.5 text-sm text-gray-400 dark:text-gray-500 mb-4">
                      <Calendar size={13} />
                      {formatDate(post.publishedAt)}
                    </div>

                    {/* Excerpt */}
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      {post.excerpt}
                    </p>

                    {/* Expand toggle */}
                    <button
                      onClick={() => setExpandedSlug(expandedSlug === post.slug ? null : post.slug)}
                      className="mt-4 flex items-center gap-1.5 text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
                    >
                      {expandedSlug === post.slug ? (
                        <><ChevronUp size={16} /> Collapse</>
                      ) : (
                        <><ChevronDown size={16} /> Read more</>
                      )}
                    </button>

                    {/* Full content */}
                    <AnimatePresence>
                      {expandedSlug === post.slug && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          style={{ overflow: 'hidden' }}
                        >
                          <MarkdownContent slug={post.slug} />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </FadeInSection>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

function BlogSkeleton() {
  return (
    <div className="space-y-6">
      {[1, 2].map(i => (
        <div key={i} className="bg-white dark:bg-dark-card rounded-2xl p-8 animate-pulse">
          <div className="flex gap-2 mb-3">
            <div className="h-5 w-16 bg-gray-200 dark:bg-dark-border rounded-full" />
            <div className="h-5 w-20 bg-gray-200 dark:bg-dark-border rounded-full" />
          </div>
          <div className="h-6 bg-gray-200 dark:bg-dark-border rounded mb-2 w-3/4" />
          <div className="h-4 bg-gray-200 dark:bg-dark-border rounded mb-4 w-32" />
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 dark:bg-dark-border rounded" />
            <div className="h-4 bg-gray-200 dark:bg-dark-border rounded w-5/6" />
          </div>
        </div>
      ))}
    </div>
  )
}
