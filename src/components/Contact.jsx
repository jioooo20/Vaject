import { useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { Send, Download, Mail } from 'lucide-react'
import { personalData } from '../data/portfolio'
import Page from './Page'
import SectionHeading from './SectionHeading'
import Button from './Button'
import Envelope from './Envelope'

const CONTACT_ENDPOINT = import.meta.env.VITE_CONTACT_ENDPOINT || ''
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const EMPTY = { name: '', email: '', message: '' }

export default function Contact() {
  const [formState, setFormState] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | submitting | success | error
  const [statusMessage, setStatusMessage] = useState('')
  const reduced = useReducedMotion()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormState((s) => ({ ...s, [name]: value }))
    setErrors((prev) => (prev[name] ? { ...prev, [name]: undefined } : prev))
  }

  const validate = () => {
    const next = {}
    if (!formState.name.trim()) next.name = 'Please enter your name.'
    if (!formState.email.trim()) next.email = 'Please enter your email.'
    else if (!EMAIL_RE.test(formState.email.trim())) next.email = 'Please enter a valid email address.'
    if (!formState.message.trim()) next.message = 'Please enter a message.'
    return next
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (status === 'submitting') return

    const nextErrors = validate()
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) {
      setStatus('error')
      setStatusMessage('Please fix the highlighted fields and try again.')
      document.getElementById('contact-error-summary')?.focus()
      return
    }

    // No endpoint configured → fall back to a mailto: hand-off (no auto-delivery).
    if (!CONTACT_ENDPOINT) {
      const subject = encodeURIComponent(`Portfolio contact from ${formState.name}`)
      const body = encodeURIComponent(`${formState.message}\n\n— ${formState.name} (${formState.email})`)
      window.location.href = `mailto:${personalData.email}?subject=${subject}&body=${body}`
      setStatus('success')
      setStatusMessage('Opening your email client — this form does not send automatically.')
      return
    }

    setStatus('submitting')
    setStatusMessage('Sending your message…')
    try {
      const res = await fetch(CONTACT_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          name: formState.name.trim(),
          email: formState.email.trim(),
          message: formState.message.trim(),
        }),
      })
      if (!res.ok) throw new Error(`Request failed (${res.status})`)
      setStatus('success')
      setStatusMessage('Message sent — I will get back to you soon.')
      setFormState(EMPTY)
    } catch {
      setStatus('error')
      setStatusMessage('Something went wrong. Please email me directly instead.')
    }
  }

  const submitting = status === 'submitting'
  const fieldClass = (name) =>
    `w-full px-4 py-3 rounded-none bg-paper dark:bg-paper-dark border-[3px] font-body font-medium text-ink dark:text-ink-dark placeholder:text-muted/70 dark:placeholder:text-muted-dark/70 focus-ring transition-colors ${
      errors[name]
        ? 'border-danger dark:border-danger-dark'
        : 'border-ink dark:border-ink-dark'
    }`

  const labelClass = 'block font-mono font-bold text-[var(--text-micro)] uppercase tracking-[0.14em] text-ink dark:text-ink-dark mb-1.5'

  return (
    <Page>
      <SectionHeading numeral="06" label="Contact" title="Say hello" />

      <Envelope />

      {/* Form */}
      <div className="mt-14 max-w-lg mx-auto">
        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          {/* Accessible error summary */}
          {Object.keys(errors).length > 0 && (
            <div
              id="contact-error-summary"
              role="alert"
              tabIndex={-1}
              className="rounded-none border-[3px] border-danger dark:border-danger-dark bg-danger/10 p-4 focus-ring"
            >
              <p className="font-body font-bold text-[var(--text-body-sm)] text-danger dark:text-danger-dark">
                There {Object.keys(errors).length === 1 ? 'is 1 problem' : `are ${Object.keys(errors).length} problems`} with your submission:
              </p>
              <ul className="mt-2 list-disc pl-5 font-body font-medium text-[var(--text-body-sm)] text-danger dark:text-danger-dark">
                {Object.entries(errors).map(([field, msg]) =>
                  msg ? <li key={field}>{msg}</li> : null
                )}
              </ul>
            </div>
          )}

          <div>
            <label htmlFor="contact-name" className={labelClass}>
              Name
            </label>
            <input
              id="contact-name"
              name="name"
              type="text"
              required
              value={formState.name}
              onChange={handleChange}
              aria-invalid={errors.name ? 'true' : undefined}
              aria-describedby={errors.name ? 'contact-error-summary' : undefined}
              className={fieldClass('name')}
              placeholder="Your name"
            />
          </div>
          <div>
            <label htmlFor="contact-email" className={labelClass}>
              Email
            </label>
            <input
              id="contact-email"
              name="email"
              type="email"
              required
              value={formState.email}
              onChange={handleChange}
              aria-invalid={errors.email ? 'true' : undefined}
              aria-describedby={errors.email ? 'contact-error-summary' : undefined}
              className={fieldClass('email')}
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label htmlFor="contact-message" className={labelClass}>
              Message
            </label>
            <textarea
              id="contact-message"
              name="message"
              rows={4}
              required
              value={formState.message}
              onChange={handleChange}
              aria-invalid={errors.message ? 'true' : undefined}
              aria-describedby={errors.message ? 'contact-error-summary' : undefined}
              className={`${fieldClass('message')} resize-none`}
              placeholder="Say hello..."
            />
          </div>

          <motion.div
            animate={status === 'success' && !reduced ? { scale: [1, 0.96, 1] } : { scale: 1 }}
            transition={{ duration: 0.32, ease: [0.34, 1.56, 0.64, 1] }}
          >
            <Button type="submit" icon={Send} loading={submitting} disabled={submitting}>
              {submitting ? 'Sending…' : status === 'success' ? 'Thanks!' : 'Send Message'}
            </Button>
          </motion.div>

          {/* Status messages announced to assistive tech */}
          <p
            role="status"
            aria-live="polite"
            className={`font-body font-medium text-[var(--text-body-sm)] min-h-[1.25rem] ${
              status === 'error'
                ? 'text-danger dark:text-danger-dark'
                : 'text-muted dark:text-muted-dark'
            }`}
          >
            {statusMessage}
          </p>

          {/* Fallback notice when no endpoint is configured */}
          {!CONTACT_ENDPOINT && (
            <p className="flex items-start gap-2 font-body font-medium text-[var(--text-body-sm)] text-muted dark:text-muted-dark">
              <Mail size={15} strokeWidth={2.5} className="mt-0.5 shrink-0" aria-hidden="true" />
              <span>
                This form opens your email client — it does not send automatically. Or email{' '}
                <a
                  href={`mailto:${personalData.email}`}
                  className="font-bold text-ink dark:text-ink-dark underline decoration-accent decoration-[3px] underline-offset-4"
                >
                  {personalData.email}
                </a>
                .
              </span>
            </p>
          )}
        </form>
      </div>

      <div className="flex justify-center mt-10">
        <Button href={personalData.resumeUrl} variant="outline" icon={Download}>
          Download CV / Resume
        </Button>
      </div>
    </Page>
  )
}