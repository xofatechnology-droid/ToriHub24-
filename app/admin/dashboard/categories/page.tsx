import { createClient } from '@/lib/supabase/server';
import CategoryManager from '@/components/admin/CategoryManager';

export default async function AdminCategoriesPage() {
  const supabase = createClient();
  const { data: categories } = await supabase.from('categories').select('*').order('name');

  return (
    <div>
      <h1 className="font-display font-bold text-2xl mb-8">Categories</h1>
      <CategoryManager initialCategories={categories ?? []} />
    </div>
  );
}
