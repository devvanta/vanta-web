import { Suspense } from "react";
import { getPublicEvents } from "@/lib/supabase/queries";
import { EventosClient } from "./eventos-client";

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
