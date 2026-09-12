import { useEffect, useState } from 'react'
import Hero from './components/Hero'
import About from './components/About'
import Skills from './components/Skills'
import Experience from './components/Experience'
import Projects from './components/Projects'
import Contact from './components/Contact'
import Footer from './components/Footer'
import BackToTop from './components/BackToTop'
import Navbar from './components/Navbar'
import CursorCompanion from './components/CursorCompanion'
import { useSmoothScroll } from './hooks/useSmoothScroll'

const SECTIONS = ['home', 'about', 'skills', 'experience', 'projects', 'contact']

function App() {
  const [activeSection, setActiveSection] = useState('home')
  useSmoothScroll()

  // Active-section indicator
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id)
        })
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 }
    )
    SECTIONS.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  return (
    <div className="min-h-screen bg-paper text-ink dark:bg-paper-dark dark:text-ink-dark">
      {/* Skip link — first focusable element */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-accent focus:text-black focus:border-[3px] focus:border-ink dark:focus:border-ink-dark focus:font-bold focus:uppercase focus:outline-none"
      >
        Skip to main content
      </a>

      <Navbar activeSection={activeSection} />
      <CursorCompanion />

      <main id="main-content">
        <section id="home"><Hero /></section>
        <section id="about"><About /></section>
        <section id="skills"><Skills /></section>
        <section id="experience"><Experience /></section>
        <section id="projects"><Projects /></section>
        <section id="contact"><Contact /></section>
      </main>

      <Footer />
      <BackToTop />
    </div>
  )
}

export default App