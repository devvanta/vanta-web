import { Container } from "@/components/ui/container";
import { UserSidebar } from "@/components/site/user-sidebar";

export default function ContaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Container size="lg" className="py-10 md:py-14">
      <div className="grid md:grid-cols-[260px_1fr] gap-8 items-start">
        <UserSidebar />
        <div className="min-w-0">{children}</div>
      </div>
    </Container>
  );
}
