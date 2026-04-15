import type { Metadata } from "next";
import { Playfair_Display, Poppins } from "next/font/google";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "900"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: "700",
  style: "normal",
  display: "swap",
});

export const metadata: Metadata = {
  title: "VANTA — a noite começa aqui",
  description: "Experiências exclusivas de noite premium.",
  metadataBase: new URL("https://maisvanta.com"),
  openGraph: {
    title: "VANTA",
    description: "Experiências exclusivas de noite premium.",
    type: "website",
    url: "https://maisvanta.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="pt-BR"
      className={`${poppins.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-void text-text-primary">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
