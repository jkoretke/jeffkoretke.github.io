import { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { HelmetProvider, Helmet } from 'react-helmet-async'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Hero } from '@/components/sections/Hero'
import { About } from '@/components/sections/About'
import { Skills } from '@/components/sections/Skills'
import { Experience } from '@/components/sections/Experience'
import { Blog } from '@/components/sections/Blog'
import { Contact } from '@/components/sections/Contact'
import { BlogPostPage } from '@/pages/BlogPostPage'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
})

function HomePage() {
  useEffect(() => {
    const { hash } = window.location
    if (!hash) return
    const timer = setTimeout(() => {
      const el = document.querySelector(hash)
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    }, 800)
    return () => clearTimeout(timer)
  }, [])

  return (
    <main className="flex-grow">
      <Helmet>
        <title>Jeff Koretke | Software Engineer</title>
        <meta name="description" content="Software engineer specializing in Android development, AI workflows, and building things efficiently." />
      </Helmet>
      <Hero />
      <About />
      <Skills />
      <Experience />
      <Blog />
      <Contact />
    </main>
  )
}

export default function App() {
  return (
    <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col">
          <Header />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/blog/:slug" element={<BlogPostPage />} />
          </Routes>
          <Footer />
        </div>
      </BrowserRouter>
    </QueryClientProvider>
    </HelmetProvider>
  )
}
