import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export function ScrollToTop() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    // If there's a hash, let the browser or custom logic handle it
    if (hash) {
      const id = hash.replace('#', '')
      
      // Try multiple times to find the element (handles slow mounting)
      let attempts = 0
      const maxAttempts = 20 // 2 seconds total
      
      const interval = setInterval(() => {
        const element = document.getElementById(id)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' })
          clearInterval(interval)
        }
        
        attempts++
        if (attempts >= maxAttempts) {
          clearInterval(interval)
        }
      }, 100)
      
      return () => clearInterval(interval)
    } else {
      // Otherwise scroll to top on path change
      window.scrollTo(0, 0)
    }
  }, [pathname, hash])

  return null
}
