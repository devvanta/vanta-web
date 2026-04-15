/**
 * Fábricas de objetos schema.org (JSON-LD) pra VANTA.
 * Injetar via <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(...) }} />
 */

import type { EventCardData } from "@/components/site/event-card";

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.maisvanta.com";

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE}#organization`,
    name: "VANTA",
    alternateName: "Mais Vanta",
    url: SITE,
    logo: `${SITE}/icon-512.png`,
    image: `${SITE}/icon-512.png`,
    description:
      "Plataforma brasileira de vida noturna e eventos. Descoberta, ingresso, carteira, social e clube de fidelidade MAIS VANTA num só lugar.",
    sameAs: ["https://instagram.com/maisvanta"],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: "contato@maisvanta.com",
      availableLanguage: ["Portuguese"],
    },
    areaServed: { "@type": "Country", name: "BR" },
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE}#website`,
    url: SITE,
    name: "VANTA",
    description: "Experiências exclusivas de noite premium.",
    publisher: { "@id": `${SITE}#organization` },
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE}/buscar?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
    inLanguage: "pt-BR",
  };
}

export function webApplicationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "VANTA",
    url: SITE,
    applicationCategory: "LifestyleApplication",
    operatingSystem: "Web, Android, iOS",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "BRL",
    },
    description:
      "Aplicativo e site de descoberta de eventos, compra de ingresso, carteira digital, rede social e clube de fidelidade MAIS VANTA.",
    provider: { "@id": `${SITE}#organization` },
  };
}

export function eventSchema(e: EventCardData) {
  const url = `${SITE}/evento/${e.slug}`;
  const priceBRL =
    e.priceCents !== undefined ? (e.priceCents / 100).toFixed(2) : undefined;

  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: e.name,
    description:
      e.description ??
      `${e.name} acontece no ${e.venue}, em ${e.city}. Abertura ${e.dateLabel}.`,
    startDate: e.dateISO,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    location: {
      "@type": "Place",
      name: e.venue,
      address: {
        "@type": "PostalAddress",
        streetAddress: e.address,
        addressLocality: e.city,
        addressCountry: "BR",
      },
      ...(e.lat !== undefined && e.lng !== undefined
        ? {
            geo: {
              "@type": "GeoCoordinates",
              latitude: e.lat,
              longitude: e.lng,
            },
          }
        : {}),
    },
    url,
    image: `${SITE}/og/evento/${e.slug}.png`,
    organizer: { "@id": `${SITE}#organization` },
    ...(priceBRL
      ? {
          offers: {
            "@type": "Offer",
            url,
            price: priceBRL,
            priceCurrency: "BRL",
            availability:
              e.status === "lowStock"
                ? "https://schema.org/LimitedAvailability"
                : "https://schema.org/InStock",
            validFrom: new Date().toISOString(),
          },
        }
      : {}),
  };
}

export function faqSchema(items: Array<{ q: string; a: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}

export function serviceSchema({
  name,
  description,
  serviceType,
  path,
}: {
  name: string;
  description: string;
  serviceType: string;
  path: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    serviceType,
    provider: { "@id": `${SITE}#organization` },
    areaServed: { "@type": "Country", name: "BR" },
    url: `${SITE}${path}`,
  };
}

export function breadcrumbSchema(
  items: Array<{ name: string; path: string }>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${SITE}${item.path}`,
    })),
  };
}
