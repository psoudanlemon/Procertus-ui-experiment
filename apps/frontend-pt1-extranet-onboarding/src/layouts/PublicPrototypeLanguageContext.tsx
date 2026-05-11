import type { PublicHeaderLanguage, PublicRegistryHeaderProps } from "@procertus-ui/ui";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

/** Guest extranet prototype: three locales — switching is UI-only (no i18n yet). */
export const PUBLIC_PROTOTYPE_LANGUAGES: PublicHeaderLanguage[] = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "nl", label: "Nederlands", flag: "🇳🇱" },
];

export type PublicPrototypeLanguageCode = (typeof PUBLIC_PROTOTYPE_LANGUAGES)[number]["code"];

type PublicPrototypeLanguageContextValue = {
  languages: PublicHeaderLanguage[];
  activeLanguage: PublicPrototypeLanguageCode;
  setActiveLanguage: (code: string) => void;
};

const PublicPrototypeLanguageContext = createContext<PublicPrototypeLanguageContextValue | null>(
  null,
);

export function PublicPrototypeLanguageProvider({ children }: { children: ReactNode }) {
  const [activeLanguage, setCode] = useState<PublicPrototypeLanguageCode>("nl");

  const setActiveLanguage = useCallback((code: string) => {
    const next = PUBLIC_PROTOTYPE_LANGUAGES.find((l) => l.code === code);
    if (next) setCode(next.code as PublicPrototypeLanguageCode);
  }, []);

  const value = useMemo(
    () => ({
      languages: PUBLIC_PROTOTYPE_LANGUAGES,
      activeLanguage,
      setActiveLanguage,
    }),
    [activeLanguage, setActiveLanguage],
  );

  return (
    <PublicPrototypeLanguageContext.Provider value={value}>
      {children}
    </PublicPrototypeLanguageContext.Provider>
  );
}

export function usePublicPrototypeLanguage(): PublicPrototypeLanguageContextValue {
  const ctx = useContext(PublicPrototypeLanguageContext);
  if (!ctx) {
    throw new Error("usePublicPrototypeLanguage must be used within PublicPrototypeLanguageProvider");
  }
  return ctx;
}

/** Props to spread onto {@link PublicRegistryHeaderProps} / registry app shell `header`. */
export function usePublicPrototypeRegistryLanguageHeaderProps(): Pick<
  PublicRegistryHeaderProps,
  "languages" | "activeLanguage" | "onLanguageChange"
> {
  const { languages, activeLanguage, setActiveLanguage } = usePublicPrototypeLanguage();
  return useMemo(
    () => ({
      languages,
      activeLanguage,
      onLanguageChange: setActiveLanguage,
    }),
    [languages, activeLanguage, setActiveLanguage],
  );
}
