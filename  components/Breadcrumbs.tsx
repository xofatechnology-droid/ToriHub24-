import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export default function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-xs font-mono text-ink/50 flex items-center flex-wrap gap-1 mb-4">
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1">
          {i > 0 && <ChevronRight size={12} />}
          {item.href ? (
            <Link href={item.href} className="hover:text-wire transition-colors">{item.label}</Link>
          ) : (
            <span className="text-ink/80">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
