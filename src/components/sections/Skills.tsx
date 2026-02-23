import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSkills } from '@/api/hooks/useSkills'
import { FadeInSection } from '../animations/FadeInSection'
import type { SkillCategory } from '@/api/types'

const CATEGORY_LABELS: Record<SkillCategory, string> = {
  languages: 'Languages',
  mobile: 'Mobile',
  backend: 'Backend',
  tools: 'Tools',
  methodologies: 'Methods',
  frameworks: 'Frameworks',
  platforms: 'Platforms',
  databases: 'Databases',
}

const PROFICIENCY_STYLES: Record<string, { bg: string; text: string }> = {
  beginner: { bg: 'bg-gray-100 dark:bg-gray-800', text: 'text-gray-600 dark:text-gray-400' },
  intermediate: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-600 dark:text-blue-400' },
  advanced: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-600 dark:text-green-400' },
  expert: { bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-600 dark:text-purple-400' },
}

export function Skills() {
  const { data, isLoading } = useSkills()
  const [activeCategory, setActiveCategory] = useState<SkillCategory | 'all'>('all')

  const categories = data?.groupedByCategory
    ? (Object.keys(data.groupedByCategory) as SkillCategory[])
    : []

  const displayedSkills = activeCategory === 'all'
    ? data?.data || []
    : data?.groupedByCategory?.[activeCategory] || []

  return (
    <section id="skills" className="py-20 md:py-32 bg-gray-50 dark:bg-dark-card/30">
      <div className="container mx-auto px-4">
        <FadeInSection>
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Technical Skills
          </h2>
          <div className="w-20 h-1 bg-primary-600 mx-auto mb-8 rounded-full" />
          <p className="text-gray-600 dark:text-gray-400 text-center mb-12 max-w-2xl mx-auto">
            Technologies and tools I work with
          </p>
        </FadeInSection>

        {/* Category Tabs */}
        <FadeInSection delay={0.1}>
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            <CategoryTab
              active={activeCategory === 'all'}
              onClick={() => setActiveCategory('all')}
            >
              All
            </CategoryTab>
            {categories.map((category) => (
              <CategoryTab
                key={category}
                active={activeCategory === category}
                onClick={() => setActiveCategory(category)}
              >
                {CATEGORY_LABELS[category]}
              </CategoryTab>
            ))}
          </div>
        </FadeInSection>

        {/* Skills Grid */}
        {isLoading ? (
          <SkillsSkeleton />
        ) : (
          <motion.div
            layout
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
          >
            <AnimatePresence mode="popLayout">
              {displayedSkills.map((skill, index) => (
                <motion.div
                  key={skill._id}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ delay: index * 0.03, duration: 0.3 }}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  className="bg-white dark:bg-dark-card rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
                >
                  <h3 className="font-medium text-sm mb-2 truncate" title={skill.name}>
                    {skill.name}
                  </h3>
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${PROFICIENCY_STYLES[skill.proficiency].bg} ${PROFICIENCY_STYLES[skill.proficiency].text}`}
                    >
                      {skill.proficiency}
                    </span>
                    {skill.yearsOfExperience > 0 && (
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {skill.yearsOfExperience}y
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </section>
  )
}

function CategoryTab({
  children,
  active,
  onClick
}: {
  children: React.ReactNode
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
        active
          ? 'bg-primary-600 text-white shadow-md'
          : 'bg-white dark:bg-dark-card text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-border'
      }`}
    >
      {children}
    </button>
  )
}

function SkillsSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} className="bg-white dark:bg-dark-card rounded-xl p-4 animate-pulse">
          <div className="h-4 bg-gray-200 dark:bg-dark-border rounded mb-2" />
          <div className="h-6 w-16 bg-gray-200 dark:bg-dark-border rounded-full" />
        </div>
      ))}
    </div>
  )
}
