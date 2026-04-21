import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getOwnProfile } from "@/lib/supabase/profile";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      // Check if profile needs completion (OAuth users without DOB).
      // Usa RPC get_own_profile (bypassa REVOKE em data_nascimento).
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const profile = await getOwnProfile(supabase);

        if (!profile || !profile.data_nascimento) {
          return NextResponse.redirect(`${origin}/completar-perfil`);
        }

        if (!profile.cidade) {
          return NextResponse.redirect(`${origin}/onboarding`);
        }
      }

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Auth error — redirect to login with error indicator
  return NextResponse.redirect(`${origin}/entrar?error=auth`);
}
