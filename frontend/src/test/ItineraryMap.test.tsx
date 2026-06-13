import { beforeEach, describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import ItineraryMap, { getDayColor } from '@/components/ItineraryMap';
import type { MapProviderProps } from '@/components/map/MapProvider';
import type { Atividade } from '@/types/index';
import type { ItineraryDay } from '@/store/useStore';

// Provider fake (seam da Strategy): captura os pins/rotas recebidos sem renderizar leaflet
let providerProps: MapProviderProps | null = null;
function FakeProvider(props: MapProviderProps) {
  providerProps = props;
  return <div data-testid="fake-map" />;
}

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

beforeEach(() => {
  providerProps = null;
});

describe('ItineraryMap', () => {
  it('renderiza pins corretos por dia a partir das atividades da API', () => {
    render(<ItineraryMap days={days} atividades={atividades} provider={FakeProvider} />);

    expect(screen.getByTestId('fake-map')).toBeInTheDocument();
    expect(providerProps!.pins).toHaveLength(3);

    const dia1 = providerProps!.pins.filter(p => p.diaNumero === 1);
    const dia2 = providerProps!.pins.filter(p => p.diaNumero === 2);
    expect(dia1).toHaveLength(2);
    expect(dia2).toHaveLength(1);
    expect(dia1[0].position).toEqual({ lat: -27.5949, lng: -48.5482 });
    expect(dia1.every(p => p.color === getDayColor(1))).toBe(true);
    expect(dia2[0].nome).toBe('Boat Tour');

    // Traçado apenas para dias com 2+ atividades posicionadas
    expect(providerProps!.routes).toHaveLength(1);
    expect(providerProps!.routes[0].diaNumero).toBe(1);
    expect(providerProps!.routes[0].positions).toHaveLength(2);
  });

  it('ignora atividades sem coordenadas e mostra estado vazio em PT-BR', () => {
    const semCoords = [atividade(1, 'Surf Lesson'), atividade(2, 'Snorkeling Tour')];
    render(<ItineraryMap days={days} atividades={semCoords} provider={FakeProvider} />);

    expect(screen.getByText('Nenhuma atividade com localização para exibir no mapa.')).toBeInTheDocument();
    expect(screen.queryByTestId('fake-map')).not.toBeInTheDocument();
    expect(providerProps).toBeNull();
  });

  it('filtra pins ao selecionar um dia e restaura ao clicar em "Todos"', () => {
    render(<ItineraryMap days={days} atividades={atividades} provider={FakeProvider} />);

    fireEvent.click(screen.getByRole('button', { name: /Dia 2/ }));
    expect(providerProps!.pins).toHaveLength(1);
    expect(providerProps!.pins[0].diaNumero).toBe(2);
    expect(providerProps!.routes).toHaveLength(0);

    fireEvent.click(screen.getByRole('button', { name: 'Todos' }));
    expect(providerProps!.pins).toHaveLength(3);
    expect(providerProps!.routes).toHaveLength(1);
  });
});
