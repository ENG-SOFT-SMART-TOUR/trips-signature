import { lazy, Suspense, useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, CalendarRange, Download, Edit, FileText, List, MapPin, Printer } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import PageTransition from '@/components/PageTransition';
import AppLayout from '@/components/AppLayout';
import ActivityCard from '@/components/ActivityCard';
import { roteiroApi, atividadeApi, roteiroAtividadeApi } from '@/services/api';
import { useItineraryDays } from '@/hooks/useItineraryDays';
import { formatarDia } from '@/lib/dateUtils';
import type { Roteiro, Atividade } from '@/types/index';
import type { MapProvider } from '@/components/map/MapProvider';

// Lazy-load: o chunk do mapa (leaflet) só é baixado ao abrir a aba Mapa (RNF de carga < 3s)
const ItineraryMap = lazy(() => import('@/components/ItineraryMap'));
// A tela (camada de composição) escolhe o provider concreto; o ItineraryMap só conhece o contrato.
const LeafletMapProvider = lazy(() => import('@/components/map/LeafletMapProvider')) as MapProvider;

export default function ViewItinerary() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { itineraries, updateItinerary, addItinerary, user } = useStore();

  const [roteiro, setRoteiro] = useState<Roteiro | null>(null);
  const [atividades, setAtividades] = useState<Atividade[]>([]);
  const [loading, setLoading] = useState(true);
  const [exportOpen, setExportOpen] = useState(false);
  const [openDays, setOpenDays] = useState<number[]>([1]);

  const itinerary = itineraries.find(it => it.id === id);

  useEffect(() => {
    const numId = Number(id);

    if (itinerary) setLoading(false);

    if (isNaN(numId) || !user) { setLoading(false); return; }

    const destinoId = Number(itinerary?.destinationId);

    const atividadesPromise = !isNaN(destinoId)
      ? atividadeApi.listarPorDestino(destinoId)
      : roteiroApi.buscarPorId(numId).then(r => atividadeApi.listarPorDestino(r.data.destino.id));

    Promise.all([
      roteiroApi.buscarPorId(numId),
      atividadesPromise,
      roteiroAtividadeApi.listar(numId, user.id),
    ])
      .then(([roteiroRes, atividadesRes, diasRes]) => {
        setRoteiro(roteiroRes.data);
        setAtividades(atividadesRes.data);
        const actsByDay: Record<number, string[]> = {};
        for (const ra of diasRes.data as { atividadeId: number; diaNumero: number }[]) {
          if (!actsByDay[ra.diaNumero]) actsByDay[ra.diaNumero] = [];
          actsByDay[ra.diaNumero].push(String(ra.atividadeId));
        }
        const dep = new Date(roteiroRes.data.dataIda + 'T00:00:00');
        const days = Array.from({ length: roteiroRes.data.totalDias }, (_, i) => {
          const date = new Date(dep);
          date.setDate(date.getDate() + i);
          const iso = date.toISOString().split('T')[0];
          return { dayNumber: i + 1, date: iso, activityIds: actsByDay[i + 1] ?? [] };
        });
        if (itinerary) {
          updateItinerary(itinerary.id, days);
        } else {
          addItinerary({
            id: String(numId),
            destinationId: String(roteiroRes.data.destino.id),
            departureDate: roteiroRes.data.dataIda,
            returnDate: roteiroRes.data.dataVolta,
            days,
            createdAt: new Date().toISOString(),
          });
        }
      })
      .catch(() => toast.error('Erro ao carregar o roteiro'))
      .finally(() => setLoading(false));
  }, [id, user]);

  const getAtividade = (aid: string) => atividades.find(a => String(a.id) === aid);

  const dias = useItineraryDays(roteiro, itinerary);

  const destNome  = roteiro?.destino.nome  ?? 'Desconhecido';
  const destPais  = roteiro?.destino.pais  ?? '';
  const destFoto  = roteiro?.destino.foto  ?? '';
  const dataIda   = roteiro?.dataIda   ?? itinerary?.departureDate ?? '';
  const dataVolta = roteiro?.dataVolta ?? itinerary?.returnDate    ?? '';

  const totalAtividades = dias.reduce((s, d) => s + d.activityIds.length, 0);

  const toggleDay = (n: number) =>
    setOpenDays(prev => prev.includes(n) ? prev.filter(d => d !== n) : [...prev, n]);

  const fullExportText = [
    `${destNome} — ${destPais}`,
    `${dataIda} → ${dataVolta} · ${dias.length} ${dias.length === 1 ? 'dia' : 'dias'}`,
    '',
    ...dias.map(day => {
      const acts = day.activityIds.map(aid => getAtividade(aid)).filter(Boolean);
      const header = `Dia ${day.dayNumber} — ${day.date}`;
      const lines = acts.length > 0
        ? acts.map(a => `  • ${a!.nome} (${a!.turno}, ${a!.duracao})`)
        : ['  Nenhuma atividade planejada'];
      return [header, ...lines].join('\n');
    }),
  ].join('\n\n');

  const handleDownload = () => {
    const blob = new Blob([fullExportText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${destNome.replace(/\s+/g, '-')}-itinerary.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    const diasHtml = dias.map(day => {
      const acts = day.activityIds.map(aid => getAtividade(aid)).filter(Boolean);
      const actsHtml = acts.length > 0
        ? acts.map(a => `<li><strong>${a!.nome}</strong> &mdash; ${a!.turno}, ${a!.duracao}</li>`).join('')
        : '<li style="color:#888">Nenhuma atividade planejada</li>';
      return `
        <div class="day">
          <h3>Dia ${day.dayNumber} <span class="date">${day.date}</span></h3>
          <ul>${actsHtml}</ul>
        </div>`;
    }).join('');

    const win = window.open('', '_blank');
    if (!win) return;
    win.document.write(`<!DOCTYPE html><html><head>
      <title>${destNome} — Roteiro</title>
      <style>
        body { font-family: Georgia, serif; max-width: 700px; margin: 40px auto; color: #1a1a1a; }
        h1 { font-size: 28px; margin-bottom: 4px; }
        .subtitle { color: #666; font-size: 14px; margin-bottom: 32px; }
        .day { margin-bottom: 24px; border-top: 1px solid #ddd; padding-top: 16px; }
        h3 { font-size: 16px; margin: 0 0 8px; }
        .date { font-weight: normal; color: #888; font-size: 14px; margin-left: 8px; }
        ul { margin: 0; padding-left: 20px; }
        li { font-size: 14px; margin-bottom: 4px; }
        @media print { body { margin: 20px; } }
      </style>
    </head><body>
      <h1>${destNome}</h1>
      <p class="subtitle">${destPais} &nbsp;·&nbsp; ${dataIda} → ${dataVolta} &nbsp;·&nbsp; ${dias.length} ${dias.length === 1 ? 'dia' : 'dias'}</p>
      ${diasHtml}
    </body></html>`);
    win.document.close();
    win.print();
  };

  if (!itinerary && loading) {
    return (
      <AppLayout>
        <Skeleton className="h-64 md:h-80 w-full rounded-none" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-4">
          <Skeleton className="h-40 w-full rounded-2xl" />
          <Skeleton className="h-10 w-48 rounded-full" />
          <Skeleton className="h-20 w-full rounded-xl" />
          <Skeleton className="h-20 w-full rounded-xl" />
          <Skeleton className="h-20 w-full rounded-xl" />
        </div>
      </AppLayout>
    );
  }

  if (!roteiro && !itinerary) {
    return (
      <AppLayout>
        <div className="p-12 text-center text-muted-foreground font-body">Roteiro não encontrado.</div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <PageTransition>
        {/* Banner */}
        <div className="relative h-64 md:h-80 overflow-hidden">
          {destFoto ? (
            <img src={destFoto} alt={destNome} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-surface" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6">
            <h1 className="font-display text-3xl md:text-4xl font-semibold text-foreground">{destNome}</h1>
            <p className="font-body text-sm text-muted-foreground flex items-center gap-1 mt-1">
              <MapPin className="h-3 w-3" /> {destPais}
            </p>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
          {/* Summary */}
          <div className="rounded-2xl bg-surface border border-border/40 p-6 mb-8">
            <div className="flex items-start justify-between gap-4 mb-5">
              <div>
                <span className="font-body text-xs tracking-[0.2em] uppercase text-primary mb-1 block">
                  {roteiro?.destino.categoria ?? 'Viagem'}
                </span>
                <h2 className="font-display text-2xl font-semibold">{destNome}</h2>
                <p className="font-body text-sm text-muted-foreground flex items-center gap-1 mt-1">
                  <MapPin className="h-3 w-3" /> {destPais}
                </p>
              </div>
              <div className="flex gap-2 shrink-0">
                <Button variant="ghost" size="sm" onClick={() => navigate(`/itinerary/${id}/edit`)} className="rounded-full text-sm">
                  <Edit className="h-4 w-4 mr-1" /> Editar
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setExportOpen(true)} className="rounded-full text-sm">
                  <FileText className="h-4 w-4 mr-1" /> Exportar
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-xl bg-background p-4 flex flex-col gap-1">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <CalendarRange className="h-4 w-4" />
                  <span className="font-body text-xs uppercase tracking-wide">Período</span>
                </div>
                <span className="font-display text-base font-semibold">{dataIda}</span>
                <span className="font-body text-xs text-muted-foreground">→ {dataVolta}</span>
              </div>

              <div className="rounded-xl bg-background p-4 flex flex-col gap-1">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Calendar className="h-4 w-4" />
                  <span className="font-body text-xs uppercase tracking-wide">Duração</span>
                </div>
                <span className="font-display text-3xl font-semibold leading-none">{dias.length}</span>
                <span className="font-body text-xs text-muted-foreground">
                  {dias.length === 1 ? 'dia' : 'dias'}
                </span>
              </div>

              <div className="rounded-xl bg-background p-4 flex flex-col gap-1">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <List className="h-4 w-4" />
                  <span className="font-body text-xs uppercase tracking-wide">Atividades</span>
                </div>
                <span className="font-display text-3xl font-semibold leading-none">{totalAtividades}</span>
                <span className="font-body text-xs text-muted-foreground">
                  {totalAtividades === 1 ? 'atividade' : 'atividades'}
                </span>
              </div>
            </div>
          </div>

          <Tabs defaultValue="list" className="w-full">
            <TabsList className="bg-surface rounded-full p-1 mb-8">
              <TabsTrigger value="list" className="rounded-full text-sm font-body">Lista</TabsTrigger>
              <TabsTrigger value="map" className="rounded-full text-sm font-body">Mapa</TabsTrigger>
            </TabsList>

            <TabsContent value="list" className="space-y-3">
              {dias.map(day => {
                const acts = day.activityIds.map(aid => getAtividade(aid)).filter(Boolean);
                const isOpen = openDays.includes(day.dayNumber);
                return (
                  <div key={day.dayNumber} className="rounded-xl bg-surface overflow-hidden border border-border/40">
                    <button
                      onClick={() => toggleDay(day.dayNumber)}
                      className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-surface/80 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <span className="font-body text-xs font-semibold text-primary">{day.dayNumber}</span>
                        </div>
                        <div>
                          <span className="font-display text-base font-semibold capitalize">
                            {formatarDia(day.date)}
                          </span>
                          <span className="font-body text-xs text-muted-foreground ml-2">
                            {acts.length > 0 ? `${acts.length} ${acts.length === 1 ? 'atividade' : 'atividades'}` : 'Sem atividades'}
                          </span>
                        </div>
                      </div>
                      <Link
                        to={`/itinerary/${id}/day/${day.dayNumber}`}
                        onClick={e => e.stopPropagation()}
                        className="text-xs text-primary font-body hover:underline shrink-0"
                      >
                        Detalhes →
                      </Link>
                    </button>

                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        transition={{ duration: 0.2 }}
                        className="border-t border-border/40"
                      >
                        {acts.length === 0 ? (
                          <p className="px-5 py-4 text-sm text-muted-foreground font-body">
                            Nenhuma atividade planejada para este dia.
                          </p>
                        ) : (
                          <div className="px-5 py-4 space-y-3">
                            {acts.map((act, i) => act && (
                              <div key={act.id}>
                                <ActivityCard atividade={act} variant="compact" />
                                {i < acts.length - 1 && (
                                  <div className="flex items-center gap-2 py-1 pl-4">
                                    <div className="h-5 w-px bg-border ml-6" />
                                    <span className="text-xs text-muted-foreground font-body">~15 min de deslocamento</span>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </motion.div>
                    )}
                  </div>
                );
              })}
            </TabsContent>

            <TabsContent value="map">
              <Suspense fallback={<Skeleton className="h-[500px] w-full rounded-lg" />}>
                <ItineraryMap days={dias} atividades={atividades} provider={LeafletMapProvider} />
              </Suspense>
            </TabsContent>
          </Tabs>
        </div>

        {/* Export Modal */}
        <Dialog open={exportOpen} onOpenChange={setExportOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="font-display">Exportar roteiro</DialogTitle>
            </DialogHeader>
            <pre className="text-xs font-body whitespace-pre-wrap bg-surface rounded-lg p-4 max-h-72 overflow-y-auto">
              {fullExportText}
            </pre>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => { navigator.clipboard.writeText(fullExportText); toast.success('Copiado para a área de transferência!'); }}
                className="flex-1 rounded-full"
              >
                <FileText className="h-4 w-4 mr-2" /> Copiar
              </Button>
              <Button
                variant="outline"
                onClick={handleDownload}
                className="flex-1 rounded-full"
              >
                <Download className="h-4 w-4 mr-2" /> Baixar .txt
              </Button>
              <Button
                onClick={handlePrint}
                className="flex-1 rounded-full bg-primary text-primary-foreground"
              >
                <Printer className="h-4 w-4 mr-2" /> Imprimir
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </PageTransition>
    </AppLayout>
  );
}
