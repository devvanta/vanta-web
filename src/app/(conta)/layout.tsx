import { redirect } from "next/navigation";
import { Container } from "@/components/ui/container";
import { UserSidebar } from "@/components/site/user-sidebar";
import { createClient } from "@/lib/supabase/server";

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

  // Check profile completion gate (same as app's CompletarPerfilSocial)
  const { data: profile } = await supabase
    .from("profiles")
    .select("data_nascimento, cidade")
    .eq("id", user.id)
    .maybeSingle();

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
