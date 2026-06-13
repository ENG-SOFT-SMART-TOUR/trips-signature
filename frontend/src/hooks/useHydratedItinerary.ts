import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { atividadeApi, roteiroApi, roteiroAtividadeApi } from '@/services/api';
import { useStore } from '@/store/useStore';
import type { Itinerary, ItineraryDay } from '@/store/useStore';
import type { Atividade, Roteiro, RoteiroAtividadeResponse } from '@/types/index';

interface UseHydratedItineraryOptions {
  toastOnError?: boolean;
}

export function buildItineraryDays(roteiro: Roteiro, roteiroAtividades: RoteiroAtividadeResponse[]): ItineraryDay[] {
  const actsByDay: Record<number, string[]> = {};
  for (const ra of roteiroAtividades) {
    if (!actsByDay[ra.diaNumero]) actsByDay[ra.diaNumero] = [];
    actsByDay[ra.diaNumero].push(String(ra.atividadeId));
  }

  const dep = new Date(roteiro.dataIda + 'T00:00:00');
  return Array.from({ length: roteiro.totalDias }, (_, i) => {
    const date = new Date(dep);
    date.setDate(date.getDate() + i);
    return {
      dayNumber: i + 1,
      date: date.toISOString().split('T')[0],
      activityIds: actsByDay[i + 1] ?? [],
    };
  });
}

function saveItinerary(numId: number, roteiro: Roteiro, days: ItineraryDay[], current?: Itinerary) {
  const { addItinerary, updateItinerary } = useStore.getState();
  const currentItinerary = current ?? useStore.getState().itineraries.find(it => it.id === String(numId));

  if (currentItinerary) {
    updateItinerary(currentItinerary.id, days);
    return;
  }

  addItinerary({
    id: String(numId),
    destinationId: String(roteiro.destino.id),
    departureDate: roteiro.dataIda,
    returnDate: roteiro.dataVolta,
    days,
    createdAt: new Date().toISOString(),
  });
}

export function useHydratedItinerary(id?: string, options: UseHydratedItineraryOptions = {}) {
  const { user, itineraries } = useStore();
  const itinerary = itineraries.find(it => it.id === id);

  const [roteiro, setRoteiro] = useState<Roteiro | null>(null);
  const [atividades, setAtividades] = useState<Atividade[]>([]);
  const [days, setDays] = useState<ItineraryDay[]>(itinerary?.days ?? []);
  const [loading, setLoading] = useState(!itinerary);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const numId = Number(id);

    if (itinerary) {
      setDays(itinerary.days);
      setLoading(false);
    } else {
      setDays([]);
      setLoading(true);
    }

    if (isNaN(numId) || !user) {
      setLoading(false);
      setNotFound(!itinerary);
      return;
    }

    let cancelled = false;
    setNotFound(false);

    roteiroApi.buscarPorId(numId)
      .then(roteiroRes => {
        const roteiroData: Roteiro = roteiroRes.data;
        return Promise.all([
          Promise.resolve(roteiroData),
          atividadeApi.listarPorDestino(roteiroData.destino.id),
          roteiroAtividadeApi.listar(numId, user.id),
        ]);
      })
      .then(([roteiroData, atividadesRes, roteiroAtividadesRes]) => {
        if (cancelled) return;

        const builtDays = buildItineraryDays(roteiroData, roteiroAtividadesRes.data as RoteiroAtividadeResponse[]);
        setRoteiro(roteiroData);
        setAtividades(atividadesRes.data);
        setDays(builtDays);
        saveItinerary(numId, roteiroData, builtDays, itinerary);
      })
      .catch(() => {
        if (cancelled) return;

        setNotFound(true);
        if (options.toastOnError !== false) {
          toast.error('Erro ao carregar o roteiro');
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id, user?.id]);

  const persistDays = (newDays: ItineraryDay[]) => {
    setDays(newDays);
    const current = useStore.getState().itineraries.find(it => it.id === id);
    if (current) {
      useStore.getState().updateItinerary(current.id, newDays);
    }
  };

  return { roteiro, atividades, days, loading, notFound, itinerary, persistDays };
}
