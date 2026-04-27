import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "@/components/ui/button";
import { Snackbar } from "./Snackbar";
import { SnackbarContainer } from "./SnackbarContainer";
import { SnackbarProvider, useSnackbar } from "./SnackbarProvider";

const meta = {
  title: "sewdn/Snackbar",
  component: Snackbar,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
} satisfies Meta<typeof Snackbar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Base: Story = {
  args: {
    id: "example",
    title: "Saved",
    message: "The certification draft has been saved.",
  },
};

function SnackbarDemo() {
  const { addSnackbar } = useSnackbar();

  return (
    <div className="flex gap-2">
      <Button
        onClick={() =>
          addSnackbar({
            title: "Draft saved",
            message: "Changes are available in local storage.",
          })
        }
      >
        Show snackbar
      </Button>
      <SnackbarContainer />
    </div>
  );
}

export const Provider: Story = {
  render: () => (
    <SnackbarProvider>
      <SnackbarDemo />
    </SnackbarProvider>
  ),
};
