import { motion, useReducedMotion } from 'framer-motion'
import { ReactNode } from 'react'

interface Props {
  children: ReactNode
  delay?: number
  direction?: 'up' | 'down' | 'left' | 'right' | 'none'
  className?: string
}

export function FadeInSection({
  children,
  delay = 0,
  direction = 'up',
  className = ''
}: Props) {
  const shouldReduceMotion = useReducedMotion()

  const getInitial = () => {
    if (shouldReduceMotion || direction === 'none') return { opacity: 0 }
    const offset = 40
    return {
      opacity: 0,
      y: direction === 'up' ? offset : direction === 'down' ? -offset : 0,
      x: direction === 'left' ? offset : direction === 'right' ? -offset : 0,
    }
  }

  return (
    <motion.div
      initial={getInitial()}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{
        duration: shouldReduceMotion ? 0.1 : 0.6,
        delay,
        ease: 'easeOut'
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
