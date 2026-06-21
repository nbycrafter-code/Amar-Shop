// app/theme/classic/components/Stars.tsx
'use client'
interface StarsProps {
  n: number;
}

export function Stars({ n }: StarsProps) {
  return (
    <span className="text-amber-400 text-sm">
      {"★".repeat(n)}
      <span className="text-gray-300">{"★".repeat(5 - n)}</span>
    </span>
  );
}