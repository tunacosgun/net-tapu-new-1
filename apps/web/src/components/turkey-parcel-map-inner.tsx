'use client';

import { useEffect, useState } from 'react';
import { MapContainer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const TR_BOUNDS: [[number, number], [number, number]] = [
  [35.5, 25.5],
  [42.5, 45.5],
];

const COLOR_STOPS = [
  { min: 0, color: '#f1f5f9' },
  { min: 1, color: '#dcfce7' },
  { min: 3, color: '#86efac' },
  { min: 8, color: '#22c55e' },
  { min: 20, color: '#15803d' },
  { min: 50, color: '#14532d' },
];

function colorFor(count: number): string {
  let c = COLOR_STOPS[0].color;
  for (const stop of COLOR_STOPS) if (count >= stop.min) c = stop.color;
  return c;
}

function normalizeName(s: string): string {
  return s
    .toLocaleLowerCase('tr-TR')
    .replace(/i̇/g, 'i')
    .replace(/[\s\-_]+/g, '')
    .trim();
}

interface Props {
  countByCity: Map<string, number>;
  selectedCity: string | null;
  hoveredCity: string | null;
  onHover: (name: string | null) => void;
  onSelect: (name: string) => void;
}

export function TurkeyParcelMapInner({ countByCity, selectedCity, hoveredCity, onHover, onSelect }: Props) {
  const [geo, setGeo] = useState<any>(null);

  useEffect(() => {
    let cancelled = false;
    fetch('/geo/tr-provinces.json')
      .then((r) => r.json())
      .then((g) => {
        if (!cancelled) setGeo(g);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  if (!geo) {
    return (
      <div className="h-full flex items-center justify-center text-slate-400 text-sm">
        Harita yükleniyor…
      </div>
    );
  }

  // Force GeoJSON remount when interactive state changes so styles refresh
  const styleKey = `${selectedCity ?? ''}::${hoveredCity ?? ''}::${countByCity.size}`;

  function styleFeature(feature: any) {
    const name: string = feature.properties.name;
    const count = countByCity.get(normalizeName(name)) ?? 0;
    const isHovered = hoveredCity && normalizeName(hoveredCity) === normalizeName(name);
    const isSelected = selectedCity && normalizeName(selectedCity) === normalizeName(name);
    return {
      fillColor: colorFor(count),
      weight: isSelected ? 2.5 : isHovered ? 2 : 0.8,
      color: isSelected ? '#0f766e' : isHovered ? '#0d9488' : '#94a3b8',
      fillOpacity: isHovered || isSelected ? 0.95 : 0.85,
    };
  }

  function onEachFeature(feature: any, layer: any) {
    const name: string = feature.properties.name;
    const count = countByCity.get(normalizeName(name)) ?? 0;
    layer.bindTooltip(
      `<div style="font-family: inherit"><strong>${name}</strong><br/><span style="color:#0d9488">${count} arsa</span></div>`,
      { sticky: true, direction: 'top' },
    );
    layer.on({
      mouseover: () => onHover(name),
      mouseout: () => onHover(null),
      click: () => onSelect(name),
    });
  }

  return (
    <MapContainer
      bounds={TR_BOUNDS}
      zoomControl={false}
      attributionControl={false}
      scrollWheelZoom={false}
      doubleClickZoom={false}
      dragging={false}
      touchZoom={false}
      boxZoom={false}
      keyboard={false}
      style={{ height: '100%', width: '100%', background: 'transparent' }}
    >
      <GeoJSON key={styleKey} data={geo} style={styleFeature as any} onEachFeature={onEachFeature} />
    </MapContainer>
  );
}
