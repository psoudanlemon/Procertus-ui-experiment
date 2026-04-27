# StepLayout

Generic **step page** layout: optional **stepper** region (`stepper` + `stepperPosition`), header (title, optional description, step label), body, footer (Back, optional secondary, primary). **Presentational** — use **`useStepLayout`** for `activeStep`, `goBack` / `goForward` / `goToStep`, `canGoBack`, `canGoForward`, and **`stepAdvanceAllowed`**. Pass **`canAdvanceFrom(step)`** from the parent to enforce per-step prerequisites before Next or a final “Done/Submit”.

- **`stepper` / `stepperPosition`:** Pass any step UI (e.g. `OnboardingStepper` or ReUI `Stepper` from `@procertus-ui/ui`). `top` places it full width above the title; `start` uses a start rail (e.g. vertical stepper) beside title + body + footer from `md` up, stacking on small viewports.
- **Variants:** `onboarding` (wider) vs `wizard` (tighter). **`layout`:** `default` (max-width card), `fill` (full width, `100svh`, scrolling body), or `fill-parent` (fills the available parent region inside an app shell).

Not a substitute for the global app shell; use in main content for wizards and multi-step flows.
