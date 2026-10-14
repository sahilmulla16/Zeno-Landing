import { useId, useRef, useState } from 'react'
import { faqs } from '../../config/content'
import { useReveal } from '../../hooks/useReveal'
import { Plus } from '../ui/Icons'

function Item({ q, a, open, onToggle }: { q: string; a: string; open: boolean; onToggle: () => void }) {
  const id = useId()
  return (
    <div data-faq className="overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.035] transition-colors duration-300 hover:bg-white/[0.05]">
      <h3>
        <button
          type="button"
          id={`${id}-btn`}
          aria-expanded={open}
          aria-controls={`${id}-panel`}
          onClick={onToggle}
          className="flex w-full items-center gap-4 px-6 py-5 text-left text-[17px] font-semibold"
        >
          <Plus size={16} className={`shrink-0 transition-transform duration-500 ease-out ${open ? 'rotate-[135deg]' : ''}`} />
          {q}
        </button>
      </h3>
      <div
        id={`${id}-panel`}
        role="region"
        aria-labelledby={`${id}-btn`}
        className={`grid transition-[grid-template-rows,opacity] duration-500 ease-out ${open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
      >
        <div className="overflow-hidden">
          <p className="max-w-[760px] px-6 pb-6 pl-[3.6rem] text-[16px] leading-relaxed text-white/60">{a}</p>
        </div>
      </div>
    </div>
  )
}

export function Faq() {
  const [open, setOpen] = useState<number | null>(0)
  const head = useRef<HTMLDivElement>(null)
  const list = useRef<HTMLDivElement>(null)
  useReveal(head, { y: 30 })
  useReveal(list, { children: '[data-faq]', y: 34, blur: 8, duration: 0.9 })

  return (
    <section id="faq" className="relative px-5 py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-[1560px] lg:px-[7%]">
        <div ref={head}>
          <h2 className="text-[clamp(2.4rem,5vw,4.4rem)] font-semibold leading-none tracking-[-0.04em]">Questions?</h2>
          <p className="mt-5 max-w-[420px] text-[16px] leading-snug text-white/60">
            Whether you’re new or exploring deeper support, we know you may have questions.
          </p>
        </div>
        <div ref={list} className="mt-12 flex max-w-[1120px] flex-col gap-3">
          {faqs.map((f, i) => (
            <Item key={f.q} q={f.q} a={f.a} open={open === i} onToggle={() => setOpen(open === i ? null : i)} />
          ))}
        </div>
      </div>
    </section>
  )
}
