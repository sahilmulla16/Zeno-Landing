import { Link, useRouter } from '../../lib/router'

export function Logo({ className = '', href }: { className?: string; href?: string }) {
  const { path } = useRouter()
  const targetHref = href || (path === '/' ? '#top' : '/')
  return (
    <Link href={targetHref} className={`flex items-center gap-2.5 ${className}`} aria-label="Zeno — home">
      <img src="img/mascot.webp" alt="" width={34} height={34} className="size-[34px] object-contain" />
      <span className="text-[26px] font-extrabold tracking-[0.04em] text-white/70 lowercase leading-none">
        zeno
      </span>
    </Link>
  )
}
