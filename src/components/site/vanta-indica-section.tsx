"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Sparkles, Heart } from "lucide-react";
import { Container } from "@/components/ui/container";
import { createClient } from "@/lib/supabase/client";

/**
 * Vanta Indica (home do site) — descoberta social.
 *
 * Dados reais (issue #165):
 * - Logado: top 3 eventos que amigos favoritaram (via friendships + evento_favoritos)
 * - Deslogado / sem amigos: variante genérica (call-to-action social)
 *
 * RLS:
 * - friendships: só as próprias (requester/addressee = auth.uid)
 * - evento_favoritos: read permissive pra authenticated
 * - profiles: só colunas safe (nome, avatar_url) via column-grant LGPD
 * - eventos_admin: publicado=true filtro público
 */

type Indicacao = {
  eventoId: string;
  eventoNome: string;
  eventoSlug: string;
  amigos: { id: string; nome: string; avatarUrl: string | null }[];
};

export function VantaIndicaSection() {
  const [indicacoes, setIndicacoes] = useState<Indicacao[] | null>(null);
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    let cancelled = false;
    const supabase = createClient();

    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (cancelled) return;

      if (!user) {
        setLoggedIn(false);
        setIndicacoes([]);
        return;
      }

      setLoggedIn(true);

      // 1. Amizades aceitas do usuário
      const { data: friendships } = await supabase
        .from("friendships")
        .select("requester_id, addressee_id")
        .eq("status", "accepted");

      if (cancelled) return;
      if (!friendships || friendships.length === 0) {
        setIndicacoes([]);
        return;
      }

      const friendIds = friendships.map((f) =>
        f.requester_id === user.id ? f.addressee_id : f.requester_id,
      );

      // 2. Favoritos dos amigos em eventos futuros
      const { data: favs } = await supabase
        .from("evento_favoritos")
        .select("user_id, evento_id")
        .in("user_id", friendIds)
        .limit(200);

      if (cancelled || !favs || favs.length === 0) {
        setIndicacoes([]);
        return;
      }

      // 3. Agrupa por evento (top 3 eventos com mais amigos)
      const porEvento = new Map<string, Set<string>>();
      for (const f of favs) {
        if (!porEvento.has(f.evento_id)) porEvento.set(f.evento_id, new Set());
        porEvento.get(f.evento_id)!.add(f.user_id);
      }
      const topEventoIds = [...porEvento.entries()]
        .sort((a, b) => b[1].size - a[1].size)
        .slice(0, 3)
        .map(([id]) => id);

      // 4. Detalhe dos eventos (só publicados + ativos + futuros)
      const { data: eventos } = await supabase
        .from("eventos_admin")
        .select("id, nome, slug, data_fim")
        .in("id", topEventoIds)
        .eq("publicado", true)
        .eq("status_evento", "ATIVO")
        .gte("data_fim", new Date().toISOString());

      if (cancelled || !eventos || eventos.length === 0) {
        setIndicacoes([]);
        return;
      }

      const eventoMap = new Map(eventos.map((e) => [e.id, e]));

      // 5. Nomes + avatares dos amigos (só os que aparecem nos top 3)
      const uniqueFriendIds = new Set<string>();
      for (const eventoId of topEventoIds) {
        const ids = porEvento.get(eventoId);
        if (ids) ids.forEach((id) => uniqueFriendIds.add(id));
      }
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, nome, avatar_url")
        .in("id", [...uniqueFriendIds]);

      if (cancelled) return;
      const profMap = new Map((profiles ?? []).map((p) => [p.id, p]));

      const result: Indicacao[] = topEventoIds
        .map((eventoId) => {
          const evento = eventoMap.get(eventoId);
          if (!evento) return null;
          const friendIdsDoEvento = [...(porEvento.get(eventoId) ?? [])];
          const amigos = friendIdsDoEvento
            .map((id) => profMap.get(id))
            .filter((p): p is NonNullable<typeof p> => !!p)
            .map((p) => ({
              id: p.id,
              nome: p.nome ?? "Amigo",
              avatarUrl: p.avatar_url ?? null,
            }));
          return {
            eventoId: evento.id,
            eventoNome: evento.nome,
            eventoSlug: evento.slug || evento.id,
            amigos,
          };
        })
        .filter((i): i is Indicacao => i !== null);

      setIndicacoes(result);
    }

    load().catch(() => {
      if (!cancelled) setIndicacoes([]);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  // Não renderiza durante loading (evita flash). Também não renderiza se não há nada pra mostrar.
  if (indicacoes === null) return null;

  // Deslogado: variante genérica "call-to-action social"
  if (loggedIn === false) {
    return (
      <section className="py-20 md:py-28">
        <Container size="lg">
          <div className="grid md:grid-cols-[1fr_1.2fr] gap-12 items-center">
            <div>
              <span className="kicker mb-3 inline-block">vanta indica</span>
              <h2 className="text-3xl md:text-5xl leading-tight mb-5">
                Onde os seus <span className="text-gold">amigos</span> estão indo.
              </h2>
              <p className="text-text-secondary text-lg leading-relaxed mb-7">
                Veja quem está indo em cada rolê. A descoberta social mudou.
              </p>
              <Link
                href="/criar-conta"
                className="inline-flex items-center gap-2 text-sm text-gold font-semibold"
              >
                <Sparkles size={14} />
                Criar conta pra ver
              </Link>
            </div>
            <div className="rounded-2xl border border-white/5 bg-card p-8 text-center">
              <p className="text-text-muted text-sm">
                Com amigos no Vanta, essa seção mostra pra quais eventos eles
                estão indo. Cria conta + adiciona amigos.
              </p>
            </div>
          </div>
        </Container>
      </section>
    );
  }

  // Logado mas sem indicações (sem amigos ou amigos não favoritaram nada)
  if (indicacoes.length === 0) return null;

  return (
    <section className="py-20 md:py-28">
      <Container size="lg">
        <div className="grid md:grid-cols-[1fr_1.2fr] gap-12 items-center">
          <div>
            <span className="kicker mb-3 inline-block">vanta indica</span>
            <h2 className="text-3xl md:text-5xl leading-tight mb-5">
              Onde os seus <span className="text-gold">amigos</span> estão indo.
            </h2>
            <p className="text-text-secondary text-lg leading-relaxed mb-7">
              Veja quem curtiu cada rolê. A descoberta social mudou.
            </p>
            <div className="flex items-center gap-2 text-sm text-text-muted">
              <Sparkles size={14} className="text-gold" />
              <span>Top {indicacoes.length} entre os seus amigos</span>
            </div>
          </div>

          <ul className="space-y-3">
            {indicacoes.map((i) => (
              <li key={i.eventoId}>
                <Link
                  href={`/evento/${i.eventoSlug}`}
                  className="flex items-center gap-4 p-5 rounded-2xl bg-card border border-white/5 hover-real:border-white/15 transition-colors duration-200"
                >
                  {/* Stack de avatares dos amigos (até 3) */}
                  <div className="flex -space-x-2 shrink-0">
                    {i.amigos.slice(0, 3).map((a) => (
                      <div
                        key={a.id}
                        className="h-10 w-10 rounded-full border-2 border-card overflow-hidden bg-elevated"
                        title={a.nome}
                      >
                        {a.avatarUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={a.avatarUrl}
                            alt={`Avatar de ${a.nome}`}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div
                            className="h-full w-full"
                            style={{
                              background:
                                "linear-gradient(135deg, rgba(255,211,0,0.3), #080604)",
                            }}
                          />
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm leading-tight">
                      <span className="font-semibold">
                        {i.amigos.length === 1
                          ? i.amigos[0].nome.split(" ")[0]
                          : `${i.amigos.length} amigos`}
                      </span>{" "}
                      <span className="text-text-muted">
                        {i.amigos.length === 1 ? "curtiu" : "curtiram"}
                      </span>{" "}
                      <span className="font-semibold text-gold truncate">
                        {i.eventoNome}
                      </span>
                    </p>
                  </div>

                  <Heart
                    size={16}
                    className="text-gold shrink-0"
                    strokeWidth={2}
                    fill="currentColor"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
