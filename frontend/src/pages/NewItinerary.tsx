import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import PageHeader from '@/components/PageHeader';
import PageTransition from '@/components/PageTransition';
import AppLayout from '@/components/AppLayout';
import { destinoApi, roteiroApi } from '@/services/api';
import type { Destino } from '@/types/index';

function formatarData(iso: string): string {
  const [year, month, day] = iso.split('-').map(Number);
  return new Date(year, month - 1, day).toLocaleDateString('pt-BR', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
  });
}

export default function NewItinerary() {
  const navigate = useNavigate();
  const { user, addItinerary, addDiary } = useStore();

  const [destinos, setDestinos] = useState<Destino[]>([]);
  const [destId, setDestId] = useState<number | null>(null);
  const [departure, setDeparture] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const today = new Date().toISOString().split('T')[0];
  const minReturnDate = departure
    ? new Date(new Date(departure + 'T00:00:00').getTime() + 86400000).toISOString().split('T')[0]
    : today;

  useEffect(() => {
    if (!departure) return;
    setErrors(prev => {
      const e = { ...prev };
      if (departure < today) {
        e.departure = 'Departure must be in the future';
      } else {
        delete e.departure;
      }
      if (returnDate && returnDate <= departure) {
        e.returnDate = 'Return must be after departure';
      } else if (returnDate) {
        delete e.returnDate;
      }
      return e;
    });
  }, [departure, returnDate]);

  useEffect(() => {
    if (!user) return;

    const fetchDestinos = async () => {
      try {
        const salvosRes = await destinoApi.listarSalvos(user.id);
        const salvos: Destino[] = salvosRes.data;

        if (salvos.length > 0) {
          setDestinos(salvos);
        } else {
          const todosRes = await destinoApi.listar();
          setDestinos(todosRes.data);
        }
      } catch {
        toast.error('Erro ao carregar destinos');
      } finally {
        setLoading(false);
      }
    };

    fetchDestinos();
  }, [user]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!destId) e.destId = 'Select a destination';
    if (!departure) e.departure = 'Select departure date';
    if (!returnDate) e.returnDate = 'Select return date';
    if (departure && departure < today) e.departure = 'Departure must be in the future';
    if (departure && returnDate && returnDate <= departure) e.returnDate = 'Return must be after departure';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate() || !user || !destId) return;

    setSubmitting(true);
    try {
      const res = await roteiroApi.criar({
        usuarioId: user.id,
        destinoId: destId,
        dataIda: departure,
        dataVolta: returnDate,
      });

      const roteiro = res.data;
      const localId = String(roteiro.id);

      const days = diasPreview.map(d => ({ dayNumber: d.dayNumber, date: d.iso, activityIds: [] }));

      addItinerary({
        id: localId,
        destinationId: String(destId),
        departureDate: departure,
        returnDate,
        days,
        createdAt: roteiro.criadoEm,
      });

      const diaryId = `di-${Date.now()}`;
      addDiary({
        id: diaryId,
        destinationId: String(destId),
        itineraryId: localId,
        isPublic: false,
        shareToken: Math.random().toString(36).substring(2, 10),
        entries: [],
        createdAt: new Date().toISOString(),
      });

      toast.success('Itinerary created! Start adding activities.');
      navigate(`/itinerary/${localId}/edit`);
    } catch {
      toast.error('Erro ao salvar roteiro. Tente novamente.');
    } finally {
      setSubmitting(false);
    }
  };

  const diasPreview = useMemo<{ dayNumber: number; iso: string }[]>(() => {
    if (!departure || !returnDate || returnDate <= departure) return [];
    const dep = new Date(departure + 'T00:00:00');
    const ret = new Date(returnDate + 'T00:00:00');
    const dayCount = Math.ceil((ret.getTime() - dep.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    return Array.from({ length: dayCount }, (_, i) => {
      const date = new Date(dep);
      date.setDate(date.getDate() + i);
      return { dayNumber: i + 1, iso: date.toISOString().split('T')[0] };
    });
  }, [departure, returnDate]);

  return (
    <AppLayout>
      <PageTransition>
        <div className="max-w-lg mx-auto px-4 py-12">
          <PageHeader label="New trip" title="Create Itinerary" size="lg" titleClassName="mb-2" />
          {!loading && (
            <p className="font-body text-sm text-muted-foreground mb-8">
              {destinos.length < 19
                ? 'Showing your saved destinations'
                : 'Save destinations in Matches to filter this list'}
            </p>
          )}

          {loading ? (
            <p className="font-body text-sm text-muted-foreground">Loading destinations...</p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-1.5">
                <Label className="font-body text-sm font-medium">Destination</Label>
                <div className="grid grid-cols-2 gap-3">
                  {destinos.map(d => (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => setDestId(d.id)}
                      className={`p-4 rounded-lg text-left transition-all duration-200 ${
                        destId === d.id
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-surface hover:bg-surface/80'
                      }`}
                    >
                      <span className="font-body text-sm font-medium block">{d.nome}</span>
                      <span className="font-body text-xs opacity-70">{d.pais}</span>
                    </button>
                  ))}
                </div>
                {errors.destId && <p className="text-xs text-destructive">{errors.destId}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="font-body text-sm font-medium">Departure</Label>
                  <Input
                    type="date"
                    value={departure}
                    min={today}
                    onChange={e => {
                      const nova = e.target.value;
                      setDeparture(nova);
                      if (returnDate && returnDate <= nova) setReturnDate('');
                    }}
                    className="bg-transparent border-0 border-b border-border rounded-none focus-visible:ring-0 focus-visible:border-primary px-0"
                  />
                  {errors.departure && <p className="text-xs text-destructive">{errors.departure}</p>}
                </div>
                <div className="space-y-1.5">
                  <Label className="font-body text-sm font-medium">Return</Label>
                  <Input
                    type="date"
                    value={returnDate}
                    min={minReturnDate}
                    onChange={e => setReturnDate(e.target.value)}
                    className="bg-transparent border-0 border-b border-border rounded-none focus-visible:ring-0 focus-visible:border-primary px-0"
                  />
                  {errors.returnDate && <p className="text-xs text-destructive">{errors.returnDate}</p>}
                </div>
              </div>

              {diasPreview.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="font-body text-sm font-medium">Trip days</Label>
                    <span className="font-body text-xs text-muted-foreground">
                      {diasPreview.length} {diasPreview.length === 1 ? 'day' : 'days'}
                    </span>
                  </div>
                  <div className="rounded-lg border border-border overflow-hidden max-h-52 overflow-y-auto">
                    {diasPreview.map((d, i) => (
                      <div
                        key={d.dayNumber}
                        className={`flex items-center gap-4 px-4 py-2.5 ${
                          i < diasPreview.length - 1 ? 'border-b border-border/50' : ''
                        }`}
                      >
                        <span className="font-body text-xs text-muted-foreground w-10 shrink-0">
                          Day {d.dayNumber}
                        </span>
                        <span className="font-body text-sm capitalize">{formatarData(d.iso)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/itineraries')}
                  className="rounded-full"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 rounded-full bg-accent text-accent-foreground hover:bg-accent/90"
                >
                  {submitting
                    ? 'Saving...'
                    : diasPreview.length > 0
                      ? `Create ${diasPreview.length}-day Itinerary`
                      : 'Create Itinerary'}
                </Button>
              </div>
            </form>
          )}
        </div>
      </PageTransition>
    </AppLayout>
  );
}
