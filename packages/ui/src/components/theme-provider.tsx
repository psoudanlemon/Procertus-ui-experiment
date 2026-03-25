import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useState,
  type ReactNode,
} from "react"

import {
  DEFAULT_THEME_ID,
  THEMES,
  type ThemeId,
  isThemeId,
} from "../lib/themes"

export type { ThemeId } from "../lib/themes"

type ThemeProviderProps = {
  children: ReactNode
  defaultTheme?: ThemeId
  storageKey?: string
}

type ThemeProviderState = {
  theme: ThemeId
  setTheme: (theme: ThemeId) => void
  /** Same as {@link THEMES} — for menus and Storybook toolbars */
  themes: typeof THEMES
}

const ThemeProviderContext = createContext<ThemeProviderState | undefined>(undefined)

/**
 * Brand / palette theme: sets `data-theme="<id>"` on `document.documentElement` for CSS under
 * `src/styles/themes/`. Pair with {@link ModeProvider} for light/dark/system.
 */
export function ThemeProvider({
  children,
  defaultTheme = DEFAULT_THEME_ID,
  storageKey = "vite-ui-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<ThemeId>(() => {
    const raw = localStorage.getItem(storageKey)
    if (isThemeId(raw)) return raw
    return defaultTheme
  })

  useLayoutEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  const setTheme = useCallback(
    (next: ThemeId) => {
      setThemeState((prev: ThemeId) => {
        if (prev === next) return prev
        localStorage.setItem(storageKey, next)
        return next
      })
    },
    [storageKey],
  )

  const value: ThemeProviderState = {
    theme,
    setTheme,
    themes: THEMES,
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeProviderContext)

  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }

  return context
}
