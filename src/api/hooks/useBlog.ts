import { useQuery } from '@tanstack/react-query'
import { apiClient } from '../client'
import type { BlogPost, ApiResponse } from '../types'

interface BlogListResponse {
  success: boolean
  data: BlogPost[]
  count: number
}

export function useBlogs() {
  return useQuery({
    queryKey: ['blogs'],
    queryFn: async () => {
      const { data } = await apiClient.get<BlogListResponse>('/blog')
      return data.data
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  })
}

export function useBlogPost(slug: string) {
  return useQuery({
    queryKey: ['blog', slug],
    queryFn: async () => {
      const { data } = await apiClient.get<ApiResponse<BlogPost>>(`/blog/${slug}`)
      return data.data
    },
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  })
}
