import { useMemo } from 'react';
import type { ItineraryDay } from '@/store/useStore';
import type { Atividade } from '@/types/index';
import type { MapPin, MapProvider, MapRoute } from '@/components/map/MapProvider';
import LeafletMapProvider from '@/components/map/LeafletMapProvider';

// Day color palette — consistent across the app
const DAY_COLORS = [
  '#2563eb', // blue
  '#7c3aed', // purple
  '#db2777', // pink
  '#ea580c', // orange
  '#ca8a04', // yellow
  '#16a34a', // green
  '#0891b2', // cyan
  '#4f46e5', // indigo
  '#dc2626', // red
  '#059669', // emerald
];

export function getDayColor(dayNumber: number): string {
  return DAY_COLORS[(dayNumber - 1) % DAY_COLORS.length];
}

interface ItineraryMapProps {
  days: ItineraryDay[];
  atividades: Atividade[];
  provider?: MapProvider;
}

export default function ItineraryMap({ days, atividades, provider: Provider = LeafletMapProvider }: ItineraryMapProps) {
  const { pins, routes } = useMemo(() => {
    const pins: MapPin[] = [];
    const routes: MapRoute[] = [];

    days.forEach((day) => {
      const color = getDayColor(day.dayNumber);
      const dayPositions: [number, number][] = [];

      day.activityIds.forEach((aid, actIdx) => {
        const act = atividades.find(a => String(a.id) === aid);
        if (!act || act.latitude == null || act.longitude == null) return;
        const position: [number, number] = [act.latitude, act.longitude];
        pins.push({
          position,
          color,
          label: `${actIdx + 1}`,
          nome: act.nome,
          diaNumero: day.dayNumber,
          turno: act.turno,
          duracao: act.duracao,
        });
        dayPositions.push(position);
      });

      if (dayPositions.length > 1) {
        routes.push({ positions: dayPositions, color });
      }
    });

    return { pins, routes };
  }, [days, atividades]);

  if (pins.length === 0) {
    return (
      <div className="rounded-lg bg-surface p-8 text-center min-h-[500px] flex items-center justify-center">
        <p className="text-sm text-muted-foreground font-body">Nenhuma atividade com localização para exibir no mapa.</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg overflow-hidden relative" style={{ height: 500 }}>
      {/* Legenda */}
      <div className="absolute top-3 left-3 z-[1000] bg-background/90 backdrop-blur-sm rounded-lg p-3 space-y-1.5">
        <span className="text-xs font-body font-medium text-foreground block mb-2">Dias</span>
        {days.map(day => {
          const color = getDayColor(day.dayNumber);
          return (
            <div key={day.dayNumber} className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
              <span className="text-xs font-body text-muted-foreground">
                Dia {day.dayNumber} · {day.activityIds.length} {day.activityIds.length === 1 ? 'parada' : 'paradas'}
              </span>
            </div>
          );
        })}
      </div>

      <Provider pins={pins} routes={routes} />
    </div>
  );
}
