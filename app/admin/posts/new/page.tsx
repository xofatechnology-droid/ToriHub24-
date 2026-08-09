import { createClient } from '@/lib/supabase/server';
import PostForm from '@/components/admin/PostForm';

export default async function NewPostPage() {
  const supabase = createClient();
  const { data: categories } = await supabase.from('categories').select('*').order('name');

  return (
    <div>
      <h1 className="font-display font-bold text-2xl mb-8">New Post</h1>
      <PostForm categories={categories ?? []} />
    </div>
  );
}
