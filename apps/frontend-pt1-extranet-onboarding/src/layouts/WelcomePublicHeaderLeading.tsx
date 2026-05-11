import { ModeToggle, PublicRegistryGuestLanguageDropdown } from "@procertus-ui/ui";

import { usePublicPrototypeLanguage } from "./PublicPrototypeLanguageContext";

/**
 * Leading registry app bar: prototype language (left) + color mode — guest welcome flows.
 */
export function WelcomePublicHeaderLeading() {
  const { languages, activeLanguage, setActiveLanguage } = usePublicPrototypeLanguage();

  return (
    <div className="flex shrink-0 items-center gap-2">
      <PublicRegistryGuestLanguageDropdown
        languages={languages}
        activeLanguage={activeLanguage}
        onLanguageChange={setActiveLanguage}
        align="start"
      />
      <ModeToggle />
    </div>
  );
}
