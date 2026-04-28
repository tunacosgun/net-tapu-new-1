'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import apiClient from '@/lib/api-client';
import { ChevronLeft, MapPin, TrendingUp } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

const MapContainer = dynamic(() => import('react-leaflet').then((m) => m.MapContainer), { ssr: false });
const GeoJSON = dynamic(() => import('react-leaflet').then((m) => m.GeoJSON), { ssr: false });

type CityStat = { city: string; count: number };
type DistrictStat = { district: string; count: number };

const TR_BOUNDS: [[number, number], [number, number]] = [
  [35.5, 25.5],
  [42.5, 45.5],
];

const COLOR_STOPS = [
  { min: 0, color: '#f1f5f9' },      // slate-100
  { min: 1, color: '#dcfce7' },      // green-100
  { min: 3, color: '#86efac' },      // green-300
  { min: 8, color: '#22c55e' },      // green-500
  { min: 20, color: '#15803d' },     // green-700
  { min: 50, color: '#14532d' },     // green-900
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

export function TurkeyParcelMap() {
  const [geo, setGeo] = useState<any>(null);
  const [cityStats, setCityStats] = useState<CityStat[]>([]);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [districtStats, setDistrictStats] = useState<DistrictStat[]>([]);
  const [hoveredCity, setHoveredCity] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [districtLoading, setDistrictLoading] = useState(false);
  const geoLayerRef = useRef<any>(null);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      fetch('/geo/tr-provinces.json').then((r) => r.json()),
      apiClient.get<CityStat[]>('/parcels/stats/by-city').then((r) => r.data).catch(() => [] as CityStat[]),
    ]).then(([g, stats]) => {
      if (cancelled) return;
      setGeo(g);
      setCityStats(stats);
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, []);

  const countByCity = useMemo(() => {
    const map = new Map<string, number>();
    cityStats.forEach((s) => map.set(normalizeName(s.city), s.count));
    return map;
  }, [cityStats]);

  const totalCount = useMemo(() => cityStats.reduce((sum, s) => sum + s.count, 0), [cityStats]);
  const topCities = useMemo(() => [...cityStats].sort((a, b) => b.count - a.count).slice(0, 12), [cityStats]);

  function getCount(name: string): number {
    return countByCity.get(normalizeName(name)) ?? 0;
  }

  function styleFeature(feature: any) {
    const name: string = feature.properties.name;
    const count = getCount(name);
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
    const count = getCount(name);
    layer.bindTooltip(
      `<div style="font-family: inherit"><strong>${name}</strong><br/><span style="color:#0d9488">${count} arsa</span></div>`,
      { sticky: true, direction: 'top', className: 'tr-map-tooltip' },
    );
    layer.on({
      mouseover: () => setHoveredCity(name),
      mouseout: () => setHoveredCity(null),
      click: async () => {
        setSelectedCity(name);
        setDistrictLoading(true);
        try {
          const { data } = await apiClient.get<DistrictStat[]>(`/parcels/stats/by-district?city=${encodeURIComponent(name)}`);
          setDistrictStats(data);
        } catch {
          setDistrictStats([]);
        } finally {
          setDistrictLoading(false);
        }
      },
    });
  }

  // Refresh styles when state changes
  useEffect(() => {
    if (geoLayerRef.current) {
      geoLayerRef.current.setStyle(styleFeature);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hoveredCity, selectedCity, countByCity]);

  return (
    <section className="py-16 bg-gradient-to-b from-slate-50 to-white">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold mb-3">
            <MapPin className="h-3.5 w-3.5" />
            Türkiye Geneli Arsa Dağılımı
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
            {totalCount.toLocaleString('tr-TR')} arsa, 81 ilde
          </h2>
          <p className="mt-3 text-slate-600 max-w-2xl mx-auto">
            Haritadan ile tıklayın, o ile ait ilçe bazlı dağılımı görün.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-6">
          {/* Map */}
          <div className="lg:col-span-8 rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="h-[520px] relative bg-slate-50">
              {!loading && geo && (
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
                  <GeoJSON
                    data={geo}
                    style={styleFeature as any}
                    onEachFeature={onEachFeature}
                    ref={(r: any) => { geoLayerRef.current = r; }}
                  />
                </MapContainer>
              )}
              {loading && (
                <div className="absolute inset-0 flex items-center justify-center text-slate-400 text-sm">
                  Harita yükleniyor…
                </div>
              )}

              {/* Legend */}
              <div className="absolute bottom-4 left-4 rounded-lg bg-white/95 backdrop-blur border border-slate-200 shadow-sm px-3 py-2 text-xs">
                <div className="text-slate-500 font-medium mb-1.5">Arsa sayısı</div>
                <div className="flex items-center gap-1">
                  {COLOR_STOPS.map((s, i) => (
                    <div key={i} className="flex items-center gap-1">
                      <span className="inline-block h-3 w-5 rounded-sm border border-slate-200" style={{ background: s.color }} />
                      <span className="text-slate-600">{s.min === 0 ? '0' : `${s.min}+`}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Side panel */}
          <div className="lg:col-span-4 rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden flex flex-col">
            {!selectedCity ? (
              <>
                <div className="px-5 py-4 border-b border-slate-100 bg-gradient-to-r from-emerald-50 to-white">
                  <div className="flex items-center gap-2 text-emerald-700">
                    <TrendingUp className="h-4 w-4" />
                    <span className="text-sm font-semibold">En Yoğun İller</span>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
                  {topCities.length === 0 && (
                    <div className="p-6 text-center text-sm text-slate-400">Henüz arsa kaydı yok.</div>
                  )}
                  {topCities.map((s, idx) => (
                    <button
                      key={s.city}
                      onClick={() => {
                        setSelectedCity(s.city);
                        setDistrictLoading(true);
                        apiClient.get<DistrictStat[]>(`/parcels/stats/by-district?city=${encodeURIComponent(s.city)}`)
                          .then((r) => setDistrictStats(r.data))
                          .catch(() => setDistrictStats([]))
                          .finally(() => setDistrictLoading(false));
                      }}
                      onMouseEnter={() => setHoveredCity(s.city)}
                      onMouseLeave={() => setHoveredCity(null)}
                      className="w-full px-5 py-3 flex items-center justify-between hover:bg-slate-50 transition-colors text-left"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="shrink-0 w-6 h-6 rounded-full bg-slate-100 text-slate-500 text-xs font-bold flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <span className="text-sm font-medium text-slate-800 truncate">{s.city}</span>
                      </div>
                      <span className="shrink-0 text-sm font-bold text-emerald-700">{s.count}</span>
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <>
                <div className="px-5 py-4 border-b border-slate-100 bg-gradient-to-r from-emerald-50 to-white flex items-center gap-2">
                  <button
                    onClick={() => { setSelectedCity(null); setDistrictStats([]); }}
                    className="p-1 rounded hover:bg-white text-slate-600"
                    aria-label="Geri"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <div className="min-w-0">
                    <div className="text-xs text-slate-500">İlçe Dağılımı</div>
                    <div className="text-sm font-bold text-slate-900 truncate">{selectedCity}</div>
                  </div>
                  <span className="ml-auto text-xs font-bold text-emerald-700">
                    {districtStats.reduce((s, d) => s + d.count, 0)} arsa
                  </span>
                </div>
                <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
                  {districtLoading && (
                    <div className="p-6 text-center text-sm text-slate-400">Yükleniyor…</div>
                  )}
                  {!districtLoading && districtStats.length === 0 && (
                    <div className="p-6 text-center text-sm text-slate-400">
                      Bu ilde aktif arsa kaydı yok.
                    </div>
                  )}
                  {!districtLoading && districtStats.map((d) => (
                    <a
                      key={d.district}
                      href={`/parcels?city=${encodeURIComponent(selectedCity)}&district=${encodeURIComponent(d.district)}`}
                      className="px-5 py-3 flex items-center justify-between hover:bg-slate-50 transition-colors"
                    >
                      <span className="text-sm font-medium text-slate-800 truncate">{d.district}</span>
                      <span className="text-sm font-bold text-emerald-700">{d.count}</span>
                    </a>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
