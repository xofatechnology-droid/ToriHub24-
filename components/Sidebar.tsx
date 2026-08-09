import type { Post, Category } from '@/lib/types';
import PostCard from '@/components/PostCard';
import AdSlot from '@/components/AdSlot';
import NewsletterInline from '@/components/NewsletterInline';
import type { SiteSettings } from '@/lib/types';

export default function Sidebar({
  trending,
  categories,
  settings,
}: {
  trending: Post[];
  categories: Category[];
  settings: SiteSettings;
}) {
  return (
    <aside className="space-y-10">
      <div>
        <h3 className="font-display font-bold text-lg border-b-2 border-ink pb-2 mb-4">
          Trending Now
        </h3>
        <div className="space-y-4">
          {trending.map((post, i) => (
            <div key={post.id} className="flex gap-3">
              <span className="font-display text-3xl font-bold text-rule leading-none">
                {String(i + 1).padStart(2, '0')}
              </span>
              <PostCard post={post} variant="compact" />
            </div>
          ))}
          {trending.length === 0 && (
            <p className="text-sm text-ink/50">No trending stories yet.</p>
          )}
        </div>
      </div>

      {settings.adsense_sidebar_slot && (
        <AdSlot slot={settings.adsense_sidebar_slot} clientId={settings.adsense_client_id} format="rectangle" />
      )}

      <NewsletterInline />

      <div>
        <h3 className="font-display font-bold text-lg border-b-2 border-ink pb-2 mb-4">
          Sections
        </h3>
        <ul className="grid grid-cols-2 gap-2 text-sm">
          {categories.map((c) => (
            <li key={c.id}>
              <a href={`/category/${c.slug}`} className="hover:text-wire transition-colors">
                {c.name}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
