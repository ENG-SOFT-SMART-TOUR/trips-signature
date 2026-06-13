import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { ChevronLeft, ChevronRight, ArrowLeft, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import PageTransition from '@/components/PageTransition';
import AppLayout from '@/components/AppLayout';
import ActivityCard from '@/components/ActivityCard';
import { useHydratedItinerary } from '@/hooks/useHydratedItinerary';
import { formatarDia } from '@/lib/dateUtils';
import type { Atividade } from '@/types/index';

export default function DayPreview() {
  const { id, dayNumber } = useParams<{ id: string; dayNumber: string }>();
  const navigate = useNavigate();
  const dayNum = parseInt(dayNumber || '1');

  // Falha de carga é silenciosa nesta tela (comportamento original): o gate
  // "Não encontrado" abaixo cobre o caso de não haver dados.
  const { roteiro, atividades, days: dias, itinerary } = useHydratedItinerary(id);

  const day = dias.find(d => d.dayNumber === dayNum);
  const destNome = roteiro?.destino.nome ?? 'Unknown';
  const destPais = roteiro?.destino.pais ?? '';
  const acts = day?.activityIds
    .map(aid => atividades.find(a => String(a.id) === aid))
    .filter(Boolean) as Atividade[] ?? [];
  const hasPrev = dayNum > 1;
  const hasNext = dayNum < dias.length;

  if (!day && !itinerary) {
    return (
      <AppLayout>
        <div className="p-12 text-center text-muted-foreground font-body">Não encontrado.</div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <PageTransition>
        <div className="max-w-3xl mx-auto px-4 py-8">
          <Breadcrumb className="mb-6">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/itineraries">Roteiros</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to={`/itinerary/${id}`}>{destNome}</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Dia {dayNum}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button variant="ghost" onClick={() => navigate(`/itinerary/${id}`)} className="rounded-full">
              <ArrowLeft className="h-4 w-4 mr-1" /> Voltar
            </Button>
            <div>
              <h1 className="font-display text-2xl font-semibold capitalize">
                {day ? formatarDia(day.date) : `Dia ${dayNum}`}
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
                Nenhuma atividade planejada para este dia.
              </div>
            ) : (
              acts.map((act, i) => (
                <div key={act.id}>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                  >
                    <ActivityCard atividade={act} variant="full" />
                  </motion.div>
                  {i < acts.length - 1 && (
                    <div className="flex items-center justify-center py-3 gap-3">
                      <div className="h-6 w-px bg-border" />
                      <span className="text-xs text-muted-foreground font-body">~15 min de deslocamento</span>
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
              <ChevronLeft className="h-4 w-4 mr-1" /> Dia {dayNum - 1}
            </Button>
            <Button
              variant="ghost"
              disabled={!hasNext}
              onClick={() => navigate(`/itinerary/${id}/day/${dayNum + 1}`)}
              className="rounded-full"
            >
              Dia {dayNum + 1} <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      </PageTransition>
    </AppLayout>
  );
}
