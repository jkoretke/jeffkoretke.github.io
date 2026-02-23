import { useQuery } from '@tanstack/react-query'
import { apiClient } from '../client'
import type { Skill, SkillCategory } from '../types'

interface SkillsApiResponse {
  success: boolean
  data: Record<string, Skill[]>
}

export interface SkillsData {
  allSkills: Skill[]
  groupedByCategory: Record<SkillCategory, Skill[]>
  categories: SkillCategory[]
}

export function useSkills() {
  return useQuery({
    queryKey: ['skills'],
    queryFn: async (): Promise<SkillsData> => {
      const { data } = await apiClient.get<SkillsApiResponse>('/skills')

      // API returns { data: { backend: [...], languages: [...], ... } }
      const grouped = data.data as Record<SkillCategory, Skill[]>
      const categories = Object.keys(grouped) as SkillCategory[]

      // Flatten all skills into a single array with category info
      const allSkills: Skill[] = []
      for (const category of categories) {
        for (const skill of grouped[category]) {
          allSkills.push({ ...skill, category, _id: `${category}-${skill.name}` })
        }
      }

      return {
        allSkills,
        groupedByCategory: grouped,
        categories,
      }
    },
    staleTime: 5 * 60 * 1000,
  })
}
