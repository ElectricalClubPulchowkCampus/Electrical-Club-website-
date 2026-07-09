import { Link } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import {
  FaGithub,
  FaTwitter,
  FaLinkedin,
  FaGlobe,
  FaFacebook,
  FaInstagram,
  FaYoutube,
  FaTiktok,
  FaLightbulb,
  FaXmark,
} from 'react-icons/fa6'
import type { IconType } from 'react-icons'
import type { SocialLink } from '../types/clubSetting'

const footerLinks = [
  {
    title: 'Navigation',
    links: [
      { to: '/', label: 'Home' },
      { to: '/members', label: 'Members' },
      { to: '/events', label: 'Events' },
    ],
  },
] as const

const platformIcons: Record<string, IconType> = {
  github: FaGithub,
  twitter: FaTwitter,
  x: FaTwitter,
  linkedin: FaLinkedin,
  website: FaGlobe,
  facebook: FaFacebook,
  instagram: FaInstagram,
  youtube: FaYoutube,
  tiktok: FaTiktok,
}

function getPlatformIcon(platform: string) {
  return platformIcons[platform.toLowerCase()] ?? FaGlobe
}

interface FooterProps {
  socials?: SocialLink[]
}

function SuggestionModal({ onClose }: { onClose: () => void }) {
  const [message, setMessage] = useState('')
  const [name, setName] = useState('')
  const [status, setStatus] = useState<'idle' | 'submitting' | 'sent' | 'error'>('idle')

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

 const baseUrl = import.meta.env.VITE_STRAPI_URL

async function handleSubmit(e: React.FormEvent) {
  e.preventDefault()
  setStatus('submitting')

  try {
    const res = await fetch(`${baseUrl}/suggestions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: { name, message } }),
    })

    if (!res.ok) {
      throw new Error(`Request failed with status ${res.status}`)
    }

    setStatus('sent')
    setMessage('')
    setName('')
  } catch (err) {
    console.error('Failed to submit suggestion:', err)
    setStatus('error')
  }
}

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="suggestion-modal-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-foreground/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal card */}
      <div className="relative w-full max-w-md rounded-2xl border border-border bg-background p-6 sm:p-8 shadow-xl">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-foreground opacity-60 transition-opacity hover:opacity-100"
        >
          <FaXmark size={16} />
        </button>

        <div className="flex items-center gap-2.5 mb-1.5">
          <FaLightbulb className="text-primary" size={18} />
          <h2 id="suggestion-modal-title" className="m-0 text-xl font-bold text-foreground">
            Suggestion Box
          </h2>
        </div>
        <p className="mt-0 mb-5 text-sm leading-relaxed text-foreground opacity-70">
          Got an idea to make the club better? Tell us &mdash; anonymously if you like.
        </p>

        {status === 'sent' ? (
          <div className="py-6 text-center">
            <p className="text-sm font-medium text-foreground">
              Thanks for the suggestion &mdash; we&rsquo;ll take a look!
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-4 rounded-lg border border-border px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-primary hover:text-primary"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="suggestion-name" className="text-sm font-semibold text-foreground">
                Name <span className="font-normal opacity-60">(optional)</span>
              </label>
              <input
                id="suggestion-name"
                name="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Anonymous"
                className="rounded-lg border border-border bg-transparent px-4 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-primary"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="suggestion-message" className="text-sm font-semibold text-foreground">
                Suggestion
              </label>
              <textarea
                id="suggestion-message"
                name="message"
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="What should we improve or try next?"
                className="resize-none rounded-lg border border-border bg-transparent px-4 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-primary"
              />
            </div>

            <div className="flex items-center gap-3 pt-1">
              <button
                type="submit"
                disabled={status === 'submitting'}
                className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90 disabled:opacity-60 active:scale-[0.98]"
              >
                {status === 'submitting' ? 'Sending…' : 'Send Suggestion'}
              </button>
              {status === 'error' && (
                <span className="text-sm font-medium text-destructive">
                  Something went wrong. Try again.
                </span>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

export function Footer({ socials = [] }: FooterProps) {
  const currentYear = new Date().getFullYear()
  const [showSuggestionModal, setShowSuggestionModal] = useState(false)

  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-[1126px] px-6 py-10 md:py-16">
        {/* Top Section */}
        <div className="flex flex-col gap-10 md:flex-row md:justify-between md:gap-6">
          {/* Brand/Logo Column */}
          <div className="flex flex-col items-start gap-3 max-w-xs">
            <Link to="/" className="flex items-center gap-3 no-underline">
              <img
                src="/elec-club-logo.svg"
                alt="Electrical Club Logo"
                className="h-10 w-10 rounded-full object-cover"
              />
              <span className="flex flex-col leading-tight">
                <span className="font-sans text-[17px] font-bold tracking-tight text-primary">
                  Electrical Club
                </span>
                <span className="text-[13px] font-medium text-foreground">
                  Pulchowk Campus
                </span>
              </span>
            </Link>
            <p className="m-0 mt-2 text-[14px] leading-relaxed text-foreground opacity-80">
              Empowering students through innovation, workshops, and technical excellence in electrical engineering.
            </p>

            <button
              type="button"
              onClick={() => setShowSuggestionModal(true)}
              className="mt-2 inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-[13px] font-semibold text-foreground transition-colors hover:border-primary hover:text-primary"
            >
              <FaLightbulb size={13} />
              Suggestion Box
            </button>
          </div>

          {/* Links Columns */}
          <div className="flex gap-16 sm:gap-24">
            {footerLinks.map((group) => (
              <div key={group.title} className="flex flex-col gap-3">
                <h3 className="m-0 text-[14px] font-bold uppercase tracking-wider text-foreground">
                  {group.title}
                </h3>
                <ul className="m-0 flex list-none flex-col gap-2 p-0">
                  {group.links.map((link) => (
                    <li key={link.to}>
                      <Link
                        to={link.to}
                        className="text-[14px] font-medium text-foreground no-underline transition-colors hover:text-primary"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Connect / Socials Column */}
            {socials.length > 0 && (
              <div className="flex flex-col gap-3">
                <h3 className="m-0 text-[14px] font-bold uppercase tracking-wider text-foreground">
                  Connect
                </h3>
                <ul className="m-0 flex list-none flex-col gap-2 p-0">
                  {socials.map((social) => {
                    const Icon = getPlatformIcon(social.platform)
                    return (
                      <li key={social.id}>
                        <a
                          href={social.url}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-2 text-[14px] font-medium text-foreground no-underline capitalize transition-colors hover:text-primary"
                        >
                          <Icon size={15} />
                          {social.platform}
                        </a>
                      </li>
                    )
                  })}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Divider Rule */}
        <hr className="my-8 border-0 border-t border-border" />

        {/* Bottom Section */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="m-0 text-[13px] text-foreground opacity-70">
            &copy; {currentYear} Electrical Club, Pulchowk Campus. All rights reserved.
          </p>
        </div>
      </div>

      {showSuggestionModal && (
        <SuggestionModal onClose={() => setShowSuggestionModal(false)} />
      )}
    </footer>
  )
}