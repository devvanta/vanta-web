import { Suspense } from "react";
import { getPublicEvents } from "@/lib/supabase/queries";
import { EventosClient } from "./eventos-client";

// Fix #177 H1 (2026-04-21): ISR — regenera a cada 60s em background.
// Cache compartilhado entre requests, reduz TTFB e carga no Supabase.
export const revalidate = 60;

// Server Component — fetches events server-side using Supabase server client.
// Bypasses browser client issues (CORS, env vars, auth cookies).
export default async function EventosPage() {
  const events = await getPublicEvents();

  return (
    <Suspense>
      <EventosClient initialEvents={events} />
    </Suspense>
  );
}
