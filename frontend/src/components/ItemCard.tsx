import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Trash2, type LucideIcon } from 'lucide-react';

interface ItemCardProps {
  to: string;
  icon: LucideIcon;
  title: string;
  /** Optional badge (string or rich node) shown in the top-right corner. */
  badge?: ReactNode;
  /** Body content between title and footer (string or rich node). */
  subtitle?: ReactNode;
  /** Footer link text (followed by an arrow). */
  footerLabel: string;
  /** If provided, renders a trash-can delete button next to the badge. */
  onDelete?: () => void;
  /** Accessible label for the delete button (defaults to "Excluir"). */
  deleteAriaLabel?: string;
  /** Staggered animation delay (seconds). */
  delay?: number;
}

export default function ItemCard({
  to,
  icon: Icon,
  title,
  badge,
  subtitle,
  footerLabel,
  onDelete,
  deleteAriaLabel = 'Excluir',
  delay = 0,
}: ItemCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
    >
      <Link to={to} className="group hover-lift block">
        <div className="rounded-xl bg-surface p-6 transition-all duration-300 group-hover:shadow-lg">
          <div className="flex items-start justify-between mb-4">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Icon className="h-5 w-5 text-primary" />
            </div>
            <div className="flex items-center gap-2">
              {badge != null && (
                typeof badge === 'string' ? (
                  <span className="font-body text-xs text-muted-foreground bg-background px-3 py-1 rounded-full">
                    {badge}
                  </span>
                ) : (
                  badge
                )
              )}
              {onDelete && (
                <button
                  type="button"
                  aria-label={deleteAriaLabel}
                  onClick={(e) => { e.preventDefault(); onDelete(); }}
                  className="p-1.5 rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
          <h3 className="font-display text-lg font-semibold mb-1">{title}</h3>
          {subtitle != null && (
            <div className="font-body text-xs text-muted-foreground mb-4">{subtitle}</div>
          )}
          <span className="font-body text-xs text-primary group-hover:underline flex items-center gap-1">
            {footerLabel} <ArrowRight className="h-3 w-3" />
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
