/**
 * Presentational DensityToggle — table/list density via **ToggleGroup** (settings template).
 *
 * Controlled `value` / `onValueChange` only; persistence lives in the parent.
 */
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  ToggleGroup,
  ToggleGroupItem,
} from "@procertus-ui/ui";

export type AdminTableDensity = "comfortable" | "compact" | "spacious";

export type DensityToggleProps = {
  className?: string;
  title: string;
  description?: string;
  value: AdminTableDensity;
  onValueChange: (value: AdminTableDensity) => void;
};

const DENSITY_VALUES: readonly AdminTableDensity[] = [
  "comfortable",
  "compact",
  "spacious",
] as const;

function isDensity(v: string): v is AdminTableDensity {
  return (DENSITY_VALUES as readonly string[]).includes(v);
}

export function DensityToggle({
  className,
  title,
  description,
  value,
  onValueChange,
}: DensityToggleProps) {
  return (
    <Card className={cn("w-full max-w-lg", className)}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description ? <CardDescription>{description}</CardDescription> : null}
      </CardHeader>
      <CardContent>
        <ToggleGroup
          type="single"
          value={value}
          onValueChange={(v) => {
            if (v && isDensity(v)) {
              onValueChange(v);
            }
          }}
          variant="outline"
          size="sm"
          spacing={0}
          className="grid w-full grid-cols-3 sm:flex sm:w-auto sm:justify-start"
        >
          <ToggleGroupItem value="comfortable" className="px-2 sm:px-3">
            Comfortable
          </ToggleGroupItem>
          <ToggleGroupItem value="compact" className="px-2 sm:px-3">
            Compact
          </ToggleGroupItem>
          <ToggleGroupItem value="spacious" className="px-2 sm:px-3">
            Spacious
          </ToggleGroupItem>
        </ToggleGroup>
      </CardContent>
    </Card>
  );
}
