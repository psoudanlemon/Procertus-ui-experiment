import React, { useState, type ComponentType } from 'react';
import type { IconSvgElement } from '@hugeicons/core-free-icons';
import {
  Alert02Icon,
  Cancel01Icon,
  Menu01Icon,
  Setting06Icon,
  UserIcon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { AppLayout, useApp } from './AppShell';
import { CoverView } from './CoverView';
import { IconButton } from './IconButton';
import { PanelsLayout, usePanelsContext } from './Panels';

const icon =
  (source: IconSvgElement) =>
  ({ className }: { className?: string }) => (
    <HugeiconsIcon icon={source} className={className} />
  );

const menuIcon = icon(Menu01Icon as IconSvgElement);
const settingsIcon = icon(Setting06Icon as IconSvgElement);
const closeIcon = icon(Cancel01Icon as IconSvgElement);

interface BasePanelProps {
  panelType?: string;
}

interface SettingsPanelProps extends BasePanelProps {
  initialSetting?: string;
}

const SettingsPanel = ({ panelType = 'settings', initialSetting }: SettingsPanelProps) => {
  const { removePanel } = usePanelsContext();
  const [setting, setSetting] = useState(initialSetting || 'Default');

  return (
    <CoverView
      title="Settings"
      colorScheme="primary"
      cover="https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1770&q=80"
      primaryAction={
        <IconButton
          icon={closeIcon}
          aria-label="Close settings"
          onClick={() => removePanel(panelType)}
          invertColors
        />
      }
      secondaryAction={<IconButton icon={settingsIcon} aria-label="Panel settings" invertColors />}
      className="h-full"
    >
      <div className="space-y-3 p-4">
        <p>This is the settings panel content inside a CoverView.</p>
        <p>Current setting: {setting}</p>
        <Button onClick={() => setSetting('Updated Setting')}>Update setting</Button>
      </div>
    </CoverView>
  );
};

interface UserProfilePanelProps extends BasePanelProps {
  userId: string;
}

const UserProfilePanel = ({ panelType = 'userProfile', userId }: UserProfilePanelProps) => {
  const { removePanel } = usePanelsContext();

  return (
    <CoverView
      title={`User Profile (${userId})`}
      colorScheme="primary"
      cover="https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1770&q=80"
      primaryAction={
        <IconButton
          icon={closeIcon}
          aria-label="Close user profile"
          onClick={() => removePanel(panelType)}
          invertColors
        />
      }
      secondaryAction={<IconButton icon={settingsIcon} aria-label="User profile settings" invertColors />}
      className="h-full"
    >
      <div className="space-y-2 p-4">
        <p>Details for user {userId} inside a CoverView.</p>
        <p className="text-sm text-muted-foreground">
          This panel is opened through the shared Panels context.
        </p>
      </div>
    </CoverView>
  );
};

const NotificationsPanel = ({ panelType = 'notifications' }: BasePanelProps) => {
  const { removePanel } = usePanelsContext();

  return (
    <CoverView
      title="Notifications"
      colorScheme="background"
      primaryAction={
        <IconButton
          icon={closeIcon}
          aria-label="Close notifications"
          onClick={() => removePanel(panelType)}
        />
      }
      secondaryAction={<IconButton icon={settingsIcon} aria-label="Notification settings" />}
      className="h-full"
    >
      <div className="space-y-2 p-4">
        <p>Notifications content area inside a CoverView.</p>
        <ul className="list-disc space-y-1 pl-4 text-sm text-muted-foreground">
          <li>New comment on the certification request.</li>
          <li>Reviewer assigned to the request.</li>
          <li>Policy document requires attention.</li>
        </ul>
      </div>
    </CoverView>
  );
};

const panelRegistry = {
  settings: SettingsPanel,
  userProfile: UserProfilePanel,
  notifications: NotificationsPanel,
} satisfies Record<string, ComponentType<any>>;

function DemoComponent() {
  const app = useApp();

  return (
    <div className="rounded-xl border bg-card p-4">
      <h3 className="font-semibold">App shell actions</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        These buttons use providers from the sewdn AppLayout.
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <Button
          size="sm"
          onClick={() =>
            app.snackbar.addSnackbar({
              title: 'Saved',
              message: 'Snackbar rendered by AppShell.',
            })
          }
        >
          Show snackbar
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() =>
            app.dialog?.openDialog({
              title: 'Dialog',
              description: 'Dialog rendered by AppProvider.',
              content: <p className="text-sm">This dialog comes from the composed app shell.</p>,
            })
          }
        >
          Open dialog
        </Button>
      </div>
    </div>
  );
}

const AppLayoutWithPanels = () => {
  const { openPanel } = usePanelsContext<typeof panelRegistry>();

  return (
    <CoverView
      title="App Main View Title"
      header={<div>Optional header content below title</div>}
      primaryAction={<IconButton icon={menuIcon} aria-label="Open menu" invertColors />}
      colorScheme="primary"
      cover="https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1770&q=80"
    >
      <div className="space-y-4">
        <DemoComponent />
        <Separator />

        <h3 className="text-lg font-semibold">Open Detail Panels with CoverView</h3>
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => openPanel('settings', { initialSetting: 'From Button' })}>
            <HugeiconsIcon icon={Setting06Icon} className="mr-2 h-4 w-4" />
            Open Settings
          </Button>
          <Button onClick={() => openPanel('userProfile', { userId: 'user-123' })} variant="secondary">
            <HugeiconsIcon icon={UserIcon} className="mr-2 h-4 w-4" />
            Open User Profile
          </Button>
          <Button onClick={() => openPanel('notifications')} variant="outline">
            <HugeiconsIcon icon={Alert02Icon} className="mr-2 h-4 w-4" />
            Open Notifications
          </Button>
        </div>

        <Separator />
        <p>More content to demonstrate scrolling...</p>
        {Array.from({ length: 30 }).map((_, index) => (
          <p key={index}>Scrollable content line {index + 1}. Lorem ipsum dolor sit amet...</p>
        ))}
      </div>
    </CoverView>
  );
};

const meta = {
  title: 'sewdn/Examples/App Layout with Detail Panels',
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <div className="h-screen w-full">
        <AppLayout>
          <PanelsLayout panelTypes={panelRegistry}>
            <Story />
          </PanelsLayout>
        </AppLayout>
      </div>
    ),
  ],
  tags: ['autodocs'],
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <AppLayoutWithPanels />,
};
