import { fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import ItineraryMap from './ItineraryMap';
import type { ItineraryDay } from '@/store/useStore';
import type { Atividade } from '@/types/index';
import type { MapProviderProps } from './map/MapProvider';

vi.mock('./map/LeafletMapProvider', () => ({
  default: ({ markers, polylines, positions }: MapProviderProps) => (
    <div
      data-testid="map-provider"
      data-polylines={polylines.length}
      data-positions={positions.length}
    >
      {markers.map(marker => (
        <div key={marker.id} data-testid="pin" data-day={marker.diaNumero}>
          {marker.nome}
        </div>
      ))}
    </div>
  ),
}));

const days: ItineraryDay[] = [
  { dayNumber: 1, date: '2026-07-01', activityIds: ['1', '2'] },
  { dayNumber: 2, date: '2026-07-02', activityIds: ['3'] },
];

const atividades: Atividade[] = [
  atividade(1, 'Trilha da manhã', -27.5954, -48.5480),
  atividade(2, 'Almoço local', -27.5834, -48.5380),
  atividade(3, 'Passeio noturno', -27.6054, -48.5340),
];

describe('ItineraryMap', () => {
  it('renderiza pins corretos por dia quando as atividades têm coordenadas', async () => {
    render(<ItineraryMap days={days} atividades={atividades} />);

    const provider = await screen.findByTestId('map-provider');
    expect(provider).toHaveAttribute('data-positions', '3');
    expect(provider).toHaveAttribute('data-polylines', '1');
    expect(screen.getAllByTestId('pin')).toHaveLength(3);
    expect(screen.getByText('Todos · 3 paradas')).toBeInTheDocument();
    expect(screen.getByText('Dia 1 · 2 paradas')).toBeInTheDocument();
    expect(screen.getByText('Dia 2 · 1 parada')).toBeInTheDocument();
  });

  it('renderiza estado vazio em PT-BR quando nenhuma atividade tem coordenadas', () => {
    render(
      <ItineraryMap
        days={days}
        atividades={atividades.map(a => ({ ...a, latitude: undefined, longitude: undefined }))}
      />
    );

    expect(screen.getByText('Nenhuma atividade com localização para exibir no mapa.')).toBeInTheDocument();
    expect(screen.queryByTestId('map-provider')).not.toBeInTheDocument();
  });

  it('filtra pins ao selecionar um dia', async () => {
    render(<ItineraryMap days={days} atividades={atividades} />);

    await screen.findByTestId('map-provider');
    fireEvent.click(screen.getByRole('button', { name: /Dia 2/ }));

    const provider = await screen.findByTestId('map-provider');
    const pins = within(provider).getAllByTestId('pin');
    expect(pins).toHaveLength(1);
    expect(pins[0]).toHaveTextContent('Passeio noturno');
    expect(provider).toHaveAttribute('data-positions', '1');

    fireEvent.click(screen.getByRole('button', { name: /Todos/ }));
    expect(screen.getAllByTestId('pin')).toHaveLength(3);
  });
});

function atividade(id: number, nome: string, latitude: number, longitude: number): Atividade {
  return {
    id,
    nome,
    categoria: 'Passeio',
    duracao: '2h',
    turno: 'morning',
    descricao: 'Descrição da atividade',
    foto: 'https://example.com/foto.jpg',
    latitude,
    longitude,
  };
}
