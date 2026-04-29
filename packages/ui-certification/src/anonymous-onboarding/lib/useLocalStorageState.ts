import { useEffect, useState } from "react";

function readLocalStorageValue<TValue>(key: string, fallback: TValue): TValue {
  if (typeof localStorage === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as TValue) : fallback;
  } catch {
    return fallback;
  }
}

export function useLocalStorageState<TValue>(key: string, fallback: TValue) {
  const [value, setValue] = useState<TValue>(() => readLocalStorageValue(key, fallback));

  useEffect(() => {
    if (typeof localStorage === "undefined") return;
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue] as const;
}
