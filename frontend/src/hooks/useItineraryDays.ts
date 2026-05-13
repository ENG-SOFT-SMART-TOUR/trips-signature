import { useMemo } from 'react';
import type { Roteiro } from '@/types/index';
import type { Itinerary, ItineraryDay } from '@/store/useStore';

export function useItineraryDays(roteiro: Roteiro | null, itinerary: Itinerary | undefined): ItineraryDay[] {
  return useMemo(() => {
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
}
