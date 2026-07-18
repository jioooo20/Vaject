import { Mail, Download, Send, Globe, Code2 } from 'lucide-react'
import { personalData } from '../data/portfolio'
import SectionHeader from './SectionHeader'
import SectionWrapper from './SectionWrapper'
import Card from './Card'
import Button from './Button'

const contactLinks = [
  {
    icon: Mail,
    label: 'Email',
    value: personalData.email,
    href: `mailto:${personalData.email}`,
  },
  {
    icon: Globe,
    label: 'LinkedIn',
    value: 'Giovano Alkandri',
    href: personalData.linkedin,
  },
  {
    icon: Code2,
    label: 'GitHub',
    value: '@jioooo20',
    href: personalData.github,
  },
]

export default function Contact() {
  return (
    <SectionWrapper>
      <SectionHeader
        icon={Send}
        label="Contact"
        title="Get in Touch"
        subtitle="Have a question, project idea, or just want to say hi? Let's connect."
      />

      {/* Contact Cards */}
      <div className="grid sm:grid-cols-3 gap-4 max-w-3xl mx-auto mb-12">
        {contactLinks.map((link, idx) => (
          <Card
            key={link.label}
            as="a"
            href={link.href}
            target={link.label !== 'Email' ? '_blank' : undefined}
            rel={link.label !== 'Email' ? 'noopener noreferrer' : undefined}
            className="flex flex-col items-center gap-3 group"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: idx * 0.1 }}
            whileHover={{ y: -4 }}
          >
            <div className="p-3 rounded-xl bg-accent-light/50 dark:bg-accent/10 group-hover:bg-accent/20 transition-colors duration-200">
              <link.icon size={22} className="text-accent" />
            </div>
            <div className="text-center">
              <div className="text-sm font-medium text-light-text dark:text-dark-text">
                {link.value}
              </div>
              <div className="text-xs text-light-muted dark:text-dark-muted mt-0.5">
                {link.label}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Download CV */}
      <div className="flex justify-center">
        <Button href={personalData.resumeUrl} icon={Download}>
          Download CV / Resume
        </Button>
      </div>
    </SectionWrapper>
  )
}
