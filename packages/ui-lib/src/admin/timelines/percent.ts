/** Clamp a numeric percentage to [0, 100]. */
export function clampPct(value: number): number {
  if (Number.isNaN(value)) {
    return 0;
  }
  return Math.min(100, Math.max(0, value));
}

/** Non-negative span between two percentage points. */
export function segmentSpan(start: number, end: number): number {
  return Math.max(0, clampPct(end) - clampPct(start));
}
