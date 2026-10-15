import type { ReactNode, SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement> & { size?: number }

function Base({ size = 20, children, ...rest }: IconProps & { children: ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...rest}
    >
      {children}
    </svg>
  )
}

export const ArrowRight = (p: IconProps) => (
  <Base {...p}>
    <path d="M5 12h14M12 5l7 7-7 7" />
  </Base>
)
export const ChevronLeft = (p: IconProps) => (
  <Base {...p}>
    <path d="m15 18-6-6 6-6" />
  </Base>
)
export const ChevronRight = (p: IconProps) => (
  <Base {...p}>
    <path d="m9 18 6-6-6-6" />
  </Base>
)
export const Plus = (p: IconProps) => (
  <Base {...p}>
    <path d="M5 12h14M12 5v14" />
  </Base>
)
export const Menu = (p: IconProps) => (
  <Base {...p}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </Base>
)
export const Close = (p: IconProps) => (
  <Base {...p}>
    <path d="M6 6l12 12M18 6 6 18" />
  </Base>
)
export const Mic = (p: IconProps) => (
  <Base {...p}>
    <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3ZM19 10v2a7 7 0 0 1-14 0v-2M12 19v3" />
  </Base>
)
export const Cup = (p: IconProps) => (
  <Base {...p}>
    <path d="M17 8h1a4 4 0 1 1 0 8h-1M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4ZM6 2v2M10 2v2M14 2v2" />
  </Base>
)
export const Car = (p: IconProps) => (
  <Base {...p}>
    <path d="M5 16H3v-4l2-5h12l3 5h1v4h-2M7 16h8" />
    <circle cx="7.5" cy="17" r="1.8" />
    <circle cx="16.5" cy="17" r="1.8" />
  </Base>
)
export const Heart = (p: IconProps) => (
  <Base {...p}>
    <path d="M19 14c1.5-1.5 3-3.2 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.8 0-3 .5-4.5 2-1.5-1.5-2.7-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4 3 5.5l7 7Z" />
  </Base>
)
export const Basket = (p: IconProps) => (
  <Base {...p}>
    <path d="M5 9h14l-1.5 10a2 2 0 0 1-2 1.7h-7a2 2 0 0 1-2-1.7L5 9ZM9 9l3-5 3 5" />
  </Base>
)
export const Moon = (p: IconProps) => (
  <Base {...p}>
    <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
  </Base>
)
export const Sparkle = (p: IconProps) => (
  <Base {...p}>
    <path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3ZM19 15l.7 1.8 1.8.7-1.8.7L19 20l-.7-1.8-1.8-.7 1.8-.7L19 15Z" />
  </Base>
)
export const Chart = (p: IconProps) => (
  <Base {...p}>
    <path d="M5 20V11M12 20V4M19 20v-6" />
  </Base>
)
export const Wallet = (p: IconProps) => (
  <Base {...p}>
    <path d="M3 7a2 2 0 0 1 2-2h13v4M3 7v10a2 2 0 0 0 2 2h14a1 1 0 0 0 1-1v-8a1 1 0 0 0-1-1H5a2 2 0 0 1-2-2ZM16 14h.01" />
  </Base>
)
export const Zap = (p: IconProps) => (
  <Base {...p}>
    <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8Z" />
  </Base>
)
export const Target = (p: IconProps) => (
  <Base {...p}>
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="5" />
    <circle cx="12" cy="12" r="1" />
  </Base>
)
export const Instagram = (p: IconProps) => (
  <Base {...p}>
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <path d="M17.5 6.5h.01" />
  </Base>
)
export const XLogo = ({ size = 20, ...rest }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...rest}>
    <path d="M18.2 3h3.1l-6.8 7.7L22.5 21h-6.2l-4.9-6.3L5.8 21H2.7l7.2-8.3L2 3h6.4l4.4 5.8L18.2 3Zm-1.1 16.2h1.7L7.4 4.7H5.6l11.5 14.5Z" />
  </svg>
)
export const Threads = ({ size = 20, ...rest }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...rest}>
    <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098c1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015c-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 9.09 3.589 12c.027 3.086.718 5.496 2.057 7.164c1.43 1.783 3.631 2.698 6.25 2.717c2.623-.02 4.358-.631 5.8-2.045c1.647-1.613 1.618-3.593 1.09-4.798c-.31-.71-.873-1.3-1.634-1.75c-.192 1.352-.622 2.446-1.284 3.272c-.886 1.102-2.14 1.704-3.73 1.79c-1.202.065-2.361-.218-3.259-.801c-1.063-.695-1.688-1.788-1.758-3.072c-.074-1.35.45-2.618 1.474-3.567c1.156-1.065 2.94-1.603 5.309-1.601c.54 0 1.077.03 1.607.091c-.344-1.921-1.428-2.955-3.418-2.973c-1.678-.016-2.969.593-3.834 1.808l-1.859-.877c1.233-1.745 3.141-2.662 5.69-2.642c3.089.027 5.097 1.666 5.807 4.743c.484 2.096.536 4.417.153 6.903c-.63 4.093-3.208 6.552-7.669 6.586m-.762-10.42c-1.916-.002-3.141.385-3.743.945c-.443.409-.691.996-.655 1.654c.038.718.423 1.351 1.082 1.781c.642.42 1.488.61 2.378.536c1.072-.089 1.899-.544 2.46-1.352c.441-.635.733-1.486.877-2.542a12.8 12.8 0 0 0 -1.399 -0.022z" />
  </svg>
)
export const Mail = (p: IconProps) => (
  <Base {...p}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m3 7 9 6 9-6" />
  </Base>
)
export const Check = (p: IconProps) => (
  <Base {...p}>
    <path d="m5 12 5 5 9-10" />
  </Base>
)
export const ArrowLeft = (p: IconProps) => (
  <Base {...p}>
    <path d="m12 19-7-7 7-7M19 12H5" />
  </Base>
)
export const Shield = (p: IconProps) => (
  <Base {...p}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </Base>
)
export const FileText = (p: IconProps) => (
  <Base {...p}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
  </Base>
)
export const HelpCircle = (p: IconProps) => (
  <Base {...p}>
    <circle cx="12" cy="12" r="10" />
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01" />
  </Base>
)
export const AlertCircle = (p: IconProps) => (
  <Base {...p}>
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </Base>
)
export const CheckCircle = (p: IconProps) => (
  <Base {...p}>
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </Base>
)
export const ExternalLink = (p: IconProps) => (
  <Base {...p}>
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14 21 3" />
  </Base>
)
