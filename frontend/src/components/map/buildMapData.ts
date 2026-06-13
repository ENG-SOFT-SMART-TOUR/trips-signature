import type { ItineraryDay } from '@/store/useStore';
import type { Atividade } from '@/types/index';
import type { LatLng, MapPin, MapRoute } from '@/components/map/MapProvider';

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

export interface MapData {
  pins: MapPin[];
  routes: MapRoute[];
}

// Função pura: monta pins e traçados do mapa a partir dos dias do roteiro e das
// atividades do destino. Atividades sem coordenada são ignoradas; traçado só
// existe para dias com 2+ atividades posicionadas.
export function buildMapData(days: ItineraryDay[], atividades: Atividade[]): MapData {
  const pins: MapPin[] = [];
  const routes: MapRoute[] = [];
  const atividadesPorId = new Map(atividades.map(a => [String(a.id), a]));

  days.forEach((day) => {
    const color = getDayColor(day.dayNumber);
    const dayPositions: LatLng[] = [];

    day.activityIds.forEach((aid, actIdx) => {
      const act = atividadesPorId.get(aid);
      if (!act || act.latitude == null || act.longitude == null) return;
      const position: LatLng = { lat: act.latitude, lng: act.longitude };
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
      routes.push({ positions: dayPositions, color, diaNumero: day.dayNumber });
    }
  });

  return { pins, routes };
}
