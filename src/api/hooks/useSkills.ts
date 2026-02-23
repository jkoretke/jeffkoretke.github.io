import { useQuery } from '@tanstack/react-query'
import { apiClient } from '../client'
import type { SkillsResponse, SkillCategory } from '../types'

export function useSkills(category?: SkillCategory) {
  return useQuery({
    queryKey: ['skills', category],
    queryFn: async () => {
      const endpoint = category ? `/skills/${category}` : '/skills'
      const { data } = await apiClient.get<SkillsResponse>(endpoint)
      return data
    },
    staleTime: 5 * 60 * 1000,
  })
}
