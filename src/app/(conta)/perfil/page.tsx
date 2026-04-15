"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  AtSign,
  Calendar,
  Check,
  Crown,
  Edit2,
  Eye,
  EyeOff,
  Heart,
  Lock,
  MapPin,
  Share2,
  Sparkles,
  Ticket,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

const defaultPrivacyFields = [
  { key: "nome", label: "Nome", public: true },
  { key: "instagram", label: "Instagram", public: true },
  { key: "cidade", label: "Cidade", public: true },
  { key: "idade", label: "Idade", public: false },
  { key: "telefone", label: "Telefone", public: false },
  { key: "email", label: "E-mail", public: false },
];

type Profile = {
  nome: string | null;
  instagram: string | null;
  cidade: string | null;
  avatar_url: string | null;
  created_at: string | null;
  privacy_settings: Record<string, boolean> | null;
};

export default function PerfilPage() {
  const [fields, setFields] = useState(defaultPrivacyFields);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [stats, setStats] = useState([
    { label: "Eventos", value: "—" },
    { label: "Amigos", value: "—" },
    { label: "Cortesias", value: "—" },
    { label: "Indicações", value: "—" },
  ]);

  const indications = [
    { who: "Ana Souza", venue: "Sunset Privilege", when: "há 2 dias", accepted: true },
    { who: "Matheus Lopes", venue: "Techno Underground", when: "há 1 semana", accepted: false },
  ];

  useEffect(() => {
    const supabase = createClient();

    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: prof } = await supabase
        .from("profiles")
        .select("nome, instagram, cidade, avatar_url, created_at, privacy_settings")
        .eq("id", user.id)
        .maybeSingle();

      if (prof) {
        setProfile(prof as Profile);
        const ps = (prof.privacy_settings || {}) as Record<string, boolean>;
        setFields(defaultPrivacyFields.map(f => ({
          ...f,
          public: ps[f.key] !== undefined ? ps[f.key] : f.public,
        })));
      }

      // Fetch stats
      const [ticketsRes, friendsRes] = await Promise.all([
        supabase.from("ingressos").select("id", { count: "exact", head: true }).eq("user_id", user.id),
        supabase.from("friendships").select("id", { count: "exact", head: true })
          .or(`user_id.eq.${user.id},friend_id.eq.${user.id}`)
          .eq("status", "accepted"),
      ]);

      setStats([
        { label: "Eventos", value: String(ticketsRes.count ?? 0) },
        { label: "Amigos", value: String(friendsRes.count ?? 0) },
        { label: "Cortesias", value: "—" },
        { label: "Indicações", value: "—" },
      ]);
    }

    loadProfile();
  }, []);

  async function togglePrivacy(key: string) {
    const updated = fields.map((f) =>
      f.key === key ? { ...f, public: !f.public } : f
    );
    setFields(updated);

    // Persist to Supabase
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const privacyObj: Record<string, boolean> = {};
    for (const f of updated) {
      privacyObj[f.key] = f.public;
    }

    await supabase
      .from("profiles")
      .update({ privacy_settings: privacyObj })
      .eq("id", user.id);
  }

  return (
    <div className="space-y-8">
      {/* Header card */}
      <section className="rounded-3xl border border-white/5 bg-card overflow-hidden">
        <div
          className="h-32 relative"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(255,211,0,0.25), transparent 70%), linear-gradient(160deg, #2a1d0a, #080604)",
          }}
        />
        <div className="p-6 -mt-12 relative">
          <div className="flex items-end justify-between gap-4 mb-6">
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt="" className="h-24 w-24 rounded-2xl border-4 border-card object-cover" />
            ) : (
              <div
                className="h-24 w-24 rounded-2xl border-4 border-card"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(255,211,0,0.4), #080604)",
                }}
              />
            )}
            <div className="flex gap-2">
              <button className="h-9 px-4 rounded-xl border border-white/10 bg-elevated text-sm text-text-secondary hover-real:text-text-primary hover-real:border-white/20 transition-colors duration-200 cursor-pointer flex items-center gap-2">
                <Edit2 size={12} />
                Editar
              </button>
              <button className="h-9 w-9 rounded-xl border border-white/10 bg-elevated flex items-center justify-center text-text-secondary hover-real:text-text-primary hover-real:border-white/20 transition-colors duration-200 cursor-pointer">
                <Share2 size={12} />
              </button>
            </div>
          </div>

          <div className="mb-4">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl md:text-3xl leading-tight">{profile?.nome || "Você"}</h1>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[0.6rem] font-semibold uppercase tracking-[0.18em] bg-gold text-black">
                <Crown size={10} strokeWidth={2.5} />
                Mais Vanta
              </span>
            </div>
            <div className="flex items-center gap-3 text-sm text-text-muted flex-wrap">
              {profile?.instagram && (
                <span className="flex items-center gap-1.5">
                  <AtSign size={12} />
                  @{profile.instagram}
                </span>
              )}
              {profile?.cidade && (
                <span className="flex items-center gap-1.5">
                  <MapPin size={12} />
                  {profile.cidade}
                </span>
              )}
              {profile?.created_at && (
                <span className="flex items-center gap-1.5">
                  <Calendar size={12} />
                  No VANTA desde {new Date(profile.created_at).toLocaleDateString("pt-BR", { month: "short", year: "numeric" })}
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-4 gap-3 pt-5 border-t border-white/5">
            {stats.map((s) => (
              <div key={s.label}>
                <p className="text-2xl leading-none mb-1">{s.value}</p>
                <p className="kicker text-[0.55rem]">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Privacidade por campo */}
      <section className="rounded-2xl border border-white/5 bg-card p-6">
        <div className="flex items-center gap-2 mb-5">
          <Lock size={14} className="text-gold" />
          <h2 className="text-lg">Privacidade por campo</h2>
        </div>
        <p className="text-sm text-text-muted mb-5">
          Escolha o que aparece pros outros membros. Os campos privados só você
          vê.
        </p>
        <ul className="divide-y divide-white/5">
          {fields.map((f) => (
            <li
              key={f.key}
              className="flex items-center justify-between gap-4 py-3"
            >
              <span className="text-sm">{f.label}</span>
              <button
                onClick={() => togglePrivacy(f.key)}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer transition-colors duration-200",
                  f.public
                    ? "bg-success/15 border border-success/40 text-success"
                    : "bg-elevated border border-white/10 text-text-muted",
                )}
              >
                {f.public ? (
                  <>
                    <Eye size={12} />
                    Público
                  </>
                ) : (
                  <>
                    <EyeOff size={12} />
                    Privado
                  </>
                )}
              </button>
            </li>
          ))}
        </ul>
      </section>

      {/* Mais Vanta status */}
      <section className="rounded-2xl border border-gold/20 bg-gradient-to-br from-card to-midnight p-6 glow-gold">
        <div className="flex items-start gap-4">
          <div className="h-11 w-11 rounded-xl bg-gold/15 border border-gold/40 flex items-center justify-center text-gold shrink-0">
            <Crown size={18} strokeWidth={2.5} />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
              <h2 className="text-lg">Você é Mais Vanta</h2>
              <span className="kicker">ativo</span>
            </div>
            <p className="text-sm text-text-muted leading-relaxed mb-5">
              Seus benefícios estão ativos em todas as casas parceiras. Você
              tem 6 cortesias disponíveis esta semana e prioridade em novos
              lotes.
            </p>
            <Link
              href="/mais-vanta"
              className="inline-flex items-center gap-1 text-sm text-gold hover-real:underline"
            >
              Ver meus benefícios
              <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      </section>

      {/* Indicações */}
      <section className="rounded-2xl border border-white/5 bg-card p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Sparkles size={14} className="text-gold" />
            <h2 className="text-lg">Vanta Indica</h2>
          </div>
          <Link
            href="/amigos"
            className="text-xs text-text-muted hover-real:text-gold transition-colors duration-200"
          >
            Ver todos
          </Link>
        </div>
        <ul className="space-y-3">
          {indications.map((ind) => (
            <li
              key={`${ind.who}-${ind.venue}`}
              className="flex items-start gap-3 p-3 rounded-xl bg-elevated/50 border border-white/5"
            >
              <div
                className="h-10 w-10 rounded-full shrink-0 border border-white/10"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(255,211,0,0.25), #080604)",
                }}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm">
                  <span className="font-semibold">{ind.who}</span>{" "}
                  <span className="text-text-muted">te indicou</span>{" "}
                  <span className="font-semibold text-gold">{ind.venue}</span>
                </p>
                <p className="text-xs text-text-muted mt-0.5">{ind.when}</p>
              </div>
              {ind.accepted ? (
                <span className="inline-flex items-center gap-1 text-xs text-success shrink-0">
                  <Check size={12} />
                  Aceita
                </span>
              ) : (
                <button className="text-xs text-gold hover-real:underline shrink-0">
                  Aceitar
                </button>
              )}
            </li>
          ))}
        </ul>
      </section>

      {/* Atalhos */}
      <section className="grid sm:grid-cols-3 gap-3">
        <Link
          href="/carteira"
          className="p-5 rounded-2xl bg-card border border-white/5 hover-real:border-gold/30 transition-colors duration-200"
        >
          <Ticket size={16} className="text-gold mb-3" />
          <p className="text-sm font-semibold mb-1">Minha carteira</p>
          <p className="text-xs text-text-muted">{stats[0].value} ingressos</p>
        </Link>
        <Link
          href="/amigos"
          className="p-5 rounded-2xl bg-card border border-white/5 hover-real:border-gold/30 transition-colors duration-200"
        >
          <Users size={16} className="text-gold mb-3" />
          <p className="text-sm font-semibold mb-1">Amigos</p>
          <p className="text-xs text-text-muted">{stats[1].value} na sua rede</p>
        </Link>
        <Link
          href="/favoritos"
          className="p-5 rounded-2xl bg-card border border-white/5 hover-real:border-gold/30 transition-colors duration-200"
        >
          <Heart size={16} className="text-gold mb-3" />
          <p className="text-sm font-semibold mb-1">Favoritos</p>
          <p className="text-xs text-text-muted">8 eventos salvos</p>
        </Link>
      </section>
    </div>
  );
}
