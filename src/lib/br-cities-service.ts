/**
 * Serviço de cidades brasileiras — fonte única bundled.
 *
 * Lista completa: 5571 cidades (snapshot IBGE 2026-04-21).
 * Lazy dynamic import — só carrega quando necessário (onboarding/edit).
 *
 * Substitui o fetch direto de `https://servicodados.ibge.gov.br/api/v1/localidades/municipios`
 * que sem timeout podia travar e sem fallback deixava o user sem opção.
 */

export interface Cidade {
  nome: string;
  uf: string;
}

let _cache: Cidade[] | null = null;
let _loading: Promise<Cidade[]> | null = null;

/** Carrega lista completa (cacheada após 1ª chamada). */
export async function getAllBrazilCities(): Promise<Cidade[]> {
  if (_cache) return _cache;
  if (_loading) return _loading;
  _loading = import("./br-cities.json").then((mod) => {
    const raw = (mod.default ?? mod) as unknown as [string, string][];
    _cache = raw.map(([nome, uf]) => ({ nome, uf }));
    _loading = null;
    return _cache;
  });
  return _loading;
}

/**
 * Busca cidades com ranking (exato > prefix > contém). Top `limit` resultados.
 */
export async function searchCities(query: string, limit = 10): Promise<Cidade[]> {
  if (query.length < 2) return [];
  const cities = await getAllBrazilCities();
  const lower = query.toLowerCase().trim();
  const scored: { c: Cidade; score: number }[] = [];
  for (const c of cities) {
    const nomeLower = c.nome.toLowerCase();
    const fullLower = `${c.nome} - ${c.uf}`.toLowerCase();
    let score: number | null = null;
    if (nomeLower === lower) score = 0;
    else if (nomeLower.startsWith(lower)) score = 1;
    else if (fullLower.includes(lower)) score = 2;
    if (score === null) continue;
    scored.push({ c, score });
  }
  scored.sort((a, b) => {
    if (a.score !== b.score) return a.score - b.score;
    return a.c.nome.localeCompare(b.c.nome, "pt");
  });
  return scored.slice(0, limit).map((s) => s.c);
}
