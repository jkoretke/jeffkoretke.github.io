# Implementation Plan: Modern Portfolio Website

## Overview

Transform the current vanilla HTML/CSS/JS site into a modern, animated portfolio website connected to your Express.js backend API.

**Current State:**
- Plain HTML + CSS + vanilla JS
- Features: dark mode, click counter, cat facts
- Hosted on GitHub Pages at jeffkoretke.com

**Target State:**
- React 18 + TypeScript + Vite
- Connected to your backend at `https://jeffkoretke.com/api`
- Modern UI with Tailwind CSS + Framer Motion animations
- Mobile-first responsive design

---

## Tech Stack

| Category | Technology | Android Analogy |
|----------|------------|-----------------|
| **Framework** | React 18 | Jetpack Compose - declarative UI |
| **Language** | TypeScript | Kotlin - type safety |
| **Build Tool** | Vite | Gradle but 10x faster |
| **Styling** | Tailwind CSS | Compose modifiers |
| **Animations** | Framer Motion | MotionLayout |
| **Data Fetching** | TanStack Query | Retrofit + Room caching |
| **Routing** | React Router v6 | Navigation Component |
| **Forms** | React Hook Form + Zod | Form validation |
| **Icons** | Lucide React | Material Icons |

---

## Backend Endpoints (Your API)

Base URL: `https://jeffkoretke.com/api`

| Endpoint | Method | Purpose | Frontend Use |
|----------|--------|---------|--------------|
| `/api/about` | GET | Profile, bio, experience, social links | Hero, About section |
| `/api/skills` | GET | All skills grouped by category | Skills section |
| `/api/skills/:category` | GET | Skills for specific category | Filtered view |
| `/api/contact` | POST | Submit contact form (5 req/hr limit) | Contact form |
| `/api/health` | GET | Server status | Status indicator |
| `/api/isitnotfriday` | GET | Fun utility | Easter egg |
| `/api/docs` | GET | API documentation | Developer link |

---

## Phase 1: Project Setup

### 1.1 Clean Up Old Files & Initialize Vite

```bash
# In the current repo
cd ~/VSCodeProjects/jeffkoretke.github.io

# Remove old vanilla HTML/CSS/JS files
rm index.html styles.css

# Initialize Vite in current directory (. means current dir)
npm create vite@latest . -- --template react-ts

# Install core dependencies
npm install react-router-dom @tanstack/react-query axios
npm install framer-motion lucide-react
npm install react-hook-form @hookform/resolvers zod
npm install -D tailwindcss postcss autoprefixer @types/node

# Move CNAME to public folder for GitHub Pages
mkdir -p public
mv CNAME public/
```

### 1.2 Project Structure

```
src/
├── api/
│   ├── client.ts           # Axios instance
│   ├── types.ts            # API response types
│   └── hooks/
│       ├── useAbout.ts     # GET /api/about
│       ├── useSkills.ts    # GET /api/skills
│       └── useContact.ts   # POST /api/contact
│
├── components/
│   ├── ui/                 # Button, Card, Input
│   ├── layout/             # Header, Footer
│   ├── sections/           # Hero, Skills, Contact
│   └── animations/         # FadeIn, PageTransition
│
├── hooks/
│   ├── useTheme.ts         # Dark mode
│   └── useMediaQuery.ts    # Responsive
│
├── pages/
│   ├── Home.tsx
│   └── NotFound.tsx
│
├── App.tsx
├── main.tsx
└── index.css
```

### 1.3 Vite Configuration

**vite.config.ts:**
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
})
```

**postcss.config.js:**
```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

### 1.4 Tailwind Configuration

**tailwind.config.ts:**
```typescript
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        dark: {
          bg: '#0f172a',
          card: '#1e293b',
          border: '#334155',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'float': 'float 3s ease-in-out infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
}
```

### 1.5 Base CSS

**src/index.css:**
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html {
    scroll-behavior: smooth;
  }

  body {
    @apply bg-white dark:bg-dark-bg text-gray-900 dark:text-gray-100;
    @apply antialiased;
  }
}

@layer utilities {
  .text-gradient {
    @apply bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent;
  }

  .glass {
    @apply bg-white/80 dark:bg-dark-bg/80 backdrop-blur-md;
  }
}
```

---

## Phase 2: API Layer

### 2.1 Type Definitions

**src/api/types.ts:**
```typescript
// Matches your backend models exactly

export interface Experience {
  company: string
  position: string
  duration: string
  description: string
  achievements: string[]
}

export interface About {
  name: string
  title: string
  email: string
  phone?: string
  location?: string
  bio: string
  experience: Experience[]
  website?: string
  github?: string
  linkedin?: string
  resume?: string
  profileImage?: string
}

export interface Skill {
  _id: string
  category: SkillCategory
  name: string
  proficiency: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  yearsOfExperience: number
  description?: string
  isActive: boolean
  displayOrder: number
}

export type SkillCategory =
  | 'languages'
  | 'mobile'
  | 'backend'
  | 'tools'
  | 'methodologies'
  | 'frameworks'
  | 'platforms'
  | 'databases'

export interface ContactRequest {
  name: string
  email: string
  subject: string
  message: string
}

// API Response wrappers
export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
}

export interface SkillsResponse {
  success: boolean
  data: Skill[]
  groupedByCategory?: Record<SkillCategory, Skill[]>
}
```

### 2.2 API Client

**src/api/client.ts:**
```typescript
import axios from 'axios'

const API_BASE_URL = import.meta.env.PROD
  ? 'https://jeffkoretke.com/api'
  : 'http://localhost:3000/api'

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Error handling interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || error.message
    console.error('API Error:', message)
    return Promise.reject(new Error(message))
  }
)
```

### 2.3 Query Hooks

**src/api/hooks/useAbout.ts:**
```typescript
import { useQuery } from '@tanstack/react-query'
import { apiClient } from '../client'
import type { About, ApiResponse } from '../types'

export function useAbout() {
  return useQuery({
    queryKey: ['about'],
    queryFn: async () => {
      const { data } = await apiClient.get<ApiResponse<About>>('/about')
      return data.data
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000,   // 30 minutes (formerly cacheTime)
  })
}
```

**src/api/hooks/useSkills.ts:**
```typescript
import { useQuery } from '@tanstack/react-query'
import { apiClient } from '../client'
import type { SkillsResponse, SkillCategory } from '../types'

export function useSkills(category?: SkillCategory) {
  return useQuery({
    queryKey: ['skills', category],
    queryFn: async () => {
      const endpoint = category ? `/skills/${category}` : '/skills'
      const { data } = await apiClient.get<SkillsResponse>(endpoint)
      return data
    },
    staleTime: 5 * 60 * 1000,
  })
}
```

**src/api/hooks/useContact.ts:**
```typescript
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
```

---

## Phase 3: Core Components

### 3.1 Theme Hook

**src/hooks/useTheme.ts:**
```typescript
import { useState, useEffect } from 'react'

export function useTheme() {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window === 'undefined') return false
    const stored = localStorage.getItem('theme')
    if (stored) return stored === 'dark'
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', isDark)
    localStorage.setItem('theme', isDark ? 'dark' : 'light')
  }, [isDark])

  return {
    isDark,
    toggle: () => setIsDark(prev => !prev),
    setDark: () => setIsDark(true),
    setLight: () => setIsDark(false),
  }
}
```

### 3.2 Animation Wrapper

**src/components/animations/FadeInSection.tsx:**
```typescript
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
```

### 3.3 Header with Mobile Menu

**src/components/layout/Header.tsx:**
```typescript
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Moon, Sun, Github, Linkedin } from 'lucide-react'
import { useTheme } from '@/hooks/useTheme'
import { useAbout } from '@/api/hooks/useAbout'

const navLinks = [
  { href: '#home', label: 'Home' },
  { href: '#about', label: 'About' },
  { href: '#skills', label: 'Skills' },
  { href: '#experience', label: 'Experience' },
  { href: '#contact', label: 'Contact' },
]

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const { isDark, toggle } = useTheme()
  const { data: about } = useAbout()

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? 'glass border-b border-gray-200 dark:border-dark-border shadow-sm'
          : 'bg-transparent'
      }`}
    >
      <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <a
          href="#home"
          className="text-xl font-bold text-gradient"
        >
          JK
        </a>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors text-sm font-medium"
            >
              {link.label}
            </a>
          ))}

          <div className="flex items-center gap-2 ml-4">
            {about?.github && (
              <a
                href={about.github}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-card transition-colors"
                aria-label="GitHub"
              >
                <Github size={18} />
              </a>
            )}
            {about?.linkedin && (
              <a
                href={about.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-card transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin size={18} />
              </a>
            )}
            <button
              onClick={toggle}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-card transition-colors"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-card"
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass border-b border-gray-200 dark:border-dark-border"
          >
            <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="text-lg text-gray-600 dark:text-gray-300 py-2"
                >
                  {link.label}
                </a>
              ))}
              <div className="flex items-center gap-4 pt-4 border-t border-gray-200 dark:border-dark-border">
                <button
                  onClick={toggle}
                  className="flex items-center gap-2 text-gray-600 dark:text-gray-300"
                >
                  {isDark ? <Sun size={18} /> : <Moon size={18} />}
                  <span>{isDark ? 'Light mode' : 'Dark mode'}</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
```

---

## Phase 4: Page Sections

### 4.1 Hero Section

**src/components/sections/Hero.tsx:**
```typescript
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
              📍 {about.location}
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
```

### 4.2 About Section

**src/components/sections/About.tsx:**
```typescript
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
```

### 4.3 Skills Section

**src/components/sections/Skills.tsx:**
```typescript
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSkills } from '@/api/hooks/useSkills'
import { FadeInSection } from '../animations/FadeInSection'
import type { SkillCategory } from '@/api/types'

const CATEGORY_LABELS: Record<SkillCategory, string> = {
  languages: 'Languages',
  mobile: 'Mobile',
  backend: 'Backend',
  tools: 'Tools',
  methodologies: 'Methods',
  frameworks: 'Frameworks',
  platforms: 'Platforms',
  databases: 'Databases',
}

const PROFICIENCY_STYLES: Record<string, { bg: string; text: string }> = {
  beginner: { bg: 'bg-gray-100 dark:bg-gray-800', text: 'text-gray-600 dark:text-gray-400' },
  intermediate: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-600 dark:text-blue-400' },
  advanced: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-600 dark:text-green-400' },
  expert: { bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-600 dark:text-purple-400' },
}

export function Skills() {
  const { data, isLoading } = useSkills()
  const [activeCategory, setActiveCategory] = useState<SkillCategory | 'all'>('all')

  const categories = data?.groupedByCategory
    ? (Object.keys(data.groupedByCategory) as SkillCategory[])
    : []

  const displayedSkills = activeCategory === 'all'
    ? data?.data || []
    : data?.groupedByCategory?.[activeCategory] || []

  return (
    <section id="skills" className="py-20 md:py-32 bg-gray-50 dark:bg-dark-card/30">
      <div className="container mx-auto px-4">
        <FadeInSection>
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Technical Skills
          </h2>
          <div className="w-20 h-1 bg-primary-600 mx-auto mb-8 rounded-full" />
          <p className="text-gray-600 dark:text-gray-400 text-center mb-12 max-w-2xl mx-auto">
            Technologies and tools I work with
          </p>
        </FadeInSection>

        {/* Category Tabs */}
        <FadeInSection delay={0.1}>
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            <CategoryTab
              active={activeCategory === 'all'}
              onClick={() => setActiveCategory('all')}
            >
              All
            </CategoryTab>
            {categories.map((category) => (
              <CategoryTab
                key={category}
                active={activeCategory === category}
                onClick={() => setActiveCategory(category)}
              >
                {CATEGORY_LABELS[category]}
              </CategoryTab>
            ))}
          </div>
        </FadeInSection>

        {/* Skills Grid */}
        {isLoading ? (
          <SkillsSkeleton />
        ) : (
          <motion.div
            layout
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
          >
            <AnimatePresence mode="popLayout">
              {displayedSkills.map((skill, index) => (
                <motion.div
                  key={skill._id}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ delay: index * 0.03, duration: 0.3 }}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  className="bg-white dark:bg-dark-card rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
                >
                  <h3 className="font-medium text-sm mb-2 truncate" title={skill.name}>
                    {skill.name}
                  </h3>
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${PROFICIENCY_STYLES[skill.proficiency].bg} ${PROFICIENCY_STYLES[skill.proficiency].text}`}
                    >
                      {skill.proficiency}
                    </span>
                    {skill.yearsOfExperience > 0 && (
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {skill.yearsOfExperience}y
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </section>
  )
}

function CategoryTab({
  children,
  active,
  onClick
}: {
  children: React.ReactNode
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
        active
          ? 'bg-primary-600 text-white shadow-md'
          : 'bg-white dark:bg-dark-card text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-border'
      }`}
    >
      {children}
    </button>
  )
}

function SkillsSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} className="bg-white dark:bg-dark-card rounded-xl p-4 animate-pulse">
          <div className="h-4 bg-gray-200 dark:bg-dark-border rounded mb-2" />
          <div className="h-6 w-16 bg-gray-200 dark:bg-dark-border rounded-full" />
        </div>
      ))}
    </div>
  )
}
```

### 4.4 Experience Section

**src/components/sections/Experience.tsx:**
```typescript
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
```

### 4.5 Contact Section

**src/components/sections/Contact.tsx:**
```typescript
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { Send, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import { useContactForm } from '@/api/hooks/useContact'
import { FadeInSection } from '../animations/FadeInSection'

const contactSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters'),
  email: z.string()
    .email('Please enter a valid email'),
  subject: z.string()
    .min(5, 'Subject must be at least 5 characters')
    .max(100, 'Subject must be less than 100 characters'),
  message: z.string()
    .min(10, 'Message must be at least 10 characters')
    .max(1000, 'Message must be less than 1000 characters'),
})

type ContactFormData = z.infer<typeof contactSchema>

export function Contact() {
  const { mutate, isPending, isSuccess, isError, error, reset } = useContactForm()

  const {
    register,
    handleSubmit,
    reset: resetForm,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  })

  const onSubmit = (data: ContactFormData) => {
    mutate(data, {
      onSuccess: () => resetForm(),
    })
  }

  return (
    <section id="contact" className="py-20 md:py-32 bg-gray-50 dark:bg-dark-card/30">
      <div className="container mx-auto px-4">
        <FadeInSection>
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Get In Touch
          </h2>
          <div className="w-20 h-1 bg-primary-600 mx-auto mb-8 rounded-full" />
          <p className="text-gray-600 dark:text-gray-400 text-center mb-12 max-w-2xl mx-auto">
            Have a question or want to work together? Send me a message!
          </p>
        </FadeInSection>

        <FadeInSection delay={0.2}>
          <div className="max-w-xl mx-auto">
            {isSuccess ? (
              <SuccessMessage onReset={() => { reset(); resetForm(); }} />
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2">
                    Name
                  </label>
                  <input
                    id="name"
                    {...register('name')}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-card focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                    placeholder="Your name"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    {...register('email')}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-card focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                    placeholder="you@example.com"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                  )}
                </div>

                {/* Subject */}
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium mb-2">
                    Subject
                  </label>
                  <input
                    id="subject"
                    {...register('subject')}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-card focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                    placeholder="What's this about?"
                  />
                  {errors.subject && (
                    <p className="text-red-500 text-sm mt-1">{errors.subject.message}</p>
                  )}
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    {...register('message')}
                    rows={5}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-card focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all resize-none"
                    placeholder="Your message..."
                  />
                  {errors.message && (
                    <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>
                  )}
                </div>

                {/* Error Message */}
                {isError && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400"
                  >
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <span className="text-sm">
                      {error?.message || 'Failed to send message. Please try again.'}
                    </span>
                  </motion.div>
                )}

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={isPending}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-4 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white font-medium rounded-xl flex items-center justify-center gap-2 transition-colors"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Send Message
                    </>
                  )}
                </motion.button>

                <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                  Your message will be sent directly to my inbox.
                </p>
              </form>
            )}
          </div>
        </FadeInSection>
      </div>
    </section>
  )
}

function SuccessMessage({ onReset }: { onReset: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-12"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', delay: 0.1 }}
      >
        <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
      </motion.div>
      <h3 className="text-2xl font-semibold mb-3">Message Sent!</h3>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Thanks for reaching out. I'll get back to you soon.
      </p>
      <button
        onClick={onReset}
        className="text-primary-600 hover:text-primary-700 font-medium"
      >
        Send another message
      </button>
    </motion.div>
  )
}
```

### 4.6 Footer

**src/components/layout/Footer.tsx:**
```typescript
import { Heart } from 'lucide-react'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="py-8 border-t border-gray-200 dark:border-dark-border">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            © {currentYear} Jeff Koretke. All rights reserved.
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
            Built with <Heart className="w-4 h-4 text-red-500" /> using React
          </p>
        </div>
      </div>
    </footer>
  )
}
```

---

## Phase 5: App Assembly

### 5.1 Main App Component

**src/App.tsx:**
```typescript
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Hero } from '@/components/sections/Hero'
import { About } from '@/components/sections/About'
import { Skills } from '@/components/sections/Skills'
import { Experience } from '@/components/sections/Experience'
import { Contact } from '@/components/sections/Contact'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
})

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">
          <Hero />
          <About />
          <Skills />
          <Experience />
          <Contact />
        </main>
        <Footer />
      </div>
    </QueryClientProvider>
  )
}
```

### 5.2 Entry Point

**src/main.tsx:**
```typescript
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
```

### 5.3 HTML Template

**index.html:**
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="Jeff Koretke - Software Engineer" />
    <meta name="theme-color" content="#2563eb" />

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono&display=swap" rel="stylesheet" />

    <title>Jeff Koretke | Software Engineer</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

---

## Phase 6: Deployment

### 6.1 GitHub Actions Workflow

**.github/workflows/deploy.yml:**
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

### 6.2 Vite Config for GitHub Pages

Add to **vite.config.ts** if using custom domain:
```typescript
export default defineConfig({
  // ... other config
  base: '/', // Use '/' for custom domain, '/repo-name/' for username.github.io/repo-name
})
```

Keep your **CNAME** file with `jeffkoretke.com` in the `public/` folder.

---

## Implementation Timeline

| Phase | Tasks | Est. Time |
|-------|-------|-----------|
| **1** | Project setup, dependencies, config | 1 hour |
| **2** | API types, client, query hooks | 1 hour |
| **3** | Theme hook, Header, animations | 2 hours |
| **4** | All page sections | 4-5 hours |
| **5** | App assembly, testing | 1 hour |
| **6** | Deployment setup | 30 min |

**Total: ~10-12 hours**

---

## Quick Reference: Android → React

| Android | React |
|---------|-------|
| `Activity/Fragment` | Page component |
| `ViewModel` | Custom hook (`useAbout`) |
| `LiveData` | `useState` + `useEffect` |
| `Repository` | API client + Query hooks |
| `RecyclerView.Adapter` | `array.map()` with keys |
| `ViewBinding` | JSX refs |
| `ConstraintLayout` | Flexbox / CSS Grid |
| `MotionLayout` | Framer Motion |
| `SharedPreferences` | `localStorage` |
| `Hilt/Dagger` | React Context / Providers |

---

## Ready to Start?

Review this plan and let me know:
1. Any changes to the design/sections?
2. Ready to start Phase 1?

I'll guide you through each phase step by step!
