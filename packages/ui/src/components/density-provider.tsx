import { createContext, useContext, type ReactNode } from "react";

/** Density preset: controls semantic spacing across a subtree. */
export type Density = "operational" | "spacious";

export const DENSITIES: readonly { id: Density; label: string }[] = [
  { id: "operational", label: "Operational" },
  { id: "spacious", label: "Spacious" },
] as const;

type DensityProviderProps = {
  children: ReactNode;
  density?: Density;
};

const DensityContext = createContext<Density>("operational");

/**
 * Sets the density context for all descendants via a `data-density` attribute.
 * Components consume density through CSS variable indirection, so no
 * `useContext()` calls are needed in component code.
 *
 * Defaults to `"operational"` (8px anchor, staff management console).
 * Set `density="spacious"` for public-facing views (16px anchor).
 */
export function DensityProvider({
  children,
  density = "operational",
}: DensityProviderProps) {
  return (
    <DensityContext.Provider value={density}>
      <div data-density={density}>{children}</div>
    </DensityContext.Provider>
  );
}

/** Read the current density preset. Prefer CSS variable indirection over this hook. */
export function useDensity(): Density {
  return useContext(DensityContext);
}
