import { ModeToggle } from "@procertus-ui/ui";

/**
 * Registry header toolbar: color mode for guest welcome flows. Language is rendered by the shell
 * header after login when using `guestLanguagePlacement: "trailing"`.
 */
export function WelcomePublicHeaderLeading() {
  return <ModeToggle />;
}
