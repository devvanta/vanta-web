/**
 * Helper unificado pra leitura do próprio profile.
 *
 * Motivação: a tabela `profiles` tem column-grants restritivos em colunas
 * sensíveis (cpf, email, data_nascimento, telefone_*, role, privacidade, ...).
 * SELECT direto nessas colunas via client authenticated retorna 42501 (o
 * column-grant aborta o statement inteiro mesmo que outras colunas sejam
 * safe). Isso quebrava silenciosamente queries como
 *   `supabase.from('profiles').select('data_nascimento, cidade')`.
 *
 * Solução: usar a RPC `get_own_profile()` (SECURITY DEFINER) que bypassa
 * column-grants retornando todas as colunas do próprio user autenticado.
 * Se a RPC falhar por rede, tentar novamente (retry 3x com backoff).
 *
 * Este helper aceita tanto server clients (createClient de "./server") quanto
 * client-side clients (de "./client") — API idêntica em ambos.
 */

import type { SupabaseClient } from "@supabase/supabase-js";

export interface OwnProfile {
  id: string;
  nome: string | null;
  email: string | null;
  instagram: string | null;
  instagram_followers: number | null;
  data_nascimento: string | null;
  telefone_ddd: string | null;
  telefone_numero: string | null;
  estado: string | null;
  cidade: string | null;
  genero: string | null;
  biografia: string | null;
  avatar_url: string | null;
  cpf: string | null;
  interesses: string[] | null;
  album_urls: string[] | null;
  privacidade: Record<string, boolean> | null;
  role: string | null;
  username: string | null;
}

/**
 * Busca o próprio profile via RPC get_own_profile (bypassa column-grants).
 * Retorna null se user não autenticado, profile não existe, ou todas as
 * tentativas falharem.
 *
 * Retry apenas em erro de rede/runtime — NÃO em "zero rows" (que significa
 * profile realmente não existe, como OAuth signup pendente).
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getOwnProfile(supabase: SupabaseClient<any, "public", any>): Promise<OwnProfile | null> {
  for (let attempt = 0; attempt < 3; attempt++) {
    const { data, error } = await supabase.rpc("get_own_profile");
    if (error) {
      console.warn(`[profile] get_own_profile attempt ${attempt + 1}/3 failed:`, error.message);
      if (attempt < 2) await new Promise((r) => setTimeout(r, 300 * (attempt + 1)));
      continue;
    }
    const row = Array.isArray(data) ? data[0] : data;
    if (row) return row as OwnProfile;
    // No error but no row = profile doesn't exist (OAuth signup pendente).
    // Retry não ajuda — retorna null pro caller tratar.
    break;
  }
  return null;
}
