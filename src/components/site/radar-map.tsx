"use client";

import { useEffect, useMemo, useRef } from "react";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { EventCardData } from "@/components/site/event-card";

function createPin(isMaisVanta: boolean, isActive: boolean): L.DivIcon {
  const size = isActive ? 36 : 28;
  const color = "#FFD300";
  const ring = isMaisVanta ? color : "rgba(255,211,0,0.35)";
  return L.divIcon({
    className: "vanta-pin",
    html: `
      <div style="position:relative;width:${size}px;height:${size}px;display:flex;align-items:center;justify-content:center;">
        ${
          isActive
            ? `<div style="position:absolute;inset:-4px;border-radius:50%;border:1.5px solid ${color};animation:vanta-ping 1.6s cubic-bezier(0,0,0.2,1) infinite;"></div>`
            : ""
        }
        <div style="width:${size}px;height:${size}px;border-radius:50%;background:#0f0d08;border:1.5px solid ${ring};display:flex;align-items:center;justify-content:center;box-shadow:0 0 12px rgba(255,211,0,0.35);">
          <div style="width:${Math.max(6, size / 3)}px;height:${Math.max(6, size / 3)}px;border-radius:50%;background:${color};"></div>
        </div>
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

function RecenterOnSelection({
  selectedSlug,
  events,
}: {
  selectedSlug: string | null;
  events: EventCardData[];
}) {
  const map = useMap();
  useEffect(() => {
    if (!selectedSlug) return;
    const ev = events.find((e) => e.slug === selectedSlug);
    if (!ev || ev.lat === undefined || ev.lng === undefined) return;
    map.flyTo([ev.lat, ev.lng], 14, { duration: 0.7 });
  }, [selectedSlug, events, map]);
  return null;
}

export function RadarMap({
  events,
  selectedSlug,
  onSelect,
  center,
}: {
  events: EventCardData[];
  selectedSlug: string | null;
  onSelect: (slug: string | null) => void;
  center: [number, number];
}) {
  const hasCoords = useMemo(
    () => events.filter((e) => e.lat !== undefined && e.lng !== undefined),
    [events],
  );
  const mapRef = useRef<L.Map | null>(null);

  return (
    <div className="relative h-full w-full overflow-hidden rounded-2xl border border-white/10 bg-card">
      <style>{`
        .vanta-pin { background: transparent !important; border: none !important; }
        .leaflet-container {
          background: #080604 !important;
          font-family: var(--font-poppins), system-ui, sans-serif;
        }
        .leaflet-tile {
          filter: brightness(0.55) contrast(1.1) hue-rotate(-10deg) saturate(0.7);
        }
        .leaflet-control-attribution {
          background: rgba(8,6,4,0.6) !important;
          color: rgba(148,163,184,0.6) !important;
          backdrop-filter: blur(6px);
          font-size: 10px !important;
          padding: 2px 6px !important;
          border-radius: 6px !important;
        }
        .leaflet-control-attribution a {
          color: rgba(203,213,225,0.7) !important;
        }
        .leaflet-control-zoom {
          border: 1px solid rgba(255,255,255,0.1) !important;
          box-shadow: 0 4px 20px rgba(0,0,0,0.5) !important;
        }
        .leaflet-control-zoom a {
          background: #0f0d08 !important;
          color: #FFD300 !important;
          border: none !important;
          border-bottom: 1px solid rgba(255,255,255,0.05) !important;
        }
        .leaflet-control-zoom a:hover {
          background: #1a1610 !important;
        }
        .leaflet-popup-content-wrapper {
          background: #1a1610 !important;
          border: 1px solid rgba(255,255,255,0.08) !important;
          border-radius: 16px !important;
          color: #f1f5f9 !important;
          box-shadow: 0 20px 60px rgba(0,0,0,0.7) !important;
        }
        .leaflet-popup-tip {
          background: #1a1610 !important;
        }
        .leaflet-popup-content {
          margin: 14px 16px !important;
          font-family: var(--font-poppins), system-ui, sans-serif;
        }
        .leaflet-popup-close-button {
          color: rgba(148,163,184,0.8) !important;
          padding: 10px !important;
        }
        @keyframes vanta-ping {
          0% { transform: scale(1); opacity: 0.8; }
          80%, 100% { transform: scale(2.1); opacity: 0; }
        }
      `}</style>
      <MapContainer
        center={center}
        zoom={12}
        minZoom={3}
        maxZoom={18}
        scrollWheelZoom
        className="h-full w-full"
        ref={(m) => {
          if (m) mapRef.current = m;
        }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <RecenterOnSelection selectedSlug={selectedSlug} events={events} />
        {hasCoords.map((e) => (
          <Marker
            key={e.slug}
            position={[e.lat as number, e.lng as number]}
            icon={createPin(
              Boolean(e.maisVanta),
              selectedSlug === e.slug || e.status === "happening",
            )}
            eventHandlers={{
              click: () => onSelect(e.slug),
            }}
          >
            <Popup>
              <p
                style={{
                  fontFamily: "var(--font-playfair), Georgia, serif",
                  fontSize: "15px",
                  margin: 0,
                  marginBottom: 6,
                  textTransform: "uppercase",
                  letterSpacing: "0.02em",
                }}
              >
                {e.name}
              </p>
              <p
                style={{
                  fontSize: "12px",
                  color: "rgba(203,213,225,0.8)",
                  margin: 0,
                  marginBottom: 4,
                }}
              >
                {e.venue} · {e.city}
              </p>
              <p
                style={{
                  fontSize: "11px",
                  color: "rgba(148,163,184,0.7)",
                  margin: 0,
                  marginBottom: 10,
                }}
              >
                {e.dateLabel}
              </p>
              <a
                href={`/evento/${e.slug}`}
                style={{
                  display: "inline-block",
                  background: "#FFD300",
                  color: "#000",
                  textDecoration: "none",
                  padding: "6px 14px",
                  borderRadius: "10px",
                  fontSize: "10px",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.18em",
                }}
              >
                Ver evento
              </a>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
