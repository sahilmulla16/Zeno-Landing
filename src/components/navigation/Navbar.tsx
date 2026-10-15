import { useEffect, useState } from 'react'
import { navLinks } from '../../config/content'
import { Logo } from '../brand/Logo'
import { Button } from '../ui/Button'
import { Close, Menu } from '../ui/Icons'

export function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState('#top')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Highlight the link of the section nearest the top of the viewport.
  useEffect(() => {
    const ids = navLinks.map((l) => l.href.slice(1))
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(`#${e.target.id}`)
        })
      },
      { rootMargin: '-35% 0px -55% 0px' },
    )
    ids.forEach((id) => {
      const el = document.getElementById(id)
      if (el) io.observe(el)
    })
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    const onResize = () => {
      if (window.innerWidth >= 768) setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('resize', onResize)
    }
  }, [open])

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-3 pt-3 md:px-6 md:pt-4">
      <nav
        aria-label="Primary"
        className={`relative flex h-[64px] w-full max-w-[1640px] items-center justify-between rounded-[24px] pl-5 pr-2 transition-[background-color,box-shadow,backdrop-filter] duration-500 md:pl-6 ${
          scrolled || open
            ? 'bg-[#0d0d10]/80 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.8)] backdrop-blur-xl'
            : 'bg-white/[0.035] backdrop-blur-md'
        }`}
      >
        <Logo />

        <ul className="hidden items-center gap-5 md:flex lg:gap-8">
          {navLinks.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                aria-current={active === l.href ? 'true' : undefined}
                className={`text-[14px] font-semibold transition-colors duration-300 hover:text-white lg:text-[15px] ${
                  active === l.href ? 'text-white' : 'text-white/70'
                }`}
              >
                {l.label}
              </a>
            </li>
          ))}
          <li>
            <Button href="#waitlist" className="!h-[48px] !px-5 text-[15px] lg:!h-[54px] lg:!px-8 lg:text-[17px]">
              Join Waitlist
            </Button>
          </li>
        </ul>

        <button
          type="button"
          className="mr-1 grid size-11 place-items-center rounded-full text-white md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <Close /> : <Menu />}
        </button>

        <div
          id="mobile-menu"
          hidden={!open}
          className="absolute inset-x-0 top-[72px] rounded-[24px] border border-white/10 bg-[#0d0d10]/95 p-4 backdrop-blur-xl md:hidden"
        >
          <ul className="flex flex-col">
            {navLinks.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-xl px-4 py-3 text-base font-semibold text-white/80 hover:bg-white/5"
                >
                  {l.label}
                </a>
              </li>
            ))}
            <li className="pt-2">
              <Button href="#waitlist" onClick={() => setOpen(false)} className="w-full">
                Join Waitlist
              </Button>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  )
}
