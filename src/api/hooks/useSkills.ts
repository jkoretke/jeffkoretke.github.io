import { useQuery } from '@tanstack/react-query'
import type { Skill, SkillCategory } from '../types'
import skillsData from '../../data/skills.json'

export interface SkillsData {
  allSkills: Skill[]
  groupedByCategory: Record<SkillCategory, Skill[]>
  categories: SkillCategory[]
}

export function useSkills() {
  return useQuery({
    queryKey: ['skills'],
    queryFn: async (): Promise<SkillsData> => {
      // API used to return { data: { backend: [...], languages: [...], ... } }
      // Our JSON matches that structure
      const grouped = skillsData as Record<string, (string | Skill)[]>
      const categories = Object.keys(grouped) as SkillCategory[]

      // Flatten all skills into a single array with category info
      const allSkills: Skill[] = []
      const processedGrouped: Record<SkillCategory, Skill[]> = {} as any

      for (const category of categories) {
        processedGrouped[category] = []
        for (const item of grouped[category]) {
          const skill: Skill = typeof item === 'string' 
            ? { name: item, proficiency: 'intermediate', yearsOfExperience: 0 } as Skill
            : item as Skill
          
          const enrichedSkill = { 
            ...skill, 
            category, 
            _id: `${category}-${skill.name}` 
          }
          allSkills.push(enrichedSkill)
          processedGrouped[category].push(enrichedSkill)
        }
      }

      return {
        allSkills,
        groupedByCategory: processedGrouped,
        categories,
      }
    },
    staleTime: Infinity,
    gcTime: Infinity,
  })
}
