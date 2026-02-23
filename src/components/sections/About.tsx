import { useAbout } from '@/api/hooks/useAbout'
import { FadeInSection } from '../animations/FadeInSection'

export function About() {
  const { data: about, isLoading } = useAbout()

  if (isLoading) {
    return <AboutSkeleton />
  }

  return (
    <section id="about" className="py-20 md:py-32">
      <div className="container mx-auto px-4">
        <FadeInSection>
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            About Me
          </h2>
          <div className="w-20 h-1 bg-primary-600 mx-auto mb-12 rounded-full" />
        </FadeInSection>

        <div className="max-w-3xl mx-auto">
          <FadeInSection delay={0.2}>
            <div className="prose prose-lg dark:prose-invert mx-auto">
              <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed whitespace-pre-line">
                {about?.bio}
              </p>
            </div>
          </FadeInSection>
        </div>
      </div>
    </section>
  )
}

function AboutSkeleton() {
  return (
    <section className="py-20 md:py-32">
      <div className="container mx-auto px-4">
        <div className="h-10 w-48 bg-gray-200 dark:bg-dark-card mx-auto mb-12 rounded animate-pulse" />
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="h-6 bg-gray-200 dark:bg-dark-card rounded animate-pulse" />
          <div className="h-6 bg-gray-200 dark:bg-dark-card rounded animate-pulse" />
          <div className="h-6 w-3/4 bg-gray-200 dark:bg-dark-card rounded animate-pulse" />
        </div>
      </div>
    </section>
  )
}
