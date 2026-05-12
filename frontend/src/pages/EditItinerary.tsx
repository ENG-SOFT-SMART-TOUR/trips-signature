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

export default function EditItinerary() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { itineraries, updateItinerary } = useStore();
  const itinerary = itineraries.find(it => it.id === id);

  const [roteiro, setRoteiro] = useState<Roteiro | null>(null);
  const [atividades, setAtividades] = useState<Atividade[]>([]);
  const [loadingAtividades, setLoadingAtividades] = useState(true);
  const [selectedDay, setSelectedDay] = useState(0);

  useEffect(() => {
    const numId = Number(id);
    if (isNaN(numId)) return;

    roteiroApi.buscarPorId(numId)
      .then(res => {
        setRoteiro(res.data);
        return Promise.all([
          atividadeApi.listarPorDestino(res.data.destino.id),
          roteiroAtividadeApi.listar(numId),
        ]);
      })
      .then(([atividadesRes, diasRes]) => {
        setAtividades(atividadesRes.data);

        if (itinerary) {
          const actsByDay: Record<number, string[]> = {};
          for (const ra of diasRes.data as { atividadeId: number; diaNumero: number }[]) {
            if (!actsByDay[ra.diaNumero]) actsByDay[ra.diaNumero] = [];
            actsByDay[ra.diaNumero].push(String(ra.atividadeId));
          }
          const updatedDays = itinerary.days.map(d => ({
            ...d,
            activityIds: actsByDay[d.dayNumber] ?? [],
          }));
          updateItinerary(itinerary.id, updatedDays);
        }
      })
      .catch(() => toast.error('Erro ao carregar atividades'))
      .finally(() => setLoadingAtividades(false));
  }, [id]);

  if (!itinerary) {
    return (
      <AppLayout>
        <div className="p-12 text-center text-muted-foreground font-body">Itinerary not found.</div>
      </AppLayout>
    );
  }

  const currentDay = itinerary.days[selectedDay];
  const dayAtividades = currentDay?.activityIds
    .map(aid => atividades.find(a => String(a.id) === aid))
    .filter(Boolean) as Atividade[];
  const destNome = roteiro?.destino.nome ?? '...';
  const destPais = roteiro?.destino.pais ?? '';

  const addActivity = async (act: Atividade) => {
    if (currentDay.activityIds.length >= 5) {
      toast.error('Maximum 5 activities per day');
      return;
    }
    const numId = Number(id);
    try {
      await roteiroAtividadeApi.adicionar(numId, act.id, currentDay.dayNumber);
      const newDays = itinerary.days.map((d, i) =>
        i === selectedDay ? { ...d, activityIds: [...d.activityIds, String(act.id)] } : d
      );
      updateItinerary(itinerary.id, newDays);
      toast.success('Activity added');
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? 'Erro ao adicionar atividade';
      toast.error(msg);
    }
  };

  const removeActivity = async (actId: string) => {
    const numId = Number(id);
    try {
      await roteiroAtividadeApi.remover(numId, Number(actId), currentDay.dayNumber);
      const newDays = itinerary.days.map((d, i) =>
        i === selectedDay ? { ...d, activityIds: d.activityIds.filter(a => a !== actId) } : d
      );
      updateItinerary(itinerary.id, newDays);
      toast('Activity removed');
    } catch {
      toast.error('Erro ao remover atividade');
    }
  };

  return (
    <AppLayout>
      <PageTransition>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button variant="ghost" onClick={() => navigate(`/itinerary/${id}`)} className="rounded-full">
              <ArrowLeft className="h-4 w-4 mr-1" /> Back
            </Button>
            <div>
              <h1 className="font-display text-2xl font-semibold">{destNome}</h1>
              <p className="font-body text-xs text-muted-foreground">
                {destPais} · {itinerary.departureDate} → {itinerary.returnDate} · {itinerary.days.length} days
              </p>
            </div>
            <Button onClick={() => navigate(`/itinerary/${id}`)} className="ml-auto rounded-full bg-primary text-primary-foreground">
              <Check className="h-4 w-4 mr-1" /> Done
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Day list */}
            <div className="lg:col-span-3 space-y-1">
              {itinerary.days.map((day, i) => (
                <button
                  key={day.dayNumber}
                  onClick={() => setSelectedDay(i)}
                  className={`w-full text-left px-4 py-3 rounded-lg font-body text-sm transition-all ${
                    i === selectedDay ? 'bg-primary text-primary-foreground' : 'hover:bg-surface'
                  }`}
                >
                  <span className="font-medium">Day {day.dayNumber}</span>
                  <span className="block text-xs opacity-70">{day.date} · {day.activityIds.length}/5</span>
                </button>
              ))}
            </div>

            {/* Right panel */}
            <div className="lg:col-span-9">
              <div className="mb-8">
                <h2 className="font-display text-xl font-semibold mb-4">
                  Day {currentDay?.dayNumber} Activities
                </h2>
                {loadingAtividades ? (
                  <div className="space-y-3">
                    {[...Array(2)].map((_, i) => <Skeleton key={i} className="h-16 rounded-lg" />)}
                  </div>
                ) : dayAtividades.length === 0 ? (
                  <p className="text-sm text-muted-foreground font-body">No activities yet. Add some below.</p>
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
                <h3 className="font-display text-lg font-semibold mb-4">Available Activities</h3>
                {loadingAtividades ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-20 rounded-lg" />)}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {atividades.map(act => {
                      const isAdded = currentDay?.activityIds.includes(String(act.id));
                      const isFull = (currentDay?.activityIds.length || 0) >= 5;
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
                )}
              </div>
            </div>
          </div>
        </div>
      </PageTransition>
    </AppLayout>
  );
}
