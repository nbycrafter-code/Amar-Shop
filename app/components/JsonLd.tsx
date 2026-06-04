// components/JsonLd.tsx
'use client';

interface JsonLdProps {
  data: object | object[] | null;
}

export function JsonLd({ data }: JsonLdProps) {
  if (!data) return null;
  
  const schemas = Array.isArray(data) ? data : [data];
  
  return (
    <>
      {schemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema, null, 2) }}
        />
      ))}
    </>
  );
}