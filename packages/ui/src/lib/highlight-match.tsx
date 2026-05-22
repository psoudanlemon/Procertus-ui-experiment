import { Fragment, type ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * Wraps every case-insensitive occurrence of `query` inside `text` in a
 * `<mark>` so search results visibly reflect what was matched. Designed for
 * short labels in result lists (autocomplete suggestions, product rows,
 * combobox options) where the user benefits from seeing which substring
 * triggered the match.
 *
 * Returns the input unchanged when `query` is empty / whitespace or `text`
 * is not a string, so it's safe to call unconditionally. Pass `className`
 * to override the accent treatment when the surrounding row already uses
 * the accent color on hover.
 */
export function highlightMatch(
  text: ReactNode,
  query: string | undefined,
  className?: string,
): ReactNode {
  if (typeof text !== "string") return text;
  const needle = query?.trim();
  if (!needle) return text;

  const haystack = text.toLowerCase();
  const lower = needle.toLowerCase();
  const parts: ReactNode[] = [];
  let cursor = 0;
  let idx = haystack.indexOf(lower, cursor);
  let key = 0;
  while (idx !== -1) {
    if (idx > cursor) parts.push(text.slice(cursor, idx));
    parts.push(
      <mark
        key={key++}
        className={cn("rounded-sm bg-accent text-accent-foreground", className)}
      >
        {text.slice(idx, idx + lower.length)}
      </mark>,
    );
    cursor = idx + lower.length;
    idx = haystack.indexOf(lower, cursor);
  }
  if (parts.length === 0) return text;
  if (cursor < text.length) parts.push(text.slice(cursor));

  return (
    <>
      {parts.map((part, i) => (
        <Fragment key={i}>{part}</Fragment>
      ))}
    </>
  );
}
