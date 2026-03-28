import { Link } from 'react-router-dom'
import { ArrowRight, Calendar, Tag } from 'lucide-react'
import { useBlogs } from '@/api/hooks/useBlog'
import { FadeInSection } from '../animations/FadeInSection'

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

export function Blog() {
  const { data: posts, isLoading } = useBlogs()

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
                    <div className="flex flex-wrap gap-2 mb-3">
                      {post.tags.map(tag => (
                        <span key={tag} className="flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400">
                          <Tag size={10} />
                          {tag}
                        </span>
                      ))}
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 leading-snug">
                      {post.title}
                    </h3>

                    <div className="flex items-center gap-1.5 text-sm text-gray-400 dark:text-gray-500 mb-4">
                      <Calendar size={13} />
                      {formatDate(post.publishedAt)}
                    </div>

                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      {post.excerpt}
                    </p>

                    <Link
                      to={`/blog/${post.slug}`}
                      className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
                    >
                      Read more <ArrowRight size={16} />
                    </Link>
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
