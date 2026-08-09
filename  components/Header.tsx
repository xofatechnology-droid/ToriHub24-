import Link from 'next/link';
import { Search, Menu } from 'lucide-react';
import type { Category, SiteSettings } from '@/lib/types';
import MobileNav from '@/components/MobileNav';

export default function Header({
  settings,
  categories,
}: {
  settings: SiteSettings;
  categories: Category[];
}) {
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <header className="bg-paper sticky top-0 z-40 border-b border-rule">
      {/* utility bar */}
      <div className="border-b border-rule bg-ink text-paper">
        <div className="max-w-content mx-auto px-4 py-1.5 flex items-center justify-between text-[11px] font-mono tracking-wide">
          <span className="hidden sm:inline">{today}</span>
          <div className="flex items-center gap-4">
            <Link href="/admin" className="hover:text-wire transition-colors">
              Newsroom Login
            </Link>
          </div>
        </div>
      </div>

      {/* masthead */}
      <div className="max-w-content mx-auto px-4 py-6 flex items-center justify-between">
        <MobileNav categories={categories} />
        <Link href="/" className="mx-auto md:mx-0">
          <h1 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl tracking-tight text-ink text-center">
            {settings.site_name}
          </h1>
          {settings.tagline && (
            <p className="eyebrow text-center mt-1 hidden sm:block">{settings.tagline}</p>
          )}
        </Link>
        <Link
          href="/search"
          aria-label="Search"
          className="p-2 hover:text-wire transition-colors"
        >
          <Search size={20} />
        </Link>
      </div>

      {/* category nav */}
      <nav className="hidden md:block border-t border-rule">
        <div className="max-w-content mx-auto px-4">
          <ul className="flex items-center gap-6 py-3 text-sm font-semibold uppercase tracking-wide overflow-x-auto">
            {categories.map((c) => (
              <li key={c.id} className="whitespace-nowrap">
                <Link href={`/category/${c.slug}`} className="hover:text-wire transition-colors">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  );
}
