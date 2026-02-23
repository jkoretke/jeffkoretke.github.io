import { motion } from 'framer-motion'
import { Briefcase } from 'lucide-react'
import { useAbout } from '@/api/hooks/useAbout'
import { FadeInSection } from '../animations/FadeInSection'

export function Experience() {
  const { data: about, isLoading } = useAbout()

  if (isLoading || !about?.experience?.length) {
    return null
  }

  return (
    <section id="experience" className="py-20 md:py-32">
      <div className="container mx-auto px-4">
        <FadeInSection>
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Experience
          </h2>
          <div className="w-20 h-1 bg-primary-600 mx-auto mb-12 rounded-full" />
        </FadeInSection>

        <div className="max-w-3xl mx-auto">
          {/* Timeline */}
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-4 md:left-8 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-dark-border" />

            {about.experience.map((exp, index) => (
              <FadeInSection key={index} delay={index * 0.1}>
                <motion.div
                  className="relative pl-12 md:pl-20 pb-12 last:pb-0"
                  whileHover={{ x: 4 }}
                  transition={{ duration: 0.2 }}
                >
                  {/* Timeline dot */}
                  <div className="absolute left-0 md:left-4 w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center shadow-lg">
                    <Briefcase className="w-4 h-4 text-white" />
                  </div>

                  {/* Content card */}
                  <div className="bg-white dark:bg-dark-card rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {exp.position}
                      </h3>
                      <span className="text-sm text-primary-600 dark:text-primary-400 font-medium">
                        {exp.duration}
                      </span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 font-medium mb-3">
                      {exp.company}
                    </p>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                      {exp.description}
                    </p>

                    {exp.achievements && exp.achievements.length > 0 && (
                      <ul className="space-y-2">
                        {exp.achievements.map((achievement, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400"
                          >
                            <span className="text-primary-600 mt-1">•</span>
                            {achievement}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </motion.div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
