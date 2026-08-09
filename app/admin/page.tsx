import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { FileText, Eye, FolderTree, Mail } from 'lucide-react';

export default async function AdminDashboard() {
  const supabase = createClient();

  const [{ count: publishedCount }, { count: draftCount }, { count: categoryCount }, { count: subscriberCount }, { data: recentPosts }] =
    await Promise.all([
      supabase.from('posts').select('*', { count: 'exact', head: true }).eq('status', 'published'),
      supabase.from('posts').select('*', { count: 'exact', head: true }).eq('status', 'draft'),
      supabase.from('categories').select('*', { count: 'exact', head: true }),
      supabase.from('newsletter_subscribers').select('*', { count: 'exact', head: true }),
      supabase.from('posts').select('id, title, slug, status, updated_at').order('updated_at', { ascending: false }).limit(6),
    ]);

  const stats = [
    { label: 'Published', value: publishedCount ?? 0, icon: FileText },
    { label: 'Drafts', value: draftCount ?? 0, icon: FileText },
    { label: 'Categories', value: categoryCount ?? 0, icon: FolderTree },
    { label: 'Subscribers', value: subscriberCount ?? 0, icon: Mail },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display font-bold text-2xl">Dashboard</h1>
        <Link href="/admin/posts/new" className="bg-wire text-paper px-4 py-2 text-sm font-semibold uppercase tracking-wide hover:bg-wiredark transition-colors">
          + New Post
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {stats.map(({ label, value, icon: Icon }) => (
          <div key={label} className="bg-paper border border-rule p-5">
            <Icon size={18} className="text-wire mb-2" />
            <p className="text-2xl font-display font-bold">{value}</p>
            <p className="text-xs font-mono uppercase text-ink/50">{label}</p>
          </div>
        ))}
      </div>

      <h2 className="font-display font-bold text-lg mb-4">Recently Updated</h2>
      <div className="bg-paper border border-rule divide-y divide-rule">
        {(recentPosts ?? []).map((post) => (
          <Link key={post.id} href={`/admin/posts/${post.id}/edit`} className="flex items-center justify-between px-5 py-3 hover:bg-paperdim transition-colors">
            <span className="font-medium">{post.title}</span>
            <span className={`text-xs font-mono uppercase px-2 py-1 ${post.status === 'published' ? 'bg-moss/20 text-moss' : 'bg-rule text-ink/60'}`}>
              {post.status}
            </span>
          </Link>
        ))}
        {(!recentPosts || recentPosts.length === 0) && (
          <p className="px-5 py-6 text-sm text-ink/50">No posts yet. Create your first story.</p>
        )}
      </div>
    </div>
  );
}
