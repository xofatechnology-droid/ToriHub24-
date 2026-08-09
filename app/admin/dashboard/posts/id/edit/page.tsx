import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import PostForm from '@/components/admin/PostForm';

export default async function EditPostPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const [{ data: post }, { data: categories }] = await Promise.all([
    supabase
      .from('posts')
      .select('*, tags:post_tags(tag:tags(*))')
      .eq('id', params.id)
      .single(),
    supabase.from('categories').select('*').order('name'),
  ]);

  if (!post) notFound();
  const flattened = { ...post, tags: (post.tags ?? []).map((t: any) => t.tag) };

  return (
    <div>
      <h1 className="font-display font-bold text-2xl mb-8">Edit Post</h1>
      <PostForm post={flattened} categories={categories ?? []} />
    </div>
  );
}
