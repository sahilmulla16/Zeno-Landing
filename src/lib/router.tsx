import {
  createContext,
  useContext,
  useEffect,
  useState,
  type AnchorHTMLAttributes,
  type ReactNode,
} from 'react'

interface RouterContextType {
  path: string
  navigate: (to: string, replace?: boolean) => void
}

const RouterContext = createContext<RouterContextType>({
  path: '/',
  navigate: () => {},
})

/** Normalizes a pathname: e.g. '/privacy/' -> '/privacy', empty -> '/' */
function normalizePath(raw: string): string {
  const p = raw.split('?')[0].split('#')[0].replace(/\/+$/, '')
  return p === '' ? '/' : p
}

export function RouterProvider({ children }: { children: ReactNode }) {
  const [path, setPath] = useState<string>(() =>
    typeof window !== 'undefined' ? normalizePath(window.location.pathname) : '/',
  )

  useEffect(() => {
    const onPop = () => {
      setPath(normalizePath(window.location.pathname))
    }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  const navigate = (to: string, replace = false) => {
    const target = normalizePath(to)
    if (typeof window !== 'undefined') {
      if (replace) {
        window.history.replaceState({}, '', to)
      } else {
        window.history.pushState({}, '', to)
      }
      setPath(target)
      const hash = to.includes('#') ? to.split('#')[1] : null
      if (hash) {
        setTimeout(() => {
          const el = document.getElementById(hash)
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' })
          } else {
            window.scrollTo({ top: 0, behavior: 'instant' })
          }
        }, 50)
      } else {
        window.scrollTo({ top: 0, behavior: 'instant' })
      }
    }
  }

  return (
    <RouterContext.Provider value={{ path, navigate }}>
      {children}
    </RouterContext.Provider>
  )
}

export function useRouter() {
  return useContext(RouterContext)
}

export interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string
  replace?: boolean
}

/**
 * Universal Link: for internal paths like `/privacy` or `/#features`, intercepts and performs client-side navigation.
 * For external URLs (`https://`, `mailto:`), acts as standard HTML anchor.
 */
export function Link({ href, replace = false, onClick, children, ...rest }: LinkProps) {
  const { navigate } = useRouter()

  const isInternal = href.startsWith('/') && !href.startsWith('//')

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e)
    if (
      !e.defaultPrevented &&
      e.button === 0 &&
      !e.metaKey &&
      !e.ctrlKey &&
      !e.shiftKey &&
      !e.altKey &&
      isInternal
    ) {
      e.preventDefault()
      navigate(href, replace)
    }
  }

  return (
    <a href={href} onClick={handleClick} {...rest}>
      {children}
    </a>
  )
}

/** Sets document title and meta description dynamically */
export function PageMeta({ title, description }: { title: string; description?: string }) {
  useEffect(() => {
    document.title = title
    if (description) {
      let meta = document.querySelector('meta[name="description"]')
      if (!meta) {
        meta = document.createElement('meta')
        meta.setAttribute('name', 'description')
        document.head.appendChild(meta)
      }
      meta.setAttribute('content', description)
    }
  }, [title, description])

  return null
}
