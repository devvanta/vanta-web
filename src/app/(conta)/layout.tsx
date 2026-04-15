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

  return (
    <Container size="lg" className="py-10 md:py-14">
      <div className="grid md:grid-cols-[260px_1fr] gap-8 items-start">
        <UserSidebar user={user} />
        <div className="min-w-0">{children}</div>
      </div>
    </Container>
  );
}
