'use client';

import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type ButtonProps = React.ComponentProps<typeof Button>;

export interface SnackbarAction {
  label: string;
  onClick: () => void;
  variant?: ButtonProps['variant'];
  disabled?: boolean;
  isDismissAction?: boolean;
}

export interface SnackbarProps {
  id: string;
  message: ReactNode;
  title?: ReactNode;
  actions?: SnackbarAction[];
  onDismiss?: (id: string) => void;
  className?: string;
}

export function Snackbar({
  id,
  message,
  title,
  actions = [],
  onDismiss,
  className,
}: SnackbarProps) {
  return (
    <div
      className={cn(
        'bg-background border rounded-lg shadow-lg p-4 flex gap-4 pointer-events-auto w-full',
        title ? 'items-start' : 'items-center',
        className
      )}
    >
      <div className="flex-1">
        {title && <div className="text-sm font-semibold mb-1">{title}</div>}
        <div className="text-sm font-medium">{message}</div>
      </div>
      {actions.length > 0 && (
        <div className="flex items-center gap-2">
          {actions.map((action, index) => {
            const handleClick = () => {
              action.onClick();
              if (action.isDismissAction) {
                onDismiss?.(id);
              }
            };

            return (
              <Button
                key={index}
                variant={action.variant || 'default'}
                size="sm"
                onClick={handleClick}
                disabled={action.disabled}
              >
                {action.label}
              </Button>
            );
          })}
        </div>
      )}
    </div>
  );
}
