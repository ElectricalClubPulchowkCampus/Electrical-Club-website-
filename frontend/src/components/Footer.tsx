import { Link } from '@tanstack/react-router'

const footerLinks = [
  {
    title: 'Navigation',
    links: [
      { to: '/', label: 'Home' },
      { to: '/Members', label: 'Members' },
      { to: '/Events', label: 'Events' },
    ],
  },
  {
    title: 'Explore',
    links: [
      { to: '/Gallery', label: 'Gallery' },
      { to: '/Blog', label: 'Blog' },
    ],
  },
] as const

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-[var(--border)] bg-[var(--bg)]">
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
                <span className="font-sans text-[17px] font-bold tracking-tight text-[var(--accent)]">
                  Electrical Club
                </span>
                <span className="text-[13px] font-medium text-[var(--text)]">
                  Pulchowk Campus
                </span>
              </span>
            </Link>
            <p className="m-0 mt-2 text-[14px] leading-relaxed text-[var(--text)] opacity-80">
              Empowering students through innovation, workshops, and technical excellence in electrical engineering.
            </p>
          </div>

          {/* Links Columns */}
          <div className="flex gap-16 sm:gap-24">
            {footerLinks.map((group) => (
              <div key={group.title} className="flex flex-col gap-3">
                <h3 className="m-0 text-[14px] font-bold uppercase tracking-wider text-[var(--text-h)]">
                  {group.title}
                </h3>
                <ul className="m-0 flex list-none flex-col gap-2 p-0">
                  {group.links.map((link) => (
                    <li key={link.to}>
                      <Link
                        to={link.to as any}
                        className="text-[14px] font-medium text-[var(--text)] no-underline transition-colors hover:text-[var(--accent)]"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Divider Rule */}
        <hr className="my-8 border-0 border-t border-[var(--border)]" />

        {/* Bottom Section */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="m-0 text-[13px] text-[var(--text)] opacity-70">
            &copy; {currentYear} Electrical Club, Pulchowk Campus. All rights reserved.
          </p>

          {/* Optional Social / Utility Links */}
          <div className="flex gap-4 text-[13px] text-[var(--text)] opacity-70">
            <a href="https://github.com" target="_blank" rel="noreferrer" className="no-underline hover:text-[var(--accent)]">GitHub</a>
            <span>&middot;</span>
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="no-underline hover:text-[var(--accent)]">Facebook</a>
          </div>
        </div>
      </div>
    </footer>
  )
}