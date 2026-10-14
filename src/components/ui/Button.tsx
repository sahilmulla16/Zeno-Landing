import type { AnchorHTMLAttributes } from 'react'

interface Props extends AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: 'solid' | 'ghost'
  size?: 'md' | 'lg'
}

/** White pill button used for every primary CTA — mirrors the reference's solid white pills. */
export function Button({ variant = 'solid', size = 'md', className = '', children, ...rest }: Props) {
  const sizes = size === 'lg' ? 'h-14 px-9 text-[17px]' : 'h-12 px-7 text-[15px]'
  const looks =
    variant === 'solid'
      ? 'bg-white text-black hover:bg-white/85'
      : 'border border-white/15 bg-white/[0.04] text-white hover:bg-white/10'
  return (
    <a
      className={`inline-flex items-center justify-center rounded-full font-semibold tracking-[-0.01em] transition-[background-color,transform] duration-300 active:scale-[0.97] ${sizes} ${looks} ${className}`}
      {...rest}
    >
      {children}
    </a>
  )
}
