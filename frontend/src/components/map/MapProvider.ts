import type { ComponentType } from 'react';

export interface MapPin {
  position: [number, number];
  color: string;
  label: string;
  nome: string;
  diaNumero: number;
  turno: string;
  duracao: string;
}

export interface MapRoute {
  positions: [number, number][];
  color: string;
}

export interface MapProviderProps {
  pins: MapPin[];
  routes: MapRoute[];
}

// Ponto de variação do RNF1 (Leaflet ou Google Maps): um provider só renderiza
// pins e traçados — a montagem dos dados a partir do roteiro fica fora dele.
export type MapProvider = ComponentType<MapProviderProps>;
