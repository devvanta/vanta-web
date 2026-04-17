"use client";

import { useCallback, useEffect, useState } from "react";
import {
  ArrowRight,
  Check,
  Crown,
  MapPin,
  Music,
  Search,
  Sparkles,
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/site/logo";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

const INTERESTS = [
  "Funk",
  "Sertanejo",
  "Eletrônica",
  "Pop",
  "Rock",
  "Pagode",
  "Forró",
  "Hip Hop / Rap",
  "Reggaeton",
  "MPB",
  "Jazz",
  "R&B",
  "Trap",
  "Techno",
  "House",
  "Indie",
  "Axé",
  "Brega Funk",
  "Outro",
];

type Step = "cidade" | "interesses" | "maisvanta" | "welcome";

type CityResult = { nome: string; uf: string };

export default function OnboardingPage() {
  const [step, setStep] = useState<Step>("cidade");
  const [userName, setUserName] = useState("");

  // City state
  const [cityQuery, setCityQuery] = useState("");
  const [cities, setCities] = useState<CityResult[]>([]);
  const [selectedCity, setSelectedCity] = useState<CityResult | null>(null);
  const [cityLoading, setCityLoading] = useState(false);

  // Interests state
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  const [saving, setSaving] = useState(false);

  // Load user name
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        const nome =
          (user.user_metadata?.nome as string) ||
          user.email?.split("@")[0] ||
          "";
        setUserName(nome.split(" ")[0]);
      }
    });
  }, []);

  const [cityError, setCityError] = useState<string | null>(null);

  // City search with debounce
  useEffect(() => {
    if (cityQuery.length < 2) {
      setCities([]);
      setCityError(null);
      return;
    }

    const timer = setTimeout(async () => {
      setCityLoading(true);
      setCityError(null);
      try {
        const res = await fetch(
          `https://servicodados.ibge.gov.br/api/v1/localidades/municipios?nome=${encodeURIComponent(cityQuery)}&orderBy=nome`
        );
        if (!res.ok) throw new Error("IBGE API error");
        const data: { nome: string; microrregiao?: { mesorregiao?: { UF?: { sigla?: string } } } }[] = await res.json();
        setCities(
          data.slice(0, 10).map((c) => ({
            nome: c.nome,
            uf: c.microrregiao?.mesorregiao?.UF?.sigla ?? "",
          }))
        );
      } catch {
        setCities([]);
        setCityError("Erro ao buscar cidades. Tente novamente.");
      }
      setCityLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [cityQuery]);

  const saveCity = useCallback(async (city: CityResult) => {
    setSaving(true);
    setCityError(null);
    const supabase = createClient();
    const { error } = await supabase.rpc("user_profile_update", {
      p_fields: {
        cidade: city.nome,
        estado: city.uf,
        updated_at: new Date().toISOString(),
      },
    });
    setSaving(false);
    if (error) {
      setCityError("Erro ao salvar cidade. Tente novamente.");
      return;
    }
    setStep("interesses");
  }, []);

  const saveInterests = useCallback(async () => {
    if (selectedInterests.length > 0) {
      setSaving(true);
      const supabase = createClient();
      const { error } = await supabase.rpc("user_profile_update", {
        p_fields: {
          interesses: selectedInterests,
          updated_at: new Date().toISOString(),
        },
      });
      setSaving(false);
      if (error) {
        // Non-blocking: interests are optional, proceed anyway
        console.error("Failed to save interests:", error);
      }
    }
    setStep("maisvanta");
  }, [selectedInterests]);

  const finish = useCallback(() => {
    // UX preference only — controls onboarding screen visibility, not access to features.
    // If city was somehow skipped, the (conta) layout server-side guard will redirect back.
    localStorage.setItem("vanta_onboarding_done", "1");
    window.location.href = "/";
  }, []);

  return (
    <Container size="sm" className="py-16 md:py-24">
      <div className="max-w-lg mx-auto">
        <div className="flex justify-center mb-10">
          <Logo />
        </div>

        {/* Progress */}
        <div className="flex items-center gap-2 mb-10 justify-center">
          {(["cidade", "interesses", "maisvanta", "welcome"] as Step[]).map(
            (s, i) => (
              <div
                key={s}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-300",
                  s === step
                    ? "w-8 bg-gold"
                    : i <
                      ["cidade", "interesses", "maisvanta", "welcome"].indexOf(
                        step
                      )
                    ? "w-6 bg-gold/40"
                    : "w-6 bg-white/10"
                )}
              />
            )
          )}
        </div>

        {/* Step 1: Cidade */}
        {step === "cidade" && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-2xl bg-gold/10 border border-gold/30 text-gold mb-5">
                <MapPin size={20} />
              </div>
              <h2 className="text-3xl leading-tight mb-3">
                Onde você <span className="text-gold">curte</span>?
              </h2>
              <p className="text-text-secondary text-sm">
                Pra mostrar os eventos certos perto de você.
              </p>
            </div>

            <div className="relative">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
              />
              <input
                value={cityQuery}
                onChange={(e) => {
                  setCityQuery(e.target.value);
                  setSelectedCity(null);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && cities.length > 0 && !selectedCity) {
                    e.preventDefault();
                    const c = cities[0];
                    setSelectedCity(c);
                    setCityQuery(`${c.nome} — ${c.uf}`);
                    setCities([]);
                  }
                }}
                placeholder="Digite sua cidade..."
                autoFocus
                className="w-full bg-card border border-white/10 rounded-xl pl-9 pr-3 py-3 text-sm focus:border-gold/40 focus:outline-none transition-colors duration-200"
              />
            </div>

            {cityLoading && (
              <p className="text-xs text-text-muted text-center">
                Buscando...
              </p>
            )}

            {cityError && (
              <p className="text-xs text-error text-center">
                {cityError}
              </p>
            )}

            {cities.length > 0 && !selectedCity && (
              <ul className="rounded-xl border border-white/5 bg-card overflow-hidden">
                {cities.map((c) => (
                  <li key={`${c.nome}-${c.uf}`}>
                    <button
                      onClick={() => {
                        setSelectedCity(c);
                        setCityQuery(`${c.nome} — ${c.uf}`);
                        setCities([]);
                      }}
                      className="w-full text-left px-4 py-3 text-sm hover-real:bg-elevated/50 transition-colors duration-200 cursor-pointer flex items-center justify-between border-b border-white/5 last:border-0"
                    >
                      <span>{c.nome}</span>
                      <span className="text-xs text-text-muted">{c.uf}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {selectedCity && (
              <Button
                onClick={() => saveCity(selectedCity)}
                className="w-full"
                size="lg"
                disabled={saving}
              >
                {saving ? "Salvando..." : "Continuar"}
                <ArrowRight size={16} />
              </Button>
            )}
          </div>
        )}

        {/* Step 2: Interesses */}
        {step === "interesses" && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-2xl bg-gold/10 border border-gold/30 text-gold mb-5">
                <Music size={20} />
              </div>
              <h2 className="text-3xl leading-tight mb-3">
                O que você <span className="text-gold">curte</span>?
              </h2>
              <p className="text-text-secondary text-sm">
                Selecione seus gêneros favoritos. Pode pular.
              </p>
            </div>

            <div className="flex flex-wrap gap-2 justify-center">
              {INTERESTS.map((g) => {
                const selected = selectedInterests.includes(g);
                return (
                  <button
                    key={g}
                    onClick={() =>
                      setSelectedInterests((prev) =>
                        selected
                          ? prev.filter((x) => x !== g)
                          : [...prev, g]
                      )
                    }
                    className={cn(
                      "px-4 py-2 rounded-full text-sm cursor-pointer transition-all duration-200",
                      selected
                        ? "bg-gold text-black font-semibold"
                        : "bg-card border border-white/10 text-text-secondary hover-real:border-gold/40"
                    )}
                  >
                    {g}
                  </button>
                );
              })}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep("maisvanta")}
                className="flex-1 h-12 rounded-xl border border-white/10 bg-elevated text-sm text-text-secondary hover-real:text-text-primary hover-real:border-white/20 transition-colors duration-200 cursor-pointer"
              >
                Pular
              </button>
              <Button
                onClick={saveInterests}
                className="flex-1"
                size="lg"
                disabled={saving || selectedInterests.length === 0}
              >
                {saving ? "Salvando..." : "Continuar"}
                <ArrowRight size={16} />
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Mais VANTA teaser */}
        {step === "maisvanta" && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-2xl bg-gold/15 border border-gold/40 text-gold mb-5">
                <Crown size={20} strokeWidth={2.5} />
              </div>
              <h2 className="text-3xl leading-tight mb-3">
                Conheça o{" "}
                <span className="text-gold">Mais VANTA</span>.
              </h2>
              <p className="text-text-secondary text-sm mb-8">
                O clube de quem sai com frequência.
              </p>
            </div>

            <div className="grid gap-3">
              {[
                "Acesso a listas VIP",
                "Descontos em ingressos",
                "Experiências exclusivas",
                "Tratamento diferenciado",
              ].map((perk) => (
                <div
                  key={perk}
                  className="flex items-center gap-3 p-4 rounded-xl bg-card border border-white/5"
                >
                  <div className="h-8 w-8 rounded-lg bg-gold/10 border border-gold/30 flex items-center justify-center text-gold shrink-0">
                    <Sparkles size={14} />
                  </div>
                  <p className="text-sm">{perk}</p>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep("welcome")}
                className="flex-1 h-12 rounded-xl border border-white/10 bg-elevated text-sm text-text-secondary hover-real:text-text-primary hover-real:border-white/20 transition-colors duration-200 cursor-pointer"
              >
                Agora não
              </button>
              <Button
                onClick={async () => {
                  const supabase = createClient();
                  await supabase.rpc("user_profile_update", {
                    p_fields: {
                      mais_vanta_interesse: true,
                      updated_at: new Date().toISOString(),
                    },
                  });
                  setStep("welcome");
                }}
                className="flex-1"
                size="lg"
              >
                Quero conhecer
                <ArrowRight size={16} />
              </Button>
            </div>
          </div>
        )}

        {/* Step 4: Welcome */}
        {step === "welcome" && (
          <div className="text-center space-y-8">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-gold/15 border border-gold/40 text-gold mb-2">
              <Check size={28} strokeWidth={2.5} />
            </div>
            <div>
              <h2 className="text-4xl leading-tight mb-4">
                Pronto, {userName || "você"}.
              </h2>
              <p className="text-text-secondary text-lg">
                Sua noite começa aqui.
              </p>
            </div>
            <Button onClick={finish} size="lg">
              Explorar
              <ArrowRight size={16} />
            </Button>
          </div>
        )}
      </div>
    </Container>
  );
}
