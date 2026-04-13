import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import type { ContactRequest } from '../types'

// For a backend-less setup, you can use a service like Formspree.
// Replace YOUR_FORMSPREE_ID with your actual Formspree ID.
// Create a free account at https://formspree.io/
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/YOUR_FORMSPREE_ID'

export function useContactForm() {
  return useMutation({
    mutationFn: async (formData: ContactRequest) => {
      // If you decide to use Formspree, uncomment the following line:
      // const { data } = await axios.post(FORMSPREE_ENDPOINT, formData)
      
      // For now, let's keep it as a mock that returns success if you haven't set up Formspree
      // or if you want to test the UI.
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { success: true, message: 'Message sent successfully (MOCK)' };
      
      // If you want to keep using your current backend until you've switched to Formspree,
      // you would keep the original apiClient call here.
    },
  })
}
