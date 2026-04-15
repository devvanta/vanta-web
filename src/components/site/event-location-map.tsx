"use client";

import dynamic from "next/dynamic";
import { MapPin } from "lucide-react";

const MapInner = dynamic(() => import("./event-location-map-inner"), {
  ssr: false,
  loading: () => (
    <div className="aspect-[16/9] bg-card flex items-center justify-center">
      <MapPin size={24} className="text-gold animate-pulse" />
    </div>
  ),
});

export function EventLocationMap({
  lat,
  lng,
  venue,
}: {
  lat: number;
  lng: number;
  venue: string;
}) {
  return <MapInner lat={lat} lng={lng} venue={venue} />;
}
