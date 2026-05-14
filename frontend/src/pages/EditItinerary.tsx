import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, X, ArrowLeft, Check } from 'lucide-react';
import { toast } from 'sonner';
import PageTransition from '@/components/PageTransition';
import AppLayout from '@/components/AppLayout';
import { atividadeApi, roteiroApi, roteiroAtividadeApi } from '@/services/api';
import type { Atividade, Roteiro } from '@/types/index';
import type { ItineraryDay } from '@/store/useStore';

const MAX_ATIVIDADES_POR_DIA = 5;

export default function EditItinerary() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, itineraries, updateItinerary } = useStore();
  const storeItinerary = itineraries.find(it => it.id === id);

  const [roteiro, setRoteiro] = useState<Roteiro | null>(null);
  const [atividades, setAtividades] = useState<Atividade[]>([]);
  const [days, setDays] = useState<ItineraryDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [selectedDay, setSelectedDay] = useState(0);

  useEffect(() => {
    const numId = Number(id);
    if (isNaN(numId) || !user) {
      setLoading(false);
      setNotFound(true);
      return;
    }

    setLoading(true);
    roteiroApi.buscarPorId(numId)
      .then(roteiroRes => {
        const r: Roteiro = roteiroRes.data;
        setRoteiro(r);
        return Promise.all([
          Promise.resolve(r),
          atividadeApi.listarPorDestino(r.destino.id),
          roteiroAtividadeApi.listar(numId, user.id),
        ]);
      })
      .then(([r, atividadesRes, diasRes]) => {
        setAtividades(atividadesRes.data);

        const actsByDay: Record<number, string[]> = {};
        for (const ra of diasRes.data as { atividadeId: number; diaNumero: number }[]) {
          if (!actsByDay[ra.diaNumero]) actsByDay[ra.diaNumero] = [];
          actsByDay[ra.diaNumero].push(String(ra.atividadeId));
        }

        const dep = new Date(r.dataIda + 'T00:00:00');
        const builtDays: ItineraryDay[] = Array.from({ length: r.totalDias }, (_, i) => {
          const date = new Date(dep);
          date.setDate(date.getDate() + i);
          return {
            dayNumber: i + 1,
            date: date.toISOString().split('T')[0],
            activityIds: actsByDay[i + 1] ?? [],
          };
        });
        setDays(builtDays);
        if (storeItinerary) updateItinerary(storeItinerary.id, builtDays);
      })
      .catch(() => {
        setNotFound(true);
        toast.error('Erro ao carregar o roteiro');
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, user]);

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

  const persistDays = (newDays: ItineraryDay[]) => {
    setDays(newDays);
    if (storeItinerary) updateItinerary(storeItinerary.id, newDays);
  };

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
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? 'Erro ao adicionar atividade');
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
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? 'Erro ao remover atividade');
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
                      <div key={act.id} className="flex items-center justify-between bg-surface rounded-lg p-4">
                        <div>
                          <span className="font-body text-sm font-medium">{act.nome}</span>
                          <div className="flex gap-2 mt-1">
                            <Badge variant="secondary" className="text-xs rounded-full">{act.categoria}</Badge>
                            <span className="text-xs text-muted-foreground capitalize">{act.duracao} · {act.turno}</span>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label={`Remover ${act.nome}`}
                          onClick={() => removeActivity(String(act.id))}
                          className="rounded-full hover:bg-destructive/10 hover:text-destructive"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <h3 className="font-display text-lg font-semibold mb-4">Atividades Disponíveis</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {atividades.map(act => {
                    const isAdded = currentDay?.activityIds.includes(String(act.id));
                    const isFull = (currentDay?.activityIds.length || 0) >= MAX_ATIVIDADES_POR_DIA;
                    return (
                      <div key={act.id} className="flex items-center justify-between bg-card rounded-lg p-4">
                        <div>
                          <span className="font-body text-sm font-medium">{act.nome}</span>
                          <div className="flex gap-2 mt-1">
                            <Badge variant="secondary" className="text-xs rounded-full">{act.categoria}</Badge>
                            <span className="text-xs text-muted-foreground capitalize">{act.duracao} · {act.turno}</span>
                          </div>
                        </div>
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
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </PageTransition>
    </AppLayout>
  );
}
