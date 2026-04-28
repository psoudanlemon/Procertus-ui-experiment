import { cn } from '@/lib/utils';
import type React from 'react';

interface CardListItem {
  id: string;
}

interface CardListProps<T extends CardListItem> {
  children: (item: T) => React.ReactNode;
  items: T[];
  extraChildren?: React.ReactNode;
  emptyChildren?: React.ReactNode;
  gridSize?: number;
  widthClass?: string;
  className?: string;
}

export function CardList<T extends CardListItem>({
  children,
  items,
  extraChildren,
  emptyChildren,
  gridSize: _gridSize = 12,
  widthClass,
  className,
}: CardListProps<T>) {
  return (
    <div className={cn("block w-full min-w-0 @container", className)}>
      <div
        className={cn(
          'grid w-full auto-rows-fr items-stretch gap-4',
          // Pinned to the legacy sewdn container scale so sewdn breakpoints
          // are not affected by the revert of --container-* in globals.css.
          '@min-[20rem]:grid-cols-1',
          '@min-[40rem]:grid-cols-2',
          '@min-[60rem]:grid-cols-3',
          '@min-[100rem]:grid-cols-4',
          '@min-[150rem]:grid-cols-6',
          widthClass
        )}
      >
        {items && items.length > 0 ? (
          <>
            {items.map(item => children(item))}
            {extraChildren}
          </>
        ) : (
          emptyChildren
        )}
      </div>
    </div>
  );
}
