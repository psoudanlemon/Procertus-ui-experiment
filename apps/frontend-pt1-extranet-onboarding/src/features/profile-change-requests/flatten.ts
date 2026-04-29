/** Shallow flatten for diff display and JSON-safe persistence. */
export function flattenStringRecord(input: Record<string, unknown>): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(input)) {
    if (v === undefined || v === null) out[k] = "";
    else if (typeof v === "string") out[k] = v;
    else out[k] = String(v);
  }
  return out;
}

export type FieldDiffRow = { key: string; before: string; after: string };

/** Keys where before !== after; stable sort by key. */
export function diffStringRecords(
  before: Record<string, string>,
  after: Record<string, string>,
): FieldDiffRow[] {
  const keys = [...Object.keys(before), ...Object.keys(after)].filter((k, i, arr) => arr.indexOf(k) === i);
  const rows: FieldDiffRow[] = [];
  for (const key of keys) {
    const b = before[key] ?? "";
    const a = after[key] ?? "";
    if (b !== a) rows.push({ key, before: b, after: a });
  }
  rows.sort((x, y) => x.key.localeCompare(y.key));
  return rows;
}

export function hasAnyDiff(before: Record<string, string>, after: Record<string, string>): boolean {
  return diffStringRecords(before, after).length > 0;
}
