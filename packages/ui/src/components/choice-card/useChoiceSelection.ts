import { useCallback, useMemo, useState } from "react";

export type ChoiceSelectionMode = "single" | "multiple";

export type UseChoiceSelectionOptions =
  | {
      mode: "single";
      defaultSelectedId?: string;
    }
  | {
      mode: "multiple";
      defaultSelectedIds?: readonly string[];
    };

export type UseChoiceSelectionResult = {
  mode: ChoiceSelectionMode;
  selectedIds: string[];
  selectedId: string | undefined;
  toggle: (id: string) => void;
  setSelectedIds: (ids: readonly string[]) => void;
  setSelectedId: (id: string | undefined) => void;
  /** Multiple mode — set membership without toggling (stable for controlled checkboxes). */
  setIncluded: (id: string, include: boolean) => void;
  isSelected: (id: string) => boolean;
  clear: () => void;
};

function clampSingle(ids: readonly string[]): string[] {
  if (ids.length <= 1) {
    return [...ids];
  }
  const first = ids[0];
  return first !== undefined ? [first] : [];
}

export function useChoiceSelection(options: UseChoiceSelectionOptions): UseChoiceSelectionResult {
  const mode = options.mode;

  const [selectedIds, setSelectedIdsState] = useState<string[]>(() => {
    if (options.mode === "single") {
      const id = options.defaultSelectedId;
      return id ? [id] : [];
    }
    return [...(options.defaultSelectedIds ?? [])];
  });

  const setSelectedIds = useCallback(
    (ids: readonly string[]) => {
      setSelectedIdsState(mode === "single" ? clampSingle(ids) : [...ids]);
    },
    [mode],
  );

  const setSelectedId = useCallback((id: string | undefined) => {
    setSelectedIdsState(id ? [id] : []);
  }, []);

  const toggle = useCallback(
    (id: string) => {
      setSelectedIdsState((prev) => {
        if (mode === "single") {
          return prev[0] === id ? [] : [id];
        }
        return prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      });
    },
    [mode],
  );

  const isSelected = useCallback((id: string) => selectedIds.includes(id), [selectedIds]);

  const clear = useCallback(() => setSelectedIdsState([]), []);

  const setIncluded = useCallback((id: string, include: boolean) => {
    setSelectedIdsState((prev) => {
      const has = prev.includes(id);
      if (include && !has) {
        return mode === "single" ? [id] : [...prev, id];
      }
      if (!include && has) {
        return prev.filter((x) => x !== id);
      }
      return prev;
    });
  }, [mode]);

  const selectedId = mode === "single" ? selectedIds[0] : undefined;

  return useMemo(
    (): UseChoiceSelectionResult => ({
      mode,
      selectedIds,
      selectedId,
      toggle,
      setSelectedIds,
      setSelectedId,
      setIncluded,
      isSelected,
      clear,
    }),
    [mode, selectedIds, selectedId, toggle, setSelectedIds, setSelectedId, setIncluded, isSelected, clear],
  );
}
