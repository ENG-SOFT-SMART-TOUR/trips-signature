import { useEffect, useMemo, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { getActivity } from '@/data/mockData';
import type { ItineraryDay } from '@/store/useStore';

// Day color palette — consistent across the app
const DAY_COLORS = [
  '#2563eb', // blue
  '#7c3aed', // purple
  '#db2777', // pink
  '#ea580c', // orange
  '#ca8a04', // yellow
  '#16a34a', // green
  '#0891b2', // cyan
  '#4f46e5', // indigo
  '#dc2626', // red
  '#059669', // emerald
];

export function getDayColor(dayNumber: number): string {
  return DAY_COLORS[(dayNumber - 1) % DAY_COLORS.length];
}

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

interface ItineraryMapProps {
  days: ItineraryDay[];
  destinationName?: string;
}

export default function ItineraryMap({ days, destinationName }: ItineraryMapProps) {
  const mapRef = useRef<L.Map | null>(null);

  const { markers, polylines, allPositions } = useMemo(() => {
    const markers: { pos: [number, number]; color: string; label: string; name: string; shift: string; duration: string; dayNum: number }[] = [];
    const polylines: { positions: [number, number][]; color: string }[] = [];
    const allPositions: [number, number][] = [];

    days.forEach((day) => {
      const color = getDayColor(day.dayNumber);
      const dayPositions: [number, number][] = [];

      day.activityIds.forEach((aid, actIdx) => {
        const act = getActivity(aid);
        if (!act) return;
        const pos: [number, number] = [act.latitude, act.longitude];
        markers.push({
          pos, color,
          label: `${actIdx + 1}`,
          name: act.name,
          shift: act.shift,
          duration: act.duration,
          dayNum: day.dayNumber,
        });
        dayPositions.push(pos);
        allPositions.push(pos);
      });

      if (dayPositions.length > 1) {
        polylines.push({ positions: dayPositions, color });
      }
    });

    return { markers, polylines, allPositions };
  }, [days]);

  if (allPositions.length === 0) {
    return (
      <div className="rounded-lg bg-surface p-8 text-center min-h-[500px] flex items-center justify-center">
        <p className="text-sm text-muted-foreground font-body">No activities with locations to display on the map.</p>
      </div>
    );
  }

  const center: [number, number] = [
    allPositions.reduce((s, p) => s + p[0], 0) / allPositions.length,
    allPositions.reduce((s, p) => s + p[1], 0) / allPositions.length,
  ];

  return (
    <div className="rounded-lg overflow-hidden relative" style={{ height: 500 }}>
      {/* Legend */}
      <div className="absolute top-3 left-3 z-[1000] bg-background/90 backdrop-blur-sm rounded-lg p-3 space-y-1.5">
        <span className="text-xs font-body font-medium text-foreground block mb-2">Days</span>
        {days.map(day => {
          const color = getDayColor(day.dayNumber);
          return (
            <div key={day.dayNumber} className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
              <span className="text-xs font-body text-muted-foreground">Day {day.dayNumber} · {day.activityIds.length} stops</span>
            </div>
          );
        })}
      </div>

      <MapContainer
        center={center}
        zoom={12}
        scrollWheelZoom
        style={{ height: '100%', width: '100%' }}
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitBounds positions={allPositions} />

        {polylines.map((pl, i) => (
          <Polyline
            key={`pl-${i}`}
            positions={pl.positions}
            pathOptions={{ color: pl.color, weight: 3, opacity: 0.6, dashArray: '8 6' }}
          />
        ))}

        {markers.map((m, i) => (
          <Marker key={`m-${i}`} position={m.pos} icon={createPinIcon(m.color, m.label)}>
            <Popup>
              <div className="font-body text-sm">
                <strong>{m.name}</strong>
                <br />
                <span className="text-xs text-muted-foreground">Day {m.dayNum} · {m.shift} · {m.duration}</span>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}