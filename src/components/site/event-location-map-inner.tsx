"use client";

import { MapContainer, Marker, TileLayer } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const PIN_SRC = "/pin-gold.png";

function createPinIcon() {
  const w = 50;
  const h = Math.round(w / 0.695);
  return L.divIcon({
    className: "vanta-event-pin",
    html: `<div style="position:relative;width:${w}px;height:${h}px;filter:drop-shadow(0 0 8px rgba(255,211,0,0.5)) drop-shadow(0 2px 6px rgba(0,0,0,0.4));">
      <img src="${PIN_SRC}" style="width:${w}px;height:${h}px;" />
    </div>`,
    iconSize: [w, h],
    iconAnchor: [w / 2, h],
  });
}

export default function EventLocationMapInner({
  lat,
  lng,
}: {
  lat: number;
  lng: number;
  venue: string;
}) {
  return (
    <div className="relative aspect-[16/9] overflow-hidden">
      <style>{`
        .vanta-event-pin { background: transparent !important; border: none !important; }
        .leaflet-container { background: #0F0D08 !important; }
        .leaflet-control-attribution { display: none !important; }
        .leaflet-control-zoom { display: none !important; }
      `}</style>
      <MapContainer
        center={[lat, lng]}
        zoom={15}
        scrollWheelZoom={false}
        dragging={false}
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
        <Marker position={[lat, lng]} icon={createPinIcon()} />
      </MapContainer>
    </div>
  );
}
