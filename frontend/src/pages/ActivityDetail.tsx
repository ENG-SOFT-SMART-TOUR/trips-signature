import { useParams, Link } from 'react-router-dom';
import { getActivity } from '@/data/mockData';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Clock, MapPin, Lightbulb, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useStore } from '@/store/useStore';
import { roteiroApi } from '@/services/api';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { getDestination } from '@/data/mockData';
import type { Roteiro } from '@/types/index';
import PageTransition from '@/components/PageTransition';
import AppLayout from '@/components/AppLayout';

export default function ActivityDetail() {
  const { id } = useParams<{ id: string }>();
  const activity = getActivity(id || '');
  const { itineraries, updateItinerary, user } = useStore();
  const [imgIdx, setImgIdx] = useState(0);
  const [addOpen, setAddOpen] = useState(false);
  const [selectedIt, setSelectedIt] = useState('');
  const [selectedDay, setSelectedDay] = useState(0);
  const [roteiros, setRoteiros] = useState<Roteiro[]>([]);

  useEffect(() => {
    if (!user) return;
    roteiroApi.listarPorUsuario(user.id)
      .then(res => setRoteiros(res.data))
      .catch(() => {});
  }, [user]);

  const listaItinerarios = itineraries.length > 0 ? itineraries : roteiros.map(r => ({
    id: String(r.id),
    destinationId: String(r.destino.id),
    departureDate: r.dataIda,
    returnDate: r.dataVolta,
    days: Array.from({ length: r.totalDias }, (_, i) => ({ dayNumber: i + 1, date: '', activityIds: [] })),
    createdAt: '',
  }));

  if (!activity) return <AppLayout><div className="p-12 text-center text-muted-foreground">Atividade não encontrada.</div></AppLayout>;

  const handleAdd = () => {
    const it = itineraries.find(i => i.id === selectedIt);
    if (!it) return;
    const day = it.days[selectedDay];
    if (day.activityIds.length >= 5) {
      toast.error('Dia cheio (máximo 5 atividades)');
      return;
    }
    if (day.activityIds.includes(activity.id)) {
      toast.error('Atividade já adicionada neste dia');
      return;
    }
    const newDays = it.days.map((d, i) =>
      i === selectedDay ? { ...d, activityIds: [...d.activityIds, activity.id] } : d
    );
    updateItinerary(it.id, newDays);
    toast.success(`Adicionada ao Dia ${day.dayNumber}`);
    setAddOpen(false);
  };

  const destination = getDestination(activity.destinationId);

  return (
    <AppLayout>
      <PageTransition>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Breadcrumb className="mb-6">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/matches">Destinos</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              {destination && (
                <>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <span className="text-muted-foreground">{destination.name}</span>
                  </BreadcrumbItem>
                </>
              )}
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{activity.name}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          {/* Gallery */}
          <div className="relative rounded-lg overflow-hidden aspect-[16/9] mb-8">
            <img
              src={activity.images[imgIdx]}
              alt={activity.name}
              className="w-full h-full object-cover"
            />
            {activity.images.length > 1 && (
              <>
                <button
                  onClick={() => setImgIdx(i => (i - 1 + activity.images.length) % activity.images.length)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background transition-colors"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setImgIdx(i => (i + 1) % activity.images.length)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background transition-colors"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {activity.images.map((_, i) => (
                    <div
                      key={i}
                      className={`w-2 h-2 rounded-full transition-colors ${i === imgIdx ? 'bg-primary-foreground' : 'bg-primary-foreground/40'}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="flex gap-2 mb-2">
                <Badge variant="secondary" className="rounded-full">{activity.category}</Badge>
                <Badge variant="outline" className="rounded-full capitalize">{activity.shift}</Badge>
              </div>
              <h1 className="font-display text-3xl font-semibold mb-1">{activity.name}</h1>
            </div>
            <Button onClick={() => setAddOpen(true)} className="rounded-full bg-accent text-accent-foreground hover:bg-accent/90">
              <Plus className="h-4 w-4 mr-1" /> Adicionar ao roteiro
            </Button>
          </div>

          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <div className="flex items-center gap-2 text-sm font-body bg-surface rounded-lg p-4">
              <Clock className="h-4 w-4 text-primary" /> {activity.duration}
            </div>
            <div className="flex items-center gap-2 text-sm font-body bg-surface rounded-lg p-4">
              <MapPin className="h-4 w-4 text-primary" /> {activity.address}
            </div>
            <div className="flex items-center gap-2 text-sm font-body bg-surface rounded-lg p-4">
              <Lightbulb className="h-4 w-4 text-highlight" /> {activity.tips}
            </div>
          </div>

          <div className="prose max-w-none">
            <p className="font-body text-base text-foreground leading-relaxed">{activity.description}</p>
          </div>
        </div>

        {/* Add Modal */}
        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="font-display">Adicionar ao roteiro</DialogTitle>
            </DialogHeader>
            {listaItinerarios.length === 0 ? (
              <p className="text-sm text-muted-foreground">Você ainda não tem roteiros. Crie um primeiro.</p>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="font-body text-sm font-medium">Selecionar roteiro</label>
                  <div className="space-y-1">
                    {listaItinerarios.map(it => {
                      const d = getDestination(it.destinationId);
                      return (
                        <button
                          key={it.id}
                          onClick={() => { setSelectedIt(it.id); setSelectedDay(0); }}
                          className={`w-full text-left p-3 rounded-lg text-sm font-body transition-colors ${
                            selectedIt === it.id ? 'bg-primary text-primary-foreground' : 'bg-surface hover:bg-surface/80'
                          }`}
                        >
                          {d?.name} · {it.days.length} {it.days.length === 1 ? 'dia' : 'dias'}
                        </button>
                      );
                    })}
                  </div>
                </div>
                {selectedIt && (
                  <div className="space-y-2">
                    <label className="font-body text-sm font-medium">Selecionar dia</label>
                    <div className="grid grid-cols-4 gap-2">
                      {listaItinerarios.find(i => i.id === selectedIt)?.days.map((day, i) => (
                        <button
                          key={day.dayNumber}
                          onClick={() => setSelectedDay(i)}
                          className={`p-2 rounded-lg text-xs font-body text-center transition-colors ${
                            i === selectedDay ? 'bg-primary text-primary-foreground' : 'bg-surface hover:bg-surface/80'
                          }`}
                        >
                          Dia {day.dayNumber}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                <Button onClick={handleAdd} disabled={!selectedIt} className="w-full rounded-full bg-accent text-accent-foreground hover:bg-accent/90">
                  Adicionar atividade
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </PageTransition>
    </AppLayout>
  );
}
