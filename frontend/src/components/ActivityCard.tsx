import type { ReactNode } from 'react';
import { Badge } from '@/components/ui/badge';
import { Clock } from 'lucide-react';
import type { Atividade } from '@/types/index';

interface Props {
  atividade: Atividade;
  variant?: 'compact' | 'full';
  /** Optional trailing slot (e.g. an add/remove button) — only used by the compact variant. */
  action?: ReactNode;
}

export default function ActivityCard({ atividade: act, variant = 'compact', action }: Props) {
  if (variant === 'full') {
    return (
      <div className="rounded-xl overflow-hidden bg-surface border border-border/40">
        {act.foto && (
          <img src={act.foto} alt={act.nome} className="w-full h-48 object-cover" />
        )}
        <div className="p-5">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <Badge variant="secondary" className="rounded-full text-xs">{act.categoria}</Badge>
            <span className="text-xs text-muted-foreground capitalize font-body">{act.turno}</span>
            <span className="text-xs text-muted-foreground flex items-center gap-0.5">
              <Clock className="h-3 w-3" /> {act.duracao}
            </span>
          </div>
          <h3 className="font-display text-lg font-semibold mb-1">{act.nome}</h3>
          <p className="font-body text-xs text-muted-foreground line-clamp-2">{act.descricao}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4 p-3 rounded-lg bg-card">
      {act.foto && (
        <img src={act.foto} alt={act.nome} className="w-14 h-14 rounded-lg object-cover shrink-0" />
      )}
      <div className="flex-1 min-w-0">
        <span className="font-body text-sm font-medium block truncate">{act.nome}</span>
        <div className="flex items-center gap-2 mt-1 flex-wrap">
          <Badge variant="secondary" className="text-xs rounded-full">{act.categoria}</Badge>
          <span className="text-xs text-muted-foreground capitalize">{act.turno}</span>
          <span className="text-xs text-muted-foreground flex items-center gap-0.5">
            <Clock className="h-3 w-3" /> {act.duracao}
          </span>
        </div>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
