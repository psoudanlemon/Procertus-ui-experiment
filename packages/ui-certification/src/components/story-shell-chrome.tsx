import {
  Button,
  ModeToggle,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  type PublicHeaderLanguage,
} from "@procertus-ui/ui";
import { ShoppingBasket01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

/**
 * Gedeelde mock chrome voor standalone (storybook) shells in ui-certification. Visualiseert
 * dezelfde navbar-bedrading als `PublicAppShell` in de app (color mode, winkelmandje,
 * taalkeuze) zonder draft-state of API-koppeling — zodat story-pagina's de werkelijke
 * navbar reflecteren tijdens mid-flow guest-stappen, waar inloggen geen zinvolle actie is
 * (`hideLogin: true`).
 */

export const STORY_SHELL_LANGUAGES: readonly PublicHeaderLanguage[] = [
  { code: "nl", label: "Nederlands", flag: "🇧🇪" },
  { code: "fr", label: "Français", flag: "🇧🇪" },
];

/**
 * Mock winkelmandje knop: zelfde icon en hover-tooltip als de live
 * `PublicCertificationRequestsCart` in de app, maar zonder sheet of state.
 */
export function StoryShellCartTrigger() {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="min-h-11 min-w-11 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          aria-label="Winkelmandje"
        >
          <HugeiconsIcon icon={ShoppingBasket01Icon} className="size-5" />
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom" sideOffset={4}>
        Winkelmandje
      </TooltipContent>
    </Tooltip>
  );
}

/** Re-export voor stories die geen eigen toggle nodig hebben. */
export { ModeToggle as StoryShellModeToggle };
