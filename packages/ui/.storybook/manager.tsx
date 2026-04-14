import React, { useCallback, useMemo } from "react";
import { addons, types, useStorybookApi, useStorybookState } from "storybook/manager-api";
import { IconButton } from "storybook/internal/components";

function BookIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M1 2.5C1 1.672 1.672 1 2.5 1h2C5.88 1 7 2.12 7 3.5v9a2 2 0 0 0-2-2H2.5A1.5 1.5 0 0 1 1 9V2.5ZM13 2.5C13 1.672 12.328 1 11.5 1h-2C8.12 1 7 2.12 7 3.5v9a2 2 0 0 1 2-2h2.5A1.5 1.5 0 0 0 13 9V2.5Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Reverse-navigation addon: when viewing a story that is referenced by a
 * Guidelines page, show a toolbar button that jumps back to that page
 * (and scrolls to the section that contains the link).
 */

// ── Category prefix → guidelines docs ID ────────────────────────────
const CATEGORY_GUIDELINES: Record<string, string> = {
  "design-tokens-typography":              "design-tokens-typography-guidelines--docs",
  "design-tokens-iconography":             "design-tokens-iconography-guidelines--docs",
  "design-tokens-logotype":                "design-tokens-logotype-guidelines--docs",
  "design-tokens-shadow":                  "design-tokens-shadow-guidelines--docs",
  "design-tokens-elevation":               "design-tokens-elevation-guidelines--docs",
  "design-tokens-motion":                  "design-tokens-motion-guidelines--docs",
  "design-tokens-document-architecture":   "design-tokens-document-architecture-guidelines--docs",
  "applied-guidelines-typography":         "design-tokens-typography-guidelines--docs",
  "applied-guidelines-iconography":        "design-tokens-iconography-guidelines--docs",
  "applied-guidelines-logotype":           "design-tokens-logotype-guidelines--docs",
  "applied-guidelines-shadows":            "design-tokens-shadow-guidelines--docs",
  "applied-guidelines-elevation":          "design-tokens-elevation-guidelines--docs",
  "applied-guidelines-motion":             "design-tokens-motion-guidelines--docs",
  "applied-guidelines-document-architecture": "design-tokens-document-architecture-guidelines--docs",
  // Component stories referenced from the Typography guidelines
  "components-button":      "design-tokens-typography-guidelines--docs",
  "components-label":       "design-tokens-typography-guidelines--docs",
  "components-typography":  "design-tokens-typography-guidelines--docs",
  "components-empty":       "design-tokens-typography-guidelines--docs",
  "components-input":       "design-tokens-typography-guidelines--docs",
  "components-sidebar":     "design-tokens-typography-guidelines--docs",
  "components-tooltip":     "design-tokens-typography-guidelines--docs",
  "components-table":       "design-tokens-typography-guidelines--docs",
  "components-badge":       "design-tokens-typography-guidelines--docs",
  "components-sonner":      "design-tokens-typography-guidelines--docs",
  "components-dialog":      "design-tokens-typography-guidelines--docs",
};

/** Extract the category prefix from a story ID (everything before `--`). */
function categoryPrefix(storyId: string): string {
  const idx = storyId.lastIndexOf("--");
  return idx === -1 ? storyId : storyId.slice(0, idx);
}

/** Resolve the guidelines docs ID for a given story, or `null` if none. */
function resolveGuidelines(storyId: string): string | null {
  const prefix = categoryPrefix(storyId);
  // Skip if we're already on a guidelines docs page
  if (storyId.endsWith("-guidelines--docs")) return null;
  return CATEGORY_GUIDELINES[prefix] ?? null;
}

/**
 * After navigating to the guidelines page, find the `<a>` that links to the
 * originating story and scroll the nearest section heading into view.
 */
function scrollToStoryReference(storyId: string) {
  const selector = `a[href*="${storyId}"]`;
  let attempts = 0;

  const tryScroll = () => {
    attempts++;

    // Docs content may be in the preview iframe or in the current document
    const iframe = document.querySelector<HTMLIFrameElement>(
      "#storybook-preview-iframe",
    );
    const doc = iframe?.contentDocument ?? document;
    const link = doc.querySelector<HTMLElement>(selector);

    if (link) {
      // Walk up to find the nearest heading to scroll to
      let target: HTMLElement | null = link;
      let el: HTMLElement | null = link;
      while (el) {
        if (/^H[1-6]$/.test(el.tagName)) {
          target = el;
          break;
        }
        // Try previous sibling first, then parent
        el = (el.previousElementSibling as HTMLElement) ?? el.parentElement;
      }
      target?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    if (attempts < 25) {
      setTimeout(tryScroll, 150);
    }
  };

  // Give the docs page time to render before searching
  setTimeout(tryScroll, 400);
}

// ── Toolbar component ────────────────────────────────────────────────

function GuidelinesLink() {
  const api = useStorybookApi();
  const { storyId = "" } = useStorybookState();

  const guidelinesId = useMemo(() => resolveGuidelines(storyId), [storyId]);

  const handleClick = useCallback(() => {
    if (!guidelinesId) return;
    api.selectStory(guidelinesId);
    scrollToStoryReference(storyId);
  }, [api, guidelinesId, storyId]);

  if (!guidelinesId) return null;

  return (
    <IconButton
      title="Jump to guidelines page"
      onClick={handleClick}
      style={{ gap: 6, fontSize: "12px" }}
    >
      <BookIcon />
      <span>Guidelines</span>
    </IconButton>
  );
}

// ── Register ─────────────────────────────────────────────────────────

addons.register("guidelines-nav", () => {
  addons.add("guidelines-nav/tool", {
    type: types.TOOL,
    title: "Guidelines",
    render: () => <GuidelinesLink />,
  });
});
