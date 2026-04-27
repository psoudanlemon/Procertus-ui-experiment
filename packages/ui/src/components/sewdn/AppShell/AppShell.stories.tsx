import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "@/components/ui/button";
import { AppLayout, useApp } from ".";

const meta = {
  title: "sewdn/AppShell",
  component: AppLayout,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof AppLayout>;

export default meta;

type Story = StoryObj;

function ShellContent() {
  const app = useApp();

  return (
    <main className="flex h-screen flex-1 flex-col gap-4 bg-muted/30 p-6">
      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <h2 className="text-lg font-semibold">Sewdn app shell</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Combined app providers for dialogs, confirms, alerts, and snackbars.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button
            onClick={() =>
              app.dialog?.openDialog({
                title: "Dialog",
                description: "Opened from the sewdn AppProvider.",
                content: <p className="text-sm">Dialog body content.</p>,
              })
            }
          >
            Open dialog
          </Button>
          <Button
            variant="outline"
            onClick={() => app.alert?.showAlert("Alert", "This is an alert dialog.")}
          >
            Show alert
          </Button>
          <Button
            variant="secondary"
            onClick={() =>
              app.snackbar.addSnackbar({
                title: "Snackbar",
                message: "App shell snackbar provider is active.",
              })
            }
          >
            Show snackbar
          </Button>
        </div>
      </div>
    </main>
  );
}

export const Default: Story = {
  render: () => (
    <AppLayout>
      <ShellContent />
    </AppLayout>
  ),
};
