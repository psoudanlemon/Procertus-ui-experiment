import { Separator } from "@procertus-ui/ui";
import { DesignTokensShowcase, PrototypeSurfaceMarquee } from "@procertus-ui/ui-lib/design-tokens-showcase";

import { AppDesignToolbar } from "../components/AppDesignToolbar";
import { BrandGradientHero } from "../components/BrandGradientHero";

export function DesignSystemPage() {
  return (
    <div className="text-foreground">
      <div className="mx-auto max-w-5xl space-y-8 px-4 pb-12 pt-2">
        <AppDesignToolbar />
        <BrandGradientHero />
        <PrototypeSurfaceMarquee />
        <Separator />
        <DesignTokensShowcase className="mx-0 max-w-none px-0 py-0" />
      </div>
    </div>
  );
}
