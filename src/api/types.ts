// Matches your backend models exactly

export interface Experience {
  company: string
  position: string
  duration: string
  description: string
  achievements: string[]
}

export interface About {
  name: string
  title: string
  email: string
  phone?: string
  location?: string
  bio: string
  experience: Experience[]
  website?: string
  github?: string
  linkedin?: string
  resume?: string
  profileImage?: string
}

export interface Skill {
  _id: string
  category: SkillCategory
  name: string
  proficiency: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  yearsOfExperience: number
  description?: string
  isActive: boolean
  displayOrder: number
}

export type SkillCategory =
  | 'languages'
  | 'mobile'
  | 'backend'
  | 'tools'
  | 'methodologies'
  | 'frameworks'
  | 'platforms'
  | 'databases'

export interface ContactRequest {
  name: string
  email: string
  subject: string
  message: string
}

// API Response wrappers
export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
}

export interface SkillsResponse {
  success: boolean
  data: Skill[]
  groupedByCategory?: Record<SkillCategory, Skill[]>
}
