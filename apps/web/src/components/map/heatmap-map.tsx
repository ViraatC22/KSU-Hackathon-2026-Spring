"use client";

import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect } from "react";

export type DataLayer = "inclusion" | "mobile" | "credit" | "agents" | "savings" | "connectivity";

interface DistrictData {
  name: string;
  province: string;
  lat: number;
  lng: number;
  population: number;
  inclusionScore: number;
  mobilePenetration: number;
  creditAccess: number;
  agentDensity: number;
  savingsParticipation: number;
  connectivity: number;
  recommendation: string;
}

interface HeatmapMapProps {
  districts: DistrictData[];
  onSelect: (name: string | null) => void;
  selected: string | null;
  activeLayer: DataLayer;
}

function getLayerValue(d: DistrictData, layer: DataLayer): number {
  switch (layer) {
    case "inclusion": return d.inclusionScore;
    case "mobile": return d.mobilePenetration * 100;
    case "credit": return d.creditAccess * 100;
    case "agents": return Math.min(100, d.agentDensity * 20);
    case "savings": return d.savingsParticipation * 250;
    case "connectivity": return d.connectivity * 100;
  }
}

function layerColor(value: number): string {
  if (value >= 70) return "#38b2a3"; // zambezi teal — well served
  if (value >= 50) return "#d4611e"; // copper — moderate
  if (value >= 30) return "#EAB308"; // yellow — low
  return "#EF4444"; // red — critical
}

function layerLabel(layer: DataLayer): string {
  switch (layer) {
    case "inclusion": return "Financial Inclusion Score";
    case "mobile": return "Mobile Money Penetration";
    case "credit": return "Credit Access";
    case "agents": return "Agent Density";
    case "savings": return "Savings Group Participation";
    case "connectivity": return "Internet Connectivity";
  }
}

function FlyToSelected({ districts, selected }: { districts: DistrictData[]; selected: string | null }) {
  const map = useMap();
  useEffect(() => {
    if (selected) {
      const d = districts.find((d) => d.name === selected);
      if (d) map.flyTo([d.lat, d.lng], 8, { duration: 0.6 });
    } else {
      map.flyTo([-13.5, 28.5], 6, { duration: 0.6 });
    }
  }, [selected, districts, map]);
  return null;
}

export default function HeatmapMap({ districts, onSelect, selected, activeLayer }: HeatmapMapProps) {
  return (
    <MapContainer
      center={[-13.5, 28.5]}
      zoom={6}
      style={{ height: "100%", width: "100%", background: "#1a1714" }}
      scrollWheelZoom
    >
      {/* Dark map tiles */}
      <TileLayer
        attribution='&copy; <a href="https://carto.com/">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />
      <FlyToSelected districts={districts} selected={selected} />
      {districts.map((d) => {
        const value = getLayerValue(d, activeLayer);
        const color = layerColor(value);
        const isSelected = selected === d.name;
        const isCritical = value < 30;
        const popRadius = Math.max(6, Math.min(22, d.population / 90000));

        return (
          <CircleMarker
            key={d.name}
            center={[d.lat, d.lng]}
            radius={isSelected ? popRadius + 4 : popRadius}
            pathOptions={{
              color: isSelected ? "#ffffff" : color,
              fillColor: color,
              fillOpacity: isSelected ? 0.95 : isCritical ? 0.85 : 0.65,
              weight: isSelected ? 3 : isCritical ? 2 : 1,
            }}
            eventHandlers={{ click: () => onSelect(d.name) }}
          >
            <Popup>
              <div style={{ fontFamily: "system-ui, sans-serif", minWidth: "180px" }}>
                <p style={{ fontWeight: 700, fontSize: "13px", marginBottom: "2px" }}>{d.name}</p>
                <p style={{ fontSize: "11px", color: "#888", marginBottom: "8px" }}>{d.province} Province · {d.population.toLocaleString()} people</p>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
                  <span style={{ fontSize: "11px", color: "#aaa" }}>{layerLabel(activeLayer)}:</span>
                  <strong style={{ color, fontSize: "13px" }}>{value.toFixed(0)}{activeLayer !== "agents" ? "%" : "/1k"}</strong>
                </div>
                <div style={{ height: "4px", background: "#333", borderRadius: "2px", marginBottom: "8px" }}>
                  <div style={{ height: "100%", width: `${Math.min(100, value)}%`, background: color, borderRadius: "2px" }} />
                </div>
                <p style={{ fontSize: "10px", color: "#bbb", lineHeight: "1.4" }}>{d.recommendation}</p>
              </div>
            </Popup>
          </CircleMarker>
        );
      })}
    </MapContainer>
  );
}
