import { redirect } from "next/navigation";
import { Container } from "@/components/ui/container";
import { UserSidebar } from "@/components/site/user-sidebar";
import { createClient } from "@/lib/supabase/server";
import { getOwnProfile } from "@/lib/supabase/profile";

export default async function ContaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/entrar");
  }

  // Profile completion gate (espelha CompletarPerfilSocial do app).
  // Usa RPC get_own_profile (SECURITY DEFINER) em vez de SELECT direto em
  // profiles — data_nascimento tem REVOKE SELECT pra authenticated (LGPD
  // 2026-04-20), SELECT direto retornaria 42501 e profile seria null,
  // gerando redirect infinito pro /completar-perfil.
  const profile = await getOwnProfile(supabase);

  if (!profile?.data_nascimento) {
    redirect("/completar-perfil");
  }

  if (!profile?.cidade) {
    redirect("/onboarding");
  }

  return (
    <Container size="lg" className="py-10 md:py-14">
      <div className="grid md:grid-cols-[260px_1fr] gap-8 items-start">
        <UserSidebar user={user} />
        <div className="min-w-0">{children}</div>
      </div>
    </Container>
  );
}
