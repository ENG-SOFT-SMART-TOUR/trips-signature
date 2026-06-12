import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { MapProviderProps } from './MapProvider';

function createPinIcon(color: string, label: string) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="38" viewBox="0 0 28 38">
    <path d="M14 0C6.3 0 0 6.3 0 14c0 10.5 14 24 14 24s14-13.5 14-24C28 6.3 21.7 0 14 0z" fill="${color}" stroke="white" stroke-width="1.5"/>
    <circle cx="14" cy="13" r="7" fill="white" opacity="0.9"/>
    <text x="14" y="16.5" text-anchor="middle" font-size="10" font-weight="700" fill="${color}" font-family="sans-serif">${label}</text>
  </svg>`;
  return L.divIcon({
    html: svg,
    className: '',
    iconSize: [28, 38],
    iconAnchor: [14, 38],
    popupAnchor: [0, -38],
  });
}

function FitBounds({ positions }: { positions: [number, number][] }) {
  const map = useMap();
  useEffect(() => {
    if (positions.length > 0) {
      const bounds = L.latLngBounds(positions.map(p => L.latLng(p[0], p[1])));
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
    }
  }, [map, positions]);
  return null;
}

export default function LeafletMapProvider({ pins, routes }: MapProviderProps) {
  const allPositions = pins.map(p => p.position);
  const center: [number, number] = allPositions.length > 0
    ? [
        allPositions.reduce((s, p) => s + p[0], 0) / allPositions.length,
        allPositions.reduce((s, p) => s + p[1], 0) / allPositions.length,
      ]
    : [0, 0];

  return (
    <MapContainer
      center={center}
      zoom={12}
      scrollWheelZoom
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FitBounds positions={allPositions} />

      {routes.map((route, i) => (
        <Polyline
          key={`pl-${i}`}
          positions={route.positions}
          pathOptions={{ color: route.color, weight: 3, opacity: 0.6, dashArray: '8 6' }}
        />
      ))}

      {pins.map((pin, i) => (
        <Marker key={`m-${i}`} position={pin.position} icon={createPinIcon(pin.color, pin.label)}>
          <Popup>
            <div className="font-body text-sm">
              <strong>{pin.nome}</strong>
              <br />
              <span className="text-xs text-muted-foreground">Day {pin.diaNumero} · {pin.turno} · {pin.duracao}</span>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
