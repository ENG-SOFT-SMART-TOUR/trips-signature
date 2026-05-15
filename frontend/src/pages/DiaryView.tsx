import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import { getDestination, getActivity } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Plus, Share2, BookOpen, Image, Calendar, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import EmptyState from '@/components/EmptyState';
import PageHeader from '@/components/PageHeader';
import ConfirmDialog from '@/components/ConfirmDialog';
import PageTransition from '@/components/PageTransition';
import AppLayout from '@/components/AppLayout';

export default function DiaryView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { diaries, toggleDiaryPublic, deleteDiary, deleteDiaryEntry } = useStore();
  const diary = diaries.find(d => d.id === id);
  const [pendingDeleteDiary, setPendingDeleteDiary] = useState(false);
  const [pendingDeleteEntryId, setPendingDeleteEntryId] = useState<string | null>(null);

  if (!diary) return <AppLayout><div className="p-12 text-center text-muted-foreground">Diário não encontrado.</div></AppLayout>;

  const dest = getDestination(diary.destinationId);
  const groupedByDay = diary.entries.reduce<Record<number, typeof diary.entries>>((acc, entry) => {
    (acc[entry.dayNumber] = acc[entry.dayNumber] || []).push(entry);
    return acc;
  }, {});

  return (
    <AppLayout>
      <PageTransition>
        <div className="max-w-3xl mx-auto px-4 py-8">
          <div className="flex items-start justify-between mb-8">
            <div>
              <PageHeader label="Diário de viagem" title={dest?.name} size="lg" />
              <div className="flex gap-4 mt-2 text-sm text-muted-foreground font-body">
                <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {diary.entries.length} {diary.entries.length === 1 ? 'entrada' : 'entradas'}</span>
                <span className="flex items-center gap-1"><Image className="h-3 w-3" /> {diary.entries.filter(e => e.photo).length} {diary.entries.filter(e => e.photo).length === 1 ? 'foto' : 'fotos'}</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-body text-muted-foreground">{diary.isPublic ? 'Público' : 'Privado'}</span>
                <Switch
                  checked={diary.isPublic}
                  aria-label="Alternar diário público"
                  title="Quando público, o diário fica acessível via link compartilhável"
                  onCheckedChange={() => {
                    toggleDiaryPublic(diary.id);
                    toast(diary.isPublic ? 'Diário definido como privado' : 'Diário agora é público');
                  }}
                />
              </div>
              <Button
                variant="ghost"
                className="rounded-full text-sm"
                title="Copiar o link público para compartilhar este diário"
                onClick={() => {
                  const url = `${window.location.origin}/share/${diary.shareToken}`;
                  navigator.clipboard.writeText(url);
                  toast.success('Link copiado!');
                }}
              >
                <Share2 className="h-4 w-4 mr-1" /> Compartilhar
              </Button>
            </div>
          </div>

          <div className="flex gap-3 mb-8">
            <Button
              onClick={() => navigate(`/diary/${id}/entry/new`)}
              className="rounded-full bg-accent text-accent-foreground hover:bg-accent/90"
            >
              <Plus className="h-4 w-4 mr-1" /> Nova entrada
            </Button>
            <Button
              variant="outline"
              onClick={() => setPendingDeleteDiary(true)}
              className="rounded-full text-destructive border-destructive/30 hover:bg-destructive/10"
            >
              <Trash2 className="h-4 w-4 mr-1" /> Excluir diário
            </Button>
          </div>

          {diary.entries.length === 0 ? (
            <EmptyState
              icon={BookOpen}
              title="Nenhuma entrada ainda"
              description="Comece a documentar suas memórias de viagem."
              actionLabel="Escrever primeira entrada"
              actionTo={`/diary/${id}/entry/new`}
            />
          ) : (
            <div className="space-y-8">
              {Object.entries(groupedByDay).sort(([a], [b]) => Number(a) - Number(b)).map(([dayNum, entries]) => (
                <div key={dayNum}>
                  <h2 className="font-display text-lg font-semibold mb-4">Dia {dayNum}</h2>
                  <div className="space-y-4">
                    {entries.map((entry, i) => {
                      const act = getActivity(entry.activityId);
                      return (
                        <motion.div
                          key={entry.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className="rounded-lg bg-surface p-5"
                        >
                          {entry.photo && (
                            <img
                              src={entry.photo.startsWith('blob:') || entry.photo.startsWith('data:') ? entry.photo : `https://picsum.photos/seed/${entry.photo}/600/300`}
                              alt=""
                              className="w-full h-40 object-cover rounded-md mb-3"
                            />
                          )}
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-body text-sm font-medium mb-1">{act?.name || 'Atividade'}</h3>
                              <p className="font-body text-sm text-foreground leading-relaxed">{entry.text}</p>
                              <p className="font-body text-xs text-muted-foreground mt-2">{new Date(entry.timestamp).toLocaleString('pt-BR')}</p>
                            </div>
                            <button
                              aria-label="Excluir entrada"
                              onClick={() => setPendingDeleteEntryId(entry.id)}
                              className="p-1.5 rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors shrink-0"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </PageTransition>
      <ConfirmDialog
        open={pendingDeleteDiary}
        onOpenChange={setPendingDeleteDiary}
        title="Excluir este diário?"
        description="O diário e todas as suas entradas serão removidos permanentemente."
        confirmLabel="Excluir"
        cancelLabel="Cancelar"
        destructive
        onConfirm={() => {
          deleteDiary(diary.id);
          toast.success('Diário excluído');
          setPendingDeleteDiary(false);
          navigate('/diaries');
        }}
      />
      <ConfirmDialog
        open={!!pendingDeleteEntryId}
        onOpenChange={(open) => !open && setPendingDeleteEntryId(null)}
        title="Excluir esta entrada?"
        confirmLabel="Excluir"
        cancelLabel="Cancelar"
        destructive
        onConfirm={() => {
          if (pendingDeleteEntryId) {
            deleteDiaryEntry(diary.id, pendingDeleteEntryId);
            toast.success('Entrada excluída');
            setPendingDeleteEntryId(null);
          }
        }}
      />
    </AppLayout>
  );
}
