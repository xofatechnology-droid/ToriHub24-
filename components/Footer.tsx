import Link from 'next/link';
import { Twitter, Facebook, Instagram, Youtube } from 'lucide-react';
import type { Category, SiteSettings } from '@/lib/types';

export default function Footer({
  settings,
  categories,
}: {
  settings: SiteSettings;
  categories: Category[];
}) {
  return (
    <footer className="bg-ink text-paper mt-16">
      <div className="max-w-content mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div className="md:col-span-2">
          <h2 className="font-display text-2xl font-bold">{settings.site_name}</h2>
          <p className="text-sm text-paper/70 mt-2 max-w-sm">{settings.tagline}</p>
          <div className="flex gap-4 mt-5">
            {settings.social_twitter && (
              <a href={settings.social_twitter} target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                <Twitter size={18} />
              </a>
            )}
            {settings.social_facebook && (
              <a href={settings.social_facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <Facebook size={18} />
              </a>
            )}
            {settings.social_instagram && (
              <a href={settings.social_instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <Instagram size={18} />
              </a>
            )}
            {settings.social_youtube && (
              <a href={settings.social_youtube} target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                <Youtube size={18} />
              </a>
            )}
          </div>
        </div>

        <div>
          <h3 className="eyebrow text-paper/60 mb-3">Sections</h3>
          <ul className="space-y-2 text-sm">
            {categories.map((c) => (
              <li key={c.id}>
                <Link href={`/category/${c.slug}`} className="hover:text-wire transition-colors">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="eyebrow text-paper/60 mb-3">Newsroom</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/search" className="hover:text-wire transition-colors">Search</Link></li>
            <li><Link href="/admin" className="hover:text-wire transition-colors">Staff Login</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-paper/10">
        <div className="max-w-content mx-auto px-4 py-4 text-xs text-paper/50 flex flex-col sm:flex-row justify-between gap-2">
          <span>© {new Date().getFullYear()} {settings.site_name}. {settings.footer_text}</span>
          <span>Built on Next.js &amp; Supabase</span>
        </div>
      </div>
    </footer>
  );
}
