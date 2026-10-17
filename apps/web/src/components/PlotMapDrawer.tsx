"use client";

import { useEffect, useRef, useState } from "react";
import { PolygonCoordinates, LandAreaResult } from "@gebere/shared";
import { apiClient } from "@/lib/api-client";
import { AlertCircle, Trash2, MapPin, Calculator, CheckCircle2 } from "lucide-react";

interface PlotMapDrawerProps {
  onAreaCalculated?: (result: LandAreaResult, coordinates: PolygonCoordinates[]) => void;
}

export default function PlotMapDrawer({ onAreaCalculated }: PlotMapDrawerProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapInstanceRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const polygonLayerRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const markersRef = useRef<any[]>([]);

  const [points, setPoints] = useState<PolygonCoordinates[]>([]);
  const [calculation, setCalculation] = useState<LandAreaResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  useEffect(() => {
    // Dynamic load leaflet in browser
    let isMounted = true;

    async function initMap() {
      if (typeof window === "undefined" || !mapContainerRef.current) return;

      const L = (await import("leaflet")).default;

      if (!mapInstanceRef.current && isMounted) {
        // Center on East Shewa / Ada'a agricultural plains (Ethiopia)
        const map = L.map(mapContainerRef.current).setView([8.75, 38.98], 14);

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19,
        }).addTo(map);

        map.on("click", (e: { latlng: { lat: number; lng: number } }) => {
          const newPt: PolygonCoordinates = {
            lat: parseFloat(e.latlng.lat.toFixed(6)),
            lng: parseFloat(e.latlng.lng.toFixed(6)),
          };

          setPoints((prev) => {
            const updated = [...prev, newPt];
            updatePolygonLayer(updated, L, map);
            return updated;
          });
        });

        mapInstanceRef.current = map;
      }
    }

    initMap();

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updatePolygonLayer = async (pts: PolygonCoordinates[], LInstance?: any, mapInst?: any) => {
    const L = LInstance || (await import("leaflet")).default;
    const map = mapInst || mapInstanceRef.current;
    if (!map) return;

    // Clear previous markers
    markersRef.current.forEach((m) => map.removeLayer(m));
    markersRef.current = [];

    // Add marker for each vertex
    pts.forEach((pt, index) => {
      const marker = L.circleMarker([pt.lat, pt.lng], {
        radius: 6,
        color: "#10b981",
        fillColor: "#065f46",
        fillOpacity: 0.9,
        weight: 2,
      }).addTo(map);
      marker.bindTooltip(`Point ${index + 1}`, { permanent: false });
      markersRef.current.push(marker);
    });

    // Update polygon boundary
    if (polygonLayerRef.current) {
      map.removeLayer(polygonLayerRef.current);
      polygonLayerRef.current = null;
    }

    if (pts.length >= 3) {
      const latlngs = pts.map((p) => [p.lat, p.lng]);
      polygonLayerRef.current = L.polygon(latlngs, {
        color: "#10b981",
        weight: 2.5,
        fillColor: "#10b981",
        fillOpacity: 0.25,
      }).addTo(map);
    }
  };

  const handleClear = async () => {
    setPoints([]);
    setCalculation(null);
    if (mapInstanceRef.current) {
      markersRef.current.forEach((m) => mapInstanceRef.current.removeLayer(m));
      markersRef.current = [];
      if (polygonLayerRef.current) {
        mapInstanceRef.current.removeLayer(polygonLayerRef.current);
        polygonLayerRef.current = null;
      }
    }
  };

  const handleCalculatePolygon = async () => {
    if (points.length < 3) return;
    setIsCalculating(true);
    try {
      const result = await apiClient.calculatePolygonLand({ coordinates: points });
      setCalculation(result);
      if (onAreaCalculated) {
        onAreaCalculated(result, points);
      }
    } catch (err) {
      console.error("Failed to calculate polygon area:", err);
    } finally {
      setIsCalculating(false);
    }
  };

  // Preset Ethiopian plots for quick demonstration
  const loadPresetPlot = async () => {
    const presetAdaa: PolygonCoordinates[] = [
      { lat: 8.7502, lng: 38.9801 },
      { lat: 8.7535, lng: 38.9803 },
      { lat: 8.7538, lng: 38.9842 },
      { lat: 8.7505, lng: 38.9839 },
    ];
    setPoints(presetAdaa);
    await updatePolygonLayer(presetAdaa);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([8.752, 38.982], 15);
    }
  };

  return (
    <div className="space-y-4">
      {/* Map Control Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-card p-3 rounded-2xl border border-border">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-emerald-green" />
          <span className="text-xs font-semibold text-white">
            Boundary Vertices: <span className="text-emerald-accent font-bold">{points.length}</span>
          </span>
          <span className="text-[11px] text-zinc-400">
            {points.length < 3 ? "(Click map to add at least 3 points)" : "(Polygon closed)"}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={loadPresetPlot}
            className="text-xs px-3 py-1.5 rounded-xl border border-forest-light bg-forest-green/30 text-emerald-accent hover:bg-forest-green/50 transition-colors"
          >
            Load Ada'a Sample Plot
          </button>
          <button
            type="button"
            onClick={handleClear}
            disabled={points.length === 0}
            className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-xl border border-border text-zinc-400 hover:text-red-400 hover:border-red-900/50 disabled:opacity-40 transition-colors"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Reset Map</span>
          </button>
          <button
            type="button"
            onClick={handleCalculatePolygon}
            disabled={points.length < 3 || isCalculating}
            className="flex items-center gap-1 text-xs px-4 py-1.5 rounded-xl bg-emerald-green text-obsidian font-bold hover:bg-emerald-green/90 disabled:opacity-40 transition-all shadow-md"
          >
            <Calculator className="h-3.5 w-3.5" />
            <span>{isCalculating ? "Estimating..." : "Estimate Area"}</span>
          </button>
        </div>
      </div>

      {/* Map Canvas */}
      <div className="relative rounded-2xl overflow-hidden border border-border h-96 w-full">
        <div ref={mapContainerRef} className="h-full w-full z-0" />
      </div>

      {/* Calculation Output Card */}
      {calculation && (
        <div className="bg-forest-green/20 border border-emerald-green/30 p-5 rounded-2xl space-y-3">
          <div className="flex items-center gap-2 text-emerald-accent text-xs font-bold uppercase tracking-wider">
            <CheckCircle2 className="h-4 w-4" />
            <span>Map Polygon Estimation Result</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-card/80 border border-border p-3 rounded-xl text-center">
              <span className="text-[10px] text-zinc-400 uppercase tracking-wider block">Square Meters</span>
              <span className="text-xl font-black text-white">{calculation.squareMeters.toLocaleString()} m²</span>
            </div>
            <div className="bg-card/80 border border-emerald-green/30 p-3 rounded-xl text-center">
              <span className="text-[10px] text-emerald-green uppercase tracking-wider block">Hectares (ha)</span>
              <span className="text-xl font-black text-emerald-green">{calculation.hectares} ha</span>
            </div>
            <div className="bg-card/80 border border-border p-3 rounded-xl text-center">
              <span className="text-[10px] text-zinc-400 uppercase tracking-wider block">Acres</span>
              <span className="text-xl font-black text-white">{calculation.acres} ac</span>
            </div>
          </div>

          {/* Survey Disclaimer */}
          <div className="flex items-start gap-2 bg-obsidian/70 border border-gold-accent/30 p-3 rounded-xl text-[11px] text-amber-200/90 leading-relaxed">
            <AlertCircle className="h-4 w-4 text-gold-accent shrink-0 mt-0.5" />
            <span>{calculation.disclaimer}</span>
          </div>
        </div>
      )}
    </div>
  );
}
