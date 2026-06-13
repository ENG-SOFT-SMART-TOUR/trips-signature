import { describe, expect, it } from 'vitest';
import { buildMapData, getDayColor } from '@/components/map/buildMapData';
import type { Atividade } from '@/types/index';
import type { ItineraryDay } from '@/store/useStore';

function atividade(id: number, nome: string, coords?: [number, number]): Atividade {
  return {
    id,
    nome,
    categoria: 'Adventure',
    duracao: '3h',
    turno: 'morning',
    descricao: '',
    foto: '',
    latitude: coords?.[0],
    longitude: coords?.[1],
  };
}

const atividades: Atividade[] = [
  atividade(1, 'Surf Lesson', [-27.5949, -48.5482]),
  atividade(2, 'Snorkeling Tour', [-27.6049, -48.5382]),
  atividade(3, 'Boat Tour', [-27.6149, -48.5582]),
];

const days: ItineraryDay[] = [
  { dayNumber: 1, date: '2026-07-01', activityIds: ['1', '2'] },
  { dayNumber: 2, date: '2026-07-02', activityIds: ['3'] },
];

describe('buildMapData', () => {
  it('monta pins por dia com cor, label sequencial e posição da atividade', () => {
    const { pins } = buildMapData(days, atividades);

    expect(pins).toHaveLength(3);

    const dia1 = pins.filter(p => p.diaNumero === 1);
    const dia2 = pins.filter(p => p.diaNumero === 2);
    expect(dia1).toHaveLength(2);
    expect(dia2).toHaveLength(1);

    expect(dia1[0].position).toEqual({ lat: -27.5949, lng: -48.5482 });
    expect(dia1[0].nome).toBe('Surf Lesson');
    expect(dia1.map(p => p.label)).toEqual(['1', '2']);
    expect(dia1.every(p => p.color === getDayColor(1))).toBe(true);
    expect(dia2[0].color).toBe(getDayColor(2));
  });

  it('cria traçado apenas para dias com 2+ atividades posicionadas', () => {
    const { routes } = buildMapData(days, atividades);

    expect(routes).toHaveLength(1);
    expect(routes[0].diaNumero).toBe(1);
    expect(routes[0].positions).toHaveLength(2);
    expect(routes[0].color).toBe(getDayColor(1));
  });

  it('ignora atividades sem coordenadas e ids desconhecidos', () => {
    const semCoords = [atividade(1, 'Surf Lesson'), atividade(2, 'Snorkeling Tour', [-27.6049, -48.5382])];
    const diasComIdInvalido: ItineraryDay[] = [
      { dayNumber: 1, date: '2026-07-01', activityIds: ['1', '2', '999'] },
    ];

    const { pins, routes } = buildMapData(diasComIdInvalido, semCoords);

    expect(pins).toHaveLength(1);
    expect(pins[0].nome).toBe('Snorkeling Tour');
    expect(routes).toHaveLength(0);
  });

  it('retorna vazio sem dias ou sem atividades', () => {
    expect(buildMapData([], atividades)).toEqual({ pins: [], routes: [] });
    expect(buildMapData(days, [])).toEqual({ pins: [], routes: [] });
  });
});
