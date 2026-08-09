import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { formatDate } from '@/lib/utils';
import DeletePostButton from '@/components/admin/DeletePostButton';

export default async function AdminPostsPage() {
  const supabase = createClient();
  const { data: posts } = await supabase
    .from('posts')
    .select('id, title, slug, status, is_featured, is_breaking, published_at, updated_at, category:categories(name)')
    .order('updated_at', { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display font-bold text-2xl">Posts</h1>
        <Link href="/admin/posts/new" className="bg-wire text-paper px-4 py-2 text-sm font-semibold uppercase tracking-wide hover:bg-wiredark transition-colors">
          + New Post
        </Link>
      </div>

      <div className="bg-paper border border-rule overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-paperdim text-left font-mono text-xs uppercase tracking-wide text-ink/60">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Updated</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-rule">
            {(posts ?? []).map((post: any) => (
              <tr key={post.id}>
                <td className="px-4 py-3 font-medium">
                  <Link href={`/admin/posts/${post.id}/edit`} className="hover:text-wire transition-colors">
                    {post.title}
                  </Link>
                  <div className="flex gap-1 mt-1">
                    {post.is_featured && <span className="text-[10px] font-mono uppercase bg-moss/20 text-moss px-1.5 py-0.5">Featured</span>}
                    {post.is_breaking && <span className="text-[10px] font-mono uppercase bg-wire/20 text-wire px-1.5 py-0.5">Breaking</span>}
                  </div>
                </td>
                <td className="px-4 py-3 text-ink/70">{post.category?.name ?? '—'}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-mono uppercase px-2 py-1 ${post.status === 'published' ? 'bg-moss/20 text-moss' : 'bg-rule text-ink/60'}`}>
                    {post.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-ink/50 font-mono text-xs">{formatDate(post.updated_at)}</td>
                <td className="px-4 py-3 text-right">
                  <DeletePostButton id={post.id} title={post.title} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {(!posts || posts.length === 0) && (
          <p className="px-5 py-8 text-sm text-ink/50">No posts yet.</p>
        )}
      </div>
    </div>
  );
}
