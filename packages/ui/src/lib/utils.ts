import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

const SEMANTIC_SPACING = ["micro", "element", "component", "section", "region", "page"] as const;

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        {
          text: [
            "heading-sm",
            "heading-md",
            "heading-lg",
            "heading-xl",
          ],
        },
      ],
      p: [{ p: [...SEMANTIC_SPACING] }],
      px: [{ px: [...SEMANTIC_SPACING] }],
      py: [{ py: [...SEMANTIC_SPACING] }],
      pt: [{ pt: [...SEMANTIC_SPACING] }],
      pr: [{ pr: [...SEMANTIC_SPACING] }],
      pb: [{ pb: [...SEMANTIC_SPACING] }],
      pl: [{ pl: [...SEMANTIC_SPACING] }],
      m: [{ m: [...SEMANTIC_SPACING] }],
      mx: [{ mx: [...SEMANTIC_SPACING] }],
      my: [{ my: [...SEMANTIC_SPACING] }],
      mt: [{ mt: [...SEMANTIC_SPACING] }],
      mr: [{ mr: [...SEMANTIC_SPACING] }],
      mb: [{ mb: [...SEMANTIC_SPACING] }],
      ml: [{ ml: [...SEMANTIC_SPACING] }],
      gap: [{ gap: [...SEMANTIC_SPACING] }],
      "gap-x": [{ "gap-x": [...SEMANTIC_SPACING] }],
      "gap-y": [{ "gap-y": [...SEMANTIC_SPACING] }],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const ICON_BASE_SIZE = 16;
const ICON_BASE_STROKE = 1.33;
const ICON_SCALE_EXPONENT = 0.35;

/** Compute proportional stroke weight for a given icon size. */
export function iconStroke(size: number = ICON_BASE_SIZE) {
  return Math.round(ICON_BASE_STROKE * Math.pow(size / ICON_BASE_SIZE, ICON_SCALE_EXPONENT) * 100) / 100;
}
