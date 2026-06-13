import type { ComponentType } from 'react';

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

// Provider de mapa renderiza pins e traçados; a montagem dos dados fica fora dele.
export type MapProvider = ComponentType<MapProviderProps>;
