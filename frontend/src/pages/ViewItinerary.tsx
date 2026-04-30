import { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import { getActivity } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, CalendarRange, Clock, Download, Edit, FileText, List, MapPin, Printer } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import PageTransition from '@/components/PageTransition';
import AppLayout from '@/components/AppLayout';
import ItineraryMap from '@/components/ItineraryMap';
import { roteiroApi } from '@/services/api';
import type { Roteiro } from '@/types/index';

function formatarDia(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('pt-BR', {
    weekday: 'long', day: '2-digit', month: 'long',
  });
}

export default function ViewItinerary() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { itineraries } = useStore();

  const [roteiro, setRoteiro] = useState<Roteiro | null>(null);
  const [loading, setLoading] = useState(true);
  const [exportOpen, setExportOpen] = useState(false);
  const [openDays, setOpenDays] = useState<number[]>([1]);

  const itinerary = itineraries.find(it => it.id === id);

  useEffect(() => {
    const numId = Number(id);

    // Se o roteiro já está no Zustand, exibe imediatamente sem spinner
    if (itinerary) setLoading(false);

    if (isNaN(numId)) { setLoading(false); return; }

    // Busca em background — atualiza dados sem bloquear a tela
    roteiroApi.buscarPorId(numId)
      .then(res => setRoteiro(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const dias = useMemo(() => {
    if (roteiro) {
      const dep = new Date(roteiro.dataIda + 'T00:00:00');
      return Array.from({ length: roteiro.totalDias }, (_, i) => {
        const date = new Date(dep);
        date.setDate(date.getDate() + i);
        const iso = date.toISOString().split('T')[0];
        const existing = itinerary?.days.find(d => d.date === iso);
        return { dayNumber: i + 1, date: iso, activityIds: existing?.activityIds ?? [] };
      });
    }
    return itinerary?.days ?? [];
  }, [roteiro, itinerary]);

  const destNome  = roteiro?.destino.nome  ?? 'Unknown';
  const destPais  = roteiro?.destino.pais  ?? '';
  const destFoto  = roteiro?.destino.foto  ?? '';
  const dataIda   = roteiro?.dataIda   ?? itinerary?.departureDate ?? '';
  const dataVolta = roteiro?.dataVolta ?? itinerary?.returnDate    ?? '';

  const totalAtividades = dias.reduce((s, d) => s + d.activityIds.length, 0);

  const toggleDay = (n: number) =>
    setOpenDays(prev => prev.includes(n) ? prev.filter(d => d !== n) : [...prev, n]);

  const fullExportText = [
    `${destNome} — ${destPais}`,
    `${dataIda} → ${dataVolta} · ${dias.length} ${dias.length === 1 ? 'day' : 'days'}`,
    '',
    ...dias.map(day => {
      const acts = day.activityIds.map(aid => getActivity(aid)).filter(Boolean);
      const header = `Day ${day.dayNumber} — ${day.date}`;
      const lines = acts.length > 0
        ? acts.map(a => `  • ${a!.name} (${a!.shift}, ${a!.duration})`)
        : ['  No activities planned'];
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
      const acts = day.activityIds.map(aid => getActivity(aid)).filter(Boolean);
      const actsHtml = acts.length > 0
        ? acts.map(a => `<li><strong>${a!.name}</strong> &mdash; ${a!.shift}, ${a!.duration}</li>`).join('')
        : '<li style="color:#888">No activities planned</li>';
      return `
        <div class="day">
          <h3>Day ${day.dayNumber} <span class="date">${day.date}</span></h3>
          <ul>${actsHtml}</ul>
        </div>`;
    }).join('');

    const win = window.open('', '_blank');
    if (!win) return;
    win.document.write(`<!DOCTYPE html><html><head>
      <title>${destNome} — Itinerary</title>
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
      <p class="subtitle">${destPais} &nbsp;·&nbsp; ${dataIda} → ${dataVolta} &nbsp;·&nbsp; ${dias.length} days</p>
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
        <div className="p-12 text-center text-muted-foreground font-body">Itinerary not found.</div>
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
                  {roteiro?.destino.categoria ?? 'Trip'}
                </span>
                <h2 className="font-display text-2xl font-semibold">{destNome}</h2>
                <p className="font-body text-sm text-muted-foreground flex items-center gap-1 mt-1">
                  <MapPin className="h-3 w-3" /> {destPais}
                </p>
              </div>
              <div className="flex gap-2 shrink-0">
                <Button variant="ghost" size="sm" onClick={() => navigate(`/itinerary/${id}/edit`)} className="rounded-full text-sm">
                  <Edit className="h-4 w-4 mr-1" /> Edit
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setExportOpen(true)} className="rounded-full text-sm">
                  <FileText className="h-4 w-4 mr-1" /> Export
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-xl bg-background p-4 flex flex-col gap-1">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <CalendarRange className="h-4 w-4" />
                  <span className="font-body text-xs uppercase tracking-wide">Period</span>
                </div>
                <span className="font-display text-base font-semibold">{dataIda}</span>
                <span className="font-body text-xs text-muted-foreground">→ {dataVolta}</span>
              </div>

              <div className="rounded-xl bg-background p-4 flex flex-col gap-1">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Calendar className="h-4 w-4" />
                  <span className="font-body text-xs uppercase tracking-wide">Duration</span>
                </div>
                <span className="font-display text-3xl font-semibold leading-none">{dias.length}</span>
                <span className="font-body text-xs text-muted-foreground">
                  {dias.length === 1 ? 'day' : 'days'}
                </span>
              </div>

              <div className="rounded-xl bg-background p-4 flex flex-col gap-1">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <List className="h-4 w-4" />
                  <span className="font-body text-xs uppercase tracking-wide">Activities</span>
                </div>
                <span className="font-display text-3xl font-semibold leading-none">{totalAtividades}</span>
                <span className="font-body text-xs text-muted-foreground">
                  {totalAtividades === 1 ? 'activity' : 'activities'}
                </span>
              </div>
            </div>
          </div>

          <Tabs defaultValue="list" className="w-full">
            <TabsList className="bg-surface rounded-full p-1 mb-8">
              <TabsTrigger value="list" className="rounded-full text-sm font-body">List View</TabsTrigger>
              <TabsTrigger value="map" className="rounded-full text-sm font-body">Map View</TabsTrigger>
            </TabsList>

            <TabsContent value="list" className="space-y-3">
              {dias.map(day => {
                const acts = day.activityIds.map(aid => getActivity(aid)).filter(Boolean);
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
                            {acts.length > 0 ? `${acts.length} activit${acts.length === 1 ? 'y' : 'ies'}` : 'No activities'}
                          </span>
                        </div>
                      </div>
                      <Link
                        to={`/itinerary/${id}/day/${day.dayNumber}`}
                        onClick={e => e.stopPropagation()}
                        className="text-xs text-primary font-body hover:underline shrink-0"
                      >
                        Details →
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
                            No activities planned for this day.
                          </p>
                        ) : (
                          <div className="px-5 py-4 space-y-3">
                            {acts.map((act, i) => act && (
                              <div key={act.id}>
                                <Link
                                  to={`/activity/${act.id}`}
                                  className="flex items-center gap-4 p-3 rounded-lg hover:bg-card transition-colors"
                                >
                                  <img
                                    src={act.images[0]}
                                    alt={act.name}
                                    className="w-14 h-14 rounded-lg object-cover shrink-0"
                                  />
                                  <div className="flex-1 min-w-0">
                                    <span className="font-body text-sm font-medium block truncate">{act.name}</span>
                                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                                      <Badge variant="secondary" className="text-xs rounded-full">{act.category}</Badge>
                                      <span className="text-xs text-muted-foreground capitalize">{act.shift}</span>
                                      <span className="text-xs text-muted-foreground flex items-center gap-0.5">
                                        <Clock className="h-3 w-3" /> {act.duration}
                                      </span>
                                    </div>
                                  </div>
                                </Link>
                                {i < acts.length - 1 && (
                                  <div className="flex items-center gap-2 py-1 pl-4">
                                    <div className="h-5 w-px bg-border ml-6" />
                                    <span className="text-xs text-muted-foreground font-body">~15 min travel</span>
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
              <ItineraryMap days={itinerary?.days ?? []} destinationName={destNome} />
            </TabsContent>
          </Tabs>
        </div>

        {/* Export Modal */}
        <Dialog open={exportOpen} onOpenChange={setExportOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="font-display">Export Itinerary</DialogTitle>
            </DialogHeader>
            <pre className="text-xs font-body whitespace-pre-wrap bg-surface rounded-lg p-4 max-h-72 overflow-y-auto">
              {fullExportText}
            </pre>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => { navigator.clipboard.writeText(fullExportText); toast.success('Copied to clipboard!'); }}
                className="flex-1 rounded-full"
              >
                <FileText className="h-4 w-4 mr-2" /> Copy
              </Button>
              <Button
                variant="outline"
                onClick={handleDownload}
                className="flex-1 rounded-full"
              >
                <Download className="h-4 w-4 mr-2" /> Download .txt
              </Button>
              <Button
                onClick={handlePrint}
                className="flex-1 rounded-full bg-primary text-primary-foreground"
              >
                <Printer className="h-4 w-4 mr-2" /> Print
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </PageTransition>
    </AppLayout>
  );
}
