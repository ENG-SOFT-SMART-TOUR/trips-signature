import { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import { getActivity } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Clock, ArrowLeft, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import PageTransition from '@/components/PageTransition';
import AppLayout from '@/components/AppLayout';
import { roteiroApi } from '@/services/api';
import type { Roteiro } from '@/types/index';

function formatarDia(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('pt-BR', {
    weekday: 'long', day: '2-digit', month: 'long',
  });
}

export default function DayPreview() {
  const { id, dayNumber } = useParams<{ id: string; dayNumber: string }>();
  const navigate = useNavigate();
  const { itineraries } = useStore();

  const [roteiro, setRoteiro] = useState<Roteiro | null>(null);
  const dayNum = parseInt(dayNumber || '1');
  const itinerary = itineraries.find(it => it.id === id);

  useEffect(() => {
    const numId = Number(id);
    if (isNaN(numId)) return;
    roteiroApi.buscarPorId(numId)
      .then(res => setRoteiro(res.data))
      .catch(() => {});
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

  const day = dias.find(d => d.dayNumber === dayNum);
  const destNome = roteiro?.destino.nome ?? 'Unknown';
  const destPais = roteiro?.destino.pais ?? '';
  const acts = day?.activityIds.map(aid => getActivity(aid)).filter(Boolean) ?? [];
  const hasPrev = dayNum > 1;
  const hasNext = dayNum < dias.length;

  if (!day && !itinerary) {
    return (
      <AppLayout>
        <div className="p-12 text-center text-muted-foreground font-body">Not found.</div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <PageTransition>
        <div className="max-w-3xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button variant="ghost" onClick={() => navigate(`/itinerary/${id}`)} className="rounded-full">
              <ArrowLeft className="h-4 w-4 mr-1" /> Back
            </Button>
            <div>
              <h1 className="font-display text-2xl font-semibold capitalize">
                {day ? formatarDia(day.date) : `Day ${dayNum}`}
              </h1>
              <p className="font-body text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                <MapPin className="h-3 w-3" /> {destNome}{destPais ? `, ${destPais}` : ''}
              </p>
            </div>
          </div>

          {/* Timeline */}
          <div className="space-y-4">
            {acts.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground text-sm font-body">
                No activities planned for this day.
              </div>
            ) : (
              acts.map((act, i) => act && (
                <div key={act.id}>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                  >
                    <Link to={`/activity/${act.id}`} className="block group hover-lift">
                      <div className="rounded-xl overflow-hidden bg-surface border border-border/40">
                        <img
                          src={act.images[0]}
                          alt={act.name}
                          className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="p-5">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <Badge variant="secondary" className="rounded-full text-xs">{act.category}</Badge>
                            <span className="text-xs text-muted-foreground capitalize font-body">{act.shift}</span>
                            <span className="text-xs text-muted-foreground flex items-center gap-0.5">
                              <Clock className="h-3 w-3" /> {act.duration}
                            </span>
                          </div>
                          <h3 className="font-display text-lg font-semibold mb-1">{act.name}</h3>
                          <p className="font-body text-xs text-muted-foreground line-clamp-2">{act.description}</p>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                  {i < acts.length - 1 && (
                    <div className="flex items-center justify-center py-3 gap-3">
                      <div className="h-6 w-px bg-border" />
                      <span className="text-xs text-muted-foreground font-body">~15 min travel</span>
                      <div className="h-6 w-px bg-border" />
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Day navigation */}
          <div className="flex justify-between mt-10">
            <Button
              variant="ghost"
              disabled={!hasPrev}
              onClick={() => navigate(`/itinerary/${id}/day/${dayNum - 1}`)}
              className="rounded-full"
            >
              <ChevronLeft className="h-4 w-4 mr-1" /> Day {dayNum - 1}
            </Button>
            <Button
              variant="ghost"
              disabled={!hasNext}
              onClick={() => navigate(`/itinerary/${id}/day/${dayNum + 1}`)}
              className="rounded-full"
            >
              Day {dayNum + 1} <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      </PageTransition>
    </AppLayout>
  );
}
