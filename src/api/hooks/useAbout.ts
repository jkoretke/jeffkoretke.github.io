import { useQuery } from '@tanstack/react-query'
import type { About } from '../types'
import aboutData from '../../data/about.json'

export function useAbout() {
  return useQuery({
    queryKey: ['about'],
    queryFn: async (): Promise<About> => {
      return aboutData as About
    },
    staleTime: Infinity, // Data is static
    gcTime: Infinity,
  })
}
