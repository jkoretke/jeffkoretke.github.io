import { useQuery } from '@tanstack/react-query'
import { apiClient } from '../client'
import type { About, ApiResponse } from '../types'

export function useAbout() {
  return useQuery({
    queryKey: ['about'],
    queryFn: async () => {
      const { data } = await apiClient.get<ApiResponse<About>>('/about')
      return data.data
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000,   // 30 minutes (formerly cacheTime)
  })
}
