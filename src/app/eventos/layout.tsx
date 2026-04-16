import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Eventos — VANTA",
  description:
    "Descubra os melhores eventos e festas perto de você. Filtre por cidade, gênero, data e preço.",
  openGraph: {
    title: "Eventos — VANTA",
    description:
      "Descubra os melhores eventos e festas perto de você.",
  },
};

export default function EventosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
