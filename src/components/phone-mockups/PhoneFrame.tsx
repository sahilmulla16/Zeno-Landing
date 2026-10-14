export interface ScreenShot {
  src: string
  alt: string
}

interface Props {
  screens: ScreenShot[]
  /** index of the screen currently shown; others are cross-faded out */
  active?: number
  /** any CSS width, e.g. `min(360px, 38vh)` */
  width?: string
  glow?: boolean
  priority?: boolean
  className?: string
}

/**
 * Titanium-rim phone built from CSS. Sizes in `cqw` so every radius scales with the width.
 * Screens are stacked and cross-faded with opacity only (cheap, no layout work).
 */
export function PhoneFrame({ screens, active = 0, width = '320px', glow = true, priority = false, className = '' }: Props) {
  return (
    <div className={`@container relative shrink-0 ${className}`} style={{ width }}>
      {glow && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-[28%] -z-10 rounded-full bg-[radial-gradient(closest-side,rgb(124_58_237/0.34),rgb(236_72_153/0.10)_55%,transparent_75%)]"
        />
      )}
      <div
        className="relative aspect-[0.462] w-full rounded-[14cqw] p-[1.1cqw] shadow-[0_40px_120px_-30px_rgba(0,0,0,0.9)]"
        style={{
          background:
            'linear-gradient(150deg,#8e8ca0 0%,#2a2a33 18%,#0d0d12 45%,#1b1b22 70%,#7d7b8f 100%)',
        }}
      >
        {/* side buttons */}
        <span aria-hidden className="absolute -left-[0.9cqw] top-[20%] h-[6%] w-[1.2cqw] rounded-l bg-[#34343e]" />
        <span aria-hidden className="absolute -left-[0.9cqw] top-[29%] h-[10%] w-[1.2cqw] rounded-l bg-[#34343e]" />
        <span aria-hidden className="absolute -right-[0.9cqw] top-[27%] h-[14%] w-[1.2cqw] rounded-r bg-[#34343e]" />
        <div className="relative size-full overflow-hidden rounded-[12.9cqw] bg-black p-[2.2cqw]">
          <div className="relative size-full overflow-hidden rounded-[10.7cqw] bg-[#f4f6fb]">
            {screens.map((s, i) => (
              <img
                key={s.src}
                src={s.src}
                alt={i === active ? s.alt : ''}
                aria-hidden={i === active ? undefined : true}
                width={720}
                height={1560}
                loading={priority ? 'eager' : 'lazy'}
                decoding="async"
                draggable={false}
                className="absolute inset-0 size-full scale-[1.015] object-cover transition-opacity duration-700 ease-out"
                style={{ opacity: i === active ? 1 : 0 }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export const SCREENS = {
  home: { src: '/img/screen-home.webp', alt: 'Zeno home screen with wallet card and latest transactions' },
  budget: { src: '/img/screen-budget.webp', alt: 'Zeno budgets screen showing a spending donut chart for October' },
  ai: { src: '/img/screen-ai.webp', alt: 'Zeno AI assistant ready to answer questions about your money' },
} satisfies Record<string, ScreenShot>
