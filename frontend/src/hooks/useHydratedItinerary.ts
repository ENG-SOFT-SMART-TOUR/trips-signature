import { useEffect, useState } from 'react';
import { useStore } from '@/store/useStore';
import { roteiroApi, atividadeApi, roteiroAtividadeApi } from '@/services/api';
import { useItineraryDays } from '@/hooks/useItineraryDays';
import type { Atividade, Roteiro, RoteiroAtividadeResponse } from '@/types/index';
import type { ItineraryDay } from '@/store/useStore';

// Monta o array de dias do roteiro a partir das associações atividade↔dia da API.
function montarDias(roteiro: Roteiro, associacoes: RoteiroAtividadeResponse[]): ItineraryDay[] {
  const actsByDay: Record<number, string[]> = {};
  for (const ra of associacoes) {
    if (!actsByDay[ra.diaNumero]) actsByDay[ra.diaNumero] = [];
    actsByDay[ra.diaNumero].push(String(ra.atividadeId));
  }
  const dep = new Date(roteiro.dataIda + 'T00:00:00');
  return Array.from({ length: roteiro.totalDias }, (_, i) => {
    const date = new Date(dep);
    date.setDate(date.getDate() + i);
    return { dayNumber: i + 1, date: date.toISOString().split('T')[0], activityIds: actsByDay[i + 1] ?? [] };
  });
}

// Hidratação única de um roteiro (View/Edit/DayPreview): busca roteiro +
// atividades do destino + associações por dia, monta os dias e sincroniza o
// cache em memória do store. `days` cai para o cache do store enquanto a API
// não responde; `error` só liga em falha de fetch — cada tela decide como reagir.
export function useHydratedItinerary(id: string | undefined) {
  const { user, itineraries, updateItinerary, addItinerary } = useStore();
  const itinerary = itineraries.find(it => it.id === id);

  const [roteiro, setRoteiro] = useState<Roteiro | null>(null);
  const [atividades, setAtividades] = useState<Atividade[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const numId = Number(id);
    if (isNaN(numId) || !user) {
      setLoading(false);
      return;
    }

    // Se o store já conhece o destino, busca as atividades em paralelo ao roteiro.
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
        const r: Roteiro = roteiroRes.data;
        setRoteiro(r);
        setAtividades(atividadesRes.data);
        const days = montarDias(r, diasRes.data as RoteiroAtividadeResponse[]);
        if (itinerary) {
          updateItinerary(itinerary.id, days);
        } else {
          addItinerary({
            id: String(numId),
            destinationId: String(r.destino.id),
            departureDate: r.dataIda,
            returnDate: r.dataVolta,
            days,
            createdAt: new Date().toISOString(),
          });
        }
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, user]);

  const days = useItineraryDays(roteiro, itinerary);

  return { roteiro, atividades, days, itinerary, loading, error };
}
