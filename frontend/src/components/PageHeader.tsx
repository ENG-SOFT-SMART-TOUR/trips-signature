import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
  /** Small uppercase label rendered above the title. */
  label?: string;
  /** The page title — string or rich node. */
  title: ReactNode;
  /** Title size: 'xl' (text-4xl, default) or 'lg' (text-3xl). */
  size?: 'lg' | 'xl';
  /** Extra classes applied to the <h1> (e.g. bottom margin). */
  titleClassName?: string;
}

export default function PageHeader({ label, title, size = 'xl', titleClassName }: PageHeaderProps) {
  return (
    <>
      {label && (
        <span className="font-body text-xs tracking-[0.2em] uppercase text-primary mb-2 block">
          {label}
        </span>
      )}
      <h1
        className={cn(
          'font-display font-semibold',
          size === 'lg' ? 'text-3xl' : 'text-4xl',
          titleClassName,
        )}
      >
        {title}
      </h1>
    </>
  );
}
