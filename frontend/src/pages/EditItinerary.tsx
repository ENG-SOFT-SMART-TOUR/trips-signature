import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, X, ArrowLeft, Check } from 'lucide-react';
import { toast } from 'sonner';
import PageTransition from '@/components/PageTransition';
import AppLayout from '@/components/AppLayout';
import ActivityCard from '@/components/ActivityCard';
import { roteiroAtividadeApi } from '@/services/api';
import { useHydratedItinerary } from '@/hooks/useHydratedItinerary';
import { TURNOS } from '@/types/index';
import type { Atividade, Turno } from '@/types/index';

const MAX_ATIVIDADES_POR_DIA = 5;

export default function EditItinerary() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useStore();
  const { roteiro, atividades, days, loading, notFound, persistDays } = useHydratedItinerary(id);

  const [selectedDay, setSelectedDay] = useState(0);
  const [turnoFiltro, setTurnoFiltro] = useState<Turno | null>(null);

  if (loading) {
    return (
      <AppLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-4">
          <Skeleton className="h-10 w-64 rounded-lg" />
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
      </AppLayout>
    );
  }

  if (notFound || !roteiro) {
    return (
      <AppLayout>
        <div className="p-12 text-center text-muted-foreground font-body">Roteiro não encontrado.</div>
      </AppLayout>
    );
  }

  const currentDay = days[selectedDay];
  const dayAtividades = (currentDay?.activityIds
    .map(aid => atividades.find(a => String(a.id) === aid))
    .filter(Boolean) ?? []) as Atividade[];

  const atividadesDisponiveis = turnoFiltro
    ? atividades.filter(a => a.turno?.toLowerCase() === turnoFiltro)
    : atividades;

  const addActivity = async (act: Atividade) => {
    if (!user || !currentDay) return;
    if (currentDay.activityIds.length >= MAX_ATIVIDADES_POR_DIA) {
      toast.error(`Máximo de ${MAX_ATIVIDADES_POR_DIA} atividades por dia atingido.`);
      return;
    }
    try {
      await roteiroAtividadeApi.adicionar(roteiro.id, user.id, act.id, currentDay.dayNumber);
      persistDays(days.map((d, i) =>
        i === selectedDay ? { ...d, activityIds: [...d.activityIds, String(act.id)] } : d
      ));
      toast.success('Atividade adicionada');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(msg ?? 'Erro ao adicionar atividade');
    }
  };

  const removeActivity = async (actId: string) => {
    if (!user || !currentDay) return;
    try {
      await roteiroAtividadeApi.remover(roteiro.id, user.id, Number(actId), currentDay.dayNumber);
      persistDays(days.map((d, i) =>
        i === selectedDay ? { ...d, activityIds: d.activityIds.filter(a => a !== actId) } : d
      ));
      toast('Atividade removida');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(msg ?? 'Erro ao remover atividade');
    }
  };

  return (
    <AppLayout>
      <PageTransition>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button variant="ghost" onClick={() => navigate(`/itinerary/${id}`)} className="rounded-full">
              <ArrowLeft className="h-4 w-4 mr-1" /> Voltar
            </Button>
            <div>
              <h1 className="font-display text-2xl font-semibold">{roteiro.destino.nome}</h1>
              <p className="font-body text-xs text-muted-foreground">
                {roteiro.destino.pais} · {roteiro.dataIda} → {roteiro.dataVolta} · {days.length} dias
              </p>
            </div>
            <Button onClick={() => navigate(`/itinerary/${id}`)} className="ml-auto rounded-full bg-primary text-primary-foreground">
              <Check className="h-4 w-4 mr-1" /> Concluir
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Day list */}
            <div className="lg:col-span-3 space-y-1">
              {days.map((day, i) => (
                <button
                  key={day.dayNumber}
                  onClick={() => setSelectedDay(i)}
                  className={`w-full text-left px-4 py-3 rounded-lg font-body text-sm transition-all ${
                    i === selectedDay ? 'bg-primary text-primary-foreground' : 'hover:bg-surface'
                  }`}
                >
                  <span className="font-medium">Dia {day.dayNumber}</span>
                  <span className="block text-xs opacity-70">
                    {day.date} · {day.activityIds.length}/{MAX_ATIVIDADES_POR_DIA}
                  </span>
                </button>
              ))}
            </div>

            {/* Right panel */}
            <div className="lg:col-span-9">
              <div className="mb-8">
                <h2 className="font-display text-xl font-semibold mb-4">
                  Atividades do Dia {currentDay?.dayNumber}
                </h2>
                {dayAtividades.length === 0 ? (
                  <p className="text-sm text-muted-foreground font-body">Nenhuma atividade ainda. Adicione abaixo.</p>
                ) : (
                  <div className="space-y-3">
                    {dayAtividades.map(act => (
                      <ActivityCard
                        key={act.id}
                        atividade={act}
                        variant="compact"
                        action={
                          <Button
                            variant="ghost"
                            size="icon"
                            aria-label={`Remover ${act.nome}`}
                            onClick={() => removeActivity(String(act.id))}
                            className="rounded-full hover:bg-destructive/10 hover:text-destructive"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        }
                      />
                    ))}
                  </div>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                  <h3 className="font-display text-lg font-semibold">Atividades Disponíveis</h3>
                  {/* Turno filter */}
                  <div className="flex gap-1" role="group" aria-label="Filtrar por turno">
                    <Button
                      variant={turnoFiltro === null ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setTurnoFiltro(null)}
                      className="rounded-full text-xs h-7"
                    >
                      Todos
                    </Button>
                    {TURNOS.map(t => (
                      <Button
                        key={t.value}
                        variant={turnoFiltro === t.value ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setTurnoFiltro(t.value)}
                        className="rounded-full text-xs h-7"
                      >
                        {t.label}
                      </Button>
                    ))}
                  </div>
                </div>
                {atividadesDisponiveis.length === 0 ? (
                  <p className="text-sm text-muted-foreground font-body">
                    Nenhuma atividade neste turno.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {atividadesDisponiveis.map(act => {
                      const isAdded = currentDay?.activityIds.includes(String(act.id));
                      const isFull = (currentDay?.activityIds.length || 0) >= MAX_ATIVIDADES_POR_DIA;
                      return (
                        <ActivityCard
                          key={act.id}
                          atividade={act}
                          variant="compact"
                          action={
                            <Button
                              variant="ghost"
                              size="icon"
                              aria-label={`Adicionar ${act.nome}`}
                              disabled={isAdded || isFull}
                              onClick={() => addActivity(act)}
                              className="rounded-full hover:bg-primary/10 hover:text-primary disabled:opacity-30"
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          }
                        />
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </PageTransition>
    </AppLayout>
  );
}
