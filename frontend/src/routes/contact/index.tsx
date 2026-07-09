import { createFileRoute, useLoaderData } from '@tanstack/react-router'
import { useState } from 'react'
import {
  FaGithub,
  FaTwitter,
  FaLinkedin,
  FaGlobe,
  FaFacebook,
  FaInstagram,
  FaYoutube,
  FaTiktok,
  FaPhone,
  FaLocationDot,
  FaCheck,
  FaTriangleExclamation,
} from 'react-icons/fa6'
import type { IconType } from 'react-icons'

export const Route = createFileRoute('/contact/')({
  component: ContactPage,
})

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

function ContactPage() {
  const baseUrl = import.meta.env.VITE_STRAPI_URL
  const { details } = useLoaderData({ from: '__root__' })

  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'submitting' | 'sent' | 'error'>('idle')

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

 async function handleSubmit(e: React.FormEvent) {
  e.preventDefault()
  setStatus('submitting')

  try {
    const res = await fetch(`${baseUrl}/contact-messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: form }),
    })
    console.log(res)

    if (!res.ok) {
      throw new Error(`Request failed with status ${res.status}`)
    }

    setStatus('sent')
    setForm({ name: '', email: '', message: '' })
  } catch (err) {
    console.error('Failed to submit contact message:', err)
    setStatus('error')
  }
}

  const infoItems = [
    details?.phoneNum && {
      icon: FaPhone,
      label: 'Phone',
      value: String(details.phoneNum),
      href: `tel:${details.phoneNum}`,
    },
    {
      icon: FaLocationDot,
      label: 'Location',
      value: 'Department of Electrical Engineering, Pulchowk Campus, Lalitpur',
      href: undefined,
    },
  ].filter(Boolean) as { icon: IconType; label: string; value: string; href?: string }[]

  return (
    <div className="bg-background text-foreground">
      {/* Hero */}
      <section className="border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <p className="text-xs font-bold tracking-[0.14em] uppercase mb-4 text-primary">
            Get in touch
          </p>Frequently Asked Qu
          <h1 className="text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-[1.08] max-w-2xl">
            Let&rsquo;s talk electrical.
          </h1>
          <p className="mt-5 max-w-xl text-base sm:text-lg leading-relaxed opacity-75">
            Questions about membership, a project you want to showcase, or a
            sponsorship idea, send it over and the team will get back to you.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Info column with connector rail */}
          <div className="lg:col-span-4">
            <div className="relative pl-9">
              {/* connector rail */}
              <div
                className="absolute left-[7px] top-2 bottom-2 w-px bg-border"
                aria-hidden="true"
              />

              <div className="flex flex-col gap-8">
                {infoItems.map((item) => {
                  
                  return (
                    <div key={item.label} className="relative">
                      <span
                        className="absolute -left-9 top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-background border-2 border-primary"
                        aria-hidden="true"
                      />
                      <h3 className="text-xs font-bold uppercase tracking-wide opacity-60 mb-1.5">
                        {item.label}
                      </h3>
                      {item.href ? (
                        <a
                          href={item.href}
                          className="text-[15px] font-medium no-underline text-foreground transition-opacity hover:opacity-70"
                        >
                          {item.value}
                        </a>
                      ) : (
                        <p className="text-[15px] leading-relaxed opacity-85 m-0">
                          {item.value}
                        </p>
                      )}
                    </div>
                  )
                })}

              
                  <div className="relative">
                    <span
                      className="absolute -left-9 top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-background border-2 border-primary"
                      aria-hidden="true"
                    />
                    <h3 className="text-xs font-bold uppercase tracking-wide opacity-60 mb-3">
                      Follow the club
                    </h3>
                    <div className="flex flex-wrap gap-2.5">
                      {details?.Electrical_club_socials.map((social) => {
                        const Icon = getPlatformIcon(social.platform)
                        return (
                          <a
                            key={social.id}
                            href={social.url}
                            target="_blank"
                            rel="noreferrer"
                            aria-label={social.platform}
                            className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:border-primary hover:text-primary"
                          >
                            <Icon size={14} />
                          </a>
                        )
                      })}
                    </div>
                  </div>
                
              </div>
            </div>
          </div>

          {/* Form column */}
          <div className="lg:col-span-8">
            <div className="rounded-2xl p-6 sm:p-10 border border-border">
              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="name" className="text-sm font-semibold">
                      Name
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Your name"
                      className="rounded-lg px-4 py-3 text-sm outline-none transition-colors bg-transparent border border-border focus:border-primary"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="email" className="text-sm font-semibold">
                      Email
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={form.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      className="rounded-lg px-4 py-3 text-sm outline-none transition-colors bg-transparent border border-border focus:border-primary"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="message" className="text-sm font-semibold">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={6}
                    value={form.message}
                    onChange={handleChange}
                    placeholder="What would you like to reach out about?"
                    className="rounded-lg px-4 py-3 text-sm outline-none transition-colors resize-none bg-transparent border border-border focus:border-primary"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-4 pt-1">
                  <button
                    type="submit"
                    disabled={status === 'submitting'}
                    className="rounded-lg px-6 py-3 text-sm font-semibold text-primary-foreground bg-primary hover:opacity-90 transition-all disabled:opacity-60 active:scale-[0.98]"
                  >
                    {status === 'submitting' ? 'Sending…' : 'Send Message'}
                  </button>

                  {status === 'sent' && (
                    <span className="flex items-center gap-2 text-sm font-medium text-emerald-600">
                      <FaCheck size={13} />
                      Message sent — thank you!
                    </span>
                  )}
                  {status === 'error' && (
                    <span className="flex items-center gap-2 text-sm font-medium text-destructive">
                      <FaTriangleExclamation size={13} />
                      Something went wrong. Please try again.
                    </span>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}