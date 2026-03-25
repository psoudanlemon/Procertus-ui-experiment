/**
 * Registered UI themes (brand palettes). Add an entry and a stylesheet under
 * `src/styles/themes/<id>.css` — see README.
 */
export const THEMES = [
  { id: "default", label: "Default" },
  { id: "ocean", label: "Ocean" },
] as const

export type ThemeId = (typeof THEMES)[number]["id"]

export const DEFAULT_THEME_ID: ThemeId = "default"

export function isThemeId(value: unknown): value is ThemeId {
  return typeof value === "string" && THEMES.some((t) => t.id === value)
}
