'use client';

import { useEffect, useMemo, useState } from 'react';
import apiClient from '@/lib/api-client';
import { TURKEY_PROVINCES } from '@/data/turkey-paths';
import { ChevronLeft, MapPin, TrendingUp } from 'lucide-react';

type CityStat = { city: string; count: number };
type DistrictStat = { district: string; count: number };

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

export function TurkeyParcelMap() {
  const [cityStats, setCityStats] = useState<CityStat[]>([]);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [districtStats, setDistrictStats] = useState<DistrictStat[]>([]);
  const [hoveredCity, setHoveredCity] = useState<string | null>(null);
  const [districtLoading, setDistrictLoading] = useState(false);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    let cancelled = false;
    apiClient
      .get<CityStat[]>('/parcels/stats/by-city')
      .then((r) => {
        if (!cancelled) setCityStats(Array.isArray(r.data) ? r.data : []);
      })
      .catch(() => {
        if (!cancelled) setCityStats([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const countByCity = useMemo(() => {
    const map = new Map<string, number>();
    cityStats.forEach((s) => map.set(normalizeName(s.city), s.count));
    return map;
  }, [cityStats]);

  const totalCount = useMemo(() => cityStats.reduce((sum, s) => sum + s.count, 0), [cityStats]);
  const topCities = useMemo(() => [...cityStats].sort((a, b) => b.count - a.count).slice(0, 12), [cityStats]);

  function loadDistricts(city: string) {
    setSelectedCity(city);
    setDistrictLoading(true);
    apiClient
      .get<DistrictStat[]>(`/parcels/stats/by-district?city=${encodeURIComponent(city)}`)
      .then((r) => setDistrictStats(Array.isArray(r.data) ? r.data : []))
      .catch(() => setDistrictStats([]))
      .finally(() => setDistrictLoading(false));
  }

  const hoveredCount = hoveredCity ? countByCity.get(normalizeName(hoveredCity)) ?? 0 : 0;

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
          <div className="lg:col-span-8 rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="relative">
              <svg
                viewBox="0 0 1005 490"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-auto select-none"
                onMouseLeave={() => {
                  setHoveredCity(null);
                  setTooltipPos(null);
                }}
              >
                {TURKEY_PROVINCES.map((p) => {
                  const count = countByCity.get(normalizeName(p.name)) ?? 0;
                  const isHovered = hoveredCity && normalizeName(hoveredCity) === normalizeName(p.name);
                  const isSelected = selectedCity && normalizeName(selectedCity) === normalizeName(p.name);
                  return (
                    <path
                      key={p.id}
                      d={p.d}
                      fill={colorFor(count)}
                      stroke={isSelected ? '#0f766e' : isHovered ? '#0d9488' : '#cbd5e1'}
                      strokeWidth={isSelected ? 1.8 : isHovered ? 1.4 : 0.6}
                      style={{
                        cursor: 'pointer',
                        transition: 'fill 150ms ease, stroke 150ms ease',
                        filter: isHovered || isSelected ? 'brightness(1.05)' : undefined,
                      }}
                      onMouseEnter={(e) => {
                        setHoveredCity(p.name);
                        const rect = (e.currentTarget.ownerSVGElement as SVGSVGElement).getBoundingClientRect();
                        const bbox = (e.currentTarget as SVGPathElement).getBBox();
                        setTooltipPos({
                          x: ((bbox.x + bbox.width / 2) / 1005) * rect.width,
                          y: (bbox.y / 490) * rect.height,
                        });
                      }}
                      onClick={() => loadDistricts(p.name)}
                    />
                  );
                })}
              </svg>

              {hoveredCity && tooltipPos && (
                <div
                  className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full mb-1 px-2.5 py-1.5 rounded-md bg-slate-900 text-white text-xs shadow-lg whitespace-nowrap"
                  style={{ left: `${tooltipPos.x}px`, top: `${tooltipPos.y}px` }}
                >
                  <div className="font-semibold">{hoveredCity}</div>
                  <div className="text-emerald-300">{hoveredCount} arsa</div>
                </div>
              )}

              <div className="absolute bottom-3 left-3 rounded-lg bg-white/95 backdrop-blur border border-slate-200 shadow-sm px-3 py-2 text-xs">
                <div className="text-slate-500 font-medium mb-1.5">Arsa sayısı</div>
                <div className="flex items-center gap-1.5">
                  {COLOR_STOPS.map((s, i) => (
                    <div key={i} className="flex items-center gap-1">
                      <span
                        className="inline-block h-3 w-4 rounded-sm border border-slate-200"
                        style={{ background: s.color }}
                      />
                      <span className="text-slate-600">{s.min === 0 ? '0' : `${s.min}+`}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden flex flex-col min-h-[400px]">
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
                      onClick={() => loadDistricts(s.city)}
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
                    onClick={() => {
                      setSelectedCity(null);
                      setDistrictStats([]);
                    }}
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
                  {!districtLoading &&
                    districtStats.map((d) => (
                      <a
                        key={d.district}
                        href={`/parcels?city=${encodeURIComponent(selectedCity!)}&district=${encodeURIComponent(d.district)}`}
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
