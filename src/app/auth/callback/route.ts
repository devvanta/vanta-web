import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      // Check if profile needs completion (OAuth users without DOB)
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("data_nascimento")
          .eq("id", user.id)
          .maybeSingle();

        if (!profile?.data_nascimento) {
          return NextResponse.redirect(`${origin}/completar-perfil`);
        }

        // Check if onboarding is needed (no city set)
        const { data: fullProfile } = await supabase
          .from("profiles")
          .select("cidade")
          .eq("id", user.id)
          .maybeSingle();

        if (!fullProfile?.cidade) {
          return NextResponse.redirect(`${origin}/onboarding`);
        }
      }

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Auth error — redirect to login with error indicator
  return NextResponse.redirect(`${origin}/entrar?error=auth`);
}
