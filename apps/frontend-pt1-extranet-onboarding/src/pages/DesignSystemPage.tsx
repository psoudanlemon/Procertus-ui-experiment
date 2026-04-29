import { PrototypeSurfaceMarquee, Separator, Summary } from "@procertus-ui/ui";

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
        <Summary className="mx-0 max-w-none" />
      </div>
    </div>
  );
}
