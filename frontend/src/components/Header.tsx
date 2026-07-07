import { useState } from 'react'
import { Link } from '@tanstack/react-router'

const links = [
  { to: '/', label: 'Home' },
  { to: '/Members', label: 'Members' },
  { to: '/Events', label: 'Events' },
  { to: '/Projects', label: 'Projects' },
] as const

export function Header() {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => setIsOpen(!isOpen)

  return (
    <header className="sticky top-0 border-b border-border bg-background z-50">
      <nav className="mx-auto flex w-full max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8 py-4">
        {/* Logo Section */}
        <Link
          to="/"
          className="flex items-center gap-3 no-underline group"
          onClick={() => setIsOpen(false)}
        >
          <img
            src="/elec-club-logo.svg"
            alt="Electrical Club Logo"
            className="h-10 w-10 rounded-full object-cover transition-transform group-hover:scale-105"
          />
          <span className="flex flex-col leading-tight">
            <span className="font-sans text-[17px] font-bold tracking-tight text-primary transition-colors group-hover:text-primary/80">
              Electrical Club
            </span>
            <span className="text-[13px] font-medium text-muted-foreground">
              Pulchowk Campus
            </span>
          </span>
        </Link>

        {/* Hamburger Menu Button (Mobile Only) */}
        <button
          onClick={toggleMenu}
          type="button"
          className="inline-flex items-center justify-center rounded-md p-2 text-foreground hover:bg-secondary hover:text-primary focus:outline-none md:hidden"
          aria-controls="mobile-menu"
          aria-expanded={isOpen}
        >
          <span className="sr-only">Open main menu</span>
          {isOpen ? (
            // Close Icon
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            // Hamburger Icon
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>

        {/* Desktop Navigation */}
        <ul className="m-0 hidden list-none items-center gap-2 p-0 md:flex">
          {links.map((link) => (
            <li key={link.to}>
              <Link
                to={link.to as any}
                activeOptions={{ exact: link.to === '/' }}
                className="inline-flex items-center rounded-md border-2 border-transparent px-3 py-1.5 text-[15px] font-medium text-foreground no-underline transition-colors hover:bg-secondary hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
                activeProps={{
                  className:
                    'inline-flex items-center rounded-md border-2 border-primary/30 bg-primary/10 px-3 py-1.5 text-[15px] font-medium text-primary no-underline transition-colors',
                }}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Mobile Navigation Drawer */}
      <div
        id="mobile-menu"
        className={`absolute left-0 right-0 top-full border-b border-border bg-background px-6 py-4 shadow-md transition-all duration-200 ease-in-out md:hidden ${
          isOpen ? 'block opacity-100' : 'hidden opacity-0'
        }`}
      >
        <ul className="m-0 flex list-none flex-col gap-3 p-0">
          {links.map((link) => (
            <li key={link.to} className="w-full">
              <Link
                to={link.to as any}
                activeOptions={{ exact: link.to === '/' }}
                onClick={() => setIsOpen(false)} // Close menu on navigation
                className="flex w-full items-center rounded-md border-2 border-transparent px-4 py-2.5 text-[15px] font-medium text-foreground no-underline transition-colors hover:bg-secondary hover:text-primary"
                activeProps={{
                  className:
                    'flex w-full items-center rounded-md border-2 border-primary/30 bg-primary/10 px-4 py-2.5 text-[15px] font-medium text-primary no-underline transition-colors',
                }}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </header>
  )
}