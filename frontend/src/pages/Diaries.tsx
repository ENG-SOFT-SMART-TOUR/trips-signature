import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { getDestination } from '@/data/mockData';
import { BookOpen, Globe, Lock } from 'lucide-react';
import { toast } from 'sonner';
import EmptyState from '@/components/EmptyState';
import ItemCard from '@/components/ItemCard';
import PageHeader from '@/components/PageHeader';
import ConfirmDialog from '@/components/ConfirmDialog';
import PageTransition from '@/components/PageTransition';
import AppLayout from '@/components/AppLayout';

export default function Diaries() {
  const { diaries, deleteDiary } = useStore();
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  return (
    <AppLayout>
      <PageTransition>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-10">
            <PageHeader label="Suas histórias" title="Meus Diários" />
          </div>

          {diaries.length === 0 ? (
            <EmptyState
              icon={BookOpen}
              title="Nenhum diário ainda"
              description="Seus diários de viagem aparecerão aqui após você completar uma viagem."
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {diaries.map((d, i) => {
                const dest = getDestination(d.destinationId);
                return (
                  <ItemCard
                    key={d.id}
                    to={`/diary/${d.id}`}
                    icon={BookOpen}
                    title={dest?.name || 'Unknown'}
                    badge={
                      <span className="font-body text-xs text-muted-foreground bg-background px-3 py-1 rounded-full flex items-center gap-1">
                        {d.isPublic ? <Globe className="h-3 w-3" /> : <Lock className="h-3 w-3" />}
                        {d.isPublic ? 'Público' : 'Privado'}
                      </span>
                    }
                    subtitle={`${d.entries.length} ${d.entries.length === 1 ? 'entrada' : 'entradas'}`}
                    footerLabel="Ler diário"
                    onDelete={() => setPendingDeleteId(d.id)}
                    deleteAriaLabel="Excluir diário"
                    delay={i * 0.08}
                  />
                );
              })}
            </div>
          )}
        </div>
      </PageTransition>
      <ConfirmDialog
        open={!!pendingDeleteId}
        onOpenChange={(open) => !open && setPendingDeleteId(null)}
        title="Excluir este diário?"
        description="O diário e todas as suas entradas serão removidos permanentemente."
        confirmLabel="Excluir"
        cancelLabel="Cancelar"
        destructive
        onConfirm={() => {
          if (pendingDeleteId) {
            deleteDiary(pendingDeleteId);
            toast.success('Diário excluído');
            setPendingDeleteId(null);
          }
        }}
      />
    </AppLayout>
  );
}
