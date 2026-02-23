import { useMutation } from '@tanstack/react-query'
import { apiClient } from '../client'
import type { ContactRequest, ApiResponse } from '../types'

export function useContactForm() {
  return useMutation({
    mutationFn: async (formData: ContactRequest) => {
      const { data } = await apiClient.post<ApiResponse<{ id: string }>>('/contact', formData)
      return data
    },
  })
}
