import React from 'react';
import { cn } from '@/lib/utils';
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from '@/components/ui/resizable';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button'; // Needed for SheetClose
import { Cancel01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { useMediaQuery } from '../hooks/useMediaQuery';

// Define the props the outer div might accept if needed, excluding className handled by cn
type OuterDivProps = Omit<React.HTMLAttributes<HTMLDivElement>, 'className'>;

export interface SplitViewProps extends OuterDivProps {
  /** Content for the primary (left or main) panel */
  primaryContent: React.ReactNode;
  /** Content for the secondary (right or sheet) panel */
  secondaryContent: React.ReactNode;
  /** Whether the secondary panel (Sheet on mobile) is open */
  isOpen: boolean;
  /** Callback to close the secondary panel (Sheet on mobile) */
  onClose: () => void;
  /** Optional breakpoint for switching to Sheet view (default: 768px) */
  mobileBreakpoint?: number;
  /** Optional default size for the primary panel (0-100) */
  defaultPrimarySize?: number;
  /** Optional default size for the secondary panel (0-100) */
  defaultSecondarySize?: number;
  /** Optional class name for the root element */
  className?: string;
  /** Optional title for the Sheet header on mobile */
  sheetTitle?: string;
}

/**
 * SplitView: A component that displays two panels side-by-side on desktop
 * and uses a Sheet for the secondary panel on mobile.
 */
export const SplitView = React.forwardRef<HTMLDivElement, SplitViewProps>(
  (
    {
      primaryContent,
      secondaryContent,
      isOpen,
      onClose,
      mobileBreakpoint = 768,
      defaultPrimarySize = 50,
      defaultSecondarySize = 50,
      className,
      sheetTitle = 'Details',
      ...divProps
    },
    ref
  ) => {
    const isMobile = useMediaQuery(`(max-width: ${mobileBreakpoint}px)`);

    // Desktop view using Resizable panels
    const DesktopView = (
      <ResizablePanelGroup
        orientation="horizontal"
        className={cn('h-full w-full rounded-lg border', className)}
      >
        <ResizablePanel defaultSize={defaultPrimarySize}>{primaryContent}</ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={defaultSecondarySize}>
          {/* On desktop, secondary content is always visible if rendered */}
          {/* We don't use isOpen/onClose here, parent controls rendering SplitView */}
          {secondaryContent}
        </ResizablePanel>
      </ResizablePanelGroup>
    );

    // Mobile view using Sheet for the secondary panel
    const MobileView = (
      <div ref={ref} className={cn('h-full w-full', className)} {...divProps}>
        {/* Primary content is always visible */}
        <div className="h-full w-full">{primaryContent}</div>
        <Sheet open={isOpen} onOpenChange={open => !open && onClose()}>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>{sheetTitle}</SheetTitle>
              <SheetClose asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary"
                >
                  <HugeiconsIcon icon={Cancel01Icon} className="h-4 w-4" />
                  <span className="sr-only">Close</span>
                </Button>
              </SheetClose>
            </SheetHeader>
            <div className="mt-4">{secondaryContent}</div>
          </SheetContent>
        </Sheet>
      </div>
    );

    // Wrap DesktopView in a div to apply the forwarded ref if needed
    // Or, if the forwarded ref is *only* for the mobile outer div, adjust accordingly.
    // Here, we assume the ref might apply to the container in either view.
    // If DesktopView should also have the forwarded ref, wrap it.
    if (!isMobile) {
      return (
        <div ref={ref} className={cn('h-full w-full', className)} {...divProps}>
          {DesktopView}
        </div>
      );
    }

    return MobileView;
  }
);

SplitView.displayName = 'SplitView';
