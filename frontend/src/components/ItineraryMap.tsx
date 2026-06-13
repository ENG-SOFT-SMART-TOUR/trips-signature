import { useMemo, useState } from 'react';
import type { ItineraryDay } from '@/store/useStore';
import type { Atividade } from '@/types/index';
import type { MapProvider } from '@/components/map/MapProvider';
import LeafletMapProvider from '@/components/map/LeafletMapProvider';
import { buildMapData, getDayColor } from '@/components/map/buildMapData';

export { getDayColor };

interface ItineraryMapProps {
  days: ItineraryDay[];
  atividades: Atividade[];
  provider?: MapProvider;
}

export default function ItineraryMap({ days, atividades, provider: Provider = LeafletMapProvider }: ItineraryMapProps) {
  // null = "Todos" — visão completa do roteiro
  const [diaSelecionado, setDiaSelecionado] = useState<number | null>(null);

  const { pins, routes } = useMemo(() => buildMapData(days, atividades), [days, atividades]);

  const pinsVisiveis = diaSelecionado == null ? pins : pins.filter(p => p.diaNumero === diaSelecionado);
  const rotasVisiveis = diaSelecionado == null ? routes : routes.filter(r => r.diaNumero === diaSelecionado);

  if (pins.length === 0) {
    return (
      <div className="rounded-lg bg-surface p-8 text-center min-h-[500px] flex items-center justify-center">
        <p className="text-sm text-muted-foreground font-body">Nenhuma atividade com localização para exibir no mapa.</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg overflow-hidden relative" style={{ height: 500 }}>
      {/* Legenda — controle de navegação por dia */}
      <div className="absolute top-3 left-3 z-[1000] bg-background/90 backdrop-blur-sm rounded-lg p-3 space-y-1">
        <span className="text-xs font-body font-medium text-foreground block mb-2">Dias</span>
        <button
          onClick={() => setDiaSelecionado(null)}
          className={`flex items-center gap-2 w-full rounded-md px-2 py-1 text-left transition-colors hover:bg-surface ${
            diaSelecionado == null ? 'bg-primary/10' : ''
          }`}
        >
          <span className={`text-xs font-body ${diaSelecionado == null ? 'font-semibold text-foreground' : 'text-muted-foreground'}`}>
            Todos
          </span>
        </button>
        {days.map(day => {
          const color = getDayColor(day.dayNumber);
          const selecionado = diaSelecionado === day.dayNumber;
          return (
            <button
              key={day.dayNumber}
              onClick={() => setDiaSelecionado(day.dayNumber)}
              className={`flex items-center gap-2 w-full rounded-md px-2 py-1 text-left transition-colors hover:bg-surface ${
                selecionado ? 'bg-primary/10' : ''
              }`}
            >
              <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
              <span className={`text-xs font-body ${selecionado ? 'font-semibold text-foreground' : 'text-muted-foreground'}`}>
                Dia {day.dayNumber} · {day.activityIds.length} {day.activityIds.length === 1 ? 'parada' : 'paradas'}
              </span>
            </button>
          );
        })}
      </div>

      <Provider pins={pinsVisiveis} routes={rotasVisiveis} />
    </div>
  );
}
