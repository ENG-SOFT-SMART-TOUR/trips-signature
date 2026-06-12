import { lazy, Suspense, useMemo, useState } from 'react';
import type { ItineraryDay } from '@/store/useStore';
import type { Atividade } from '@/types/index';
import type { MapMarker, MapPolyline, MapPosition } from './map/MapProvider';

const LeafletMapProvider = lazy(() => import('./map/LeafletMapProvider'));

const DAY_COLORS = [
  '#2563eb',
  '#7c3aed',
  '#db2777',
  '#ea580c',
  '#ca8a04',
  '#16a34a',
  '#0891b2',
  '#4f46e5',
  '#dc2626',
  '#059669',
];

function getDayColor(dayNumber: number): string {
  return DAY_COLORS[(dayNumber - 1) % DAY_COLORS.length];
}

interface ItineraryMapProps {
  days: ItineraryDay[];
  atividades: Atividade[];
  destinationName?: string;
}

function hasCoordinates(atividade: Atividade): atividade is Atividade & { latitude: number; longitude: number } {
  return Number.isFinite(atividade.latitude) && Number.isFinite(atividade.longitude);
}

export default function ItineraryMap({ days, atividades }: ItineraryMapProps) {
  const [selectedDay, setSelectedDay] = useState<number | 'all'>('all');

  const { markers, polylines, positions, daySummaries } = useMemo(() => {
    const atividadesPorId = new Map(atividades.map(atividade => [String(atividade.id), atividade]));
    const markers: MapMarker[] = [];
    const polylines: MapPolyline[] = [];
    const positions: MapPosition[] = [];
    const daySummaries: { dayNumber: number; color: string; totalPins: number }[] = [];

    days.forEach(day => {
      const color = getDayColor(day.dayNumber);
      const dayPositions: MapPosition[] = [];

      day.activityIds.forEach(activityId => {
        const atividade = atividadesPorId.get(activityId);
        if (!atividade || !hasCoordinates(atividade)) return;

        const position: MapPosition = [atividade.latitude, atividade.longitude];
        const label = `${dayPositions.length + 1}`;

        markers.push({
          id: `${day.dayNumber}-${atividade.id}`,
          position,
          color,
          label,
          nome: atividade.nome,
          turno: atividade.turno,
          duracao: atividade.duracao,
          diaNumero: day.dayNumber,
        });
        dayPositions.push(position);
        positions.push(position);
      });

      daySummaries.push({
        dayNumber: day.dayNumber,
        color,
        totalPins: dayPositions.length,
      });

      if (dayPositions.length > 1) {
        polylines.push({
          id: `dia-${day.dayNumber}`,
          positions: dayPositions,
          color,
        });
      }
    });

    return { markers, polylines, positions, daySummaries };
  }, [atividades, days]);

  const visibleMarkers = selectedDay === 'all'
    ? markers
    : markers.filter(marker => marker.diaNumero === selectedDay);

  const visiblePolylines = selectedDay === 'all'
    ? polylines
    : polylines.filter(polyline => polyline.id === `dia-${selectedDay}`);

  const visiblePositions = visibleMarkers.map(marker => marker.position);

  if (positions.length === 0) {
    return (
      <div className="rounded-lg bg-surface p-8 text-center min-h-[500px] flex items-center justify-center">
        <p className="text-sm text-muted-foreground font-body">
          Nenhuma atividade com localização para exibir no mapa.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg overflow-hidden relative" style={{ height: 500 }}>
      <div className="absolute top-3 left-3 z-[1000] bg-background/90 backdrop-blur-sm rounded-lg p-3 space-y-1.5">
        <span className="text-xs font-body font-medium text-foreground block mb-2">Dias</span>
        <button
          type="button"
          onClick={() => setSelectedDay('all')}
          className={`w-full flex items-center gap-2 rounded-md px-2 py-1 text-left transition-colors ${
            selectedDay === 'all' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-surface'
          }`}
        >
          <span className="w-2.5 h-2.5 rounded-full bg-foreground/40" />
          <span className="text-xs font-body">Todos · {markers.length} {markers.length === 1 ? 'parada' : 'paradas'}</span>
        </button>
        {daySummaries.map(day => {
          const selected = selectedDay === day.dayNumber;
          return (
            <button
              key={day.dayNumber}
              type="button"
              onClick={() => setSelectedDay(day.dayNumber)}
              className={`w-full flex items-center gap-2 rounded-md px-2 py-1 text-left transition-colors ${
                selected ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-surface'
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: day.color }} />
              <span className="text-xs font-body">
                Dia {day.dayNumber} · {day.totalPins} {day.totalPins === 1 ? 'parada' : 'paradas'}
              </span>
            </button>
          );
        })}
      </div>

      {visiblePositions.length === 0 ? (
        <div className="h-full w-full bg-surface flex items-center justify-center px-8 text-center">
          <span className="text-sm text-muted-foreground font-body">
            Nenhuma atividade com localização neste dia.
          </span>
        </div>
      ) : (
        <Suspense
          fallback={
            <div className="h-full w-full bg-surface flex items-center justify-center">
              <span className="text-sm text-muted-foreground font-body">Carregando mapa...</span>
            </div>
          }
        >
          <LeafletMapProvider
            markers={visibleMarkers}
            polylines={visiblePolylines}
            positions={visiblePositions}
          />
        </Suspense>
      )}
    </div>
  );
}
