import type { ComponentType } from 'react';

export type MapPosition = [number, number];

export interface MapMarker {
  id: string;
  position: MapPosition;
  color: string;
  label: string;
  nome: string;
  turno: string;
  duracao: string;
  diaNumero: number;
}

export interface MapPolyline {
  id: string;
  positions: MapPosition[];
  color: string;
}

export interface MapProviderProps {
  markers: MapMarker[];
  polylines: MapPolyline[];
  positions: MapPosition[];
}

export type MapProvider = ComponentType<MapProviderProps>;
