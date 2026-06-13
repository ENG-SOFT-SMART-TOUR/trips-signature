import type { ComponentType } from 'react';

// Coordenada neutra de provider: cada implementação converte para o formato
// da sua biblioteca (Leaflet, Google Maps, ...) na própria borda.
export interface LatLng {
  lat: number;
  lng: number;
}

export interface MapPin {
  position: LatLng;
  color: string;
  label: string;
  nome: string;
  diaNumero: number;
  turno: string;
  duracao: string;
}

export interface MapRoute {
  positions: LatLng[];
  color: string;
  diaNumero: number;
}

export interface MapProviderProps {
  pins: MapPin[];
  routes: MapRoute[];
}

// Ponto de variação do RNF1 (Leaflet ou Google Maps): um provider só renderiza
// pins e traçados — a montagem dos dados a partir do roteiro fica fora dele.
export type MapProvider = ComponentType<MapProviderProps>;
