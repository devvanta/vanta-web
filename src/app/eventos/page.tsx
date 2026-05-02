import { Suspense } from "react";
import { getPublicEvents } from "@/lib/supabase/queries";
import { EventosClient } from "./eventos-client";

// Fix #177 H1 (2026-04-21): ISR — regenera a cada 60s em background.
// Cache compartilhado entre requests, reduz TTFB e carga no Supabase.
//
// HOTFIX 2026-05-02 (Dan msg 5371): aumentado pra 3600s — ver page.tsx.
export const revalidate = 3600;

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
