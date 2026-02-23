import { motion } from 'framer-motion'
import { ArrowDown, Github, Linkedin, Mail, FileText } from 'lucide-react'
import { useAbout } from '@/api/hooks/useAbout'

export function Hero() {
  const { data: about, isLoading } = useAbout()

  return (
    <section
      id="home"
      className="min-h-screen flex items-center justify-center relative overflow-hidden pt-16"
    >
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-blue-50 dark:from-dark-bg dark:via-dark-bg dark:to-slate-900" />

      {/* Floating orbs */}
      <motion.div
        className="absolute top-1/4 right-1/4 w-64 h-64 bg-primary-200/30 dark:bg-primary-900/20 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 30, 0],
          y: [0, -20, 0],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-1/4 left-1/4 w-48 h-48 bg-purple-200/30 dark:bg-purple-900/20 rounded-full blur-3xl"
        animate={{
          scale: [1.2, 1, 1.2],
          x: [0, -20, 0],
          y: [0, 30, 0],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Profile Image */}
          {about?.profileImage && (
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', duration: 1, bounce: 0.4 }}
              className="mb-8"
            >
              <img
                src={about.profileImage}
                alt={about.name}
                className="w-32 h-32 md:w-40 md:h-40 rounded-full mx-auto border-4 border-white dark:border-dark-card shadow-2xl object-cover"
              />
            </motion.div>
          )}

          {/* Name */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-4xl sm:text-5xl md:text-7xl font-bold mb-4"
          >
            <span className="text-gradient">
              {isLoading ? 'Loading...' : about?.name || 'Jeff Koretke'}
            </span>
          </motion.h1>

          {/* Title */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-4"
          >
            {about?.title || 'Software Engineer'}
          </motion.p>

          {/* Location */}
          {about?.location && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-gray-500 dark:text-gray-400 mb-8"
            >
              {about.location}
            </motion.p>
          )}

          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex justify-center gap-4 mb-12"
          >
            {about?.github && (
              <SocialButton href={about.github} icon={<Github />} label="GitHub" />
            )}
            {about?.linkedin && (
              <SocialButton href={about.linkedin} icon={<Linkedin />} label="LinkedIn" />
            )}
            {about?.email && (
              <SocialButton href={`mailto:${about.email}`} icon={<Mail />} label="Email" />
            )}
            {about?.resume && (
              <SocialButton href={about.resume} icon={<FileText />} label="Resume" />
            )}
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <a
              href="#contact"
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all"
            >
              Get In Touch
            </a>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <a href="#about" aria-label="Scroll to about section">
            <ArrowDown className="w-6 h-6 text-gray-400" />
          </a>
        </motion.div>
      </div>
    </section>
  )
}

function SocialButton({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <motion.a
      href={href}
      target={href.startsWith('mailto') ? undefined : '_blank'}
      rel={href.startsWith('mailto') ? undefined : 'noopener noreferrer'}
      whileHover={{ scale: 1.1, y: -2 }}
      whileTap={{ scale: 0.95 }}
      className="p-4 rounded-full bg-white dark:bg-dark-card shadow-lg hover:shadow-xl transition-shadow"
      aria-label={label}
    >
      <span className="w-6 h-6 block">{icon}</span>
    </motion.a>
  )
}
