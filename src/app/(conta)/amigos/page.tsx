"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Search, UserPlus, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

type Friend = {
  id: string;
  nome: string;
  avatar_url: string | null;
  cidade: string | null;
  instagram: string | null;
};

export default function AmigosPage() {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQ, setSearchQ] = useState("");

  useEffect(() => {
    const supabase = createClient();

    async function load() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch accepted friendships
      const { data: friendships } = await supabase
        .from("friendships")
        .select("requester_id, addressee_id")
        .or(
          `requester_id.eq.${user.id},addressee_id.eq.${user.id}`
        )
        .eq("status", "accepted");

      if (!friendships || friendships.length === 0) {
        setLoading(false);
        return;
      }

      // Get friend IDs
      const friendIds = friendships.map((f) =>
        f.requester_id === user.id ? f.addressee_id : f.requester_id
      );

      // Fetch profiles
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, nome, avatar_url, cidade, instagram")
        .in("id", friendIds);

      if (profiles) {
        setFriends(
          profiles.map((p) => ({
            id: p.id,
            nome: p.nome ?? "Usuário",
            avatar_url: p.avatar_url,
            cidade: p.cidade,
            instagram: p.instagram,
          }))
        );
      }

      setLoading(false);
    }

    load();
  }, []);

  const filtered = searchQ
    ? friends.filter((f) =>
        f.nome.toLowerCase().includes(searchQ.toLowerCase())
      )
    : friends;

  return (
    <div className="space-y-6">
      <header>
        <Link
          href="/perfil"
          className="inline-flex items-center gap-1 text-xs text-text-muted hover-real:text-text-primary transition-colors duration-200 mb-4"
        >
          <ArrowLeft size={12} />
          Voltar pro perfil
        </Link>
        <span className="kicker mb-3 inline-block">sua rede</span>
        <h1 className="text-3xl md:text-4xl leading-tight mb-3">
          Seus <span className="text-gold">amigos</span>.
        </h1>
        <p className="text-text-secondary">
          Pessoas que você conectou na VANTA.
        </p>
      </header>

      {/* Search */}
      {friends.length > 0 && (
        <div className="relative">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
          />
          <input
            value={searchQ}
            onChange={(e) => setSearchQ(e.target.value)}
            placeholder="Buscar amigo..."
            className="w-full bg-card border border-white/5 rounded-xl pl-9 pr-3 py-2.5 text-sm placeholder:text-text-subtle focus:border-gold/30 focus:outline-none transition-colors duration-200"
          />
        </div>
      )}

      {loading ? (
        <div className="text-center py-12 text-text-muted text-sm">
          Carregando...
        </div>
      ) : friends.length === 0 ? (
        <div className="rounded-2xl border border-white/5 bg-card p-12 text-center">
          <Users size={24} className="text-gold mx-auto mb-4" />
          <h3 className="text-lg mb-2">Nenhum amigo ainda</h3>
          <p className="text-text-muted text-sm">
            Conecte com outros membros pelo app pra montar sua rede.
          </p>
        </div>
      ) : (
        <ul className="rounded-2xl border border-white/5 bg-card overflow-hidden">
          {filtered.map((f, i) => (
            <li
              key={f.id}
              className={cn(
                "flex items-center gap-4 p-4",
                i > 0 && "border-t border-white/5"
              )}
            >
              {f.avatar_url ? (
                <img
                  src={f.avatar_url}
                  alt=""
                  className="h-11 w-11 rounded-full object-cover shrink-0"
                />
              ) : (
                <div
                  className="h-11 w-11 rounded-full shrink-0"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(255,211,0,0.3), #080604)",
                  }}
                />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{f.nome}</p>
                <p className="text-xs text-text-muted mt-0.5">
                  {[f.cidade, f.instagram ? `@${f.instagram}` : null]
                    .filter(Boolean)
                    .join(" · ") || "Membro VANTA"}
                </p>
              </div>
            </li>
          ))}
          {filtered.length === 0 && searchQ && (
            <li className="p-8 text-center text-sm text-text-muted">
              Nenhum amigo encontrado pra &quot;{searchQ}&quot;
            </li>
          )}
        </ul>
      )}
    </div>
  );
}
