/**
 * Helper pra renderizar blocos JSON-LD (schema.org) no SSR.
 * Uso:
 *   <JsonLd data={organizationSchema()} />
 *   <JsonLd data={[organizationSchema(), websiteSchema()]} />
 */
// Fix H4: escape </script> + U+2028/U+2029 pra blindar XSS se dados do banco contiverem
// sequências que escapam do <script>. Padrão adotado pela Next.js, Remix e outros.
function safeJsonLd(item: object): string {
  return JSON.stringify(item)
    .replace(/</g, "\\u003c")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}

export function JsonLd({ data }: { data: object | object[] }) {
  const payload = Array.isArray(data) ? data : [data];
  return (
    <>
      {payload.map((item, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLd(item) }}
        />
      ))}
    </>
  );
}
