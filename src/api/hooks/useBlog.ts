import { useQuery } from '@tanstack/react-query'
import type { BlogPost } from '../types'
import blogData from '../../data/blog.json'

export function useBlogs() {
  return useQuery({
    queryKey: ['blogs'],
    queryFn: async () => {
      return blogData as BlogPost[]
    },
    staleTime: Infinity,
    gcTime: Infinity,
  })
}

export function useBlogPost(slug: string) {
  return useQuery({
    queryKey: ['blog', slug],
    queryFn: async () => {
      const post = (blogData as BlogPost[]).find(p => p.slug === slug)
      if (!post) {
        throw new Error('Blog post not found')
      }
      return post
    },
    enabled: !!slug,
    staleTime: Infinity,
    gcTime: Infinity,
  })
}
