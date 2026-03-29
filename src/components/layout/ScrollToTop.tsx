import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export function ScrollToTop() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    // If there's a hash, let the browser or custom logic handle it
    if (hash) {
      const id = hash.replace('#', '')
      // Small delay to ensure the component is mounted
      const timer = setTimeout(() => {
        const element = document.getElementById(id)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' })
        }
      }, 100)
      return () => clearTimeout(timer)
    } else {
      // Otherwise scroll to top on path change
      window.scrollTo(0, 0)
    }
  }, [pathname, hash])

  return null
}
