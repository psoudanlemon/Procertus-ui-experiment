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
          '@xs:grid-cols-1',
          '@sm:grid-cols-2',
          '@md:grid-cols-3',
          '@xl:grid-cols-4',
          '@2xl:grid-cols-6',
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
