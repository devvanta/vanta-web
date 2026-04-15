"use client";

import { useEffect, useRef } from "react";
import {
  MapContainer,
  Marker,
  TileLayer,
  Circle,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { EventCardData } from "@/components/site/event-card";

/* ── Pin Icons ─────────────────────────────────────────── */

const PIN_SRC = "/pin-gold.png";
const PIN_RATIO = 0.695;

interface PinOpts {
  isActive?: boolean;
  isLive?: boolean;
  isClosest?: boolean;
  isMV?: boolean;
}

function createEventIcon(imageUrl: string | undefined, opts: PinOpts = {}) {
  const { isActive = false, isLive = false, isClosest = false, isMV = false } = opts;

  const w = isActive ? 90 : isLive ? 78 : 70;
  const h = Math.round(w / PIN_RATIO);
  const photoSize = Math.round(w * 0.44);
  const photoLeft = Math.round((w - photoSize) / 2);
  const photoTop = Math.round(h * 0.22);

  let glowFilter: string;
  if (isActive) {
    glowFilter = "drop-shadow(0 0 16px rgba(255,211,0,0.8)) drop-shadow(0 4px 10px rgba(0,0,0,0.4))";
  } else if (isLive) {
    glowFilter = "drop-shadow(0 0 14px rgba(255,211,0,0.7)) drop-shadow(0 3px 8px rgba(0,0,0,0.3))";
  } else if (isMV) {
    glowFilter = "drop-shadow(0 0 10px rgba(255,211,0,0.55)) drop-shadow(0 3px 6px rgba(0,0,0,0.3))";
  } else if (isClosest) {
    glowFilter = "drop-shadow(0 0 8px rgba(255,211,0,0.45)) drop-shadow(0 2px 6px rgba(0,0,0,0.3))";
  } else {
    glowFilter = "drop-shadow(0 0 6px rgba(255,211,0,0.3)) drop-shadow(0 2px 4px rgba(0,0,0,0.25))";
  }

  const pulseStyle = isLive ? "animation:pulse 2s cubic-bezier(0.4,0,0.6,1) infinite;" : "";

  // If gradient background instead of URL photo
  const isGradient = !imageUrl || imageUrl.startsWith("radial-gradient") || imageUrl.startsWith("linear-gradient") || imageUrl.startsWith("url(");
  const photoHtml = isGradient
    ? `<div style="width:100%;height:100%;background:linear-gradient(135deg, rgba(255,211,0,0.3), #080604);"></div>`
    : `<img src="${imageUrl}" style="width:100%;height:100%;object-fit:cover;" referrerpolicy="no-referrer" />`;

  return L.divIcon({
    className: "vanta-event-pin",
    html: `<div style="position:relative;width:${w}px;height:${h}px;filter:${glowFilter};overflow:hidden;${pulseStyle}">
      <div style="position:absolute;top:${photoTop}px;left:${photoLeft}px;width:${photoSize}px;height:${photoSize}px;border-radius:50%;overflow:hidden;background:#000;z-index:1;">
        ${photoHtml}
      </div>
      <img src="${PIN_SRC}" style="position:absolute;top:0;left:0;width:${w}px;height:${h}px;z-index:2;pointer-events:none;" />
    </div>`,
    iconSize: [w, h],
    iconAnchor: [w / 2, h],
    popupAnchor: [0, -h],
  });
}

function createUserIcon() {
  const size = 36;
  return L.divIcon({
    className: "vanta-user-icon",
    html: `<div style="position:relative;width:${size}px;height:${size}px;">
      <div style="position:absolute;inset:-4px;background:rgba(255,211,0,0.3);border-radius:50%;animation:vanta-ping 2s infinite;"></div>
      <div style="width:${size}px;height:${size}px;border:2px solid #FFD300;border-radius:50%;overflow:hidden;box-shadow:0 0 12px rgba(255,211,0,0.5);background:#3b82f6;"></div>
    </div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

/* ── Map Controller ────────────────────────────────────── */

function MapController({
  zoomAction,
  activeEventCoords,
  userLocation,
  recenterTrigger,
}: {
  zoomAction: "in" | "out" | null;
  activeEventCoords: { lat: number; lng: number } | null;
  userLocation: { lat: number; lng: number } | null;
  recenterTrigger: number;
}) {
  const map = useMap();

  useMapEvents({ moveend: () => {} });

  useEffect(() => {
    if (zoomAction === "in") map.zoomIn();
    if (zoomAction === "out") map.zoomOut();
  }, [zoomAction, map]);

  // Center on user when location obtained (1x)
  useEffect(() => {
    if (userLocation && !activeEventCoords) {
      map.flyTo([userLocation.lat, userLocation.lng], 13, { animate: true, duration: 1.2 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userLocation]);

  // Recenter button
  useEffect(() => {
    if (recenterTrigger > 0 && userLocation) {
      map.flyTo([userLocation.lat, userLocation.lng], Math.max(map.getZoom(), 13), { animate: true, duration: 0.8 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recenterTrigger]);

  // Fly to active event
  useEffect(() => {
    if (activeEventCoords) {
      map.flyTo([activeEventCoords.lat, activeEventCoords.lng], Math.max(map.getZoom(), 14), { animate: true, duration: 0.8 });
    }
  }, [activeEventCoords, map]);

  return null;
}

/* ── Exported Map Component ────────────────────────────── */

export function RadarMap({
  events,
  selectedSlug,
  onSelect,
  center,
  userLocation,
  selectedRadius,
  closestSlug,
  zoomAction,
  recenterTrigger,
}: {
  events: EventCardData[];
  selectedSlug: string | null;
  onSelect: (slug: string | null) => void;
  center: [number, number];
  userLocation: { lat: number; lng: number } | null;
  selectedRadius: number | null;
  closestSlug: string | null;
  zoomAction: "in" | "out" | null;
  recenterTrigger: number;
}) {
  const activeEvent = selectedSlug ? events.find((e) => e.slug === selectedSlug) : null;
  const activeCoords = activeEvent?.lat != null && activeEvent?.lng != null
    ? { lat: activeEvent.lat, lng: activeEvent.lng }
    : null;

  return (
    <div className="relative h-full w-full overflow-hidden rounded-2xl border border-white/10">
      <style>{`
        .vanta-event-pin, .vanta-user-icon { background: transparent !important; border: none !important; }
        .leaflet-container { background: #0F0D08 !important; font-family: var(--font-poppins), system-ui, sans-serif; }
        .leaflet-control-attribution { display: none !important; }
        .leaflet-control-zoom { display: none !important; }
        @keyframes vanta-ping { 0% { transform: scale(1); opacity: 0.8; } 80%, 100% { transform: scale(2.1); opacity: 0; } }
      `}</style>
      <MapContainer
        center={center}
        zoom={13}
        minZoom={3}
        maxZoom={19}
        scrollWheelZoom
        zoomControl={false}
        attributionControl={false}
        className="h-full w-full"
        style={{ background: "#0F0D08" }}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution="&copy; CARTO"
          maxZoom={20}
        />
        <MapController
          zoomAction={zoomAction}
          activeEventCoords={activeCoords}
          userLocation={userLocation}
          recenterTrigger={recenterTrigger}
        />

        {/* Radius circle */}
        {userLocation && selectedRadius && (
          <Circle
            center={[userLocation.lat, userLocation.lng]}
            radius={selectedRadius * 1000}
            pathOptions={{
              color: "#FFD300",
              weight: 1,
              opacity: 0.4,
              fillColor: "#FFD300",
              fillOpacity: 0.05,
              dashArray: "6 4",
            }}
          />
        )}

        {/* User location marker */}
        {userLocation && (
          <Marker
            position={[userLocation.lat, userLocation.lng]}
            icon={createUserIcon()}
            zIndexOffset={2000}
          />
        )}

        {/* Event pins */}
        {events.map((e) => {
          if (e.lat == null || e.lng == null) return null;
          const isActive = selectedSlug === e.slug;
          const isLive = e.status === "happening";
          const isClosest = closestSlug === e.slug;
          // Extract photo URL from gradient string if it's a url()
          let photoUrl: string | undefined;
          if (e.gradient.startsWith("url(")) {
            const match = e.gradient.match(/url\(([^)]+)\)/);
            if (match) photoUrl = match[1];
          }
          return (
            <Marker
              key={e.slug}
              position={[e.lat, e.lng]}
              icon={createEventIcon(photoUrl, {
                isActive,
                isLive,
                isClosest,
                isMV: e.maisVanta,
              })}
              zIndexOffset={isActive ? 1000 : isClosest ? 600 : 500}
              eventHandlers={{
                click: () => onSelect(isActive ? null : e.slug),
              }}
            />
          );
        })}
      </MapContainer>
    </div>
  );
}
