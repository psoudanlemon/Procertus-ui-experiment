import { defaultProcertusCategorizationDoc } from "@procertus-ui/procertus-categorization";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { ProcertusCategorizationTreeView } from "./ProcertusCategorizationTreeView";

const meta = {
  title: "ui-lib/ProcertusCategorizationTreeView",
  component: ProcertusCategorizationTreeView,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Nested Procertus product / certification tree. Pass a `doc` from the app or use the package default in stories.",
      },
      canvas: { layout: "padded" },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof ProcertusCategorizationTreeView>;

export default meta;

export const Default: StoryObj<typeof meta> = {
  args: {
    doc: defaultProcertusCategorizationDoc,
    title: "Procertus certification decision tree",
  },
};
