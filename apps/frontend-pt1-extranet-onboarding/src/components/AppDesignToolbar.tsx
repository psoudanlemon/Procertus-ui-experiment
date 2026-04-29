import { ModeToggle } from "@procertus-ui/ui";

/**
 * App-level chrome demonstrating **ModeToggle** and semantic **card** / **border** tokens.
 */
export function AppDesignToolbar() {
  return (
    <header className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 shadow-[var(--shadow-proc-xs)] sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-sm font-medium text-foreground">Design system</p>
        <p className="text-xs text-muted-foreground">
          Route <code className="font-mono">/design-system</code> — light / dark / system via{" "}
          <code className="font-mono">ModeProvider</code> +{" "}
          <code className="font-mono">ModeToggle</code>
        </p>
      </div>
      <ModeToggle />
    </header>
  );
}
